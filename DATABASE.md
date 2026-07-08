# 🗄️ Wonder Journey OS — Data Architecture

**This document defines the complete data architecture:** the MVP's localStorage layer
(shipping today) and the normalized relational schema it migrates into (Supabase or
another Postgres-compatible database).

> **Honesty markers:** **[Current]** = implemented and storing real data today.
> **[Target]** = the schema the platform grows into. The two are designed as one system —
> every Current collection maps onto a Target table (§ Migration).

---

# Purpose

The data architecture must support:

- Multiple **families** · multiple **students** · multiple **teachers**
- Future **organizations** (homeschool co-ops, tutoring companies)
- **White-label deployments** and future **SaaS subscriptions**

The schema is normalized, scalable, and easy to maintain.

---

# Database Philosophy

**Never design the database around one family.**

| Today | Future | Later |
|---|---|---|
| 1 family | 100 families | 10,000 families |

Practical consequences baked into the Target schema:

1. Every family-owned row carries `family_id` (tenancy key for Row Level Security).
2. Content (lessons, recipes, destinations, badges) is **shared platform data** versioned
   per world — it carries `world_id`, not `family_id`.
3. Family *records about* content (progress, memories, stamps) join the two: they carry
   both the student/family key and the content key.
4. IDs are UUIDs in the Target schema; the MVP's generated string ids migrate 1:1.

---

# Core Entities — Target Schema

Types shown as TypeScript interfaces (the Supabase tables use the snake_case column names
in comments). Timestamps are ISO strings / `timestamptz`.

## Families

```ts
interface Family {
  id: string;                 // uuid PK
  familyName: string;         // family_name
  parentOneName: string;
  parentTwoName: string | null;
  email: string;              // unique, contact + auth anchor
  timezone: string;           // IANA, e.g. "America/Denver"
  country: string;
  preferredLanguage: string;  // UI language for chrome (content is world-defined)
  createdAt: string;
  updatedAt: string;
}
```
**Relationships:** one family → many Students, Celebrations, Gallery items, ClassPrepEmails.
**[Current]:** `config/family.ts` (single family, config-defined).

## Students

```ts
interface StudentRecord {
  id: string;                 // uuid PK
  familyId: string;           // FK → families.id
  firstName: string;
  lastName: string | null;
  nickname: string | null;
  age: number;                // derived from birthday when present
  birthday: string | null;    // ISO date
  interests: string[];        // jsonb
  profilePhoto: string | null;
  favoriteColor: string;      // accent color (hex)
  avatar: string;             // emoji today; avatar config later (Phase 7)
  currentLevel: number;       // XP level (Phase 7; default 1)
  createdAt: string;
}
```
**Relationships:** belongs to one Family; has many Progress, Journal, Gratitude, Stamps,
StudentBadges, Projects, CookbookMemories.
**[Current]:** `config/family.ts` `Student` (id, name, age, emoji, color, interests, funFact).

## Teachers

```ts
interface Teacher {
  id: string;
  name: string;
  email: string;
  biography: string | null;
  timezone: string;
  profilePhoto: string | null;
  createdAt: string;
}
```
**[Target]** join table `teacher_families(teacher_id, family_id, role)` links teachers to
client families. **[Current]:** `teacherName` string in `config/family.ts`.

## Lessons

```ts
interface LessonRecord {
  id: string;
  title: string;
  episodeNumber: number;      // = current `order`
  world: string;              // FK → worlds.id, e.g. "discover-the-philippines"
  season: string;             // e.g. "season-1"
  unit: string;               // e.g. "unit-1-welcome"
  category: string;
  description: string;        // = current `subtitle`
  estimatedDuration: string;
  canvaPresentation: string;  // = current `canvaLink`
  videoLinks: { label: string; url: string }[];   // jsonb
  activities: unknown[];      // jsonb — sections, phrases, games (current `sections`/`phrases`)
  reflectionQuestions: string[];                  // current `reflection` + `gratitudePrompt`
  badgeReward: string | null; // FK → badges.id (suggested badge)
  passportStamp: string | null; // FK → destinations.id (current `destinationId`)
  createdAt: string;
}
```
**[Current]:** `config/lessons.ts` `Lesson` (9 lessons shipped). World/season/unit are
implicit today (one world); they become columns at migration.

## Student Progress

```ts
interface StudentProgress {
  id: string;
  studentId: string;          // FK → students.id
  lessonId: string;           // FK → lessons.id
  completed: boolean;
  completedDate: string | null;
  score: number | null;       // gentle-quiz results only; NEVER shown as a grade to children
  notes: string | null;
  teacherComments: string | null;
}
```
**[Current]:** `wjos:completions` — `{lessonId, studentId, date}[]` (completed implied true).

## Gratitude Journal

