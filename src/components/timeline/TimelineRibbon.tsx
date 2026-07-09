import { Link } from "@/i18n/navigation";
import { formatYear } from "@/features/eras/queries";
import { empireColorForYearRange } from "@/lib/history/empires";
import type { TimelineEventData } from "@/features/timeline/queries";

export function TimelineRibbon({ events, locale }: { events: TimelineEventData[]; locale: string }) {
  return (
    <ol className="relative space-y-10 border-l-2 border-line pl-8">
      {events.map((ev) => {
        const color = empireColorForYearRange(ev.year);
        return (
          <li key={ev.slug} className="relative">
            <span
              className="absolute -left-[calc(2rem+7px)] top-1 h-3.5 w-3.5 rounded-full border-2"
              style={{ background: color, borderColor: "var(--color-bg)", boxShadow: "0 1px 3px rgb(43 42 40 / .3)" }}
            />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color }}>
                {formatYear(ev.year, locale)}
              </p>
              {ev.eraName && <p className="text-xs text-ink-muted">{ev.eraName}</p>}
            </div>
            <h3 className="mt-1 font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
              {ev.title}
            </h3>
            {ev.description && <p className="mt-1 max-w-2xl text-sm text-ink-muted">{ev.description}</p>}
            {ev.recipeSlug && (
              <Link href={`/recipes/${ev.recipeSlug}`} className="mt-2 inline-block text-sm text-primary underline">
                {ev.recipeTitle}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
