import { PrismaClient, type AlternativeType, type Difficulty, type SourceType, type Unit } from "@prisma/client";
import { ottomanSeed } from "./data/ottoman";
import { greekSeed } from "./data/greek";
import { persianSeed } from "./data/persian";
import { authorsSeed } from "./data/authors";
import { recipesSeed } from "./data/recipes";
import { greekRecipesSeed } from "./data/greek-recipes";
import { timelineEventsSeed } from "./data/timeline";
import type { CuisineTaxonomySeed, RecipeSeedItem } from "./data/types";

const db = new PrismaClient();

const countryIds = new Map<string, string>();
const cityIds = new Map<string, string>();
const civilizationIds = new Map<string, string>();
const eraIds = new Map<string, string>();
const cuisineIds = new Map<string, string>();
const categoryIds = new Map<string, string>();
const ingredientIds = new Map<string, string>();
const authorIds = new Map<string, string>();
const recipeIds = new Map<string, string>();

/** Bir mutfağın coğrafya/tarih/malzeme taksonomisini yükler; slug -> id map'lerini doldurur. */
async function processTaxonomy(s: CuisineTaxonomySeed) {
  const country = await db.country.upsert({
    where: { slug: s.country.slug },
    update: {},
    create: {
      slug: s.country.slug,
      iso2: s.country.iso2,
      latitude: s.country.latitude,
      longitude: s.country.longitude,
      translations: { create: [{ locale: "tr", ...s.country.tr }, { locale: "en", ...s.country.en }] },
    },
  });
  countryIds.set(s.country.slug, country.id);

  const city = await db.city.upsert({
    where: { slug: s.city.slug },
    update: {},
    create: {
      slug: s.city.slug,
      countryId: country.id,
      latitude: s.city.latitude,
      longitude: s.city.longitude,
      translations: { create: [{ locale: "tr", ...s.city.tr }, { locale: "en", ...s.city.en }] },
    },
  });
  cityIds.set(s.city.slug, city.id);

  const civilization = await db.civilization.upsert({
    where: { slug: s.civilization.slug },
    update: {},
    create: {
      slug: s.civilization.slug,
      startYear: s.civilization.startYear,
      endYear: s.civilization.endYear,
      translations: { create: [{ locale: "tr", ...s.civilization.tr }, { locale: "en", ...s.civilization.en }] },
    },
  });
  civilizationIds.set(s.civilization.slug, civilization.id);

  const era = await db.era.upsert({
    where: { slug: s.era.slug },
    update: {},
    create: {
      slug: s.era.slug,
      civilizationId: civilization.id,
      startYear: s.era.startYear,
      endYear: s.era.endYear,
      translations: { create: [{ locale: "tr", ...s.era.tr }, { locale: "en", ...s.era.en }] },
    },
  });
  eraIds.set(s.era.slug, era.id);

  const cuisine = await db.cuisine.upsert({
    where: { slug: s.cuisine.slug },
    update: {},
    create: {
      slug: s.cuisine.slug,
      translations: { create: [{ locale: "tr", ...s.cuisine.tr }, { locale: "en", ...s.cuisine.en }] },
    },
  });
  cuisineIds.set(s.cuisine.slug, cuisine.id);

  for (const c of s.categories) {
    if (categoryIds.has(c.slug)) continue;
    const row = await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, translations: { create: [{ locale: "tr", name: c.tr }, { locale: "en", name: c.en }] } },
    });
    categoryIds.set(c.slug, row.id);
  }

  for (const ing of s.ingredients) {
    if (ingredientIds.has(ing.slug)) continue;
    const row = await db.ingredient.upsert({
      where: { slug: ing.slug },
      update: {},
      create: {
        slug: ing.slug,
        category: ing.category,
        isAllergen: ing.isAllergen ?? false,
        translations: { create: [{ locale: "tr", name: ing.tr }, { locale: "en", name: ing.en }] },
      },
    });
    ingredientIds.set(ing.slug, row.id);
  }

  for (const alt of s.alternatives) {
    const ingredientId = ingredientIds.get(alt.ingredient)!;
    const alternativeId = ingredientIds.get(alt.alternative)!;
    await db.ingredientAlternative.upsert({
      where: { ingredientId_alternativeId_type: { ingredientId, alternativeId, type: alt.type as AlternativeType } },
      update: {},
      create: { ingredientId, alternativeId, type: alt.type as AlternativeType, ratio: alt.ratio, isVerified: true },
    });
  }

  return {
    defaultCountrySlug: s.country.slug,
    defaultCuisineSlug: s.cuisine.slug,
    defaultCitySlug: s.city.slug,
    defaultEraSlug: s.era.slug,
    defaultCivilizationSlug: s.civilization.slug,
  };
}