```ts
interface GratitudeRecord {
  id: string;
  studentId: string;
  lessonId: string | null;    // which class day it belonged to, when known
  gratitudeText: string;
  date: string;
  mood: string | null;        // optional emoji mood (future)
  createdAt: string;
}
```
**[Current]:** `wjos:gratitude` — `{id, studentId, date, prompt, text}[]`. The chosen
prompt is kept at migration (add a `prompt` column — it's meaningful history).

## Prayer Rotation

```ts
interface PrayerRotationRecord {
  id: string;
  lessonDate: string;
  prayerLeader: string;
  completed: boolean;         // "a prayer happened", never who/how — see note
}
```
**[Current]: deliberately stateless** — the leader is computed from the date
(`rotation[dayOfYear % length]`, Decision 006). This table exists in the Target schema only
to *display* history; per AI_BEHAVIOR.md §9 the platform never tracks or scores prayer
participation. Consider never implementing `completed` at all.

## Family Blessings Wall

```ts
interface BlessingWallEntry {
  id: string;
  studentId: string;
  blessing: string;
  date: string;
}
```
**[Current]:** a **view over `wjos:gratitude`**, not a separate store — one write, three
displays (Journal, Garden, Wall). Keep it a database **view** at migration; do not
duplicate the data.

## Journal Entries

```ts
interface JournalRecord {
  id: string;
  studentId: string;
  lessonId: string | null;
  title: string;
  reflection: string;
  drawingPlaceholder: string | null;  // upload URL (future)
  photoPlaceholder: string | null;
  createdAt: string;
}
```
**[Current]:** `wjos:journal` — `{id, studentId, date, title, text}[]`.

## Recipes

```ts
interface RecipeRecord {
  id: string;
  title: string;
  category: string;           // Cooking | Baking | No-Bake
  ingredients: string[];      // includes measurements (jsonb)
  tools: string[];
  measurements: string | null; // separate column if ever split from ingredients
  instructions: string[];     // steps; "ADULT JOB:" prefix is meaningful data
  vocabulary: { word: string; meaning: string; language: string }[]; // jsonb
  safetyNotes: string[];
  cultureNotes: string;
  imagePlaceholder: string;   // photo description → photo URL when real photos land
}
```
**[Current]:** `config/recipes.ts` `Recipe` (12 shipped) — plus `discussionQuestion`, which
migrates as an extra column (family table-talk is core content).

## Cookbook Memories

```ts
interface CookbookMemoryRecord {
  id: string;
  recipeId: string;
  studentId: string | null;   // null = whole-family memory
  familyPhoto: string | null; // storage URL (MVP: single photo data URL)
  foodPhoto: string | null;
  reflection: string;         // student reflection
  teacherComment: string | null;  // [Target] — planned field
  parentComment: string | null;   // = current `memory`
  completedDate: string;
}
```
**[Current]:** `wjos:cookbook` — `{id, recipeId, date, cookNames, photo, memory, reflection}[]`.
`cookNames` (who cooked) is kept at migration — it's the best part of the memory.

## Destinations

```ts
interface DestinationRecord {
  id: string;
  country: string;
  region: string;             // Luzon | Visayas | Mindanao | Nationwide
  province: string | null;
  city: string | null;
  destinationName: string;
  description: string;        // = current `knownFor`
  history: string | null;
  animals: string[] | null;
  food: string[] | null;
  language: string | null;    // local language note
  map: string | null;         // Google Earth / map URL
  photos: string[] | null;
  videoLinks: { label: string; url: string }[] | null;
}
```
**[Current]:** `config/destinations.ts` (12 shipped: id, name, region, emoji, knownFor, funFact).

## Passport Stamps

```ts
interface PassportStamp {
  id: string;
  studentId: string;
  destinationId: string;
  earnedDate: string;
}
```
**[Current]: derived, not stored** — stamps are computed from `wjos:completions` joined to
each lesson's `destinationId` (Decision 014). At migration this becomes a database view or
is materialized by a trigger on progress-insert. **Do not create a second source of truth.**

## Badges

```ts
interface BadgeRecord {
  id: string;
  title: string;
  description: string;
  icon: string;               // emoji today; asset URL later
  xpValue: number;            // Phase 7; default 0
  category: string | null;    // language | cooking | character | travel...
}
```
**[Current]:** `config/badges.ts` (10 shipped).

## Student Badges

```ts
interface StudentBadge {
  id: string;
  studentId: string;
  badgeId: string;
  earnedDate: string;
  note: string | null;        // teacher's personal note — kept from MVP
}
```
**[Current]:** `wjos:awards` — `{id, badgeId, studentId, date, note}[]`.

## Celebrations

```ts
interface CelebrationRecord {
  id: string;
  familyId: string;
  title: string;
  celebrationType: "Birthday" | "Anniversary" | "Milestone" | "Graduation" | "FamilyEvent";
  date: string;               // month/day (recurring) or full date (one-time)
  notes: string;
}
```
**[Current]:** `config/celebrations.ts` — `{id, name, studentId?, type: "birthday"|"family", month, day, emoji, note}`.
The Target adds more types; recurring month/day vs one-time full-date is preserved.

## Birthday Messages

```ts
interface BirthdayMessage {
  id: string;
  studentId: string;
  message: string;
  author: string;             // family member name
  date: string;
}
```
**[Target]** (Phase 3 — birthday memory gallery). No Current store yet; the pop-up
dismissal (`wjos:birthdayDismissed`) is UI state, not a message.

## Family Gallery

```ts
interface GalleryItem {
  id: string;
  familyId: string;
  photo: string;              // storage URL
  caption: string;
  category: "Cooking" | "Baking" | "Travel" | "Crafts" | "Lessons" | "Projects" | "Birthdays";
  uploadDate: string;
}
```
**[Target]** (Phase 3 — Memory Album aggregates this + cookbook + journals). Cookbook
photos are today's only Current photo store.

## Projects

```ts
interface ProjectRecord {
  id: string;
  lessonId: string | null;
  studentId: string;
  title: string;
  description: string;
  uploadedPhoto: string | null;
  uploadedVideo: string | null;
  teacherFeedback: string | null;
  parentFeedback: string | null;
}
```
**[Target]** (Phase 3 — Project Gallery; matches `ProjectSubmission` in ARCHITECTURE.md §6).

## Resources

```ts
interface ResourceRecord {
  id: string;
  title: string;
  category: string;
  resourceType: "Video" | "Article" | "Recipe" | "PDF" | "Worksheet" | "Canva" | "GoogleEarth" | "Website" | "Printable" | "Presentation";
  url: string;
  thumbnail: string | null;
  description: string;
}
```
**[Current]:** `config/resources.ts` (8 shipped; types Video/Website/Printable/Presentation —
the Target union is a superset).

## Class Prep Emails

```ts
interface ClassPrepEmailRecord {
  id: string;
  lessonId: string;
  familyId: string;
  subject: string;
  body: string;
  materials: string[];
  ingredients: string[];
  craftSupplies: string[];
  generatedDate: string;
  sentStatus: "draft" | "copied" | "sent";
}
```
**[Current]:** generated on demand by `buildEmail(lesson)` — nothing stored (copy-only MVP,
Decision 016). This table lands with email automation (Phase 4).

---

# Relationships (ERD)

```
ORGANIZATIONS ──< TEACHERS ──< teacher_families >── FAMILIES        [Target]
                                                       │
                                                       ├──< STUDENTS
                                                       │       ├──< STUDENT_PROGRESS >── LESSONS ──> WORLDS
                                                       │       ├──< GRATITUDE_JOURNAL (view: BLESSINGS_WALL)
                                                       │       ├──< JOURNAL_ENTRIES
                                                       │       ├──< STUDENT_BADGES >── BADGES
                                                       │       ├──< PASSPORT_STAMPS >── DESTINATIONS   (derived from progress)
                                                       │       ├──< COOKBOOK_MEMORIES >── RECIPES
                                                       │       ├──< PROJECTS >── LESSONS
                                                       │       └──< BIRTHDAY_MESSAGES
                                                       ├──< CELEBRATIONS
                                                       ├──< FAMILY_GALLERY
                                                       └──< CLASS_PREP_EMAILS >── LESSONS

LESSONS ──> DESTINATIONS (passportStamp)   LESSONS ──> RECIPES (recipeId)
LESSONS ──> BADGES (badgeReward)           RESOURCES (platform/world-scoped)
```

Legend: `──<` one-to-many · `>──` many-to-one · `>── <` junction table.
Content entities (Worlds, Lessons, Recipes, Destinations, Badges, Resources) are
platform data; everything under FAMILIES is tenant data.

---

# MVP Storage Strategy **[Current — shipping]**

Version 1 uses **localStorage**, one key per collection, JSON-serialized, accessed **only**
through `src/lib/storage.ts` (Decision 030).

> **Naming note:** the shipped namespace is **`wjos:`** (e.g. `wjos:gratitude`), not the
> `wj_` prefix sketched in early planning — same design, one canonical spelling. Logged
> here to prevent a rename churn; the prefix is a constant in `storage.ts`.

| Key | Collection | Target table |
|---|---|---|
| `wjos:mode` | UI state (active mode) | — (client state) |
| `wjos:activeStudent` | UI state (selected student) | — (client state) |
| `wjos:gratitude` | GratitudeEntry[] | `gratitude_journal` (+ `blessings_wall` view) |
| `wjos:journal` | JournalEntry[] | `journal_entries` |
| `wjos:completions` | LessonCompletion[] | `student_progress` (+ derives `passport_stamps`) |
| `wjos:awards` | AwardedBadge[] | `student_badges` |
| `wjos:cookbook` | CookbookMemory[] | `cookbook_memories` |
| `wjos:birthdayDismissed` | UI state | — (client state) |
| *(planned)* `wjos:projects` | ProjectSubmission[] | `projects` |
| *(planned)* `wjos:gallery` | GalleryItem[] | `family_gallery` |
| *(planned)* `wjos:emailDrafts` | ClassPrepEmail[] | `class_prep_emails` |

Static content (students, lessons, recipes, destinations, badges, celebrations, resources)
lives in `src/config/` — it is the MVP's stand-in for the platform-content tables
(`students`, `lessons`, `recipes`, `destinations`, `badges`, `celebrations`, `resources`).

---

# Future Supabase Migration

Designed so migration is a **re-implementation of one module** (`lib/storage.ts`), not an
app rewrite (ARCHITECTURE.md §8):

1. **Create tables** from the Target schema (snake_case columns, uuid PKs, `family_id` on
   tenant tables).
2. **Config → seed rows:** each `config/*.ts` file inserts into its content table;
   `config/family.ts` becomes the first `families` + `students` rows.
3. **Storage seam swap:** `readStored`/`writeStored` become async Supabase queries; the
   `useStored` hook keeps its signature (add loading state).
4. **One-time import screen:** "Bring my memories" reads every `wjos:*` key from the
   browser and uploads it — the family loses nothing (Decision 030 review note).
5. **Views, not duplicates:** Blessings Wall and Passport Stamps are SQL views/triggers
   over gratitude and progress — same single-source-of-truth rule as the MVP.

Field mappings that need care: `cookbook.memory` → `parent_comment`; `cookbook.cookNames`
→ new `cook_names` column; `gratitude.prompt` → keep as column; lesson `order` →
`episode_number`; celebrations month/day → recurring-date representation.

---

# Security Considerations **[Target]**

- **Authentication:** Supabase Auth; one auth user per parent/teacher (children act under
  the family session — no child accounts/emails).
- **Family isolation:** Row Level Security on every tenant table:
  `family_id = auth.family_id()` — a family can never read another family's rows.
- **Row Level Security roles:** teacher policies grant read on linked families
  (`teacher_families`), write on progress/badges/comments only.
- **Secure uploads:** Supabase Storage buckets per family; signed URLs; photos of children
  are never public.
- **Teacher permissions:** manage content + records for linked families only.
- **Parent permissions:** full read of own family; write on family-authored records
  (journals stay editable by their student author + parents).
- **MVP note [Current]:** localStorage means data never leaves the device — isolation by
  physics. The modes toggle is UI-only (ARCHITECTURE.md §5) and acceptable exactly until
  multi-family hosting begins.

---

# Data Validation

Enforced in TypeScript today (config is type-checked at build), and as DB constraints at
migration:

| Rule | Current enforcement | Target enforcement |
|---|---|---|
| Birthday must be a valid date | `month: 1–12, day: 1–31` in config types | `CHECK` constraint / date column |
| Lesson must belong to a world | implicit (single world) | `world_id NOT NULL` FK |
| Student must belong to a family | implicit (single family) | `family_id NOT NULL` FK |
| Journal cannot have empty reflection | save buttons disabled on empty text | `CHECK (length(trim(reflection)) > 0)` |
| Recipe must have ingredients | required non-empty array in `Recipe` type | `CHECK (jsonb_array_length(ingredients) > 0)` |
| Gratitude entry needs a student + text | UI requires student selection + text | `NOT NULL` FKs + CHECK |
| Passport stamp requires completed lesson | derived from completions (can't disagree) | trigger/view over `student_progress` |
| Photos within size budget | client-side shrink ≤900px JPEG (Decision 035) | Storage bucket size policy |

---

# Backup Strategy

**[Current]:** data is single-device. Interim safeguard worth adding pre-migration: an
**Export / Import Family Data** button (single JSON file of all `wjos:*` keys) so the
family can keep a copy. *(Small feature; recommend for Phase 2.)*

**[Target]:** automatic daily backups (Supabase PITR) · cloud sync across the family's
devices · offline support (local cache + sync queue; localStorage experience becomes the
offline mode) · version history for journals and memories (soft-delete + revision rows —
never hard-delete a child's words by accident).

---

# Final Database Principle

> **The database should preserve not only educational progress but also family memories.**
>
> Wonder Journey OS is more than a learning platform. **It is a digital family legacy.**

Every schema decision is judged against that: gratitude keeps its prompt, cookbook keeps
who cooked, badges keep the teacher's note — because in ten years, those details *are* the
product.

---

*Wonder Journey OS — Data Architecture v1.0 · July 2026*
