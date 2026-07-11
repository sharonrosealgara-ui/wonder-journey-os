# 🎥 Live Classroom — LiveKit Setup (Stage 2)

The Live Adventure Classroom is built in two stages.

- **Stage 1 — DONE ✅** Your own camera, microphone, and screen-share work live in
  the classroom right now (no account needed). Open **🎥 Live Classroom** in the sidebar.
- **Stage 2 — this guide.** Turn on **multi-person live video** so the whole family
  sees and hears each other inside Wonder Journey.

Stage 2 needs two things: a free **LiveKit Cloud** account, and one small **serverless
token function** (so the secret key never touches the browser). Here's the plan.

---

## Why a server piece is needed

Wonder Journey is a static site (great for speed + cost). Live video needs a tiny
server endpoint that hands each person a short-lived "join token," signed with your
**secret key**. That secret must **never** be in the app code or the browser. Netlify
Functions give us exactly this — a small server endpoint alongside the static site.

---

## Step 1 — Create a free LiveKit Cloud account

1. Go to **https://cloud.livekit.io** and sign up (free tier is generous).
2. Create a **Project** (name it "Wonder Journey").
3. Open the project's **Settings → Keys**. You'll see three values:
   - **WebSocket URL** — looks like `wss://your-project.livekit.cloud`
   - **API Key** — looks like `APIxxxxxxxx`
   - **API Secret** — a long secret string
4. **Keep the API Secret private.** Never paste it into the app or send it in chat.

## Step 2 — Add the keys to Netlify (securely)

1. In Netlify, open your **wonder-journey-os** site → **Site configuration →
   Environment variables**.
2. Add three variables:
   - `LIVEKIT_URL` = your WebSocket URL (`wss://…livekit.cloud`)
   - `LIVEKIT_API_KEY` = your API Key
   - `LIVEKIT_API_SECRET` = your API Secret
3. Also add a public one the app can read for the socket URL:
   - `NEXT_PUBLIC_LIVEKIT_URL` = the same `wss://…livekit.cloud`
4. Save.

> The `LIVEKIT_API_SECRET` stays server-only (used by the token function). The app
> only ever sees the public URL and a short-lived token.

## Step 3 — Tell your helper (me) it's ready

Once the keys are in Netlify, tell me **"LiveKit keys are set."** I will then:

1. Add the packages: `livekit-server-sdk` (for the token function) and
   `livekit-client` + `@livekit/components-react` (for the classroom).
2. Add a **Netlify Function** at `netlify/functions/livekit-token.mts` that:
   - accepts a family/teacher name + today's room id,
   - verifies it's an allowed member (family passphrase for now → full accounts later),
   - returns a signed join token. The secret never leaves the server.
3. Wire the classroom's camera tiles to LiveKit so everyone appears live, with:
   mute/unmute, camera on/off, screen-share, participant list, auto-reconnect,
   raise-hand, and live chat.
4. Save **attendance** (join/leave time) to the lesson archive.

---

## Security checklist (Document 32)

- ✅ Token minted **server-side only** (Netlify Function) — never on the client
- ✅ `LIVEKIT_API_SECRET` in an environment variable, never in code or git
- ✅ One room per class with a unique room id (lesson + date)
- ✅ HTTPS everywhere (Netlify default)
- ⬜ Full per-user auth (Stage 3) — Stage 2 uses a shared family passphrase so it is
  never anonymous/public, and upgrades to real accounts with the Supabase backend.

---

## Rough cost

LiveKit Cloud's free tier covers thousands of participant-minutes per month — far more
than one family's weekly classes. You will very likely never pay anything.

---

*When the keys are set, say the word and Stage 2 goes live the same day.*
