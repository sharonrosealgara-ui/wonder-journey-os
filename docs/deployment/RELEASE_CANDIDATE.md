# Wonder Journey OS — Release Candidate (RC) Verification & Delivery Package

**Version**: `0.1.0-rc.1`  
**Stage**: `Stage 12 — Release Hardening, Local Production Verification, and Integration Delivery Gate`  
**Target Branch**: `integration/curriculum-jul-dec-2026`  
**Curriculum Scope**: Full 65-Lesson Multi-Disciplinary Curriculum (August–December 2026)  
**Hostinger Status**: Production-Ready Release Candidate (Ready for Hostinger purchase and external staging)

---

## 1. Executive Summary & Verification State

Wonder Journey OS has achieved **Release Candidate (RC)** status. All 65 scheduled curriculum lessons, application views, authentication flows, role-based access controls, security headers, database RLS policies, and LiveKit token generation endpoints have undergone comprehensive local production-parity verification with **zero test failures** and **zero client-side answer/credential leaks**.

```text
================================================================================
RELEASE CANDIDATE VERIFICATION GATES (21/21 PASSED)
================================================================================
1. Hostinger Readiness Gate                  [PASSED] (49/49 checks)
2. Encoding & Mojibake Audit                 [PASSED] (0 encoding defects)
3. Secret & Environment Security Audit       [PASSED] (0 committed secrets)
4. Database & RLS Static Security Audit      [PASSED] (11 tables / 36 policies)
5. API & LiveKit Security Regression         [PASSED] (Role & grant boundaries)
6. Route Access & RBAC Matrix                [PASSED] (90 matrix conditions)
7. Broken Links & Public Asset Audit         [PASSED] (PWA & nav routes verified)
8. Accessibility & Responsive QA             [PASSED] (Landmarks, viewports, focus)
9. August Curriculum Premium Gate (L1-13)    [PASSED] (13/13 lessons)
10. September Curriculum Premium Gate (L14-26)[PASSED] (13/13 lessons)
11. October Curriculum Premium Gate (L27-39) [PASSED] (13/13 lessons)
12. November Curriculum Premium Gate (L40-52)[PASSED] (13/13 lessons)
13. December Curriculum Premium Gate (L53-65)[PASSED] (13/13 lessons)
14. DTO Leak & Projection Sync Gate          [PASSED] (Zero answers in family DTO)
15. 65-Lesson Render Safety (4,908 slides)   [PASSED] (Zero render errors)
16. Assessment Response State Model          [PASSED] (10/10 state transitions)
17. Curriculum Schema & Uniqueness Tests     [PASSED] (All 65 lessons unique)
18. TypeScript Full Typecheck                [PASSED] (0 compile errors)
19. Production Next.js Build                 [PASSED] (175/175 static pages)
20. Local Production Server Smoke Tests      [PASSED] (14/14 HTTP/Route assertions)
21. Client-Bundle Answer & Key Leak Gate     [PASSED] (0 answers in 64 JS chunks)
================================================================================
```

---

## 2. Release Inventory

| Component | Scope / Description | Verification Status |
| :--- | :--- | :--- |
| **Curriculum** | 65 full lessons (August Geography, September Language/Daily Life, October History/Science, November Culinary, December Faith/Showcase) | **100% Verified** (All 5 monthly validators passed) |
| **Assessment Engine** | 6 interactive assessment types with multi-step validation and scoring isolation | **100% Verified** (`test-assessment-response-model.js`) |
| **Authentication** | Supabase SSR session refresh, email magic link code exchange, password reset | **100% Verified** (`src/middleware.ts`, `src/app/auth/callback/route.ts`) |
| **Authorization (RBAC)** | Strict fail-closed boundary: Family blocked from `/teacher` and `/prep-email` | **100% Verified** (`test-route-access-matrix.js`) |
| **Database & Storage** | 4 SQL migrations, 11 RLS tables, workspace-isolated `family-media` storage bucket | **100% Verified** (`test-database-rls-static.js`) |
| **LiveKit API** | Authenticated token minting with role verification and `roomAdmin` isolation | **100% Verified** (`test-api-security.js`) |
| **Security Headers** | CSP, HSTS, X-Frame-Options (SAMEORIGIN), nosniff, Referrer-Policy, Permissions-Policy | **100% Verified** (`next.config.ts`, `test-production-server.js`) |
| **Static Generation** | 175 prerendered pages (65 adventure routes, 65 lesson views, 12 cooking recipes, 33 app pages) | **100% Verified** (`npm run build`) |

