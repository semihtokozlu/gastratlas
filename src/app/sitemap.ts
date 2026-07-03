import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPublishedRecipeSlugs } from "@/features/recipes/queries";
import { getPublishedCountrySlugs } from "@/features/countries/queries";
import { getPublishedEraSlugs } from "@/features/eras/queries";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [recipeSlugs, countrySlugs, eraSlugs] = await Promise.all([
    getPublishedRecipeSlugs(),
    getPublishedCountrySlugs(),
    getPublishedEraSlugs(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({ url: `${base}/${locale}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 });
    entries.push({ url: `${base}/${locale}/recipes`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 });
    entries.push({ url: `${base}/${locale}/countries`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 });
    entries.push({ url: `${base}/${locale}/map`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 });
    entries.push({ url: `${base}/${locale}/timeline`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 });

    for (const slug of recipeSlugs) {
      entries.push({ url: `${base}/${locale}/recipes/${slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 });
    }
    for (const slug of countrySlugs) {
      entries.push({ url: `${base}/${locale}/countries/${slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 });
    }
    for (const slug of eraSlugs) {
      entries.push({ url: `${base}/${locale}/eras/${slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 });
    }
  }

  return entries;
}
