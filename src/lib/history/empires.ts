/**
 * Harita ve zaman çizelgesinde paylaşılan imparatorluk renk/etiket/tarih
 * aralığı eşleşmesi — ikisi de aynı görsel dili kullansın diye tek
 * kaynak. Renkler bilinçli seçildi: Osmanlı bordo, Safevi bakır (marka
 * tonları); Bizans mor (Tyrian purple, imparatorluk rengine tarihi bir
 * gönderme); Abbasi siyah (hanedanlarının gerçek dinastik rengi); Endülüs
 * çini mavisi-yeşili; Selçuklu toprak tonu; Memlük İslami yeşil; İlhanlı
 * bozkır/hardal tonu.
 *
 * `startYear`/`endYear`, prisma/seed/data/*.ts'teki Civilization
 * kayıtlarıyla birebir eşleşir — harita sınır katmanı, seçili yılın bu
 * aralığın içinde olup olmadığına göre hangi varlığı gösterip
 * göstermeyeceğine burada karar verir (bkz. WorldMap.tsx).
 */
export type EmpireDef = {
  color: string;
  i18nKey: string;
  startYear: number;
  endYear: number;
};

export const EMPIRES: Record<string, EmpireDef> = {
  "Byzantine Empire": { color: "#5C3566", i18nKey: "empireByzantine", startYear: 330, endYear: 1453 },
  "Abbasid Caliphate": { color: "#2B2A28", i18nKey: "empireAbbasid", startYear: 750, endYear: 1258 },
  "Umayyad Caliphate of Córdoba": { color: "#2E7D6B", i18nKey: "empireAndalusian", startYear: 756, endYear: 1031 },
  "Sultanate of Rum": { color: "#A6693C", i18nKey: "empireSeljuk", startYear: 1077, endYear: 1308 },
  "Ilkhanate": { color: "#8B7355", i18nKey: "empireIlkhanate", startYear: 1256, endYear: 1335 },
  "Mamluk Sultanate": { color: "#3F6B3F", i18nKey: "empireMamluk", startYear: 1250, endYear: 1517 },
  "Ottoman Empire": { color: "#6E1F2E", i18nKey: "empireOttoman", startYear: 1453, endYear: 1922 },
  "Safavid Empire": { color: "#B4652D", i18nKey: "empireSafavid", startYear: 1501, endYear: 1736 },
};

export const EMPIRE_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(EMPIRES).map(([name, def]) => [name, def.color])
);

export const EMPIRE_I18N_KEYS: Record<string, string> = Object.fromEntries(
  Object.entries(EMPIRES).map(([name, def]) => [name, def.i18nKey])
);

/**
 * Bir imparatorluğun sınır çokgeninin seçili yıl için hâlâ gösterilip
 * gösterilmeyeceği — sınır anlık görüntü dosyaları (bkz.
 * historical-borders/README.md) bazen birden fazla imparatorluğu aynı
 * dosyada taşır; bu fonksiyon, dosya değişmeden de her varlığın kendi
 * gerçek tarih aralığına göre görünüp kaybolmasını sağlar (ör. 900.json
 * kullanılırken seçili yıl 1035 ise Endülüs artık gösterilmez).
 */
export function isEmpireActiveInYear(empireName: string, year: number): boolean {
  const def = EMPIRES[empireName];
  if (!def) return true;
  return year >= def.startYear && year <= def.endYear;
}

/**
 * Bir dönemin (era) rengi — çevrilmiş adının kırılgan string eşleşmesi
 * yerine başlangıç yılının hangi imparatorluğun aralığına düştüğüne göre
 * belirlenir.
 */
export function empireKeyForYearRange(startYear: number): string {
  for (const [name, def] of Object.entries(EMPIRES)) {
    if (startYear >= def.startYear && startYear < def.endYear) return name;
  }
  return "Ottoman Empire";
}

export function empireColorForYearRange(startYear: number): string {
  return EMPIRE_COLORS[empireKeyForYearRange(startYear)] ?? "#6B6660";
}
