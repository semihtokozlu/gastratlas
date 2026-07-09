import { z } from "zod";

const UNIT_VALUES = ["G", "KG", "ML", "L", "TSP", "TBSP", "CUP", "PIECE", "PINCH", "SLICE", "BUNCH"] as const;

/**
 * Admin'in seçtiği taksonomi (ülke/dönem/medeniyet vb.) — AI bunları
 * İCAT ETMEZ, yalnızca zaten var olan kayıtlar arasından admin seçer.
 * AI yalnızca İÇERİK (metin + malzeme + adım) üretir.
 */
export const generateRecipeDraftSchema = z.object({
  topic: z.string().min(2).max(200),
  cuisineId: z.string().cuid(),
  countryId: z.string().cuid(),
  cityId: z.string().cuid().optional(),
  eraId: z.string().cuid().optional(),
  civilizationId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional(),
  authorId: z.string().cuid(),
});

export type GenerateRecipeDraftInput = z.infer<typeof generateRecipeDraftSchema>;

/** Claude'un "tool use" ile döndürmesi zorunlu tutulan yapılandırılmış taslak şeması. */
export const aiRecipeDraftSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  titleTr: z.string().min(1).max(200),
  titleEn: z.string().min(1).max(200),
  summaryTr: z.string().min(1).max(500),
  summaryEn: z.string().min(1).max(500),
  historyTr: z.string().min(1).max(10000),
  historyEn: z.string().min(1).max(10000),
  metaDescTr: z.string().max(300).optional(),
  metaDescEn: z.string().max(300).optional(),
  prepMinutes: z.number().int().min(0).max(1440),
  cookMinutes: z.number().int().min(0).max(1440),
  restMinutes: z.number().int().min(0).max(10080).optional(),
  servings: z.number().int().min(1).max(100),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
  ingredients: z
    .array(
      z.object({
        nameTr: z.string().min(1).max(100),
        nameEn: z.string().min(1).max(100),
        quantity: z.number().positive(),
        unit: z.enum(UNIT_VALUES),
        note: z.string().max(200).optional(),
        groupLabel: z.string().max(100).optional(),
        isOptional: z.boolean().default(false),
      })
    )
    .min(1)
    .max(30),
  steps: z
    .array(
      z.object({
        titleTr: z.string().max(200).optional(),
        titleEn: z.string().max(200).optional(),
        contentTr: z.string().min(1).max(2000),
        contentEn: z.string().min(1).max(2000),
        durationMinutes: z.number().int().min(0).optional(),
      })
    )
    .min(1)
    .max(20),
  nutrition: z
    .object({
      calories: z.number().int().min(0),
      proteinG: z.number().min(0),
      fatG: z.number().min(0),
      carbsG: z.number().min(0),
    })
    .optional(),
  /** AI önerisi kaynaklar — düşük/temkinli reliability ile, editoryal doğrulama beklenir. */
  sources: z
    .array(
      z.object({
        title: z.string().min(1).max(300),
        author: z.string().max(200).optional(),
        year: z.number().int().min(-3000).max(2100).optional(),
        type: z.enum(["MANUSCRIPT", "BOOK", "ACADEMIC_PAPER", "ARCHIVE", "ORAL_HISTORY", "WEBSITE"]),
        reliability: z.number().int().min(1).max(3),
        notes: z.string().max(500).optional(),
      })
    )
    .max(3)
    .optional(),
  /**
   * ingredientNameTr, ingredients dizisindeki bir malzemenin nameTr'siyle
   * BİREBİR eşleşmelidir — hangi malzemenin alternatifi olduğunu belirtir.
   * isVerified=false ile kaydedilir (şemadaki mevcut güvence), EDITOR+
   * onaylamadan kullanıcıya gösterilmez.
   */
  alternatives: z
    .array(
      z.object({
        ingredientNameTr: z.string().min(1).max(100),
        alternativeNameTr: z.string().min(1).max(100),
        alternativeNameEn: z.string().min(1).max(100),
        type: z.enum([
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
        ]),
        ratio: z.number().positive().max(10),
        explanation: z.string().min(1).max(300),
      })
    )
    .max(6)
    .optional(),
});

export type AIRecipeDraft = z.infer<typeof aiRecipeDraftSchema>;
