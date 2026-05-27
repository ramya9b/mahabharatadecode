/* ─────────────────────────────────────────────
   useLastRead — track the most recently visited article
   so the homepage can show a "Continue where you left off" card.
───────────────────────────────────────────── */
import { useEffect, useState } from "react";

const STORAGE_KEY = "mbd_last_read_article";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface LastReadEntry {
  slug: string;
  title: string;
  readAt: number; // epoch ms
}

const safeStorage = {
  get(k: string): string | null {
    try { return localStorage.getItem(k); } catch { return null; }
  },
  set(k: string, v: string): void {
    try { localStorage.setItem(k, v); } catch { /* private mode */ }
  },
  del(k: string): void {
    try { localStorage.removeItem(k); } catch { /* noop */ }
  },
};

/** Record the article a user is currently reading. Call from ArticlePage. */
export function recordLastRead(slug: string, title: string): void {
  const entry: LastReadEntry = { slug, title, readAt: Date.now() };
  safeStorage.set(STORAGE_KEY, JSON.stringify(entry));
}

/** Read the last-read entry. Returns null if missing, expired, or invalid. */
export function readLastRead(): LastReadEntry | null {
  const raw = safeStorage.get(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LastReadEntry;
    if (!parsed.slug || !parsed.title || !parsed.readAt) return null;
    if (Date.now() - parsed.readAt > MAX_AGE_MS) {
      safeStorage.del(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** React hook — returns last-read entry, refreshed on storage changes. */
export function useLastRead() {
  const [entry, setEntry] = useState<LastReadEntry | null>(() => readLastRead());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) setEntry(readLastRead());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const dismiss = () => {
    safeStorage.del(STORAGE_KEY);
    setEntry(null);
  };

  return { entry, dismiss };
}
