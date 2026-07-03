/**
 * Faz 3 çok-mutfak desteği: her tarif kaydı hangi ülke/mutfak/şehir/dönem/
 * medeniyete ait olduğunu slug ile belirtebilir (belirtilmezse kendi
 * setinin varsayılanı kullanılır). Bu, bir Yunan tarifinin Osmanlı
 * dönemine (kültürel etkileşim) atıfta bulunabilmesini sağlar.
 */
export type RecipeSeedItem = {
  slug: string;
  countrySlug?: string;
  cuisineSlug?: string;
  citySlug?: string;
  eraSlug?: string;
  civilizationSlug?: string;
  categorySlug: string;
  authorSlug: string;
  latitude: number;
  longitude: number;
  prepMinutes: number;
  cookMinutes: number;
  restMinutes: number | null;
  servings: number;
  difficulty: string;
  publishedAt: string;
  tr: { title: string; summary: string; history: string; metaTitle: string; metaDesc: string };
  en: { title: string; summary: string; history: string; metaTitle: string; metaDesc: string };
  ingredients: readonly {
    ingredientSlug: string;
    quantity: number;
    unit: string;
    groupLabel: string | null;
    isOptional: boolean;
    note: string | null;
    sortOrder: number;
  }[];
  steps: readonly {
    sortOrder: number;
    durationMinutes: number | null;
    tr: { title: string; content: string };
    en: { title: string; content: string };
  }[];
  nutrition: { calories: number; proteinG: number; fatG: number; carbsG: number; isAiEstimated: boolean };
  source: {
    title: string;
    author: string | null;
    year: number | null;
    type: string;
    reliability: number;
    notes: string;
    citation: string | null;
  };
};

export type CuisineTaxonomySeed = {
  country: {
    slug: string;
    iso2: string;
    latitude: number;
    longitude: number;
    tr: { name: string; description: string };
    en: { name: string; description: string };
  };
  city: {
    slug: string;
    latitude: number;
    longitude: number;
    tr: { name: string };
    en: { name: string };
  };
  civilization: {
    slug: string;
    startYear: number;
    endYear: number;
    tr: { name: string; description: string };
    en: { name: string; description: string };
  };
  era: {
    slug: string;
    startYear: number;
    endYear: number;
    tr: { name: string; description: string };
    en: { name: string; description: string };
  };
  cuisine: {
    slug: string;
    tr: { name: string; description: string };
    en: { name: string; description: string };
  };
  categories: readonly { slug: string; tr: string; en: string }[];
  ingredients: readonly { slug: string; category: string; tr: string; en: string; isAllergen?: boolean }[];
  alternatives: readonly { ingredient: string; alternative: string; type: string; ratio: number }[];
};
