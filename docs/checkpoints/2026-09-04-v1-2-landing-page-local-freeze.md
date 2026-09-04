# Checkpoint: V1.2 Public Landing Page Local Freeze

- **Date:** 2026-09-04
- **Branch:** `feat/v1-2-public-landing-page`
- **Status:** IMPLEMENTED & VERIFIED LOCALLY (Frozen locally; pending remote gate; not integrated into main).
- **Frozen Commit SHA:** `46491a144e69e27b2c623967727b523516fe6ec2`
- **Parent Commit SHA:** `ad6d378b5ac5d0cf66913c40e38a684dd180601a`
- **Tree SHA:** `3e66af2d1db49edeed15e3e78b8a79e7aed3599c`
- **Commit Message:** `feat: add v1.2 public landing page and gated inquiry flow`

---

## Checkpoint Scope & Snapshot Summary

This checkpoint records the successful local implementation, hunk-level scope isolation, and multi-layered verification of the Wonder Journey V1.2 public landing page and gated inquiry subsystem.

### Exact 22-File Manifest

The frozen commit contains precisely the following 22 files:

```text
.env.example
public/media/product-tour/tour-family-space.png
public/media/product-tour/tour-lesson-adventure.png
public/media/product-tour/tour-live-classroom.png
public/media/product-tour/tour-progress-reflection.png
public/media/product-tour/tour-teacher-studio.png
scripts/test-api-security.js
scripts/test-inquiry-security.js
src/app/(marketing)/actions.ts
src/app/(marketing)/inquiry-form.tsx
src/app/(marketing)/layout.tsx
src/app/(marketing)/learning-focus-tabs.tsx
src/app/(marketing)/mobile-nav.tsx
src/app/(marketing)/page.tsx
src/app/(marketing)/product-tour.tsx
src/app/globals.css
src/components/adventure/historical-map-viewer.tsx
src/components/adventure/slide-views.tsx
src/components/ui/dimensional-icons.tsx
src/config/brand.ts
src/lib/inquiry-config.ts
supabase/migrations/0007_harden_inquiries_schema_and_rls.sql
```

---

## Clean Ephemeral Worktree Verification Results

All verification was conducted inside an isolated, clean worktree checkout (`C:/Projects/temp-v1-2-clean-verify`) detached at commit `46491a144e69e27b2c623967727b523516fe6ec2`.

### 1. Fresh Local Database & Security Contract Verification
- Database: Fresh PostgreSQL database (`wj_test_fresh`) initialized in local Docker Supabase instance.
- Migrations: Sequentially applied repository migrations `0001` through `0007`. Migration `0007` applied cleanly with zero errors.
- RPC Contract: Confirmed `public.submit_inquiry` function exists with `SECURITY DEFINER` and `jsonb` return type.
- Table Hardening: Proved direct raw `INSERT` on `public.inquiries` is completely rejected for `anon`, `authenticated`, and `PUBLIC` database roles.
- Default Configuration: Proved `private.inquiry_configuration` defaults to `enabled = false` and `approved_privacy_notice_version = NULL`.
- Gating Behavior: Proved authorized RPC calls fail closed while the gate is disabled.
- Parameter Boundaries: Intentionally enabled the gate in the test database and proved:
  - Valid submission succeeds and records audit timestamps.
  - Notice version mismatch is strictly rejected.
  - Missing contact consent is rejected.
  - Missing privacy acknowledgment is rejected.
  - Malformed email format is rejected.
  - Oversized parameters (>100 char name) are rejected.
- Teardown: Cleanly dropped `wj_test_fresh` database following test completion.

### 2. Code Quality & Security Test Gates
- Typecheck: `npm run typecheck` passed cleanly (0 errors).
- Linter: `npm run lint` passed with 0 errors (9 pre-existing unused directive warnings).
- Curriculum Test Suite: `npm test` validated all 65 lessons across Stages 2, 4, 5, 6, and 7 against curriculum schemas.
- Mojibake & Typography Scan: `node scripts/check-mojibake.js` scanned 195 files with 0 hits and 0 em-dash regressions.
- Security Test Suite: `node scripts/test-api-security.js` executed successfully, passing:
  - Auth callback open-redirect sanitize protection.
  - LiveKit token server-side grant derivation (client-supplied room/role strictly rejected).
  - Cloudflare and Netlify legacy file absence checks.
  - Inquiry pipeline database boundary security suite (0 PII leaked).
- Production Build: `npm run build` compiled cleanly in 27.5s, generating 178 static and dynamic routes.

### 3. Headless Browser Behavior Proofs (Playwright on Port 3001)
- Landing Page Load: Verified HTTP 200 response with title *"Wonder Journey : Discover the Philippines"*.
- Mobile Navigation & Focus Trap: Tested at 390px viewport width. Verified full cyclic keyboard navigation (Shift+Tab wraps to bottom, Tab wraps to top) and Escape key closes drawer while restoring focus to trigger button.
- Product Tour Tabs: Verified all 5 segmented tabs render and switch dynamically without layout shifts.
- Asset Integrity: All 5 product tour PNG assets resolve properly. Confirmed authentic Live Classroom capture has SHA-256 hash `76853a6f45a2db8dd914425a10581f0a0976aaa8c5cec31fad98c421f0e66c22`.
- Learning Focus Tabs: Verified all four tabs switch cleanly and display approved educational takeaways.
- Public Copy Truthfulness: Verified zero instances of visitor-facing technical or debug phrases ("live local application", "Actual Product View", "synthetic test data").
- Closed Inquiry UI: Verified `#inquiry` section displays closed advisory and redirects existing families to login.
- Historical Map Viewer: Verified component compilation, "Fit" initial zoom indicator, and Pedro Murillo Velarde Spanish colonial-era perspective disclosure.

---

## Original Dirty Worktree Preservation

The primary development worktree (`C:/Projects/wonder-journey-os-clean`) remains preserved with its 12 modified files and local test tooling intact:

```text
modified:   artifacts/contact-sheet-130-media.html
modified:   artifacts/curriculum-media-fidelity-manifest.json
modified:   artifacts/media-contact-sheet.html
modified:   artifacts/media-contact-sheet.json
modified:   artifacts/media-visual-review.json
modified:   public/media/curriculum/l01-visual-b.jpg
modified:   scripts/build-complete-authentic-registry.js
modified:   scripts/canonical-media-specs.js
modified:   scripts/verified-commons-image-map.js
modified:   src/app/(auth)/layout.tsx
modified:   src/app/(auth)/login/page.tsx
modified:   src/config/media-registry.ts

Untracked:
artifacts/landing-page-final-review/
scratch/
```

Zero working-tree files were stashed, cleaned, reset, or deleted.

---

## Remote Safety & Operational Boundaries

During this checkpoint:
- No commits were pushed to remote repositories.
- No pull requests were opened.
- No branch merges were executed.
- No production or preview deployments were triggered.
- No Hostinger accounts or services were connected.
- No hosted Supabase databases or external configurations were touched.
- Drive D: was completely unaccessed.

---

## Next Action

Proceed to the **Remote Gate** for `feat/v1-2-public-landing-page` at frozen SHA `46491a144e69e27b2c623967727b523516fe6ec2`.
