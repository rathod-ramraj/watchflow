"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const KEY = "cinex-safety-dismissed-v1";

export function SafetyToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) {
      const t = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(KEY, "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-50 w-[min(410px,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-xl border p-3.5 shadow-xl backdrop-blur-2xl transition-all duration-300"
      style={{
        background: "color-mix(in oklab, var(--bg-elev) 96%, transparent)",
        borderColor: "var(--border-strong)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.45), 0 0 16px color-mix(in oklab, var(--accent) 12%, transparent)",
      }}
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="absolute right-2.5 top-2.5 rounded-md p-1 text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--fg)] cursor-pointer"
      >
        <X size={14} />
      </button>

      <div className="flex flex-col gap-1.5 pr-5">
        <h3 className="text-sm font-bold tracking-tight text-[var(--fg)] sm:text-base">
          Before clicking any link!!!
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--fg-muted)] leading-relaxed">
          <span>Use</span>
          <a
            href="https://brave.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Image
              src="/assets/brave.png"
              alt="Brave"
              width={256}
              height={78}
              className="h-6.5 w-auto object-contain"
              unoptimized
            />
          </a>
          <span>or</span>
          <a
            href="https://ublockorigin.com/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Image
              src="/assets/ublock.png"
              alt="uBlock Origin"
              width={250}
              height={63}
              className="h-6.5 w-auto object-contain"
              unoptimized
            />
          </a>
        </div>

        <p className="text-xs text-[var(--fg-muted)]">
          to stop unwanted popups and ads.
        </p>
      </div>
    </div>
  );
}