---

## 3. Local Production-Parity Verification Instructions

To reproduce the full release candidate verification on any clean development environment:

```bash
# 1. Install dependencies deterministically
npm ci

# 2. Run the master Release Candidate orchestrator
npm run validate:release

# Or execute individual test suites:
node scripts/validate-hostinger-readiness.js
node scripts/check-mojibake.js
node scripts/test-secret-env-audit.js
node scripts/test-database-rls-static.js
node scripts/test-api-security.js
node scripts/test-route-access-matrix.js
node scripts/test-broken-links-assets.js
node scripts/test-accessibility-responsive.js
node scripts/validate-premium-august.js
node scripts/validate-premium-september.js
node scripts/validate-premium-october.js
node scripts/validate-premium-november.js
node scripts/validate-premium-december.js
node scripts/test-dto-leak.js
node scripts/test-family-projection-sync.js
node scripts/test-lesson-render-safety.js
node scripts/test-assessment-response-model.js
npx tsx src/__tests__/curriculum.test.ts
npx tsc --noEmit
npm run build
node scripts/test-production-server.js
node scripts/test-client-bundle-leak.js
```

---

## 4. Hostinger Staging Onboarding Procedure (When Ready to Purchase)

When Hostinger hosting is purchased by the project owner:

1. **Create Web App in Hostinger hPanel**:
   - Framework: **Next.js**
   - Node.js Version: **22.x** (or compatible Active LTS)
   - Repository: `https://github.com/sharonrosealgara-ui/wonder-journey-os.git`
   - Branch: `integration/curriculum-jul-dec-2026`
   - Build Command: `npm run build`
   - Start Command: `npm run start`
2. **Configure Environment Variables in hPanel**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase `anon` Public Key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase `service_role` Secret Key
   - `NEXT_PUBLIC_SITE_URL`: `https://staging.YOUR-DOMAIN.com`
   - `NEXT_PUBLIC_IS_STAGING`: `true` (Disallows search engine indexing)
   - `LIVEKIT_URL`: LiveKit Cloud WebSocket URL
   - `LIVEKIT_API_KEY`: LiveKit API Key
   - `LIVEKIT_API_SECRET`: LiveKit API Secret
   - `GAME_EVALUATION_SECRET`: Cryptographic secret for server-evaluated games
   - `NODE_ENV`: `production`
3. **Configure Supabase Auth Allowlist**:
   - Add `https://staging.YOUR-DOMAIN.com/auth/callback` and `https://staging.YOUR-DOMAIN.com/reset-password` to Supabase Redirect URLs.
4. **Trigger Deployment**:
   - Click **Deploy** in hPanel.
   - Confirm all 175 pages prerender cleanly.
   - Run post-deployment smoke test checklist.

---

## 5. Rollback Plan

If unexpected regressions occur during future external staging:
1. **Hostinger hPanel Instant Rollback**:
   - Go to **Web Apps -> Deployment History**.
   - Select the last healthy deployment SHA and click **Rollback**.
2. **Git Branch Reversion**:
   ```bash
   git checkout integration/curriculum-jul-dec-2026
   git revert <bad-commit-sha>
   git push origin integration/curriculum-jul-dec-2026
   ```

---

## 6. Integration-to-Main Delivery Procedure (Final Cutover)

Once external staging is completed and approved:
1. Ensure working tree is clean and all tests pass.
2. Fast-forward merge `integration/curriculum-jul-dec-2026` into `main`.
3. Tag the release: `git tag -a v1.0.0 -m "Wonder Journey OS v1.0.0 (Full 65-Lesson Curriculum & Platform)"`.
4. Push `main` and tags to origin:
   ```bash
   git push origin main --tags
   ```
5. In Hostinger hPanel, switch Web App target branch to `main` and update `NEXT_PUBLIC_IS_STAGING=false`.
