import { codeOk, familySlug, json, type Ctx } from "../_shared";

// ─────────────────────────────────────────────────────────────
// EVENTS API — Make.com integration hub (Cloudflare KV).
//
//   POST /api/events   (from the app, guarded by the class code)
//     • appends the event to a rolling log in KV
//     • forwards it to your Make.com webhook if MAKE_WEBHOOK_URL is set
//
//   GET  /api/events?key=MAKE_API_KEY[&family=ferrell][&limit=50]
//     (for Make.com scenarios / dashboards to poll)
//     • returns the most recent events plus the family data snapshot
//
// Env: CLASSROOM_CODE (required) · MAKE_WEBHOOK_URL · MAKE_API_KEY
// Requires a KV namespace bound as WONDER_JOURNEY.
// ─────────────────────────────────────────────────────────────

type Evt = Record<string, unknown>;

const MAX_LOG = 500; // rolling window of recent events

export const onRequest = async ({ request, env }: Ctx): Promise<Response> => {
  const kv = env.WONDER_JOURNEY;
  if (!kv) return json({ error: "storage_not_configured" }, 503);
  const url = new URL(request.url);

  // ── Make.com reads ─────────────────────────────────────────
  if (request.method === "GET") {
    const apiKey = env.MAKE_API_KEY ?? "";
    const got = url.searchParams.get("key") ?? request.headers.get("x-api-key") ?? "";
    if (!apiKey || got !== apiKey) {
      return json({ error: "invalid API key" }, 401);
    }
    const slug = familySlug(url.searchParams.get("family"));
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, MAX_LOG);
    const log = ((await kv.get(`events-${slug}`, "json")) as Evt[] | null) ?? [];
    const data = ((await kv.get(`family-${slug}`, "json")) as Evt | null) ?? {};
    return json({ family: slug, events: log.slice(-limit).reverse(), data });
  }

  // ── App writes ─────────────────────────────────────────────
  if (request.method === "POST") {
    if (!codeOk(request, env)) {
      return json({ error: "wrong or missing family code" }, 401);
    }
    let evt: Evt;
    try {
      evt = await request.json();
    } catch {
      return json({ error: "invalid JSON" }, 400);
    }
    if (typeof evt.type !== "string" || !evt.type) {
      return json({ error: "event needs a type" }, 400);
    }
    const slug = familySlug((evt.family as string) ?? request.headers.get("x-family"));
    const record: Evt = { ...evt, family: slug, receivedAt: new Date().toISOString() };

    // 1) rolling event log (Make can poll; the app can audit)
    const logKey = `events-${slug}`;
    const log = ((await kv.get(logKey, "json")) as Evt[] | null) ?? [];
    log.push(record);
    await kv.put(logKey, JSON.stringify(log.slice(-MAX_LOG)));

    // 2) instant push to Make.com if a webhook is configured
    const hook = env.MAKE_WEBHOOK_URL ?? "";
    let forwarded = false;
    if (hook) {
      try {
        const res = await fetch(hook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
        forwarded = res.ok;
      } catch {
        forwarded = false; // logged locally either way
      }
    }
    return json({ ok: true, forwarded });
  }

  return json({ error: "method not allowed" }, 405);
};
