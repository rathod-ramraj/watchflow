"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, X } from "lucide-react";
import { CATEGORY_META } from "@/lib/constants";
import { CategoryIcon } from "./category-icon";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  categories: { id: string; name: string; count: number }[];
}

export function MobileCategoryBar({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Jump to category"
            className="fixed bottom-5 right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full px-5 shadow-xl lg:hidden cursor-pointer transition-all hover:scale-105 active:scale-95"
            style={{
              background: "var(--accent)",
              color: "var(--accent-fg)",
              boxShadow: "0 8px 24px var(--accent-glow)",
            }}
          >
            <LayoutGrid size={15} />
            <span className="text-sm font-bold tracking-tight">Categories</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: "rgba(0, 0, 0, 0.6)" }}
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-[24px] border-t p-6 pb-safe shadow-2xl"
              style={{ background: "var(--bg-elev)", borderColor: "var(--border)" }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full" style={{ background: "var(--border-strong)" }} />
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-extrabold tracking-tight">Jump to category</h3>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-[var(--fg-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--fg)] transition-all active:scale-90"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((c) => {
                  const meta = CATEGORY_META[c.id];
                  return (
                    <a
                      key={c.id}
                      href={`#cat-${c.id}`}
                      onClick={() => setOpen(false)}
                      className="watchflow-card flex items-center justify-between gap-2.5 px-3.5 py-3 text-sm font-semibold hover:border-[var(--accent)]"
                    >
                      <span className="flex items-center gap-2">
                        <CategoryIcon id={c.id} size={15} />
                        <span>{meta?.label ?? c.name}</span>
                      </span>
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-mono font-bold" style={{ background: "var(--bg)", color: "var(--fg-muted)" }}>
                        {c.count}
                      </span>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

