/**
 * Yunan mutfağı — ilk 4 tarif (Faz 3 dilimi).
 *
 * ÖNEMLİ: recipes.ts'teki uyarı burada da geçerlidir — tarihçe metinleri
 * AI taslağıdır, HISTORIAN doğrulaması bekliyor. Özellikle paylaşılan
 * miras (musaka, cacık, dolma) konularında kasıtlı olarak "kim icat etti"
 * iddiası yapılmamış, ortak/tartışmalı köken nötr dille ifade edilmiştir.
 *
 * "dolmades" tarifi bilinçli olarak eraSlug/civilizationSlug override'ıyla
 * ottoman.ts'teki "classical-ottoman-period"e bağlanmıştır — mimarinin
 * "kültürel etkileşim haritası" hedefinin somut örneği (bkz. seed/index.ts
 * processRecipes ve types.ts).
 */

import type { RecipeSeedItem } from "./types";

const source = {
  title: "The Foods of the Greek Islands",
  author: "Aglaia Kremezi",
  year: 2000,
  type: "BOOK",
  reliability: 3,
  notes: "AI taslağı — HISTORIAN doğrulaması bekliyor. Genel referans; bu tarifin doğrudan alıntısı değildir.",
  citation: null as string | null,
};

export const greekRecipesSeed: readonly RecipeSeedItem[] = [
  {
    slug: "musaka",
    categorySlug: "mains",
    authorSlug: "gastratlas-mutfak",
    latitude: 37.98,
    longitude: 23.72,
    prepMinutes: 40,
    cookMinutes: 60,
    restMinutes: null,
    servings: 6,
    difficulty: "HARD",
    publishedAt: "2026-07-03",
    tr: {
      title: "Musaka",
      summary: "Patlıcan, kıyma ve beşamel sosla katman katman fırınlanan Yunan güveci.",
      history:
        "Musaka, Osmanlı mutfağının \"musakka\" adlı sebze-et güvecinden türeyen, bölgenin farklı halklarınca paylaşılan bir yemek ailesine aittir; kelimenin kendisi Arapça bir kökten (soğutulmuş/ıslatılmış anlamında) gelir.\n\nBugün bilinen beşamel soslu, katmanlı Yunan versiyonunun 20. yüzyıl başında, Fransız mutfağından etkilenen aşçı Nikolaos Tselementes tarafından şekillendirildiği öne sürülür.\n\nBu metin editoryal doğrulama bekleyen bir taslaktır; kesin icat iddiaları ihtiyatla değerlendirilmelidir.",
      metaTitle: "Musaka Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc: "Patlıcan, kıyma ve beşamel sosla hazırlanan Yunan musakası: tarif ve tarihçe.",
    },
    en: {
      title: "Moussaka",
      summary: "Eggplant, minced meat, and béchamel sauce baked in layers — a Greek casserole.",
      history:
        "Moussaka belongs to a family of vegetable-and-meat casseroles shared across the region, descending from the Ottoman dish \"musakka\" — the word itself traces to a root meaning \"chilled\" or \"soaked\".\n\nThe layered version with béchamel known today is often said to have been shaped in the early 20th century by chef Nikolaos Tselementes, influenced by French cuisine.\n\nThis text is an editorial draft pending verification; definitive invention claims should be treated with caution.",
      metaTitle: "Moussaka Recipe & History | GastrAtlas",
      metaDesc: "Layered eggplant, minced meat, and béchamel — Greek moussaka. Recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "eggplant", quantity: 800, unit: "G", groupLabel: null, isOptional: false, note: null, sortOrder: 1 },
      { ingredientSlug: "potato", quantity: 400, unit: "G", groupLabel: null, isOptional: false, note: null, sortOrder: 2 },
      { ingredientSlug: "lamb", quantity: 500, unit: "G", groupLabel: "İç harç için", isOptional: false, note: "kıyma", sortOrder: 3 },
      { ingredientSlug: "onion", quantity: 1, unit: "PIECE", groupLabel: "İç harç için", isOptional: false, note: null, sortOrder: 4 },
      { ingredientSlug: "tomato", quantity: 2, unit: "PIECE", groupLabel: "İç harç için", isOptional: false, note: null, sortOrder: 5 },
      { ingredientSlug: "cinnamon", quantity: 1, unit: "TSP", groupLabel: "İç harç için", isOptional: false, note: null, sortOrder: 6 },
      { ingredientSlug: "butter", quantity: 40, unit: "G", groupLabel: "Beşamel için", isOptional: false, note: null, sortOrder: 7 },
      { ingredientSlug: "flour", quantity: 40, unit: "G", groupLabel: "Beşamel için", isOptional: false, note: null, sortOrder: 8 },
      { ingredientSlug: "milk", quantity: 500, unit: "ML", groupLabel: "Beşamel için", isOptional: false, note: null, sortOrder: 9 },
      { ingredientSlug: "hard-cheese", quantity: 100, unit: "G", groupLabel: "Beşamel için", isOptional: false, note: null, sortOrder: 10 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: 20,
        tr: { title: "Sebzeleri hazırlayın", content: "Patlıcan ve patatesleri dilimleyip hafifçe kızartın veya fırınlayın." },
        en: { title: "Prepare the vegetables", content: "Slice the eggplant and potatoes and lightly fry or roast them." },
      },
      {
        sortOrder: 2,
        durationMinutes: 20,
        tr: { title: "İç harcı pişirin", content: "Kıymayı soğan ve domatesle kavurup tarçınla tatlandırın." },
        en: { title: "Cook the filling", content: "Sauté the minced meat with onion and tomato, season with cinnamon." },
      },
      {
        sortOrder: 3,
        durationMinutes: 15,
        tr: { title: "Beşamel sosu yapın", content: "Tereyağı ve unu kavurup sütü azar azar ekleyerek pürüzsüz bir sos elde edin, peynirle karıştırın." },
        en: { title: "Make the béchamel", content: "Cook butter and flour, gradually whisk in the milk until smooth, then stir in the cheese." },
      },
      {
        sortOrder: 4,
        durationMinutes: 45,
        tr: { title: "Katmanlayıp fırınlayın", content: "Patlıcan, patates, kıyma harcı ve beşameli katman katman dizip fırında altın rengi olana kadar pişirin." },
        en: { title: "Layer and bake", content: "Layer the eggplant, potatoes, meat filling, and béchamel, then bake until golden." },
      },
    ],
    nutrition: { calories: 420, proteinG: 22, fatG: 28, carbsG: 22, isAiEstimated: true },
    source,
  },
  {
    slug: "tzatziki",
    categorySlug: "mezes",
    authorSlug: "gastratlas-mutfak",
    latitude: 37.99,
    longitude: 23.73,
    prepMinutes: 15,
    cookMinutes: 0,
    restMinutes: 30,
    servings: 4,
    difficulty: "EASY",
    publishedAt: "2026-07-03",
    tr: {
      title: "Cacık (Tzatziki)",
      summary: "Yoğurt, salatalık, sarımsak ve zeytinyağıyla hazırlanan serinletici meze.",
      history:
        "Cacık, Yunanca adıyla tzatziki, Osmanlı ve daha geniş Balkan-Anadolu mutfak coğrafyasında ortak olarak bulunan yoğurt bazlı bir mezedir; Türkçedeki \"cacık\" ile neredeyse birebir aynı hazırlanışa sahiptir.\n\nKelimenin kökeni tartışmalıdır; farklı kaynaklar farklı dillere dayandırır.\n\nBu metin editoryal doğrulama bekleyen bir taslaktır.",
      metaTitle: "Cacık (Tzatziki) Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc: "Yoğurt, salatalık ve sarımsakla hazırlanan Yunan mezesi tzatziki: tarif ve tarihçe.",
    },
    en: {
      title: "Tzatziki",
      summary: "A cooling meze of yogurt, cucumber, garlic, and olive oil.",
      history:
        "Tzatziki is a yogurt-based meze shared across the Ottoman and broader Balkan-Anatolian culinary geography; it is prepared almost identically to Turkish \"cacık\".\n\nThe word's etymology is debated, with different sources tracing it to different languages.\n\nThis text is an editorial draft pending verification.",
      metaTitle: "Tzatziki Recipe & History | GastrAtlas",
      metaDesc: "A cooling Greek meze of yogurt, cucumber, and garlic. Recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "yogurt", quantity: 400, unit: "G", groupLabel: null, isOptional: false, note: null, sortOrder: 1 },
      { ingredientSlug: "cucumber", quantity: 1, unit: "PIECE", groupLabel: null, isOptional: false, note: null, sortOrder: 2 },
      { ingredientSlug: "garlic", quantity: 2, unit: "PIECE", groupLabel: null, isOptional: false, note: null, sortOrder: 3 },
      { ingredientSlug: "olive-oil", quantity: 30, unit: "ML", groupLabel: null, isOptional: false, note: null, sortOrder: 4 },
      { ingredientSlug: "dill", quantity: 1, unit: "TSP", groupLabel: null, isOptional: true, note: "servis için", sortOrder: 5 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: 10,
        tr: { title: "Salatalığı hazırlayın", content: "Salatalığı rendeleyip fazla suyunu süzün." },
        en: { title: "Prepare the cucumber", content: "Grate the cucumber and squeeze out excess water." },
      },
      {
        sortOrder: 2,
        durationMinutes: 5,
        tr: { title: "Karıştırın", content: "Ezilmiş sarımsağı yoğurtla karıştırıp salatalığı ekleyin, zeytinyağı gezdirin." },
        en: { title: "Mix", content: "Stir crushed garlic into the yogurt, add the cucumber, and drizzle with olive oil." },
      },
      {
        sortOrder: 3,
        durationMinutes: null,
        tr: { title: "Dinlendirip servis edin", content: "Buzdolabında dinlendirip soğuk servis edin." },
        en: { title: "Chill and serve", content: "Chill in the refrigerator and serve cold." },
      },
    ],
    nutrition: { calories: 90, proteinG: 5, fatG: 6, carbsG: 4, isAiEstimated: true },
    source,
  },
  {
    slug: "spanakopita",
    categorySlug: "mezes",
    authorSlug: "gastratlas-mutfak",
    latitude: 37.97,
    longitude: 23.71,
    prepMinutes: 30,
    cookMinutes: 45,
    restMinutes: null,
    servings: 8,
    difficulty: "MEDIUM",
    publishedAt: "2026-07-03",
    tr: {
      title: "Ispanaklı Börek (Spanakopita)",
      summary: "Yufka arasında ıspanak ve beyaz peynirle hazırlanan fırın böreği.",
      history:
        "Spanakopita, Bizans mutfağının yufka işleri geleneğinden gelir; ince açılmış hamur yapraklarının katmanlanması tekniği daha sonra hem Yunan hem Osmanlı-Türk mutfaklarında (börek, baklava) paylaşılan bir yöntem hâline gelmiştir.\n\nBu metin editoryal doğrulama bekleyen bir taslaktır.",
      metaTitle: "Ispanaklı Börek (Spanakopita) Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc: "Yufka, ıspanak ve beyaz peynirle hazırlanan Yunan böreği spanakopita: tarif ve tarihçe.",
    },
    en: {
      title: "Spanakopita",
      summary: "A baked pastry of spinach and feta layered between sheets of phyllo.",
      history:
        "Spanakopita descends from the Byzantine tradition of thin-pastry cooking; the technique of layering finely rolled dough sheets later became a method shared by both Greek and Ottoman-Turkish cuisines (börek, baklava).\n\nThis text is an editorial draft pending verification.",
      metaTitle: "Spanakopita Recipe & History | GastrAtlas",
      metaDesc: "Spinach and feta baked in layers of phyllo — spanakopita. Recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "phyllo-dough", quantity: 400, unit: "G", groupLabel: null, isOptional: false, note: null, sortOrder: 1 },
      { ingredientSlug: "spinach", quantity: 500, unit: "G", groupLabel: null, isOptional: false, note: null, sortOrder: 2 },
      { ingredientSlug: "feta-cheese", quantity: 200, unit: "G", groupLabel: null, isOptional: false, note: null, sortOrder: 3 },
      { ingredientSlug: "egg", quantity: 2, unit: "PIECE", groupLabel: null, isOptional: false, note: null, sortOrder: 4 },
      { ingredientSlug: "onion", quantity: 1, unit: "PIECE", groupLabel: null, isOptional: false, note: null, sortOrder: 5 },
      { ingredientSlug: "olive-oil", quantity: 60, unit: "ML", groupLabel: null, isOptional: false, note: null, sortOrder: 6 },
      { ingredientSlug: "dill", quantity: 1, unit: "TSP", groupLabel: null, isOptional: true, note: null, sortOrder: 7 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: 15,
        tr: { title: "Iç harcı hazırlayın", content: "Ispanağı soğanla kavurup suyunu süzün, peynir ve yumurtayla karıştırın." },
        en: { title: "Make the filling", content: "Sauté the spinach with onion, drain, and mix with the cheese and egg." },
      },
      {
        sortOrder: 2,
        durationMinutes: 15,
        tr: { title: "Yufkaları katlayın", content: "Yufkaları zeytinyağıyla yağlayıp iç harcı yayarak katlayın." },
        en: { title: "Fold the phyllo", content: "Brush the phyllo sheets with olive oil, spread the filling, and fold." },
      },
      {
        sortOrder: 3,
        durationMinutes: 45,
        tr: { title: "Fırınlayın", content: "Altın rengi ve gevrek olana kadar fırında pişirin." },
        en: { title: "Bake", content: "Bake until golden and crisp." },
      },
    ],
    nutrition: { calories: 280, proteinG: 10, fatG: 18, carbsG: 20, isAiEstimated: true },
    source,
  },
  {
    slug: "dolmades",
    categorySlug: "mezes",
    authorSlug: "gastratlas-mutfak",
    // Bilinçli override: paylaşılan Osmanlı-Yunan mirasını somutlaştırmak için
    // bu tarif Bizans varsayılanı yerine Osmanlı klasik dönemine bağlanır.
    eraSlug: "classical-ottoman-period",
    civilizationSlug: "ottoman-empire",
    latitude: 37.96,
    longitude: 23.74,
    prepMinutes: 45,
    cookMinutes: 40,
    restMinutes: 120,
    servings: 6,
    difficulty: "MEDIUM",
    publishedAt: "2026-07-03",
    tr: {
      title: "Yaprak Dolması (Dolmades)",
      summary: "Asma yaprağına sarılmış pirinç harcıyla hazırlanan, zeytinyağlı soğuk meze.",
      history:
        "Dolma/sarma geleneği, Osmanlı coğrafyasının en yaygın paylaşılan mutfak pratiklerinden biridir; \"dolma\" kelimesi Türkçe \"doldurmak\" fiilinden gelir ve bu isim Yunancaya doğrudan \"ντολμάδες (dolmades)\" olarak ödünçlenmiştir.\n\nZeytinyağlı, soğuk servis edilen versiyonu hem Yunan hem Türk mutfağında ortak bir miras olarak yaşamaya devam eder.\n\nBu tarif, bölgenin paylaşılan mutfak tarihini somutlaştırmak için bilinçli olarak Osmanlı klasik dönemine (bkz. Hünkârbeğendi, Aşure) bağlanmıştır. Bu metin editoryal doğrulama bekleyen bir taslaktır.",
      metaTitle: "Yaprak Dolması (Dolmades) Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc: "Asma yaprağına sarılmış pirinç harcıyla hazırlanan Yunan mezesi dolmades: tarif ve tarihçe.",
    },
    en: {
      title: "Dolmades (Stuffed Grape Leaves)",
      summary: "Grape leaves stuffed with a rice filling, served cold with olive oil.",
      history:
        "The dolma/sarma tradition is one of the most widely shared culinary practices of the Ottoman geography; the word \"dolma\" comes from the Turkish verb \"to stuff\", and was borrowed directly into Greek as \"ντολμάδες (dolmades)\".\n\nThe olive-oil, cold-served version continues to live on as a shared heritage in both Greek and Turkish cuisine.\n\nThis recipe is deliberately linked to the Ottoman classical period (see Hünkârbeğendi, Aşure) to make the region's shared culinary history concrete. This text is an editorial draft pending verification.",
      metaTitle: "Dolmades Recipe & History | GastrAtlas",
      metaDesc: "Grape leaves stuffed with rice, olive oil, and herbs — dolmades. Recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "grape-leaves", quantity: 40, unit: "PIECE", groupLabel: null, isOptional: false, note: null, sortOrder: 1 },
      { ingredientSlug: "rice", quantity: 200, unit: "G", groupLabel: null, isOptional: false, note: null, sortOrder: 2 },
      { ingredientSlug: "onion", quantity: 1, unit: "PIECE", groupLabel: null, isOptional: false, note: null, sortOrder: 3 },
      { ingredientSlug: "dill", quantity: 1, unit: "TBSP", groupLabel: null, isOptional: false, note: null, sortOrder: 4 },
      { ingredientSlug: "pine-nuts", quantity: 30, unit: "G", groupLabel: null, isOptional: true, note: null, sortOrder: 5 },
      { ingredientSlug: "currants", quantity: 30, unit: "G", groupLabel: null, isOptional: true, note: null, sortOrder: 6 },
      { ingredientSlug: "olive-oil", quantity: 80, unit: "ML", groupLabel: null, isOptional: false, note: null, sortOrder: 7 },
      { ingredientSlug: "lemon", quantity: 1, unit: "PIECE", groupLabel: null, isOptional: false, note: "suyu için", sortOrder: 8 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: 15,
        tr: { title: "İç harcı hazırlayın", content: "Pirinci soğan, dereotu, çam fıstığı ve kuş üzümüyle harmanlayın." },
        en: { title: "Make the filling", content: "Combine the rice with onion, dill, pine nuts, and currants." },
      },
      {
        sortOrder: 2,
        durationMinutes: 30,
        tr: { title: "Sarın", content: "Asma yapraklarına harçtan koyup sıkıca sarın." },
        en: { title: "Roll", content: "Place the filling on the grape leaves and roll tightly." },
      },
      {
        sortOrder: 3,
        durationMinutes: 40,
        tr: { title: "Pişirin", content: "Zeytinyağı ve suyla tencerede kısık ateşte pişirin." },
        en: { title: "Cook", content: "Simmer gently in the pot with olive oil and water." },
      },
      {
        sortOrder: 4,
        durationMinutes: null,
        tr: { title: "Soğutup servis edin", content: "İyice soğutup limon suyuyla servis edin." },
        en: { title: "Chill and serve", content: "Chill thoroughly and serve with lemon juice." },
      },
    ],
    nutrition: { calories: 150, proteinG: 3, fatG: 8, carbsG: 18, isAiEstimated: true },
    source,
  },
] as const;
