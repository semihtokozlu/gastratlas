"use server";

import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/guards";
import { toggleFavoriteSchema } from "./schemas";
import { isRecipeFavorited } from "./queries";
import type { ActionResult } from "@/features/recipes/schemas";

/** USER+ — RLS "Favorite_owner_all" ile aynı kural (yalnızca sahibi). */
export async function toggleFavorite(input: unknown): Promise<ActionResult<{ favorited: boolean }>> {
  const parsed = toggleFavoriteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION", message: "Geçersiz girdi" } };
  }

  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: "Favorilere eklemek için giriş yapmalısınız" } };
  }

  const { recipeId } = parsed.data;
  const alreadyFavorited = await isRecipeFavorited(user.id, recipeId);

  if (alreadyFavorited) {
    await db.favorite.delete({ where: { userId_recipeId: { userId: user.id, recipeId } } });
    return { ok: true, data: { favorited: false } };
  }

  const recipe = await db.recipe.findFirst({ where: { id: recipeId, status: "PUBLISHED" } });
  if (!recipe) {
    return { ok: false, error: { code: "NOT_FOUND", message: "Tarif bulunamadı" } };
  }

  await db.favorite.create({ data: { userId: user.id, recipeId } });
  return { ok: true, data: { favorited: true } };
}

/** Client component'in (FavoriteButton) mount'ta çağırdığı salt-okunur wrapper. */
export async function getFavoriteState(recipeId: string): Promise<{ isAuthenticated: boolean; favorited: boolean }> {
  const user = await getSessionUser();
  if (!user) return { isAuthenticated: false, favorited: false };
  const favorited = await isRecipeFavorited(user.id, recipeId);
  return { isAuthenticated: true, favorited };
}
