import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Faz 0: yalnızca statik sayfalar. Faz 1'de yayınlanmış tarifler
 * Prisma üzerinden buraya eklenecek (status = PUBLISHED).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));
}
