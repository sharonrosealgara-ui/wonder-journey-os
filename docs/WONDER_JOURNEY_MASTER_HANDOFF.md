# Wonder Journey : Master Project Handoff & Architecture Baseline

## Purpose & Operating Principle

This document is the durable, authoritative project brain for Wonder Journey. It enables full continuity, architecture alignment, and safe recovery across any AI engineering conversation without relying on transient chat logs or external memory.

> [!IMPORTANT]
> **Repository Truth Always Wins:**
> If this document ever conflicts with current active repository code or exact verified Git state, repository truth governs. Never mutate the codebase based solely on conversation memory or stale documentation.

---

## Status Legend

Every policy, subsystem, and roadmap item in Wonder Journey is classified under one of the following exact statuses:

- **CURRENT / BINDING:** Active rule, architecture standard, or boundary that must be obeyed now.
- **IMPLEMENTED & VERIFIED:** Shipped code that has passed full automated and manual local/remote verification gates.
- **PLANNED:** Approved requirement or architecture intended for near-term implementation but not yet built.
- **FUTURE:** Long-term direction or vision under evaluation; not authorized for active implementation.
- **BOUNDED FOLLOW-UP:** Strictly scoped, approved task addressing a specific finding or refinement.
- **SUPERSEDED:** Previous decision, runtime, or design pattern that has been intentionally replaced and must not be revived.
- **HISTORICAL CHECKPOINT:** Verified historical state or audit trail preserved for provenance; not current product truth.

---

## Authoritative Source Hierarchy

When resolving technical or business questions, consult sources in this strict order of precedence:

1. **Current repository truth:** Working code, configuration files, and active schema.
2. **Latest exact-SHA verified repository state:** Proven commits verified through deterministic gates.
3. **Latest owner-approved decisions:** Direct instructions and formal approvals from the founder/owner.
4. **Current Execution Charter / security corrections:** Established security boundaries and audit rules.
5. **Wonder Journey V1 Final Product Blueprint:** Core product specifications and track definitions.
6. **Older recovered conversation ideas:** Brainstorming notes or unverified historical discussion.

If an older source conflicts with a later verified decision, treat the older source as historical or superseded rather than resurrecting it.

---

## Product Identity & Core Positioning

- **Separate Entity:** Wonder Journey is an independent company and product, completely distinct from SDS or third-party agencies.
- **Product Model:** Wonder Journey is a focused, founder-led learning product. It is not an open tutoring marketplace, gig platform, or automated learning directory.
- **Permanent Vision:** Wonder Journey is a Christ-centered learning community helping children grow in language, culture, character, knowledge, and faith.
- **Public Positioning:** Founder-Led Family Learning.
- **Current Core Tracks (V1 Focus):**
  1. *Filipino Language:* Tagalog foundational speech, vocabulary, and contextual conversational practice.
  2. *Filipino Culture and Heritage:* Geography, archipelago history, regional traditions, and landmark exploration.
  3. *Filipino Values and Character:* Respect (*paggalang*), family unity (*bayanihan*), gratitude, and integrity.
  4. *Bible-Based Learning:* Scripture memorization, biblical world history, prayer reflections, and faith foundations.
- **Scope Deferrals (V1):**
  - *Hiligaynon Language Track:* DEFERRED for public V1.
  - *Broad Math, Science, and Exam Prep Marketplace:* DEFERRED.
  - *Native Mobile Applications (iOS / Android):* DEFERRED (Responsive Progressive Web App architecture is current).
  - *Broad Multi-Teacher Marketplace Expansion:* FUTURE.

---

## Founder Identity & Story

