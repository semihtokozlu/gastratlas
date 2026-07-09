/**
 * İlhanlı Devleti mutfağı taksonomisi — greek.ts/persian.ts ile birebir
 * aynı CuisineTaxonomySeed şekli.
 *
 * Ülke olarak mevcut "iran" kaydı yeniden kullanılır (upsert no-op) —
 * yalnızca yeni bir şehir (Tebriz), medeniyet, dönem ve mutfak eklenir.
 * Moğol-Fars mutfak sentezinin yaşandığı, Safevi öncesi dönem; İpek
 * Yolu'nun (haritadaki ticaret rotası) doğrudan üzerinde.
 */

export const ilkhanateSeed = {
  country: {
    slug: "iran",
    iso2: "IR",
    latitude: 35.6892,
    longitude: 51.389,
    tr: {
      name: "İran",
      description: "Pilav, safran, gül suyu ve tatlı-ekşi güveç (khoresh) gelenekleriyle tanınan, Osmanlı saray mutfağıyla derin tarihsel etkileşimi olan bir mutfak coğrafyası.",
    },
    en: {
      name: "Iran",
      description: "A culinary geography known for rice, saffron, rose water, and sweet-sour stew (khoresh) traditions, with deep historical interaction with Ottoman palace cuisine.",
    },
  },
  city: {
    slug: "tabriz",
    latitude: 38.08,
    longitude: 46.2919,
    tr: { name: "Tebriz" },
    en: { name: "Tabriz" },
  },
  civilization: {
    slug: "ilkhanate",
    startYear: 1256,
    endYear: 1335,
    tr: {
      name: "İlhanlı Devleti",
      description: "Başkenti Tebriz olan, Moğol İmparatorluğu'nun Fars topraklarındaki kolu; Orta Asya bozkır mutfağı (et, süt ürünleri) ile Fars saray mutfağının (pilav, safran) sentezlendiği, Safevi öncesi dönem.",
    },
    en: {
      name: "Ilkhanate",
      description: "The branch of the Mongol Empire ruling Persian lands, with its capital at Tabriz; the pre-Safavid period in which Central Asian steppe cuisine (meat, dairy) synthesized with Persian palace cuisine (rice, saffron).",
    },
  },
  era: {
    slug: "ilkhanate-period",
    startYear: 1256,
    endYear: 1335,
    tr: {
      name: "İlhanlı Dönemi",
      description: "Moğol bozkır mutfağının (kaynatılmış et, süzme yoğurt) Fars saray geleneğiyle (pilav, safran, gül suyu) kaynaştığı, İpek Yolu ticaretinin Tebriz üzerinden yoğunlaştığı dönem.",
    },
    en: {
      name: "Ilkhanate Period",
      description: "The period in which Mongol steppe cuisine (boiled meat, strained yogurt) fused with Persian palace tradition (rice, saffron, rose water), as Silk Road trade intensified through Tabriz.",
    },
  },
  cuisine: {
    slug: "ilhanli-mutfagi",
    tr: {
      name: "İlhanlı Mutfağı",
      description: "Moğol bozkır mutfağının et ve süt ürünleri ağırlıklı geleneğini Fars saray mutfağının pilav ve safran kullanımıyla harmanlayan, Safevi dönemi Fars mutfağına zemin hazırlayan bir mutfak.",
    },
    en: {
      name: "Ilkhanate Cuisine",
      description: "A cuisine blending the meat- and dairy-heavy tradition of Mongol steppe cooking with the Persian palace use of rice and saffron, laying the groundwork for Safavid-era Persian cuisine.",
    },
  },
  categories: [],
  ingredients: [],
  alternatives: [],
} as const;
