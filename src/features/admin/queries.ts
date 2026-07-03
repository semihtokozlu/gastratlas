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