- **Founder:** Sharon Rose Algara
- **Public Titles:** Founder, Lead Educator, Platform Builder (Approved warm alternate: Founder, Educator, Creator).
- **Core Narrative Concept:** *Built by the Teacher Who Uses It.*
- **Founder Story Boundaries & Dignity Standard:**
  - Sharon's first remote work experience included a brief period of online English teaching.
  - A severe health crisis and subsequent gallbladder surgery required her to step away from work.
  - During this challenging season, Romans 8:28 ("And we know that all things work together for good to them that love God, to them who are the called according to his purpose") became deeply meaningful.
  - Her physical recovery journey involved travel, rest, and warm fellowship with sister churches across the Philippines.
  - Later, an unexpected online opportunity emerged that allowed her to teach children again in an individualized home setting.
  - Wonder Journey was originally conceived and built specifically to serve that founding student and family.
  - *Privacy Rule:* That founding family must remain strictly unnamed in all public materials without their prior explicit written consent.
  - *Corporate Privacy:* Names of former employers or third-party organizations must remain omitted.
  - *Tone Boundary:* Medical details must remain dignified, respectful, and brief. Never utilize the founder story as emotional or sympathy marketing.
- **Faith Attribution Principle:** While the software platform was architected and built by Sharon, every open door, provision, recovery, and step forward is attributed gratefully to the Lord.

---

## Current V1 Release Strategy

- **Immediate Release Priority (CURRENT / BINDING):**
  The overriding priority is delivering an excellent, safe, and rock-solid experience for the existing founding family, backed by an uncompromising privacy and child-safety floor.
- **Milestone Grounding:**
  Do not portray the upcoming release milestone as a full-scale public launch or broad commercial rollout.
- **Teacher Model:**
  - Sharon Rose Algara is the sole active V1 teacher.
  - Enrolled families cannot currently request or be assigned alternative teachers.
  - Automated teacher matching and external teacher onboarding are FUTURE capabilities.
- **Public Funnel Status:**
  - Public student enrollment is CLOSED.
  - Public inquiry form submissions are CLOSED.
  - The public landing page serves purely informational and brand-presence purposes.
- **Commercial & Marketing Controls:**
  - Public pricing is hidden. No provisional pricing notices or estimated fees may appear publicly.
  - Testimonials remain completely hidden until authentic family reviews and formal written consent are secured.
  - Prohibited elements: No placeholder customer personas, no "coming soon" review cards, and no synthetic social proof.

---

## Portal Architecture

The Wonder Journey system is organized around three strictly delineated portals:

1. **Student / Family Portal (`/(app)`):**
   - Interactive story adventures, digital passport stamps, cultural milestones, family blessings, and daily prayer journal.
   - Guardian controls, account settings, and learner oversight are integrated directly inside this portal.
   - *Architectural Rule:* Do not create an isolated fourth "Guardian Portal". Guardian capabilities belong within the shared Family experience.
2. **Teacher Portal (`/teacher`):**
   - Lesson orchestration, curriculum review across 65 stages, learner progress monitoring, and milestone issuance.
3. **Admin Portal (`/admin`):**
   - Platform health monitoring, configuration management, and workspace management.

---

## Curriculum & Media Integrity

- **65-Lesson Corpus:**
  - The 65-lesson curriculum repository is the starting corpus for Wonder Journey.
  - All lessons must undergo continuous content and factual audit against the four core V1 tracks.
  - Lessons that fall outside core track scope or fail publication standards must be archived or hidden rather than published prematurely.
- **Authentic Primary Media Requirement:**
  - Educational assets must use authentic historical, geographical, and cultural sources.
  - AI-generated imagery must never be used or presented as factual or historical evidence.
  - Passing curriculum schema and automated structure tests does not imply every historical media asset is finalized. Continuous visual and factual review is required.

---

## Media Provenance & Sourcing Standard

- **Historical Finding & Remediation:**
  Earlier stages of curriculum development uncovered template-generated and mislabeled graphic assets. Wonder Journey subsequently instituted a strict media provenance standard.
- **Provenance Verification Standard:**
  All factual and historical media assets must record:
  - Exact primary source organization or archive
  - Original creator and credit line (e.g., historical cartographer or artist)
  - Applicable copyright license and verifiable license URL
  - SHA-256 cryptographic checksum
  - Original pixel dimensions
  - Contextual, educational alt text
  - Truthful historical placement and context
- **Attribution Accuracy:**
  The hosting repository is not necessarily the creator. For example, Wikimedia Commons is a digital media repository, not the author or creator of historical works.
- **Lesson 1 Historical Map Reference:**
  The 1734 *Carta Hydrographica y Chorographica de las Yslas Filipinas* by Father Pedro Murillo Velarde, Nicolas de la Cruz Bagay, and Francisco Suarez is integrated with explicit Spanish colonial-era context disclosure.
