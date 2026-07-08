# 🌺 Wonder Journey OS — Architecture

**Product:** Wonder Journey OS
**First learning world:** Discover the Philippines: A Family Learning Adventure
**Tagline:** *Every lesson is an adventure. Every adventure becomes a memory.*

> **Status note:** The MVP described here is **implemented and building cleanly** as of July 2026.
> Sections marked **[Current]** describe code that exists today; sections marked **[Target]**
> describe the structure to grow into as the platform scales. Where they differ, the migration
> path is stated.

---

## 1. Product Architecture Overview

Wonder Journey OS is **not** an LMS, a tutoring website, or a school dashboard. It is a
**reusable family learning platform**: a warm, joyful home where children and parents learn
together through language, values, culture, virtual travel, cooking, gratitude, prayer, and
memory-making.

The architecture separates three layers so each can evolve independently:

| Layer | What it holds | Changes when... |
|---|---|---|
| **Platform** (components, hooks, lib) | Cards, games, journals, passport, popups, storage | The product itself improves |
| **World content** (config: lessons, recipes, destinations, languages) | Everything about *Discover the Philippines* | A new learning world is created |
| **Family** (config: family, celebrations, schedule, brand) | Names, ages, birthdays, colors, teacher | A new client family is onboarded |

Because content and family data live entirely in configuration, the same codebase can ship
future worlds with no component rewrites:

- 🇯🇵 Discover Japan
- 🗣️ ESL Academy
- 🧁 Baking Academy
- ✝️ Christian Family Learning
- 🏫 Homeschool Portal
- 🌲 Nature Explorer

**A "world" is a content pack** — a set of config files (lessons, destinations, recipes,
language phrase sets, values, resources) plus a brand palette. The platform renders whatever
world it is given.

---

## 2. Recommended Tech Stack

### Core **[Current — in production]**

| Technology | Role | Why |
|---|---|---|
| **Next.js 15** (App Router) | Framework, routing, builds | File-based routes map 1:1 to feature pages |
| **React 19** | UI | Component reuse across worlds |
| **TypeScript** (strict) | Type safety | Config files are type-checked, so client onboarding errors are caught at build time |
| **Tailwind CSS 4** | Styling | Design tokens in `@theme` make rebranding a palette swap |
| **localStorage** | MVP persistence | Zero-backend launch; wrapped behind one module so it is swappable |
| **Config files** (`src/config/`) | All customizable data | The Configuration-First Rule (§4) |

### Future-ready integrations **[Target]**

| Integration | Purpose | Where it plugs in |
|---|---|---|
| **Supabase** (DB/Auth/Storage) | Real accounts, multi-device sync, photo storage | Replaces `lib/storage.ts` internals (§8) |
| **Firebase** | Alternative to Supabase if client requires | Same seam |
| **Resend / SendGrid / EmailJS / Gmail API** | Automated class prep emails | `buildEmail()` in the prep-email module already produces the payload |
| **Google Drive** | Bulk photo/document archive for families | Cookbook & project uploads |
| **Canva links** | Lesson presentations | Already a per-lesson config field (`canvaLink`) |
| **YouTube embeds** | In-app video viewing | Upgrade `videoLinks` from external links to embedded players |
| **AI lesson generation** | Draft new lessons/worlds from a prompt | Emits objects matching the `Lesson` interface (§6) — the UI needs no changes |
| **Vercel cron jobs** | Scheduled email sends, birthday reminders | Server-side automation once a backend exists |

---

## 3. Folder Structure

### [Current] MVP structure (implemented, passing builds)

```text
wonder-journey-os/
  src/
    app/                    # Next.js App Router — one folder per feature page
      page.tsx              # Welcome / role & student selection
      today/                # Today's Adventure (student dashboard)
      blessings/            # Morning Blessings
      journal/              # Gratitude Journal + Garden + Blessings Wall
      prayer/               # Prayer Leader
      lessons/  [id]/       # Lesson Library + lesson pages
      languages/            # Word lists, flashcards, matching game
      passport/             # Travel Passport
      cooking/  [id]/       # Cooking & Baking Studio + recipe pages
      cookbook/             # Family Cookbook / Memory Album
      awards/               # Badges
      celebrations/         # Birthdays & family dates
      resources/            # Video & link library
      parent/               # Parent Portal
      teacher/              # Teacher Dashboard
      prep-email/           # Class Prep Email generator
    components/             # Shared UI (app-shell, birthday-popup, photo-upload, ...)
    config/                 # ← ALL customizable data (see §4)
    lib/                    # storage.ts (localStorage + hook), app-state.ts (types, dates)
```

