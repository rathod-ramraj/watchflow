import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRegionByCode, getLinksForRegion, getRegions } from "@/lib/data";
import { CATEGORY_META } from "@/lib/constants";
import { RegionPage } from "@/components/region-page";
import { generatePageMetadata } from "@/lib/seo.config";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const params: { slug: string; category: string }[] = [];
  const regions = await getRegions();

  for (const r of regions) {
    const code = r.code.toLowerCase();
    const data = await getLinksForRegion(r.code);
    for (const c of data.categories) {
      params.push({
        slug: code,
        category: c.id.toLowerCase(),
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; category: string };
}): Promise<Metadata> {
  const slug = params.slug.toLowerCase();
  const category = params.category.toLowerCase();
  const r = await getRegionByCode(slug);
  const meta = CATEGORY_META[category];
  if (!r || !meta) return {};
  
  return generatePageMetadata({
    title: `${meta.label} — ${r.flag} ${r.name}`,
    description: meta.blurb,
    path: `/${r.code.toLowerCase()}/${category}`,
  });
}

export default async function RegionCategoryRoute({
  params,
}: {
  params: { slug: string; category: string };
}) {
  const slug = params.slug.toLowerCase();
  const category = params.category.toLowerCase();
  const region = await getRegionByCode(slug);
  if (!region) notFound();
  if (!CATEGORY_META[category]) notFound();
  const data = await getLinksForRegion(region.code);
  if (!data.categories.find((c) => c.id === category)) notFound();
  return <RegionPage region={region} onlyCategoryId={category} />;
}
