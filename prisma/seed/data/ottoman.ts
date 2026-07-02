/**
 * Osmanlı mutfağı başlangıç verisi — Faz 1 içerik operasyonunun iskeleti.
 * Buradaki tarihsel metinler EDİTORYAL DOĞRULAMA BEKLEYEN taslaklardır
 * (status: DRAFT); yayına HISTORIAN onayı olmadan çıkmazlar.
 */

export const ottomanSeed = {
  country: {
    slug: "turkiye",
    iso2: "TR",
    latitude: 39.0,
    longitude: 35.0,
    tr: { name: "Türkiye", description: "Anadolu; Mezopotamya, Akdeniz ve Orta Asya mutfak geleneklerinin kesişim noktasıdır." },
    en: { name: "Türkiye", description: "Anatolia is the crossroads of Mesopotamian, Mediterranean and Central Asian culinary traditions." },
  },
  city: {
    slug: "istanbul",
    latitude: 41.0082,
    longitude: 28.9784,
    tr: { name: "İstanbul" },
    en: { name: "Istanbul" },
  },
  civilization: {
    slug: "ottoman-empire",
    startYear: 1299,
    endYear: 1922,
    tr: { name: "Osmanlı İmparatorluğu", description: "Üç kıtaya yayılan imparatorluk; saray mutfağı (Matbah-ı Âmire) dünya gastronomi tarihinin en örgütlü mutfak kurumlarından biridir." },
    en: { name: "Ottoman Empire", description: "An empire spanning three continents; its palace kitchen (Matbah-ı Âmire) was among the most organized culinary institutions in history." },
  },
  era: {
    slug: "classical-ottoman-period",
    startYear: 1453,
    endYear: 1600,
    tr: { name: "Klasik Dönem", description: "İstanbul'un fethinden 17. yüzyıla uzanan, saray mutfağının kurumsallaştığı dönem." },
    en: { name: "Classical Period", description: "From the conquest of Istanbul into the 17th century, when the palace kitchen became institutionalized." },
  },
  cuisine: {
    slug: "ottoman-cuisine",
    tr: { name: "Osmanlı Mutfağı", description: "Saray ve halk mutfağı olarak iki koldan gelişen, baharat yollarının kesişiminde şekillenmiş mutfak geleneği." },
    en: { name: "Ottoman Cuisine", description: "A culinary tradition shaped at the crossroads of spice routes, evolving along palace and folk lines." },
  },
  categories: [
    { slug: "soups",    tr: "Çorbalar",        en: "Soups" },
    { slug: "pilafs",   tr: "Pilavlar",        en: "Pilafs" },
    { slug: "desserts", tr: "Tatlılar",        en: "Desserts" },
    { slug: "mains",    tr: "Ana Yemekler",    en: "Main Dishes" },
    { slug: "sherbets", tr: "Şerbetler",       en: "Sherbets" },
  ],
  ingredients: [
    { slug: "rice",        category: "grain",  tr: "Pirinç",       en: "Rice" },
    { slug: "butter",      category: "dairy",  tr: "Tereyağı",     en: "Butter", isAllergen: true },
    { slug: "olive-oil",   category: "oil",    tr: "Zeytinyağı",   en: "Olive oil" },
    { slug: "chickpeas",   category: "legume", tr: "Nohut",        en: "Chickpeas" },
    { slug: "cinnamon",    category: "spice",  tr: "Tarçın",       en: "Cinnamon" },
    { slug: "saffron",     category: "spice",  tr: "Safran",       en: "Saffron" },
    { slug: "rose-water",  category: "aroma",  tr: "Gül suyu",     en: "Rose water" },
    { slug: "honey",       category: "sweet",  tr: "Bal",          en: "Honey" },
  ],
  alternatives: [
    // Tereyağı → Zeytinyağı: vegan ikame, hacimce ~%75
    { ingredient: "butter", alternative: "olive-oil", type: "VEGAN", ratio: 0.75 },
    // Safran → Tarçın değil! (aroma profili farklı) — ekonomik ikame örneği olarak
    // yanlış eşleme bilinçli eklenmedi; doğrulanmamış öneriler isVerified=false kalır.
  ],
} as const;
