import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { FilterOption } from "@/features/recipes/queries";

function buildHref(
  current: { country?: string; era?: string; category?: string },
  key: "country" | "era" | "category",
  value?: string
) {
  const next = { ...current, [key]: value };
  const params = new URLSearchParams();
  if (next.country) params.set("country", next.country);
  if (next.era) params.set("era", next.era);
  if (next.category) params.set("category", next.category);
  const qs = params.toString();
  return qs ? `/recipes?${qs}` : "/recipes";
}

function FilterGroup({
  label,
  options,
  activeSlug,
  filterKey,
  current,
  allLabel,
}: {
  label: string;
  options: FilterOption[];
  activeSlug?: string;
  filterKey: "country" | "era" | "category";
  current: { country?: string; era?: string; category?: string };
  allLabel: string;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wide text-ink-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref(current, filterKey, undefined)}
          className={`rounded-md border px-3 py-1 text-sm transition-colors duration-200 ease-brand ${
            !activeSlug ? "border-primary bg-primary text-bg" : "border-line text-ink-muted hover:text-ink"
          }`}
        >
          {allLabel}
        </Link>
        {options.map((opt) => (
          <Link
            key={opt.slug}
            href={buildHref(current, filterKey, opt.slug)}
            className={`rounded-md border px-3 py-1 text-sm transition-colors duration-200 ease-brand ${
              activeSlug === opt.slug ? "border-primary bg-primary text-bg" : "border-line text-ink-muted hover:text-ink"
            }`}
          >
            {opt.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function FilterBar({
  filterOptions,
  activeFilters,
}: {
  filterOptions: { countries: FilterOption[]; eras: FilterOption[]; categories: FilterOption[] };
  activeFilters: { country?: string; era?: string; category?: string };
}) {
  const t = useTranslations("recipesPage");

  return (
    <div className="mb-10 space-y-5">
      <FilterGroup
        label={t("filterCountry")}
        options={filterOptions.countries}
        activeSlug={activeFilters.country}
        filterKey="country"
        current={activeFilters}
        allLabel={t("filterAll")}
      />
      <FilterGroup
        label={t("filterEra")}
        options={filterOptions.eras}
        activeSlug={activeFilters.era}
        filterKey="era"
        current={activeFilters}
        allLabel={t("filterAll")}
      />
      <FilterGroup
        label={t("filterCategory")}
        options={filterOptions.categories}
        activeSlug={activeFilters.category}
        filterKey="category"
        current={activeFilters}
        allLabel={t("filterAll")}
      />
    </div>
  );
}