async function processRecipes(items: readonly RecipeSeedItem[], defaults: Awaited<ReturnType<typeof processTaxonomy>>) {
  for (const r of items) {
    const recipe = await db.recipe.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        slug: r.slug,
        status: "PUBLISHED",
        cuisineId: cuisineIds.get(r.cuisineSlug ?? defaults.defaultCuisineSlug)!,
        countryId: countryIds.get(r.countrySlug ?? defaults.defaultCountrySlug)!,
        cityId: cityIds.get(r.citySlug ?? defaults.defaultCitySlug) ?? null,
        eraId: eraIds.get(r.eraSlug ?? defaults.defaultEraSlug) ?? null,
        civilizationId: civilizationIds.get(r.civilizationSlug ?? defaults.defaultCivilizationSlug) ?? null,
        categoryId: categoryIds.get(r.categorySlug)!,
        authorId: authorIds.get(r.authorSlug)!,
        latitude: r.latitude,
        longitude: r.longitude,
        prepMinutes: r.prepMinutes,
        cookMinutes: r.cookMinutes,
        restMinutes: r.restMinutes,
        servings: r.servings,
        difficulty: r.difficulty as Difficulty,
        publishedAt: new Date(r.publishedAt),
        translations: { create: [{ locale: "tr", ...r.tr }, { locale: "en", ...r.en }] },
        steps: {
          create: r.steps.map((step) => ({
            sortOrder: step.sortOrder,
            durationMinutes: step.durationMinutes,
            translations: { create: [{ locale: "tr", ...step.tr }, { locale: "en", ...step.en }] },
          })),
        },
        ingredients: {
          create: r.ingredients.map((i) => ({
            ingredientId: ingredientIds.get(i.ingredientSlug)!,
            quantity: i.quantity,
            unit: i.unit as Unit,
            note: i.note,
            groupLabel: i.groupLabel,
            isOptional: i.isOptional,
            sortOrder: i.sortOrder,
          })),
        },
        nutrition: { create: r.nutrition },
      },
    });

    let source = await db.historicalSource.findFirst({ where: { title: r.source.title, author: r.source.author } });
    if (!source) {
      source = await db.historicalSource.create({
        data: {
          type: r.source.type as SourceType,
          title: r.source.title,
          author: r.source.author,
          year: r.source.year,
          reliability: r.source.reliability,
          notes: r.source.notes,
        },
      });
    }
    await db.recipeSource.upsert({
      where: { recipeId_sourceId: { recipeId: recipe.id, sourceId: source.id } },
      update: {},
      create: { recipeId: recipe.id, sourceId: source.id, citation: r.source.citation },
    });

    recipeIds.set(r.slug, recipe.id);
  }
}

/** Idempotent seed: upsert kullanır, tekrar çalıştırmak güvenlidir. */
async function main() {
  console.log("🌍 GastrAtlas seed başlıyor...");

  const ottomanDefaults = await processTaxonomy(ottomanSeed);
  const greekDefaults = await processTaxonomy(greekSeed);
  await processTaxonomy(persianSeed);

  for (const a of authorsSeed) {
    const row = await db.author.upsert({
      where: { slug: a.slug },
      update: {},
      create: { slug: a.slug, name: a.name, bio: a.bio },
    });
    authorIds.set(a.slug, row.id);
  }

  await processRecipes(recipesSeed, ottomanDefaults);
  await processRecipes(greekRecipesSeed, greekDefaults);

  for (const ev of timelineEventsSeed) {
    await db.timelineEvent.upsert({
      where: { slug: ev.slug },
      update: {},
      create: {
        slug: ev.slug,
        year: ev.year,
        eraId: eraIds.get(ev.eraSlug) ?? null,
        recipeId: ev.recipeSlug ? recipeIds.get(ev.recipeSlug) : null,
        translations: { create: [{ locale: "tr", ...ev.tr }, { locale: "en", ...ev.en }] },
      },
    });
  }

  console.log("✅ Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
