/**
 * Gerçek tarif malzemelerinden seçilmiş, coğrafi kökeni iyi belgelenmiş
 * birkaç malzeme. `ingredientSlug`, prisma/seed'deki Ingredient.slug ile
 * eşleşir (bkz. Tarçın→cinnamon, Safran→saffron vb.) — böylece bu katman
 * gerçek tarif verisine bağlı kalır, uydurma bir liste değildir.
 *
 * `domates`/tomato gibi Yeni Dünya ürünleri haritanın varsayılan görünüm
 * alanının çok dışında (Amerika kıtası) — kasıtlı bırakıldı: harita
 * sürüklenebilir (yalnızca scroll-zoom kapalı), meraklı kullanıcı için
 * bir "keşif" ögesi.
 */
export type IngredientOrigin = {
  ingredientSlug: string;
  nameTr: string;
  nameEn: string;
  lat: number;
  lng: number;
  originTr: string;
  originEn: string;
  noteTr: string;
  noteEn: string;
};

export const INGREDIENT_ORIGINS: IngredientOrigin[] = [
  {
    ingredientSlug: "saffron",
    nameTr: "Safran",
    nameEn: "Saffron",
    lat: 34.98,
    lng: 57.03, // Khorasan, İran — dünyanın en büyük safran üreticisi bölgesi
    originTr: "Horasan, İran",
    originEn: "Khorasan, Iran",
    noteTr: "Safran, İran'ın tarihi ihracat mallarından biriydi; Fars ve Osmanlı saray mutfaklarında pirinç ve tatlıları renklendirip kokulandırmak için kullanıldı.",
    noteEn: "Saffron was one of Iran's classic exports; it colored and perfumed rice and sweets in both Persian and Ottoman court kitchens.",
  },
  {
    ingredientSlug: "rose-water",
    nameTr: "Gül suyu",
    nameEn: "Rose water",
    lat: 32.66,
    lng: 51.67, // İsfahan — gül suyu üretimiyle ünlü tarihi merkez
    originTr: "İsfahan, İran",
    originEn: "Isfahan, Iran",
    noteTr: "Gül suyu damıtma geleneği İran'da gelişti; Osmanlı ve Fars tatlı kültüründe ortak bir imza koku haline geldi.",
    noteEn: "Rose-water distillation developed in Iran and became a shared signature aroma across Persian and Ottoman dessert traditions.",
  },
  {
    ingredientSlug: "cinnamon",
    nameTr: "Tarçın",
    nameEn: "Cinnamon",
    lat: 7.29,
    lng: 80.63, // Seylan (Sri Lanka) — gerçek tarçın (Cinnamomum verum) anavatanı
    originTr: "Seylan (bugünkü Sri Lanka)",
    originEn: "Ceylon (present-day Sri Lanka)",
    noteTr: "Gerçek tarçın yalnızca Seylan'a özgüydü; Ortaçağ boyunca Hint Okyanusu ve Baharat Yolu üzerinden Akdeniz'e ulaştı, çok değerli bir lüks maldı.",
    noteEn: "True cinnamon was native only to Ceylon; it reached the Mediterranean via the Indian Ocean and the Spice Route, and was a highly prized luxury good.",
  },
  {
    ingredientSlug: "chickpeas",
    nameTr: "Nohut",
    nameEn: "Chickpeas",
    lat: 37.16,
    lng: 38.79, // Güneydoğu Anadolu / Bereketli Hilal — nohut'un evcilleştirildiği bölge
    originTr: "Güneydoğu Anadolu (Bereketli Hilal)",
    originEn: "Southeastern Anatolia (Fertile Crescent)",
    noteTr: "Nohut, bölgenin kendi topraklarında binlerce yıl önce evcilleştirilen yerli bir üründür — dışarıdan gelmedi, tam da burada doğdu.",
    noteEn: "Unlike many spices on this map, the chickpea was domesticated right here, in this very region, thousands of years ago.",
  },
  {
    ingredientSlug: "rice",
    nameTr: "Pirinç",
    nameEn: "Rice",
    lat: 25.0,
    lng: 80.0, // Ganj/İndus havzası — pirincin Güney Asya'daki evcilleştirme bölgesi
    originTr: "Ganj-İndus havzası, Güney Asya",
    originEn: "Ganges–Indus basin, South Asia",
    noteTr: "Pirinç Güney Asya'da evcilleştirildi, ticaret yollarıyla batıya taşındı ve Fars pilav geleneğinin temel taşı haline geldi — oradan da Osmanlı sofralarına yayıldı.",
    noteEn: "Rice was domesticated in South Asia, travelled west along trade routes, and became the foundation of the Persian pilaf tradition — from there spreading to Ottoman tables.",
  },
  {
    ingredientSlug: "tomato",
    nameTr: "Domates",
    nameEn: "Tomato",
    lat: -13.16,
    lng: -72.55, // And Dağları / Peru-Ekvador — domatesin evcilleştirildiği bölge
    originTr: "And Dağları, Güney Amerika",
    originEn: "Andes region, South America",
    noteTr: "Bugün Akdeniz mutfağının vazgeçilmezi sanılan domates, aslında 1492 sonrası Kolomb Değişimi'yle Avrupa ve Ortadoğu'ya ulaşan çok yeni bir misafirdir.",
    noteEn: "Often assumed to be an ancient Mediterranean staple, the tomato is in fact a very recent arrival — it only reached Europe and the Middle East after 1492, via the Columbian Exchange.",
  },
];
