# 🔌 Wonder Journey OS — API & Integration Plan

**This document defines all current and future API integrations.** The platform is
designed API-first: even integrations not implemented in the MVP have an anticipated seam,
so adding them later never requires touching pages or components.

**Status legend:** ✅ shipping today · ⬜ planned (with target roadmap phase)

---

# Purpose

Integrations exist to support: **AI lesson generation · parent communication · teacher
productivity · resource management · cloud storage · calendar integration · future mobile
apps · white-label deployments.**

**Every integration is modular and optional.** A white-label client with no email provider
still gets copy-ready emails; a family with no calendar still sees the in-app schedule.
Nothing core depends on a third party being configured.

---

# API Philosophy

**Never tightly couple the application to one provider.** Every capability gets a service
wrapper; providers are implementations behind it.

The pattern, already proven in the MVP:

```
Capability          Wrapper (the seam)         Implementations
─────────────────────────────────────────────────────────────────────
Email               EmailService               ✅ copy-ready text (buildEmail)
                                               ⬜ Resend | Gmail | SendGrid | EmailJS
Persistence         lib/storage.ts             ✅ localStorage
                                               ⬜ Supabase (DATABASE.md)
Fonts               <link> + CSS fallbacks     ✅ Google Fonts at runtime, degrades offline
```

Rules:
1. UI components call services; services call providers. **Never call a third-party API
   directly from a UI component.**
2. Every service has a "no provider configured" mode that still works (copy button, link
   out, local save).
3. Provider choice is configuration, not code (per-deployment env vars — white-label
   clients pick their own providers).

---

# Current MVP ✅

**No API keys required. Zero external service dependencies.**

- Email: copy-ready generation (`buildEmail()` in `/prep-email`) — paste into Gmail
- Videos/maps/Canva: plain links opening in a new tab
- Storage: localStorage behind `lib/storage.ts`
- Photos: client-side canvas shrinking, stored locally
- Fonts: runtime `<link>` with full system fallbacks

This is a feature, not a gap: the MVP cannot break because a third party is down, and
family data never leaves the device (Decision 030).

---

# AI Integrations ⬜ (Phases 4–5)

**Providers (behind `AIService`):** Anthropic Claude API · OpenAI · Google Gemini.
Recommended default: Claude (strong long-form lesson drafting; the project's docs already
define its content contract). Provider swappable per deployment.

**Capabilities:** generate lesson plans · Canva presentation outlines · worksheets ·
quizzes · games (phrase sets for the existing engine) · recipes · shopping lists · journal
prompts · family challenges · parent summaries · teacher notes · certificates · travel
itineraries · badge suggestions.

**Rules (binding, from CONTENT_GUIDELINES.md + AI_BEHAVIOR.md):**
- **AI output must always remain editable** — generations land in typed config models
  (`Lesson`, `Recipe`, …), never locked in code.
- The teacher reviews everything before children see it.
- Output must validate against the target TypeScript interface — a generation that doesn't
  type-check is rejected, not patched.
- Keys server-side only (see Security).

---

# Email Integration

**Current ✅:** copy-ready emails (Class Prep verified in production use).

**Future providers ⬜ (Phase 4):** Resend (recommended first — simplest DX) · Gmail API ·
SendGrid · EmailJS. All behind `EmailService.send(EmailPayload)` where `EmailPayload` is
exactly what `buildEmail()` already produces.

**Email types:** class preparation ✅ (copy) · weekly lesson summary ⬜ · birthday
greetings ⬜ · achievement notifications ⬜ · family reminders ⬜ · shopping lists ⬜ ·
recipe reminders ⬜ · new lesson available ⬜.

Scheduling: Vercel cron triggers (e.g., prep email 48h before class; birthday greeting at
7 AM family-timezone).

---

# Calendar Integration ⬜ (Phase 6)

