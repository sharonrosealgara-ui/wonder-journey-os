// Shared types + helpers for the Cloudflare Pages Functions.
// Deliberately hand-typed (no @cloudflare/workers-types dependency) so the
// repo stays light and the Next build never needs Cloudflare types.

/** The tiny slice of Cloudflare KV we actually use. */
export type KV = {
  get(key: string, type: "json"): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
};

export type Env = {
  // LiveKit (live classroom)
  LIVEKIT_URL?: string;
  LIVEKIT_API_KEY?: string;
  LIVEKIT_API_SECRET?: string;
  // the family's shared door key
  CLASSROOM_CODE?: string;
  // Make.com automation (optional)
  MAKE_WEBHOOK_URL?: string;
  MAKE_API_KEY?: string;
  // KV namespace binding — the family's cloud storage
  WONDER_JOURNEY?: KV;
};

export type Ctx = { request: Request; env: Env };

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

/** The class code is the door key for every app→server call. */
export function codeOk(request: Request, env: Env): boolean {
  const expected = env.CLASSROOM_CODE ?? "";
  if (!expected) return false;
  const got = request.headers.get("x-family-code") ?? "";
  return got.trim().toLowerCase() === expected.trim().toLowerCase();
}

/** One record per family workspace (multi-family ready). */
export function familySlug(raw: string | null | undefined): string {
  return (raw ?? "ferrell").replace(/[^a-z0-9-]/gi, "") || "ferrell";
}

/** Union two arrays of {id} records — incoming wins on conflict. */
export function mergeById(incoming: unknown, existing: unknown): unknown {
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
