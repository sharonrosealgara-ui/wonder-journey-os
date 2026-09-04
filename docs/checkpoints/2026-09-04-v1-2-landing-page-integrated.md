# Checkpoint: V1.2 Public Landing Page & Inquiry Fast-Forward Integration

- **Date:** 2026-09-04
- **Branch:** `main` (Integrated from `feat/v1-2-public-landing-page`)
- **Status:** IMPLEMENTED, VERIFIED, & INTEGRATED (Strict fast-forward merge into main; PR #1 merged by containment; not deployed)
- **Previous main SHA:** `ad6d378b5ac5d0cf66913c40e38a684dd180601a`
- **Integrated Commit SHA:** `46491a144e69e27b2c623967727b523516fe6ec2`
- **Direct Parent SHA:** `ad6d378b5ac5d0cf66913c40e38a684dd180601a`
- **Tree SHA:** `3e66af2d1db49edeed15e3e78b8a79e7aed3599c`
- **Commit Message:** `feat: add v1.2 public landing page and gated inquiry flow`

---

## Checkpoint Scope & Integration Summary

This checkpoint records the successful strict fast-forward integration of the Wonder Journey V1.2 public landing page and gated inquiry flow into `main` following 100% passage of the remote 30-gate release qualification suite.

### Authoritative Remote Integration & Containment
- **Pull Request:** PR #1 (feat: add V1.2 public landing page and gated inquiry flow)
  - Base: `main`
  - Head: `feat/v1-2-public-landing-page`
  - State: `MERGED`
  - Merged Timestamp: `2026-09-04T13:35:46Z`
  - Merge Commit OID: `46491a144e69e27b2c623967727b523516fe6ec2` (Merged via direct commit containment)
- **Integration Command:** `git merge --ff-only 46491a144e69e27b2c623967727b523516fe6ec2`
- **Integration Topology:**
  - Exactly 1 outbound feature commit carried
  - 0 merge commits created
  - 0 synthetic integration commits created
  - Reflog records: `merge 46491a144e69e27b2c623967727b523516fe6ec2: Fast-forward`
- **Remote Push:** `git push origin main`
  - Update: `ad6d378..46491a1 main -> main`
  - Standard push; no force push (`--force` or `--force-with-lease` not used)
  - Remote reference verified: `git ls-remote origin refs/heads/main` = `46491a144e69e27b2c623967727b523516fe6ec2`

### Exact 22-File Feature Manifest Carried into main

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

## Remote CI & 30 Release Candidate Gates

All 30 release qualification gates executed cleanly on GitHub Actions against exact commit SHA `46491a144e69e27b2c623967727b523516fe6ec2`:

- **CI Workflow Run ID:** `33864402534`
- **CI Job ID:** `100995839894` (Stage 12.1R.10 Quality & 30 Release Gates)
- **Status:** `completed`
- **Conclusion:** `success`
- **Gate Results:** 30 passed, 0 failed.
- **Gate 26 Playwright E2E Suite:**
  - Suite: Real Browser Two-Context Classroom E2E Suite
  - 26 passed
  - 0 failed
  - 0 flaky
  - 0 skipped

---

## Subsystem Verification & Security Audits

1. **Database Migrations 0001 through 0007:**
   - Sequentially applied repository migrations 0001 through 0007.
   - Migration 0007 (`supabase/migrations/0007_harden_inquiries_schema_and_rls.sql`) successfully integrated into `main`.
   - RPC function `public.submit_inquiry` confirmed with `SECURITY DEFINER` returning `jsonb`.
   - Raw `INSERT` into `public.inquiries` is completely rejected for `anon`, `authenticated`, and `PUBLIC` roles.
   - Configuration defaults fail closed (`enabled = false`, `approved_privacy_notice_version = NULL`).
2. **Public Inquiry Gating & Security:**
   - Public inquiry submission remains CLOSED.
   - Public student enrollment remains CLOSED.
   - Dual-gate mechanism fails closed when disabled.
   - Strict server-side validation rejects notice version mismatches, missing contact consent, missing privacy acknowledgment, invalid emails, and oversized parameters.
3. **API & LiveKit Security Suite:**
   - Auth redirect allowlist sanitization prevents open redirects.
   - LiveKit token server-side grant derivation strictly rejects client-supplied room and role overrides.
   - Legacy Cloudflare and Netlify files verified absent.
4. **Code Quality, Curriculum, & Build:**
   - Curriculum validation: All 65 lessons passed against curriculum schemas.
   - Typecheck: `npm run typecheck` passed (0 errors).
   - Linter: `npm run lint` passed (0 errors).
   - Typography: `node scripts/check-mojibake.js` passed (0 hits, 0 em dashes).
   - Build: `npm run build` compiled successfully (178 static and dynamic routes generated).

---

## Active Dirty Worktree Preservation

The primary development worktree (`C:/Projects/wonder-journey-os-clean`) remains preserved on `feat/v1-2-public-landing-page` at commit `46491a144e69e27b2c623967727b523516fe6ec2` with its 12 modified files and local scratch tooling intact:

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

These files represent ongoing curriculum and media fidelity work. They are not integrated into `main` and must not be reset, stashed, cleaned, or deleted.

---

## Operational Boundaries & Protections

- No deployment to staging or production occurred. The landing page is not publicly deployed.
- Hostinger hosting accounts remain disconnected.
- Hosted Supabase remote database and external configurations remain untouched.
- Drive D: was not accessed or modified.
- Ephemeral integration worktree (`C:/Projects/wj-v1-2-integration`) was cleanly removed after verification.
- Documentation branch (`docs/wonder-journey-master-handoff`) remains separate and is not integrated into `main` in this milestone.

---

## Next Action

Integrate the Wonder Journey Master Handoff documentation onto `main` through a docs-only exact-SHA verification gate.