### [Target] Scaled structure (adopt as the codebase grows)

```text
app/                        # Routes stay thin — they compose feature modules
  page.tsx
  student/  parent/  teacher/
  lessons/  travel/  languages/
  cooking-baking/  cookbook/  journal/
  awards/  celebrations/  resources/

components/
  ui/                       # Buttons, inputs, chips, modal, tabs
  layout/                   # AppShell, Sidebar, TopNav
  cards/                    # StudentCard, LessonCard, RecipeCard, ...
  dashboards/               # Stat blocks, progress summaries
  forms/                    # Journal forms, upload forms
  navigation/               # Mode-aware nav

features/                   # One folder per feature module (§10)
  students/  lessons/  gratitude/  prayer/
  travel/  cooking/  cookbook/  celebrations/
  awards/  email-prep/  resources/

config/
  brand.ts                  # Name, tagline, palette, logo — white-label seam
  students.ts  lessons.ts  recipes.ts
  destinations.ts  badges.ts  birthdays.ts
  schedule.ts  resources.ts  navigation.ts  values.ts

data/                       # Sample/demo content for new-client previews
  sampleLessons.ts  sampleRecipes.ts  sampleResources.ts

hooks/
  useLocalStorage.ts  useStudent.ts  useProgress.ts
  useBadges.ts  useJournal.ts

lib/
  dates.ts  storage.ts  emailTemplates.ts  progress.ts  utils.ts

types/                      # One file per domain model (§6)
  student.ts  lesson.ts  recipe.ts  badge.ts
  journal.ts  celebration.ts  resource.ts
```

**Migration path:** split `lib/app-state.ts` into `types/` + `hooks/` first (pure moves, no
logic changes), then extract page sections into `features/` as pages grow. Do this
opportunistically — never as a big-bang refactor before a class day.

---

## 4. Configuration-First Rule

> ### ⚠️ THE RULE
> **Never hardcode family-specific or world-specific data inside UI components.**
> Every customizable value comes from `config/`. Components receive data; they never own it.

Data that must live in config (all of it already does):

| Data | Config file |
|---|---|
| Family name, student names, ages, interests, colors | `family.ts` (target: `students.ts` + `brand.ts`) |
| Teacher & parent names, prayer rotation | `family.ts` |
| Schedule, class dates/times | `lessons.ts` (target: `schedule.ts`) |
| Birthdays & family dates | `celebrations.ts` (target: `birthdays.ts`) |
| Lessons (content, materials, links, challenges) | `lessons.ts` |
| Recipes | `recipes.ts` |
| Badges | `badges.ts` |
| Brand name, world name, tagline, logo | `brand.ts` ✅ (the white-label seam) |
| Brand colors | `globals.css` `@theme` tokens |
| Resources | `resources.ts` |
| Destinations | `destinations.ts` |
| Language phrase sets | `languages.ts` |
| Values | `values.ts` |
| Navigation & mode visibility | `navigation.ts` |

**Why:** onboarding the next client family = copying the config folder and editing text.
No component is touched. This is what makes the platform sellable.

**Enforcement:** in code review, any string like a child's name, a date, or a lesson fact
appearing inside `components/` or `app/` is a defect.

---

## 5. User Roles — Two Portals (Decision 040)

Wonder Journey has **exactly two roles**. There are **no individual student logins** —
children participate together with their family inside one shared workspace. The two
portals are deliberately **completely different experiences**.

Access modes are a **UI filter, not a security boundary** in the MVP (one trusted family per
install, no server). The mode lives in storage (`wjos:mode`; legacy "student"/"parent"
values normalize to "family") and drives navigation, chrome, and behavior. When a backend
arrives, the two modes map to real authenticated accounts (§8, DATABASE.md).

