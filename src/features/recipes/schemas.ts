import { z } from "zod";

/**
 * API sözleşmelerinin (planlama paketi §8) Zod karşılıkları.
 * Server Action'lar girişleri yalnızca bu şemalar üzerinden kabul eder.
 */

export const recalculateRecipeSchema = z.object({
  recipeId: z.string().cuid(),
  servings: z.number().int().min(1).max(100),
  substitutions: z
    .array(
      z.object({
        ingredientId: z.string().cuid(),
        alternativeId: z.string().cuid(),
        ratio: z.number().positive().max(20),
      })
    )
    .max(30)
    .default([]),
});

export type RecalculateRecipeInput = z.infer<typeof recalculateRecipeSchema>;

/** Standart Action dönüş tipi (planlama paketi §8). */
export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: { code: string; message: string; fields?: Record<string, string> };
    };
