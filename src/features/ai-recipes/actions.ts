"use server";

import { db } from "@/lib/db";
import { requireRole, AuthError } from "@/lib/auth/guards";
import { generateStructuredContent, RECIPE_DRAFT_MODEL } from "@/lib/ai/textGeneration";
import { searchWikimediaImage } from "@/lib/media/wikimedia";
import { fetchAndUploadImage } from "@/lib/storage/upload";
import {
  RECIPE_DRAFT_PROMPT_NAME,
  RECIPE_DRAFT_PROMPT_VERSION,
  RECIPE_DRAFT_PROMPT_TEMPLATE,
} from "./prompt";
import { generateRecipeDraftSchema, aiRecipeDraftSchema, type AIRecipeDraft } from "./schemas";
import type { ActionResult } from "@/features/recipes/schemas";
import type { Unit, SourceType, AlternativeType } from "@prisma/client";

const UNIT_ENUM = ["G", "KG", "ML", "L", "TSP", "TBSP", "CUP", "PIECE", "PINCH", "SLICE", "BUNCH"];
const DIFFICULTY_ENUM = ["EASY", "MEDIUM", "HARD", "EXPERT"];
const SOURCE_TYPE_ENUM = ["MANUSCRIPT", "BOOK", "ACADEMIC_PAPER", "ARCHIVE", "ORAL_HISTORY", "WEBSITE"];
const ALTERNATIVE_TYPE_ENUM = [
  "HISTORICAL",
  "MODERN",
  "VEGAN",
  "VEGETARIAN",
  "GLUTEN_FREE",
  "LACTOSE_FREE",
  "ECONOMIC",
  "LOCAL",
  "SAME_AROMA",
  "SAME_TEXTURE",
];

const RECIPE_DRAFT_JSON_SCHEMA = {
  type: "object",
  properties: {
    slug: { type: "string" },
    titleTr: { type: "string" },
    titleEn: { type: "string" },
    summaryTr: { type: "string" },
    summaryEn: { type: "string" },
    historyTr: { type: "string" },
    historyEn: { type: "string" },
    metaDescTr: { type: "string" },
    metaDescEn: { type: "string" },
    prepMinutes: { type: "integer" },
    cookMinutes: { type: "integer" },
    restMinutes: { type: "integer" },
    servings: { type: "integer" },
    difficulty: { type: "string", enum: DIFFICULTY_ENUM },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nameTr: { type: "string" },
          nameEn: { type: "string" },
          quantity: { type: "number" },
          unit: { type: "string", enum: UNIT_ENUM },
          note: { type: "string" },
          groupLabel: { type: "string" },
          isOptional: { type: "boolean" },
        },
        required: ["nameTr", "nameEn", "quantity", "unit"],
      },
    },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          titleTr: { type: "string" },
          titleEn: { type: "string" },
          contentTr: { type: "string" },
          contentEn: { type: "string" },
          durationMinutes: { type: "integer" },
        },
        required: ["contentTr", "contentEn"],
      },
    },
    nutrition: {
      type: "object",
      properties: {
        calories: { type: "integer" },
        proteinG: { type: "number" },
        fatG: { type: "number" },
        carbsG: { type: "number" },
      },
    },
    sources: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          author: { type: "string" },
          year: { type: "integer" },
          type: { type: "string", enum: SOURCE_TYPE_ENUM },
          reliability: { type: "integer" },
          notes: { type: "string" },
        },
        required: ["title", "type", "reliability"],
      },
    },
    alternatives: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ingredientNameTr: { type: "string" },
          alternativeNameTr: { type: "string" },
          alternativeNameEn: { type: "string" },
          type: { type: "string", enum: ALTERNATIVE_TYPE_ENUM },
          ratio: { type: "number" },
          explanation: { type: "string" },
        },
        required: ["ingredientNameTr", "alternativeNameTr", "alternativeNameEn", "type", "ratio", "explanation"],
      },
    },
  },
  required: [
    "slug",
    "titleTr",
    "titleEn",
    "summaryTr",
    "summaryEn",
    "historyTr",
    "historyEn",
    "prepMinutes",
    "cookMinutes",
    "servings",
    "difficulty",
    "ingredients",
    "steps",
  ],
};

