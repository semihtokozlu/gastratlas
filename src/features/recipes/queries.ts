import { cache } from "react";
import { db } from "@/lib/db";
import { routing } from "@/i18n/routing";
import type { AlternativeType, Difficulty, Unit } from "@prisma/client";

export async function getPublishedRecipeSlugs(): Promise<string[]> {
  const rows = await db.recipe.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export type HeroImage = {
  storagePath: string;
  alt: string;
  credit: string | null;
  isAiGenerated: boolean;
};

export type RecipeDetail = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  history: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  prepMinutes: number;
  cookMinutes: number;
  restMinutes: number | null;
  servings: number;
  difficulty: Difficulty;
  publishedAt: Date | null;
  heroImage: HeroImage | null;
  countryName: string;
  countrySlug: string;
  cityName: string | null;
  eraName: string | null;
  eraSlug: string | null;
  cuisineName: string;
  authorName: string;
  ingredients: {
    id: string;
    ingredientId: string;
    name: string;
    quantity: number;
    unit: Unit;
    note: string | null;
    groupLabel: string | null;
    isOptional: boolean;
    sortOrder: number;
    alternatives: { alternativeId: string; name: string; type: AlternativeType; aiExplanation: string | null }[];
  }[];
  steps: {
    id: string;
    sortOrder: number;
    durationMinutes: number | null;
    title: string | null;
    content: string;
  }[];
  nutrition: { calories: number; proteinG: number; fatG: number; carbsG: number; isAiEstimated: boolean } | null;
  sources: {
    title: string;
    author: string | null;
    year: number | null;
    url: string | null;
    citation: string | null;
    reliability: number;
  }[];
};

/** locale çevirisi yoksa varsayılan locale'e, o da yoksa ilk çeviriye düşer. */
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

export type RecipeCardData = {
  slug: string;
  title: string;
  summary: string;
  countryName: string;
  eraName: string | null;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: Difficulty;
  heroImage: HeroImage | null;
};

export type RecipeListFilters = {
  countrySlug?: string;
  eraSlug?: string;
  categorySlug?: string;
};

