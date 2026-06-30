"use client";

import Image from "next/image";
import { useState } from "react";
import { Copy, ExternalLink, Flag, Check, Star } from "lucide-react";
import type { Site } from "@/lib/types";
import { normalizeAsset, cn } from "@/lib/utils";
import { addRecent } from "./recently-visited";
import { useFavorites } from "@/lib/favorites";

interface Props {
  site: Site;
  categoryId: string;
}

function statusColor(status?: Site["status"]) {
  switch (status) {
    case "down": return "var(--danger)";
    case "new": return "var(--success)";
    case "trusted": return "var(--accent)";
    default: return null;
  }
}

export function SiteCard({ site, categoryId }: Props) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { has, toggle, mounted } = useFavorites();
  const starred = mounted && has(site.url);
  const color = statusColor(site.status);

  async function copyUrl(e: React.MouseEvent | React.KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(site.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  function star(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle({ name: site.name, url: site.url, logo: site.logo, categoryId });
  }

  let host = "";
  try { host = new URL(site.url).hostname.replace(/^www\./, ""); } catch {}

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noreferrer noopener"
      onClick={() => addRecent({ name: site.name, url: site.url, logo: site.logo, categoryId })}
      data-name={site.name.toLowerCase()}
      data-category={categoryId}
      data-tags={(site.tags ?? []).join(",").toLowerCase()}
      className={cn(
        "watchflow-card group relative flex aspect-[5/3] flex-col items-center justify-center gap-1.5 overflow-hidden p-3.5",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform hover:-translate-y-1 hover:scale-[1.03] hover:watchflow-glow",
        starred && "ring-1 ring-[var(--accent)]/30",
      )}
      title={site.name}
    >
      {/* gradient halo on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(130% 90% at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
        }}
      />

      {/* Status badge (top-left) */}
      {site.status && color && (
        <span
          className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[7px] font-extrabold uppercase tracking-wider shadow-sm"
          style={{ background: "color-mix(in oklab, " + color + " 15%, transparent)", color, border: `1px solid ${color}` }}
        >
          {site.status === "down" && <span className="pulse-dot h-1 w-1 rounded-full" style={{ background: color }} />}
          {site.status}
        </span>
      )}

      {/* Star button (top-right, always visible) */}
      <button
        type="button"
        aria-label={starred ? "Unstar" : "Star"}
        aria-pressed={starred}
        onClick={star}
        className={cn(
          "absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-lg transition-all duration-200 cursor-pointer",
          starred
            ? "text-[var(--accent)] opacity-100"
            : "text-[var(--fg-muted)] opacity-0 group-hover:opacity-100",
          "hover:bg-[var(--bg-elev)] hover:text-[var(--accent)] hover:scale-110 active:scale-95",
        )}
      >
        <Star size={13} fill={starred ? "currentColor" : "none"} strokeWidth={2} className="transition-transform group-hover:rotate-12" />
      </button>

      {/* Secondary actions (bottom-right) — always visible on touch, hover on desktop */}
      <div
        className={cn(
          "absolute bottom-2 right-2 z-10 flex gap-1",
          "opacity-100 md:opacity-0 md:transition-opacity md:duration-250 md:group-hover:opacity-100",
        )}
      >
        <button
          type="button"
          aria-label={copied ? "Copied" : "Copy URL"}
          onClick={copyUrl}
          className="grid h-6.5 w-6.5 place-items-center rounded-lg bg-[var(--bg-elev)]/80 text-[var(--fg-muted)] border border-[var(--border)] backdrop-blur-md hover:text-[var(--fg)] hover:border-[var(--border-strong)] transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          {copied ? <Check size={11} className="text-[var(--success)]" /> : <Copy size={11} />}
        </button>
      </div>

      <div className="relative flex h-14 w-full items-center justify-center px-4">
        {imgError ? (
          <div className="line-clamp-2 text-center text-sm font-bold text-white tracking-tight">{site.name}</div>
        ) : (
          <Image
            src={normalizeAsset(site.logo)}
            alt={site.name}
            width={160}
            height={64}
            className="max-h-12 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-108"
            unoptimized
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="z-10 flex max-w-full items-center gap-1.5 truncate text-[10px] text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors duration-200">
        <ExternalLink size={10} className="shrink-0 opacity-70" />
        <span className="truncate font-semibold tracking-tight">{host}</span>
      </div>
    </a>
  );
}
