"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { recalculateRecipeSchema, type ActionResult } from "./schemas";
import { recalculateIngredients, type ScalableIngredient } from "@/domain/recipe/scaling";

/**
 * PUBLIC server action (planlama §8.1) — porsiyon/alternatif yeniden hesabı.
 * Auth gerektirmez; domain katmanında saf hesaptır. Client'ın gönderdiği
 * substitution `ratio`'suna güvenilmez, IngredientAlternative'den yeniden
 * çözülür (bu action auth'suz olduğu için ufak ama gerçek bir sertleştirme).
 */
export async function recalculateRecipe(
  input: unknown
): Promise<ActionResult<{ ingredients: ScalableIngredient[] }>> {
  const parsed = recalculateRecipeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: { code: "VALIDATION", message: "Geçersiz girdi", fields: parsed.error.flatten().fieldErrors as Record<string, string> },
    };
  }
  const { recipeId, servings, substitutions } = parsed.data;

  const recipe = await db.recipe.findFirst({
    where: { id: recipeId, status: "PUBLISHED" },
    select: { servings: true },
  });
  if (!recipe) {
    return { ok: false, error: { code: "NOT_FOUND", message: "Tarif bulunamadı" } };
  }

  const ingredientRows = await db.recipeIngredient.findMany({
    where: { recipeId },
    orderBy: { sortOrder: "asc" },
    select: { ingredientId: true, quantity: true, unit: true, isOptional: true },
  });
  const knownIngredientIds = new Set(ingredientRows.map((r) => r.ingredientId));

  const resolvedSubstitutions: { ingredientId: string; alternativeId: string; ratio: number }[] = [];
  for (const sub of substitutions) {
    if (!knownIngredientIds.has(sub.ingredientId)) {
      return { ok: false, error: { code: "VALIDATION", message: "Tarifte olmayan malzeme" } };
    }
    const alt = await db.ingredientAlternative.findFirst({
      where: { ingredientId: sub.ingredientId, alternativeId: sub.alternativeId },
      select: { ratio: true },
    });
    if (!alt) {
      return { ok: false, error: { code: "VALIDATION", message: "Tanımsız alternatif" } };
    }
    resolvedSubstitutions.push({
      ingredientId: sub.ingredientId,
      alternativeId: sub.alternativeId,
      ratio: alt.ratio.toNumber(),
    });
  }

  const scalable: ScalableIngredient[] = ingredientRows.map((r) => ({
    ingredientId: r.ingredientId,
    quantity: r.quantity.toNumber(),
    unit: r.unit,
    isOptional: r.isOptional,
  }));

  const result = recalculateIngredients(scalable, recipe.servings, servings, resolvedSubstitutions);
  return { ok: true, data: { ingredients: result } };
}

/**
 * PUBLIC — pasif görüntülenme sayacı. Sayfa SSG/ISR olduğu için render
 * içinde artırılamaz; client tarafta mount olduğunda çağrılır (bkz.
 * ViewTracker). Yetkilendirme/AuditLog gerektirmez, güvenlik açısından
 * kritik bir alan değildir.
 */
export async function incrementViewCount(recipeId: unknown): Promise<ActionResult<{ viewCount: number }>> {
  const parsed = z.string().cuid().safeParse(recipeId);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz ID" } };
  }
  try {
    const recipe = await db.recipe.update({
      where: { id: parsed.data, status: "PUBLISHED" },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });
    return { ok: true, data: { viewCount: recipe.viewCount } };
  } catch {
    return { ok: false, error: { code: "NOT_FOUND", message: "Tarif bulunamadı" } };
  }
}
