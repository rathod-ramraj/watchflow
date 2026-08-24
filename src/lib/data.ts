import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  LinksData,
  Region,
  RegionsData,
  Site,
  SiteSearchEntry,
} from "./types";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const DEFAULT_REGION = "USA";

async function readJSON<T>(rel: string): Promise<T> {
  const full = path.join(PUBLIC_DIR, rel);
  const raw = await fs.readFile(full, "utf8");
  return JSON.parse(raw) as T;
}

export async function getRegions(): Promise<Region[]> {
  const data = await readJSON<RegionsData>("regions.json");
  return data.regions.filter((r) => r.enabled !== false);
}

export async function getAllRegions(): Promise<Region[]> {
  const data = await readJSON<RegionsData>("regions.json");
  return data.regions;
}

export async function getRegionByCode(code: string): Promise<Region | null> {
  const regions = await getRegions();
  const upper = code.toUpperCase();
  return regions.find((r) => r.code === upper) ?? null;
}

async function loadLinksFile(regionCode: string): Promise<LinksData> {
  const upper = regionCode.toUpperCase();
  if (upper === DEFAULT_REGION) {
    return readJSON<LinksData>("links.json");
  }
  try {
    return await readJSON<LinksData>(`Region-Links/links.${upper}.json`);
  } catch {
    return readJSON<LinksData>("links.json");
  }
}

function sortSites(sites: Site[]): Site[] {
  const trusted: Site[] = [];
  const normal: Site[] = [];
  const newSites: Site[] = [];

  for (const s of sites) {
    if (s.status === "trusted") {
      trusted.push(s);
    } else if (s.status === "new") {
      newSites.push(s);
    } else {
      normal.push(s);
    }
  }

  return [...trusted, ...normal, ...newSites];
}

export async function getLinksForRegion(
  regionCode: string,
): Promise<LinksData> {
  const data = await loadLinksFile(regionCode);
  return {
    categories: data.categories.map((c) => ({
      ...c,
      sites: sortSites(c.sites.filter((s) => s.enabled !== false)),
    })),
  };
}

// Unfiltered — for the admin editor so disabled sites are still visible/editable.
export async function getAllLinksForRegion(
  regionCode: string,
): Promise<LinksData> {
  return loadLinksFile(regionCode);
}

export async function getCategory(
  regionCode: string,
  categoryId: string,
): Promise<{ region: Region; category: LinksData["categories"][number] } | null> {
  const region = await getRegionByCode(regionCode);
  if (!region) return null;
  const links = await getLinksForRegion(regionCode);
  const category = links.categories.find((c) => c.id === categoryId);
  if (!category) return null;
  return { region, category };
}

export async function buildSearchIndex(
  regionCode: string,
): Promise<SiteSearchEntry[]> {
  const links = await getLinksForRegion(regionCode);
  const out: SiteSearchEntry[] = [];
  for (const cat of links.categories) {
    for (const site of cat.sites) {
      out.push({
        ...site,
        categoryId: cat.id,
        categoryName: cat.name,
        regionCode: regionCode.toUpperCase(),
      });
    }
  }
  return out;
}

export function siteKey(site: Site): string {
  if (!site || !site.name) return "";
  try {
    const u = new URL(site.url);
    return `${site.name.toLowerCase()}@${u.hostname}`;
  } catch {
    return `${site.name.toLowerCase()}@${site.url || ""}`;
  }
}

export function createResourceSlug(name?: string): string {
  if (!name || typeof name !== "string") return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface ResourceItem extends Site {
  slug: string;
  categoryId: string;
  categoryName: string;
  regionCode: string;
}

export async function getAllResources(regionCode = DEFAULT_REGION_CODE): Promise<ResourceItem[]> {
  const index = await buildSearchIndex(regionCode);
  const map = new Map<string, ResourceItem>();

  for (const s of index) {
    if (!s || !s.name) continue;
    const slug = createResourceSlug(s.name);
    if (!slug || map.has(slug)) continue;
    map.set(slug, {
      ...s,
      slug,
    });
  }

  return Array.from(map.values());
}

export async function getResourceBySlug(slug?: string, regionCode = DEFAULT_REGION_CODE): Promise<ResourceItem | null> {
  if (!slug || typeof slug !== "string") return null;
  const resources = await getAllResources(regionCode);
  const target = slug.toLowerCase().trim();
  return resources.find((r) => r.slug === target) ?? null;
}

export const DEFAULT_REGION_CODE = DEFAULT_REGION;
