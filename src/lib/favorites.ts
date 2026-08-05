"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const KEY = "cinex-favorites-v1";
const EVT = "cinex-favorites-changed";

export interface FavoriteItem {
  name: string;
  url: string;
  logo: string;
  categoryId: string;
  starredAt: number;
}

let cachedItems: FavoriteItem[] = [];
let cachedStarredSet = new Set<string>();
let isInitialized = false;

const listeners = new Set<() => void>();

function initCache() {
  if (isInitialized || typeof window === "undefined") return;
  isInitialized = true;
  try {
    const raw = localStorage.getItem(KEY);
    cachedItems = raw ? (JSON.parse(raw) as FavoriteItem[]) : [];
  } catch {
    cachedItems = [];
  }
  cachedStarredSet = new Set(cachedItems.map((f) => f.url));
}

function notify() {
  listeners.forEach((cb) => cb());
}

function read(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  initCache();
  return cachedItems;
}

function write(items: FavoriteItem[]) {
  cachedItems = items;
  cachedStarredSet = new Set(items.map((f) => f.url));
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  notify();
  window.dispatchEvent(new CustomEvent(EVT));
}

export function isStarred(url: string): boolean {
  if (typeof window === "undefined") return false;
  initCache();
  return cachedStarredSet.has(url);
}

export function toggleStar(item: Omit<FavoriteItem, "starredAt">): boolean {
  const cur = read();
  const exists = cur.some((f) => f.url === item.url);
  if (exists) {
    write(cur.filter((f) => f.url !== item.url));
    return false;
  }
  write([{ ...item, starredAt: Date.now() }, ...cur]);
  return true;
}

export function clearFavorites() {
  write([]);
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== "undefined") {
    const handleSync = () => {
      try {
        const raw = localStorage.getItem(KEY);
        const parsed = raw ? (JSON.parse(raw) as FavoriteItem[]) : [];
        cachedItems = parsed;
        cachedStarredSet = new Set(parsed.map((f) => f.url));
      } catch {
        cachedItems = [];
        cachedStarredSet = new Set();
      }
      callback();
    };
    window.addEventListener(EVT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      listeners.delete(callback);
      window.removeEventListener(EVT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  initCache();
  return cachedItems;
}

const SERVER_SNAPSHOT: FavoriteItem[] = [];
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function useFavorites() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = useCallback((item: Omit<FavoriteItem, "starredAt">) => toggleStar(item), []);
  const has = useCallback((url: string) => cachedStarredSet.has(url), [items]);

  return { items, has, toggle, mounted };
}
