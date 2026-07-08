# 🌺 Wonder Journey OS — Design System

**Product:** Wonder Journey OS
**First learning world:** Discover the Philippines: A Family Learning Adventure
**Tagline:** *Every lesson is an adventure. Every adventure becomes a memory.*

> **Status note:** This document defines the visual identity that is **already implemented**
> in the MVP (tokens in `src/app/globals.css`, component classes prefixed `wj-`) and the
> guidelines for everything built after it. Items tagged **[Future]** are design direction
> for features not yet shipped. When code and this document disagree, fix one of them.
>
> **v2.0 — Watercolor Storybook (July 2026, Decision 037):** the visual identity was
> rebuilt to match Sharon's Canva reference video ("Discover the Philippines Family
> Learning"). Signature elements: watercolor sky-blue paper background with grain texture,
> navy hand-lettered headings with thick white outlines (`.wj-outline`), paper-note cards
> with wobbly hand-drawn borders, periwinkle cloud-bubble cards with 📎 paperclips
> (`.wj-card-bubble`, `.wj-note`), yellow brush-stroke banners (`.wj-brush`), teal dot
> triplets (`.wj-dots`), sticker-style icons (`.wj-sticker`), and CSS palm fronds + doodles
> in the corners (`TropicalDecor`). Color values and fonts below reflect v2.

---

## 1. Design Philosophy

This is **not a corporate dashboard** and **not a generic LMS**. It is a
**Family Learning Adventure Platform**, and every screen answers to three feelings:

- A child opening it should feel: **"I am going on an adventure."**
- A parent opening it should feel: **"This was thoughtfully designed for our family."**
- The teacher opening it should feel: **"This is organized, beautiful, and easy to manage."**

The mood board: Disney storytelling · National Geographic Kids exploration · Canva premium
polish · Montessori calm · ClassDojo encouragement · a cozy homeschool classroom · a family
memory scrapbook · a travel adventure journal. All of that — **while staying clean,
readable, accessible, and professional.** Whimsy lives in color, copy, and small motion;
never in confusing layouts.

The anti-goal: anything that feels like "generic AI-generated dashboard" — gray sidebars,
dense tables, corporate blue, lorem-ipsum energy.

---

## 2. Design Principles

1. **Joy before complexity**
2. **Simple before overwhelming**
3. **Warm before corporate**
4. **Personal before generic**
5. **Guided before cluttered**
6. **Accessible before decorative**
7. **Story-driven before data-heavy**
8. **Family-centered before school-centered**

When two principles conflict, the one higher on the list wins. When in doubt, remove
something.

---

## 3. Brand Personality

Adventurous · gentle · warm · joyful · faith-friendly · creative · educational ·
trustworthy · child-safe · family-oriented.

Practical translation: bright but soft colors (nothing neon), rounded everything, emoji and
illustration used with intent, Scripture and prayer present but never pushy, zero dark
patterns, zero pressure mechanics (no streaks, no shame states, no countdown anxiety).

---

## 4. Color Palette

Tropical Philippines-inspired. **Single source of truth: the `@theme` tokens in
`src/app/globals.css`.** Never hardcode hex values in components — use token utilities
(`bg-mango`, `text-ocean-deep`, etc.).

### Primary Colors

| Name | Token | Hex | Role |
|---|---|---|---|
| Watercolor Sky | `sky` / `sky-deep` | `#c9dff2` / `#a5c6e6` | **App background** — layered watercolor washes |
| Ocean Teal | `ocean` / `ocean-deep` | `#2fb8ad` / `#14837c` | Trust, dots, secondary actions |
| Tropical Green | `palm` / `palm-deep` | `#4dbd85` / `#2e9563` | Nature, growth, leaves, success states |
| Sunshine Yellow | `mango` / `mango-deep` | `#ffd23f` / `#e5a917` | Brush-stroke banners, joy, highlights, focus rings |
| Coral | `sunset` / `sunset-deep` | `#ff7a59` / `#e4573b` | Primary action buttons, earned stamps |
| Cream / Paper | `sand` / `paper` | `#fdf5e0` / `#fffdf6` | Inner note fills / card surfaces |

### Accent Colors

