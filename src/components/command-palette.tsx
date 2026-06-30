"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Fuse from "fuse.js";
import { Command } from "cmdk";
import { Search, Globe, Folder, ExternalLink, Star } from "lucide-react";
import type { Region, SiteSearchEntry } from "@/lib/types";
import { CATEGORY_META } from "@/lib/constants";
import { normalizeAsset } from "@/lib/utils";
import { useFavorites, toggleStar } from "@/lib/favorites";
import { motion, AnimatePresence } from "framer-motion";

type Ctx = { open: () => void; close: () => void };
const PaletteCtx = createContext<Ctx | null>(null);

export function useCommandPalette() {
  const ctx = useContext(PaletteCtx);
  if (!ctx) return { open: () => {}, close: () => {} };
  return ctx;
}

interface ProviderProps {
  children: ReactNode;
  initialIndex: SiteSearchEntry[];
  regions: Region[];
}

export function CommandPaletteProvider({ children, initialIndex, regions }: ProviderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState("");
  const { items: favs, has: isFav } = useFavorites();

  const fuse = useMemo(
    () =>
      new Fuse(initialIndex, {
        keys: [
          { name: "name", weight: 0.7 },
          { name: "tags", weight: 0.2 },
          { name: "categoryName", weight: 0.1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [initialIndex],
  );

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => { setIsOpen(false); setQ(""); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((o) => !o);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const siteResults = useMemo(() => {
    if (!q.trim()) return initialIndex.slice(0, 8);
    return fuse.search(q).slice(0, 20).map((r) => r.item);
  }, [q, fuse, initialIndex]);

  const categoryMatches = useMemo(() => {
    const seen = new Set<string>();
    const out: { id: string; name: string }[] = [];
    for (const s of initialIndex) {
      if (!seen.has(s.categoryId)) {
        seen.add(s.categoryId);
        out.push({ id: s.categoryId, name: s.categoryName });
      }
    }
    if (!q.trim()) return out;
    const lc = q.toLowerCase();
    return out.filter((c) => c.id.includes(lc) || c.name.toLowerCase().includes(lc));
  }, [q, initialIndex]);

  const regionMatches = useMemo(() => {
    if (!q.trim()) return regions.slice(0, 5);
    const lc = q.toLowerCase();
    return regions.filter((r) => r.code.toLowerCase().includes(lc) || r.name.toLowerCase().includes(lc));
  }, [q, regions]);

  return (
    <PaletteCtx.Provider value={{ open, close }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 backdrop-blur-md"
              style={{ background: "color-mix(in oklab, var(--bg) 70%, transparent)" }}
            />
            {/* Command Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-[min(640px,calc(100vw-2rem))] overflow-hidden rounded-2xl border shadow-2xl"
              style={{ background: "var(--bg-elev)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
            >
              <Command label="Search WatchFlow" shouldFilter={false} className="flex flex-col">
                <div className="flex items-center gap-3 border-b px-4.5 py-3.5" style={{ borderColor: "var(--border)" }}>
                  <Search size={15} className="text-[var(--accent)]" />
                  <Command.Input
                    value={q}
                    onValueChange={setQ}
                    placeholder="Search sites, categories, regions…"
                    autoFocus
                    className="flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--fg-muted)]"
                  />
                  <kbd className="rounded border px-2 py-0.5 text-[9px] font-mono font-bold text-[var(--fg-muted)]" style={{ borderColor: "var(--border)" }}>ESC</kbd>
                </div>
                <Command.List className="max-h-[50vh] overflow-y-auto p-2 no-scrollbar">
                  <Command.Empty className="p-8 text-center text-sm font-semibold text-[var(--fg-muted)]">No results found.</Command.Empty>

                  {!q.trim() && favs.length > 0 && (
                    <Command.Group heading="Your favorites" className="[&_[cmdk-group-heading]]:px-3.5 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.15em] [&_[cmdk-group-heading]]:text-[var(--fg-muted)]">
                      {favs.slice(0, 6).map((f) => (
                        <Command.Item
                          key={`fav-${f.url}`}
                          value={`fav-${f.name}-${f.url}`}
                          onSelect={() => { window.open(f.url, "_blank", "noopener,noreferrer"); close(); }}
                          className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 aria-selected:bg-[var(--bg-card-hover)] aria-selected:translate-x-0.5"
                        >
                          <Image src={normalizeAsset(f.logo)} alt="" width={20} height={20} className="h-5 w-5 object-contain" unoptimized />
                          <div className="flex-1 truncate">
                            <div className="truncate font-bold text-white">{f.name}</div>
                            <div className="truncate text-xs text-[var(--fg-muted)]">{CATEGORY_META[f.categoryId]?.label ?? f.categoryId}</div>
                          </div>
                          <Star size={12} className="text-[var(--accent)]" fill="currentColor" />
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  {siteResults.length > 0 && (
                    <Command.Group heading="Sites" className="[&_[cmdk-group-heading]]:px-3.5 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.15em] [&_[cmdk-group-heading]]:text-[var(--fg-muted)]">
                      {siteResults.map((s) => {
                        const starred = isFav(s.url);
                        return (
                          <Command.Item
                            key={`${s.categoryId}-${s.url}`}
                            value={`site-${s.name}-${s.url}`}
                            onSelect={() => { window.open(s.url, "_blank", "noopener,noreferrer"); close(); }}
                            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 aria-selected:bg-[var(--bg-card-hover)] aria-selected:translate-x-0.5"
                          >
                            <Image src={normalizeAsset(s.logo)} alt="" width={20} height={20} className="h-5 w-5 object-contain" unoptimized />
                            <div className="flex-1 truncate">
                              <div className="truncate font-bold text-white">{s.name}</div>
                              <div className="truncate text-xs text-[var(--fg-muted)]">{CATEGORY_META[s.categoryId]?.label ?? s.categoryName}</div>
                            </div>
                            <button
                              type="button"
                              aria-label={starred ? "Unstar" : "Star"}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleStar({ name: s.name, url: s.url, logo: s.logo, categoryId: s.categoryId });
                              }}
                              className={`grid h-6 w-6 place-items-center rounded-md cursor-pointer transition-transform hover:scale-110 active:scale-90 ${starred ? "text-[var(--accent)]" : "text-[var(--fg-muted)] hover:text-[var(--accent)]"}`}
                            >
                              <Star size={12} fill={starred ? "currentColor" : "none"} />
                            </button>
                            <ExternalLink size={12} className="text-[var(--fg-muted)]" />
                          </Command.Item>
                        );
                      })}
                    </Command.Group>
                  )}

                  {categoryMatches.length > 0 && (
                    <Command.Group heading="Categories" className="[&_[cmdk-group-heading]]:px-3.5 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.15em] [&_[cmdk-group-heading]]:text-[var(--fg-muted)]">
                      {categoryMatches.map((c) => (
                        <Command.Item
                          key={c.id}
                          value={`cat-${c.id}`}
                          onSelect={() => { router.push(`/${c.id}`); close(); }}
                          className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 aria-selected:bg-[var(--bg-card-hover)] aria-selected:translate-x-0.5"
                        >
                          <span className="grid h-5 w-5 place-items-center text-[var(--accent)]"><Folder size={14} /></span>
                          <span className="flex-1 text-white">{CATEGORY_META[c.id]?.label ?? c.name}</span>
                          <span className="text-[10px] text-[var(--accent)] font-bold">Jump →</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  {regionMatches.length > 0 && (
                    <Command.Group heading="Regions" className="[&_[cmdk-group-heading]]:px-3.5 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.15em] [&_[cmdk-group-heading]]:text-[var(--fg-muted)]">
                      {regionMatches.map((r) => (
                        <Command.Item
                          key={r.code}
                          value={`region-${r.code}`}
                          onSelect={() => { router.push(r.code === "USA" ? "/" : `/${r.code.toLowerCase()}`); close(); }}
                          className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 aria-selected:bg-[var(--bg-card-hover)] aria-selected:translate-x-0.5"
                        >
                          <span className="grid h-5 w-5 place-items-center text-base">{r.flag}</span>
                          <span className="flex-1 text-white">{r.name}</span>
                          <Globe size={12} className="text-[var(--fg-muted)]" />
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}
                </Command.List>
                <div className="flex items-center justify-between border-t px-4.5 py-3 text-[10px] font-semibold text-[var(--fg-muted)]" style={{ borderColor: "var(--border)" }}>
                  <span><kbd className="font-mono bg-[var(--bg-elev)] border border-[var(--border)] px-1 rounded">↑↓</kbd> Navigate · <kbd className="font-mono bg-[var(--bg-elev)] border border-[var(--border)] px-1 rounded">↵</kbd> Open</span>
                  <span className="text-[var(--accent)] font-bold">WatchFlow</span>
                </div>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PaletteCtx.Provider>
  );
}

