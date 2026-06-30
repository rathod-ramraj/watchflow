"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/constants";
import { CategoryIcon } from "./category-icon";
import { useFavorites } from "@/lib/favorites";
import { motion } from "framer-motion";

interface Props {
  regionCode: string;
  categories: { id: string; name: string; count: number }[];
}

export function Sidebar({ categories }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const { items: favs, mounted } = useFavorites();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const ids = [...(favs.length ? ["favorites"] : []), ...categories.map((c) => c.id)];
    const sections = ids
      .map((id) => document.getElementById(`cat-${id}`))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id.replace("cat-", ""));
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories, favs.length]);

  return (
    <aside className="hidden lg:block lg:w-56 lg:shrink-0">
      <div className="sticky top-24 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--fg-muted)]">
          Categories
        </div>

        {mounted && favs.length > 0 && (
          <a
            href="#cat-favorites"
            className={cn(
              "relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              active === "favorites"
                ? "text-[var(--fg)]"
                : "text-[var(--fg-muted)] hover:bg-[var(--bg-card-hover)]/30 hover:text-[var(--fg)]",
            )}
          >
            {active === "favorites" && (
              <motion.div
                layoutId="active-sidebar-pill"
                className="absolute inset-0 rounded-xl bg-[var(--bg-card-hover)] border-l-2 border-[var(--accent)]"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2.5">
              <Star size={15} className="text-[var(--accent)]" fill="currentColor" />
              Favorites
            </span>
            <span
              className="relative z-10 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold"
              style={{
                background: active === "favorites" ? "var(--accent)" : "var(--bg-elev)",
                color: active === "favorites" ? "var(--accent-fg)" : "var(--fg-muted)",
              }}
            >
              {favs.length}
            </span>
          </a>
        )}

        {categories.map((c) => {
          const meta = CATEGORY_META[c.id];
          const isActive = active === c.id;
          return (
            <a
              key={c.id}
              href={`#cat-${c.id}`}
              className={cn(
                "relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "text-[var(--fg)]"
                  : "text-[var(--fg-muted)] hover:bg-[var(--bg-card-hover)]/30 hover:text-[var(--fg)]",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-pill"
                  className="absolute inset-0 rounded-xl bg-[var(--bg-card-hover)] border-l-2 border-[var(--accent)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2.5">
                <CategoryIcon id={c.id} size={15} className={cn("transition-colors", isActive ? "text-[var(--accent)]" : "")} />
                <span>{meta?.label ?? c.name}</span>
              </span>
              <span
                className="relative z-10 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold"
                style={{
                  background: isActive ? "var(--accent)" : "var(--bg-elev)",
                  color: isActive ? "var(--accent-fg)" : "var(--fg-muted)",
                }}
              >
                {c.count}
              </span>
            </a>
          );
        })}

        <div className="mt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--fg-muted)]">
          Community
        </div>
        <div className="px-1">
          <a
            href="https://discord.gg/5YuWjScVT"
            target="_blank"
            rel="noreferrer noopener"
            className="group relative block overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(88,101,242,0.15)]"
            style={{
              background: "linear-gradient(135deg, rgba(88,101,242,0.08), rgba(88,101,242,0.02))",
              borderColor: "rgba(88,101,242,0.25)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/25">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a14.07 14.07 0 0 0-.617 1.272 18.27 18.27 0 0 0-5.487 0A12.6 12.6 0 0 0 9.83 3 19.74 19.74 0 0 0 6.07 4.371C2.5 9.578 1.5 14.64 1.999 19.633A19.93 19.93 0 0 0 7.97 22.49c.48-.655.908-1.35 1.275-2.084-.7-.262-1.37-.586-2.003-.966.168-.122.333-.25.491-.382 3.872 1.787 8.06 1.787 11.886 0 .16.131.324.26.491.382-.634.382-1.305.706-2.005.967.367.733.795 1.427 1.275 2.084a19.9 19.9 0 0 0 5.972-2.857c.585-5.79-.99-10.806-4.034-15.265ZM8.673 16.61c-1.182 0-2.156-1.083-2.156-2.414 0-1.33.952-2.414 2.156-2.414 1.213 0 2.176 1.094 2.156 2.414 0 1.331-.952 2.414-2.156 2.414Zm6.66 0c-1.182 0-2.156-1.083-2.156-2.414 0-1.33.952-2.414 2.156-2.414 1.213 0 2.176 1.094 2.156 2.414 0 1.331-.943 2.414-2.156 2.414Z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white">Join Discord</div>
                <div className="truncate text-[10px] text-[var(--fg-muted)]">Get support & updates</div>
              </div>
            </div>
            <div className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#5865F2] px-3 py-1.5 text-center text-xs font-bold text-white transition duration-200 hover:bg-[#4752C4]">
              Join Chat
            </div>
          </a>
        </div>
      </div>
    </aside>
  );
}

