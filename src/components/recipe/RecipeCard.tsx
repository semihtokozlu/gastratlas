import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Difficulty } from "@prisma/client";

export function RecipeCard({
  slug,
  title,
  countryName,
  eraName,
  prepMinutes,
  cookMinutes,
  difficulty,
}: {
  slug: string;
  title: string;
  countryName: string;
  eraName: string | null;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: Difficulty;
}) {
  const t = useTranslations("recipe");

  return (
    <Link
      href={`/recipes/${slug}`}
      className="group block overflow-hidden rounded-lg transition-transform duration-200 ease-brand hover:scale-[1.02]"
    >
      <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-surface to-primary/10 transition-[filter] duration-200 ease-brand group-hover:brightness-105" />
      <p className="mt-3 text-xs uppercase tracking-[0.15em] text-accent">
        {countryName}
        {eraName ? ` · ${eraName}` : ""}
      </p>
      <h3 className="mt-1 line-clamp-2 font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
        {title}
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        {prepMinutes + cookMinutes} {t("minutesAbbr")} · {t(`difficulty.${difficulty}`)}
      </p>
    </Link>
  );
}
