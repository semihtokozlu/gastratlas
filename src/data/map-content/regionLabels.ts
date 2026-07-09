/**
 * Kıtaların üzerine serif/majüskül bölge etiketleri — eski atlas
 * plakalarındaki bölge yazıları gibi. Konumlar kabaca bölge merkezidir,
 * hassas bir sınır anlamı taşımaz.
 */
export type RegionLabel = {
  slug: string;
  lat: number;
  lng: number;
  nameTr: string;
  nameEn: string;
};

export const REGION_LABELS: RegionLabel[] = [
  { slug: "anatolia", lat: 39.2, lng: 34.5, nameTr: "ANADOLU", nameEn: "ANATOLIA" },
  { slug: "greece", lat: 39.5, lng: 22.2, nameTr: "YUNANİSTAN", nameEn: "GREECE" },
  { slug: "persia", lat: 32.5, lng: 54.5, nameTr: "İRAN", nameEn: "PERSIA" },
  { slug: "mediterranean", lat: 34.5, lng: 24.0, nameTr: "AKDENİZ", nameEn: "MEDITERRANEAN SEA" },
];
