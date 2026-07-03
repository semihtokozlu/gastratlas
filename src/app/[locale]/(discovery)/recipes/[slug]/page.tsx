import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedRecipeSlugs, getRecipeBySlug } from "@/features/recipes/queries";
import { buildRecipeJsonLd } from "@/lib/seo/jsonld";
import { getPublicImageUrl } from "@/lib/storage/upload";
import { routing } from "@/i18n/routing";
import { RecipeHero } from "@/components/recipe/RecipeHero";
import { ViewTracker } from "@/components/recipe/ViewTracker";
import { MetaBar } from "@/components/recipe/MetaBar";
import { IngredientList } from "@/components/recipe/IngredientList";
import { StepList } from "@/components/recipe/StepList";
import { NutritionTable } from "@/components/recipe/NutritionTable";
import { HistorySection } from "@/components/recipe/HistorySection";
import { SourceList } from "@/components/recipe/SourceList";
import { CommentSection } from "@/components/recipe/CommentSection";
import { ShareBar } from "@/components/recipe/ShareBar";
import { FavoriteButton } from "@/components/recipe/FavoriteButton";
import { AddToCollectionButton } from "@/components/recipe/AddToCollectionButton";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { RelatedRecipes } from "@/components/recipe/RelatedRecipes";

export const revalidate = 3600;

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const slugs = await getPublishedRecipeSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const recipe = await getRecipeBySlug(slug, locale);
  if (!recipe) return {};

  return {
    title: recipe.metaTitle ?? recipe.title,
    description: recipe.metaDesc ?? recipe.summary,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/recipes/${slug}`])),
    },
    openGraph: {
      type: "article",
      title: recipe.metaTitle ?? recipe.title,
      description: recipe.metaDesc ?? recipe.summary,
      images: recipe.heroImage
        ? [getPublicImageUrl(recipe.heroImage.storagePath)]
        : [`/api/og?type=recipe&slug=${slug}&locale=${locale}`],
    },
  };
}

export default async function RecipePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const recipe = await getRecipeBySlug(slug, locale);
  if (!recipe) notFound();

  const t = await getTranslations({ locale, namespace: "recipe" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pageUrl = `${siteUrl}/${locale}/recipes/${slug}`;
  const jsonLd = buildRecipeJsonLd({
    name: recipe.title,
    description: recipe.summary,
    imageUrls: recipe.heroImage ? [getPublicImageUrl(recipe.heroImage.storagePath)] : [],
    authorName: recipe.authorName,
    datePublished: recipe.publishedAt?.toISOString(),
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    servings: recipe.servings,
    ingredients: recipe.ingredients.map((i) => `${i.quantity} ${t(`units.${i.unit}`)} ${i.name}`.trim()),
    steps: recipe.steps.map((s) => ({ name: s.title ?? undefined, text: s.content })),
    calories: recipe.nutrition?.calories,
    cuisine: recipe.cuisineName,
    url: pageUrl,
  });

  return (
    <main className="container max-w-3xl py-12">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ViewTracker recipeId={recipe.id} />
      <Breadcrumb
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("recipes"), href: "/recipes" },
          { label: recipe.title },
        ]}
      />
      <RecipeHero
        title={recipe.title}
        summary={recipe.summary}
        countryName={recipe.countryName}
        eraName={recipe.eraName}
        heroImage={recipe.heroImage}
      />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <ShareBar title={recipe.title} url={pageUrl} />
        <div className="flex items-center gap-3">
          <FavoriteButton recipeId={recipe.id} />
          <AddToCollectionButton recipeId={recipe.id} />
        </div>
      </div>
      <MetaBar
        prepMinutes={recipe.prepMinutes}
        cookMinutes={recipe.cookMinutes}
        restMinutes={recipe.restMinutes}
        servings={recipe.servings}
        difficulty={recipe.difficulty}
      />
      <IngredientList
        recipeId={recipe.id}
        baseServings={recipe.servings}
        locale={locale}
        initialIngredients={recipe.ingredients.map((i) => ({
          id: i.id,
          ingredientId: i.ingredientId,
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
          note: i.note,
          groupLabel: i.groupLabel,
          isOptional: i.isOptional,
          alternatives: i.alternatives,
        }))}
      />
      <StepList steps={recipe.steps} />
      <NutritionTable nutrition={recipe.nutrition} />
      <HistorySection history={recipe.history} />
      <SourceList sources={recipe.sources} />
      <RelatedRecipes
        recipeId={recipe.id}
        countrySlug={recipe.countrySlug}
        eraSlug={recipe.eraSlug}
        locale={locale}
      />
      <CommentSection recipeId={recipe.id} />
    </main>
  );
}
