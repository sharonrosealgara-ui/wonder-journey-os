# Hostinger Managed Next.js Deployment Runbook & Staging Gate
**Project**: Wonder Journey OS  
**Repository**: `wonder-journey-os`  
**Target Platform**: Hostinger Managed Web App Hosting (Node.js / Next.js)  
**Staging Branch**: `integration/curriculum-jul-dec-2026`  
**Document Version**: 1.0 (Stage 11D.1 Readiness Gate)

---

## 1. Required Hostinger Plan

Wonder Journey OS runs as a managed Next.js application with dynamic middleware authentication, server-side route handlers (`/api/livekit-token`), dynamic auth callbacks (`/auth/callback`), and 175 statically prerendered routes.

- **Recommended Plan**: Hostinger **Business Web Hosting** or **Cloud Startup / Cloud Professional**.
- **Requirement**: Must support **Node.js Web App** deployments via hPanel (native Git repository import without requiring manual unmanaged VPS command-line maintenance).

---

## 2. hPanel Navigation

To initialize the deployment in the Hostinger control panel:
1. Log in to **Hostinger hPanel** (`https://hpanel.hostinger.com`).
2. Navigate to **Websites** in the left-hand navigation sidebar.
3. Click **Add Website** (or **Create or Migrate a Website**).
4. Select **Deploy Web App** (or **Node.js Application** under Advanced Tools).
5. Choose **Import Git Repository**.

---

## 3. GitHub Repository Selection

1. Authenticate your GitHub account with Hostinger OAuth.
2. Select repository: `sharonrosealgara-ui/wonder-journey-os` (or the authorized team fork).
3. Set Repository Access: **Private** (or Organization repository).

---

## 4. Staging Branch Selection

- **Staging Branch**: `integration/curriculum-jul-dec-2026`
- *Note*: Production releases will eventually deploy from `main` after all curriculum stages (Stage 11A–11F) are verified and merged.

---

## 5. Framework Configuration

- **Framework**: Select **Next.js**.
- **Application Type**: Node.js Web Application (SSR + Static SSG hybrid).

---

## 6. Exact Node.js Version

- **Selected Node.js Version**: **`Node.js 22.x`** (Active LTS).
- **Repository Agreement**:
  - `package.json` -> `"engines": { "node": "22.x" }`
  - `.node-version` -> `22`
  - `.nvmrc` -> `22`

---

## 7. Exact Package Manager

- **Package Manager**: **`npm`** (using the deterministic `package-lock.json` in repository root).

---

## 8. Exact Install Command

```bash
npm install
```
*(Or `npm ci` if running in automated CI environments).*

---

## 9. Exact Build Command

```bash
npm run build
```
*(Executes `next build`, compiling Next.js pages, verifying TypeScript types, and prerendering 175 static routes into `.next`).*

---

## 10. Exact Start Command

