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
  // the family's shared door key. WJ_CLASS_CODE is an alias — added
  // because a dashboard entry named CLASSROOM_CODE got stuck in
  // Cloudflare's store (visible in the UI, never reached runtime);
  // a fresh name can't collide with a corrupted entry.
  CLASSROOM_CODE?: string;
  WJ_CLASS_CODE?: string;
  // the teacher's PRIVATE code — only Sharon holds it. Whoever presents
  // it is the teacher (roomAdmin etc.); the server decides, never the
  // browser. Optional: until it's set, the legacy single-code behaviour
  // stays, so deploying this never locks the teacher out.
  WJ_TEACHER_CODE?: string;
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

/**
 * The class code is the door key for every app→server call.
 *
 * "not_configured" is deliberately distinct from "wrong": if the server
 * has no CLASSROOM_CODE, that is OUR problem, not the family's — saying
 * "wrong code" would lock everyone out of their own platform while the
 * correct code is being typed. The app treats not_configured as "can't
 * check right now" and lets the family in.
 */
export type CodeRole = "teacher" | "family" | "wrong" | "not_configured";

/** Which door key is this? The CODE determines the ROLE (two-code system):
 *  teacher code → teacher · family code → family · anything else → wrong. */
export function resolveCode(raw: string | null | undefined, env: Env): CodeRole {
  const familyCode = (env.WJ_CLASS_CODE || env.CLASSROOM_CODE || "").trim().toLowerCase();
  const teacherCode = (env.WJ_TEACHER_CODE || "").trim().toLowerCase();
  if (!familyCode && !teacherCode) return "not_configured";
  const got = (raw ?? "").trim().toLowerCase();
  if (teacherCode && got === teacherCode) return "teacher";
  if (familyCode && got === familyCode) return "family";
  return "wrong";
}

export function codeCheck(request: Request, env: Env): "ok" | "wrong" | "not_configured" {
  const r = resolveCode(request.headers.get("x-family-code"), env);
  if (r === "not_configured") return "not_configured";
  return r === "wrong" ? "wrong" : "ok";
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
