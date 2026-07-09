/**
 * Henüz tarifi olmasa da mutfak tarihinde önemli yeri olan şehirler —
 * haritaya coğrafi zenginlik katmak için. Tarif linki YOK (kasıtlı).
 */
export type CulinaryCity = {
  slug: string;
  lat: number;
  lng: number;
  nameTr: string;
  nameEn: string;
  noteTr: string;
  noteEn: string;
};

export const CULINARY_CITIES: CulinaryCity[] = [
  {
    slug: "aleppo",
    lat: 36.2,
    lng: 37.16,
    nameTr: "Halep",
    nameEn: "Aleppo",
    noteTr: "Yüzyıllar boyunca bölgenin en zengin mutfak geleneklerinden birine ev sahipliği yaptı; Halep biberi ve kebap çeşitleriyle tanınır.",
    noteEn: "Home to one of the region's richest culinary traditions for centuries; known for Aleppo pepper and its many kebab varieties.",
  },
  {
    slug: "bursa",
    lat: 40.18,
    lng: 29.06,
    nameTr: "Bursa",
    nameEn: "Bursa",
    noteTr: "İskender kebabın doğduğu şehir; ilk Osmanlı başkenti olarak saray mutfağının erken gelişiminde de rol oynadı.",
    noteEn: "Birthplace of İskender kebab; as the first Ottoman capital, it also played a role in the early development of the palace kitchen.",
  },
  {
    slug: "thessaloniki",
    lat: 40.64,
    lng: 22.94,
    nameTr: "Selanik",
    nameEn: "Thessaloniki",
    noteTr: "Osmanlı, Yunan ve Sefarad Yahudi mutfak geleneklerinin kesiştiği tarihi bir liman şehri.",
    noteEn: "A historic port city where Ottoman, Greek, and Sephardic Jewish culinary traditions intersected.",
  },
  {
    slug: "shiraz",
    lat: 29.6,
    lng: 52.54,
    nameTr: "Şiraz",
    nameEn: "Shiraz",
    noteTr: "Fars kültürünün kalbi; şiir ve bahçe kültürüyle birlikte incelikli bir sofra geleneğiyle de tanınır.",
    noteEn: "The heart of Persian culture; renowned for a refined table tradition alongside its poetry and garden culture.",
  },
];
