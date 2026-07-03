import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFilterOptions, getRecipeCards } from "@/features/recipes/queries";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { FilterBar } from "@/components/discovery/FilterBar";
import { Reveal } from "@/components/ui/Reveal";

type Params = { locale: string };
type SearchParams = { country?: string; era?: string; category?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recipesPage" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function RecipesPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const { country, era, category } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("recipesPage");
  const [filterOptions, recipes] = await Promise.all([
    getFilterOptions(locale),
    getRecipeCards(locale, { countrySlug: country, eraSlug: era, categorySlug: category }),
  ]);

  return (
    <main className="container py-12">
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-ink-muted">{t("subtitle")}</p>

      <div className="mt-10">
        <FilterBar filterOptions={filterOptions} activeFilters={{ country, era, category }} />
      </div>

      {recipes.length === 0 ? (
        <p className="text-ink-muted">{t("noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, idx) => (
            <Reveal key={recipe.slug} delayMs={idx * 60}>
              <RecipeCard {...recipe} />
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
