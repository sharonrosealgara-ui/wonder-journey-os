import { AccessToken } from "livekit-server-sdk";

// 🔐 Secure LiveKit token minting — runs ONLY on Netlify's server.
// The LIVEKIT_API_SECRET never reaches the browser (Document 32).
//
// Required Netlify environment variables:
//   LIVEKIT_URL        wss://….livekit.cloud
//   LIVEKIT_API_KEY    API…
//   LIVEKIT_API_SECRET (secret — never in code or chat)
//   CLASSROOM_CODE     the family class code Sharon invents (e.g. "mangofloat")

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const url = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const classCode = process.env.CLASSROOM_CODE;

  if (!url || !apiKey || !apiSecret || !classCode) {
    // Not configured yet → the app falls back to solo (Stage 1) mode.
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { name?: string; room?: string; role?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  // Never anonymous, never public: the class code is the door key.
  if ((body.code ?? "").trim().toLowerCase() !== classCode.trim().toLowerCase()) {
    return Response.json({ error: "wrong_code" }, { status: 401 });
  }

  const name = String(body.name ?? "Explorer").slice(0, 40).replace(/[<>]/g, "");
  const room = String(body.room ?? "wonder-journey").slice(0, 80).replace(/[^a-zA-Z0-9_-]/g, "-");
  const role = body.role === "teacher" ? "teacher" : "family";

  const at = new AccessToken(apiKey, apiSecret, {
    identity: `${role}-${name}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    ttl: "3h", // room access expires after class
    metadata: JSON.stringify({ role }),
  });
  at.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: role === "teacher",
  });

  return Response.json({ token: await at.toJwt(), url, role });
};

export const config = { path: "/api/livekit-token" };
