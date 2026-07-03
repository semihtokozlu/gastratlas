import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getRecipeCards } from "@/features/recipes/queries";
import { getCountries } from "@/features/countries/queries";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { PersonalizedHomeSection } from "@/components/home/PersonalizedHomeSection";
import { Reveal } from "@/components/ui/Reveal";
import { CommunityCommentsWidget } from "@/components/home/CommunityCommentsWidget";
import { SurpriseMeButton } from "@/components/home/SurpriseMeButton";

export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const brand = await getTranslations("brand");
  const tCountries = await getTranslations({ locale, namespace: "countriesPage" });

  const [recipes, countries] = await Promise.all([getRecipeCards(locale), getCountries(locale)]);
  const featuredRecipes = recipes.slice(0, 6);

  return (
    <main>
      <section className="container flex flex-col items-center py-20 text-center">
        <p className="mb-6 text-sm uppercase tracking-[0.25em] text-accent">{brand("name")}</p>
        <h1 className="max-w-3xl text-ink" style={{ fontSize: "var(--text-display)", lineHeight: 1.1 }}>
          {t("heroTitle")}
        </h1>
        <p className="mt-6 max-w-xl text-ink-muted">{t("heroSubtitle")}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/recipes"
            className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-bg transition-colors duration-200 ease-brand hover:bg-primary-dark"
          >
            {t("cta")}
          </Link>
          <SurpriseMeButton />
          <Link
            href="/methodology"
            className="rounded-md border border-line px-8 py-3 text-sm text-ink-muted transition-colors duration-200 ease-brand hover:text-ink"
          >
            {t("methodologyLink")}
          </Link>
        </div>
      </section>

      <PersonalizedHomeSection />

      {featuredRecipes.length > 0 && (
        <section className="container py-12">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
              {t("featuredTitle")}
            </h2>
            <Link href="/recipes" className="text-sm text-ink-muted hover:text-ink">
              {t("viewAllRecipes")} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRecipes.map((recipe, idx) => (
              <Reveal key={recipe.slug} delayMs={idx * 60}>
                <RecipeCard {...recipe} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {countries.length > 0 && (
        <section className="container py-12">
          <h2 className="mb-8 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
            {t("cuisinesTitle")}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country, idx) => (
              <Reveal key={country.slug} delayMs={idx * 60}>
                <Link
                  href={`/countries/${country.slug}`}
                  className="block rounded-lg border border-line p-5 transition-colors duration-200 ease-brand hover:border-accent"
                >
                  <p className="font-serif text-ink" style={{ fontSize: "var(--text-h3)" }}>
                    {country.name}
                  </p>
                  {country.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{country.description}</p>
                  )}
                  <p className="mt-3 text-xs uppercase tracking-wide text-accent">
                    {country.recipeCount} {tCountries("recipeCount")}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CommunityCommentsWidget locale={locale} />
    </main>
  );
}
