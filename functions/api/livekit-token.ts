import { type Ctx, json } from "../_shared";

// 🔐 Secure LiveKit token minting — runs ONLY on Cloudflare's edge.
// The LIVEKIT_API_SECRET never reaches the browser (Document 32).
//
// A LiveKit token is just a JWT signed HS256 with the API secret, so we
// sign it with Web Crypto rather than the Node SDK — no Node runtime, no
// extra dependency, and it works natively on the Workers runtime.
//
// Required Cloudflare environment variables:
//   LIVEKIT_URL        wss://….livekit.cloud
//   LIVEKIT_API_KEY    API…
//   LIVEKIT_API_SECRET (secret — never in code or chat)
//   CLASSROOM_CODE     the family class code (e.g. "12345")

function b64url(input: ArrayBuffer | string): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const signing = `${b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))}.${b64url(JSON.stringify(payload))}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signing));
  return `${signing}.${b64url(sig)}`;
}

export const onRequest = async ({ request, env }: Ctx): Promise<Response> => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = env.LIVEKIT_URL;
  const apiKey = env.LIVEKIT_API_KEY;
  const apiSecret = env.LIVEKIT_API_SECRET;
  const classCode = env.WJ_CLASS_CODE || env.CLASSROOM_CODE;

  if (!url || !apiKey || !apiSecret || !classCode) {
    // Not configured yet → the app falls back to solo (local camera) mode.
    return json({ error: "not_configured" }, 503);
  }

  let body: { name?: string; room?: string; role?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  // Never anonymous, never public: the class code is the door key.
  if ((body.code ?? "").trim().toLowerCase() !== classCode.trim().toLowerCase()) {
    return json({ error: "wrong_code" }, 401);
  }

  const name = String(body.name ?? "Explorer").slice(0, 40).replace(/[<>]/g, "");
  const room = String(body.room ?? "wonder-journey").slice(0, 80).replace(/[^a-zA-Z0-9_-]/g, "-");
  const role = body.role === "teacher" ? "teacher" : "family";

  const now = Math.floor(Date.now() / 1000);
  const token = await signJwt(
    {
      iss: apiKey,
      sub: `${role}-${name}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      nbf: now - 10, // small clock-skew grace
      exp: now + 3 * 60 * 60, // room access expires after class
      metadata: JSON.stringify({ role }),
      video: {
        room,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
        roomAdmin: role === "teacher",
      },
    },
    apiSecret
  );

  return json({ token, url, role });
};
