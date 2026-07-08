# 📋 Wonder Journey OS — Decision Log

**The permanent engineering and product decision log.** It explains **why** major
architectural, educational, UX, and technical decisions were made. Future developers and
AI assistants must read this document before making significant changes.

**Rules of this log:**
- Never delete historical decisions.
- If a decision changes, mark the original **Superseded by Decision NNN** and explain why in the new entry.
- Every entry carries: ID · Date · Title · Context · Decision · Reasoning · Alternatives Considered · Benefits · Possible Drawbacks · Future Review Notes.
- Statuses: **Active** · **Provisional** (working decision, review scheduled) · **Open** (not yet decided) · **Superseded**.

Decisions 001–028 are the founding product decisions (ratified at project inception,
2026-07-07). Decisions 029+ are engineering decisions logged during implementation.

---

## Decision 001 — Product Name
**Date:** 2026-07-07 · **Status:** Active
- **Context:** The platform needs both a client-facing identity and an engineering identity.
- **Decision:** Public brand: **Wonder Journey**. Internal/engineering name: **Wonder Journey OS**.
- **Reasoning:** The public brand should feel warm and family-friendly; the engineering name should describe the platform architecture.
- **Alternatives considered:** One name for both; per-world naming only ("Discover the Philippines" as the product).
- **Benefits:** Families see warmth; docs and code stay precise; worlds keep their own titles under one brand.
- **Possible drawbacks:** Two names to keep straight in copy.
- **Future review:** When SaaS marketing begins, confirm trademark availability. Brand strings live in `config/brand.ts` (Decision 021).

## Decision 002 — Platform Philosophy
**Date:** 2026-07-07 · **Status:** Active
- **Context:** The obvious default was "build a small LMS."
- **Decision:** Build a **Family Learning Adventure Platform**, not a traditional LMS.
- **Reasoning:** Children learn better through exploration, storytelling, creativity, and shared family experiences.
- **Alternatives considered:** Traditional LMS; tutoring dashboard; content website.
- **Benefits:** Differentiated product; matches how the first family actually learns; drives every design decision downstream.
- **Possible drawbacks:** Harder to compare to existing tools; some LMS-expected features (grades, seat-time) intentionally absent.
- **Future review:** Hold this line when SaaS customers request LMS features; add them only as optional modules.

## Decision 003 — First Learning World
**Date:** 2026-07-07 · **Status:** Active
- **Context:** The platform needed a first world with a real paying family.
- **Decision:** Launch with **Discover the Philippines**.
- **Reasoning:** The first client specifically requested Filipino language, culture, cooking, family values, and the beauty of the Philippines — and it is Teacher Sharon's home, taught from the inside.
- **Alternatives considered:** Generic multi-country world; ESL-first.
- **Benefits:** Authentic content; passionate teacher; clear scope.
- **Possible drawbacks:** Content not directly reusable for the next world (architecture is).
- **Future review:** Future worlds reuse the same architecture as content packs (ARCHITECTURE.md §1).

## Decision 004 — Story-Based Learning
**Date:** 2026-07-07 · **Status:** Active
- **Context:** How should lessons feel?
- **Decision:** Every lesson feels like an **episode**, never a school lesson. Stories before facts, always.
- **Reasoning:** Children are naturally engaged by stories and adventures.
- **Alternatives considered:** Fact-first worksheets; video-course format.
- **Benefits:** Engagement; memory ("the village lifted the house" outlasts a definition).
- **Possible drawbacks:** More writing effort per lesson.
- **Future review:** Codified in CONTENT_GUIDELINES.md (lesson structure §5); AI generation must comply.