### 👨‍👩‍👧‍👦 Family Portal (mode: `family`)
One warm, shared adventure world per family (the Ferrell Family workspace). Contains:
Adventure Lobby (Today), Adventure Classroom (Viewer Mode — presentation only, zero
teacher controls), Morning Blessings, shared Gratitude Garden/Wall/Journal, Lesson
Library, Languages & games, Travel Passport, Backpack & Adventure Tree, Cooking Studio,
Family Cookbook, Awards (everyone celebrates everyone), Celebrations, Resources, and the
Family Hub (parents' at-a-glance view: schedule, materials, progress, memories). A child
picker personalizes (whose backpack, whose blessing) without ever being a login. **Nothing
technical, no admin controls, ever.**

### 🍎 Teacher Portal (mode: `teacher`)
Sharon's studio — visually distinct (studio stripe, hibiscus accent, tools-first
navigation). Everything the family sees **plus**: Teacher Studio dashboard, Adventure
Classroom **Presenter Mode** (prep checklist, teacher panel, participation tracker, parent
summary, recording link, quick notes), lesson plan management (config today; builder UI in
Phase 8), Class Prep Email, badge awarding, journal review, and progress tracking. The
future multi-family Teacher Portal (family switcher: Families → Ferrell → Launch
Adventure) is a Phase 8 build on the same two-role model.

---

## 6. Data Models

Canonical TypeScript interfaces. **[Current]** models are implemented (in `config/*.ts` and
`lib/app-state.ts`); move each to `types/` as the codebase scales.

```ts
// ── People ──────────────────────────────────────────────
interface Student {
  id: string;
  name: string;
  age: number;
  emoji: string;
  color: string;              // accent for avatars & cards
  interests: string[];
  funFact: string;
}

type PrayerLeader = string;   // rotation list: students + "Family Choice" + teacher

// ── Learning content ────────────────────────────────────
interface Lesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  emoji: string;
  category: "Philippines" | "Language" | "Values" | "Cooking";
  destinationId?: string;     // passport stamp earned on completion
  recipeId?: string;          // linked recipe for cooking lessons
  date: string;               // ISO class date
  time: string;
  materials: string[];
  canvaLink: string;
  videoLinks: { label: string; url: string }[];
  familyChallenge: string;
  notes: string;
  sections: { heading: string; emoji: string; body: string; bullets?: string[] }[];
  phrases?: { english: string; tagalog: string; hiligaynon: string; pronunciation?: string }[];
  reflection: string;
  gratitudePrompt: string;
}

interface Recipe {
  id: string;
  name: string;
  filipinoName: string;
  emoji: string;
  type: "Cooking" | "Baking" | "No-Bake";
  difficulty: "Easy" | "Medium";
  time: string;
  photoNote: string;          // description for the real-photo placeholder
  ingredients: string[];      // include measurements
  tools: string[];
  steps: string[];            // "ADULT JOB:" prefix marks adult-only steps
  safety: string[];
  tagalogWords: { word: string; meaning: string }[];
  hiligaynonWords: { word: string; meaning: string }[];
  culturalNote: string;
  discussionQuestion: string;
}

interface Destination {
  id: string;
  name: string;
  region: "Luzon" | "Visayas" | "Mindanao" | "Nationwide";
  emoji: string;
  knownFor: string;
  funFact: string;
}

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

interface Resource {
  id: string;
  title: string;
  emoji: string;
  type: "Video" | "Website" | "Printable" | "Presentation";
  url: string;
  description: string;
  category: string;
}

// ── Family records (user-generated, persisted) ──────────
interface GratitudeEntry {
  id: string;
  studentId: string;
  date: string;               // ISO
  prompt: string;             // which of the three prompts was chosen
  text: string;
}

interface JournalEntry {
  id: string;
  studentId: string;
  date: string;
  title: string;
  text: string;
}

interface Birthday {                   // stored as Celebration in config
  id: string;
  name: string;
  studentId?: string;
  type: "birthday" | "family";
  month: number;              // 1–12 (no year needed for birthdays)
  day: number;
  emoji: string;
  note: string;
}

interface CookbookMemory {
  id: string;
  recipeId: string;
  date: string;
  cookNames: string;
  photo: string | null;       // data URL (MVP) → storage URL (future)
  memory: string;             // family memory / parent note
  reflection: string;         // student reflection
  teacherMessage?: string;    // future: teacher adds encouragement
}

interface ProjectSubmission {          // future: general project uploads
  id: string;
  studentId: string;
  lessonId?: string;
  date: string;
  title: string;
  photo: string | null;
  description: string;
}

interface ClassPrepEmail {
  lessonId: string;
  subject: string;
  body: string;               // built by buildEmail(lesson)
  generatedAt: string;
}
```

