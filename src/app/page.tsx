import { getRegionByCode, DEFAULT_REGION_CODE } from "@/lib/data";
import { RegionPage } from "@/components/region-page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo.config";

export const dynamic = "force-static";

export const metadata: Metadata = generatePageMetadata({
  path: "/",
});

export default async function Home() {
  const region = await getRegionByCode(DEFAULT_REGION_CODE);
  if (!region) notFound();
  return <RegionPage region={region} />;
}
