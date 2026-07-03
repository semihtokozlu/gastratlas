/**
 * Yunan mutfağı taksonomisi — Faz 3 "ikinci mutfak" dilimi.
 * Kabul testi: bu dosya ve greek-recipes.ts, ottoman.ts/recipes.ts'in
 * birebir aynı şeklini (RecipeSeedItem/CuisineTaxonomySeed) kullanır —
 * hiçbir Prisma şema/migration değişikliği gerektirmez.
 *
 * Era olarak Bizans dönemi varsayılan alındı (Yunan mutfağının derin
 * tarihsel kökü); ama paylaşılan Osmanlı-Yunan mirasına sahip tarifler
 * (ör. dolmades) bilinçli olarak ottoman.ts'teki "classical-ottoman-period"
 * dönemine bağlanır (greek-recipes.ts'te eraSlug override'ı ile) — bu,
 * mimarinin "kültürel etkileşim haritası" hedefinin somut karşılığıdır.
 */

export const greekSeed = {
  country: {
    slug: "yunanistan",
    iso2: "GR",
    latitude: 39.0742,
    longitude: 21.8243,
    tr: { name: "Yunanistan", description: "Ege ve Akdeniz'in kesişiminde, Bizans ve Osmanlı miraslarının iç içe geçtiği bir mutfak coğrafyası." },
    en: { name: "Greece", description: "At the crossing of the Aegean and Mediterranean, a culinary geography where Byzantine and Ottoman legacies intertwine." },
  },
  city: {
    slug: "atina",
    latitude: 37.9838,
    longitude: 23.7275,
    tr: { name: "Atina" },
    en: { name: "Athens" },
  },
  civilization: {
    slug: "byzantine-empire",
    startYear: 330,
    endYear: 1453,
    tr: { name: "Bizans İmparatorluğu", description: "Konstantinopolis merkezli, Doğu Roma'nın devamı; mutfak kültürü hem Osmanlı hem modern Yunan mutfağını derinden etkilemiştir." },
    en: { name: "Byzantine Empire", description: "Centered on Constantinople, the continuation of the Eastern Roman Empire; its culinary culture deeply influenced both Ottoman and modern Greek cuisine." },
  },
  era: {
    slug: "byzantine-period",
    startYear: 330,
    endYear: 1453,
    tr: { name: "Bizans Dönemi", description: "Konstantinopolis'in kuruluşundan fethine uzanan, Yunan mutfağının pek çok temel unsurunun (zeytinyağı, yufka işleri, şerbetler) şekillendiği dönem." },
    en: { name: "Byzantine Period", description: "From the founding of Constantinople to its conquest — the period that shaped many foundational elements of Greek cuisine (olive oil, phyllo pastries, sherbets)." },
  },
  cuisine: {
    slug: "yunan-mutfagi",
    tr: { name: "Yunan Mutfağı", description: "Zeytinyağı, yufka ve mezeler etrafında şekillenen, Bizans ve Osmanlı miraslarını paylaşan Akdeniz mutfağı." },
    en: { name: "Greek Cuisine", description: "A Mediterranean cuisine built around olive oil, phyllo pastry, and mezes, sharing Byzantine and Ottoman heritage." },
  },
  categories: [
    { slug: "mezes", tr: "Mezeler", en: "Mezes" },
  ],
  ingredients: [
    { slug: "potato",       category: "vegetable", tr: "Patates",         en: "Potato" },
    { slug: "milk",         category: "dairy",     tr: "Süt",             en: "Milk", isAllergen: true },
    { slug: "hard-cheese",  category: "dairy",     tr: "Kaşar peyniri",   en: "Hard cheese", isAllergen: true },
    { slug: "cucumber",     category: "vegetable", tr: "Salatalık",       en: "Cucumber" },
    { slug: "spinach",      category: "vegetable", tr: "Ispanak",         en: "Spinach" },
    { slug: "feta-cheese",  category: "dairy",     tr: "Beyaz peynir",    en: "Feta cheese", isAllergen: true },
    { slug: "grape-leaves", category: "vegetable", tr: "Asma yaprağı",    en: "Grape leaves" },
  ],
  alternatives: [
    // Beyaz peynir → Kaşar: aynı doku profili değil ama ekonomik/yerel ikame olarak yaygın
    { ingredient: "feta-cheese", alternative: "hard-cheese", type: "ECONOMIC", ratio: 1.0 },
  ],
} as const;
