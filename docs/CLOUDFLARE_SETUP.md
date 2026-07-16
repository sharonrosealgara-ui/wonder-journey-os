# ☁️ Cloudflare Pages Setup — Wonder Journey OS

Wonder Journey runs fully on **Cloudflare Pages' free tier**: the site, the
live-classroom token server, the family's cloud storage, and the Make.com
endpoints. Free tier allows commercial use, so this is a home the business
can grow in.

Everything is already in the repo — you only need to click through this once.

---

## What lives where

| Piece | Cloudflare |
|---|---|
| The app (55 pages) | Pages static site, built from `out/` |
| `/api/livekit-token` | Pages Function → `functions/api/livekit-token.ts` |
| `/api/family-data` | Pages Function → `functions/api/family-data.ts` |
| `/api/events` (Make.com) | Pages Function → `functions/api/events.ts` |
| Family cloud storage | **KV namespace** bound as `WONDER_JOURNEY` |

> The Netlify functions in `netlify/functions/` are left in place, so the
> project can still deploy to Netlify. The two never conflict.

---

## 1. Create the KV namespace (the family's cloud)

1. Cloudflare dashboard → **Storage & databases** → **KV**
2. **Create namespace** → name it `wonder-journey`
3. Done — you'll bind it in step 3.

## 2. Create the Pages project

1. **Compute** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Authorize GitHub, pick **`sharonrosealgara-ui/wonder-journey-os`**
3. Build settings:

| Setting | Value |
|---|---|
| Framework preset | **None** |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | *(leave blank)* |

4. **Save and Deploy** (the first build may fail until step 3 adds the variables — that's expected).

## 3. Add the variables and the KV binding

Project → **Settings**, and set these for **Production _and_ Preview**:

### Environment variables
| Name | Value | Notes |
|---|---|---|
| `LIVEKIT_URL` | `wss://wonder-journey-l114jmdv.livekit.cloud` | your LiveKit URL |
| `LIVEKIT_API_KEY` | `API8Tepxned7uJo` | your LiveKit key |
| `LIVEKIT_API_SECRET` | *(paste from LiveKit)* | **Secret** — paste it here only, never in code or chat |
| `CLASSROOM_CODE` | `12345` | the one code for Teacher + Family |
| `MAKE_WEBHOOK_URL` | *(optional)* | Make.com Custom webhook URL |
| `MAKE_API_KEY` | *(optional)* | any long random string, lets Make read data |

Mark `LIVEKIT_API_SECRET` (and `MAKE_API_KEY`) as **Secret / Encrypted**.

### KV binding
Settings → **Bindings** (or *Functions → KV namespace bindings*):

| Variable name | KV namespace |
|---|---|
| `WONDER_JOURNEY` | `wonder-journey` |

> ⚠️ The variable name must be exactly `WONDER_JOURNEY` — the functions read
> `env.WONDER_JOURNEY`.

## 4. Redeploy

**Deployments** → **Retry deployment** (or push any commit). Builds take ~2 min.

---

## 5. Check it worked

Replace `YOUR-SITE` with your Pages URL (e.g. `wonder-journey-os.pages.dev`):

```bash
# should return 401 {"error":"wrong_code"}  ← proves the token server + secrets work
curl -X POST https://YOUR-SITE/api/livekit-token \
  -H "Content-Type: application/json" \
  -d '{"name":"probe","room":"probe","role":"family","code":"wrong"}'

# should return 401 {"error":"wrong or missing family code"}  ← proves KV + auth work
curl https://YOUR-SITE/api/family-data -H "x-family-code: wrong"
```

A **401** on both is success — it means the server is running, the secrets are
loaded, and it is correctly refusing a bad code. A `503 not_configured` means a
variable is missing; a `503 storage_not_configured` means the KV binding is missing.

Then open the site: the **class code door** should appear. Enter `12345` → you're in.

---

## Notes

- **Node version** is pinned to 20 by `.node-version` (Next 15 needs ≥18.18).
- **No `nodejs_compat` flag needed.** The functions use only Web APIs
  (`crypto.subtle`, `fetch`, `Response`, `URL`) — the LiveKit token is signed
  with Web Crypto rather than the Node SDK, verified against LiveKit's own
  token verifier.
- **Free tier limits** (plenty for a family, and for early clients):
  unlimited bandwidth · 500 builds/month · 100k function requests/day ·
  KV 100k reads + 1k writes/day.
- **Custom domain** later: Pages → your project → **Custom domains**.
- **Moving the family over:** send the magic link
  `https://YOUR-SITE/?code=12345` — they tap once and are set up forever.
  Guests/prospective clients: `https://YOUR-SITE/?guest=1`.
