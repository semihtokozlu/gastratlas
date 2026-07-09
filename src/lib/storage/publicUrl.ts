const BUCKET = "recipe-images";

/**
 * Image.storagePath'ten tarayıcıda kullanılabilir tam public URL üretir.
 * Bilinçli olarak upload.ts'ten AYRI bir dosyada — upload.ts artık `sharp`
 * (native, sunucu-only) import ediyor; client component'ler (RecipeCard,
 * RecipeHero) bu saf string fonksiyonunu kullanırken sharp'ın client
 * bundle'a sızmasını engeller.
 */
export function getPublicImageUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storagePath}`;
}

export { BUCKET };
