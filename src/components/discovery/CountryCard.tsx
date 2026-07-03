import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CountryCard({
  slug,
  name,
  description,
  recipeCount,
}: {
  slug: string;
  name: string;
  description: string | null;
  recipeCount: number;
}) {
  const t = useTranslations("countriesPage");

  return (
    <Link
      href={`/countries/${slug}`}
      className="block rounded-lg border border-line p-6 transition-colors duration-200 ease-brand hover:border-primary"
    >
      <h3 className="font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
        {name}
      </h3>
      {description && <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{description}</p>}
      <p className="mt-3 text-xs uppercase tracking-wide text-accent">
        {recipeCount} {t("recipeCount")}
      </p>
    </Link>
  );
}