---

## 7. MVP State Management

**[Current]** No global state library. Three tiers, in order of preference:

1. **React component state** — transient UI (open tabs, form fields, game state).
2. **Custom hook `useStored<T>(key, fallback)`** — anything that must survive reload.
   Hydrates after mount (no SSR mismatch), broadcasts a custom event so every component
   watching the same key stays in sync, and **writes outside React's render cycle** (a
   setState-during-render bug was found and fixed here — keep it that way).
3. **`localStorage`** under the `wjos:` namespace, JSON-serialized, accessed **only** through
   `lib/storage.ts`. Pages never call `localStorage` directly.

Persisted keys:

| Key | Contents |
|---|---|
| `wjos:mode` | Active mode (student/parent/teacher) |
| `wjos:activeStudent` | Selected student id |
| `wjos:gratitude` | `GratitudeEntry[]` |
| `wjos:journal` | `JournalEntry[]` |
| `wjos:completions` | Completed lessons → derives **passport stamps** and **completed recipes** |
| `wjos:awards` | Earned badges |
| `wjos:cookbook` | Cookbook memories incl. photos (client-side shrunk to ≤900px JPEG before save) |
| `wjos:birthdayDismissed` | Date the birthday pop-up was dismissed (shows once per day) |
| *(future)* `wjos:projects`, `wjos:emailDrafts` | Project placeholders, prep email drafts |

**Known MVP limits (accepted):** data is per-browser/per-device; localStorage caps at ~5 MB
(hence photo shrinking); no conflict resolution. All resolved by §8.

---

## 8. Future Backend Plan

`lib/storage.ts` is the **only** module that knows where data lives. The upgrade is a
re-implementation of that seam — pages and hooks keep their signatures.

**Steps:**
1. **Supabase Auth** — one family account; profile rows map to modes/roles (real security
   replaces the UI-filter modes of §5).
2. **Supabase Postgres** — replace `readStored`/`writeStored` with async queries; add
   row-level security per family.
3. **Supabase Storage** (or **Google Drive**) — cookbook and project photos move from data
   URLs to uploaded files; store URLs in rows.
4. **Email automation** — a server action calls Resend/SendGrid/Gmail with the already-built
   `ClassPrepEmail` payload; Vercel cron schedules sends and birthday reminders.
5. **Migration** — a one-time "import my browser data" screen reads the `wjos:*` keys and
   uploads them, so the family loses nothing.

**Future tables** (all rows carry `family_id` for multi-tenancy):

```
users              families           students          lessons
recipes            journals           gratitude_entries badges
birthdays          resources          projects          cookbook_memories
class_emails
```

---

## 9. Component Architecture

Reusable components — presentational, data passed as props, no config imports inside them
(the page/feature layer feeds them). Names marked ✅ exist today (some currently inline in
pages; extract as reuse appears — second use = extraction time):

| Component | Purpose |
|---|---|
| `StudentCard` ✅ | Avatar, name, age, interests (welcome page, dashboards) |
| `LessonCard` ✅ | Lesson tile with category, date, completion state |
| `RecipeCard` ✅ | Recipe tile with type, difficulty, "we made this" |
| `DestinationCard` ✅ | Passport stamp (earned/unearned states) |
| `BadgeCard` ✅ | Badge with earned date & note |
| `JournalCard` ✅ | Journal entry with student attribution |
| `GratitudeCard` ✅ | Blessing entry on the wall |
| `BirthdayCard` ✅ | Calendar row with countdown chip |
| `ResourceCard` ✅ | External link card with type chip |
| `DashboardCard` ✅ | Stat blocks (Parent/Teacher) |
| `ProgressBar` | Visual progress (future: per-world completion) |
| `PrayerLeaderCard` ✅ | Today's leader with gentle invitation copy |
| `ClassPrepEmailCard` ✅ | Email preview + copy button |
| `CookbookMemoryCard` ✅ | Photo + memory + reflection page |
| `SectionHeader` ✅ | `PageHeader` — emoji + title + subtitle |
| `EmptyState` ✅ | Friendly "first page is waiting" placeholders |
| `Modal` ✅ | `BirthdayPopup` is the first; generalize on second need |
| `Tabs` ✅ | Journal (Garden/Wall/Journal), Languages (List/Cards/Game) |
| `Sidebar` / `TopNav` ✅ | `AppShell` — mode-aware navigation |

