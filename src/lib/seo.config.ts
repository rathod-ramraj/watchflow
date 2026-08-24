import type { Metadata } from "next";
import { env } from "./env";

export const SEO_CONFIG = {
  brandName: "FMW",
  brandFullName: "Free Media World",
  tagline: "Free Media Resources & Streaming Directory",
  get siteUrl() {
    const raw = env.SITE_URL() || "https://fmwmedia.vercel.app";
    return raw.replace(/\/+$/, "");
  },
  defaultTitle: "FMW – Free Media World | Discover Free Media Resources",
  titleTemplate: "%s | FMW",
  defaultDescription:
    "Free Media World (FMW) is a clean media discovery directory helping users find legal, legitimate third-party resources for movies, TV series, anime, manga, sports, and entertainment apps.",
  keywords: [
    "fmw",
    "free media world",
    "free media resources",
    "streaming directory",
    "free movie resources",
    "free series resources",
    "anime streaming directory",
    "manga reader directory",
    "live tv channels",
    "sports streams directory",
    "entertainment apps",
    "fmhy alternative",
  ],
  socialImage: "/favicon-new.png",
  twitterHandle: "@fmwmedia",
  organization: {
    name: "Free Media World (FMW)",
    url: "https://fmwmedia.vercel.app",
    logo: "https://fmwmedia.vercel.app/favicon-new.png",
    sameAs: ["https://github.com/rathod-ramraj/watchflow"],
  },
};

export function getCanonicalUrl(path = ""): string {
  const base = SEO_CONFIG.siteUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath === "/" ? "" : cleanPath}`;
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  ogType = "website",
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
  image?: string;
}): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const pageTitle = title ? title : SEO_CONFIG.defaultTitle;
  const pageDesc = description ? description : SEO_CONFIG.defaultDescription;
  const ogImage = image || getCanonicalUrl(SEO_CONFIG.socialImage);

  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    title: title
      ? {
          default: pageTitle,
          template: SEO_CONFIG.titleTemplate,
        }
      : SEO_CONFIG.defaultTitle,
    description: pageDesc,
    applicationName: SEO_CONFIG.brandName,
    keywords: SEO_CONFIG.keywords,
    authors: [{ name: `${SEO_CONFIG.brandName} Team`, url: SEO_CONFIG.siteUrl }],
    creator: SEO_CONFIG.brandFullName,
    publisher: SEO_CONFIG.brandFullName,
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon-new.png", type: "image/png" },
        { url: "/favicon.png", type: "image/png" },
        { url: "/favicon.ico", type: "image/x-icon" },
      ],
      shortcut: "/favicon-new.png",
      apple: "/favicon-new.png",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: ogType,
      siteName: `${SEO_CONFIG.brandName} – ${SEO_CONFIG.brandFullName}`,
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 512,
          height: 512,
          alt: `${SEO_CONFIG.brandName} – ${SEO_CONFIG.brandFullName}`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: pageDesc,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function generateWebSiteJsonLd() {
  const base = SEO_CONFIG.siteUrl;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: `${base}/`,
        name: SEO_CONFIG.brandName,
        alternateName: SEO_CONFIG.brandFullName,
        description: SEO_CONFIG.defaultDescription,
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${base}/?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: SEO_CONFIG.organization.name,
        url: `${base}/`,
        logo: {
          "@type": "ImageObject",
          url: `${base}/favicon-new.png`,
        },
        sameAs: SEO_CONFIG.organization.sameAs,
      },
    ],
  };
}
