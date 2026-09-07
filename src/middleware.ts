import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Permanently redirect uppercase URLs to lowercase (excluding static files & API routes)
  if (
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.includes(".") &&
    /[A-Z]/.test(pathname)
  ) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  const res = NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.headers.set("CDN-Cache-Control", "no-store");
    res.headers.set("Cloudflare-CDN-Cache-Control", "no-store");
    res.headers.set("Vercel-CDN-Cache-Control", "no-store");
    res.headers.set("Pragma", "no-cache");
  }

  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    res.headers.set("Vary", "Accept-Encoding");
    res.headers.set("Cache-Control", "public, max-age=3600, must-revalidate");
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};