const TURKISH_CHAR_MAP: Record<string, string> = {
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ş: "s",
  Ş: "s",
  ı: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

function slugify(input: string): string {
  const swapped = input
    .split("")
    .map((ch) => TURKISH_CHAR_MAP[ch] ?? ch)
    .join("");
  return swapped
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function authErrorResult(e: AuthError): ActionResult<never> {
  return {
    ok: false,
    error: {
      code: e.code,
      message: e.code === "UNAUTHENTICATED" ? "Giriş yapmalısınız" : "Bu işlem için yetkiniz yok",
    },
  };
}

/**
 * Var olan bir malzemeyi ada göre (tr veya en) bulur, yoksa yeni oluşturur.
 * AI'nin serbestçe yeni Ingredient satırı üretmesine izin vermek yerine
 * mevcut kataloğu önceliklendirir — tekrarlanan/varyant malzeme birikmesini
 * azaltır.
 */
async function resolveIngredientId(nameTr: string, nameEn: string): Promise<string> {
  const existing = await db.ingredientTranslation.findFirst({
    where: {
      OR: [
        { locale: "tr", name: { equals: nameTr, mode: "insensitive" } },
        { locale: "en", name: { equals: nameEn, mode: "insensitive" } },
      ],
    },
    select: { ingredientId: true },
  });
  if (existing) return existing.ingredientId;

  const baseSlug = slugify(nameEn || nameTr);
  let slug = baseSlug;
  let suffix = 1;
  while (await db.ingredient.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const ingredient = await db.ingredient.create({
    data: {
      slug,
      translations: {
        create: [
          { locale: "tr", name: nameTr },
          { locale: "en", name: nameEn },
        ],
      },
    },
  });
  return ingredient.id;
}

/**
 * AI Tarif Taslak Botu — EDITOR+. Anthropic API'sini çağırıp yapılandırılmış
 * bir tarif taslağı üretir; taksonomiyi (ülke/dönem/medeniyet/kategori)
 * AI İCAT ETMEZ, admin seçer. Sonuç HER ZAMAN "AI_REVIEW" durumunda
 * kaydedilir — planlama §2.4 "AI hiçbir zaman doğrudan yayına içerik
 * basmaz" ilkesi burada da geçerlidir; yayınlama yalnızca HISTORIAN+ ile
 * setRecipeStatus/publishRecipe üzerinden mümkündür. Her çağrı AIJob +
 * PromptHistory + AuditLog ile izlenir (denetlenebilirlik).
 */
export async function generateRecipeDraft(
  input: unknown
): Promise<ActionResult<{ id: string; slug: string; aiJobId: string }>> {
  const parsed = generateRecipeDraftSchema.safeParse(input);
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

  const data = parsed.data;

  const [cuisine, country, city, era, civilization, category] = await Promise.all([
    db.cuisine.findUniqueOrThrow({ where: { id: data.cuisineId }, include: { translations: true } }),
    db.country.findUniqueOrThrow({ where: { id: data.countryId }, include: { translations: true } }),
    data.cityId ? db.city.findUnique({ where: { id: data.cityId }, include: { translations: true } }) : null,
    data.eraId ? db.era.findUnique({ where: { id: data.eraId }, include: { translations: true } }) : null,
    data.civilizationId
      ? db.civilization.findUnique({ where: { id: data.civilizationId }, include: { translations: true } })
      : null,
    data.categoryId ? db.category.findUnique({ where: { id: data.categoryId }, include: { translations: true } }) : null,
    db.author.findUniqueOrThrow({ where: { id: data.authorId } }),
  ]);

  const nameOf = (translations: { locale: string; name: string }[]) =>
    translations.find((t) => t.locale === "tr")?.name ?? translations[0]?.name ?? "";

  const contextLines = [
    `Konu/tarif adı: ${data.topic}`,
    `Mutfak: ${nameOf(cuisine.translations)}`,
    `Ülke: ${nameOf(country.translations)}`,
    city ? `Şehir: ${nameOf(city.translations)}` : null,
    era ? `Dönem: ${nameOf(era.translations)}` : null,
    civilization ? `Medeniyet: ${nameOf(civilization.translations)}` : null,
    category ? `Kategori: ${nameOf(category.translations)}` : null,
  ].filter(Boolean);

  const promptHistory = await db.promptHistory.upsert({
    where: { name_version: { name: RECIPE_DRAFT_PROMPT_NAME, version: RECIPE_DRAFT_PROMPT_VERSION } },
    create: {
      name: RECIPE_DRAFT_PROMPT_NAME,
      version: RECIPE_DRAFT_PROMPT_VERSION,
      template: RECIPE_DRAFT_PROMPT_TEMPLATE,
      model: RECIPE_DRAFT_MODEL,
    },
    update: {},
  });

  const aiJob = await db.aIJob.create({
    data: {
      type: "CONTENT_GENERATION",
      status: "RUNNING",
      promptHistoryId: promptHistory.id,
      createdById: user.id,
    },
  });

  let draft: AIRecipeDraft;
  let usage: { input_tokens: number; output_tokens: number };
  try {
    const response = await generateStructuredContent({
      model: RECIPE_DRAFT_MODEL,
      systemInstruction: RECIPE_DRAFT_PROMPT_TEMPLATE,
      prompt: contextLines.join("\n"),
      jsonSchema: RECIPE_DRAFT_JSON_SCHEMA,
    });

    const rawDraft = aiRecipeDraftSchema.safeParse(response.data);
    if (!rawDraft.success) {
      throw new Error(`AI çıktısı şemaya uymuyor: ${rawDraft.error.message}`);
    }
    draft = rawDraft.data;
    usage = { input_tokens: response.inputTokens, output_tokens: response.outputTokens };
  } catch (e) {
    await db.aIJob.update({
      where: { id: aiJob.id },
      data: { status: "FAILED", error: e instanceof Error ? e.message : "Bilinmeyen hata", completedAt: new Date() },
    });
    return { ok: false, error: { code: "AI_ERROR", message: "AI taslak üretemedi, tekrar deneyin" } };
  }

  // Sıralı çözülür (Promise.all DEĞİL) — iki malzeme aynı slug'a düşerse
  // (ör. iki farklı ad aynı baz slug'a normalize olursa) eşzamanlı
  // find-then-create kontrolü bir yarış durumuna (TOCTOU) yol açar.
  const resolvedIngredients: (AIRecipeDraft["ingredients"][number] & { ingredientId: string })[] = [];
  for (const ing of draft.ingredients) {
    const ingredientId = await resolveIngredientId(ing.nameTr, ing.nameEn);
    resolvedIngredients.push({ ...ing, ingredientId });
  }

  const baseSlug = draft.slug;
  let slug = baseSlug;
  let suffix = 1;
  while (await db.recipe.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  // Haritada görünmesi için konum — şehir varsa şehrin, yoksa ülkenin
  // koordinatları, aynı noktada üst üste binmesin diye küçük bir jitter ile
  // (mevcut seed verisindeki desenle aynı — bkz. prisma/seed/data/ottoman.ts).
  const baseLocation = city ?? country;
  const jitter = () => (Math.random() - 0.5) * 0.04;
  const latitude = baseLocation.latitude ? baseLocation.latitude.toNumber() + jitter() : null;
  const longitude = baseLocation.longitude ? baseLocation.longitude.toNumber() + jitter() : null;

  const recipe = await db.$transaction(async (tx) => {
    return tx.recipe.create({
      data: {
        slug,
        status: "AI_REVIEW",
        cuisineId: data.cuisineId,
        countryId: data.countryId,
        cityId: data.cityId ?? null,
        eraId: data.eraId ?? null,
        civilizationId: data.civilizationId ?? null,
        categoryId: data.categoryId ?? null,
        authorId: data.authorId,
        latitude,
        longitude,
        prepMinutes: draft.prepMinutes,
        cookMinutes: draft.cookMinutes,
        restMinutes: draft.restMinutes ?? null,
        servings: draft.servings,
        difficulty: draft.difficulty,
        translations: {
          create: [
            {
              locale: "tr",
              title: draft.titleTr,
              summary: draft.summaryTr,
              history: draft.historyTr,
              metaTitle: draft.titleTr,
              metaDesc: draft.metaDescTr ?? draft.summaryTr,
            },
            {
              locale: "en",
              title: draft.titleEn,
              summary: draft.summaryEn,
              history: draft.historyEn,
              metaTitle: draft.titleEn,
              metaDesc: draft.metaDescEn ?? draft.summaryEn,
            },
          ],
        },
        ingredients: {
          create: resolvedIngredients.map((ing, idx) => ({
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            unit: ing.unit as Unit,
            note: ing.note ?? null,
            groupLabel: ing.groupLabel ?? null,
            isOptional: ing.isOptional,
            sortOrder: idx + 1,
          })),
        },
        steps: {
          create: draft.steps.map((step, idx) => ({
            sortOrder: idx + 1,
            durationMinutes: step.durationMinutes ?? null,
            translations: {
              create: [
                { locale: "tr", title: step.titleTr ?? null, content: step.contentTr },
                { locale: "en", title: step.titleEn ?? null, content: step.contentEn },
              ],
            },
          })),
        },
        ...(draft.nutrition && {
          nutrition: {
            create: { ...draft.nutrition, isAiEstimated: true },
          },
        }),
      },
    });
  });

  // Kaynaklar — doğal unique alan yok, title+author ile findFirst sonra
  // yoksa create (mevcut seed script'iyle aynı desen).
  for (const source of draft.sources ?? []) {
    let historicalSource = await db.historicalSource.findFirst({
      where: { title: source.title, author: source.author ?? null },
    });
    if (!historicalSource) {
      historicalSource = await db.historicalSource.create({
        data: {
          title: source.title,
          author: source.author ?? null,
          year: source.year ?? null,
          type: source.type as SourceType,
          reliability: source.reliability,
          notes: source.notes ? `[AI önerisi, doğrulanmadı] ${source.notes}` : "[AI önerisi, doğrulanmadı]",
        },
      });
    }
    await db.recipeSource.upsert({
      where: { recipeId_sourceId: { recipeId: recipe.id, sourceId: historicalSource.id } },
      create: { recipeId: recipe.id, sourceId: historicalSource.id },
      update: {},
    });
  }

  // Malzeme alternatifleri — isVerified: false (şemadaki mevcut güvence).
  // EDITOR+ admin panelinden onaylamadan kullanıcıya gösterilmez
  // (bkz. src/features/recipes/queries.ts "isVerified: true" filtresi).
  for (const alt of draft.alternatives ?? []) {
    const baseIngredient = resolvedIngredients.find(
      (ing) => ing.nameTr.toLocaleLowerCase("tr") === alt.ingredientNameTr.toLocaleLowerCase("tr")
    );
    if (!baseIngredient) continue; // AI'nin uydurduğu/eşleşmeyen bir ad — sessizce atla

    const alternativeIngredientId = await resolveIngredientId(alt.alternativeNameTr, alt.alternativeNameEn);
    if (alternativeIngredientId === baseIngredient.ingredientId) continue; // kendine alternatif olamaz

    await db.ingredientAlternative.upsert({
      where: {
        ingredientId_alternativeId_type: {
          ingredientId: baseIngredient.ingredientId,
          alternativeId: alternativeIngredientId,
          type: alt.type as AlternativeType,
        },
      },
      create: {
        ingredientId: baseIngredient.ingredientId,
        alternativeId: alternativeIngredientId,
        type: alt.type as AlternativeType,
        ratio: alt.ratio,
        aiExplanation: alt.explanation,
        isVerified: false,
      },
      update: {},
    });
  }

  // Görsel — best-effort: Wikimedia Commons'ta CC0/CC-BY/CC-BY-SA lisanslı,
  // yeterli çözünürlükte bir görsel bulunursa otomatik eklenir; bulunamazsa
  // tarif görsel olmadan (placeholder ile) yayına hazır kalır, işlem bloklanmaz.
  try {
    const image = await searchWikimediaImage(draft.titleEn);
    if (image) {
      const path = `${recipe.slug}-${Date.now()}.jpg`;
      const uploaded = await fetchAndUploadImage(image.url, path);
      const imageRecord = await db.image.create({
        data: {
          storagePath: uploaded.storagePath,
          alt: draft.titleTr,
          credit: image.attributionText,
          isAiGenerated: false,
        },
      });
      await db.recipe.update({ where: { id: recipe.id }, data: { heroImageId: imageRecord.id } });
    }
  } catch {
    // Görsel bulunamadı/indirilemedi — sessizce atla, tarif taslağı yine de oluşur.
  }

  await db.aIJob.update({
    where: { id: aiJob.id },
    data: {
      status: "DONE",
      entityType: "Recipe",
      entityId: recipe.id,
      inputTokens: usage.input_tokens,
      outputTokens: usage.output_tokens,
      result: draft as object,
      completedAt: new Date(),
    },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      entityType: "Recipe",
      entityId: recipe.id,
      action: "CREATE",
      after: { slug: recipe.slug, status: recipe.status, source: "ai-recipe-draft-bot" },
    },
  });

  return { ok: true, data: { id: recipe.id, slug: recipe.slug, aiJobId: aiJob.id } };
}
