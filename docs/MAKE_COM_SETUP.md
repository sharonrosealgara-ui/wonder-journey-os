# 🔗 Make.com Setup — Wonder Journey OS

Wonder Journey now has a real backend (Netlify Functions + Netlify Blobs)
and speaks Make.com natively, in **both directions**:

1. **Push (instant triggers):** the app POSTs typed events to
   `/api/events`, which forwards each one to your Make.com webhook.
2. **Pull (scheduled scenarios):** Make.com can read the family's data
   and recent events with a simple HTTP GET.

Nothing here touches prayer tracking — prayer is never scored, counted,
or automated. Events describe activity ("a blessing was saved"), never
spiritual content.

---

## 1. Environment variables (Netlify → Site configuration → Environment variables)

| Variable | Required | What it is |
|---|---|---|
| `CLASSROOM_CODE` | already set | The family's class code — also guards all app→backend calls |
| `MAKE_WEBHOOK_URL` | optional | Your Make.com **Custom webhook** URL (push mode) |
| `MAKE_API_KEY` | optional | Any long random string — Make uses it to read data (pull mode) |

After adding or changing variables: **Deploys → Trigger deploy** so the
functions pick them up.

---

## 2. Push mode — instant Make.com triggers

1. In Make.com create a new scenario → first module **Webhooks → Custom webhook** → copy the URL.
2. Paste it into Netlify as `MAKE_WEBHOOK_URL` and redeploy.
3. Every event now arrives at Make within seconds.

**Event shape (JSON):**

```json
{
  "type": "class.joined",
  "family": "ferrell",
  "who": "Teacher Sharon",
  "room": "wj-lesson-3-2026-07-15",
  "at": "2026-07-15T14:00:00.000Z",
  "receivedAt": "2026-07-15T14:00:01.200Z"
}
```

**Event types currently emitted:**

| type | when |
|---|---|
| `class.joined` | someone joins the live classroom |
| `class.ended` | the call is ended |
| `lesson.finished` | Teacher taps 🏁 Finish Lesson (includes `lessonId`, `title`) |
| `data.updated` | family records synced to the cloud (includes `keys`, e.g. `["gratitude"]` — a saved Morning Blessing shows up here) |

Example scenarios: "When `lesson.finished` → send Shaun & Taylor a
congratulations email", "When `data.updated` contains `gratitude` →
append a row to a Google Sheet family journal".

---

## 3. Pull mode — Make.com reads family data

Set `MAKE_API_KEY` in Netlify, then in Make use **HTTP → Make a request**:

```
GET https://wonderjourneyos.netlify.app/api/events?key=YOUR_MAKE_API_KEY&limit=50
```

Response:

```json
{
  "family": "ferrell",
  "events": [ ...most recent first... ],
  "data": { "gratitude": [...], "journal": [...], "completions": [...], "_updatedAt": "..." }
}
```

`data` is the same cloud record the app syncs — blessings, journals,
lesson completions, awards — so Make can build weekly digests, progress
reports, or backups on a schedule.

---

## 4. How the backend sync works (for reference)

- The app keeps localStorage as its fast local cache (offline-first).
- On camera auto-start / classroom join it pulls the cloud copy and
  merges it (`/api/family-data`, union by record id — nothing is lost).
- Any change to synced records is pushed back ~4 s later, and a
  `data.updated` event fires for Make.
- Auth for every app call is the class code (`x-family-code` header);
  Make's read access uses `MAKE_API_KEY`. The LiveKit API secret stays
  server-side as before.
- Storage: Netlify Blobs, store `wonder-journey`, keys `family-ferrell`
  and `events-ferrell` (multi-family ready via the `x-family` header).
