/**
 * Faz 1 içerik iskeleti — 5 tarif (60-100 hedefinin çok küçük bir alt kümesi,
 * her seed kategorisinden (soups/pilafs/desserts/mains/sherbets) bir örnek).
 *
 * ÖNEMLİ: Buradaki tarihçe/özet metinleri bu depoyu hazırlayan AI tarafından
 * yazılmış TASLAKlardır. Admin editoryal akışı (bkz. src/features/admin/)
 * artık kodlanmış durumda — bir HISTORIAN/ADMIN hesabıyla giriş yapıp bu
 * tarifleri /admin/recipes üzerinden gerçek statü makinesinden geçirebilir
 * (DRAFT'a çekip yeniden inceleyebilir). Ama seed'in kendisi bu akışı
 * BYPASS EDER — tarifler doğrudan `status: PUBLISHED` ile yüklenir, çünkü
 * bu, sayfaların uçtan uca çalıştığını göstermek için teknik olarak
 * gerekli. Gerçek yayın kalitesinde kabul edilmemeli, bir HISTORIAN/editör
 * tarafından gözden geçirilmeden gerçek içerik sayılmamalıdır.
 * Tartışmalı/doğrulanmamış anlatılar bilinçli olarak "rivayete göre" gibi
 * ifadelerle hedge edilmiştir.
 */

