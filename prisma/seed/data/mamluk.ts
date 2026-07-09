/**
 * Memlük Sultanlığı mutfağı taksonomisi — greek.ts/persian.ts ile
 * birebir aynı CuisineTaxonomySeed şekli.
 *
 * Kahire merkezli Memlük dönemi, Osmanlı'nın 1517'de Mısır'ı fethiyle
 * son bulmuştur; haritada zaten tarifsiz mutfak şehri olarak işaretli
 * Halep de bu medeniyetin kültürel-ekonomik etki alanındaydı.
 */

export const mamlukSeed = {
  country: {
    slug: "egypt",
    iso2: "EG",
    latitude: 30.0444,
    longitude: 31.2357,
    tr: {
      name: "Mısır",
      description: "Memlük Sultanlığı'nın başkenti Kahire'nin bulunduğu Nil vadisi mutfak coğrafyası; şekerli hamur işleri ve pirinç tatlılarıyla tanınır.",
    },
    en: {
      name: "Egypt",
      description: "The Nile-valley culinary geography containing Cairo, capital of the Mamluk Sultanate; known for sugar-based pastries and rice puddings.",
    },
  },
  city: {
    slug: "cairo",
    latitude: 30.0444,
    longitude: 31.2357,
    tr: { name: "Kahire" },
    en: { name: "Cairo" },
  },
  civilization: {
    slug: "mamluk-sultanate",
    startYear: 1250,
    endYear: 1517,
    tr: {
      name: "Memlük Sultanlığı",
      description: "1250'de kurulan, 1517'de Yavuz Sultan Selim'in fethiyle Osmanlı topraklarına katılan sultanlık; Kahire ve Halep gibi merkezlerde zengin bir saray ve çarşı mutfağı geleneği bırakmıştır.",
    },
    en: {
      name: "Mamluk Sultanate",
      description: "A sultanate founded in 1250 and absorbed into Ottoman territory in 1517 following Selim I's conquest; it left a rich palace and marketplace cuisine tradition in centers such as Cairo and Aleppo.",
    },
  },
  era: {
    slug: "mamluk-period",
    startYear: 1250,
    endYear: 1517,
    tr: {
      name: "Memlük Dönemi",
      description: "Şeker rafinasyonu ve pirinç tatlılarının doruğa ulaştığı, Osmanlı sofrasına doğrudan devrolacak birçok tatlı ve şerbet geleneğinin şekillendiği dönem.",
    },
    en: {
      name: "Mamluk Period",
      description: "The period in which sugar refining and rice-based desserts reached their peak, shaping many sweet and sherbet traditions that would pass directly into the Ottoman table.",
    },
  },
  cuisine: {
    slug: "memluk-mutfagi",
    tr: {
      name: "Memlük Mutfağı",
      description: "Şeker, pirinç ve fıstık gibi malzemelerle şekillenen, Osmanlı fethi sonrası saray mutfağına doğrudan aktarılan zengin bir tatlı ve şerbet geleneği.",
    },
    en: {
      name: "Mamluk Cuisine",
      description: "A rich sweet and sherbet tradition shaped by ingredients such as sugar, rice, and pistachios, which passed directly into palace cuisine after the Ottoman conquest.",
    },
  },
  categories: [],
  ingredients: [],
  alternatives: [],
} as const;
