import { codeCheck, familySlug, json, mergeById, type Ctx } from "../_shared";

// ─────────────────────────────────────────────────────────────
// FAMILY DATA API — the real backend (Cloudflare KV).
// The app mirrors the family's records here so blessings, journals,
// passport stamps, photos and memories survive any device and sync
// between the Teacher's and the Family's screens.
//
// Auth: the family's class code (CLASSROOM_CODE) — the same shared
// secret that guards the live classroom.
//
//   GET  /api/family-data  → the family's full record  (JSON)
//   PUT  /api/family-data  → { data: {...} } merge-write
//
// Requires a KV namespace bound as WONDER_JOURNEY.
// ─────────────────────────────────────────────────────────────

type Rec = Record<string, unknown>;

export const onRequest = async ({ request, env }: Ctx): Promise<Response> => {
  const check = codeCheck(request, env);
  if (check === "not_configured") {
    // our misconfiguration — never blame the family's code for it
    return json({ error: "not_configured" }, 503);
  }
  if (check === "wrong") {
    return json({ error: "wrong or missing family code" }, 401);
  }

  const kv = env.WONDER_JOURNEY;
  if (!kv) return json({ error: "storage_not_configured" }, 503);

  const key = `family-${familySlug(request.headers.get("x-family"))}`;

  if (request.method === "GET") {
    const data = ((await kv.get(key, "json")) as Rec | null) ?? {};
    return json(data);
  }

  if (request.method === "PUT") {
    let body: { data?: Rec };
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid JSON" }, 400);
    }
    if (!body.data || typeof body.data !== "object") {
      return json({ error: "expected { data: {...} }" }, 400);
    }

    const existing = ((await kv.get(key, "json")) as Rec | null) ?? {};
    const merged: Rec = { ...existing };
    for (const [k, v] of Object.entries(body.data)) {
      merged[k] = mergeById(v, existing[k]);
    }
    merged._updatedAt = new Date().toISOString();
    await kv.put(key, JSON.stringify(merged));
    return json({ ok: true, updatedAt: merged._updatedAt });
  }

  return json({ error: "method not allowed" }, 405);
};
