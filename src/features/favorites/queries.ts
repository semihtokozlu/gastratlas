import { db } from "@/lib/db";
import { routing } from "@/i18n/routing";
import type { RecipeCardData } from "@/features/recipes/queries";

function pickTranslation<T extends { locale: string }>(
  translations: T[],
  locale: string
): T | undefined {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === routing.defaultLocale) ??
    translations[0]
  );
}

export async function isRecipeFavorited(userId: string, recipeId: string): Promise<boolean> {
  const favorite = await db.favorite.findUnique({ where: { userId_recipeId: { userId, recipeId } } });
  return !!favorite;
}

export async function getFavoriteRecipeCards(
  userId: string,
  locale: string
): Promise<(RecipeCardData & { id: string })[]> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const favorites = await db.favorite.findMany({
    where: { userId, recipe: { status: "PUBLISHED" } },
    orderBy: { createdAt: "desc" },
    include: {
      recipe: {
        include: {
          translations: { where: localeFilter },
          country: { include: { translations: { where: localeFilter } } },
          era: { include: { translations: { where: localeFilter } } },
          heroImage: true,
        },
      },
    },
  });

  return favorites.flatMap(({ recipe }) => {
    const t = pickTranslation(recipe.translations, locale);
    if (!t) return [];
    return [
      {
        id: recipe.id,
        slug: recipe.slug,
        title: t.title,
        summary: t.summary,
        countryName: pickTranslation(recipe.country.translations, locale)?.name ?? recipe.country.slug,
        eraName: recipe.era ? (pickTranslation(recipe.era.translations, locale)?.name ?? recipe.era.slug) : null,
        prepMinutes: recipe.prepMinutes,
        cookMinutes: recipe.cookMinutes,
        difficulty: recipe.difficulty,
        heroImage: recipe.heroImage
          ? {
              storagePath: recipe.heroImage.storagePath,
              alt: recipe.heroImage.alt,
              credit: recipe.heroImage.credit,
              isAiGenerated: recipe.heroImage.isAiGenerated,
            }
          : null,
        viewCount: recipe.viewCount,
        publishedAt: recipe.publishedAt,
      },
    ];
  });
}
