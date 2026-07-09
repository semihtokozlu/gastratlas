/**
 * Harita ve zaman çizelgesinde paylaşılan imparatorluk renk/etiket
 * eşleşmesi — ikisi de aynı görsel dili kullansın diye tek kaynak.
 * Bizans için mor: Tyrian purple, Bizans imparatorluk rengine tarihi bir
 * gönderme; Osmanlı bordo, Safevi bakır (marka tonları).
 */
export const EMPIRE_COLORS: Record<string, string> = {
  "Ottoman Empire": "#6E1F2E",
  "Safavid Empire": "#B4652D",
  "Byzantine Empire": "#5C3566",
};

export const EMPIRE_I18N_KEYS: Record<string, string> = {
  "Ottoman Empire": "empireOttoman",
  "Safavid Empire": "empireSafavid",
  "Byzantine Empire": "empireByzantine",
};

/**
 * Renk, çevrilmiş dönem adının kırılgan string eşleşmesi yerine yıl
 * aralığına göre belirlenir (bkz. Era modeli: Bizans 330-1453, Osmanlı
 * Klasik 1453-1600, Safevi 1501-1736).
 */
export function empireKeyForYearRange(startYear: number): string {
  if (startYear < 1453) return "Byzantine Empire";
  if (startYear >= 1501) return "Safavid Empire";
  return "Ottoman Empire";
}

export function empireColorForYearRange(startYear: number): string {
  return EMPIRE_COLORS[empireKeyForYearRange(startYear)] ?? "#6B6660";
}
