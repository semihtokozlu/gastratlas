/**
 * Abbasi Halifeliği mutfağı taksonomisi — greek.ts/persian.ts ile birebir
 * aynı CuisineTaxonomySeed şekli, şema/migration değişikliği gerektirmez.
 *
 * Bağdat merkezli Abbasi dönemi, "şerbet" kelimesinin kökeni olan "şarab"/
 * "sharbat" geleneği ve 10. yüzyıl Bağdat mutfak kitabı Kitab al-Ṭabīḫ
 * (İbn Sayyar el-Warraq) ile mutfak tarihi açısından iyi belgelenmiş bir
 * dönemdir — Baharat Yolu'nun (haritadaki ticaret rotası) tam ortasında.
 */

export const abbasidSeed = {
  country: {
    slug: "iraq",
    iso2: "IQ",
    latitude: 33.3152,
    longitude: 44.3661,
    tr: {
      name: "Irak",
      description: "Abbasi Halifeliği'nin başkenti Bağdat'ın bulunduğu, Dicle-Fırat havzasındaki mutfak coğrafyası; şerbet, pilav ve şeker kullanımının Ortadoğu mutfağına yerleştiği bölge.",
    },
    en: {
      name: "Iraq",
      description: "The Tigris–Euphrates culinary geography containing Baghdad, capital of the Abbasid Caliphate; the region where sherbet, rice, and sugar became established in Middle Eastern cuisine.",
    },
  },
  city: {
    slug: "baghdad",
    latitude: 33.3152,
    longitude: 44.3661,
    tr: { name: "Bağdat" },
    en: { name: "Baghdad" },
  },
  civilization: {
    slug: "abbasid-caliphate",
    startYear: 750,
    endYear: 1258,
    tr: {
      name: "Abbasi Halifeliği",
      description: "750'de kurulan, 1258'de Moğol istilasıyla Bağdat'ın yıkımına kadar süren halifelik; saray mutfağı 10. yüzyılda yazılan Kitab al-Ṭabīḫ gibi eserlerle mutfak tarihinin en eski yazılı kayıtlarından birini bırakmıştır.",
    },
    en: {
      name: "Abbasid Caliphate",
      description: "A caliphate founded in 750 and lasting until the Mongol destruction of Baghdad in 1258; its palace cuisine left one of culinary history's earliest written records, in works such as the 10th-century Kitab al-Ṭabīḫ.",
    },
  },
  era: {
    slug: "abbasid-golden-age",
    startYear: 750,
    endYear: 1258,
    tr: {
      name: "Abbasi Altın Çağı",
      description: "Şeker kamışı, pirinç ve şerbet geleneğinin saray mutfağında olgunlaştığı, bilim ve edebiyatla birlikte mutfak yazınının da geliştiği dönem.",
    },
    en: {
      name: "Abbasid Golden Age",
      description: "The period in which sugarcane, rice, and the sherbet tradition matured in the palace kitchen, alongside the flourishing of culinary writing together with science and literature.",
    },
  },
  cuisine: {
    slug: "abbasi-mutfagi",
    tr: {
      name: "Abbasi Mutfağı",
      description: "Şeker, pirinç, badem ve gül suyu etrafında şekillenen, sonraki Ortadoğu ve Akdeniz mutfaklarına (Osmanlı dahil) doğrudan miras bırakan bir saray mutfağı geleneği.",
    },
    en: {
      name: "Abbasid Cuisine",
      description: "A palace cuisine tradition built around sugar, rice, almonds, and rose water, which directly bequeathed its legacy to later Middle Eastern and Mediterranean cuisines, including the Ottoman.",
    },
  },
  categories: [],
  ingredients: [],
  alternatives: [],
} as const;