## Decision 005 — Morning Blessings
**Date:** 2026-07-07 · **Status:** Active
- **Context:** The family wanted gratitude woven into learning.
- **Decision:** Begin every class with the prompt, verbatim: **"What are you grateful to the Lord for today?"**
- **Reasoning:** Encourages thankfulness and reflection; supports the family's values.
- **Alternatives considered:** Generic "gratitude check-in"; optional prompt.
- **Benefits:** A daily rhythm; feeds the Gratitude Journal, Garden, and Blessings Wall from one entry.
- **Possible drawbacks:** Wording is family-specific — white-label clients may need a configurable prompt.
- **Future review:** Make the prompt text configurable per family at white-label time (Phase 8).

## Decision 006 — Prayer Leader
**Date:** 2026-07-07 · **Status:** Active
- **Context:** The family prays together; children shouldn't feel forced.
- **Decision:** Optional rotating prayer leader: Rylee · Ezra · Asa · Selah · Family Choice · Teacher Sharon (parents may always lead). Gentle invitation wording is canonical (DESIGN_SYSTEM.md §12).
- **Reasoning:** Supports the family's faith while keeping participation voluntary.
- **Alternatives considered:** No prayer feature; fixed leader; sign-up system.
- **Benefits:** Leadership practice; zero pressure; deterministic rotation needs no state.
- **Possible drawbacks:** Day-of-year rotation doesn't skip non-class days (leaders "pass" on off days — acceptable).
- **Future review:** Never track, score, or gamify prayer (AI_BEHAVIOR.md §9).

## Decision 007 — Filipino Languages
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Teach both **Tagalog and Hiligaynon**, always side by side.
- **Reasoning:** Tagalog is the national language; Hiligaynon is Sharon's native language and lets the children experience another major Philippine language.
- **Alternatives considered:** Tagalog only.
- **Benefits:** Authentic connection to their teacher; every vocabulary entry carries both (`Phrase` model).
- **Possible drawbacks:** Double content effort per word.
- **Future review:** Hiligaynon remains first-class, never a footnote (CONTENT_GUIDELINES.md).

## Decision 008 — Filipino Family Values
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Include lessons on: Respect · Hospitality · Bayanihan · Gratitude · Kindness · Responsibility · Stewardship · Helping Others · Humility · Family Love.
- **Reasoning:** Shaun specifically requested Filipino family values.
- **Alternatives considered:** Generic character education.
- **Benefits:** Culture and character taught as one; paired with Scripture per family preference (`config/values.ts`).
- **Possible drawbacks:** None significant.
- **Future review:** Values module is swappable per family (ARCHITECTURE.md §16).

## Decision 009 — Festivals
**Date:** 2026-07-07 · **Status:** Active
- **Context:** Philippine festivals are central to culture but often religious.
- **Decision:** Present festivals as **cultural and historical learning experiences**; never require activities that conflict with the family's beliefs. No Christmas/Easter crafts — the family honors Jesus through biblical Feast Days.
- **Reasoning:** Respect the family's faith while sharing Philippine culture.
- **Alternatives considered:** Skipping festivals entirely (loses too much culture).
- **Benefits:** Full cultural richness, zero belief conflict.
- **Possible drawbacks:** Requires care per festival lesson (activities center on food, music, craft, community).
- **Future review:** Per-family belief preferences become config at white-label time.

## Decision 010 — Cooking Studio
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Cooking is a **core learning pillar**, not an extra.
- **Reasoning:** Shaun specifically mentioned cooking; grandmother may participate; cooking creates meaningful family interaction — and every recipe doubles as a language and values lesson.
- **Alternatives considered:** Recipes as downloadable PDFs.
- **Benefits:** The most family-inclusive activity in the platform; feeds the Cookbook.
- **Possible drawbacks:** Real-world safety responsibility → explicit "ADULT JOB" step marking (mandatory).
- **Future review:** 12 recipes shipped; safety marking is a hard requirement for all future recipes.

## Decision 011 — Baking Studio
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Baking is its own module (Unit 8, "Baking Academy") alongside cooking.
- **Reasoning:** Sharon enjoys baking; it teaches measuring, patience, creativity, and sharing — and it's Selah's love.
- **Alternatives considered:** Fold baking into cooking.
- **Benefits:** A distinct identity for future "Baking Academy" world spin-off.
- **Possible drawbacks:** Slight overlap with cooking content.
- **Future review:** Candidate for a standalone white-label world (ROADMAP.md).