- **Worktree Boundary Note:**
  Local curriculum media refinement files (including `public/media/curriculum/l01-visual-b.jpg`, `src/config/media-registry.ts`, and related tooling) remain outside the V1.2 landing page commit and must not be claimed as integrated until formally reviewed.

---

## Child Safety & Privacy Principles (CURRENT / BINDING)

- **Guardian as Primary Contact:** Guardians are the sole external point of contact for all communications regarding minors.
- **Data Minimization:** Collect only the minimum essential information required to provide educational services.
- **Communication Channels:** Teachers must never engage in direct, private communication with minors over personal messaging channels (e.g., personal WhatsApp, SMS, or social media).
- **Session Recordings:** Class recordings are disabled by default. Recordings require explicit, advance guardian consent.
- **Work Product & Marketing:** Displaying student work, audio, or video in external marketing materials requires separate written parental consent.
- **Confidentiality:** Learner progress records, evaluations, and family reflections must remain restricted to authenticated portal views.
- **Log & Email Hygiene:** Passwords, authentication tokens, medical notes, bank information, private child assessments, and sensitive personal data must never appear in application logs or outbound emails.
- **Test Fixtures:** Automated tests and public demonstrations must exclusively utilize synthetic, sanitized mock data. Real child data must never be committed as test fixtures.
- **Safety Gate:** Any unresolved vulnerability involving child safety, data leakage, authentication bypass, or authorization escalation blocks release.
- **Faith Practice Boundary:**
  Wonder Journey is openly rooted in Christian faith while warmly welcoming families of all backgrounds. No learner shall ever be compelled to pray aloud, profess specific theological beliefs, convert, or participate in spiritual practices beyond their family's comfort level.
- **Legal Compliance:** Avoid making unsupported legal claims regarding COPPA, GDPR-K, or the Philippine Data Privacy Act. Formal compliance requires qualified legal review based on target jurisdictions and learner ages.

---

## Public Inquiry Privacy & Security Architecture

The V1.2 public inquiry subsystem implements defense-in-depth security with dual-gate gating:

1. **Application-Level Gate:**
   - Controlled by environment variable `INQUIRY_FORM_ENABLED`.
   - Must strictly equal the exact string `"true"`. Any other value, empty string, or missing variable immediately fails closed.
   - When disabled, the public landing page renders an informational advisory and disables all form inputs.
2. **Database-Level Gate & Hardened Schema:**
   - Migration `supabase/migrations/0007_harden_inquiries_schema_and_rls.sql` is mandatory.
   - Direct raw `INSERT` on `public.inquiries` is completely revoked from `PUBLIC`, `anon`, and `authenticated` database roles.
   - Submissions must route exclusively through the security-definer function `public.submit_inquiry(...)`.
   - The private configuration table `private.inquiry_configuration` defaults to `enabled = false` and `approved_privacy_notice_version = NULL`.
   - Valid submission requires both the application gate to be `"true"` and the database gate to have `enabled = true` matching an exact approved privacy notice version.
3. **Audit & Evidence Capture:**
   - Captures separate boolean flags for direct contact consent and privacy notice acknowledgment.
   - Records the exact acknowledged privacy notice version string and UTC consent timestamp.
   - Automatically sanitizes inputs, enforces strict string length constraints, and rejects malformed email addresses at the database level.
   - Inquiry contents are never echoed in server logs, and user-facing error messages remain generic to prevent enumeration.

---

## Live Classroom Security Architecture

- **Server-Derived Grants:**
  LiveKit room tokens must be generated strictly from authenticated database truth, never from client-supplied parameters.
- **Verification Pipeline:**
  1. Authenticate Supabase session.
  2. Verify workspace membership and role.
  3. Validate active scheduled classroom session.
  4. Confirm registered classroom participant status.
  5. Derive user identity, room name, participant role, and permissions on the server.
  6. Issue cryptographically signed LiveKit token with server-controlled grants.
