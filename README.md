# FMW — Free Media World

A curated, regional discovery directory organizing legal, third-party free media resources for movies, TV series, anime, manga, sports, and media apps.

## SEO System & Search Console Integration

FMW includes a centralized, production-ready technical SEO system designed for search engines (Google, Bing, DuckDuckGo).

### Environment Configuration

In your `.env` or deployment environment (Vercel, Railway, etc.), configure the canonical site domain:

```env
SITE_URL=https://fmwmedia.vercel.app
```

> **Note:** If you attach a custom production domain later (e.g. `https://freemediaworld.com`), simply change `SITE_URL` in your environment variables. All canonical tags, sitemaps, Open Graph tags, and JSON-LD schemas will update automatically.

### Search Console Setup Guide

1. **Verify Ownership**:
   - Open [Google Search Console](https://search.google.com/search-console).
   - Add your property URL matching your configured `SITE_URL`.
   - Verify via HTML tag (already pre-configured in `src/app/layout.tsx`) or DNS TXT record.

2. **Submit XML Sitemap**:
   - Navigate to **Sitemaps** in Search Console.
   - Enter `sitemap.xml` and click **Submit**.
   - The dynamic sitemap at `/sitemap.xml` includes all canonical category routes, region pages, guide pages, and individual resource detail pages (`/resources/[slug]`).

3. **Verify Indexing & Robots**:
   - Robots file: `https://fmwmedia.vercel.app/robots.txt`
   - XML Sitemap: `https://fmwmedia.vercel.app/sitemap.xml`

## Development & Features

- **Centralized SEO Config**: Defined in `src/lib/seo.config.ts`.
- **Dynamic Resource Detail Pages**: Individual SEO indexable pages located at `/resources/[slug]`.
- **Informational Guides**: `/about`, `/how-it-works`, `/safety`, `/request`, `/dmca`.
- **Raycast-style Command Palette**: `Cmd+K` / `Ctrl+K` site-wide fuzzy search.

## License

[MIT](LICENSE)
