import { Link } from "@/i18n/navigation";
import { formatYear } from "@/features/eras/queries";
import type { TimelineEventData } from "@/features/timeline/queries";

export function TimelineRibbon({ events, locale }: { events: TimelineEventData[]; locale: string }) {
  return (
    <ol className="relative space-y-10 border-l-2 border-line pl-8">
      {events.map((ev) => (
        <li key={ev.slug} className="relative">
          <span className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
          <p className="text-xs uppercase tracking-[0.2em] text-accent">{formatYear(ev.year, locale)}</p>
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
      ))}
    </ol>
  );
}
