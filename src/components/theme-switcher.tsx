"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Palette, Check } from "lucide-react";
import { THEMES } from "./theme-provider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = mounted ? theme ?? "purple-dark" : "purple-dark";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Switch theme"
        onClick={() => setOpen((o) => !o)}
        className="watchflow-pill inline-flex h-9 items-center gap-2 px-3.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
      >
        <Palette size={15} className="text-[var(--accent)]" />
        <span className="hidden sm:inline">Theme</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border p-1.5 shadow-xl"
            style={{
              background: "var(--bg-elev)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200",
                  "hover:bg-[var(--bg-card-hover)] hover:translate-x-0.5",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-1 ring-white/10"
                    style={{ background: t.swatch }}
                  />
                  {t.label}
                </span>
                {current === t.id && <Check size={14} className="text-[var(--accent)]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

