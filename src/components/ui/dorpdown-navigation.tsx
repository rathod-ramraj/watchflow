"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavSubItem = {
  label: string;
  description: string;
  icon: React.ElementType;
  href?: string;
};

export type NavSubMenu = {
  title: string;
  items: NavSubItem[];
};

export type NavItem = {
  id: number;
  label: string;
  link?: string;
  subMenus?: NavSubMenu[];
};

type Props = {
  navItems: NavItem[];
  className?: string;
};

export function DropdownNavigation({ navItems, className }: Props) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [isHover, setIsHover] = useState<number | null>(null);

  const handleHover = (menuLabel: string | null) => {
    setOpenMenu(menuLabel);
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <ul
        className="relative flex items-center space-x-1"
        onMouseLeave={() => {
          setIsHover(null);
          handleHover(null);
        }}
      >
        {navItems.map((navItem) => {
          const isHovered = isHover === navItem.id || openMenu === navItem.label;
          const isActiveLink = Boolean(
            pathname &&
              navItem.link &&
              (pathname === navItem.link || (navItem.link !== "/" && pathname.startsWith(navItem.link)))
          );
          const isItemActive = isHover !== null ? isHovered : isActiveLink;

          return (
            <li
              key={navItem.label}
              className="relative"
              onMouseEnter={() => {
                setIsHover(navItem.id);
                handleHover(navItem.label);
              }}
            >
              {navItem.link && !navItem.subMenus ? (
                <Link
                  href={navItem.link}
                  className="text-sm py-1.5 px-3.5 flex cursor-pointer group transition-colors duration-200 items-center justify-center gap-1 text-[var(--fg-muted)] hover:text-[var(--fg)] relative font-semibold"
                >
                  <span className={cn("relative z-10 transition-colors duration-200", isItemActive ? "text-[var(--fg)]" : "text-[var(--fg-muted)] group-hover:text-[var(--fg)]")}>{navItem.label}</span>
                  {isItemActive && (
                    <motion.div
                      layoutId="hover-nav-pill"
                      className="absolute inset-0 size-full rounded-full pointer-events-none z-0 overflow-hidden"
                      style={{
                        background: "linear-gradient(180deg, color-mix(in oklab, var(--accent) 35%, var(--bg-elev)) 0%, color-mix(in oklab, var(--accent) 55%, var(--bg-elev)) 50%, color-mix(in oklab, var(--accent) 75%, black) 100%)",
                        border: "1.5px solid color-mix(in oklab, var(--accent) 55%, var(--border-strong))",
                        boxShadow: "inset 0 1.5px 2px rgba(255, 255, 255, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -4px 10px rgba(0, 0, 0, 0.5), 0 0 12px 1px var(--accent-glow)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <div
                        className="absolute top-[1px] left-[3px] right-[3px] h-[46%] pointer-events-none"
                        style={{
                          borderTopLeftRadius: "999px",
                          borderTopRightRadius: "999px",
                          borderBottomLeftRadius: "100% 35%",
                          borderBottomRightRadius: "100% 35%",
                          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 80%, rgba(255, 255, 255, 0) 100%)",
                        }}
                      />
                    </motion.div>
                  )}
                </Link>
              ) : (
                <button
                  type="button"
                  className="text-sm py-1.5 px-3.5 flex cursor-pointer group transition-colors duration-200 items-center justify-center gap-1.5 relative font-semibold"
                >
                  <span className={cn("relative z-10 transition-colors duration-200", isItemActive ? "text-[var(--fg)]" : "text-[var(--fg-muted)] group-hover:text-[var(--fg)]")}>{navItem.label}</span>
                  {navItem.subMenus && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 relative z-10 duration-300 transition-transform text-[var(--fg-muted)] group-hover:text-[var(--fg)]",
                        openMenu === navItem.label && "rotate-180 text-[var(--fg)]",
                        isItemActive && "text-[var(--fg)]"
                      )}
                    />
                  )}
                  {isItemActive && (
                    <motion.div
                      layoutId="hover-nav-pill"
                      className="absolute inset-0 size-full rounded-full pointer-events-none z-0 overflow-hidden"
                      style={{
                        background: "linear-gradient(180deg, color-mix(in oklab, var(--accent) 35%, var(--bg-elev)) 0%, color-mix(in oklab, var(--accent) 55%, var(--bg-elev)) 50%, color-mix(in oklab, var(--accent) 75%, black) 100%)",
                        border: "1.5px solid color-mix(in oklab, var(--accent) 55%, var(--border-strong))",
                        boxShadow: "inset 0 1.5px 2px rgba(255, 255, 255, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -4px 10px rgba(0, 0, 0, 0.5), 0 0 12px 1px var(--accent-glow)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <div
                        className="absolute top-[1px] left-[3px] right-[3px] h-[46%] pointer-events-none"
                        style={{
                          borderTopLeftRadius: "999px",
                          borderTopRightRadius: "999px",
                          borderBottomLeftRadius: "100% 35%",
                          borderBottomRightRadius: "100% 35%",
                          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 80%, rgba(255, 255, 255, 0) 100%)",
                        }}
                      />
                    </motion.div>
                  )}
                </button>
              )}

              <AnimatePresence>
                {openMenu === navItem.label && navItem.subMenus && (
                  <div className="w-auto absolute left-0 top-full pt-2.5 z-50">
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl w-max"
                      style={{
                        background: "color-mix(in oklab, var(--bg-elev) 96%, transparent)",
                        borderColor: "var(--border-strong)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px color-mix(in oklab, var(--accent) 10%, transparent)",
                      }}
                    >
                      <div className="w-fit shrink-0 flex space-x-8 overflow-hidden">
                        {navItem.subMenus.map((sub) => (
                          <div className="w-full min-w-[200px]" key={sub.title}>
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                              {sub.title}
                            </h3>
                            <ul className="space-y-3.5">
                              {sub.items.map((item) => {
                                const Icon = item.icon;
                                const Component = item.href ? Link : "a";
                                return (
                                  <li key={item.label}>
                                    <Component
                                      href={item.href || "#"}
                                      className="flex items-start space-x-3 group rounded-xl p-1.5 -mx-1.5 transition-colors hover:bg-[var(--bg-card-hover)]"
                                    >
                                      <div className="border border-[var(--border)] text-[var(--accent)] rounded-lg flex items-center justify-center size-9 shrink-0 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300 shadow-sm" style={{ background: "var(--bg)" }}>
                                        <Icon className="h-4.5 w-4.5 flex-none" />
                                      </div>
                                      <div className="leading-4 w-max">
                                        <p className="text-xs font-bold text-[var(--fg)] shrink-0">
                                          {item.label}
                                        </p>
                                        <p className="text-[11px] text-[var(--fg-muted)] shrink-0 group-hover:text-[var(--fg)] transition-colors duration-200 mt-0.5">
                                          {item.description}
                                        </p>
                                      </div>
                                    </Component>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
