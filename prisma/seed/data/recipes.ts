/**
 * İlk 2 tarif — Faz 1'in "uçtan uca tek tarif sayfası" dilimi için.
 *
 * ÖNEMLİ: Buradaki tarihçe/özet metinleri bu depoyu hazırlayan AI tarafından
 * yazılmış TASLAKlardır. Platformun kendi ilkesi ("AI hiçbir zaman doğrudan
 * yayına içerik basmaz", planlama §2.4) burada teknik olarak henüz
 * uygulanamıyor çünkü admin editoryal akışı (taslak → AI doğrulama → editör
 * onayı → HISTORIAN yayını) henüz kodlanmadı. Bu tarifler `status: PUBLISHED`
 * ile işaretlenip yalnızca sayfanın uçtan uca çalıştığını göstermek için
 * seed'e eklenmiştir — gerçek yayın kalitesinde kabul edilmemeli, bir
 * HISTORIAN/editör tarafından gözden geçirilmeden gerçek içerik sayılmamalıdır.
 * Tartışmalı/doğrulanmamış anlatılar bilinçli olarak "rivayete göre" gibi
 * ifadelerle hedge edilmiştir.
 */

export const recipesSeed = [
  {
    slug: "hunkarbegendi",
    categorySlug: "mains",
    authorSlug: "gastratlas-mutfak",
    prepMinutes: 25,
    cookMinutes: 75,
    restMinutes: null as number | null,
    servings: 4,
    difficulty: "MEDIUM",
    publishedAt: "2026-06-01",
    tr: {
      title: "Hünkârbeğendi",
      summary:
        "Köz patlıcan püresi üzerine servis edilen kuzu güveç; Osmanlı saray mutfağının en bilinen lezzetlerinden biri.",
      history:
        "Hünkârbeğendi adını, hükümdarın (hünkârın) bu yemeği beğenmesine atfeden bir saray mutfağı anlatısından alır; rivayete göre 19. yüzyılda bir Osmanlı sofrasında ağırlanan yabancı bir konuğa da bu tabak sunulmuştur.\n\nYemeğin çekirdeğini, köz patlıcanın tereyağıyla ezilerek elde edildiği kadifemsi bir püre ile üzerine dökülen kuzu güveci oluşturur; saray mutfağının et ve sebzeyi katman katman sunma geleneğinin tipik bir örneğidir.\n\nBu metin editoryal doğrulama bekleyen bir taslaktır; kesin tarihsel iddialar HISTORIAN onayından geçmeden nihai kabul edilmemelidir.",
      metaTitle: "Hünkârbeğendi Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc:
        "Osmanlı saray mutfağının klasik lezzeti Hünkârbeğendi: köz patlıcan püresi ve kuzu güveç. Tarihçe, malzemeler ve adım adım tarif.",
    },
    en: {
      title: "Hünkârbeğendi (Sultan's Delight)",
      summary:
        "Lamb stew served over a velvety smoked-eggplant purée — one of the best-known dishes of Ottoman palace cuisine.",
      history:
        "Hünkârbeğendi — literally \"the sultan liked it\" — carries a palace-kitchen story attributing its name to a ruler's approval of the dish; according to one popular account, a version was also served to a foreign guest at an Ottoman table in the 19th century.\n\nAt its core is a velvety purée of smoked, butter-mashed eggplant topped with a lamb stew — a characteristic example of the palace kitchen's tradition of layering meat over vegetable.\n\nThis text is an editorial draft pending verification; specific historical claims should not be treated as settled until reviewed by a HISTORIAN.",
      metaTitle: "Hünkârbeğendi Recipe & History | GastrAtlas",
      metaDesc:
        "A classic of Ottoman palace cuisine: lamb stew over smoked eggplant purée. History, ingredients, and step-by-step recipe.",
    },
    ingredients: [
      { ingredientSlug: "lamb", quantity: 600, unit: "G", groupLabel: "Güveç için", isOptional: false, note: null as string | null, sortOrder: 1 },
      { ingredientSlug: "butter", quantity: 20, unit: "G", groupLabel: "Güveç için", isOptional: false, note: null as string | null, sortOrder: 2 },
      { ingredientSlug: "eggplant", quantity: 800, unit: "G", groupLabel: "Püre için", isOptional: false, note: null as string | null, sortOrder: 3 },
      { ingredientSlug: "butter", quantity: 40, unit: "G", groupLabel: "Püre için", isOptional: false, note: null as string | null, sortOrder: 4 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: 15,
        tr: { title: "Eti kavurun", content: "Kuzu etini küp küp doğrayıp tereyağında kısık ateşte kavurun." },
        en: { title: "Sear the lamb", content: "Cut the lamb into cubes and sear in butter over low heat." },
      },
      {
        sortOrder: 2,
        durationMinutes: 45,
        tr: { title: "Güveci pişirin", content: "Tuz ve baharatlarla tatlandırıp kısık ateşte, et yumuşayana dek güveç kıvamında pişirin." },
        en: { title: "Braise the stew", content: "Season with salt and spices and simmer gently over low heat until the lamb is tender and stew-like." },
      },
      {
        sortOrder: 3,
        durationMinutes: 20,
        tr: { title: "Patlıcanları közleyin", content: "Patlıcanları doğrudan ateş üzerinde veya fırında, kabukları kararana kadar köz için." },
        en: { title: "Char the eggplants", content: "Char the eggplants directly over a flame or in the oven until the skins blacken." },
      },
      {
        sortOrder: 4,
        durationMinutes: 10,
        tr: { title: "Püreyi hazırlayın", content: "Patlıcanların kabuklarını soyup etini ezin, tereyağıyla birlikte kısık ateşte birkaç dakika pişirip kadifemsi bir kıvam elde edin." },
        en: { title: "Make the purée", content: "Peel the eggplants, mash the flesh, and cook briefly with butter over low heat until velvety smooth." },
      },
      {
        sortOrder: 5,
        durationMinutes: 5,
        tr: { title: "Servis edin", content: "Püreyi tabağa yayıp üzerine sıcak güveci dökerek servis edin." },
        en: { title: "Plate and serve", content: "Spread the purée on a plate and ladle the hot stew over it." },
      },
    ],
    nutrition: { calories: 480, proteinG: 28.5, fatG: 34.2, carbsG: 12.5, isAiEstimated: true },
    source: {
      title: "Bountiful Empire: A History of Ottoman Cuisine",
      author: "Priscilla Mary Işın",
      year: 2018,
      type: "BOOK",
      reliability: 3,
      notes: "AI taslağı — HISTORIAN doğrulaması bekliyor. Genel referans; bu tarifin doğrudan alıntısı değildir.",
      citation: null as string | null,
    },
  },
  {
    slug: "asure",
    categorySlug: "desserts",
    authorSlug: "gastratlas-mutfak",
    prepMinutes: 20,
    cookMinutes: 135,
    restMinutes: 480,
    servings: 8,
    difficulty: "EASY",
    publishedAt: "2026-06-08",
    tr: {
      title: "Aşure",
      summary:
        "Tahıl, baklagil ve kuru meyvelerle hazırlanan, Muharrem ayında paylaşılan geleneksel tatlı.",
      history:
        "Aşure, adını Hicri takvimin ilk ayı Muharrem'in onuncu günü olan Aşure Günü'nden alır ve Osmanlı mutfağında bu güne özgü bir paylaşma geleneğiyle özdeşleşmiştir.\n\nHalk arasında yaygın bir anlatıya göre tatlının çok sayıda malzemeden yapılması, Nuh'un gemisindeki son erzakın bir araya getirilmesi hikâyesine dayanır.\n\nSaray ve halk mutfağında aynı anda var olan nadir tatlılardan biri olarak, mahalle ve komşular arasında dağıtılması yoluyla toplumsal dayanışmanın bir simgesi hâline gelmiştir. Bu metin editoryal doğrulama bekleyen bir taslaktır.",
      metaTitle: "Aşure Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc:
        "Muharrem ayının geleneksel tatlısı Aşure: dövme buğday, nohut, kuru meyve ve cevizle hazırlanan tarif ve tarihçesi.",
    },
    en: {
      title: "Aşure (Noah's Pudding)",
      summary:
        "A traditional pudding of grains, legumes, and dried fruit, shared during the month of Muharram.",
      history:
        "Aşure takes its name from Ashura, the tenth day of Muharram, the first month of the Islamic calendar, and is tied in Ottoman culinary tradition to a custom of communal sharing on that day.\n\nA popular story holds that the dish's many ingredients recall the provisions gathered aboard Noah's Ark.\n\nAs one of the few desserts common to both palace and folk kitchens, its distribution among neighbors became a symbol of social solidarity. This text is an editorial draft pending verification.",
      metaTitle: "Aşure Recipe & History | GastrAtlas",
      metaDesc:
        "Aşure (Noah's Pudding), the traditional dessert of Muharram: wheat berries, chickpeas, dried fruit, and walnuts. Recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "wheat-berries", quantity: 250, unit: "G", groupLabel: "Tahıl ve Baklagil", isOptional: false, note: null as string | null, sortOrder: 1 },
      { ingredientSlug: "chickpeas", quantity: 100, unit: "G", groupLabel: "Tahıl ve Baklagil", isOptional: false, note: null as string | null, sortOrder: 2 },
      { ingredientSlug: "rice", quantity: 50, unit: "G", groupLabel: "Tahıl ve Baklagil", isOptional: false, note: null as string | null, sortOrder: 3 },
      { ingredientSlug: "dried-apricot", quantity: 100, unit: "G", groupLabel: "Kuru Meyve ve Kuruyemiş", isOptional: false, note: null as string | null, sortOrder: 4 },
      { ingredientSlug: "walnuts", quantity: 50, unit: "G", groupLabel: "Kuru Meyve ve Kuruyemiş", isOptional: false, note: null as string | null, sortOrder: 5 },
      { ingredientSlug: "sugar", quantity: 200, unit: "G", groupLabel: "Şurup ve Aroma", isOptional: false, note: null as string | null, sortOrder: 6 },
      { ingredientSlug: "rose-water", quantity: 2, unit: "TBSP", groupLabel: "Şurup ve Aroma", isOptional: false, note: null as string | null, sortOrder: 7 },
      { ingredientSlug: "cinnamon", quantity: 1, unit: "TSP", groupLabel: "Şurup ve Aroma", isOptional: true, note: "servis öncesi süsleme", sortOrder: 8 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: null,
        tr: { title: "Tahılları ıslatın", content: "Dövme buğdayı ve nohudu ayrı ayrı kaselerde bol suyla bir gece ıslatın." },
        en: { title: "Soak the grains", content: "Soak the wheat berries and chickpeas separately in plenty of water overnight." },
      },
      {
        sortOrder: 2,
        durationMinutes: 90,
        tr: { title: "Haşlayın", content: "Buğday ve nohudu yumuşayana kadar ayrı ayrı haşlayın." },
        en: { title: "Boil", content: "Boil the wheat berries and chickpeas separately until tender." },
      },
      {
        sortOrder: 3,
        durationMinutes: 30,
        tr: { title: "Pirinci ekleyin", content: "Haşlanmış buğday ve nohudu büyük bir tencerede birleştirip pirinci ekleyin, yumuşayana kadar pişirin." },
        en: { title: "Add the rice", content: "Combine the boiled wheat and chickpeas in a large pot, add the rice, and cook until tender." },
      },
      {
        sortOrder: 4,
        durationMinutes: 15,
        tr: { title: "Şekerleyin ve tatlandırın", content: "Şekeri ekleyip eritin, doğranmış kuru kayısıyı karıştırın, gül suyunu ilave edin." },
        en: { title: "Sweeten and flavor", content: "Add the sugar and let it dissolve, stir in chopped dried apricots, and add the rose water." },
      },
      {
        sortOrder: 5,
        durationMinutes: 10,
        tr: { title: "Servis edin", content: "Soğuduktan sonra kaselere paylaştırıp üzerine ceviz ve isteğe bağlı tarçın serperek servis edin." },
        en: { title: "Serve", content: "Once cooled, portion into bowls and garnish with walnuts and, optionally, a sprinkle of cinnamon." },
      },
    ],
    nutrition: { calories: 210, proteinG: 5.2, fatG: 2.1, carbsG: 44.0, isAiEstimated: true },
    source: {
      title: "Bountiful Empire: A History of Ottoman Cuisine",
      author: "Priscilla Mary Işın",
      year: 2018,
      type: "BOOK",
      reliability: 3,
      notes: "AI taslağı — HISTORIAN doğrulaması bekliyor. Genel referans; bu tarifin doğrudan alıntısı değildir.",
      citation: null as string | null,
    },
  },
] as const;
