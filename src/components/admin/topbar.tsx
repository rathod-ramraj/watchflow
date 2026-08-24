"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import type { SessionUser } from "@/lib/auth/session";

export function AdminTopbar({ user }: { user: SessionUser | null }) {
  return (
    <div
      className="sticky top-0 z-30 border-b backdrop-blur-xl transition-all duration-200"
      style={{
        background: "color-mix(in oklab, var(--bg) 85%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/admin-panel" className="flex items-center gap-2.5 font-bold transition-opacity hover:opacity-90">
          <Image src="/logo.png" alt="" width={24} height={24} className="rounded-lg shadow-sm" />
          <span className="bg-gradient-to-r from-[var(--fg)] to-[var(--fg-muted)] bg-clip-text text-sm font-extrabold tracking-tight">
            FMW Admin
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--fg)]"
          >
            ← View site
          </Link>
          {user ? (
            <>
              <div
                className="flex items-center gap-2 rounded-full border px-2.5 py-1 shadow-sm transition-all"
                style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
              >
                <Image src={user.avatarUrl} alt="" width={20} height={20} className="h-5 w-5 rounded-full ring-1 ring-[var(--border)]" unoptimized />
                <span className="text-xs font-semibold">{user.githubLogin}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider"
                  style={{ background: "color-mix(in oklab, var(--accent) 15%, transparent)", color: "var(--accent)" }}
                >
                  {user.permission}
                </span>
              </div>
              <a
                href="/api/auth/github/logout"
                className="inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all hover:bg-[var(--bg-card-hover)] hover:text-[var(--danger,#f87171)] active:scale-95"
                style={{ borderColor: "var(--border)" }}
              >
                <LogOut size={12} /> Logout
              </a>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function AdminNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin-panel", label: "Dashboard" },
    { href: "/admin-panel/sites", label: "Sites" },
    { href: "/admin-panel/regions", label: "Regions" },
    { href: "/admin-panel/requests", label: "Inbox" },
    { href: "/admin-panel/tools", label: "Tools" },
  ];

  return (
    <nav className="mb-6 flex flex-wrap gap-1.5 border-b pb-3" style={{ borderColor: "var(--border)" }}>
      {tabs.map((t) => {
        const active = pathname === t.href || (t.href !== "/admin-panel" && pathname.startsWith(t.href));
        return (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] active:scale-95"
            style={{
              background: active ? "color-mix(in oklab, var(--accent) 16%, transparent)" : "transparent",
              color: active ? "var(--accent)" : "var(--fg-muted)",
              borderColor: active ? "var(--accent)" : "transparent",
              boxShadow: active ? "0 0 12px color-mix(in oklab, var(--accent) 20%, transparent)" : "none",
            }}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