- **Prohibited Patterns:**
  - Client applications must never supply or override `room`, `roomName`, `identity`, `role`, or session passcodes.
  - Teacher administrative privileges (`roomAdmin`) must only be granted through server-side role verification.
  - Do not revive deprecated shared classroom codes, static room passwords, or legacy AccessGate mechanisms.

---

## Stage 12 Security Evolution (HISTORICAL CHECKPOINTS)

The security foundation of Wonder Journey was established through rigorous iterative audit stages:

- **Stage 12.1R.8:** Identified vulnerabilities in client-side LiveKit grant generation and static room fallbacks (SUPERSEDED).
- **Stage 12.1R.10:** Corrected architecture by mandating server-derived LiveKit tokens, real local Supabase authentication verification, and service-role secured nonce handling (HISTORICAL CHECKPOINT).
- **Historical Benchmark Commit:**
  - SHA: `0664adfbfce0466f767b8291f337c0c1abb42a51`
  - GitHub Workflow Run: `33594005648`
  - Associated Artifact: `9832818419`
  *(Preserved strictly for provenance; current repository HEAD is newer).*
- **Testing Standard:** Pinned Supabase CLI versioning, containerized PostgreSQL verification, secret scanner negative harness testing, and zero-trust authentication checks.

---

## Approved Hosting & Deployment Architecture

- **Approved Application Runtime (CURRENT / BINDING):**
  Hostinger Managed Next.js is the official production deployment target for the current Wonder Journey release.
- **Superseded Runtimes:**
  Cloudflare Pages and Netlify application runtimes are SUPERSEDED. All legacy edge functions, wrangler configurations, and netlify.toml files have been cleanly decommissioned.
- **Future Cloudflare Consideration:**
  Cloudflare technology is not permanently excluded. A future migration to Cloudflare Workers / OpenNext may be considered in subsequent phases, subject to exhaustive runtime validation and owner approval.
- **Current Operational Boundary:**
  Hostinger account connection, DNS routing, and production deployments are held pending completion of the local freeze and remote verification gates.

---

## Business Model & Viability Boundaries

- **Viability Horizon:**
  Wonder Journey is designed to be financially sustainable as a high-touch, premium founder-led learning studio. Broad multi-teacher unit economics remain unproven.
- **Tuition Structure:**
  Structured monthly or multi-week learning packages are preferred over ad-hoc per-session billing.
- **Pricing Secrecy:**
  Public pricing details must remain unpublished until merchant processing, package deliverables, cancellation policies, tax handling, and cost models are finalized.

---

## Ministry Commitment & Tithing Standard

- **Permanent Mission Intent:**
  Wonder Journey intends to allocate 10% of an accountant-defined eligible platform share to verified church/ministry support in the Philippines.
- **Company-Level Obligation:**
  This is a company-level commitment. It is not deducted from a teacher's agreed compensation or contractor pay. Teacher personal tithe remains voluntary.
- **Professional Accounting Requirement (PLANNED):**
  The exact accounting base, treatment, documentation, recipient verification, tax consequences, and operational implementation require formal determination by a qualified Philippine accountant prior to activation.
- **Current Preferred Direction:**
  The eligible platform share may be based on a professionally defined net-margin concept rather than gross revenue, subject to formal accountant confirmation. Therefore, "net margin" is a preferred direction and professional review item, not an already-final accounting definition.
- **Implementation Constraint:**
  Do not implement automated donation routing or deduction logic prior to formal accountant sign-off.

---

## System Notifications & Operational Health

- **Notification Pipeline (PLANNED):**
  Canonical Domain Event -> Recipient Resolution -> In-App Notice -> Durable Email Queue -> Verified SMTP/API Provider -> Delivery Confirmation / Retry Loop.
  *Privacy Rule:* Full student assessments or private evaluations must never be transmitted via unencrypted email.
- **System Health & Incident Center Direction (PLANNED / FUTURE):**
  - Architecture direction includes operational, degraded, partial-unavailability, outage, maintenance, and investigation states where appropriate.
  - Incident severity is tracked separately from overall system status rather than conflating the two.
  - Sanitized incident reporting and error logging.
  - Reversible operational adjustments; destructive database mutations require explicit human administrator approval.
  - No autonomous, silent patching of production database records.
  - System Health and Incident Center capabilities are architectural directions and must not be marked as implemented without explicit repository evidence.

