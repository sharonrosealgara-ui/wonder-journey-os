"use client";

// ─────────────────────────────────────────────────────────────
// CLOUD SYNC (Phase: real front-end + back-end)
// localStorage stays the fast local cache; this layer mirrors the
// family's precious records to the Netlify backend (Netlify Blobs
// via /api/family-data) and emits typed events to /api/events so
// Make.com automations can react to real family activity.
//
// Design rules honored:
//  • Prayer content is synced only as part of the family's own
//    journal records — never scored, counted, or gamified.
//  • The class code is the family's shared secret: no code, no sync.
//  • Offline-first: every failure is silent; the app never breaks
//    when the backend is unreachable.
// ─────────────────────────────────────────────────────────────

import { readStored, writeStored } from "@/lib/storage";
import { familySlug } from "@/config/family";

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
] as const;

const EVENT = "wjos-storage"; // fired by lib/storage on every write
const PUSH_DEBOUNCE_MS = 4000;
const MAX_PAYLOAD = 900_000; // stay well under function limits

let started = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
const dirty = new Set<string>();

function code(): string {
  return readStored<string>("classCode", "");
}

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
  const c = code();
  if (!c) return false;
  try {
    const res = await fetch("/api/family-data", {
      headers: { "x-family-code": c, "x-family": familySlug },
    });
    if (!res.ok) return false;
    const remote = (await res.json()) as Record<string, unknown>;
    for (const key of SYNC_KEYS) {
      if (!(key in remote)) continue;
      const local = readStored<unknown>(key, null);
      const merged = local === null ? remote[key] : mergeById(local, remote[key]);
      writeStored(key, merged);
    }
    return true;
  } catch {
    return false;
  }
}

/** Push the dirty keys (or everything) up to the cloud. */
export async function pushCloud(keys?: string[]): Promise<boolean> {
  const c = code();
  if (!c) return false;
  const list = keys ?? [...SYNC_KEYS];
  const data: Record<string, unknown> = {};
  for (const key of list) {
    const v = readStored<unknown>(key, null);
    if (v !== null) data[key] = v;
  }
  if (Object.keys(data).length === 0) return true;
  const body = JSON.stringify({ data });
  if (body.length > MAX_PAYLOAD) {
    // drop the heaviest keys (photos) and try the rest
    delete data.memories;
    delete data.cookbook;
  }
  try {
    const res = await fetch("/api/family-data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-family-code": c,
        "x-family": familySlug,
      },
      body: JSON.stringify({ data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Fire a typed event for Make.com automations. Fire-and-forget. */
export function sendEvent(type: string, detail: Record<string, unknown> = {}): void {
  const c = code();
  if (!c) return;
  try {
    void fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-family-code": c,
        "x-family": familySlug,
      },
      body: JSON.stringify({ type, family: familySlug, at: new Date().toISOString(), ...detail }),
    }).catch(() => {});
  } catch {
    /* offline — fine */
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
      void pushCloud(keys).then((ok) => {
        if (ok) sendEvent("data.updated", { keys });
      });
    }, PUSH_DEBOUNCE_MS);
  });

  // last-chance push when the tab closes
  window.addEventListener("beforeunload", () => {
    if (dirty.size > 0) void pushCloud([...dirty]);
  });
}
