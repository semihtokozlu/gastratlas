"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth/guards";
import { recipeInputSchema, setHeroImageSchema } from "./schemas";
import { fetchAndUploadImage } from "@/lib/storage/upload";
import type { ActionResult } from "@/features/recipes/schemas";
import type { ContentStatus, Unit } from "@prisma/client";

/**
 * Editoryal statü makinesi (planlama §1.6/§9): DRAFT/AI_REVIEW/EDITOR_REVIEW/
 * ARCHIVED → EDITOR+; yalnızca PUBLISHED'e geçiş HISTORIAN/ADMIN gerektirir
 * (bkz. RLS "Recipe_editor_update" — burada aynı kural application katmanında
 * ikinci kez uygulanır, §9 "çift katman savunma").
 */
const setStatusSchema = z.object({
  recipeId: z.string().cuid(),
  status: z.enum(["DRAFT", "AI_REVIEW", "EDITOR_REVIEW", "PUBLISHED", "ARCHIVED"]),
});

function authErrorResult(e: AuthError): ActionResult<never> {
  return {
    ok: false,
    error: {
      code: e.code,
      message: e.code === "UNAUTHENTICATED" ? "Giriş yapmalısınız" : "Bu işlem için yetkiniz yok",
    },
  };
}

export async function setRecipeStatus(input: unknown): Promise<ActionResult<{ status: ContentStatus }>> {
  const parsed = setStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }
  const { recipeId, status } = parsed.data;
  const minRole = status === "PUBLISHED" ? "HISTORIAN" : "EDITOR";

  let user;
  try {
    user = await requireRole(minRole);
  } catch (e) {
    if (e instanceof AuthError) return authErrorResult(e);
    throw e;
  }

  const before = await db.recipe.findUnique({ where: { id: recipeId }, select: { status: true, publishedAt: true } });
  if (!before) return { ok: false, error: { code: "NOT_FOUND", message: "Tarif bulunamadı" } };

  const recipe = await db.recipe.update({
    where: { id: recipeId },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? (before.publishedAt ?? new Date()) : before.publishedAt,
    },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      entityType: "Recipe",
      entityId: recipeId,
      action: status === "PUBLISHED" ? "PUBLISH" : status === "ARCHIVED" ? "ARCHIVE" : "UPDATE",
      before: { status: before.status },
      after: { status: recipe.status },
    },
  });

  return { ok: true, data: { status: recipe.status } };
}

const publishSchema = z.object({
  recipeId: z.string().cuid(),
  scheduledAt: z.string().datetime().optional(),
});

/**
 * scheduledAt geçmişte/boşsa hemen yayınlar. Gelecekteki bir scheduledAt
 * yalnızca alanı kaydeder — bunu gerçek zamanda PUBLISHED'e çevirecek bir
 * zamanlanmış görev (Vercel Cron/pg_cron) HENÜZ KURULMADI; bu, bilinen ve
 * raporlanan bir sınırlamadır, sahte bir otomasyon iddia edilmez.
 */
export async function publishRecipe(
  input: unknown
): Promise<ActionResult<{ status: ContentStatus; scheduled: boolean }>> {
  const parsed = publishSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }
  const { recipeId, scheduledAt } = parsed.data;

  let user;
  try {
    user = await requireRole("HISTORIAN");
  } catch (e) {
    if (e instanceof AuthError) return authErrorResult(e);
    throw e;
  }

  const before = await db.recipe.findUnique({ where: { id: recipeId }, select: { status: true } });
  if (!before) return { ok: false, error: { code: "NOT_FOUND", message: "Tarif bulunamadı" } };

  const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
  const isFutureSchedule = scheduledDate !== null && scheduledDate.getTime() > Date.now();

  const recipe = await db.recipe.update({
    where: { id: recipeId },
    data: isFutureSchedule
      ? { scheduledAt: scheduledDate }
      : { status: "PUBLISHED", publishedAt: new Date(), scheduledAt: null },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      entityType: "Recipe",
      entityId: recipeId,
      action: "PUBLISH",
      before: { status: before.status },
      after: { status: recipe.status, scheduledAt: recipe.scheduledAt },
    },
  });

  return { ok: true, data: { status: recipe.status, scheduled: isFutureSchedule } };
}

/**
 * Planlama §8.1 "admin.upsertRecipe" (geniş RecipeInput şeması) — EDITOR+.
 * Yeni tarifler her zaman DRAFT olarak oluşturulur (AI/editör hiçbir zaman
 * doğrudan yayına basmaz — §2.4); yayınlama yalnızca publishRecipe/
 * setRecipeStatus üzerinden HISTORIAN+ ile mümkündür.
 *
 * Düzenlemede ingredients/steps/translations tamamen silinip yeniden
 * oluşturulur — form, mevcut alt satırların kimliğini takip etmiyor, bu
 * yüzden "tam değiştir" en basit doğru yaklaşımdır (transaction içinde).
 */