---

## V1.2 Public Landing Page Freeze (CURRENT / BINDING)

- **Feature Branch:** `feat/v1-2-public-landing-page`
- **Frozen Local Commit:** `46491a144e69e27b2c623967727b523516fe6ec2`
- **Parent Commit:** `ad6d378b5ac5d0cf66913c40e38a684dd180601a`
- **Tree SHA:** `3e66af2d1db49edeed15e3e78b8a79e7aed3599c`
- **Commit Message:** `feat: add v1.2 public landing page and gated inquiry flow`
- **Status:** IMPLEMENTED & VERIFIED LOCALLY (Pending remote verification gate; not merged into main).
- **Exact 22-File Manifest:**
  1. `.env.example`
  2. `public/media/product-tour/tour-family-space.png`
  3. `public/media/product-tour/tour-lesson-adventure.png`
  4. `public/media/product-tour/tour-live-classroom.png`
  5. `public/media/product-tour/tour-progress-reflection.png`
  6. `public/media/product-tour/tour-teacher-studio.png`
  7. `scripts/test-api-security.js`
  8. `scripts/test-inquiry-security.js`
  9. `src/app/(marketing)/actions.ts`
  10. `src/app/(marketing)/inquiry-form.tsx`
  11. `src/app/(marketing)/layout.tsx`
  12. `src/app/(marketing)/learning-focus-tabs.tsx`
  13. `src/app/(marketing)/mobile-nav.tsx`
  14. `src/app/(marketing)/page.tsx`
  15. `src/app/(marketing)/product-tour.tsx`
  16. `src/app/globals.css`
  17. `src/components/adventure/historical-map-viewer.tsx`
  18. `src/components/adventure/slide-views.tsx`
  19. `src/components/ui/dimensional-icons.tsx`
  20. `src/config/brand.ts`
  21. `src/lib/inquiry-config.ts`
  22. `supabase/migrations/0007_harden_inquiries_schema_and_rls.sql`
- **Key Landing Page Deliverables:**
  - Storybook brand aesthetic with warm coastal palette and Outfit typography.
  - Founder-Led Family Learning narrative with dignified biographical context.
  - Keyboard-accessible 5-view Product Tour featuring authentic high-resolution captures.
  - Visually distinct, genuine Live Classroom capture replacing temporary placeholder.
  - Representative platform view copy replacing technical synthetic data disclosures.
  - Four focused learning pillars with knowledge integrated naturally across each area.
  - Responsive layout scaling with dedicated 3xl (120rem) and 4k (160rem) fluid containers.
  - Mobile drawer navigation with full cyclic focus trap and Escape key focus restoration.
  - Dual-gate public inquiry flow failing closed when disabled.
  - Historical Map Viewer with "Fit" initial zoom label and Spanish colonial perspective notice.
  - Zero em-dash characters across all public marketing copy.

---

## V1.2 Verification Proofs (Clean Ephemeral Worktree)

All gates executed from a fresh detached worktree at SHA `46491a144e69e27b2c623967727b523516fe6ec2`:

1. **Isolated Local Database Verification:**
   - Migrations 0001 through 0007 applied cleanly in order to an isolated PostgreSQL instance.
   - Confirmed existence of `public.submit_inquiry` with security-definer privileges.
   - Proved direct anonymous and authenticated raw `INSERT` into `public.inquiries` is completely rejected.
   - Proved configuration defaults to disabled (`enabled = false`, `approved_privacy_notice_version = NULL`).
   - Proved RPC calls fail closed when the gate is disabled.
   - Proved strict boundary enforcement when enabled (validates email syntax, consent flags, notice version matching, and string length limits).
2. **Automated Quality & Security Gates:**
   - `npm run typecheck`: Passed (0 errors).
   - `npm run lint`: Passed (0 errors, 9 pre-existing unused directive warnings).
   - `npm test`: Passed (All 65 lessons validated against curriculum schemas).
   - `node scripts/check-mojibake.js`: Passed (0 hits across 195 files).
   - `node scripts/test-api-security.js`: Passed (Auth redirect allowlist, LiveKit token deriving, and inquiry database security tests passed).
   - `npm run build`: Passed (178 static and dynamic routes compiled successfully).
