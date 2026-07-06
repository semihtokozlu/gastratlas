/**
 * Fars/İran mutfağı taksonomisi — üçüncü mutfak dilimi (Faz 3 desenini
 * takip eder; greek.ts ile birebir aynı CuisineTaxonomySeed şekli,
 * hiçbir Prisma şema/migration değişikliği gerektirmez).
 *
 * Era olarak Safevi dönemi seçildi: pilav/şerbet/tatlı gelenekleri
 * Osmanlı saray mutfağıyla doğrudan paylaşılan, tarihsel etkileşimi
 * en güçlü dönem (bkz. persian-recipes.ts'teki "sholeh-zard" tarifi —
 * Osmanlı "zerde"siyle aynı Farsça kökten, "zerde-zard" bağlantısı).
 */

export const persianSeed = {
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
    slug: "isfahan",
    latitude: 32.6546,
    longitude: 51.668,
    tr: { name: "İsfahan" },
    en: { name: "Isfahan" },
  },
  civilization: {
    slug: "safavid-empire",
    startYear: 1501,
    endYear: 1736,
    tr: {
      name: "Safevi İmparatorluğu",
      description: "İsmail I tarafından kurulan, başkenti Şah Abbas döneminde İsfahan'a taşınan Şii Pers imparatorluğu; saray mutfağı pilav ve safran kullanımıyla bölge mutfaklarını (Osmanlı dahil) derinden etkilemiştir.",
    },
    en: {
      name: "Safavid Empire",
      description: "A Shia Persian empire founded by Ismail I, whose capital moved to Isfahan under Shah Abbas; its palace cuisine, built around rice and saffron, deeply influenced regional cuisines including the Ottoman court.",
    },
  },
  era: {
    slug: "safavid-period",
    startYear: 1501,
    endYear: 1736,
    tr: {
      name: "Safevi Dönemi",
      description: "Fars mutfağının pilav (polo), safran ve gül suyu kullanımı gibi karakteristik unsurlarının saray mutfağında olgunlaştığı, komşu imparatorluklarla (Osmanlı) yoğun mutfak etkileşiminin yaşandığı dönem.",
    },
    en: {
      name: "Safavid Period",
      description: "The period in which characteristic elements of Persian cuisine — rice (polo), saffron, and rose water — matured in the palace kitchen, alongside intense culinary interaction with neighboring empires (the Ottomans).",
    },
  },
  cuisine: {
    slug: "fars-mutfagi",
    tr: {
      name: "Fars Mutfağı",
      description: "Pilav, safran, nar ekşisi ve ceviz gibi malzemeler etrafında şekillenen, tatlı-ekşi tatları öne çıkaran, Osmanlı ve daha geniş Orta Doğu mutfaklarıyla paylaşılan bir mirasa sahip mutfak.",
    },
    en: {
      name: "Persian Cuisine",
      description: "A cuisine built around rice, saffron, pomegranate molasses, and walnuts, foregrounding sweet-sour flavors, with a heritage shared with Ottoman and broader Middle Eastern cuisines.",
    },
  },
  categories: [],
  ingredients: [],
  alternatives: [],
} as const;
