import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, AlertTriangle } from "lucide-react";
import { generatePageMetadata, getCanonicalUrl } from "@/lib/seo.config";

export const metadata: Metadata = generatePageMetadata({
  title: "Safety & Online Security Guide – FMW",
  description:
    "Essential safety tips for browsing free media resources safely. Learn about ad-blockers, DNS protection, and safe web navigation from FMW (Free Media World).",
  path: "/safety",
});

export default function SafetyPage() {
  const canonicalUrl = getCanonicalUrl("/safety");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": getCanonicalUrl() },
      { "@type": "ListItem", "position": 2, "name": "Safety Guide", "item": canonicalUrl },
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
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Web Safety & Security Guide
          </h1>
          <p className="mt-3 text-sm font-medium text-[var(--fg-muted)] sm:text-base">
            Protect your browser and devices when discovering third-party media resources.
          </p>
        </header>

        <section className="space-y-6">
          <div className="cinex-card rounded-3xl p-6 sm:p-8 border border-[var(--border)]">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Lock size={18} className="text-[var(--accent)]" /> Use Modern Ad-Blockers & DNS Protection
            </h2>
            <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
              When visiting external third-party sites, aggressive popup ads or redirect loops can occur. We strongly recommend using reputable browser extensions like <strong className="text-[var(--fg)]">uBlock Origin</strong> and privacy-focused DNS services (such as NextDNS or Quad9) to block malicious popups automatically.
            </p>
          </div>

          <div className="cinex-card rounded-3xl p-6 sm:p-8 border border-[var(--border)]">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" /> Never Download Executable Files (.exe, .dmg, .apk)
            </h2>
            <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
              Legitimate web streaming sites do not require you to download flash player updates, codec installers, or executable files to view media. If a third-party site prompts you to download a suspicious file, immediately close the tab.
            </p>
          </div>

          <div className="cinex-card rounded-3xl p-6 sm:p-8 border border-[var(--border)]">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Eye size={18} className="text-[var(--accent)]" /> Support Official & Licensed Platforms
            </h2>
            <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
              FMW indexes official free-tier services (such as Arte TV, TF1, Tubi, Pluto TV, YouTube) alongside community resources. Whenever possible, support content creators by utilizing official licensed platforms available in your region.
            </p>
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link href="/" className="text-xs font-bold text-[var(--accent)] hover:underline">
            ← Back to FMW Media Discovery Directory
          </Link>
        </div>
      </main>
    </>
  );
}