export async function getRecipeCards(
  locale: string,
  filters: RecipeListFilters = {}
): Promise<RecipeCardData[]> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const recipes = await db.recipe.findMany({
    where: {
      status: "PUBLISHED",
      ...(filters.countrySlug && { country: { slug: filters.countrySlug } }),
      ...(filters.eraSlug && { era: { slug: filters.eraSlug } }),
      ...(filters.categorySlug && { category: { slug: filters.categorySlug } }),
    },
    orderBy: { publishedAt: "desc" },
    include: {
      translations: { where: localeFilter },
      country: { include: { translations: { where: localeFilter } } },
      era: { include: { translations: { where: localeFilter } } },
      heroImage: true,
    },
  });

  return recipes.flatMap((recipe) => {
    const t = pickTranslation(recipe.translations, locale);
    if (!t) return [];
    return [
      {
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
}

/**
 * Aynı dönemi paylaşan ama FARKLI ülkeden tarifler en üstte gösterilir —
 * bunlar mutfaklar arası kültürel bağlantıyı (ör. Yunan dolmades ↔ Osmanlı
 * klasik dönemi) somutlaştıran, en ilginç eşleşmelerdir. Aksi halde çok
 * sayıda aynı-ülke/aynı-dönem tarif arasında bu bağlantı kayboluyordu.
 */
export async function getRelatedRecipes(
  recipeId: string,
  countrySlug: string,
  eraSlug: string | null,
  locale: string,
  limit = 3
): Promise<RecipeCardData[]> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const recipes = await db.recipe.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: recipeId },
      OR: [{ country: { slug: countrySlug } }, ...(eraSlug ? [{ era: { slug: eraSlug } }] : [])],
    },
    include: {
      translations: { where: localeFilter },
      country: { include: { translations: { where: localeFilter } } },
      era: { include: { translations: { where: localeFilter } } },
      heroImage: true,
    },
  });

  function matchScore(recipe: (typeof recipes)[number]): number {
    const eraMatch = eraSlug !== null && recipe.era?.slug === eraSlug;
    const countryMatch = recipe.country.slug === countrySlug;
    if (eraMatch && !countryMatch) return 3;
    if (eraMatch && countryMatch) return 2;
    return 1;
  }

  const sorted = recipes.sort((a, b) => matchScore(b) - matchScore(a));

  return sorted.slice(0, limit).flatMap((recipe) => {
    const t = pickTranslation(recipe.translations, locale);
    if (!t) return [];
    return [
      {
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
}

export type FilterOption = { slug: string; name: string };

export async function getFilterOptions(locale: string): Promise<{
  countries: FilterOption[];
  eras: FilterOption[];
  categories: FilterOption[];
}> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };
  const hasPublishedRecipe = { some: { status: "PUBLISHED" as const } };

  const [countries, eras, categories] = await Promise.all([
    db.country.findMany({
      where: { recipes: hasPublishedRecipe },
      include: { translations: { where: localeFilter } },
    }),
    db.era.findMany({
      where: { recipes: hasPublishedRecipe },
      include: { translations: { where: localeFilter } },
    }),
    db.category.findMany({
      where: { recipes: hasPublishedRecipe },
      include: { translations: { where: localeFilter } },
    }),
  ]);

  return {
    countries: countries.map((c) => ({ slug: c.slug, name: pickTranslation(c.translations, locale)?.name ?? c.slug })),
    eras: eras.map((e) => ({ slug: e.slug, name: pickTranslation(e.translations, locale)?.name ?? e.slug })),
    categories: categories.map((c) => ({ slug: c.slug, name: pickTranslation(c.translations, locale)?.name ?? c.slug })),
  };
}

/**
 * React.cache() ile sarmalı: generateMetadata + sayfa gövdesi aynı slug/locale
 * için bu fonksiyonu iki kez çağırıyor; cache olmadan build-time SSG'de
 * paralel sayfa üretimi Supabase pooler'ının bağlantı havuzunu zorluyor
 * (bkz. "connection pool timeout" build hatası).
 */
export const getRecipeBySlug = cache(async (slug: string, locale: string): Promise<RecipeDetail | null> => {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const recipe = await db.recipe.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      translations: { where: localeFilter },
      country: { include: { translations: { where: localeFilter } } },
      city: { include: { translations: { where: localeFilter } } },
      era: { include: { translations: { where: localeFilter } } },
      cuisine: { include: { translations: { where: localeFilter } } },
      author: true,
      heroImage: true,
      ingredients: {
        orderBy: { sortOrder: "asc" },
        include: {
          ingredient: {
            include: {
              translations: { where: localeFilter },
              alternatives: {
                where: { isVerified: true },
                include: { alternative: { include: { translations: { where: localeFilter } } } },
              },
            },
          },
        },
      },
      steps: {
        orderBy: { sortOrder: "asc" },
        include: { translations: { where: localeFilter } },
      },
      nutrition: true,
      sources: { include: { source: true } },
    },
  });
  if (!recipe) return null;

  const t = pickTranslation(recipe.translations, locale);
  if (!t) return null;

  return {
    id: recipe.id,
    slug: recipe.slug,
    title: t.title,
    summary: t.summary,
    history: t.history,
    metaTitle: t.metaTitle,
    metaDesc: t.metaDesc,
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    restMinutes: recipe.restMinutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    publishedAt: recipe.publishedAt,
    heroImage: recipe.heroImage
      ? {
          storagePath: recipe.heroImage.storagePath,
          alt: recipe.heroImage.alt,
          credit: recipe.heroImage.credit,
          isAiGenerated: recipe.heroImage.isAiGenerated,
        }
      : null,
    countryName: pickTranslation(recipe.country.translations, locale)?.name ?? recipe.country.slug,
    countrySlug: recipe.country.slug,
    cityName: recipe.city ? (pickTranslation(recipe.city.translations, locale)?.name ?? recipe.city.slug) : null,
    eraName: recipe.era ? (pickTranslation(recipe.era.translations, locale)?.name ?? recipe.era.slug) : null,
    eraSlug: recipe.era?.slug ?? null,
    cuisineName: pickTranslation(recipe.cuisine.translations, locale)?.name ?? recipe.cuisine.slug,
    authorName: recipe.author.name,
    ingredients: recipe.ingredients.map((i) => ({
      id: i.id,
      ingredientId: i.ingredientId,
      name: pickTranslation(i.ingredient.translations, locale)?.name ?? i.ingredient.slug,
      quantity: i.quantity.toNumber(),
      unit: i.unit,
      note: i.note,
      groupLabel: i.groupLabel,
      isOptional: i.isOptional,
      sortOrder: i.sortOrder,
      alternatives: i.ingredient.alternatives.map((alt) => ({
        alternativeId: alt.alternativeId,
        name: pickTranslation(alt.alternative.translations, locale)?.name ?? alt.alternative.slug,
        type: alt.type,
        aiExplanation: alt.aiExplanation,
      })),
    })),
    steps: recipe.steps.map((s) => {
      const st = pickTranslation(s.translations, locale);
      return {
        id: s.id,
        sortOrder: s.sortOrder,
        durationMinutes: s.durationMinutes,
        title: st?.title ?? null,
        content: st?.content ?? "",
      };
    }),
    nutrition: recipe.nutrition
      ? {
          calories: recipe.nutrition.calories,
          proteinG: recipe.nutrition.proteinG.toNumber(),
          fatG: recipe.nutrition.fatG.toNumber(),
          carbsG: recipe.nutrition.carbsG.toNumber(),
          isAiEstimated: recipe.nutrition.isAiEstimated,
        }
      : null,
    sources: recipe.sources.map((rs) => ({
      title: rs.source.title,
      author: rs.source.author,
      year: rs.source.year,
      url: rs.source.url,
      citation: rs.citation,
      reliability: rs.source.reliability,
    })),
  };
});

export type RecipeGeoPoint = {
  slug: string;
  title: string;
  latitude: number;
  longitude: number;
  countryName: string;
};

export async function getRecipeGeoPoints(locale: string): Promise<RecipeGeoPoint[]> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const recipes = await db.recipe.findMany({
    where: { status: "PUBLISHED", latitude: { not: null }, longitude: { not: null } },
    include: {
      translations: { where: localeFilter },
      country: { include: { translations: { where: localeFilter } } },
    },
  });

  return recipes.flatMap((recipe) => {
    const t = pickTranslation(recipe.translations, locale);
    if (!t || recipe.latitude == null || recipe.longitude == null) return [];
    return [
      {
        slug: recipe.slug,
        title: t.title,
        latitude: recipe.latitude.toNumber(),
        longitude: recipe.longitude.toNumber(),
        countryName: pickTranslation(recipe.country.translations, locale)?.name ?? recipe.country.slug,
      },
    ];
  });
}