## Decision 012 — Family Cookbook
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Every completed recipe becomes a page in a digital **Family Cookbook**.
- **Reasoning:** The cookbook becomes both a learning resource and a memory book.
- **Alternatives considered:** Simple "completed" checkmarks.
- **Benefits:** Memory preservation is a core product promise; creates the end-of-term printable keepsake (Phase 3).
- **Possible drawbacks:** Photo storage limits in MVP (see Decision 030/035).
- **Future review:** Add teacher-message and family-photo fields (ROADMAP Phase 1 🔶 gaps).

## Decision 013 — Memory Album
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** A Family Memory Album will aggregate photos, reflections, projects, recipes, gratitude entries, awards, and travel adventures.
- **Reasoning:** Preserve family memories beyond the lessons.
- **Alternatives considered:** Keeping memories siloed per feature.
- **Benefits:** One treasured place; the scrapbook of the whole adventure.
- **Possible drawbacks:** MVP ships the pieces (cookbook, journals, garden); the aggregated album is Phase 3.
- **Future review:** Build in Phase 3 as a read-view over existing records — no new data entry.

## Decision 014 — Travel Passport
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Each destination earns a **passport stamp**, awarded by completing lessons.
- **Reasoning:** Children enjoy collecting achievements and tracking adventures.
- **Alternatives considered:** Percent-complete progress bars.
- **Benefits:** Progress as a collection, not a score; locked stamps spark curiosity; fun facts as discovery rewards.
- **Possible drawbacks:** None significant.
- **Future review:** Stamps derive from lesson completions (no separate stamp state) — keep it that way.

## Decision 015 — Parent Participation
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Parents are invited into activities whenever practical.
- **Reasoning:** This platform is designed for family learning, not independent tutoring.
- **Benefits:** The differentiator; parents are co-adventurers with their own portal.
- **Alternatives considered:** Child-only accounts with parent reports.
- **Possible drawbacks:** Requires parent time — mitigated by keeping challenges simple.
- **Future review:** Every lesson's `familyChallenge` is a required field (Decision 024).

## Decision 016 — Class Preparation Emails
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Generate a preparation email before every class: lesson topic, supplies, ingredients, videos, family challenge.
- **Reasoning:** Parents can prepare without searching through messages.
- **Alternatives considered:** In-app checklist only; manual emails.
- **Benefits:** One `buildEmail()` function from lesson config; copy-ready today, automatable later.
- **Possible drawbacks:** MVP requires a manual paste into Gmail.
- **Future review:** Automate via Resend/Gmail + Vercel cron in Phase 4 (ARCHITECTURE.md §15).

## Decision 017 — Birthday Celebrations
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Celebrate birthdays in-platform: login pop-up (confetti, balloons, blessing), birthday badge, family messages, memory gallery.
- **Reasoning:** Celebrate each family member and strengthen relationships.
- **Alternatives considered:** Calendar-only.
- **Benefits:** Joyful surprise moments; shipped pop-up shows once/day with replay.
- **Possible drawbacks:** Auto-badge and gallery are Phase 3; **birthday dates in config are placeholders until Sharon enters real ones**.
- **Future review:** ⚠️ Real dates required before 2026-07-13.

## Decision 018 — Family Celebrations
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** A customizable celebration calendar: birthdays, family milestones, important dates, custom celebrations.
- **Reasoning:** Create joyful moments throughout the year.
- **Benefits:** Feast days and family dates live in the same config (`celebrations.ts`), honoring Decision 009.
- **Alternatives considered:** Birthdays only.
- **Possible drawbacks:** None significant.
- **Future review:** Add recurring feast-day support when the family provides their calendar.

