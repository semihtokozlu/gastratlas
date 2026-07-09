/**
 * Endülüs Emevi Halifeliği mutfağı taksonomisi — greek.ts/persian.ts ile
 * birebir aynı CuisineTaxonomySeed şekli.
 *
 * Kurtuba (Córdoba) merkezli dönem; pirinç, turunçgil ve şeker kamışının
 * İber Yarımadası üzerinden Avrupa'ya girişinde kilit rol oynamıştır.
 * Coğrafi olarak haritanın varsayılan görünümünün belirgin şekilde
 * dışında (batıda) — bilinçli bırakıldı, sürüklenerek keşfedilebilir.
 */

export const andalusianSeed = {
  country: {
    slug: "spain",
    iso2: "ES",
    latitude: 37.8882,
    longitude: -4.7794,
    tr: {
      name: "İspanya (Endülüs)",
      description: "Endülüs Emevi Halifeliği'nin başkenti Kurtuba'nın (Córdoba) bulunduğu İber Yarımadası mutfak coğrafyası; pirinç, turunçgil ve şeker kamışının Avrupa'ya girişinde kilit rol oynamıştır.",
    },
    en: {
      name: "Spain (Al-Andalus)",
      description: "The Iberian culinary geography containing Córdoba, capital of the Umayyad Caliphate of Córdoba; it played a key role in introducing rice, citrus, and sugarcane to Europe.",
    },
  },
  city: {
    slug: "cordoba",
    latitude: 37.8882,
    longitude: -4.7794,
    tr: { name: "Kurtuba (Córdoba)" },
    en: { name: "Córdoba" },
  },
  civilization: {
    slug: "umayyad-caliphate-of-cordoba",
    startYear: 756,
    endYear: 1031,
    tr: {
      name: "Endülüs Emevi Halifeliği",
      description: "756'da kurulan, 1031'de küçük krallıklara (taifa) bölünen halifelik; Ortadoğu'dan getirdiği pirinç, turunçgil, şeker kamışı ve badem gibi ürünleri Avrupa mutfağına tanıtmıştır.",
    },
    en: {
      name: "Umayyad Caliphate of Córdoba",
      description: "A caliphate founded in 756 and fragmented into taifa kingdoms by 1031; it introduced rice, citrus, sugarcane, and almonds brought from the Middle East to European cuisine.",
    },
  },
  era: {
    slug: "andalusian-caliphate-period",
    startYear: 756,
    endYear: 1031,
    tr: {
      name: "Endülüs Halifelik Dönemi",
      description: "Ortadoğu kökenli ürünlerin (pirinç, şeker kamışı, turunçgil) İber Yarımadası'na yerleştiği, sonraki Akdeniz mutfaklarını dönüştürecek tarım ve mutfak devriminin yaşandığı dönem.",
    },
    en: {
      name: "Andalusian Caliphate Period",
      description: "The period in which Middle Eastern-origin products (rice, sugarcane, citrus) became established in the Iberian Peninsula, part of an agricultural and culinary revolution that would transform later Mediterranean cuisines.",
    },
  },
  cuisine: {
    slug: "endulus-mutfagi",
    tr: {
      name: "Endülüs Mutfağı",
      description: "Pirinç, badem, turunçgil ve şeker kamışı gibi Ortadoğu kökenli ürünleri Avrupa'ya tanıtan, sonraki Akdeniz mutfaklarını derinden etkileyen bir mutfak geleneği.",
    },
    en: {
      name: "Andalusian Cuisine",
      description: "A culinary tradition that introduced Middle Eastern-origin products — rice, almonds, citrus, sugarcane — to Europe, deeply influencing later Mediterranean cuisines.",
    },
  },
  categories: [],
  ingredients: [],
  alternatives: [],
} as const;
