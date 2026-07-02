/**
 * Yazar/imza kayıtları. Author modelinde çeviri tablosu yok — name/bio
 * tek dilli (şema kısıtı, Faz 1 ilk diliminde değiştirilmiyor).
 */

export const authorsSeed = [
  {
    slug: "gastratlas-mutfak",
    name: "GastrAtlas Mutfak Ekibi",
    bio: "GastrAtlas editoryal ekibi tarafından hazırlanan, tarihsel kaynaklarla desteklenen tarifler.",
  },
] as const;
