"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth/guards";
import type { ActionResult } from "@/features/recipes/schemas";
import type { ContentStatus } from "@prisma/client";

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