export async function upsertRecipe(input: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = recipeInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: { code: "VALIDATION", message: "Geçersiz girdi", fields: parsed.error.flatten().fieldErrors as Record<string, string> },
    };
  }

  let user;
  try {
    user = await requireRole("EDITOR");
  } catch (e) {
    if (e instanceof AuthError) return authErrorResult(e);
    throw e;
  }

  const data = parsed.data;

  const scalarData = {
    slug: data.slug,
    cuisineId: data.cuisineId,
    countryId: data.countryId,
    cityId: data.cityId ?? null,
    eraId: data.eraId ?? null,
    civilizationId: data.civilizationId ?? null,
    categoryId: data.categoryId ?? null,
    authorId: data.authorId,
    prepMinutes: data.prepMinutes,
    cookMinutes: data.cookMinutes,
    restMinutes: data.restMinutes ?? null,
    servings: data.servings,
    difficulty: data.difficulty,
  };

  const translationsCreate = [
    { locale: "tr", ...data.tr },
    { locale: "en", ...data.en },
  ];
  const ingredientsCreate = data.ingredients.map((i) => ({
    ingredientId: i.ingredientId,
    quantity: i.quantity,
    unit: i.unit as Unit,
    note: i.note ?? null,
    groupLabel: i.groupLabel ?? null,
    isOptional: i.isOptional,
    sortOrder: i.sortOrder,
  }));
  const stepsCreate = data.steps.map((s) => ({
    sortOrder: s.sortOrder,
    durationMinutes: s.durationMinutes ?? null,
    translations: { create: [{ locale: "tr", ...s.tr }, { locale: "en", ...s.en }] },
  }));

  try {
    const recipe = await db.$transaction(async (tx) => {
      if (data.id) {
        const existing = await tx.recipe.findUnique({ where: { id: data.id } });
        if (!existing) throw new Error("NOT_FOUND");

        await tx.recipeIngredient.deleteMany({ where: { recipeId: data.id } });
        await tx.recipeStep.deleteMany({ where: { recipeId: data.id } });
        await tx.recipeTranslation.deleteMany({ where: { recipeId: data.id } });
        if (data.nutrition) await tx.nutrition.deleteMany({ where: { recipeId: data.id } });

        return tx.recipe.update({
          where: { id: data.id },
          data: {
            ...scalarData,
            translations: { create: translationsCreate },
            ingredients: { create: ingredientsCreate },
            steps: { create: stepsCreate },
            ...(data.nutrition && { nutrition: { create: data.nutrition } }),
          },
        });
      }

      return tx.recipe.create({
        data: {
          ...scalarData,
          status: "DRAFT",
          translations: { create: translationsCreate },
          ingredients: { create: ingredientsCreate },
          steps: { create: stepsCreate },
          ...(data.nutrition && { nutrition: { create: data.nutrition } }),
        },
      });
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        entityType: "Recipe",
        entityId: recipe.id,
        action: data.id ? "UPDATE" : "CREATE",
        after: { slug: recipe.slug },
      },
    });

    return { ok: true, data: { id: recipe.id, slug: recipe.slug } };
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_FOUND") {
      return { ok: false, error: { code: "NOT_FOUND", message: "Tarif bulunamadı" } };
    }
    return { ok: false, error: { code: "CONFLICT", message: "Kaydedilemedi (slug zaten kullanılıyor olabilir)" } };
  }
}

/**
 * Bir kaynak URL'den görseli indirip Supabase Storage'a yükler, Image kaydı
 * oluşturur ve tarifin heroImage'ını buna çevirir. isAiGenerated=false
 * (varsayılan) küratörlü/lisanslı görseller için; ileride AI görsel üretimi
 * bağlandığında aynı action true ile de çağrılabilir.
 */
export async function setRecipeHeroImageFromUrl(input: unknown): Promise<ActionResult<{ imageId: string }>> {
  const parsed = setHeroImageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }

  let user;
  try {
    user = await requireRole("EDITOR");
  } catch (e) {
    if (e instanceof AuthError) return authErrorResult(e);
    throw e;
  }

  const { recipeId, imageUrl, alt, credit, isAiGenerated } = parsed.data;
  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) return { ok: false, error: { code: "NOT_FOUND", message: "Tarif bulunamadı" } };

  const ext = imageUrl.split(".").pop()?.split("?")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${recipe.slug}-${Date.now()}.${ext}`;

  let storagePath: string;
  try {
    const uploaded = await fetchAndUploadImage(imageUrl, path);
    storagePath = uploaded.storagePath;
  } catch (e) {
    return { ok: false, error: { code: "UPLOAD_FAILED", message: e instanceof Error ? e.message : "Yükleme başarısız" } };
  }

  const image = await db.image.create({ data: { storagePath, alt, credit, isAiGenerated } });
  await db.recipe.update({ where: { id: recipeId }, data: { heroImageId: image.id } });

  await db.auditLog.create({
    data: {
      userId: user.id,
      entityType: "Recipe",
      entityId: recipeId,
      action: "UPDATE",
      after: { heroImageId: image.id, isAiGenerated },
    },
  });

  return { ok: true, data: { imageId: image.id } };
}

const moderateCommentSchema = z.object({
  commentId: z.string().cuid(),
  status: z.enum(["APPROVED", "REJECTED", "HIDDEN"]),
});

/** Yorum moderasyonu — EDITOR+ (RLS "Comment_owner_or_editor_update" ile aynı kural). */
export async function moderateComment(input: unknown): Promise<ActionResult<{ status: string }>> {
  const parsed = moderateCommentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }

  let user;
  try {
    user = await requireRole("EDITOR");
  } catch (e) {
    if (e instanceof AuthError) return authErrorResult(e);
    throw e;
  }

  const before = await db.comment.findUnique({ where: { id: parsed.data.commentId }, select: { status: true } });
  if (!before) return { ok: false, error: { code: "NOT_FOUND", message: "Yorum bulunamadı" } };

  const comment = await db.comment.update({
    where: { id: parsed.data.commentId },
    data: { status: parsed.data.status },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      entityType: "Comment",
      entityId: comment.id,
      action: "UPDATE",
      before: { status: before.status },
      after: { status: comment.status },
    },
  });

  return { ok: true, data: { status: comment.status } };
}