Also shared: `PhotoUpload` (file → shrunk data URL), `CopyButton` (clipboard w/ fallback).

**Design system:** Tailwind `@theme` tokens (sand/mango/sunset/ocean/palm/hibiscus/ube) +
CSS component classes (`wj-card`, `wj-btn`, `wj-chip`, `wj-stamp`, `wj-input`, confetti/flip
animations). Rebranding a world = retheming the tokens.

---

## 10. Feature Modules

Each module owns one family experience. Route, data source, and storage keys:

| Module | Route | Reads (config) | Writes (storage) |
|---|---|---|---|
| Student Portal | `/` + `/today` | family | activeStudent, mode |
| Parent Portal | `/parent` | family, lessons | — (read-only views) |
| Teacher Dashboard | `/teacher` | family, lessons, badges | awards |
| Morning Blessings | `/blessings` | family | gratitude |
| Prayer Rotation | `/prayer` | family (leaders) | — (pure date math) |
| Today's Adventure | `/today` | lessons, celebrations | — |
| Lesson Library | `/lessons`, `/lessons/[id]` | lessons, values | completions |
| Travel Passport | `/passport` | destinations, lessons | — (derived from completions) |
| Languages | `/languages` | languages | — |
| Filipino Values | `/lessons` (values grid) + lesson 3 | values | — |
| Cooking & Baking | `/cooking`, `/cooking/[id]` | recipes | — |
| Family Cookbook | `/cookbook` | recipes | cookbook |
| Gratitude Journal | `/journal` | family | journal, (reads gratitude) |
| Awards | `/awards` | badges, family | — (teacher writes) |
| Family Celebrations | `/celebrations` | celebrations | birthdayDismissed |
| Birthday Pop-Up | global (AppShell) | celebrations | birthdayDismissed |
| Class Prep Email | `/prep-email` | lessons, family | — (copy-only MVP) |
| Resources | `/resources` | resources | — |

---

## 11. Birthday Architecture

**Flow [Current]:**
1. `celebrations.ts` stores birthdays as `{month, day}` (year-free).
2. On every page load, the globally-mounted `BirthdayPopup` (in `AppShell`) runs
   `getTodaysBirthdays()` — a pure month/day match against today.
3. If matched **and** not yet dismissed today (`wjos:birthdayDismissed !== todayISO`), the
   pop-up renders over everything: **"Happy Birthday, [Name]!"** with 🎈 floating balloons,
   🎊 CSS confetti rain, a warm birthday blessing, the Tagalog *"Maligayang kaarawan!"*, and a
   **Continue to Adventure Home** button.
4. Dismissal is stored per-date, so it shows once per day but reappears for the whole
   birthday (and the Celebrations page has a "replay" button that clears the dismissal).

**[Target] additions:** award the birthday badge automatically on the day; save a
"birthday memory" record (photo + messages from the family) into Family Celebrations as a
memory gallery.

> ⚠️ The four birthday dates currently in config are **placeholders** — Sharon must enter the
> real dates before Monday.

---

## 12. Morning Blessings Architecture

Before each class, the student sees a peaceful screen asking:

> **What are you grateful to the Lord for today?**

- Three sentence-starters (config-extendable): *"Today I am grateful to the Lord
  because..."*, *"One blessing I noticed today is..."*, *"One thing that made me happy today
  is..."*
- Entries save as `GratitudeEntry` keyed by student and date.
- One write, three displays:
  - **Gratitude Journal** — chronological entries per student
  - **Gratitude Garden** — each entry blooms a flower (hover reveals the blessing); parents
    see the whole family's garden, students see their own
  - **Family Blessings Wall** — every family member's blessings in one shared feed
- Today's Adventure shows a "✅ Done today / Start here first" status chip so the blessing
  naturally opens each class day.

---

## 13. Prayer Leader Architecture

- Rotation list in config: **Rylee → Ezra → Asa → Selah → Family Choice → Teacher Sharon**.
- Leader = `rotation[dayOfYear % rotation.length]` — deterministic, no stored state, same
  answer on every device, and tomorrow's leader is previewable.
