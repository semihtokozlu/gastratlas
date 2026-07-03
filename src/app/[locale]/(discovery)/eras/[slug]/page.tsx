import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getEraBySlug, getPublishedEraSlugs, formatYear } from "@/features/eras/queries";
import { getRecipeCards } from "@/features/recipes/queries";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const slugs = await getPublishedEraSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const era = await getEraBySlug(slug, locale);
  if (!era) return {};
  return { title: era.name, description: era.description ?? undefined };
}

export default async function EraPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const era = await getEraBySlug(slug, locale);
  if (!era) notFound();

  const t = await getTranslations("eraPage");
  const recipes = await getRecipeCards(locale, { eraSlug: slug });
  const yearRange = era.endYear
    ? `${formatYear(era.startYear, locale)} – ${formatYear(era.endYear, locale)}`
    : formatYear(era.startYear, locale);

  return (
    <main className="container py-12">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-accent">{yearRange}</p>
      <h1 className="font-serif text-ink" style={{ fontSize: "var(--text-h1)" }}>
        {era.name}
      </h1>
      {era.civilizationName && (
        <p className="mt-2 text-sm text-ink-muted">
          {t("civilization")}: {era.civilizationName}
        </p>
      )}
      {era.description && <p className="mt-4 max-w-2xl text-ink-muted">{era.description}</p>}

      <h2 className="mb-6 mt-12 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("recipesInEra")}
      </h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.slug} {...recipe} />
        ))}
      </div>
    </main>
  );
}
