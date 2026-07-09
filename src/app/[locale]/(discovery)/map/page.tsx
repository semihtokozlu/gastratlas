import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getRecipeGeoPoints } from "@/features/recipes/queries";
import { getTimelineEvents } from "@/features/timeline/queries";
import { MapLoader } from "@/components/map/MapLoader";

export const revalidate = 3600;

type Params = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mapPage" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function MapPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("mapPage");
  const points = await getRecipeGeoPoints(locale);
  const timelineEvents = await getTimelineEvents(locale);

  return (
    <main className="container py-12">
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {t("title")}
      </h1>
      <p className="mb-8 mt-3 max-w-xl text-ink-muted">{t("subtitle")}</p>
      <MapLoader points={points} timelineEvents={timelineEvents} />
    </main>
  );
}
