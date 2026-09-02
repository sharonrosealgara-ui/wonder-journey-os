"use client";

// ─────────────────────────────────────────────────────────────
// CLOUD SYNC
// localStorage stays the fast local cache; this layer mirrors the
// family's records to authenticated Supabase database actions.
//
// Design rules honored:
//  • Prayer content is synced only as part of the family's own
//    journal records — never scored, counted, or gamified.
//  • Authenticated Supabase session required.
//  • Offline-first: errors handled gracefully without breaking UI.
// ─────────────────────────────────────────────────────────────

import { readStored, writeStored } from "@/lib/storage";
import { pullFromSupabaseAction, pushToSupabaseAction } from "./supabase-actions";

// Records that matter across devices. (Photos/memories can be large;
// they sync too but oversized payloads are skipped gracefully.)
const SYNC_KEYS = [
  "gratitude",
  "journal",
  "completions",
  "awards",
  "cookbook",
  "memories",
  "points",
  "stamps",
  "voiceGifts",
  "photos",
] as const;

const EVENT = "wjos-storage"; // fired by lib/storage on every write
const PUSH_DEBOUNCE_MS = 4000;

let started = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
const dirty = new Set<string>();

/** Merge two arrays of records by `id` — union, local edits win. */
function mergeById(local: unknown, remote: unknown): unknown {
  if (!Array.isArray(local) || !Array.isArray(remote)) {
    // non-array values (counters etc.): prefer whichever exists locally
    return local ?? remote;
  }
  const byId = new Map<string, unknown>();
  for (const r of remote) {
    const id = (r as { id?: string })?.id;
    if (id) byId.set(id, r);
  }
  for (const l of local) {
    const id = (l as { id?: string })?.id;
    if (id) byId.set(id, l); // local wins on conflict
  }
  // records without ids: keep local as-is appended
  const noId = [...remote, ...local].filter((r) => !(r as { id?: string })?.id);
  return [...byId.values(), ...noId];
}

/** Pull the family's cloud copy and merge it into localStorage. */
export async function pullCloud(): Promise<boolean> {
  try {
    const { success, data } = await pullFromSupabaseAction();
    if (!success || !data) return false;

    for (const key of SYNC_KEYS) {
      if (!(key in data)) continue;
      const remoteKey = data[key as keyof typeof data];
      if (!remoteKey) continue;
      
      const local = readStored<unknown>(key, null);
      const merged = local === null ? remoteKey : mergeById(local, remoteKey);
      writeStored(key, merged);
    }
    return true;
  } catch {
    return false;
  }
}

/** Push the dirty keys (or everything) up to the cloud. */
export async function pushCloud(keys?: string[]): Promise<boolean> {
  const list = keys ?? [...SYNC_KEYS];
  const data: Record<string, unknown> = {};
  
  for (const key of list) {
    const v = readStored<unknown>(key, null);
    if (v !== null) data[key] = v;
  }
  
  if (Object.keys(data).length === 0) return true;
  
  try {
    const { success } = await pushToSupabaseAction(data);
    return success;
  } catch {
    return false;
  }
}

/**
 * Start cloud sync: pull once, then watch local writes and push
 * changes (debounced). Safe to call many times — runs once.
 */
export function initCloudSync(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  void pullCloud();

  window.addEventListener(EVENT, (e: Event) => {
    const key = (e as CustomEvent).detail?.key as string | undefined;
    if (!key || !(SYNC_KEYS as readonly string[]).includes(key)) return;
    dirty.add(key);
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      const keys = [...dirty];
      dirty.clear();
      void pushCloud(keys);
    }, PUSH_DEBOUNCE_MS);
  });

  // last-chance push when the tab closes
  window.addEventListener("beforeunload", () => {
    if (dirty.size > 0) void pushCloud([...dirty]);
  });
}
