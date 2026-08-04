import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteShaderBackground } from "@/components/shader-background";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SafetyToast } from "@/components/safety-toast";
import { CommandPaletteProvider } from "@/components/command-palette";
import { RegionContextProvider } from "@/components/region-context";
import { getRegions, buildSearchIndex, DEFAULT_REGION_CODE } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://cinexx.vercel.app"),
  title: {
    default: "Cinex – Watch Movies, TV Shows, Anime & Live Entertainment",
    template: "%s | Cinex",
  },
  description:
    "A curated, regional list of free streaming sites — movies, TV shows, anime, manga, live TV, sports and more. Fast fuzzy search, multi-region, no ads on us.",
  applicationName: "Cinex",
  keywords: [
    "streaming sites",
    "free movies",
    "free tv shows",
    "anime streaming",
    "manga reader",
    "live tv",
    "sports streams",
    "fmhy alternative",
    "best streaming list",
    "cinex",
  ],
  authors: [{ name: "Cinex Team", url: "https://cinexx.vercel.app" }],
  creator: "Cinex Team",
  publisher: "Cinex",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-new.png", type: "image/png" },
    ],
    shortcut: "/favicon-new.png",
    apple: "/favicon-new.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Cinex",
    title: "Cinex",
    description:
      "A curated, regional list of free streaming sites — movies, anime, manga, live TV and more.",
    url: "https://cinexx.vercel.app",
    locale: "en_US",
    images: [
      {
        url: "/favicon-new.png",
        width: 512,
        height: 512,
        alt: "Cinex",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Cinex",
    description:
      "Curated streaming sites for movies, anime, manga, live TV and more — fast fuzzy search, multi-region.",
    images: ["/favicon-new.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "entertainment",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const regions = await getRegions();
  const searchIndex = await buildSearchIndex(DEFAULT_REGION_CODE);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Unbounded:wght@800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="qoel5C0iBe6WiY8ejJqpsAl9dpmHaXQ1mwKN0QKwsEI" />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://cinexx.vercel.app/#website",
                  "url": "https://cinexx.vercel.app/",
                  "name": "Cinex",
                  "description": "Watch Movies, TV Shows, Anime & Live Entertainment",
                  "potentialAction": [
                    {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://cinexx.vercel.app/?q={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  ]
                },
                {
                  "@type": "Organization",
                  "@id": "https://cinexx.vercel.app/#organization",
                  "name": "Cinex",
                  "url": "https://cinexx.vercel.app/",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://cinexx.vercel.app/favicon-new.png"
                  },
                  "sameAs": ["https://github.com/rathod-ramraj/watchflow"]
                }
              ]
            }),
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <SiteShaderBackground />
          <RegionContextProvider regions={regions} current={DEFAULT_REGION_CODE}>
            <CommandPaletteProvider initialIndex={searchIndex} regions={regions}>
              <Navbar />
              <div className="relative z-10">{children}</div>
              <Footer />
              <SafetyToast />
            </CommandPaletteProvider>
          </RegionContextProvider>
        </ThemeProvider>

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-TD8F20DS4V" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-TD8F20DS4V');`}
        </Script>
      </body>
    </html>
  );
}