| Name | Token | Hex | Role |
|---|---|---|---|
| Hibiscus Pink | `hibiscus` / `hibiscus-deep` | `#ec5d87` / `#cf3e6b` | Celebrations, love, birthday moments |
| Periwinkle | `ube` / `ube-deep` | `#8890d6` / `#656fc0` | **Cloud-bubble cards** (the reference's activity cards), prayer accents |
| Soft Border Blue | `sand-deep` | `#c9d9ee` | Card borders, dividers, soft fills |
| Lagoon / Leaf tints | `ocean`, `palm` @ `/5–/20` | — | Calm tinted sections, garden fills |
| Navy Ink / Soft Navy | `ink` / `ink-soft` | `#274472` / `#5d76a3` | **All text** — navy like the reference headings, never black/gray |

### Functional Colors

| State | Token | Usage |
|---|---|---|
| Success | `palm` / `palm-deep` | "Completed", "We made this!", matched game pairs |
| Warning | `mango` / `mango-deep` | Safety reminders, "don't forget" notes |
| Error | `hibiscus` (soft) / `sunset-deep` | Wrong match flash, gentle failure — never harsh red |
| Info | `ocean` | Tips, cultural notes, teacher hints |

### Usage rules

- **Ocean Blue** = trust: navigation states, section headings, secondary buttons.
- **Sunshine Yellow** = joy: highlights, chips, focus glow — small doses, high impact.
- **Tropical Green** = growth: progress, gardens, completion.
- **Coral Orange** = action: the one primary button per section (§6).
- **Warm Sand + Cream White** = every background. White cards float on cream; no pure white pages, no gray.
- **Mango Yellow** = badges and celebration accents.
- **Soft Sky gradient** = calm sections (Morning Blessings, Today's hero).
- Deep variants are for text/borders on light fills; base variants for fills/gradients.
- Backgrounds use token opacity modifiers (`bg-hibiscus/15`), keeping tints consistent.

---

## 5. Typography

**Fonts [Current — v2]:** **Lilita One** (display — the bold rounded hand-lettered look of
the reference video's headings) for headings and buttons; **Quicksand** (body — soft,
rounded, highly readable) for everything else; **Patrick Hand** (`.font-hand`) for
handwritten accents — page subtitles, taglines, journal-flavored copy. Loaded at runtime
via `<link>` with graceful fallback to Segoe UI. Big titles add `.wj-outline` — navy fill
with a thick white stroke, the signature look of the reference slides.

Rules:

- Large, readable headings; friendly and rounded, never formal serif or condensed corporate faces.
- Playful accents (emoji in headings) are welcome **sparingly** — one per heading.
- Body text stays highly readable: Nunito 400–700, generous line-height, warm ink color.
- **Children's pages run bigger** (cards use `text-xl`+ titles, large tap targets); parent/teacher pages may use denser, cleaner scales but the same faces.

### Type scale

| Level | Classes | Use |
|---|---|---|
| Hero title | `text-4xl sm:text-5xl font-display font-extrabold` | Welcome page brand |
| Page title | `text-3xl sm:text-4xl font-display font-extrabold` | `PageHeader` on every page |
| Section title | `text-xl–2xl font-display font-extrabold` | Card group headings |
| Card title | `text-lg–xl font-display font-extrabold` | Lesson/recipe/student cards |
| Body text | `text-base` Nunito, `text-ink` | Paragraphs, lesson content |
| Caption | `text-xs–sm text-ink-soft` | Dates, hints, metadata |
| Button text | `font-display font-bold text-sm–base` | All `wj-btn` variants |

---

## 6. Layout System

- **Mobile-first.** Base styles are the phone layout; `sm:`/`lg:` add columns.
- **Responsive grid:** content in a centered `max-w-6xl` column; cards in `grid gap-4 sm:grid-cols-2 lg:grid-cols-3/4`.
- **Generous spacing:** `space-y-6` between page sections, `p-5–8` inside cards. Whitespace is a feature.
- **Rounded cards:** every surface is `wj-card` — radius `--radius-blob` (1.75rem), soft warm shadow, hairline warm border.
- **Clear section grouping:** one idea per card; sections separated by space, not lines.
- **One primary action per section:** a single coral `wj-btn`; everything else is ghost/ocean/chip.
- **Avoid crowding:** if a card needs three buttons, split the card.
- **Tabs for depth** (Journal: Garden/Wall/Journal · Languages: List/Cards/Game) instead of long pages.
- **Cards for children, dashboards for grown-ups:** student screens are big friendly cards; parent/teacher screens are stat blocks + lists — same tokens, denser rhythm.

---

## 7. Navigation Design

**[Current]:** sticky warm header (brand + student chip + mode toggle) with a horizontally
scrollable pill nav, filtered per mode by `config/navigation.ts`. Simple, one level, no
dropdowns.

Canonical destinations per mode (labels may evolve; keep counts low — if a mode needs more
than ~10 items, merge pages instead):

- **Student:** Adventure Home · Today's Adventure · Morning Blessings · Travel Passport · Languages · Cooking & Baking · Cookbook · Games *(lives inside Languages for now)* · Journal · Awards
- **Parent:** Parent Home · Weekly Plan · Supplies *(inside Parent Home)* · Progress · Journals · Cookbook · Family Celebrations · Class Prep
- **Teacher:** Teacher Studio · Lessons · Students *(inside Studio)* · Resources · Class Prep Email · Awards · Journals · Cookbook · Celebrations

Active item = filled coral pill; inactive = white pill. Never bury a child's feature behind
a grown-up menu.

---

## 8. Student Interface Style

Magical and simple. **Use:** large tappable cards; friendly emoji-first icons; passport
stamps; badges; mascots **[Future]**; encouraging messages everywhere ("Magaling! Great
job!"); colorful gradient section headers; progress shown as collections (flowers, stamps,
badges) rather than percentages; gentle animations (§28).

**Avoid:** more than one menu level; long paragraphs (lesson sections stay short, bullets
star-prefixed); boring data tables (the word table is the one allowed exception — it's a
learning tool with emoji and color); complex forms (max: one picker + one text box + one
button).

---

## 9. Parent Interface Style

Calm and organized. **Use:** weekly plan cards, supply/ingredient checklists, per-child
progress cards (4 friendly stat tiles: Lessons/Blessings/Journal/Badges), journal previews,
cookbook memory previews, birthday reminders, class prep summaries.

Within 10 seconds a parent should know: **what today's lesson is → what to prepare → how
each child is doing → what memories were made.** The Parent Portal page order encodes
exactly that.

---

## 10. Teacher Interface Style

Practical and efficient. **Use:** a clear dashboard (students → lesson plan → quick
actions → recent activity), quick-action buttons (Class Prep Email one click away),
editable cards *(MVP: edit via config; UI editing is [Future])*, copy-ready email blocks,
lesson overview rows with Canva/Video/Open links, student progress summaries, resource
cards. Config-edit hints appear as gentle sand-colored footnotes so Sharon always knows
where content lives. The teacher should be able to prep a class in minutes.

---

## 11. Morning Blessings Design

Peaceful, gentle, reflective — the visual **dawn** of each class day.

- Sunrise mood: 🌅 header, Soft Sky gradients, extra whitespace, centered column.
- Main prompt, always verbatim: **"What are you grateful to the Lord for today?"**
- Three sentence-starter buttons (never a blank intimidating box).
- Saving = **"Plant this blessing 🌱"** → a flower blooms in the Gratitude Garden.
- Calm typography, no timers, no streaks, no skipped-day guilt. Sincerity, not pressure.
- Flower illustrations **[Future: illustrated set]** — flower emoji today.

---

## 12. Prayer Leader Design

Gentle and optional, in calm ube purple. The card shows: today's leader (🌟 + name), a soft
icon (🕊️), and the required wording verbatim:

> *"If you feel comfortable, you may lead us in a short opening prayer. If not, another
> family member or Teacher Sharon can lead."*

"Family Choice" and "Teacher Sharon" are full members of the rotation. Below: prayer idea
chips and tomorrow's leader preview. **Never** track, score, streak, or badge prayer
automatically — the design must make declining feel completely safe.

---

## 13. Today's Adventure Design

The most exciting screen — **starting an episode, not opening a lesson.**

**[Current]:** sunrise gradient hero with the child's name in Tagalog greeting; blessing
status chip ("Start here first" → "✅ Done today"); prayer leader card; today's lesson as an
adventure card with **"Start the Adventure 🚀"**; next-celebration teaser.

**[Future] episode layout:** mission card ("Today's mission: learn 3 greetings!"),
destination preview (map thumbnail + stamp to be earned), vocabulary preview (3 word chips),
activity preview (game/recipe icon), reward preview (badge/stamp silhouette). Order on the
page = order of the class: Blessing → Prayer → Adventure.

---

## 14. Travel Passport Design

Collectible and tactile — a real passport book feeling.

**[Current]:** `wj-stamp` — dashed rotated border, passport-blue when unearned (❔ "not yet
visited"), coral/mango when earned ("★ STAMPED ★"), grouped by region (Philippines → Luzon
→ Visayas → Mindanao), fun fact revealed only after earning (discovery reward).

**[Future]:** page-turn passport book layout, map view with pins, travel tickets and
postcards as memory items, suitcase/sticker decorations, and a satisfying **stamp-slam
animation** when a stamp is earned. Destinations must always feel collectible — show the
locked ones to spark curiosity, never hide them.

---

## 15. Cooking & Baking Studio Design

Warm, family-cookbook feeling. **Use:** recipe cards with photo area (real-photo
placeholders today — §31), type/difficulty/time chips, ingredient and tool cards, tap-to-
check step cards with numbered coral/green circles, **"ADULT JOB"** steps clearly marked,
safety reminders as a 🛟 badge list, copyable shopping list card, kitchen-word cards in both
languages, cultural note + family table-talk question on a tinted card, apron/tools icons
**[Future: illustrated set]**.

The page reads top-to-bottom in cooking order: shop → prep → cook → talk → remember.

---

## 16. Family Cookbook Design

A treasured memory album, not a database. **Use:** scrapbook-style memory cards (photo on
top like a mounted print, then title + date chip + "who cooked" + memory note on sand +
reflection on lagoon tint), warm empty state ("The first page is waiting!"), **Add Photo**
and **Add Reflection** actions phrased as memory-making, "Make it again →" links,
printable cookbook preview **[Future]** — the end-of-year artifact: a real family cookbook
PDF. Deleting a memory is quiet, small, and asks first. Nothing here should feel technical.

---

## 17. Gratitude Garden Design

A living visual: **every gratitude entry blooms a flower.** 🌸🌻🌺🌼🌷🪻🌹💐 cycle on a
soft green gradient bed; hovering a flower reveals the blessing and who planted it; empty
state is a single 🌱 sprout. Students see their own garden; parents see the family's.
**[Future]:** vines/leaves for journal entries, garden growth stages as entries accumulate,
seasonal blooms. Peaceful colors only — the garden is a place to feel glad, not a scoreboard.

---

## 18. Family Blessings Wall Design

A shared wall of family gratitude — each entry a warm note card: child's avatar dot in
their personal color, **name**, date, the chosen prompt in soft italics, then the gratitude
text. Stacked chronologically like notes pinned to a kitchen corkboard. **[Future]:**
postcard/leaf-shaped variants and a printable "wall" for the real refrigerator.

---

## 19. Family Celebrations Design

Joyful but not cluttered — hibiscus/ube palette. **Use:** a hero countdown card for the
next celebration (big number in a white pill), a calendar list with per-person color
borders and countdown chips (highlighted within 7 days), blessing notes, celebration
badges, and the pop-up replay button. Confetti and balloons belong to the **pop-up moment**
(§20), not the everyday calendar. Birthday memories (photos + messages) collect into a
gallery **[Future]**.

---

## 20. Birthday Pop-Up Design

Appears once per day, immediately after login on a family birthday:

- **"Happy Birthday, [Name]!"** in hibiscus display type
- 🎈 floating balloons (`wj-balloon` bob animation) and 🎂 cake between them
- 🎊 CSS confetti rain in the six brand colors (`wj-confetti`)
- The warm birthday blessing from config + *"Maligayang kaarawan!"*
- One button: **"Continue to Adventure Home ✨"** (coral, springs in via `wj-pop-in`)
- **[Future]:** automatic birthday badge award; "write a birthday message" box that saves
  into the Celebrations memory gallery.

Joy with restraint: one overlay, dismissible instantly, honors reduced motion (§29).

---

## 21. Awards and Badges Design

Collectible, never competitive. **[Current]:** earned badges as rounded mango-bordered
cards (emoji, name, date, teacher's note in italics); the full collection shown below in
neutral "to collect" state — visible but not nagging; per-child sections with personal
colors. **[Future]:** circular badge medallions with shiny accents, lock/unlock states, and
an unlock animation (scale-up + confetti wisp).

Badge vocabulary (extend in `config/badges.ts`): Language Explorer · Hiligaynon Helper ·
Travel Adventurer · Cooking Star · Baking Buddy · Culture Learner · Kindness Champion ·
Grateful Heart · Creative Builder · Animal Explorer · Great Listener — alongside the ten
shipped badges. Names always celebrate character or effort, never rank children.

---

## 22. Games and Quiz Design

Playful, never test-like. **[Current — matching game & flashcards]:** large colorful answer
cards; instant feedback (mango glow = selected, soft hibiscus pulse = try again, green ✅ =
matched); "Tries" counter framed as curiosity, not score; win state = **"Magaling! (Great
job!)"** celebration card with "Play again 🔄".

Rules for all future games/quizzes: big tap targets; wrong answers get gentle color + retry,
never buzzers or red X's; encouraging copy on every outcome; celebration animation on
completion; no leaderboards between siblings; no time pressure unless the child opts in.

---

## 23. Journal Design

Notebook feeling: soft white cards with date labels and the writer's avatar/color, prompt
starters so no child faces a blank page, simple writing boxes (`wj-input`), sticky-note and
lined-paper textures **[Future]**.

Prompt set (extend in config): *Today I learned...* · *My favorite part was...* · *One new
Tagalog word...* · *One new Hiligaynon word...* · *One thing I am grateful to the Lord
for...* · *One thing I want to learn next...*

Save button says **"Save entry 💾"** — future copy upgrade: **"Save My Reflection"** (§32).

---

## 24. Resource Library Design

Organized by category headings (Discover the Philippines · Languages · Family Values ·
Cooking & Baking · Class Materials), each resource a card: emoji, title, type chip
(Video/Website/Printable/Presentation), one-line description, opens in a new tab.
**[Future]:** "Recommended for today" section driven by today's lesson; watch/read buttons;
thumbnail previews. Never dump an unsorted link list — if a category exceeds ~6 items, add
sub-grouping or search.

---

## 25. Class Prep Email Design

Clean and practical: lesson picker → live preview in a sand-colored `<pre>` block styled as
a letter → prominent **Copy** button with "Copied! ✅" confirmation. The email itself
carries the brand voice (🌺 subject, "Salamat!", tagline signature). **[Future]:** editable
fields before copying, "mark as sent" toggle, email history list, materials checklist with
checkboxes, then full send automation (see ARCHITECTURE.md §15).

---

## 26. Icons and Illustrations

**[Current]:** emoji as the icon system — consistent, colorful, zero-weight, and instantly
readable by children. One emoji per concept, used consistently (🌺 brand · 🛂 passport ·
🥭 cooking · 📖 cookbook · 🙏 blessings · 🏅 awards · 🎉 celebrations · 🎬 resources).

**[Future]** custom illustration set, in one consistent style (soft rounded shapes, warm
palette, hand-drawn feel): palm tree, passport, map, suitcase, spoon/fork, mixing bowl,
book, flower, heart, star, badge, cake, gift, journal, animal paw, mountain, ocean wave.

**Rule:** never mix illustration styles on one screen. Emoji-only until the custom set
exists — no clip-art, no stock icon packs mid-transition.

---

## 27. Mascot Guidelines **[Future]**

Candidate mascots: **Tala the Turtle** 🐢 · **Kiko the Tarsier** (Bohol's tiny star) ·
**Lila the Parrot** · **Mangga the Mango** · **Isla the Flower**.

Rules when introduced: mascots are **optional guides**, not decoration on every card — they
appear to welcome, encourage after effort, and celebrate milestones; one mascot per world
(Kiko is the natural Philippines pick); never gate content behind a mascot interaction;
keep them silent-friendly (no autoplay sound). Config-driven so a white-label client can
swap or disable them.

---

## 28. Animation and Motion Rules

Motion supports learning; it never performs for its own sake.

**Approved motions [Current]:** soft fade/spring-in (`wj-pop-in`), card hover lift
(`wj-card-hover`, −3px + shadow), button hover lift, flashcard 3D flip (`wj-flip`, 500ms),
balloon float (`wj-balloon`), birthday confetti (`wj-fall`), gratitude flower hover-grow.
**[Future]:** progress fill, badge unlock, passport stamp slam, gentle page transitions,
lesson-start transition.

**Timing:** micro-interactions 150–200ms; reveals ~400ms with a gentle spring; only
ambient loops (balloons) may repeat.

**Forbidden:** flashing lights, shaking, more than one attention animation at a time,
motion that blocks input, autoplaying loops on content cards, anything that punishes.

---

## 29. Accessibility Rules

- **Contrast:** body text is warm dark ink on cream (high contrast); deep color variants
  for text on tints; never light-on-light decorative text for content.
- **Readable sizes:** body ≥16px; children's interactive text larger.
- **Keyboard navigation:** every interactive element is a real `<button>`, `<a>`, or
  labeled input — all flows must work without a mouse.
- **Focus states:** visible mango glow (`wj-input:focus`); never remove outlines without
  replacement.
- **Alt text:** every meaningful image (cookbook photos use recipe names); decorative emoji
  stay decorative.
- **Reduced motion [Target]:** honor `prefers-reduced-motion` — disable confetti, balloons,
  and flips; keep fades. *(Small CSS addition — first item on the polish list.)*
- **Simple language:** short sentences, no jargon; a 7-year-old (Selah) must understand
  every student-facing label.
- **Clear button labels:** buttons say what happens ("Plant this blessing 🌱"), never just
  "OK"/"Submit".

---

## 30. Responsive Rules

| Breakpoint | Layout |
|---|---|
| **Mobile** (default) | Stacked cards, full-width buttons, scrollable pill nav, emoji-only mode toggle |
| **Tablet** (`sm:`) | Two-column card grids, mode toggle gains labels |
| **Desktop** (`lg:`) | 3–4 column grids, dashboard grids for parent/teacher; sidebar + content shell **[Future]** |

All primary flows — blessing → adventure → lesson → recipe → cookbook — must work
beautifully on laptop, tablet, **and a parent's phone propped in the kitchen** (a first-class
device for the Cooking Studio).

---

## 31. Image Guidelines

- **Food:** real food photography only. Current placeholders (emoji + written photo
  description on a warm gradient) are explicitly *"replace with a real photo"* slots for the
  teacher. **Never unrealistic AI-generated food.**
- **Travel:** beautiful real-location photos when added; same replaceable-placeholder
  approach until then.
- **Children & family:** **upload placeholders only — never stock or fake family photos.**
  The only faces in this app are the family's own uploads. Photos are shrunk client-side
  (≤900px JPEG) before storage and stay on-device in the MVP (a privacy feature — say so to
  parents).

---

## 32. Copywriting Tone

Warm · encouraging · simple · joyful · respectful · family-friendly. Filipino warmth is
part of the voice: *Magaling!* (great job), *Salamat!* (thank you), *Kain tayo!* (let's eat).

| ❌ Never | ✅ Instead |
|---|---|
| Submit response | **Save My Reflection** |
| Begin module | **Start Today's Adventure** |
| Assessment completed | **Great job, Explorer!** |
| Delete entry | remove *(small, quiet, asks first)* |
| Error: not found | *"That recipe wandered off to the market 🧺"* |
| 0 results | *"The first page is waiting!"* |

Rules: celebrate effort, not correctness; failure copy is gentle and blame-free; grown-up
pages may be more concise but never cold; faith language is warm and invitational, never
demanding.

---

## 33. UI Consistency Rules

Every page uses the **same**: card radius (`--radius-blob`), spacing scale (`space-y-6`
sections / `gap-4` grids / `p-5–8` cards), button system (`wj-btn` + variants only), icon
style (emoji, §26), color tokens (§4 — no ad-hoc hex), `PageHeader` (emoji + title +
subtitle), and layout logic (§6).

**No one-off designs.** A new visual pattern must either reuse an existing `wj-` class or
be added to `globals.css` + this document first, then used. If a screen looks like it
belongs to a different app, it's a defect.

---

## 34. Final Design Principle

> ## 🌺 The platform should feel like a joyful family adventure book brought to life —
> ## simple enough for children, meaningful enough for parents, and organized enough for the teacher.

Every design review ends with one question: *would this page make Selah smile, give Taylor
clarity, and save Sharon time?* If yes to all three, ship it.

---

*Wonder Journey OS — Discover the Philippines · Design System v1.0 · July 2026*
