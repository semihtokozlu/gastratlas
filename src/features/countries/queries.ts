import { cache } from "react";
import { db } from "@/lib/db";
import { routing } from "@/i18n/routing";

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

export type CountryCardData = {
  slug: string;
  name: string;
  description: string | null;
  recipeCount: number;
};

export async function getCountries(locale: string): Promise<CountryCardData[]> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const countries = await db.country.findMany({
    where: { recipes: { some: { status: "PUBLISHED" } } },
    include: {
      translations: { where: localeFilter },
      _count: { select: { recipes: { where: { status: "PUBLISHED" } } } },
    },
  });

  return countries.flatMap((c) => {
    const t = pickTranslation(c.translations, locale);
    if (!t) return [];
    return [{ slug: c.slug, name: t.name, description: t.description ?? null, recipeCount: c._count.recipes }];
  });
}

export type CountryDetail = {
  slug: string;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
};

export const getCountryBySlug = cache(async (slug: string, locale: string): Promise<CountryDetail | null> => {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const country = await db.country.findUnique({
    where: { slug },
    include: { translations: { where: localeFilter } },
  });
  if (!country) return null;

  const t = pickTranslation(country.translations, locale);
  if (!t) return null;

  return {
    slug: country.slug,
    name: t.name,
    description: t.description ?? null,
    latitude: country.latitude?.toNumber() ?? null,
    longitude: country.longitude?.toNumber() ?? null,
  };
});

export async function getPublishedCountrySlugs(): Promise<string[]> {
  const rows = await db.country.findMany({
    where: { recipes: { some: { status: "PUBLISHED" } } },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