**Providers (behind `CalendarService`):** Google Calendar · Microsoft Outlook ·
Apple Calendar via ICS. **Start with ICS export** — one generated file covers all three
providers with zero OAuth.

**Feeds:** class schedule (from lesson dates) · lesson reminders · cooking sessions ·
birthdays · family celebrations · teacher planning blocks.

---

# Video Integration

**Current ✅:** curated links (YouTube search links) opening in new tabs.

**Future ⬜ (Phase 2+):** YouTube embeds (first — `videoLinks` already stores URLs) ·
Google Drive · Vimeo · self-hosted. **Features:** embedded players · watch progress ·
favorites · playlists · lesson-linked videos. Child-safe rule: embedded players use
privacy-enhanced mode (youtube-nocookie), no autoplay, teacher-curated only.

---

# Google Earth / Maps ⬜ (Phase 2)

**Providers (behind `MapsService`):** Google Maps · Google Earth web links · interactive
map embeds. **Used for:** travel lessons · destination pages · virtual exploration
("fly to Bago City"). First step is zero-API: Google Earth web URLs as a `mapUrl` field on
`Destination` (DATABASE.md already reserves it).

---

# Canva Integration

**Current ✅:** Canva presentation links stored per lesson (`canvaLink`), opened from the
lesson page and Teacher Dashboard, included in prep emails.

**Future ⬜ (Phase 4):** Canva Connect API — generate presentations from lesson outlines ·
duplicate a world's template deck per lesson · open directly from lessons with edit rights.

---

# Cloud Storage ⬜ (Phase 3+, with DATABASE.md migration)

**Providers (behind `StorageService`):** Supabase Storage (recommended — pairs with the
database plan) · Google Drive · Cloudinary (image transforms).

**Stores:** lesson files · student uploads · recipe photos · project photos · family
gallery · certificates. Privacy rule: per-family buckets, signed URLs, photos of children
never public (DATABASE.md Security).

---

# Authentication ⬜ (Phase 8)

Supabase Auth (recommended) · Google Login · magic links (best fit for parents — no
passwords). **Account types:** family invitations · teacher accounts · admin accounts.
No child accounts — children act under the family session (DATABASE.md). Until then, the
mode toggle is deliberately auth-free (single trusted household per install).

---

# Notifications ⬜ (Phases 6–7)

Behind `NotificationService`: email (first) · in-app notification center · push (mobile
apps, far future) · reminder banners (soonest — in-app "class tomorrow!" banner needs no
provider at all).

---

# Resource Library API ⬜ (Phase 4 — Resource Finder)

Candidate integrations, **reputable educational sources only:** National Geographic Kids ·
Google Arts & Culture · Smithsonian Open Access (has a real public API) · NASA (public
API) · NOAA · Library of Congress (where appropriate).

Behind `ResourceService`; results land as `Resource` rows for teacher curation — never
auto-shown to children (same editor-in-chief rule as AI content).

---

# Weather API ⬜ (optional, low priority)

For travel lessons ("it's 88°F in Iloilo right now!"), nature lessons, seasonal
discussions. Open-Meteo (no key) is sufficient. Only if it adds wonder — skip otherwise.

---

# Translation API ⬜ (Phase 8, white-label worlds)

Current languages — **English · Tagalog · Hiligaynon** — are human-written by the teacher
and must stay that way (machine translation of Hiligaynon is notoriously weak; Sharon *is*
the translation layer). Translation APIs matter later for new worlds: Japanese · Spanish ·
Korean — always with native-speaker review before children see it.

---

# Speech & Pronunciation ⬜ (Phase 2 for playback, later for the rest)

- **Text-to-Speech / audio playback:** first priority — `audioUrl` placeholder already
  reserved on `Phrase` (CONTENT_GUIDELINES.md). Best v1: Sharon records her own voice —
  authentic Hiligaynon beats any TTS.
