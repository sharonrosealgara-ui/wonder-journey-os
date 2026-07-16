import { resolveCode, json, type Ctx } from "../_shared";

// 🚪 ACCESS CHECK — the front door asks: "whose code is this?"
//   POST /api/access  { code }
//   → 200 { ok: true, role: "teacher" | "family" }   code recognised
//   → 401 { error: "wrong_code" }                    code not recognised
//   → 503 { error: "not_configured" }                server has no codes yet
// The role comes from WHICH code matched (two-code system) — the browser
// never gets to choose. Used by the AccessGate to set up the device.
export const onRequest = async ({ request, env }: Ctx): Promise<Response> => {
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const role = resolveCode(body.code, env);
  if (role === "not_configured") return json({ error: "not_configured" }, 503);
  if (role === "wrong") return json({ error: "wrong_code" }, 401);
  return json({ ok: true, role });
};
