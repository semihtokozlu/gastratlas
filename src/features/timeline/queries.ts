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

export type TimelineEventData = {
  slug: string;
  year: number;
  title: string;
  description: string | null;
  recipeSlug: string | null;
  recipeTitle: string | null;
  eraName: string | null;
  latitude: number | null;
  longitude: number | null;
};

export async function getTimelineEvents(locale: string): Promise<TimelineEventData[]> {
  const localeFilter = { locale: { in: [locale, routing.defaultLocale] } };

  const events = await db.timelineEvent.findMany({
    orderBy: { year: "asc" },
    include: {
      translations: { where: localeFilter },
      recipe: { include: { translations: { where: localeFilter } } },
      era: { include: { translations: { where: localeFilter } } },
    },
  });

  return events.flatMap((ev) => {
    const t = pickTranslation(ev.translations, locale);
    if (!t) return [];
    const recipeTranslation = ev.recipe ? pickTranslation(ev.recipe.translations, locale) : undefined;
    const eraTranslation = ev.era ? pickTranslation(ev.era.translations, locale) : undefined;
    const latitude = ev.latitude?.toNumber() ?? ev.recipe?.latitude?.toNumber() ?? null;
    const longitude = ev.longitude?.toNumber() ?? ev.recipe?.longitude?.toNumber() ?? null;
    return [
      {
        slug: ev.slug,
        year: ev.year,
        title: t.title,
        description: t.description ?? null,
        recipeSlug: ev.recipe?.slug ?? null,
        recipeTitle: recipeTranslation?.title ?? null,
        eraName: eraTranslation?.name ?? null,
        latitude,
        longitude,
      },
    ];
  });
}
