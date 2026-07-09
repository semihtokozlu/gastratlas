import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getTimelineEvents } from "@/features/timeline/queries";
import { TimelineRibbon } from "@/components/timeline/TimelineRibbon";
import { EMPIRE_COLORS, EMPIRE_I18N_KEYS, empireKeyForYearRange } from "@/lib/history/empires";

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
  const tMap = await getTranslations("mapPage");
  const events = await getTimelineEvents(locale);
  const activeEmpires = [...new Set(events.map((ev) => empireKeyForYearRange(ev.year)))];

  return (
    <main className="container max-w-3xl py-12">
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-ink-muted">{t("subtitle")}</p>
      {activeEmpires.length > 0 && (
        <div className="mb-10 mt-5 flex flex-wrap gap-4 rounded-lg border border-line bg-surface/40 px-4 py-3 text-xs">
          {activeEmpires.map((name) => (
            <div key={name} className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: EMPIRE_COLORS[name] }} />
              <span className="text-ink-muted">{EMPIRE_I18N_KEYS[name] ? tMap(EMPIRE_I18N_KEYS[name]) : name}</span>
            </div>
          ))}
        </div>
      )}
      <TimelineRibbon events={events} locale={locale} />
    </main>
  );
}
