"use server";

import { getSessionUser } from "@/lib/auth/guards";
import { getFavoriteRecipeCards } from "@/features/favorites/queries";
import { getUserCollections, type CollectionSummary } from "@/features/collections/queries";
import type { RecipeCardData } from "@/features/recipes/queries";

export type HomeDashboardData = {
  isAuthenticated: boolean;
  favoriteRecipes: (RecipeCardData & { id: string })[];
  collections: CollectionSummary[];
};

/** Client component'in (PersonalizedHomeSection) mount'ta çağırdığı salt-okunur wrapper. */
export async function getHomeDashboardData(locale: string): Promise<HomeDashboardData> {
  const user = await getSessionUser();
  if (!user) return { isAuthenticated: false, favoriteRecipes: [], collections: [] };

  const [favoriteRecipes, collections] = await Promise.all([
    getFavoriteRecipeCards(user.id, locale),
    getUserCollections(user.id),
  ]);

  return {
    isAuthenticated: true,
    favoriteRecipes: favoriteRecipes.slice(0, 3),
    collections: collections.slice(0, 3),
  };
}
