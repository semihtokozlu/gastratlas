import { db } from "@/lib/db";
import { routing } from "@/i18n/routing";
import type { ContentStatus } from "@prisma/client";

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

export type AdminRecipeRow = {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
  countryName: string;
  updatedAt: Date;
  scheduledAt: Date | null;
};

/** Admin panel — statüden bağımsız tüm tarifleri listeler (public sorgular yalnızca PUBLISHED döner). */
export async function getAdminRecipeList(locale: string): Promise<AdminRecipeRow[]> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const recipes = await db.recipe.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      translations: { where: localeFilter },
      country: { include: { translations: { where: localeFilter } } },
    },
  });

  return recipes.flatMap((r) => {
    const t = pickTranslation(r.translations, locale);
    if (!t) return [];
    return [
      {
        id: r.id,
        slug: r.slug,
        title: t.title,
        status: r.status,
        countryName: pickTranslation(r.country.translations, locale)?.name ?? r.country.slug,
        updatedAt: r.updatedAt,
        scheduledAt: r.scheduledAt,
      },
    ];
  });
}

export type OptionItem = { id: string; label: string };

export type AdminFormOptions = {
  cuisines: OptionItem[];
  countries: OptionItem[];
  cities: OptionItem[];
  eras: OptionItem[];
  civilizations: OptionItem[];
  categories: OptionItem[];
  authors: OptionItem[];
  ingredients: OptionItem[];
};

/** Tarif oluşturma/düzenleme formundaki taxonomy/malzeme seçim listeleri. */
export async function getAdminFormOptions(locale: string): Promise<AdminFormOptions> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const [cuisines, countries, cities, eras, civilizations, categories, authors, ingredients] = await Promise.all([
    db.cuisine.findMany({ include: { translations: { where: localeFilter } } }),
    db.country.findMany({ include: { translations: { where: localeFilter } } }),
    db.city.findMany({ include: { translations: { where: localeFilter } } }),
    db.era.findMany({ include: { translations: { where: localeFilter } } }),
    db.civilization.findMany({ include: { translations: { where: localeFilter } } }),
    db.category.findMany({ include: { translations: { where: localeFilter } } }),
    db.author.findMany(),
    db.ingredient.findMany({ include: { translations: { where: localeFilter } } }),
  ]);

  const toOptions = <T extends { id: string; slug: string; translations: { locale: string; name: string }[] }>(
    rows: T[]
  ): OptionItem[] => rows.map((r) => ({ id: r.id, label: pickTranslation(r.translations, locale)?.name ?? r.slug }));

  return {
    cuisines: toOptions(cuisines),
    countries: toOptions(countries),
    cities: toOptions(cities),
    eras: toOptions(eras),
    civilizations: toOptions(civilizations),
    categories: toOptions(categories),
    authors: authors.map((a) => ({ id: a.id, label: a.name })),
    ingredients: toOptions(ingredients),
  };
}

export type AdminRecipeDetail = {
  id: string;
  slug: string;
  cuisineId: string;
  countryId: string;
  cityId: string | null;
  eraId: string | null;
  civilizationId: string | null;
  categoryId: string | null;
  authorId: string;
  prepMinutes: number;
  cookMinutes: number;
  restMinutes: number | null;
  servings: number;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  tr: { title: string; summary: string; history: string; metaTitle: string; metaDesc: string };
  en: { title: string; summary: string; history: string; metaTitle: string; metaDesc: string };
  ingredients: {
    ingredientId: string;
    quantity: number;
    unit: string;
    note: string;
    groupLabel: string;
    isOptional: boolean;
    sortOrder: number;
  }[];
  steps: {
    sortOrder: number;
    durationMinutes: number | null;
    tr: { title: string; content: string };
    en: { title: string; content: string };
  }[];
  nutrition: { calories: number; proteinG: number; fatG: number; carbsG: number; isAiEstimated: boolean } | null;
};

