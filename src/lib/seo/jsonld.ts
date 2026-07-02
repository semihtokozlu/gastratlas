/**
 * Schema.org Recipe JSON-LD üreticisi.
 * Faz 1'de tarif sayfası bu builder'ı kullanacak; alanlar Google Rich Results
 * gereksinimlerine göre seçildi.
 */
export type RecipeJsonLdInput = {
  name: string;
  description: string;
  imageUrls: string[];
  authorName: string;
  datePublished?: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  ingredients: string[];
  steps: { name?: string; text: string }[];
  calories?: number;
  cuisine?: string;
  category?: string;
  url: string;
};

export function buildRecipeJsonLd(r: RecipeJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.name,
    description: r.description,
    image: r.imageUrls,
    author: { "@type": "Person", name: r.authorName },
    ...(r.datePublished && { datePublished: r.datePublished }),
    prepTime: `PT${r.prepMinutes}M`,
    cookTime: `PT${r.cookMinutes}M`,
    totalTime: `PT${r.prepMinutes + r.cookMinutes}M`,
    recipeYield: `${r.servings} servings`,
    ...(r.cuisine && { recipeCuisine: r.cuisine }),
    ...(r.category && { recipeCategory: r.category }),
    recipeIngredient: r.ingredients,
    recipeInstructions: r.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      ...(s.name && { name: s.name }),
      text: s.text,
    })),
    ...(r.calories && {
      nutrition: { "@type": "NutritionInformation", calories: `${r.calories} calories` },
    }),
    url: r.url,
  } as const;
}