## Decision 019 — Teacher Productivity
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** AI reduces teacher preparation time by generating lesson plans, Canva outlines, worksheets, games, quizzes, parent summaries, shopping lists, and emails.
- **Reasoning:** Sharon should spend more time teaching and less time preparing.
- **Alternatives considered:** Manual authoring forever.
- **Benefits:** Phases 4–5 of ROADMAP.md; generation kit defined in CONTENT_GUIDELINES.md.
- **Possible drawbacks:** Quality control burden → guardrail below.
- **Future review:** **Guardrail:** the teacher reviews all AI content before children see it. Always.

## Decision 020 — White-Label Strategy
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** **Never hardcode client-specific information.** Everything configurable.
- **Reasoning:** Future clients should reuse the same platform.
- **Benefits:** Family #2 onboards by config copy; enforced in review ("a child's name in a component is a defect").
- **Alternatives considered:** Fork-per-client (maintenance nightmare).
- **Possible drawbacks:** Slightly more upfront structure.
- **Future review:** Verified at every code review; see Decision 021.

## Decision 021 — Configuration-First Development
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Students, lessons, recipes, birthdays, destinations, badges, schedule, resources (plus brand, languages, values, navigation) live in `src/config/` files.
- **Reasoning:** Simplifies customization; makes Decision 020 real.
- **Benefits:** Onboarding = editing text files; AI generation targets typed configs.
- **Possible drawbacks:** Non-technical editing still requires touching TS files → Phase 8 adds editing UI.
- **Future review:** Config shapes are the canonical data models (ARCHITECTURE.md §6).

## Decision 022 — Design Philosophy
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** The interface feels **warm, tropical, colorful, premium, handcrafted**.
- **Reasoning:** Avoid generic corporate dashboards.
- **Benefits:** Fully specified in DESIGN_SYSTEM.md; implemented as `@theme` tokens + `wj-` classes.
- **Alternatives considered:** Component library off the shelf (would look like everyone else).
- **Possible drawbacks:** Custom CSS to maintain — kept small deliberately.
- **Future review:** Rebranding per world = token swap (Decision 020).

## Decision 023 — Real Photography
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Use labeled placeholders for authentic photography of food, destinations, culture. **Never unrealistic AI-generated food; never stock/fake family photos.**
- **Reasoning:** Real photography creates trust and authenticity.
- **Benefits:** Honesty; the family's own photos become the platform's imagery.
- **Possible drawbacks:** Placeholders visible until real photos are added.
- **Future review:** Teacher replaces placeholders over time (DESIGN_SYSTEM.md §31).

## Decision 024 — Family Challenges
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Every lesson includes a **Family Challenge** (required `familyChallenge` field).
- **Reasoning:** Learning extends beyond the live class.
- **Benefits:** Guaranteed weekly shared experience; source of memory artifacts.
- **Alternatives considered:** Optional homework.
- **Possible drawbacks:** None — challenges are simple by rule.
- **Future review:** Add "we did it!" check-off in Phase 2.

## Decision 025 — Educational Philosophy
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Teach through stories, exploration, conversation, cooking, creativity, games, projects, reflection.
- **Reasoning:** Supports different learning styles and keeps children engaged.
- **Benefits:** Codified in CONTENT_GUIDELINES.md (≥5 of 9 learning styles per lesson).
- **Alternatives considered:** Lecture/video-first.
- **Possible drawbacks:** None accepted.
- **Future review:** No grades, no exams unless a family requests them (CURRICULUM_FRAMEWORK.md).

## Decision 026 — MVP First
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Polished MVP before advanced features.
- **Reasoning:** The platform must be usable for Monday's classes (2026-07-13).
- **Benefits:** Shipped and verified in one day; roadmap phases gate everything else.
- **Possible drawbacks:** Some features intentionally 🔶 partial (tracked in ROADMAP.md).
- **Future review:** Code freeze judgment applies before each class day.

## Decision 027 — Portfolio Quality
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Every feature is built portfolio-quality.
- **Reasoning:** Wonder Journey will become Sharon's flagship software project.
- **Benefits:** No throwaway code; docs suite doubles as portfolio evidence.
- **Possible drawbacks:** Slower than hacking — accepted trade.
- **Future review:** Release standards in ROADMAP.md apply to every release.

