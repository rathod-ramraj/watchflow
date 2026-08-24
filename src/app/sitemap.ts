import type { MetadataRoute } from "next";
import { getLinksForRegion, getRegions, getAllResources } from "@/lib/data";
import { getCanonicalUrl } from "@/lib/seo.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: getCanonicalUrl(), lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: getCanonicalUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: getCanonicalUrl("/how-it-works"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: getCanonicalUrl("/safety"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: getCanonicalUrl("/request"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: getCanonicalUrl("/dmca"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Category index pages
  const mainCategories = ["movies", "anime", "manga", "livetv", "paid"];
  for (const cat of mainCategories) {
    entries.push({
      url: getCanonicalUrl(`/${cat}`),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    });
  }

  // Region routes & regional category routes
  const regions = await getRegions();
  for (const r of regions) {
    const code = r.code.toLowerCase();
    entries.push({
      url: getCanonicalUrl(`/${code}`),
      lastModified: now,
      changeFrequency: "daily",
      priority: r.code === "USA" ? 0.95 : 0.8,
    });
    const data = await getLinksForRegion(r.code);
    for (const c of data.categories) {
      entries.push({
        url: getCanonicalUrl(`/${code}/${c.id}`),
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  }

  // Resource detail pages
  const resources = await getAllResources();
  for (const res of resources) {
    entries.push({
      url: getCanonicalUrl(`/resources/${res.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
