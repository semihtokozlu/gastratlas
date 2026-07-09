/**
 * Tarihi ticaret rotalarının BASİTLEŞTİRİLMİŞ/temsili çizimleri —
 * hassas bir GIS veri kaynağına dayanmaz, bilinen genel güzergahın
 * birkaç ana durakla kabaca çizilmesidir (bkz. harita altındaki
 * "yaklaşıklık" notu). Amaç, gastronomi tarihinin ticaret yollarıyla
 * ne kadar iç içe olduğunu görselleştirmektir.
 */
export type TradeRoute = {
  slug: string;
  nameTr: string;
  nameEn: string;
  noteTr: string;
  noteEn: string;
  color: string;
  path: [number, number][]; // [lat, lng]
};

export const TRADE_ROUTES: TradeRoute[] = [
  {
    slug: "spice-route",
    nameTr: "Baharat Yolu",
    nameEn: "Spice Route",
    noteTr: "Tarçın, karabiber ve diğer baharatları Güney Asya'dan Basra Körfezi ve Fars topraklarından geçirerek Osmanlı sofralarına taşıyan deniz-kara güzergahı.",
    noteEn: "The sea-and-land corridor that carried cinnamon, pepper, and other spices from South Asia through the Persian Gulf and Persian lands to Ottoman tables.",
    color: "#B4652D",
    path: [
      [8, 77], // Güney Hindistan / Malabar kıyısı
      [25.3, 60.5], // Hürmüz Boğazı
      [29.4, 48.0], // Basra
      [33.3, 44.4], // Bağdat
      [36.2, 37.15], // Halep
      [41.01, 28.98], // İstanbul
    ],
  },
  {
    slug: "silk-road",
    nameTr: "İpek Yolu (batı kolu)",
    nameEn: "Silk Road (western branch)",
    noteTr: "Orta Asya'dan gelen ipek, baharat ve tatlı geleneklerini Fars topraklarından geçirip Anadolu'ya, oradan İstanbul'a ulaştıran kara güzergahının batı ucu.",
    noteEn: "The western end of the overland route that carried silk, spices, and sweet-making traditions from Central Asia through Persian lands into Anatolia and on to Istanbul.",
    color: "#6E1F2E",
    path: [
      [39.65, 66.96], // Semerkant
      [36.3, 59.6], // Meşhed
      [35.7, 51.4], // Tahran/Rey civarı
      [38.08, 46.29], // Tebriz
      [39.9, 41.27], // Erzurum
      [41.01, 28.98], // İstanbul
    ],
  },
];
