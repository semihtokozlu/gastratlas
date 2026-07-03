import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCountryBySlug, getPublishedCountrySlugs } from "@/features/countries/queries";
import { getRecipeCards } from "@/features/recipes/queries";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const slugs = await getPublishedCountrySlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const country = await getCountryBySlug(slug, locale);
  if (!country) return {};
  return { title: country.name, description: country.description ?? undefined };
}

export default async function CountryPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const country = await getCountryBySlug(slug, locale);
  if (!country) notFound();

  const t = await getTranslations("countriesPage");
  const recipes = await getRecipeCards(locale, { countrySlug: slug });

  return (
    <main className="container py-12">
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {country.name}
      </h1>
      {country.description && <p className="mt-3 max-w-2xl text-ink-muted">{country.description}</p>}

      <h2 className="mb-6 mt-12 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("recipesInCountry")}
      </h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.slug} {...recipe} />
        ))}
      </div>
    </main>
  );
}
