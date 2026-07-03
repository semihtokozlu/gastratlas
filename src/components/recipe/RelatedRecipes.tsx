import { getTranslations } from "next-intl/server";
import { getRelatedRecipes } from "@/features/recipes/queries";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Reveal } from "@/components/ui/Reveal";

export async function RelatedRecipes({
  recipeId,
  countrySlug,
  eraSlug,
  locale,
}: {
  recipeId: string;
  countrySlug: string;
  eraSlug: string | null;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "recipe" });
  const related = await getRelatedRecipes(recipeId, countrySlug, eraSlug, locale);

  if (related.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-5 font-serif text-ink" style={{ fontSize: "var(--text-h2)" }}>
        {t("relatedTitle")}
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((recipe, idx) => (
          <Reveal key={recipe.slug} delayMs={idx * 60}>
            <RecipeCard {...recipe} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
