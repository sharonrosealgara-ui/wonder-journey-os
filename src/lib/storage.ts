"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// localStorage-backed state for the MVP.
// Every key is namespaced under "wjos:". A custom event keeps
// multiple components on the same page in sync.
// Future: swap this layer for a real backend without touching pages.
// ─────────────────────────────────────────────────────────────

const PREFIX = "wjos:";
const EVENT = "wjos-storage";

export function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
  } catch {
    // localStorage full (usually large photos) — fail softly.
    console.warn("Could not save — storage may be full. Try a smaller photo.");
  }
}

// React hook: value is `fallback` during server render / first paint,
// then hydrates from localStorage (avoids hydration mismatches).
export function useStored<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  useEffect(() => {
    setValue(readStored(key, fallback));
    setReady(true);
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail?.key === key) {
        setValue(readStored(key, fallback));
      }
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Write outside React's render cycle: persist first, then let the
  // storage event update every subscribed component (including this one).
  const update = useCallback(
    (v: T | ((prev: T) => T)) => {
      const prev = readStored(key, fallbackRef.current);
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      writeStored(key, next);
      setValue(next);
    },
    [key]
  );

  return [value, update, ready];
}

// ── Family data backup (DATABASE.md, Backup Strategy) ────────
// Everything precious lives in localStorage until the backend exists;
// these let the family keep a copy and restore it on any device.

export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(PREFIX)) {
      try {
        data[key.slice(PREFIX.length)] = JSON.parse(window.localStorage.getItem(key)!);
      } catch {
        // skip unparseable entries
      }
    }
  }
  return JSON.stringify(
    { app: "wonder-journey-os", exportedAt: new Date().toISOString(), data },
    null,
    2
  );
}

export function importAllData(json: string): { ok: boolean; keys: number; error?: string } {
  try {
    const parsed = JSON.parse(json) as { app?: string; data?: Record<string, unknown> };
    if (parsed.app !== "wonder-journey-os" || !parsed.data) {
      return { ok: false, keys: 0, error: "That file doesn't look like a Wonder Journey backup." };
    }
    const entries = Object.entries(parsed.data);
    for (const [key, value] of entries) {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
    }
    return { ok: true, keys: entries.length };
  } catch {
    return { ok: false, keys: 0, error: "Couldn't read that file — is it the right backup?" };
  }
}

/** Remove one stored key (sign-out etc.) — precious records stay put. */
export function removeStored(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PREFIX + key);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
  } catch {
    /* ignore */
  }
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