## Decision 028 — SaaS Vision
**Date:** 2026-07-07 · **Status:** Active
- **Decision:** Architect every module for future commercialization.
- **Reasoning:** The platform will eventually support multiple families, educators, and organizations.
- **Benefits:** Storage seam, config packs, brand seam all exist today.
- **Possible drawbacks:** None significant at current scale.
- **Future review:** Phases 8–9 of ROADMAP.md.

---

# Implementation Decisions (logged during build)

## Decision 029 — Standalone Project, Separate from the Life OS Hub
**Date:** 2026-07-07 · **Status:** Active
- **Context:** Sharon has an existing personal "AI Life OS" Next.js app (`shawie-claude-ai-life-os-build-6ktqrl`). The build rules said: do not destroy the portfolio hub.
- **Decision:** Wonder Journey OS is its **own project** at `C:\Users\Dell\wonder-journey-os`, sharing zero code with the Life OS app.
- **Reasoning:** Different product, different design language, different deployment; total isolation removes all risk to working software.
- **Alternatives considered:** Routes inside the existing app (rejected: entangles branding, deps, and deploys).
- **Benefits:** Independent deploys; the hub is untouchable by mistake.
- **Possible drawbacks:** Two projects to maintain.
- **Future review:** None needed.

## Decision 030 — localStorage MVP Behind a Storage Seam
**Date:** 2026-07-07 · **Status:** Active
- **Context:** Classes start in six days; no time or need for a backend.
- **Decision:** All user data persists in `localStorage` (namespace `wjos:`), accessed **only** through `src/lib/storage.ts`.
- **Reasoning:** Zero-backend launch; the single seam makes the future Supabase swap a re-implementation of one module (ARCHITECTURE.md §8).
- **Alternatives considered:** Supabase now (too much setup risk before Monday); file export/import.
- **Benefits:** Instant launch; privacy by default (data never leaves the device).
- **Possible drawbacks:** Per-device data; ~5 MB cap; no sync — accepted for MVP.
- **Future review:** Revisit when the family wants multi-device access (migration screen planned).

## Decision 031 — Runtime Google Fonts via `<link>`, not `next/font`
**Date:** 2026-07-07 · **Status:** Active
- **Context:** The build machine cannot reach `fonts.googleapis.com`; `next/font` stalled builds ~4 minutes retrying, then fell back.
- **Decision:** Load Baloo 2 + Nunito with a `<link>` stylesheet at runtime; CSS declares full system-font fallbacks.
- **Reasoning:** Build-time network dependency removed; end users' browsers fetch fonts normally.
- **Alternatives considered:** `next/font` (fails here); self-hosting font files (viable future option).
- **Benefits:** 4-minute builds → 5-second builds; offline-graceful.
- **Possible drawbacks:** No font subsetting/preload optimization; brief fallback-font flash possible.
- **Future review:** Self-host the two font families at deploy time if the flash bothers anyone.

