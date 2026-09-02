# 🎥 Live Adventure Classroom — LiveKit Server Setup

The Live Adventure Classroom in Wonder Journey OS is powered by official LiveKit WebRTC server integration operating with Next.js dynamic API route authentication and Supabase database authorization.

---

## Architecture & Security Model

```
Authenticated User opens /classroom
        ↓
POST /api/livekit-token { sessionId: "uuid" }  (Next.js Route Handler — Hostinger Runtime)
        ↓
1. Supabase Auth validates session cookie
2. Checks workspace_members for active membership
3. Verifies classroom_sessions & classroom_participants database rows
4. Derives identity ("teacher-{id}" or "family-{id}"), roomName, and grants
        ↓
Mints signed LiveKit JWT token (roomAdmin: true for teachers only)
        ↓
Browser connects to LiveKit WebSocket server (ws:// / wss://)
```

### Security Rules:
- **Zero Client Grants:** The browser client only submits `{ sessionId }`. All roles, permissions, identities, and room assignments are database-derived.
- **Server-Only Secrets:** `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are never exposed to client bundles or browser JavaScript.
- **Role Isolation:** `roomAdmin` privilege is strictly granted only to verified teachers in active classroom sessions.

---

## Hostinger Environment Variables

In your Hostinger hPanel dashboard under **Web Apps → Environment Variables**, configure:

| Variable | Classification | Description |
|---|---|---|
| `LIVEKIT_URL` | Server-Only | WebSocket endpoint (e.g. `wss://your-project.livekit.cloud`) |
| `LIVEKIT_API_KEY` | Server-Only (Secret) | LiveKit project API key |
| `LIVEKIT_API_SECRET` | Server-Only (Secret) | LiveKit project API secret |

---

## Local Development & CI Testing

For local development and automated Playwright E2E verification:
- The local development environment uses the official LiveKit CLI or server binary (`livekit-server --dev`).
- CI dynamically initializes an official LiveKit server on `ws://127.0.0.1:7880` with crypto-generated ephemeral keys and real Supabase Auth.
