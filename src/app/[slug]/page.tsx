import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRegionByCode, getLinksForRegion, DEFAULT_REGION_CODE, getRegions } from "@/lib/data";
import { CATEGORY_META } from "@/lib/constants";
import { RegionPage } from "@/components/region-page";
import { generatePageMetadata } from "@/lib/seo.config";

export const dynamic = "force-static";
export const revalidate = 3600;

const RESERVED = new Set(["about", "dmca", "request", "how-it-works", "safety"]);

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  const mainCategories = ["movies", "anime", "manga", "livetv", "paid"];
  for (const cat of mainCategories) {
    params.push({ slug: cat });
  }

  const regions = await getRegions();
  for (const r of regions) {
    params.push({ slug: r.code.toLowerCase() });
  }

  return params;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug.toLowerCase();
  
  if (CATEGORY_META[slug]) {
    const m = CATEGORY_META[slug];
    return generatePageMetadata({
      title: `${m.label} — USA`,
      description: m.blurb,
      path: `/${slug}`,
    });
  }

  const r = await getRegionByCode(slug);
  if (r) {
    return generatePageMetadata({
      title: `${r.flag} ${r.name} Streaming Sites`,
      description: `Watch free movies, anime, and live TV streams curated for ${r.name}.`,
      path: `/${r.code.toLowerCase()}`,
    });
  }
  
  return {};
}

export default async function SlugRoute({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase();
  if (RESERVED.has(slug)) notFound();

  // Category under default region
  if (CATEGORY_META[slug]) {
    const region = await getRegionByCode(DEFAULT_REGION_CODE);
    if (!region) notFound();
    const data = await getLinksForRegion(region.code);
    if (!data.categories.find((c) => c.id === slug)) notFound();
    return <RegionPage region={region} onlyCategoryId={slug} />;
  }

  // Region
  const region = await getRegionByCode(slug);
  if (!region) notFound();
  return <RegionPage region={region} />;
}
