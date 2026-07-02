import { PrismaClient, type AlternativeType, type Difficulty, type SourceType, type Unit } from "@prisma/client";
import { ottomanSeed as s } from "./data/ottoman";
import { authorsSeed } from "./data/authors";
import { recipesSeed } from "./data/recipes";

const db = new PrismaClient();

/** Idempotent seed: upsert kullanır, tekrar çalıştırmak güvenlidir. */
async function main() {
  console.log("🌍 GastrAtlas seed başlıyor...");

  const country = await db.country.upsert({
    where: { slug: s.country.slug },
    update: {},
    create: {
      slug: s.country.slug,
      iso2: s.country.iso2,
      latitude: s.country.latitude,
      longitude: s.country.longitude,
      translations: {
        create: [
          { locale: "tr", ...s.country.tr },
          { locale: "en", ...s.country.en },
        ],
      },
    },
  });

  const city = await db.city.upsert({
    where: { slug: s.city.slug },
    update: {},
    create: {
      slug: s.city.slug,
      countryId: country.id,
      latitude: s.city.latitude,
      longitude: s.city.longitude,
      translations: {
        create: [
          { locale: "tr", ...s.city.tr },
          { locale: "en", ...s.city.en },
        ],
      },
    },
  });

  const civilization = await db.civilization.upsert({
    where: { slug: s.civilization.slug },
    update: {},
    create: {
      slug: s.civilization.slug,
      startYear: s.civilization.startYear,
      endYear: s.civilization.endYear,
      translations: {
        create: [
          { locale: "tr", ...s.civilization.tr },
          { locale: "en", ...s.civilization.en },
        ],
      },
    },
  });

  const era = await db.era.upsert({
    where: { slug: s.era.slug },
    update: {},
    create: {
      slug: s.era.slug,
      civilizationId: civilization.id,
      startYear: s.era.startYear,
      endYear: s.era.endYear,
      translations: {
        create: [
          { locale: "tr", ...s.era.tr },
          { locale: "en", ...s.era.en },
        ],
      },
    },
  });

  const cuisine = await db.cuisine.upsert({
    where: { slug: s.cuisine.slug },
    update: {},
    create: {
      slug: s.cuisine.slug,
      translations: {
        create: [
          { locale: "tr", ...s.cuisine.tr },
          { locale: "en", ...s.cuisine.en },
        ],
      },
    },
  });

  const categoryIds = new Map<string, string>();
  for (const c of s.categories) {
    const row = await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        translations: {
          create: [
            { locale: "tr", name: c.tr },
            { locale: "en", name: c.en },
          ],
        },
      },
    });
    categoryIds.set(c.slug, row.id);
  }

  const ingredientIds = new Map<string, string>();
  for (const ing of s.ingredients) {
    const row = await db.ingredient.upsert({
      where: { slug: ing.slug },
      update: {},
      create: {
        slug: ing.slug,
        category: ing.category,
        isAllergen: "isAllergen" in ing ? ing.isAllergen : false,
        translations: {
          create: [
            { locale: "tr", name: ing.tr },
            { locale: "en", name: ing.en },
          ],
        },
      },
    });
    ingredientIds.set(ing.slug, row.id);
  }

  for (const alt of s.alternatives) {
    const ingredientId = ingredientIds.get(alt.ingredient)!;
    const alternativeId = ingredientIds.get(alt.alternative)!;
    await db.ingredientAlternative.upsert({
      where: {
        ingredientId_alternativeId_type: {
          ingredientId,
          alternativeId,
          type: alt.type as AlternativeType,
        },
      },
      update: {},
      create: {
        ingredientId,
        alternativeId,
        type: alt.type as AlternativeType,
        ratio: alt.ratio,
        isVerified: true,
      },
    });
  }

  const authorIds = new Map<string, string>();
  for (const a of authorsSeed) {
    const row = await db.author.upsert({
      where: { slug: a.slug },
      update: {},
      create: { slug: a.slug, name: a.name, bio: a.bio },
    });
    authorIds.set(a.slug, row.id);
  }

  for (const r of recipesSeed) {
    const recipe = await db.recipe.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        slug: r.slug,
        status: "PUBLISHED",
        cuisineId: cuisine.id,
        countryId: country.id,
        cityId: city.id,
        eraId: era.id,
        civilizationId: civilization.id,
        categoryId: categoryIds.get(r.categorySlug)!,
        authorId: authorIds.get(r.authorSlug)!,
        prepMinutes: r.prepMinutes,
        cookMinutes: r.cookMinutes,
        restMinutes: r.restMinutes,
        servings: r.servings,
        difficulty: r.difficulty as Difficulty,
        publishedAt: new Date(r.publishedAt),
        translations: {
          create: [
            { locale: "tr", ...r.tr },
            { locale: "en", ...r.en },
          ],
        },
        steps: {
          create: r.steps.map((step) => ({
            sortOrder: step.sortOrder,
            durationMinutes: step.durationMinutes,
            translations: {
              create: [
                { locale: "tr", ...step.tr },
                { locale: "en", ...step.en },
              ],
            },
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

    let source = await db.historicalSource.findFirst({
      where: { title: r.source.title, author: r.source.author },
    });
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
  }

  console.log("✅ Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
