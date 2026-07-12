# 🎥 Live Classroom — LiveKit Setup

The Live Adventure Classroom has two stages:

- **Stage 1 — always works.** Your own camera, mic, and screen-share in the
  classroom (no account needed). If LiveKit isn't configured, the app falls back
  to this automatically ("Solo mode" banner).
- **Stage 2 — BUILT ✅, waiting only for keys.** Multi-person live video: the whole
  family sees and hears each other inside Wonder Journey, with live chat,
  raise-hand, and screen share. Turns on the moment the four environment
  variables below are set in Netlify.

---

## How it works (Document 32 security model)

```
Family opens /classroom → enters name + CLASS CODE → Join
        ↓
POST /api/livekit-token   (Netlify Function — server-side only)
        ↓ checks the class code, mints a signed 3-hour token
LiveKit Cloud room  wj-<lesson>-<date>   (unique per class day)
        ↓
Everyone's cameras/mics connect · chat + raise-hand via data channel
```

- The **API Secret** lives only in Netlify's environment — never in code, git,
  or the browser.
- **No anonymous access:** joining requires the class code Sharon chooses.
- Tokens expire after 3 hours; each class day gets its own room.
- Teacher joins from the Teacher Portal → gets `roomAdmin`; family gets
  publish/subscribe only.
- Attendance (join/leave times) is recorded on the teacher's device.

---

## ✅ Setup — the four Netlify environment variables

Project: **LiveKit Cloud → "Wonder Journey"** (already created).

In Netlify: **wonder-journey-os site → Site configuration → Environment
variables → Add a variable**, then add these four:

| Variable | Value |
|---|---|
| `LIVEKIT_URL` | `wss://wonder-journey-l114jmdv.livekit.cloud` |
| `LIVEKIT_API_KEY` | `API8Tepxned7uJo` |
| `LIVEKIT_API_SECRET` | *(copy from LiveKit → Settings → Keys — **paste directly into Netlify, never into chat/code**)* |
| `CLASSROOM_CODE` | *(invent a fun family password, e.g. `mangofloat` — share it with Shaun's family)* |

Then trigger a redeploy: **Deploys → Trigger deploy → Deploy site**
(env vars apply to functions immediately, but a redeploy is the sure way).

## Test it

1. Open `https://<your-site>/classroom/` on two devices (or two browsers).
2. Enter the class code on both, allow camera/mic, Join on both.
3. You should see and hear each other. 🎉
   - Teacher device: switch to Teacher Portal first to join as teacher.

If the code is wrong → friendly error. If variables are missing → Solo mode
banner (nothing breaks).

---

## Files involved

- `netlify/functions/livekit-token.mts` — secure token minting (`/api/livekit-token`)
- `src/app/classroom/page.tsx` — lobby, connected room, solo fallback
- `netlify.toml` — `[functions]` directory config

## Future (Stage 3)

Per-user accounts (Supabase) replace the shared class code · session recording ·
captions · breakout rooms — the room/token architecture already supports these.