/** Düzenleme formunu doldurmak için ham (statüden bağımsız, tüm locale'ler) tarif verisi. */
export async function getAdminRecipeDetail(id: string): Promise<AdminRecipeDetail | null> {
  const recipe = await db.recipe.findUnique({
    where: { id },
    include: {
      translations: true,
      ingredients: { orderBy: { sortOrder: "asc" } },
      steps: { orderBy: { sortOrder: "asc" }, include: { translations: true } },
      nutrition: true,
    },
  });
  if (!recipe) return null;

  const tr = recipe.translations.find((t) => t.locale === "tr");
  const en = recipe.translations.find((t) => t.locale === "en");

  return {
    id: recipe.id,
    slug: recipe.slug,
    cuisineId: recipe.cuisineId,
    countryId: recipe.countryId,
    cityId: recipe.cityId,
    eraId: recipe.eraId,
    civilizationId: recipe.civilizationId,
    categoryId: recipe.categoryId,
    authorId: recipe.authorId,
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    restMinutes: recipe.restMinutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    tr: {
      title: tr?.title ?? "",
      summary: tr?.summary ?? "",
      history: tr?.history ?? "",
      metaTitle: tr?.metaTitle ?? "",
      metaDesc: tr?.metaDesc ?? "",
    },
    en: {
      title: en?.title ?? "",
      summary: en?.summary ?? "",
      history: en?.history ?? "",
      metaTitle: en?.metaTitle ?? "",
      metaDesc: en?.metaDesc ?? "",
    },
    ingredients: recipe.ingredients.map((i) => ({
      ingredientId: i.ingredientId,
      quantity: i.quantity.toNumber(),
      unit: i.unit,
      note: i.note ?? "",
      groupLabel: i.groupLabel ?? "",
      isOptional: i.isOptional,
      sortOrder: i.sortOrder,
    })),
    steps: recipe.steps.map((s) => {
      const st = s.translations.find((t) => t.locale === "tr");
      const se = s.translations.find((t) => t.locale === "en");
      return {
        sortOrder: s.sortOrder,
        durationMinutes: s.durationMinutes,
        tr: { title: st?.title ?? "", content: st?.content ?? "" },
        en: { title: se?.title ?? "", content: se?.content ?? "" },
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
  };
}

export type AdminCommentRow = {
  id: string;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";
  createdAt: Date;
  userName: string;
  recipeSlug: string;
  recipeTitle: string;
};

/** Moderasyon kuyruğu — varsayılan olarak PENDING, ama tüm statüler de görüntülenebilir. */
export async function getAdminCommentList(locale: string, statusFilter?: string): Promise<AdminCommentRow[]> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const comments = await db.comment.findMany({
    where: statusFilter ? { status: statusFilter as "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN" } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { displayName: true, email: true } },
      recipe: { select: { slug: true, translations: { where: localeFilter } } },
    },
  });

  return comments.map((c) => ({
    id: c.id,
    content: c.content,
    status: c.status,
    createdAt: c.createdAt,
    userName: c.user.displayName ?? c.user.email,
    recipeSlug: c.recipe.slug,
    recipeTitle: pickTranslation(c.recipe.translations, locale)?.title ?? c.recipe.slug,
  }));
}

export type UnverifiedAlternativeRow = {
  id: string;
  ingredientName: string;
  alternativeName: string;
  type: string;
  ratio: number;
  aiExplanation: string | null;
  createdAt: Date;
};

/** AI'nin (bot) önerdiği, henüz EDITOR+ tarafından onaylanmamış malzeme alternatifleri. */
export async function getUnverifiedAlternatives(locale: string): Promise<UnverifiedAlternativeRow[]> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const rows = await db.ingredientAlternative.findMany({
    where: { isVerified: false },
    orderBy: { createdAt: "desc" },
    include: {
      ingredient: { include: { translations: { where: localeFilter } } },
      alternative: { include: { translations: { where: localeFilter } } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    ingredientName: pickTranslation(r.ingredient.translations, locale)?.name ?? r.ingredient.slug,
    alternativeName: pickTranslation(r.alternative.translations, locale)?.name ?? r.alternative.slug,
    type: r.type,
    ratio: r.ratio.toNumber(),
    aiExplanation: r.aiExplanation,
    createdAt: r.createdAt,
  }));
}
