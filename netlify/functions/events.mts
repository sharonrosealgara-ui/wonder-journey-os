import { getStore } from "@netlify/blobs";

// ─────────────────────────────────────────────────────────────
// EVENTS API — Make.com integration hub.
//
//   POST /api/events   (from the app, guarded by the class code)
//     • appends the event to a rolling log in Netlify Blobs
//     • forwards it to your Make.com webhook if MAKE_WEBHOOK_URL is set
//
//   GET  /api/events?key=MAKE_API_KEY[&family=ferrell][&limit=50]
//     (for Make.com scenarios / dashboards to poll)
//     • returns the most recent events plus the family data snapshot
//
// Env vars (Netlify → Site settings → Environment variables):
//   CLASSROOM_CODE    — already set (guards app→server calls)
//   MAKE_WEBHOOK_URL  — optional; your Make.com "Custom webhook" URL
//   MAKE_API_KEY      — optional; any long random string Make uses to read
// ─────────────────────────────────────────────────────────────

type Evt = Record<string, unknown>;

const MAX_LOG = 500; // rolling window of recent events

function codeOk(req: Request): boolean {
  const expected = process.env.CLASSROOM_CODE ?? "";
  if (!expected) return false;
  const got = req.headers.get("x-family-code") ?? "";
  return got.trim().toLowerCase() === expected.trim().toLowerCase();
}

function familySlug(raw: string | null): string {
  return (raw ?? "ferrell").replace(/[^a-z0-9-]/gi, "") || "ferrell";
}

export default async (req: Request): Promise<Response> => {
  const store = getStore("wonder-journey");
  const url = new URL(req.url);

  // ── Make.com reads ─────────────────────────────────────────
  if (req.method === "GET") {
    const apiKey = process.env.MAKE_API_KEY ?? "";
    const got = url.searchParams.get("key") ?? req.headers.get("x-api-key") ?? "";
    if (!apiKey || got !== apiKey) {
      return Response.json({ error: "invalid API key" }, { status: 401 });
    }
    const slug = familySlug(url.searchParams.get("family"));
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, MAX_LOG);
    const log = ((await store.get(`events-${slug}`, { type: "json" })) as Evt[] | null) ?? [];
    const data = ((await store.get(`family-${slug}`, { type: "json" })) as Evt | null) ?? {};
    return Response.json(
      { family: slug, events: log.slice(-limit).reverse(), data },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  // ── App writes ─────────────────────────────────────────────
  if (req.method === "POST") {
    if (!codeOk(req)) {
      return Response.json({ error: "wrong or missing family code" }, { status: 401 });
    }
    let evt: Evt;
    try {
      evt = (await req.json()) as Evt;
    } catch {
      return Response.json({ error: "invalid JSON" }, { status: 400 });
    }
    if (typeof evt.type !== "string" || !evt.type) {
      return Response.json({ error: "event needs a type" }, { status: 400 });
    }
    const slug = familySlug((evt.family as string) ?? req.headers.get("x-family"));
    const record: Evt = { ...evt, family: slug, receivedAt: new Date().toISOString() };

    // 1) rolling event log (Make can poll; the app can audit)
    const key = `events-${slug}`;
    const log = ((await store.get(key, { type: "json" })) as Evt[] | null) ?? [];
    log.push(record);
    await store.setJSON(key, log.slice(-MAX_LOG));

    // 2) instant push to Make.com if a webhook is configured
    const hook = process.env.MAKE_WEBHOOK_URL ?? "";
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
    return Response.json({ ok: true, forwarded });
  }

  return Response.json({ error: "method not allowed" }, { status: 405 });
};

export const config = { path: "/api/events" };
