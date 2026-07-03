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

/** Negatif yıl = M.Ö. — kullanıcıya okunur biçimde gösterilir. */
export function formatYear(year: number, locale: string): string {
  const isBce = year < 0;
  const abs = Math.abs(year);
  if (locale === "tr") return isBce ? `M.Ö. ${abs}` : `M.S. ${abs}`;
  return isBce ? `${abs} BCE` : `${abs} CE`;
}

export type EraDetail = {
  slug: string;
  name: string;
  description: string | null;
  startYear: number;
  endYear: number | null;
  civilizationName: string | null;
};

export async function getEraBySlug(slug: string, locale: string): Promise<EraDetail | null> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const era = await db.era.findUnique({
    where: { slug },
    include: {
      translations: { where: localeFilter },
      civilization: { include: { translations: { where: localeFilter } } },
    },
  });
  if (!era) return null;

  const t = pickTranslation(era.translations, locale);
  if (!t) return null;

  return {
    slug: era.slug,
    name: t.name,
    description: t.description ?? null,
    startYear: era.startYear,
    endYear: era.endYear,
    civilizationName: era.civilization ? (pickTranslation(era.civilization.translations, locale)?.name ?? null) : null,
  };
}

export async function getPublishedEraSlugs(): Promise<string[]> {
  const rows = await db.era.findMany({
    where: { recipes: { some: { status: "PUBLISHED" } } },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
