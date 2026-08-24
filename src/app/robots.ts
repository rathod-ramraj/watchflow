import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/seo.config";

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin-panel", "/admin-panel/", "/api/", "/api/*"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/*.png", "/*.ico", "/*.svg"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
