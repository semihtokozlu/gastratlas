import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { BUCKET } from "./publicUrl";

const MAX_DIMENSION = 2000;

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

/**
 * Kaynak görseller (ör. Wikimedia Commons) bazen çok yüksek çözünürlüklü
 * (birkaç on MB) olabilir ve Storage bucket'ının boyut sınırını aşabilir.
 * Web'de zaten hiçbir zaman MAX_DIMENSION'dan büyük gösterilmeyeceği için
 * (next/image responsive sizes), gereksiz yere büyük dosyaları küçültür.
 */
async function resizeIfNeeded(buffer: Buffer, contentType: string): Promise<{ buffer: Buffer; contentType: string }> {
  if (!contentType.startsWith("image/") || contentType === "image/svg+xml") {
    return { buffer, contentType };
  }
  try {
    const metadata = await sharp(buffer).metadata();
    const exceedsDimension = (metadata.width ?? 0) > MAX_DIMENSION || (metadata.height ?? 0) > MAX_DIMENSION;
    const exceedsBytes = buffer.byteLength > 4 * 1024 * 1024;
    if (!exceedsDimension && !exceedsBytes) return { buffer, contentType };

    const resized = await sharp(buffer)
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    return { buffer: resized, contentType: "image/jpeg" };
  } catch {
    // sharp işleyemediyse (bozuk/desteklenmeyen format) orijinal buffer'la devam et —
    // upload adımı zaten boyut aşımında anlamlı bir hata fırlatacaktır.
    return { buffer, contentType };
  }
}

/** Dış bir URL'den görseli indirip Storage'a yükler (küratörlü/lisanslı örnek görseller için). */
export async function fetchAndUploadImage(
  sourceUrl: string,
  path: string
): Promise<{ storagePath: string; publicUrl: string; contentType: string }> {
  const res = await fetch(sourceUrl, { headers: { "User-Agent": "GastrAtlas/1.0 (editorial content fetch)" } });
  if (!res.ok) throw new Error(`Görsel indirilemedi (${res.status}): ${sourceUrl}`);
  const rawContentType = res.headers.get("content-type") ?? "image/jpeg";
  const rawBuffer = Buffer.from(await res.arrayBuffer());
  const { buffer, contentType } = await resizeIfNeeded(rawBuffer, rawContentType);
  const { storagePath, publicUrl } = await uploadImageBuffer(buffer, path, contentType);
  return { storagePath, publicUrl, contentType };
}
