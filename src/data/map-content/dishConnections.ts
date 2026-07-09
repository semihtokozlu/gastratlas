/**
 * Aynı yemek ailesinin farklı mutfaklardaki akrabalarını birbirine
 * bağlayan çizgiler için editoryal olarak seçilmiş, gerçek tarif
 * verisine dayanan çiftler. Dil bilinçli olarak hedge'li — "türedi"
 * değil "ortak kökene sahip" / "akraba" gibi ifadeler (planlama §2.4
 * ile aynı doğruluk ilkesi: iddia edilemeyecek kesinlikte köken
 * belirtilmez).
 */
export type DishConnection = {
  slugA: string;
  slugB: string;
  labelTr: string;
  labelEn: string;
};

export const DISH_CONNECTIONS: DishConnection[] = [
  {
    slugA: "imam-bayildi",
    slugB: "musaka",
    labelTr: "Patlıcanlı Osmanlı-Yunan mutfağı akrabalığı",
    labelEn: "Shared Ottoman–Greek eggplant-dish heritage",
  },
  {
    slugA: "sekerpare",
    slugB: "loukoumades",
    labelTr: "\"Lokma\" geleneğinin iki kolu (ortak dilsel kök)",
    labelEn: "Two branches of the \"lokma\" (morsel) sweet tradition",
  },
  {
    slugA: "ic-pilav",
    slugB: "tahdig",
    labelTr: "Pilav geleneği: Fars kökenli, Osmanlı sofrasında yaygınlaştı",
    labelEn: "Pilaf tradition: Persian roots, widely adopted in Ottoman cuisine",
  },
  {
    slugA: "asure",
    slugB: "sholeh-zard",
    labelTr: "Ortak dini takvime bağlı tahıl tatlısı geleneği",
    labelEn: "Grain-pudding traditions tied to a shared religious calendar",
  },
];
