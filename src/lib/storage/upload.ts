import { createClient } from "@supabase/supabase-js";

const BUCKET = "recipe-images";

function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

/** Sunucu tarafında Supabase Storage'a yükler; storagePath next.config.ts'teki remotePattern ile uyumludur. */
export async function uploadImageBuffer(
  buffer: Buffer,
  path: string,
  contentType: string
): Promise<{ storagePath: string; publicUrl: string }> {
  const supabase = getServiceClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType, upsert: true });
  if (error) throw new Error(`Storage yüklemesi başarısız: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { storagePath: `${BUCKET}/${path}`, publicUrl: data.publicUrl };
}

/** Image.storagePath'ten tarayıcıda kullanılabilir tam public URL üretir. */
export function getPublicImageUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storagePath}`;
}

/** Dış bir URL'den görseli indirip Storage'a yükler (küratörlü/lisanslı örnek görseller için). */
export async function fetchAndUploadImage(
  sourceUrl: string,
  path: string
): Promise<{ storagePath: string; publicUrl: string; contentType: string }> {
  const res = await fetch(sourceUrl, { headers: { "User-Agent": "GastrAtlas/1.0 (editorial content fetch)" } });
  if (!res.ok) throw new Error(`Görsel indirilemedi (${res.status}): ${sourceUrl}`);
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const buffer = Buffer.from(await res.arrayBuffer());
  const { storagePath, publicUrl } = await uploadImageBuffer(buffer, path, contentType);
  return { storagePath, publicUrl, contentType };
}