```bash
npm run start
```
*(Executes `next start`, binding to Hostinger's assigned dynamic port environment variable `process.env.PORT`).*

---

## 11. Output & Runtime Behavior

- **Deployment Mode**: **Managed Next.js Node.js Server Application**.
- **Evidence for Node.js Server Mode**:
  1. `src/middleware.ts`: Intercepts route requests, performs Supabase session token refresh via `@supabase/ssr`, and enforces role-based access boundaries between `/teacher` and `/family`.
  2. `src/app/api/livekit-token/route.ts`: Secure server-side dynamic API endpoint that mints LiveKit JWT tokens with profile validation.
  3. `src/app/auth/callback/route.ts`: Server-side OAuth and magic link code-for-session exchange with secure HTTP-only cookies.
  4. Hybrid Static Generation: Next.js automatically serves all 175 prerendered static routes with sub-millisecond response times while retaining dynamic server capabilities.

---

## 12. Complete Environment Variable Checklist

Configure the following environment variables in hPanel under **Web Apps → Environment Variables**:

| Variable Name | Classification | Required? | Staging Value Source | Production Value Source | Build/Runtime | Redeploy Needed? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client) | **YES** | Supabase Staging Project URL | Supabase Production Project URL | Build & Runtime | **YES** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Client) | **YES** | Supabase Staging `anon` public key | Supabase Production `anon` public key | Build & Runtime | **YES** |
| `NEXT_PUBLIC_SITE_URL` | Public (Client) | **YES** | `https://staging.YOUR-DOMAIN.com` | `https://YOUR-DOMAIN.com` | Build & Runtime | **YES** |
| `NEXT_PUBLIC_IS_STAGING` | Public (Client) | Optional | `true` | `false` | Build & Runtime | **YES** |
| `WJ_CLASS_CODE` | Server-Only | Optional | Custom Classroom Code | Custom Classroom Code | Runtime | NO |
| `LIVEKIT_URL` | Server-Only | Optional | LiveKit Cloud WebSocket URL | LiveKit Cloud WebSocket URL | Runtime | NO |
| `LIVEKIT_API_KEY` | Server-Only (Secret)| Optional | LiveKit Cloud API Key | LiveKit Cloud API Key | Runtime | NO |
| `LIVEKIT_API_SECRET` | Server-Only (Secret)| Optional | LiveKit Cloud API Secret | LiveKit Cloud API Secret | Runtime | NO |
| `NODE_ENV` | Server-Only | Auto | `production` | `production` | Runtime | NO |

> [!IMPORTANT]
> **Zero Secrets Policy**: Never enter `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_*` fields. All `NEXT_PUBLIC_*` variables are bundled into client-side JavaScript. Service-role keys must never be exposed.

---

## 13. Supabase Redirect & Authentication Configuration

In your **Supabase Dashboard** (`https://supabase.com/dashboard/project/YOUR_PROJECT_ID`):

1. Navigate to **Authentication → URL Configuration**.
2. **Site URL**:
   - Staging: `https://staging.YOUR-DOMAIN.com` (or temporary Hostinger preview domain)
   - Production: `https://YOUR-DOMAIN.com`
3. **Redirect URLs (Allowlist)**:
   - Staging Auth Callback: `https://staging.YOUR-DOMAIN.com/auth/callback`
   - Staging Password Reset: `https://staging.YOUR-DOMAIN.com/reset-password`
   - Staging Root: `https://staging.YOUR-DOMAIN.com/**`
   - Localhost (Development only): `http://localhost:3000/**`
   - Production Callback: `https://YOUR-DOMAIN.com/auth/callback`
   - Production Reset: `https://YOUR-DOMAIN.com/reset-password`
4. **Cookie Security**:
   - Ensure `SameSite=Lax` and `Secure=true` in production environments (handled automatically in `src/app/auth/callback/route.ts` when `NODE_ENV === 'production'`).

---

## 14. Staging Subdomain & Temporary URL Setup

1. In hPanel **Domains / Subdomains**, create a dedicated staging subdomain:
   - Subdomain: `staging`
   - Domain: `YOUR-DOMAIN.com`
   - Target Folder: `/public_html` (or Hostinger web app root)
2. Point the Web App deployment to `staging.YOUR-DOMAIN.com`.

---

## 15. SSL & HTTPS Verification

1. In hPanel, navigate to **Security → SSL**.
2. Ensure **Lifetime Free Let's Encrypt SSL** is active for `staging.YOUR-DOMAIN.com`.
3. Enable **Force HTTPS** toggle in hPanel to redirect all HTTP traffic to HTTPS.

---

## 16. Deployment Log Inspection

1. In hPanel, go to **Web Apps → Deployment History / Logs**.
2. Inspect the build log:
   - Verify `next build` generates 175 static pages successfully.
   - Verify no build-time warnings regarding missing environment variables or type errors.
   - Confirm server starts on Hostinger's assigned port (`Ready in ... ms`).

---

## 17. Safe Redeployment Procedure

When new commits are pushed to `integration/curriculum-jul-dec-2026`:
1. Automatic Deployment: If Webhook / Auto-Deploy is enabled in hPanel, Hostinger pulls the latest commit, runs `npm install`, and executes `npm run build`.
2. Manual Redeploy:
   - Navigate to **hPanel → Web Apps → Manage**.
   - Click **Redeploy** (or **Pull Latest Changes & Rebuild**).
   - Check build logs to confirm zero errors before traffic hits the new version.

