import { db } from "@/lib/db";
import { routing } from "@/i18n/routing";
import type { Difficulty, Unit } from "@prisma/client";

export async function getPublishedRecipeSlugs(): Promise<string[]> {
  const rows = await db.recipe.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

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
  countryName: string;
  cityName: string | null;
  eraName: string | null;
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
  }[];
  steps: {
    id: string;
    sortOrder: number;
    durationMinutes: number | null;
    title: string | null;
    content: string;
  }[];
  nutrition: { calories: number; proteinG: number; fatG: number; carbsG: number } | null;
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

export async function getRecipeBySlug(slug: string, locale: string): Promise<RecipeDetail | null> {
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
      ingredients: {
        orderBy: { sortOrder: "asc" },
        include: { ingredient: { include: { translations: { where: localeFilter } } } },
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
    countryName: pickTranslation(recipe.country.translations, locale)?.name ?? recipe.country.slug,
    cityName: recipe.city ? (pickTranslation(recipe.city.translations, locale)?.name ?? recipe.city.slug) : null,
    eraName: recipe.era ? (pickTranslation(recipe.era.translations, locale)?.name ?? recipe.era.slug) : null,
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
}
