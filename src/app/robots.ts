import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = env.SITE_URL();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin-panel", "/admin-panel/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