export const recipesSeed = [
  {
    slug: "hunkarbegendi",
    categorySlug: "mains",
    authorSlug: "gastratlas-mutfak",
    latitude: 41.0115,
    longitude: 28.9834,
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
    latitude: 41.0053,
    longitude: 28.977,
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
  {
    slug: "mercimek-corbasi",
    categorySlug: "soups",
    authorSlug: "gastratlas-mutfak",
    latitude: 41.0,
    longitude: 28.97,
    prepMinutes: 10,
    cookMinutes: 30,
    restMinutes: null as number | null,
    servings: 4,
    difficulty: "EASY",
    publishedAt: "2026-06-15",
    tr: {
      title: "Mercimek Çorbası",
      summary: "Kırmızı mercimekle hazırlanan, kimyonla tatlandırılan pürüzsüz bir Anadolu çorbası.",
      history:
        "Mercimek çorbası, Anadolu'nun her bölgesinde farklı varyasyonlarla pişirilen, halk mutfağının en yaygın ve en eski çorbalarından biridir.\n\nSaray kayıtlarından çok halk sofralarının bir ürünü olduğu için, tek bir \"icat\" hikâyesi yoktur — kökeni sözlü mutfak geleneğine dayanır ve tam olarak ne zaman bugünkü hâlini aldığı belirsizdir.\n\nBu metin editoryal doğrulama bekleyen bir taslaktır.",
      metaTitle: "Mercimek Çorbası Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc: "Kırmızı mercimek, kimyon ve tereyağıyla hazırlanan klasik Anadolu çorbası tarifi ve tarihçesi.",
    },
    en: {
      title: "Mercimek Çorbası (Red Lentil Soup)",
      summary: "A smooth Anatolian soup of red lentils, seasoned with cumin.",
      history:
        "Red lentil soup is one of the most widespread and oldest soups of Anatolian home cooking, prepared with regional variations across the country.\n\nBeing a product of folk kitchens rather than palace records, it has no single \"invention\" story — its origin lies in oral culinary tradition, and exactly when it took its current form is uncertain.\n\nThis text is an editorial draft pending verification.",
      metaTitle: "Red Lentil Soup Recipe & History | GastrAtlas",
      metaDesc: "A classic Anatolian soup of red lentils, cumin, and butter. Recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "red-lentils", quantity: 200, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 1 },
      { ingredientSlug: "onion", quantity: 1, unit: "PIECE", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 2 },
      { ingredientSlug: "carrot", quantity: 1, unit: "PIECE", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 3 },
      { ingredientSlug: "butter", quantity: 30, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 4 },
      { ingredientSlug: "cumin", quantity: 1, unit: "TSP", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 5 },
      { ingredientSlug: "lemon", quantity: 1, unit: "PIECE", groupLabel: null as string | null, isOptional: true, note: "servis için", sortOrder: 6 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: 10,
        tr: { title: "Sebzeleri kavurun", content: "Doğranmış soğan ve havucu tereyağında yumuşayana kadar kavurun." },
        en: { title: "Sauté the vegetables", content: "Sauté the chopped onion and carrot in butter until softened." },
      },
      {
        sortOrder: 2,
        durationMinutes: 20,
        tr: { title: "Mercimeği haşlayın", content: "Kırmızı mercimeği ekleyip bol suyla mercimek yumuşayana kadar kaynatın." },
        en: { title: "Simmer the lentils", content: "Add the red lentils with plenty of water and simmer until tender." },
      },
      {
        sortOrder: 3,
        durationMinutes: null,
        tr: { title: "Pürüzsüzleştirin", content: "Blenderdan geçirip pürüzsüz kıvama getirin, kimyon ekleyip karıştırın." },
        en: { title: "Blend smooth", content: "Blend until smooth, then stir in the cumin." },
      },
      {
        sortOrder: 4,
        durationMinutes: null,
        tr: { title: "Servis edin", content: "Sıcak servis edin; isteğe bağlı limon dilimiyle sunun." },
        en: { title: "Serve", content: "Serve hot, optionally with a wedge of lemon." },
      },
    ],
    nutrition: { calories: 180, proteinG: 10, fatG: 5, carbsG: 25, isAiEstimated: true },
    source: {
      title: "Anadolu Ev Mutfağı Sözlü Geleneği",
      author: null as string | null,
      year: null as number | null,
      type: "ORAL_HISTORY",
      reliability: 2,
      notes: "AI taslağı — sözlü gelenek genellemesi, HISTORIAN doğrulaması bekliyor.",
      citation: null as string | null,
    },
  },
  {
    slug: "ic-pilav",
    categorySlug: "pilafs",
    authorSlug: "gastratlas-mutfak",
    latitude: 41.015,
    longitude: 28.955,
    prepMinutes: 15,
    cookMinutes: 35,
    restMinutes: null as number | null,
    servings: 6,
    difficulty: "MEDIUM",
    publishedAt: "2026-06-20",
    tr: {
      title: "İç Pilav",
      summary: "Kuş üzümü, çam fıstığı ve yenibaharla hazırlanan Osmanlı saray usulü pirinç pilavı.",
      history:
        "İç pilav, saray ve konak mutfaklarında özellikle dolmalık kullanılan \"iç\" harcının kendi başına bir pilav olarak sunulan hâlidir — kuş üzümü, çam fıstığı ve yenibaharla tatlandırılır.\n\nOsmanlı sofra düzeninde pilavlar, ana yemeğin yanında değil çoğunlukla kendi başına bir kap olarak sunulurdu.\n\nBu metin editoryal doğrulama bekleyen bir taslaktır.",
      metaTitle: "İç Pilav Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc: "Kuş üzümü, çam fıstığı ve yenibaharla hazırlanan Osmanlı saray usulü pilav tarifi ve tarihçesi.",
    },
    en: {
      title: "İç Pilav (Ottoman Rice Pilaf)",
      summary: "Ottoman palace-style rice pilaf with currants, pine nuts, and allspice.",
      history:
        "İç pilav is the standalone-dish version of the \"iç\" (filling) mixture more commonly used to stuff vegetables in palace and mansion kitchens — flavored with currants, pine nuts, and allspice.\n\nIn Ottoman table order, pilafs were typically served as their own course rather than merely as a side to the main dish.\n\nThis text is an editorial draft pending verification.",
      metaTitle: "İç Pilav Recipe & History | GastrAtlas",
      metaDesc: "Ottoman palace-style rice pilaf with currants, pine nuts, and allspice. Recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "rice", quantity: 300, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 1 },
      { ingredientSlug: "onion", quantity: 1, unit: "PIECE", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 2 },
      { ingredientSlug: "pine-nuts", quantity: 30, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 3 },
      { ingredientSlug: "currants", quantity: 30, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 4 },
      { ingredientSlug: "butter", quantity: 40, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 5 },
      { ingredientSlug: "allspice", quantity: 1, unit: "TSP", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 6 },
      { ingredientSlug: "dill", quantity: 1, unit: "BUNCH", groupLabel: null as string | null, isOptional: true, note: "servis için", sortOrder: 7 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: 10,
        tr: { title: "Soğanı ve çam fıstığını kavurun", content: "Doğranmış soğanı tereyağında pembeleşene kadar, ardından çam fıstığını hafifçe kavurun." },
        en: { title: "Sauté onion and pine nuts", content: "Sauté the chopped onion in butter until translucent, then lightly toast the pine nuts." },
      },
      {
        sortOrder: 2,
        durationMinutes: 5,
        tr: { title: "Pirinci kavurun", content: "Yıkanmış pirinci ekleyip birkaç dakika kavurun." },
        en: { title: "Toast the rice", content: "Add the rinsed rice and toast for a few minutes." },
      },
      {
        sortOrder: 3,
        durationMinutes: 20,
        tr: { title: "Pişirin", content: "Kuş üzümü ve yenibaharı ekleyip sıcak su ilave edin, kısık ateşte suyunu çekene kadar pişirin." },
        en: { title: "Cook", content: "Add the currants and allspice, pour in hot water, and cook over low heat until absorbed." },
      },
      {
        sortOrder: 4,
        durationMinutes: null,
        tr: { title: "Demleyin ve servis edin", content: "Ocaktan alıp 10 dakika demlendirin, dereotuyla süsleyip servis edin." },
        en: { title: "Rest and serve", content: "Remove from heat, let rest for 10 minutes, garnish with dill, and serve." },
      },
    ],
    nutrition: { calories: 310, proteinG: 6, fatG: 11, carbsG: 48, isAiEstimated: true },
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
    slug: "visne-serbeti",
    categorySlug: "sherbets",
    authorSlug: "gastratlas-mutfak",
    latitude: 41.02,
    longitude: 28.995,
    prepMinutes: 20,
    cookMinutes: 15,
    restMinutes: 480,
    servings: 6,
    difficulty: "EASY",
    publishedAt: "2026-06-25",
    tr: {
      title: "Vişne Şerbeti",
      summary: "Ekşi vişneyle hazırlanan, soğuk servis edilen geleneksel Osmanlı şerbeti.",
      history:
        "Şerbet kültürü, Osmanlı saray ve şehir hayatının önemli bir parçasıydı; misafire ilk ikram edilen içeceklerden biri olarak toplumsal bir işlev de görürdü.\n\nVişne şerbeti, ekşi meyve şerbetleri arasında en yaygın olanlardan biridir.\n\nBu metin editoryal doğrulama bekleyen bir taslaktır.",
      metaTitle: "Vişne Şerbeti Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc: "Ekşi vişneyle hazırlanan geleneksel Osmanlı şerbeti tarifi ve tarihçesi.",
    },
    en: {
      title: "Vişne Şerbeti (Sour Cherry Sherbet)",
      summary: "A traditional Ottoman sherbet made with sour cherries, served cold.",
      history:
        "Sherbet culture was an important part of Ottoman palace and urban life; as one of the first drinks offered to a guest, it also served a social function.\n\nSour cherry sherbet is among the most common of the tart fruit sherbets.\n\nThis text is an editorial draft pending verification.",
      metaTitle: "Sour Cherry Sherbet Recipe & History | GastrAtlas",
      metaDesc: "A traditional Ottoman sherbet made with sour cherries, served cold. Recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "sour-cherry", quantity: 300, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 1 },
      { ingredientSlug: "sugar", quantity: 150, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 2 },
      { ingredientSlug: "lemon", quantity: 1, unit: "PIECE", groupLabel: null as string | null, isOptional: false, note: "suyu için", sortOrder: 3 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: null,
        tr: { title: "Vişneleri bekletin", content: "Çekirdeklerinden ayırdığınız vişneleri şekerle bir gece buzdolabında bekletin." },
        en: { title: "Macerate the cherries", content: "Pit the cherries and let them macerate with the sugar overnight in the refrigerator." },
      },
      {
        sortOrder: 2,
        durationMinutes: 15,
        tr: { title: "Kaynatın", content: "Vişne ve şekerli suyunu süzüp bir miktar suyla birlikte kaynatın." },
        en: { title: "Boil", content: "Strain the cherries and their syrup, add some water, and bring to a boil." },
      },
      {
        sortOrder: 3,
        durationMinutes: null,
        tr: { title: "Soğutup servis edin", content: "İyice soğutun, limon suyunu ekleyip buzla servis edin." },
        en: { title: "Chill and serve", content: "Chill thoroughly, stir in the lemon juice, and serve over ice." },
      },
    ],
    nutrition: { calories: 120, proteinG: 0.5, fatG: 0.1, carbsG: 30, isAiEstimated: true },
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
    slug: "imam-bayildi",
    categorySlug: "mains",
    authorSlug: "gastratlas-mutfak",
    latitude: 41.005,
    longitude: 28.965,
    prepMinutes: 25,
    cookMinutes: 45,
    restMinutes: null as number | null,
    servings: 4,
    difficulty: "MEDIUM",
    publishedAt: "2026-07-01",
    tr: {
      title: "İmam Bayıldı",
      summary: "Soğan, sarımsak ve domatesle doldurulmuş, zeytinyağıyla fırınlanan patlıcan.",
      history:
        "İmam Bayıldı'nın adının kökenine dair birden fazla rivayet vardır; en yaygını, yemeği tadan bir imamın lezzetinden \"bayılması\"na dayanır.\n\nZeytinyağlı yemekler kategorisinin en tanınmış örneklerinden biridir ve günümüzde hem sıcak hem soğuk servis edilir.\n\nBu metin editoryal doğrulama bekleyen bir taslaktır.",
      metaTitle: "İmam Bayıldı Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc: "Zeytinyağlı patlıcan dolması İmam Bayıldı: tarifi ve tarihçesi.",
    },
    en: {
      title: "İmam Bayıldı (The Imam Fainted)",
      summary: "Eggplant baked in olive oil and stuffed with onion, garlic, and tomato.",
      history:
        "There is more than one story behind the name İmam Bayıldı; the most common holds that an imam who tasted it \"fainted\" from its flavor.\n\nIt is one of the best-known dishes in the olive-oil-based dish category and is served today both warm and cold.\n\nThis text is an editorial draft pending verification.",
      metaTitle: "İmam Bayıldı Recipe & History | GastrAtlas",
      metaDesc: "Olive-oil braised stuffed eggplant, İmam Bayıldı: recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "eggplant", quantity: 4, unit: "PIECE", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 1 },
      { ingredientSlug: "onion", quantity: 2, unit: "PIECE", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 2 },
      { ingredientSlug: "tomato", quantity: 2, unit: "PIECE", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 3 },
      { ingredientSlug: "garlic", quantity: 3, unit: "PIECE", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 4 },
      { ingredientSlug: "olive-oil", quantity: 100, unit: "ML", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 5 },
      { ingredientSlug: "sugar", quantity: 1, unit: "TSP", groupLabel: null as string | null, isOptional: true, note: null as string | null, sortOrder: 6 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: 15,
        tr: { title: "Patlıcanları hazırlayın", content: "Patlıcanları soyup uzunlamasına yarık açın, acılığını almak için tuzlu suda bekletin." },
        en: { title: "Prepare the eggplants", content: "Peel the eggplants and slit lengthwise, then soak in salted water to remove bitterness." },
      },
      {
        sortOrder: 2,
        durationMinutes: 15,
        tr: { title: "Harcı hazırlayın", content: "Soğan, sarımsak ve domatesi zeytinyağında kavurup harç hazırlayın." },
        en: { title: "Make the filling", content: "Sauté the onion, garlic, and tomato in olive oil to make the filling." },
      },
      {
        sortOrder: 3,
        durationMinutes: 30,
        tr: { title: "Doldurup pişirin", content: "Patlıcanları harçla doldurup fırında yumuşayana kadar pişirin." },
        en: { title: "Stuff and bake", content: "Stuff the eggplants with the filling and bake until tender." },
      },
      {
        sortOrder: 4,
        durationMinutes: null,
        tr: { title: "Servis edin", content: "Soğuk veya ılık servis edin." },
        en: { title: "Serve", content: "Serve cold or warm." },
      },
    ],
    nutrition: { calories: 220, proteinG: 3.5, fatG: 15, carbsG: 20, isAiEstimated: true },
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
    slug: "baklava",
    categorySlug: "desserts",
    authorSlug: "gastratlas-mutfak",
    latitude: 41.013,
    longitude: 28.982,
    prepMinutes: 40,
    cookMinutes: 40,
    restMinutes: 120,
    servings: 12,
    difficulty: "HARD",
    publishedAt: "2026-07-01",
    tr: {
      title: "Baklava",
      summary: "İnce yufka katmanları arasında ceviz ve şerbetle hazırlanan Osmanlı saray tatlısı.",
      history:
        "Baklavanın kökeni hakkında farklı görüşler vardır; Topkapı Sarayı mutfak kayıtlarında bayramlarda hazırlandığına dair kayıtlar bulunur (\"Baklava Alayı\" geleneği).\n\nKatmanlı hamur işi tatlıların Osmanlı-Türk mutfağındaki en gelişmiş örneği kabul edilir.\n\nBu metin editoryal doğrulama bekleyen bir taslaktır.",
      metaTitle: "Baklava Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc: "Ceviz ve şerbetle hazırlanan klasik Osmanlı tatlısı baklava: tarif ve tarihçe.",
    },
    en: {
      title: "Baklava",
      summary: "Layers of thin phyllo filled with walnuts and soaked in syrup — a classic Ottoman palace dessert.",
      history:
        "Accounts of baklava's origin vary; Topkapı Palace kitchen records mention its preparation for festival occasions (the \"Baklava Procession\" tradition).\n\nIt is considered the most refined example of layered pastry desserts in Ottoman-Turkish cuisine.\n\nThis text is an editorial draft pending verification.",
      metaTitle: "Baklava Recipe & History | GastrAtlas",
      metaDesc: "Classic Ottoman walnut baklava soaked in syrup: recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "phyllo-dough", quantity: 500, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 1 },
      { ingredientSlug: "walnuts", quantity: 200, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 2 },
      { ingredientSlug: "butter", quantity: 150, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 3 },
      { ingredientSlug: "sugar", quantity: 250, unit: "G", groupLabel: "Şerbet için", isOptional: false, note: null as string | null, sortOrder: 4 },
      { ingredientSlug: "lemon", quantity: 1, unit: "PIECE", groupLabel: "Şerbet için", isOptional: false, note: "suyu için", sortOrder: 5 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: 20,
        tr: { title: "Yufkaları dizin", content: "Yufkaları tereyağıyla tek tek yağlayıp tepsinin yarısına dizin." },
        en: { title: "Layer the phyllo", content: "Butter each sheet of phyllo individually and layer half of them in the tray." },
      },
      {
        sortOrder: 2,
        durationMinutes: 10,
        tr: { title: "Cevizi serpin", content: "Dövülmüş cevizi serpiştirip kalan yufkaları üzerine dizin." },
        en: { title: "Add the walnuts", content: "Sprinkle crushed walnuts, then layer the remaining phyllo sheets on top." },
      },
      {
        sortOrder: 3,
        durationMinutes: 40,
        tr: { title: "Kesip fırınlayın", content: "Baklava dilimi şeklinde kesip altın rengi alana kadar fırınlayın." },
        en: { title: "Cut and bake", content: "Cut into diamond-shaped pieces and bake until golden." },
      },
      {
        sortOrder: 4,
        durationMinutes: null,
        tr: { title: "Şerbetleyin", content: "Şekerli şerbeti kaynatıp limon suyuyla sıcak baklavaya dökün, dinlendirip servis edin." },
        en: { title: "Add the syrup", content: "Boil the sugar syrup with lemon juice and pour over the hot baklava; let rest before serving." },
      },
    ],
    nutrition: { calories: 340, proteinG: 5, fatG: 20, carbsG: 36, isAiEstimated: true },
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
    slug: "yayla-corbasi",
    categorySlug: "soups",
    authorSlug: "gastratlas-mutfak",
    latitude: 41.008,
    longitude: 28.96,
    prepMinutes: 10,
    cookMinutes: 20,
    restMinutes: null as number | null,
    servings: 4,
    difficulty: "EASY",
    publishedAt: "2026-07-01",
    tr: {
      title: "Yayla Çorbası",
      summary: "Yoğurt ve pirinçle hazırlanan, nane ile tatlandırılan geleneksel Anadolu çorbası.",
      history:
        "Yayla çorbası, adını yaylalarda hayvancılıkla uğraşan topluluklarda yaygın olan yoğurt ve tahıl temelli çorba geleneğinden alır.\n\nYoğurdun kaynatılırken kesilmemesi için un ve yumurtayla terbiye edilmesi tekniği, Anadolu mutfağının karakteristik bir yöntemidir.\n\nBu metin editoryal doğrulama bekleyen bir taslaktır.",
      metaTitle: "Yayla Çorbası Tarifi ve Tarihçesi | GastrAtlas",
      metaDesc: "Yoğurt, pirinç ve naneyle hazırlanan geleneksel Anadolu çorbası tarifi ve tarihçesi.",
    },
    en: {
      title: "Yayla Çorbası (Yogurt & Mint Soup)",
      summary: "A traditional Anatolian soup of yogurt and rice, flavored with mint.",
      history:
        "Yayla çorbası takes its name from the highland-pasture (yayla) tradition of yogurt- and grain-based soups among herding communities.\n\nTempering the yogurt with flour and egg to keep it from curdling while boiling is a characteristic Anatolian technique.\n\nThis text is an editorial draft pending verification.",
      metaTitle: "Yayla Çorbası Recipe & History | GastrAtlas",
      metaDesc: "Traditional Anatolian yogurt and rice soup with mint. Recipe and history.",
    },
    ingredients: [
      { ingredientSlug: "rice", quantity: 50, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 1 },
      { ingredientSlug: "yogurt", quantity: 300, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 2 },
      { ingredientSlug: "egg", quantity: 1, unit: "PIECE", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 3 },
      { ingredientSlug: "flour", quantity: 1, unit: "TBSP", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 4 },
      { ingredientSlug: "butter", quantity: 20, unit: "G", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 5 },
      { ingredientSlug: "dried-mint", quantity: 1, unit: "TSP", groupLabel: null as string | null, isOptional: false, note: null as string | null, sortOrder: 6 },
    ],
    steps: [
      {
        sortOrder: 1,
        durationMinutes: 15,
        tr: { title: "Pirinci haşlayın", content: "Pirinci bol suda yumuşayana kadar haşlayın." },
        en: { title: "Boil the rice", content: "Boil the rice in plenty of water until tender." },
      },
      {
        sortOrder: 2,
        durationMinutes: null,
        tr: { title: "Terbiye hazırlayın", content: "Yoğurt, yumurta ve unu çırpıp haşlanmış pirincin sıcak suyuyla yavaşça terbiye edin." },
        en: { title: "Temper the yogurt", content: "Whisk the yogurt, egg, and flour, then temper slowly with the hot rice water." },
      },
      {
        sortOrder: 3,
        durationMinutes: 5,
        tr: { title: "Pişirin", content: "Terbiyeyi tencereye ekleyip kaynatmadan, kısık ateşte kıvam alana kadar pişirin." },
        en: { title: "Cook", content: "Add the tempered mixture to the pot and cook gently over low heat without boiling, until thickened." },
      },
      {
        sortOrder: 4,
        durationMinutes: null,
        tr: { title: "Servis edin", content: "Tereyağında kavrulmuş naneyle süsleyip sıcak servis edin." },
        en: { title: "Serve", content: "Garnish with mint sautéed in butter and serve hot." },
      },
    ],
    nutrition: { calories: 160, proteinG: 7, fatG: 8, carbsG: 15, isAiEstimated: true },
    source: {
      title: "Anadolu Ev Mutfağı Sözlü Geleneği",
      author: null as string | null,
      year: null as number | null,
      type: "ORAL_HISTORY",
      reliability: 2,
      notes: "AI taslağı — sözlü gelenek genellemesi, HISTORIAN doğrulaması bekliyor.",
      citation: null as string | null,
    },
  },
] as const;