## Decision 032 — Greetings as One Bilingual Episode
**Date:** 2026-07-07 · **Status:** Provisional — review after first teaching (week of 2026-07-13)
- **Context:** ROADMAP/CURRICULUM list separate Tagalog and Hiligaynon greetings episodes; the MVP shipped one combined lesson.
- **Decision:** Keep the combined bilingual greetings episode for launch.
- **Reasoning:** Side-by-side presentation reinforces that both languages are first-class and halves week-one prep; the languages page already teaches both in parallel.
- **Alternatives considered:** Two separate episodes (still available — it's a config edit).
- **Benefits:** Simpler first week; comparison aids memory.
- **Possible drawbacks:** Less depth per language in one session.
- **Future review:** Sharon decides after teaching it; if split, update `config/lessons.ts` and CURRICULUM_FRAMEWORK.md, and log the change here.

## Decision 033 — Class Day Schedule
**Date:** 2026-07-07 · **Status:** ⚠️ **Open — needs Shaun/Sharon confirmation**
- **Context:** CURRICULUM_FRAMEWORK.md records Shaun's proposed schedule as **Mon/Tue/Fri**; the shipped lesson dates in `config/lessons.ts` follow **Mon/Wed/Fri** (Jul 13, 15, 17, 20, 22, 24, 27, 29, 31).
- **Decision:** Pending. Config keeps Mon/Wed/Fri until the family confirms.
- **Reasoning:** Don't churn dates on a guess; either pattern is a 2-minute config edit.
- **Alternatives considered:** n/a — this is a family-calendar fact, not an engineering choice.
- **Benefits / drawbacks:** n/a until decided.
- **Future review:** Confirm before Monday; update `config/lessons.ts` dates and mark this decision Active with the answer.

## Decision 034 — Emoji as the Icon System (for now)
**Date:** 2026-07-07 · **Status:** Active
- **Context:** DESIGN_SYSTEM.md calls for a consistent icon/illustration style; custom illustration takes time.
- **Decision:** Emoji are the platform's icon system until a custom illustrated set exists. One emoji per concept, used consistently. No stock icon packs.
- **Reasoning:** Consistent, colorful, child-readable, zero bytes, zero licensing.
- **Alternatives considered:** lucide-react icons (installed but unused for content icons — too corporate for child-facing surfaces); stock illustrations (style clash).
- **Benefits:** Instant coherence; children read emoji fluently.
- **Possible drawbacks:** Emoji render differently per OS; limited brand distinctiveness.
- **Future review:** Replace with a commissioned illustration set per DESIGN_SYSTEM.md §26 when budget allows.

## Decision 035 — Client-Side Photo Shrinking to Data URLs
**Date:** 2026-07-07 · **Status:** Active
- **Context:** Cookbook photos must fit inside localStorage's ~5 MB (Decision 030).
- **Decision:** Photos are resized client-side (≤900px, JPEG q0.8) via canvas before storage as data URLs.
- **Reasoning:** Keeps uploads working with zero backend; a privacy feature — photos never leave the device.
- **Alternatives considered:** Full-size storage (would exhaust quota after ~3 photos); no photos in MVP (unacceptable — memories are the product).
- **Benefits:** Dozens of memories fit; upload UX works today.
- **Possible drawbacks:** Reduced resolution for future printing; per-device storage.
- **Future review:** On Supabase Storage migration, upload originals and keep thumbnails local.

## Decision 036 — Accessibility: Reduced Motion Honored
**Date:** 2026-07-07 · **Status:** Active
- **Context:** DESIGN_SYSTEM.md §29 requires honoring `prefers-reduced-motion`; the initial MVP didn't.
- **Decision:** A global media query disables confetti, balloons, flips, and hover lifts for users who prefer reduced motion; instant state changes remain.
- **Reasoning:** Accessible before decorative (Design Principle #6).
- **Alternatives considered:** In-app toggle (may still add later; OS preference is the standard baseline).
- **Benefits:** Verified in the compiled stylesheet; zero change for other users.
- **Possible drawbacks:** None.
- **Future review:** Apply automatically to all future animations.

---

## Decision 037 — Visual Identity v2: Watercolor Storybook (Canva Reference)
**Date:** 2026-07-07 · **Status:** Active
- **Context:** Sharon provided her Canva presentation video ("🌴 Discover the Philippines Family Learning.mp4") as the exact visual reference — watercolor paper, sky-blue/cream tones, navy hand-lettered headings with white outlines, periwinkle cloud cards with paperclips, yellow brush-stroke banners, tropical leaves and doodles.
- **Decision:** Rebuild the design system (v2) to match the video: new palette (watercolor sky bg, navy ink text, periwinkle/coral/sunshine accents), new fonts (Lilita One display · Quicksand body · Patrick Hand accents), paper-grain overlay, wobbly hand-drawn card borders, and signature classes `.wj-outline`, `.wj-brush`, `.wj-dots`, `.wj-note`, `.wj-card-bubble`, `.wj-sticker`, plus the `TropicalDecor` corner-leaf component.
- **Reasoning:** The app should feel like the family's Canva lesson board come to life — one continuous visual world from presentation to platform.
- **Alternatives considered:** Keeping v1 (warm cream/tropical) — warmer but didn't match the classroom material the family already knows.
- **Benefits:** Implemented almost entirely at the token/CSS layer — every page restyled consistently with only a handful of component edits, proving the design-system architecture.
- **Possible drawbacks:** Lilita One is single-weight (bold utilities are no-ops on headings); `-webkit-text-stroke` outline depends on modern browsers (graceful without it).
- **Future review:** Frame extraction of the reference lives in session scratch only; keep the video in Downloads as the canonical reference. DESIGN_SYSTEM.md §4–5 updated in the same session.

---

## Decision 038 — Adventure Classroom (Family Adventure Theater)
**Date:** 2026-07-08 · **Status:** Active
- **Context:** The platform needed its centerpiece: a full-screen interactive teaching mode so Sharon never opens Canva/PowerPoint separately during class.
- **Decision:** Build the Adventure Theater as a **slide engine over the existing Lesson config** (`lib/slides.ts` → `buildSlides(lesson)`): every lesson auto-generates a 14-step episode (Welcome → Blessings → Prayer → Mission → Story/Learning → Vocabulary → Videos → Game → Recipe → **Quiz** → Reflection → Challenge → Memory Capture → Sunset Finale). Theater renders via a React portal to `<body>` (escapes the app shell's stacking context), with top bar (timer/map/teacher/fullscreen/exit), Adventure Map chapter drawer, Teacher Panel (mission, materials, auto-saved quick notes), keyboard navigation, and progress-bar scrubbing. Quiz is auto-generated multiple-choice from the lesson's phrases (gentle: wrong = soft retry, results = stars, never a grade). Blessings/Reflection save to journals automatically; Memory Capture saves to the new **Backpack** (`wjos:memories` + `/backpack` page); the finale awards the passport stamp. Mascots (Tala/Lila/Kiko/Mangga/Isla, `config/mascots.ts`) guide each slide kind.
- **Reasoning:** Zero-per-lesson authoring cost — all 9 shipped lessons (and every future/AI-generated one) get a full theater automatically, which is the config-first architecture paying off.
- **Alternatives considered:** Hand-authored slide decks per lesson (unmaintainable); embedding Canva (no interactivity, external dependency mid-class).
- **Benefits:** Teacher teaches entirely inside Wonder Journey; quiz requirement satisfied for every lesson; matching game reused (`components/matching-game.tsx` extracted).
- **Possible drawbacks / deferred:** drawing tools, laser pointer, zoom, dark mode, volume/music, XP, adaptive quiz difficulty, per-slide custom art, map-zoom lesson launch — all logged as Phase 2+ polish, not MVP blockers. YouTube embeds activate automatically when real video URLs replace search links in config.
- **Future review:** After the first live class, ask Sharon which deferred control she missed most; build that one first.

---

## Decision 039 — Adventure Classroom v2: Live-Class Teacher Tools
**Date:** 2026-07-08 · **Status:** Active
- **Context:** The classroom needed to support a real live class end-to-end: prep, teaching, participation tracking, and the post-class parent recap.
- **Decision:** Added to the theater and lobby: **Class Prep Checklist** (teacher-mode overlay before class, helper-not-gate, prayer leader inlined) · **Participation Panel** (per-child tally: answered/participated/great job/star/needs help, persisted per class day) · **Post-Class Parent Summary** (copy-ready recap: lesson, both languages' words, activities, quiz result, participation, family challenge, next-class supplies, recording link, teacher note) · **Lesson Recording placeholder** (paste-a-link, stored per lesson, included in summary) · **Age Level Adaptation** (🐣 Younger = 2-choice quiz / 🦅 Older = 3-choice + bonus challenges; auto-defaults from the selected child's age) · **Offline backup card** on video slides (discussion prompt + retell + draw — class never stops for a dead link) · **Adventure Lobby** upgrades on Today (class countdown, mission preview, question of the day, last-adventure recap) · **Adventure Tree** on the Backpack (5 growth stages; leaves/flowers/butterflies/birds = adventures/blessings/badges/memories).
- **Reasoning:** These are the tools Sharon touches during an actual Monday class; everything else (mailbox, storybook, timeline, drawing tools, sound) is post-launch polish.
- **Alternatives considered:** Building the full spec at once (storybook, timeline, sound design, map zoom) — rejected: launch risk five days before the first class.
- **Benefits:** A complete live-class loop — prep → teach → track → recap — inside one app.
- **Possible drawbacks / deferred:** Adventure Mailbox, Family Storybook, Memory Timeline, laser/drawing tools, sound design, animated map zoom, quiz-type expansion (T/F, drag-drop, picture), teacher lesson-editor UI — all Phase 2–3; the printable "Family Adventure Book" is the Phase 3 flagship.
- **Future review:** After week one, ask Sharon which deferred piece she reached for and build that first.

---

## Decision 040 — Two-Role Model: Family Portal + Teacher Portal
**Date:** 2026-07-08 · **Status:** Active · **Supersedes the three-mode model in the original MVP (student/parent/teacher)**
- **Context:** Sharon defined the SaaS product structure: exactly two user roles — a Family Portal (one shared workspace per family; children participate together, **no individual student logins**) and a Teacher Portal. The two must be *completely different experiences*.
- **Decision:** Collapsed student+parent modes into **`family`** (legacy stored values normalize via `normalizeMode()`). Family Portal: warm adventure world, shared garden/wall/journal/awards, child picker for personalization only, Family Hub for parents, **Viewer Mode** in the theater (presentation only). Teacher Portal: visually distinct studio (stripe, hibiscus accent, tools-first nav), **Presenter Mode** in the theater (checklist, panel, participation, summary). Family identity in config: `familyName: "The Ferrell Family"`, `familySlug: "ferrell"` (the future workspace key). Home page presents the two portals as two distinct doors.
- **Reasoning:** Matches how the family actually learns (together, one screen), simplifies the mental model, and mirrors the future auth model exactly (DATABASE.md already specified: no child accounts, children act under the family session).
- **Alternatives considered:** Keeping three modes (rejected: student/parent distinction had almost no real differences and doesn't survive multi-tenancy); per-child logins (rejected by product definition and child-privacy posture).
- **Benefits:** UI roles now map 1:1 onto future authenticated accounts; sibling data sharing matches family reality; teacher experience is unmistakably hers.
- **Possible drawbacks / deferred to Phase 8–9:** real authentication (email/password + magic links), family switcher in the Teacher Portal, server-enforced isolation (RLS), live cross-device presenter/viewer sync, domain structure (/teacher, /login, /family), Make.com webhooks, PWA/offline — all seams documented in DATABASE.md & API_PLAN.md. Building them now was rejected: five days before the first class, a backend is launch risk with zero Monday value.
- **Future review:** When family #2 signs, Phase 8 starts with Supabase Auth on this exact two-role model.

---

# Future Decisions

IDs 041+ are reserved. Log a new entry for: new dependencies, data-model changes,
schedule/curriculum shape changes, backend migration steps, and anything a future
developer would ask "why is it like this?" about. Never delete; supersede.

---

# Final Principle

Every engineering, educational, and design decision should support one or more of these goals:

- **Bring families closer together.**
- **Help children learn with joy.**
- **Reduce teacher workload.**
- **Preserve meaningful memories.**
- **Build a reusable software platform.**

Before making major changes, always review this log to understand why the current
approach was chosen.

---

*Wonder Journey OS — Decision Log · Decisions 001–037 · July 2026*
