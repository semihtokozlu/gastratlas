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

export type CollectionSummary = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  itemCount: number;
  createdAt: Date;
};

export async function getUserCollections(userId: string): Promise<CollectionSummary[]> {
  const collections = await db.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return collections.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    isPublic: c.isPublic,
    itemCount: c._count.items,
    createdAt: c.createdAt,
  }));
}

export type CollectionDetail = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  isOwner: boolean;
  ownerName: string;
  recipes: (RecipeCardData & { id: string })[];
};

/**
 * Görünürlük kuralı RLS "Collection_read" ile aynıdır: sahibi her zaman
 * görür, isPublic=true ise herkes görür, aksi halde null döner (403/404
 * ayrımı yapmadan — bilgi sızıntısını önlemek için).
 */
export async function getCollectionDetail(
  collectionId: string,
  viewerUserId: string | null,
  locale: string
): Promise<CollectionDetail | null> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const collection = await db.collection.findUnique({
    where: { id: collectionId },
    include: {
      user: { select: { displayName: true } },
      items: {
        orderBy: { addedAt: "desc" },
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
      },
    },
  });

  if (!collection) return null;

  const isOwner = viewerUserId === collection.userId;
  if (!isOwner && !collection.isPublic) return null;

  const recipes = collection.items.flatMap(({ recipe }) => {
    if (recipe.status !== "PUBLISHED") return [];
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
      },
    ];
  });

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isPublic: collection.isPublic,
    isOwner,
    ownerName: collection.user.displayName ?? "GastrAtlas Kullanıcısı",
    recipes,
  };
}

export type CollectionPickerItem = { id: string; name: string; containsRecipe: boolean };

export async function getCollectionsForRecipe(userId: string, recipeId: string): Promise<CollectionPickerItem[]> {
  const collections = await db.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: { where: { recipeId }, select: { recipeId: true } } },
  });

  return collections.map((c) => ({
    id: c.id,
    name: c.name,
    containsRecipe: c.items.length > 0,
  }));
}