- **Tone is a requirement, not a nicety.** The UI must always carry the gentle invitation:

  > *"If you feel comfortable, you may lead us in a short opening prayer. If not, another
  > family member or Teacher Sharon can lead."*

  Prayer is never forced, tracked, scored, or gamified. No badges for praying frequency;
  the "Courageous Prayer" badge is teacher-awarded encouragement, never automated.

---

## 14. Cooking & Cookbook Architecture

**Recipe pages** (rendered entirely from the `Recipe` config shape) include: real food photo
placeholder with description, ingredients with measurements, tools, tap-to-check step-by-step
guide, **safety reminders** (frying/knives/ovens are explicitly "ADULT JOB"), Tagalog words,
Hiligaynon words, cultural note, family discussion question, **Upload Photo** button, and
**Add to Family Cookbook** button. A copyable shopping list is generated from ingredients.

**Cookbook memories** — completing a recipe creates a memory page holding: the food/family
photo (shrunk client-side), who cooked, the family memory (parent note), the student
reflection, and *(future)* a teacher message. The cookbook grows into the family's own
digital Filipino cookbook over time; "Make it again" links back to the recipe.

**Values link:** cooking *is* a values lesson — lumpia-rolling as kitchen bayanihan, pancit
as a blessing of long life. Cultural notes and discussion questions carry this on purpose.

---

## 15. Class Prep Email Architecture

- One pure function `buildEmail(lesson): string` assembles the email from lesson config:
  subject, greeting to Shaun, lesson title & subtitle, date/time, materials list (including
  cooking ingredients / craft supplies — they live in `materials`), Canva link, video links,
  family challenge, and teacher notes.
- **MVP [Current]:** teacher picks the lesson at `/prep-email`, previews, clicks **Copy**,
  pastes into Gmail. No sending infrastructure.
- **Future automation:** because the payload is already a single function's output, adding a
  sender is one server action: Gmail API / Resend / SendGrid / EmailJS, optionally triggered
  by a Vercel cron (e.g., auto-send 48h before each class date).

---

## 16. Scalability Rules

The platform must let Sharon, without rewriting components:

1. **Add a family** — new config folder (students, birthdays, schedule, brand); done.
2. **Change branding** — swap `@theme` tokens / `brand.ts` (name, tagline, palette, logo).
3. **Add a country/world** — new lessons + destinations + languages + recipes + resources
   config pack.
4. **Reuse components** — every card/game/journal is world-agnostic by design.
5. **Portfolio project** — the repo itself demonstrates config-driven multi-tenant design.
6. **Sell it** — white-label = brand config + world pack + family config per client; the
   future backend adds per-family data isolation (`family_id` on every table, §8).

Rules that protect this: the Configuration-First Rule (§4); storage access only through the
seam (§7); components never import config directly (§9); no world-specific logic in the
platform layer (a "Philippines" string in a component is a defect — it belongs in config).

---

## 17. Build Standards

Every feature must ship with:

- **TypeScript safety** — strict mode, no `any`, config validated by interfaces at build time
- **Reusable components** — second use of a pattern = extract it
- **Clean imports** — `@/` alias, config → lib → components → app layering, no cycles
- **Accessible HTML** — real `<button>`/`<label>`/`<table>` semantics, alt text, focus states
- **Responsive, mobile-first layout** — a parent's phone in the kitchen is a primary device
- **No broken routes** — every nav item resolves; unknown ids get friendly fallbacks
- **No build errors** — and no new console errors/warnings at runtime
- **Child-safe tone** — warm, encouraging copy; failure states are gentle ("That recipe
  wandered off to the market 🧺")

---

## 18. Deployment Requirements

Before any handoff or deploy, this must pass **with zero errors**:

```bash
npm install
npm run build
```

Fix all errors before continuing — never ship a red build.

Environment notes for the current dev machine: port 3000 is OS-reserved (dev runs on 4173
via `npm run dev -- -p 4173`), and Google Fonts are loaded at **runtime** via `<link>` (never
`next/font`, which stalls builds on this machine's network). Production hosting: Vercel or
any Node host; the app is static-friendly (only dynamic routes are lesson/recipe pages).

---

## 19. Final Architecture Principle

> ## 🌺 Build simple, beautiful, reusable systems first.
> ## Add complexity only when it improves the family learning experience.

Every technical decision answers to one question: *does this make learning together more
joyful for a family?* If a feature adds complexity without adding wonder, it waits.

---

*Wonder Journey OS — Discover the Philippines · Architecture v1.0 · July 2026*
