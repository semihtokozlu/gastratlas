/**
 * Zaman çizelgesi düğümleri. Tıpkı tarif tarihçeleri gibi, kesin yıl
 * iddiaları burada bilinçli olarak temsili/yaklaşık tutulmuştur ve
 * HISTORIAN doğrulaması beklemektedir (bkz. recipes.ts başlığındaki not).
 */

export const timelineEventsSeed = [
  {
    slug: "conquest-of-istanbul",
    year: 1453,
    eraSlug: "classical-ottoman-period",
    recipeSlug: null as string | null,
    // Bağlı bir tarif yok — konum doğrudan burada (bkz. şema notu,
    // TimelineEvent.latitude/longitude).
    latitude: 41.0082,
    longitude: 28.9784,
    tr: {
      title: "İstanbul'un Fethi",
      description: "Osmanlı saray mutfağının kurumsallaşma sürecinin başlangıç noktası kabul edilir.",
    },
    en: {
      title: "The Conquest of Istanbul",
      description: "Considered the starting point of the institutionalization of the Ottoman palace kitchen.",
    },
  },
  {
    slug: "hunkarbegendi-palace-mention",
    year: 1550,
    eraSlug: "classical-ottoman-period",
    recipeSlug: "hunkarbegendi" as string | null,
    tr: {
      title: "Hünkârbeğendi'nin Saray Sofralarında Anılması",
      description: "Yıl kesin değildir; klasik dönem saray mutfağı geleneğini temsilen seçilmiştir.",
    },
    en: {
      title: "Hünkârbeğendi at the Palace Table",
      description: "The exact year is not certain; chosen to represent the classical-era palace kitchen tradition.",
    },
  },
  {
    slug: "asure-day-tradition",
    year: 1500,
    eraSlug: "classical-ottoman-period",
    recipeSlug: "asure" as string | null,
    tr: {
      title: "Aşure Günü Paylaşma Geleneği",
      description: "Yıl kesin değildir; Muharrem ayı paylaşma geleneğini temsilen seçilmiştir.",
    },
    en: {
      title: "The Ashura Day Sharing Tradition",
      description: "The exact year is not certain; chosen to represent the Muharram sharing custom.",
    },
  },
] as const;
