"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { CATEGORY_META } from "@/lib/constants";
import { CategoryIcon } from "./category-icon";
import { cn } from "@/lib/utils";

interface Props {
  categories: { id: string; name: string }[];
}

export function FilterChips({ categories }: Props) {
  const [active, setActive] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const query = q.trim().toLowerCase();
    const sections = document.querySelectorAll<HTMLElement>("section[data-category]");
    let totalVisible = 0;

    sections.forEach((sec) => {
      const cat = sec.dataset.category!;
      const cards = sec.querySelectorAll<HTMLElement>("a[data-name]");
      let sectionVisibleCount = 0;
      const catMatch = active.size === 0 || active.has(cat) || cat === "favorites";

      cards.forEach((card) => {
        const name = card.dataset.name ?? "";
        const tags = card.dataset.tags ?? "";
        const categoryId = card.dataset.category ?? "";
        const queryMatch =
          !query ||
          name.includes(query) ||
          tags.includes(query) ||
          categoryId.includes(query);
        const show = catMatch && queryMatch;
        card.style.display = show ? "" : "none";
        if (show) sectionVisibleCount++;
      });

      const showSection = catMatch && sectionVisibleCount > 0;
      sec.style.display = showSection ? "" : "none";
      if (showSection) totalVisible += sectionVisibleCount;
    });

    setNoResults(totalVisible === 0);
  }, [q, active]);

  function selectTab(id: string | null) {
    if (!id) {
      setActive(new Set());
    } else {
      setActive((prev) => {
        if (prev.has(id) && prev.size === 1) return new Set();
        return new Set([id]);
      });
    }
  }

  return (
    <>
      <div
        className="sticky top-[57px] z-30 mb-5 rounded-2xl border px-3 py-2.5 backdrop-blur-xl sm:px-4 md:top-[64px] md:mb-6 md:px-5 md:py-3 shadow-lg"
        style={{
          background: "color-mix(in oklab, var(--bg-elev) 88%, transparent)",
          borderColor: "var(--border-strong)",
        }}
      >
        <div className="flex flex-col gap-2.5">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter on this page…"
              className="h-10 w-full rounded-xl border bg-[var(--bg)] pl-10 pr-10 text-sm outline-none transition-colors focus:border-[var(--accent)] md:h-11 shadow-inner"
              style={{ borderColor: "var(--border)" }}
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)]"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
            <button
              type="button"
              data-active={active.size === 0}
              onClick={() => selectTab(null)}
              className={cn("watchflow-pill h-8 shrink-0 px-3.5 text-xs font-semibold rounded-xl cursor-pointer")}
            >
              All
            </button>
            {categories.map((c) => {
              const meta = CATEGORY_META[c.id];
              const isActive = active.has(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  data-active={isActive}
                  onClick={() => selectTab(c.id)}
                  className={cn("watchflow-pill inline-flex h-8 shrink-0 items-center gap-1.5 px-3.5 text-xs font-semibold rounded-xl cursor-pointer")}
                >
                  <CategoryIcon id={c.id} size={14} />
                  {meta?.label ?? c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {noResults && (
        <div className="my-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] p-8 text-center bg-[var(--bg-card)]">
          <div className="mb-2 text-3xl">🔍</div>
          <h3 className="text-base font-bold text-[var(--fg)]">No content found</h3>
          <p className="mt-1 text-xs text-[var(--fg-muted)]">
            No sites match your filter or search criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setActive(new Set());
            }}
            className="mt-4 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-[var(--accent-fg)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </>
  );
}