- **Speech recognition & pronunciation scoring:** far future, and only celebration-framed
  ("Great try! Say it with me") — never a grading gate (no stressful UI, per
  DESIGN_SYSTEM.md §22).

---

# File Export ⬜ (Phase 3)

PDF (first: certificates, printable cookbook, family scrapbook) · DOCX · printable
worksheets. Likely client-side (`jspdf` already proven in Sharon's other project) or a
server render route. The printable Family Cookbook is the flagship export — the
end-of-term keepsake (ROADMAP Phase 3 milestone).

---

# Analytics ⬜ (Phase 9)

**Privacy-first, teacher-facing only:** student progress · lesson completion · family
participation · cooking completion · language progress · dashboard summaries. Aggregates
for the teacher and parents — **never surveillance of children, never third-party ad/track
scripts.** MVP already derives all of this locally from stored records; SaaS analytics is
the same math server-side.

---

# Payment ⬜ (Phase 9, Commercial SaaS)

Stripe (recommended) · PayPal. Subscriptions · invoices · family plans · teacher plans.
Behind `BillingService`; entitlements checked server-side. Children never see billing UI.

---

# API Security

All API keys must:

- **remain server-side** — called from Next.js server actions/route handlers, never from
  client components
- **never be hardcoded** — no keys in the repo, ever
- **use environment variables** — `.env.local` locally (already gitignored), Vercel
  project env vars in production; one var per provider (`RESEND_API_KEY`, `ANTHROPIC_API_KEY`, …)
- **rotate when necessary** — and immediately if ever exposed

Client-exposed values (Supabase anon key) are safe *only* because Row Level Security is
the real boundary — RLS lands before any client key does.

---

# Service Layer Architecture

Target structure (created as each capability lands — not before, per "MVP first"):

```
src/services/
  ai-service.ts            AIService          — generate*, always returns typed config objects
  email-service.ts         EmailService       — buildEmail ✅ (extract here first), send ⬜
  calendar-service.ts      CalendarService    — toICS ⬜, sync ⬜
  resource-service.ts      ResourceService    — search ⬜, curate ⬜
  storage-service.ts       StorageService     — lib/storage.ts today ✅, cloud later
  notification-service.ts  NotificationService— banner ⬜, email ⬜, push ⬜
  maps-service.ts          MapsService        — destinationMapUrl ⬜
  billing-service.ts       BillingService     — Phase 9
```

Each service: one TypeScript interface, provider implementations behind it, a
no-provider fallback mode, and zero imports from UI components upward.

---

# Make.com / Automation Webhooks ⬜ (Phase 8, with the backend)

Wonder Journey's own API (below) is designed webhook-first so **Make.com** (or n8n/Zapier)
can automate workflows without custom code: class reminder emails · birthday reminders ·
parent summaries · certificates · weekly reports · Google Calendar events · Google Drive
backups · photo upload processing · AI lesson workflows.

Design rules: every meaningful event (class completed, badge earned, birthday upcoming,
memory captured) emits a webhook with a typed JSON payload keyed by `family_id`; inbound
automation uses the same authenticated `/api/v1` endpoints as the future mobile apps;
secrets per scenario, rotatable. Until the backend exists, the copy-ready outputs
(Parent Summary, Prep Email) are the manual equivalents of these automations — same
payloads, human transport.

# API Versioning

When the platform exposes its own API (Phase 8–9, for mobile apps and white-label
clients): versioned routes (`/api/v1/…`), additive changes within a version, deprecation
windows before removal, and backward compatibility whenever practical. Internal service
interfaces follow the same discipline once multiple deployments exist.

---

# Final API Principle

> **Every integration should improve the family learning experience while keeping the
> platform modular, secure, and easy to maintain.**

An integration that adds a login screen, a loading spinner, and a monthly bill — but no
wonder — is a bad trade. The copy button that works every time beats the automation that
works most of the time.

---

*Wonder Journey OS — API & Integration Plan v1.0 · July 2026*
