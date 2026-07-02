import { useTranslations } from "next-intl";

export function RecipeHero({
  title,
  summary,
  countryName,
  eraName,
}: {
  title: string;
  summary: string;
  countryName: string;
  eraName: string | null;
}) {
  const t = useTranslations("recipe");

  return (
    <header className="mb-10 overflow-hidden rounded-lg border border-line">
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-surface to-primary/10 sm:aspect-[21/9]">
        <span className="text-xs uppercase tracking-widest text-ink-muted">
          {t("heroImagePlaceholder")}
        </span>
      </div>
      <div className="bg-bg px-6 py-8 sm:px-10">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-accent">
          {countryName}
          {eraName ? ` · ${eraName}` : ""}
        </p>
        <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-ink-muted">{summary}</p>
      </div>
    </header>
  );
}
