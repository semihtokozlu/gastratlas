import { PrismaClient, type AlternativeType } from "@prisma/client";
import { ottomanSeed as s } from "./data/ottoman";

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

  await db.city.upsert({
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

  await db.era.upsert({
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

  await db.cuisine.upsert({
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

  for (const c of s.categories) {
    await db.category.upsert({
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

  console.log("✅ Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