3. **Headless Browser Behavior Proofs (Playwright):**
   - Landing page loads cleanly at HTTP 200.
   - Mobile navigation open/close, focus trapping, and Escape restoration verified at 390px viewport.
   - All 5 Product Tour tabs render, switch dynamically, and resolve authentic assets.
   - Live Classroom SHA-256 confirmed: `76853a6f45a2db8dd914425a10581f0a0976aaa8c5cec31fad98c421f0e66c22`.
   - Four Learning Focus tabs switch cleanly with correct educational takeaways.
   - Inquiry section renders closed status message and links to existing family login.

---

## Working Tree Preservation Policy

The primary source worktree (`C:/Projects/wonder-journey-os-clean`) intentionally preserves 12 modified files and local scratch tooling that are unrelated to the V1.2 landing page deliverable:

- **Preserved Modified Files (12):**
  - `public/media/curriculum/l01-visual-b.jpg`
  - `src/config/media-registry.ts`
  - `scripts/canonical-media-specs.js`
  - `scripts/build-complete-authentic-registry.js`
  - `scripts/verified-commons-image-map.js`
  - `artifacts/contact-sheet-130-media.html`
  - `artifacts/curriculum-media-fidelity-manifest.json`
  - `artifacts/media-contact-sheet.html`
  - `artifacts/media-contact-sheet.json`
  - `artifacts/media-visual-review.json`
  - `src/app/(auth)/layout.tsx`
  - `src/app/(auth)/login/page.tsx`
- **Untracked Local Tooling & Review Evidence:**
  - `artifacts/landing-page-final-review/` (20 multi-viewport audit files)
  - `scratch/` (16 local automation scripts)

> [!CAUTION]
> Never run `git reset --hard`, `git restore .`, `git clean -fd`, or `git stash` in the primary worktree merely to achieve a clean status. These files represent ongoing curriculum and media fidelity work that must be preserved.

---

## Git Workflow & Engineering Discipline

To maintain uncompromising repository integrity, adhere to these rules:

- **Exact-SHA Tracking:** Validate explicit commit SHAs and tree hashes before approving integrations.
- **Normal Commits Only:** Create standard, traceable Git commits.
- **Prohibited Operations:** Do not amend, rebase, squash, cherry-pick, or force-push commits unless explicitly directed by the repository owner.
- **Fast-Forward Merges:** When integrating approved feature branches, use strict fast-forward integration (`git merge --ff-only`) whenever branch topology allows.
- **Zero Premature Deployment:** Never trigger external deployments, modify DNS, or alter hosted Supabase resources during local testing.

---

## Current Next Step: Remote Gate

The immediate engineering step following this handoff:

1. **Remote Verification Gate:**
   - Authorize pushing `feat/v1-2-public-landing-page` at frozen SHA `46491a144e69e27b2c623967727b523516fe6ec2` to remote repository.
   - Run remote CI/CD automated validation workflows.
2. **Owner Review & Integration:**
   - Conduct formal owner visual and functional review.
   - Upon explicit owner approval, perform fast-forward merge into main.
   - Update this Master Handoff and create a new integrated milestone checkpoint.

---

## New Conversation Recovery Procedure

When opening a new AI engineering session, execute this exact sequence before making any code modifications:

1. Open the local Wonder Journey repository root.
2. Read `docs/WONDER_JOURNEY_MASTER_HANDOFF.md` thoroughly.
3. Perform read-only Git status inspection:
   ```bash
   git branch --show-current
   git rev-parse HEAD
   git status --short
   git worktree list
   ```
4. Compare repository HEAD with the recorded checkpoint in this handoff.
5. If repository truth is newer than this document, repository truth governs; update the documentation to match.
6. Read the most recent milestone document in `docs/checkpoints/`.
7. Only after completing these steps, proceed with the requested implementation.

### Recommended AI Prompt for New Sessions

```text
Continue Wonder Journey from docs/WONDER_JOURNEY_MASTER_HANDOFF.md.
Verify repository truth before mutation.
Repository truth overrides stale handoff text.
Preserve unrelated dirty work.
```
