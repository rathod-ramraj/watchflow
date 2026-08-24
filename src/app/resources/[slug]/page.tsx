import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ShieldCheck, Tag, Globe, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { getResourceBySlug, getAllResources } from "@/lib/data";
import { generatePageMetadata, SEO_CONFIG, getCanonicalUrl } from "@/lib/seo.config";
import { CATEGORY_META } from "@/lib/constants";
import { normalizeAsset } from "@/lib/utils";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const resources = await getAllResources();
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const resource = await getResourceBySlug(params.slug);
  if (!resource) return { title: "Resource Not Found | FMW" };

  const catMeta = CATEGORY_META[resource.categoryId];
  const catName = catMeta?.label || resource.categoryName;

  return generatePageMetadata({
    title: `${resource.name} – Free ${catName} Resource Details`,
    description: `${resource.name} is a free ${catName} third-party resource indexed on FMW (Free Media World). Learn about platforms, features, safety guidelines, and official links.`,
    path: `/resources/${resource.slug}`,
    image: normalizeAsset(resource.logo),
  });
}

export default async function ResourceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const resource = await getResourceBySlug(params.slug);
  if (!resource) notFound();

  const allInCat = await getAllResources();
  const related = allInCat
    .filter((r) => r.categoryId === resource.categoryId && r.slug !== resource.slug)
    .slice(0, 6);

  const catMeta = CATEGORY_META[resource.categoryId];
  const catName = catMeta?.label || resource.categoryName;
  const canonicalUrl = getCanonicalUrl(`/resources/${resource.slug}`);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": getCanonicalUrl(),
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": catName,
        "item": getCanonicalUrl(`/${resource.categoryId}`),
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": resource.name,
        "item": canonicalUrl,
      },
    ],
  };

  const itemPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "mainEntity": {
      "@type": "WebSite",
      "name": resource.name,
      "url": resource.url,
      "description": `${resource.name} is a third-party ${catName} resource.`,
      "image": getCanonicalUrl(normalizeAsset(resource.logo)),
      "publisher": {
        "@type": "Organization",
        "name": SEO_CONFIG.brandFullName,
        "url": getCanonicalUrl(),
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemPageJsonLd) }}
      />

      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-[var(--fg-muted)]">
          <Link href="/" className="hover:text-[var(--fg)] transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${resource.categoryId}`} className="hover:text-[var(--fg)] transition-colors">{catName}</Link>
          <span>/</span>
          <span className="text-[var(--accent)] font-bold">{resource.name}</span>
        </nav>

        <Link
          href={`/${resource.categoryId}`}
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
        >
          <ArrowLeft size={14} /> Back to {catName} resources
        </Link>

        {/* Hero Card Header */}
        <article className="cinex-card rounded-3xl p-6 sm:p-8 mb-8 border border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[var(--bg-elev)] border border-[var(--border)] p-2 shadow-inner">
                <Image
                  src={normalizeAsset(resource.logo)}
                  alt={`${resource.name} logo`}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                  unoptimized
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--accent)]">
                    {catName}
                  </span>
                  {resource.status === "trusted" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 size={11} /> Verified
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{resource.name}</h1>
                <p className="mt-1 text-xs text-[var(--fg-muted)] flex items-center gap-2">
                  <Globe size={13} className="text-[var(--accent)]" /> {resource.url}
                </p>
              </div>
            </div>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              Visit Official Website <ExternalLink size={14} />
            </a>
          </div>

          <hr className="my-6 border-[var(--border)]" />

          {/* Detailed Info Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                <Tag size={14} className="text-[var(--accent)]" /> Resource Overview
              </h2>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                {resource.name} is a third-party resource cataloged in the <strong className="text-[var(--fg)]">{catName}</strong> section on FMW (Free Media World). It provides access to external media streams and services.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                <ShieldCheck size={14} className="text-[var(--accent)]" /> Safety & Legal Disclaimer
              </h2>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                FMW serves solely as an index directory. We do not host or broadcast any media content directly. Always practice safe browsing habits when accessing external third-party platforms.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-[var(--bg-elev)] p-4 text-xs font-semibold text-[var(--fg-muted)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--fg)]">Supported Devices:</span> Web Browser, Desktop, Mobile
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--fg)]">Directory Index:</span> FMW Discovery Database
            </div>
          </div>
        </article>

        {/* Related Resources */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">Related {catName} Resources</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/resources/${r.slug}`}
                  className="group cinex-card flex flex-col items-center justify-center p-4 text-center rounded-2xl border border-[var(--border)] transition-all hover:-translate-y-1 hover:border-[var(--accent)]"
                >
                  <Image
                    src={normalizeAsset(r.logo)}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain mb-2"
                    unoptimized
                  />
                  <span className="text-xs font-bold text-white group-hover:text-[var(--accent)] transition-colors">{r.name}</span>
                  <span className="text-[10px] text-[var(--fg-muted)] mt-0.5">View details →</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
