import type { Metadata } from "next";
import Link from "next/link";
import { Search, Compass, ShieldCheck, CheckCircle2 } from "lucide-react";
import { generatePageMetadata, getCanonicalUrl } from "@/lib/seo.config";

export const metadata: Metadata = generatePageMetadata({
  title: "How FMW Works – Free Media Discovery Directory",
  description:
    "Learn how FMW (Free Media World) indexes, organizes, and verifies legal third-party media resources across movies, TV series, anime, manga, sports, and media apps.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  const canonicalUrl = getCanonicalUrl("/how-it-works");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": getCanonicalUrl() },
      { "@type": "ListItem", "position": 2, "name": "How It Works", "item": canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            How <span className="bg-gradient-to-r from-[var(--fg)] to-[var(--accent)] bg-clip-text text-transparent">FMW</span> Works
          </h1>
          <p className="mt-3 text-sm font-medium text-[var(--fg-muted)] sm:text-base">
            Your transparent guide to discovering legal, free media resources worldwide.
          </p>
        </header>

        {/* Step 1 */}
        <section className="cinex-card rounded-3xl p-6 sm:p-8 mb-8 border border-[var(--border)]">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
              <Search size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">1. Media Curation & Indexing</h2>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                FMW (Free Media World) functions exclusively as a media discovery directory. Our community and automated tools index third-party streaming sites, manga readers, live television streams, and media applications.
              </p>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="cinex-card rounded-3xl p-6 sm:p-8 mb-8 border border-[var(--border)]">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
              <Compass size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">2. Regional & Categorical Filtering</h2>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                Media availability varies significantly by geographic region. FMW organizes links into regional databases (e.g., USA, UK, India, France, Germany) and distinct categories (Movies, Anime, Manga, Live TV, Paid Services) so users can quickly locate resources relevant to their location.
              </p>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="cinex-card rounded-3xl p-6 sm:p-8 mb-8 border border-[var(--border)]">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">3. Non-Hosting & Third-Party Integrity</h2>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                FMW does not host, upload, or broadcast video files or copyrighted media content. All links direct users outward to external third-party websites. We encourage users to support legitimate content creators and legal streaming providers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/about"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--accent)] px-6 text-sm font-bold text-white transition-all hover:scale-105"
          >
            Learn More About FMW <CheckCircle2 size={16} />
          </Link>
        </div>
      </main>
    </>
  );
}
