import { z } from "zod";

const localizedTextSchema = z.object({
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  history: z.string().max(10000).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDesc: z.string().max(300).optional(),
});

const stepSchema = z.object({
  sortOrder: z.number().int().min(1),
  durationMinutes: z.number().int().min(0).optional(),
  tr: z.object({ title: z.string().max(200).optional(), content: z.string().min(1).max(2000) }),
  en: z.object({ title: z.string().max(200).optional(), content: z.string().min(1).max(2000) }),
});

const ingredientRowSchema = z.object({
  ingredientId: z.string().cuid(),
  quantity: z.number().positive(),
  unit: z.enum(["G", "KG", "ML", "L", "TSP", "TBSP", "CUP", "PIECE", "PINCH", "SLICE", "BUNCH"]),
  note: z.string().max(200).optional(),
  groupLabel: z.string().max(100).optional(),
  isOptional: z.boolean().default(false),
  sortOrder: z.number().int().min(1),
});

const nutritionSchema = z.object({
  calories: z.number().int().min(0),
  proteinG: z.number().min(0),
  fatG: z.number().min(0),
  carbsG: z.number().min(0),
  isAiEstimated: z.boolean().default(true),
});

/** Planlama §8.1 "admin.upsertRecipe" — geniş RecipeInput şeması. */
export const recipeInputSchema = z.object({
  id: z.string().cuid().optional(),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "yalnızca küçük harf, rakam ve tire"),
  cuisineId: z.string().cuid(),
  countryId: z.string().cuid(),
  cityId: z.string().cuid().optional(),
  eraId: z.string().cuid().optional(),
  civilizationId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional(),
  authorId: z.string().cuid(),
  prepMinutes: z.number().int().min(0).max(1440),
  cookMinutes: z.number().int().min(0).max(1440),
  restMinutes: z.number().int().min(0).max(10080).optional(),
  servings: z.number().int().min(1).max(100),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
  tr: localizedTextSchema,
  en: localizedTextSchema,
  ingredients: z.array(ingredientRowSchema).min(1).max(60),
  steps: z.array(stepSchema).min(1).max(40),
  nutrition: nutritionSchema.optional(),
});

export type RecipeInput = z.infer<typeof recipeInputSchema>;

export const setHeroImageSchema = z.object({
  recipeId: z.string().cuid(),
  imageUrl: z.string().url(),
  alt: z.string().min(1).max(200),
  credit: z.string().max(300).optional(),
  isAiGenerated: z.boolean().default(false),
});
