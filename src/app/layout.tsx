import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SafetyToast } from "@/components/safety-toast";
import { CommandPaletteProvider } from "@/components/command-palette";
import { RegionContextProvider } from "@/components/region-context";
import { getRegions, buildSearchIndex, DEFAULT_REGION_CODE } from "@/lib/data";

const geistSans = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = JetBrains_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://watchfloww.vercel.app"),
  title: {
    default: "WatchFlow",
    template: "%s · WatchFlow",
  },
  description:
    "A curated, regional list of free streaming sites — movies, TV shows, anime, manga, live TV, sports and more. Fast fuzzy search, multi-region, no ads on us.",
  applicationName: "WatchFlow",
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
    "watchflow",
  ],
  authors: [{ name: "WatchFlow Team", url: "https://watchfloww.vercel.app" }],
  creator: "WatchFlow Team",
  publisher: "WatchFlow",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "WatchFlow",
    title: "WatchFlow",
    description:
      "A curated, regional list of free streaming sites — movies, anime, manga, live TV and more.",
    url: "https://watchfloww.vercel.app",
    locale: "en_US",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "WatchFlow",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "WatchFlow",
    description:
      "Curated streaming sites for movies, anime, manga, live TV and more — fast fuzzy search, multi-region.",
    images: ["/favicon.png"],
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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
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
