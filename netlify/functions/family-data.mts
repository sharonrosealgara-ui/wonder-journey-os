import { getStore } from "@netlify/blobs";

// ─────────────────────────────────────────────────────────────
// FAMILY DATA API — the real backend (Netlify Blobs).
// The app mirrors the family's records here so blessings, journals,
// passport stamps and memories survive any device and sync between
// the Teacher's and the Family's screens.
//
// Auth: the family's class code (CLASSROOM_CODE env var) — the same
// shared secret that guards the live classroom.
//
//   GET  /api/family-data  → the family's full record  (JSON)
//   PUT  /api/family-data  → { data: {...} } merge-write
// ─────────────────────────────────────────────────────────────

type Rec = Record<string, unknown>;

function authorized(req: Request): boolean {
  const expected = process.env.CLASSROOM_CODE ?? "";
  if (!expected) return false;
  const got = req.headers.get("x-family-code") ?? "";
  return got.trim().toLowerCase() === expected.trim().toLowerCase();
}

function familyKey(req: Request): string {
  // one record per family workspace (multi-family ready)
  const slug = (req.headers.get("x-family") ?? "ferrell").replace(/[^a-z0-9-]/gi, "");
  return `family-${slug || "ferrell"}`;
}

/** Union two arrays of {id} records — incoming wins on conflict. */
function mergeById(incoming: unknown, existing: unknown): unknown {
  if (!Array.isArray(incoming) || !Array.isArray(existing)) return incoming ?? existing;
  const byId = new Map<string, unknown>();
  for (const r of existing) {
    const id = (r as { id?: string })?.id;
    if (id) byId.set(id, r);
  }
  for (const r of incoming) {
    const id = (r as { id?: string })?.id;
    if (id) byId.set(id, r);
  }
  const noId = [...existing, ...incoming].filter((r) => !(r as { id?: string })?.id);
  return [...byId.values(), ...noId];
}

export default async (req: Request): Promise<Response> => {
  if (!authorized(req)) {
    return Response.json({ error: "wrong or missing family code" }, { status: 401 });
  }

  const store = getStore("wonder-journey");
  const key = familyKey(req);

  if (req.method === "GET") {
    const data = ((await store.get(key, { type: "json" })) as Rec | null) ?? {};
    return Response.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (req.method === "PUT") {
    let body: { data?: Rec };
    try {
      body = (await req.json()) as { data?: Rec };
    } catch {
      return Response.json({ error: "invalid JSON" }, { status: 400 });
    }
    if (!body.data || typeof body.data !== "object") {
      return Response.json({ error: "expected { data: {...} }" }, { status: 400 });
    }

    const existing = ((await store.get(key, { type: "json" })) as Rec | null) ?? {};
    const merged: Rec = { ...existing };
    for (const [k, v] of Object.entries(body.data)) {
      merged[k] = mergeById(v, existing[k]);
    }
    merged._updatedAt = new Date().toISOString();
    await store.setJSON(key, merged);
    return Response.json({ ok: true, updatedAt: merged._updatedAt });
  }

  return Response.json({ error: "method not allowed" }, { status: 405 });
};

export const config = { path: "/api/family-data" };
