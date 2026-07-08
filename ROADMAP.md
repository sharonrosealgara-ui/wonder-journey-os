# 🌺 Wonder Journey OS — Development Roadmap

**Product:** Wonder Journey OS
**First Learning World:** 🇵🇭 Discover the Philippines
**Tagline:** *Every Lesson is an Adventure. Every Adventure Becomes a Memory.*

This is the official development roadmap from MVP to commercial SaaS. It prioritizes the
features required for the first classes (beginning **Monday, July 13, 2026**) while keeping
the architecture scalable for future families and clients. Every phase builds on the
previous one.

**Legend:** ✅ shipped & verified · 🔶 partially shipped · ⬜ planned

---

## Roadmap Philosophy

Build it like a real software product. Prioritize, in order:

1. **Working features** — verified in the browser, not just compiling
2. **Excellent user experience** — a 7-year-old and a busy parent are the benchmark users
3. **Beautiful UI** — per `DESIGN_SYSTEM.md`; premium, never generic
4. **Reusable architecture** — per `ARCHITECTURE.md`; config-first, world-packs, white-label seams
5. **Teacher productivity** — every phase should give Sharon time back
6. **Family engagement** — memories preserved beat features shipped

**Never sacrifice maintainability for speed.** A feature that can't be reused for the next
family is technical debt wearing a costume.

---

# Phase 1 — MVP (Priority: Before Monday) — **STATUS: SHIPPED ✅**

**Goal:** a polished platform Sharon can immediately use for Shaun & Taylor's family.
Built, `npm run build` green, and click-tested end-to-end in the browser.

