import { useTranslations } from "next-intl";

export function HistorySection({ history }: { history: string | null }) {
  const t = useTranslations("recipe");
  if (!history) return null;

  const paragraphs = history.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <section className="mb-12">
      <h2 className="mb-5 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("historyTitle")}
      </h2>
      <div className="max-w-2xl space-y-4 text-ink-muted" style={{ lineHeight: "var(--leading-body)" }}>
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    </section>
  );
}
