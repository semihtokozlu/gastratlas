import { useTranslations } from "next-intl";

export function SourceList({
  sources,
}: {
  sources: { title: string; author: string | null; year: number | null; url: string | null; citation: string | null; reliability: number }[];
}) {
  const t = useTranslations("recipe");
  if (sources.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-5 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("sourcesTitle")}
      </h2>
      <ul className="space-y-3 text-sm text-ink-muted">
        {sources.map((s, idx) => (
          <li key={idx}>
            <span className="italic text-ink">{s.title}</span>
            {s.author && <>, {s.author}</>}
            {s.year && <> ({s.year})</>}
            {s.citation && <>, {s.citation}</>}
            <span className="ml-2 tracking-widest text-secondary" aria-hidden>
              {"●".repeat(s.reliability)}
              {"○".repeat(Math.max(0, 5 - s.reliability))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
