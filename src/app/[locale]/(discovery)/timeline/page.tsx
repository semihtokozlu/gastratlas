import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getTimelineEvents } from "@/features/timeline/queries";
import { TimelineRibbon } from "@/components/timeline/TimelineRibbon";

export const revalidate = 3600;

type Params = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "timelinePage" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function TimelinePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("timelinePage");
  const events = await getTimelineEvents(locale);

  return (
    <main className="container max-w-3xl py-12">
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {t("title")}
      </h1>
      <p className="mb-12 mt-3 max-w-xl text-ink-muted">{t("subtitle")}</p>
      <TimelineRibbon events={events} locale={locale} />
    </main>
  );
}
