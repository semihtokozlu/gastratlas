/**
 * Anadolu Selçuklu Devleti (Rum Sultanlığı) mutfağı taksonomisi —
 * greek.ts/persian.ts ile birebir aynı CuisineTaxonomySeed şekli.
 *
 * Ülke olarak mevcut "turkiye" kaydı yeniden kullanılır (upsert no-op) —
 * yalnızca yeni bir şehir (Konya), medeniyet, dönem ve mutfak eklenir.
 * Osmanlı beyliklerinin doğduğu topraklarda, Bizans'la iç içe, doğrudan
 * Osmanlı öncesi Anadolu mutfak geleneğidir.
 */

export const seljukSeed = {
  country: {
    slug: "turkiye",
    iso2: "TR",
    latitude: 39,
    longitude: 35,
    tr: {
      name: "Türkiye",
      description: "Osmanlı, Bizans ve Selçuklu miraslarının iç içe geçtiği bir mutfak coğrafyası.",
    },
    en: {
      name: "Turkey",
      description: "A culinary geography where Ottoman, Byzantine, and Seljuk legacies intertwine.",
    },
  },
  city: {
    slug: "konya",
    latitude: 37.8746,
    longitude: 32.4932,
    tr: { name: "Konya" },
    en: { name: "Konya" },
  },
  civilization: {
    slug: "sultanate-of-rum",
    startYear: 1077,
    endYear: 1308,
    tr: {
      name: "Anadolu Selçuklu Devleti",
      description: "Başkenti Konya olan, 1077-1308 arasında Orta Anadolu'da hüküm süren Türk-İslam devleti; Osmanlı beyliklerinin doğduğu topraklarda, Orta Asya Türk mutfak geleneğini Bizans ve Fars etkileriyle harmanlamıştır.",
    },
    en: {
      name: "Sultanate of Rum",
      description: "A Turco-Islamic state ruling central Anatolia from 1077 to 1308, with its capital at Konya; on the very lands where the Ottoman beyliks would later emerge, it blended Central Asian Turkic culinary tradition with Byzantine and Persian influences.",
    },
  },
  era: {
    slug: "seljuk-anatolia-period",
    startYear: 1077,
    endYear: 1308,
    tr: {
      name: "Selçuklu Anadolu Dönemi",
      description: "Orta Asya'dan gelen hamur işi ve yoğurt geleneğinin Anadolu'nun yerel ürünleriyle buluştuğu, doğrudan Osmanlı mutfağının atası sayılan dönem.",
    },
    en: {
      name: "Seljuk Anatolia Period",
      description: "The period in which the Central Asian dough and yogurt tradition met Anatolia's local produce — directly regarded as the ancestor of Ottoman cuisine.",
    },
  },
  cuisine: {
    slug: "selcuklu-mutfagi",
    tr: {
      name: "Selçuklu Mutfağı",
      description: "Yoğurt, hamur işi (mantı benzeri katmerli/dolgulu hamurlar) ve kavurma etrafında şekillenen, Orta Asya Türk mutfak geleneğinin Anadolu'daki ilk yerleşik hali; Osmanlı mutfağının doğrudan atası kabul edilir.",
    },
    en: {
      name: "Seljuk Cuisine",
      description: "The first settled form of Central Asian Turkic culinary tradition in Anatolia, built around yogurt, dumpling-like stuffed doughs, and cured meat — regarded as the direct ancestor of Ottoman cuisine.",
    },
  },
  categories: [],
  ingredients: [],
  alternatives: [],
} as const;
