"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Outfit } from "next/font/google";
import { Menu, X, Search, Film, Tv, Radio, Trophy, BookOpen, Smartphone, FileText, Shield, Info } from "lucide-react";

const outfit = Outfit({ subsets: ["latin"], weight: ["800", "900"] });
import { ThemeSwitcher } from "./theme-switcher";
import { CountrySelect } from "./country-select";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "./command-palette";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownNavigation, NavItem } from "@/components/ui/dorpdown-navigation";

const CINEX_NAV: NavItem[] = [
  {
    id: 1,
    label: "Home",
    link: "/",
  },
  {
    id: 2,
    label: "About",
    link: "/about",
  },
  {
    id: 3,
    label: "Explore",
    subMenus: [
      {
        title: "Media Categories",
        items: [
          {
            label: "Movies & Shows",
            description: "Stream top movies and series",
            icon: Film,
            href: "/#cat-movies",
          },
          {
            label: "Anime & Cartoons",
            description: "High quality subbed & dubbed anime",
            icon: Tv,
            href: "/#cat-anime",
          },
          {
            label: "Live TV Channels",
            description: "Real-time global television networks",
            icon: Radio,
            href: "/#cat-livetv",
          },
        ],
      },
      {
        title: "More Content",
        items: [
          {
            label: "Sports Live",
            description: "Football, basketball, combat & racing",
            icon: Trophy,
            href: "/#cat-sports",
          },
          {
            label: "Manga & Comics",
            description: "Read manga, manhwa & webtoons",
            icon: BookOpen,
            href: "/#cat-manga",
          },
          {
            label: "Apps & Extensions",
            description: "Adblockers, players & streaming tools",
            icon: Smartphone,
            href: "/#cat-apps",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Request Site",
    link: "/request",
  },
  {
    id: 5,
    label: "DMCA",
    link: "/dmca",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { open: openPalette } = useCommandPalette();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300",
        scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.3)]" : "",
      )}
      style={{
        background: "color-mix(in oklab, var(--bg) 85%, transparent)",
        borderColor: scrolled ? "var(--border-strong)" : "var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-3 sm:gap-3 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-bold transition-transform active:scale-95">
          <Image priority src="/favicon-new.png" alt="Cinex Logo - Watch Movies & Anime" width={40} height={40} className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
          <span className={cn("text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[var(--fg)] to-[var(--accent)] bg-clip-text text-transparent", outfit.className)}>CINEX</span>
        </Link>

        {/* Dropdown Navigation for Desktop */}
        <div className="ml-4 hidden md:block">
          <DropdownNavigation navItems={CINEX_NAV} />
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Desktop pill search */}
          <button
            type="button"
            onClick={openPalette}
            aria-label="Search"
            className="cinex-pill hidden h-9 items-center gap-2.5 px-3.5 text-sm lg:inline-flex cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
          >
            <Search size={14} className="text-[var(--accent)]" />
            <span className="text-[var(--fg-muted)]">Search sites…</span>
            <kbd
              className="ml-3 rounded border px-1.5 py-0.5 text-[9px] font-mono text-[var(--fg-muted)]"
              style={{ borderColor: "var(--border)" }}
            >
              ⌘K
            </kbd>
          </button>
          {/* Compact search icon (small + medium screens) */}
          <button
            type="button"
            onClick={openPalette}
            aria-label="Search"
            className="cinex-pill inline-flex h-9 w-9 items-center justify-center lg:hidden cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Search size={15} />
          </button>

          {/* Country select */}
          <div className="hidden md:block">
            <CountrySelect />
          </div>

          {/* Discord */}
          <a
            href="https://discord.gg/btsQafsQ4"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Discord"
            className="cinex-pill inline-flex h-9 w-9 items-center justify-center md:hidden transition-all hover:scale-105 active:scale-95"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
              <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a14.07 14.07 0 0 0-.617 1.272 18.27 18.27 0 0 0-5.487 0A12.6 12.6 0 0 0 9.83 3 19.74 19.74 0 0 0 6.07 4.371C2.5 9.578 1.5 14.64 1.999 19.633A19.93 19.93 0 0 0 7.97 22.49c.48-.655.908-1.35 1.275-2.084-.7-.262-1.37-.586-2.003-.966.168-.122.333-.25.491-.382 3.872 1.787 8.06 1.787 11.886 0 .16.131.324.26.491.382-.634.382-1.305.706-2.005.967.367.733.795 1.427 1.275 2.084a19.9 19.9 0 0 0 5.972-2.857c.585-5.79-.99-10.806-4.034-15.265ZM8.673 16.61c-1.182 0-2.156-1.083-2.156-2.414 0-1.33.952-2.414 2.156-2.414 1.213 0 2.176 1.094 2.156 2.414 0 1.331-.952 2.414-2.156 2.414Zm6.66 0c-1.182 0-2.156-1.083-2.156-2.414 0-1.33.952-2.414 2.156-2.414 1.213 0 2.176 1.094 2.156 2.414 0 1.331-.943 2.414-2.156 2.414Z" />
            </svg>
          </a>

          <ThemeSwitcher />

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            className="cinex-pill inline-flex h-9 w-9 items-center justify-center md:hidden cursor-pointer transition-all hover:scale-105 active:scale-95"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t md:hidden"
            style={{ borderColor: "var(--border)", background: "var(--bg-elev)" }}
          >
            <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3">
              <ul className="flex flex-col gap-1">
                <li>
                  <Link href="/" className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[var(--fg-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--fg)]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[var(--fg-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--fg)]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/#cat-movies" className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[var(--fg-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--fg)]">
                    Explore Categories
                  </Link>
                </li>
                <li>
                  <Link href="/request" className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[var(--fg-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--fg)]">
                    Request Site
                  </Link>
                </li>
                <li>
                  <Link href="/dmca" className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[var(--fg-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--fg)]">
                    DMCA
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