---

## 18. Rollback Procedure

If an unexpected runtime regression occurs on staging:
1. In hPanel **Deployment History**, locate the last known healthy deployment commit.
2. Click **Revert / Rollback to this Deployment**.
3. Or via Git:
   ```bash
   git checkout integration/curriculum-jul-dec-2026
   git revert HEAD
   git push origin integration/curriculum-jul-dec-2026
   ```

---

## 19. Production Domain Cutover Procedure (Future Release)

When the entire July–December 2026 curriculum is complete and verified:
1. Merge `integration/curriculum-jul-dec-2026` into `main`.
2. In hPanel, create/switch Web App target branch to `main`.
3. Update `NEXT_PUBLIC_SITE_URL` to `https://YOUR-DOMAIN.com`.
4. Update `NEXT_PUBLIC_IS_STAGING` to `false`.
5. Update Supabase Site URL and Redirect URLs to `https://YOUR-DOMAIN.com`.
6. Trigger full production rebuild.
7. Verify DNS A/CNAME records point cleanly to Hostinger server IP.

---

## 20. Staging Acceptance & Verification Checklist

Execute this checklist immediately following a staging deployment:

- [ ] **1. Home Page (`/`)**: Loads with brand styling, hero images, and fast response.
- [ ] **2. Search Engine Indexing (Robots.txt)**: Verify `https://staging.YOUR-DOMAIN.com/robots.txt` outputs `Disallow: /` to prevent indexing.
- [ ] **3. Authentication Flow**:
  - [ ] Login (`/login`) with Family credentials -> redirects to `/family`.
  - [ ] Login (`/login`) with Teacher credentials -> redirects to `/teacher`.
  - [ ] Magic link email confirmation & code exchange via `/auth/callback`.
  - [ ] Password reset request and recovery via `/reset-password`.
  - [ ] Logout -> redirects cleanly to `/login`.
- [ ] **4. Role Boundaries & Authorization**:
  - [ ] Family user attempting to visit `/teacher` -> redirected to `/family`.
  - [ ] Unauthenticated visitor attempting private routes -> redirected to `/login`.
  - [ ] Row-Level Security (RLS) enforces student/family data isolation in Supabase.
- [ ] **5. Direct Lesson Navigation (All 65 Lessons)**:
  - [ ] August Lessons: `/lessons/lesson-1-world-map` through `lesson-13-august-review`.
  - [ ] September Lessons: `/lessons/lesson-14-greetings` through `lesson-26-september-review`.
  - [ ] October Lessons: `/lessons/lesson-27-bayanihan` through `lesson-39-october-showcase`.
- [ ] **6. Interactive Adventure Experience (`/adventure/[id]`)**:
  - [ ] Verify Explorer, Adventure, and Trailblazer level toggle switches.
  - [ ] Verify all slide kinds (hook, discovery, rich explanation, vocabulary, facts, game, craft, review).
  - [ ] Verify all 6 premium assessment variants with interactive controls.
  - [ ] Verify quiz response state persistence and slide transitions.
  - [ ] Zero `[object Object]` or undefined rendering in slide markup.
- [ ] **7. Client-Bundle Privacy Gate**:
  - [ ] Confirm no teacher answer keys or scoring rationales in `.next/static/chunks/`.
- [ ] **8. Responsive UI & Accessibility**:
  - [ ] Test on mobile (iOS/Android viewport) and desktop browsers (Chrome, Firefox, Safari).
  - [ ] Verify keyboard navigation (Tab / Enter / Space / Arrow keys) and color contrast.
- [ ] **9. LiveKit Real-Time Classroom (`/classroom`)**:
  - [ ] Verify token generation via `/api/livekit-token` with valid classroom passcode.
- [ ] **10. Performance & Health**:
  - [ ] Monitor server response status (200 OK) and inspect Hostinger hPanel error logs.