| Deliverable | Status | Notes |
|---|---|---|
| **Landing Page** — welcome screen, family branding, adventure theme, hero | ✅ | Brand-config driven (`config/brand.ts`) |
| **Student Selection** — Rylee, Ezra, Asa, Selah; selection saved | ✅ | Personal colors, emoji, interests per child |
| **Adventure Home** — Today's Adventure, Blessings status, Prayer Leader, upcoming celebration | ✅ | Progress/Passport/Awards live on their own pages, linked from nav |
| **Morning Blessings** — the gratitude prompt, stored entries | ✅ | Displays in Gratitude Journal + Gratitude Garden + Family Blessings Wall |
| **Prayer Rotation** — all six leaders, always optional | ✅ | Deterministic daily rotation; gentle wording is a hard requirement |
| **Lesson Library** — first lessons | ✅ | 4 lessons shipped: Welcome to the Philippines · Tagalog **&** Hiligaynon Greetings (combined bilingual lesson) · Filipino Family Values · Mango Float Adventure. *Splitting greetings into two lessons (per this roadmap's 5-lesson list) is a config edit — decide after teaching Lesson 2.* |
| **Today's Adventure** — mission, videos, vocabulary, activities, reflection, passport stamp | ✅ | Superseded by the **🌴 Adventure Classroom / Family Adventure Theater** (Decision 038): full-screen episode mode auto-generated from every lesson — mission checklist, story slides, tap-to-reveal vocabulary, matching game, auto-generated quiz, reflection & gratitude that save to journals, memory capture into the Backpack, and a sunset finale that stamps the passport |
| **Parent Portal** — today's lesson, materials, ingredients, videos, progress, journals, cookbook, birthdays | ✅ | 10-second scan order: lesson → prepare → progress → memories |
| **Teacher Dashboard** — lesson overview, Canva links, resources, journal review, awards, prep email | ✅ | Copy-ready Class Prep Email verified |
| **Cooking & Baking Studio** — Mango Float + 11 more recipes | ✅ | Photo placeholder, recipe, tools, measurements, safety, vocabulary, reflection, upload |
| **Family Cookbook** — completed recipes become memory pages | 🔶 | Food photo, who-cooked, family memory (parent note), student reflection ✅; separate family-photo slot & teacher message field ⬜ (quick adds) |
| **Birthday Celebrations** — calendar, popup, greeting | 🔶 | Calendar + countdown + confetti/balloon popup + blessing ✅; auto birthday badge & birthday gallery ⬜ (Phase 3) |
| **Awards** — badge system | ✅ | 10 badges incl. Grateful Heart & Kind Heart; teacher awarding verified. Names differ slightly from this list — rename/extend in `config/badges.ts` anytime |
| **Resources** — videos, articles, Canva, printables | 🔶 | Videos/websites/printables/presentations ✅; Google Earth & worksheet categories ⬜ (add rows to `config/resources.ts`) |

### MVP Success Criteria — **all met**

- ✅ Platform is usable (all core flows click-tested in the browser)
- ✅ No broken pages (all 19 routes build; unknown ids get friendly fallbacks)
- ✅ Responsive (mobile-first; verified layouts)
- ✅ Build passes (`npm install && npm run build`, zero errors)
- ✅ Teacher can begin classes Monday

### Remaining human tasks before Monday (content, not code)

1. Enter **real birthdays** in `src/config/celebrations.ts` (placeholders inside!)
2. Paste **real Canva links** in `src/config/lessons.ts`
3. Optional: deploy to Vercel so the family uses it on their own devices

---

# Phase 2 — Core Learning Platform

**Goal:** deepen the learning experience beyond the first four lessons.

- Travel Passport enhancements: map view, more destinations, stamp-earn animation *(passport with 12 destinations already shipped ✅ — this phase makes it richer)*
- Interactive maps (Google Earth / embedded map cards per destination)
- More lessons: greetings split into Tagalog + Hiligaynon deep-dives, numbers, colors, animals, market-day food trips
- Philippine animals module (tarsier, carabao, whale shark — ties to Rylee & Asa's love of animals)
- More games: word hunt, listen-and-pick, memory pairs *(matching game + flashcards shipped ✅)*
- Mini quizzes — gentle, celebration-first (per DESIGN_SYSTEM.md §22)
- Interactive vocabulary — audio pronunciation buttons
- Family challenges tracker (challenges shipped in lessons ✅; add "we did it!" check-off)
- Craft activities module (sewing/embroidery projects for Rylee, dioramas for Ezra, builds for Asa, miniatures for Selah)
- Reflection improvements: per-lesson reflections saved to the journal automatically
- Journal improvements: prompts from DESIGN_SYSTEM.md §23, drawing uploads

**Milestone:** a full 6-week curriculum teachable entirely from the platform.

---

# Phase 3 — Family Experience

**Goal:** strengthen family participation and memory-keeping.

- Family Gallery (all uploaded photos in one place)
- Memory Album / Adventure Scrapbook (auto-assembled from lessons, recipes, journals)
- Gratitude Garden growth stages (garden ships ✅; add vines, seasons, milestones)
- Family Blessings Wall print view (for the real refrigerator)
- Birthday Timeline + birthday memory gallery + auto birthday badge
- Cooking Memories enhancements: family photo slot, teacher message, taste-test ratings
- Project Gallery (ProjectSubmission model from ARCHITECTURE.md §6)
- Certificates (end-of-unit, printable, beautiful)
- Achievement Wall (family-wide, celebrates together — never ranks siblings)

**Milestone:** the family can print a real keepsake from their first term.

---

# Phase 4 — Teacher Productivity

**Goal:** cut Sharon's prep time in half.

- Lesson Generator (template-driven lesson scaffolds → config)
- Worksheet Generator (printable practice from lesson vocabulary)
- Quiz Generator (from lesson phrases, auto-gentle)
- Game Generator (any phrase set → matching/flashcards automatically — the engine already works this way ✅; add teacher UI)
- Shopping List Generator (aggregate a week's recipes → one list; per-recipe copy ✅)
- Class Prep Email Automation (send via Resend/Gmail; scheduled by Vercel cron — payload function ships ✅)
- Resource Finder (curated search by topic)
- Presentation Generator (lesson → Canva-ready outline)

**Milestone:** creating a new lesson takes minutes, not evenings.

---

# Phase 5 — AI Features

**Goal:** AI assistants that draft, teacher approves. AI output always lands in the same
typed config models (`Lesson`, `Recipe`, `Quiz`) so the UI never changes.

- Lesson Assistant (draft a lesson for any topic in the world's voice)
- Recipe Assistant (family-friendly recipe + safety notes + vocabulary)
- Travel Assistant (destination facts, virtual field trip scripts)
- Language Assistant (phrase sets with pronunciation for any category)
- Quiz Assistant (gentle quizzes from any lesson)
- Homework Assistant (practice suggestions per child's interests)
- Reflection Assistant (personalized reflection prompts)
- Parent Summary Generator (weekly "what we learned" digest)
- Progress Summary Generator (per-child narrative reports, strengths-first)

**Guardrail:** AI never speaks directly to children unreviewed; the teacher is always the
editor-in-chief.

---

# Phase 6 — Parent Experience

**Goal:** make parents feel like co-adventurers, not spectators.

- Parent Dashboard v2 (richer progress charts, gentle insights)
- Weekly Planner (drag lessons across the week)
- Family Calendar (classes + birthdays + feast days in one view)
- Notifications (email/SMS: class tomorrow, supplies needed)
- Birthday reminders (a week ahead, with gift-free celebration ideas)
- Shopping Lists (auto from the week's recipes)
- Resource Library for parents (parenting the curriculum: culture background, faith notes)
- Progress Charts (per child, always framed as growth)
- Family Reflections (parents write their own memories alongside the kids')

---

# Phase 7 — Student Experience

**Goal:** deepen the adventure without turning it into a slot machine.

- Interactive Games library (per world)
- Achievements v2 (multi-step quests: "Cook 3 recipes" → Cooking Star)
- Adventure Map (visual journey through the world's destinations)
- Passport Collection v2 (books per world, page-turn UI)
- Learning Paths (choose-your-adventure lesson ordering by interest)
- XP & Levels — **carefully**: progress feelings, no pressure mechanics, no streak anxiety
- Avatar (child customizes their explorer)
- Character Companions (mascots per DESIGN_SYSTEM.md §27 — Kiko the Tarsier leads)

**Guardrail:** DESIGN_SYSTEM.md principles win over engagement metrics, always.

---

# Phase 8 — White Label Platform

**Goal:** turn the codebase into a product. The seams already exist (`config/brand.ts`,
world content packs, family configs — ARCHITECTURE.md §16).

- Multiple families per deployment (family config packs → database rows)
- Teacher accounts (real auth roles replace UI modes)
- Brand customization UI (no-code: name, palette, logo, tagline)
- Themes (tropical, forest, space… token swaps per DESIGN_SYSTEM.md §4)
- Different countries (world packs: lessons + destinations + languages + recipes)
- Different languages (i18n for UI chrome; content is already multilingual by design)
- Different curricula (values module swappable; feast-day calendar per family preference)

**Milestone:** onboarding family #2 without touching a single component.

---

# Phase 9 — Commercial SaaS

**Goal:** Wonder Journey OS as a business.

- Authentication (Supabase Auth — per ARCHITECTURE.md §8)
- Subscriptions & Billing (Stripe: per-family and per-teacher plans)
- Family invitations (teacher invites a family; family invites grandparents as viewers)
- Teacher marketplace (tutors offer worlds/classes to families)
- Lesson marketplace (teachers sell/share world packs)
- AI lesson credits (metered AI generation)
- Analytics (privacy-first: engagement for teachers, never surveillance of children)
- Organization dashboard (homeschool co-ops, tutoring companies)

---

# Future Learning Worlds

After 🇵🇭 Discover the Philippines, each world is a content pack (no new code):

🇯🇵 Discover Japan · 🇰🇷 Discover Korea · 🇮🇹 Discover Italy · 🇪🇸 Discover Spain ·
🇬🇧 ESL Adventure · 🧁 Baking Academy · 🍳 Cooking Academy · 🌎 Around the World ·
🌿 Nature Explorer · 🚀 Space Explorer · 📖 Storytelling World · 🏛 History Explorer ·
🧪 Science Explorer

**Selection rule:** build the world the next paying family asks for, not the one that's
most fun to research.

---

# Long-Term Goals

Wonder Journey OS should become:

1. **Portfolio flagship** — the project that shows Sharon's product, design, and teaching skill in one link
2. **Commercial software** — real families paying for real value
3. **White-label education platform** — tutors and co-ops running their own branded worlds
4. **Family learning ecosystem** — lessons, memories, celebrations, and faith in one warm home
5. **Teacher productivity platform** — prep in minutes, teach with joy
6. **AI lesson generation system** — teacher-supervised, config-native, world-aware

---

# Release Standards

Before **every** release, no exceptions:

- ✅ `npm install && npm run build` passes with zero errors
- ✅ Responsive on mobile, tablet, laptop
- ✅ No TypeScript errors (strict mode stays on)
- ✅ No broken routes (every nav item resolves; friendly fallbacks for bad ids)
- ✅ Clean UI (DESIGN_SYSTEM.md §33 consistency rules)
- ✅ Accessible (DESIGN_SYSTEM.md §29 — including reduced motion)
- ✅ Documented (ARCHITECTURE.md / DESIGN_SYSTEM.md / this roadmap updated when reality changes)

---

# Final Success Statement

The platform succeeds when:

> **Children are excited to begin each lesson.**
> **Parents feel involved.**
> **The teacher spends less time preparing.**
> **Family memories are preserved.**
> **The software is reusable for future families.**
> **Every lesson truly becomes an adventure.**

---

*Wonder Journey OS — Development Roadmap v1.0 · July 2026 · First class: Monday, July 13*
