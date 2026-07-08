# 🎓 Wonder Journey OS — Curriculum Framework

**The master curriculum blueprint.** This document defines the complete educational
curriculum for Wonder Journey OS and is the source AI uses to generate future lessons
automatically. It supports years of learning while remaining modular and customizable.

**Companion standards:** every lesson generated from this framework must follow
`CONTENT_GUIDELINES.md` (structure, tone, age fit) and land in the typed config models
defined in `ARCHITECTURE.md` §6.

**Legend:** ✅ episode shipped in the app · ⬜ planned

---

# Curriculum Philosophy

Children learn best through: **stories · adventure · curiosity · hands-on learning ·
cooking · baking · family participation · creativity · reflection · conversation ·
exploration.**

This should never feel like traditional school. It should feel like:

> **"A family adventure."**

---

# First Family

**Parents:** Shaun · Taylor
**Children:** Rylee (12) · Ezra (10) · Asa (9) · Selah (7)

The curriculum is designed around their interests while staying reusable for future
families (interests live in `config/family.ts`, never in lesson logic):

| Child | Interests to weave in | Natural units |
|---|---|---|
| Rylee | Sewing, embroidery, knitting, animals, hands-on | Units 5–6 crafts, Unit 6 animals, festival costume studies |
| Ezra | Cooking, history, Legos, miniatures, dioramas | Units 7–9, destination history, miniature village project |
| Asa | Building, outdoors, animals, vehicles | Units 6, 10, jeepney/bangka builds, nature challenges |
| Selah | Baking, miniature towns, drawing, toy figures | Unit 8, drawing reflections, miniature projects |

---

# Educational Goals

By completing the curriculum, children should:

1. Develop **confidence**
2. Learn **Filipino culture** from the inside
3. Speak **basic Tagalog**
4. Speak **basic Hiligaynon**
5. **Appreciate different cultures**
6. Develop **gratitude** as a daily habit
7. **Strengthen family relationships**
8. Develop **creativity**
9. Become **curious learners**
10. Build **confidence speaking** (aloud, in new languages)
11. Practice **leadership** (prayer leader, teaching parents, leading games)
12. **Learn through experience** — hands, kitchen, conversation, adventure

---

# Curriculum Structure

```
WORLDS            🇵🇭 Discover the Philippines, 🇯🇵 Discover Japan, ...
  └─ SEASONS      ~12-week arcs with a theme ("Our Great Philippine Adventure")
      └─ UNITS    Subject clusters (Let's Speak Tagalog, Animals of the Philippines)
          └─ EPISODES    Individual lessons — always "episodes," never "lessons" in child-facing copy
              └─ ACTIVITIES    Games, crafts, cooking, discussions inside an episode
                  └─ PROJECTS  Unit-closing family collaborations
```

Mapping to code: a **World** = a content pack of config files; a **Season** = a scheduled
sequence of episodes; an **Episode** = one `Lesson` object; **Activities** live inside the
lesson's sections/games/recipes; **Projects** = the unit's closing `familyChallenge`
writ large (future: `ProjectSubmission` gallery).

---

# World One — 🇵🇭 Discover the Philippines

## Season 1 — "Our Great Philippine Adventure" (~12 weeks)

Twelve units. Units 1–4 are the foundation (already underway — the four shipped episodes
live here). Units are modular: Sharon can reorder, stretch, or swap them per family.

---

### Unit 1 — Welcome to the Philippines

Episodes:
1. **Welcome Explorers** / The Philippine Map / The Flag — ✅ shipped as *"Welcome to the Philippines"* (islands, three regions, flag meaning, first greetings)
2. The National Symbols — ✅ shipped as *"Treasures of the Philippines"* (sampaguita, Philippine eagle, narra, carabao, jeepney)
3. Meet Teacher Sharon — ✅ shipped (her story, Negros Occidental, live interview episode)
4. Where I Live — ✅ shipped as *"Where I Live: Bago City"* (awards the Bago passport stamp)
5. Daily Life in the Philippines — ✅ shipped as *"A Day in a Filipino Kid's Life"* (mano po, sari-sari stores, street games, merienda)

### Unit 2 — Let's Speak Tagalog

Episodes: Greetings ✅ *(shipped combined with Hiligaynon — see Decision note below)* ·
Family words ⬜ · Colors ⬜ · Numbers ⬜ · Animals ⬜ · Food ⬜ · Daily Conversation ⬜ ·
Games, Songs, Role Play woven throughout.
*(Word sets for family/colors/numbers/animals/food/everyday already ship in
`config/languages.ts` with games — episodes wrap them in story.)*

### Unit 3 — Let's Speak Hiligaynon

Episodes: Greetings ✅ *(combined, as above)* · Simple Sentences ⬜ · Family ⬜ · Food ⬜ ·
Daily Conversation ⬜ · Fun Expressions ⬜ · Songs, Games, Role Play throughout.
Hiligaynon is a first-class language here — Teacher Sharon's home language, never a
footnote to Tagalog.

> **Decision note:** the MVP shipped greetings as **one bilingual episode**. This framework
> allows either shape; if Sharon prefers the split after teaching it, it's a config edit.
> Log the choice in `DECISIONS.md` (to be created).

### Unit 4 — Filipino Family Values

Episodes: Respect ✅ · Hospitality ✅ · Bayanihan ✅ *(shipped together as "Filipino Family
Values")* · Helping Others ⬜ · Gratitude ⬜ · Responsibility ⬜ · Kindness ⬜ · Sharing ⬜ ·
Humility ⬜ · Serving Others ⬜ · Stewardship ⬜ · Family Love ⬜

**Every values episode includes all five:** Story · Family Discussion · Reflection ·
Challenge · Real-life example. *(Values definitions with Scripture ship in
`config/values.ts`.)*

### Unit 5 — Explore the Philippines

Destination episodes: Luzon ⬜ · Visayas ⬜ · Mindanao ⬜ · Palawan ⬜ · Bohol ⬜ ·
Boracay ⬜ · Cebu ⬜ · Iloilo ⬜ · Negros ⬜ · Siargao ⬜ · Mayon ⬜ · Chocolate Hills ⬜ ·
Banaue ⬜ *(all 12 destinations already ship in `config/destinations.ts` with passport
stamps — episodes unlock them.)*

**Each destination episode includes:** Map · Food · Language · Animals · History · Culture ·
Nature · Travel Video · **Passport Stamp** · Craft · Recipe (when natural) · Journal.

### Unit 6 — Animals of the Philippines

Episodes: Tarsier ⬜ · Philippine Eagle ⬜ · Carabao ⬜ · Sea Turtle ⬜ · Whale Shark ⬜ ·
Tamaraw ⬜ · Monkeys ⬜ · Butterflies ⬜ · Birds ⬜ · Marine Life ⬜

**Each includes:** Videos · Fun Facts · Drawing (Selah!) · Craft (Rylee!) · Conservation
(stewardship of God's creation) · Reflection. *(Animal vocabulary in both languages
already ships in `config/languages.ts`.)*

### Unit 7 — Filipino Food Adventure

Recipe episodes: **Mango Float ✅ (shipped as Lesson 4)** · **Turon ✅ (shipped as Lesson 6, the first Friday cooking slot)** · Halo-Halo ⬜ ·
Chicken Adobo ⬜ · Pancit ⬜ · Lumpia ⬜ · Fruit Salad ⬜ · Banana Cue ⬜ · Puto ⬜ ·
Bibingka ⬜ *(all 12 recipes already ship in `config/recipes.ts` — episodes wrap them in
story and schedule.)*

**Each includes:** Shopping List · Recipe · Measurements · Tools · Safety · Vocabulary ·
Upload Photos · Cookbook Entry · Family Reflection.

### Unit 8 — Baking Academy

Episodes: Cookies ⬜ · Cupcakes ⬜ · Brownies ⬜ · Banana Bread ⬜ · Decorating ⬜ —
teaching **measuring, mixing, decorating, kitchen safety, creativity, patience, sharing.**
Selah's unit — and everyone bakes. Family participation always.

### Unit 9 — Festivals of the Philippines

Episodes: MassKara (Bacolod — Negros, near home!) ⬜ · Ati-Atihan ⬜ · Dinagyang (Iloilo) ⬜ ·
Panagbenga ⬜ · Pahiyas ⬜ · Kadayawan ⬜

**Presented from historical and cultural perspectives:** History · Traditional clothing
(Rylee: costume & embroidery study) · Music · Dance · Food · Community.
**Per the family's stated beliefs:** activities center on shared human elements — food,
music, craft, community, bayanihan; religious observance is described respectfully as
history and culture, never assigned as activity. No Christmas/Easter crafts; the family's
seasonal rhythm follows biblical Feast Days.

### Unit 10 — Nature Explorer

Episodes: Rainforests ⬜ · Mountains ⬜ · Beaches ⬜ · Volcanoes ⬜ · Rivers ⬜ ·
Coral Reefs ⬜ · National Parks ⬜ · Conservation ⬜ — framed throughout as exploring and
stewarding **God's creation** (Asa's unit: outdoors, expedition-style challenges).

### Unit 11 — Character Journey

Episodes: Gratitude ⬜ · Kindness ⬜ · Serving Others ⬜ · Helping Family ⬜ ·
Responsibility ⬜ · Forgiveness ⬜ · Patience ⬜ · Courage ⬜ · Honesty ⬜ · Respect ⬜

**Each includes:** Morning Blessings · Story · Discussion · Family Challenge · Reflection ·
Prayer (optional, always). This unit deepens Unit 4 from *knowing* values to *living* them.

### Unit 12 — Academic Adventure

Episodes: English ⬜ · Reading ⬜ · Vocabulary ⬜ · Study Skills ⬜ · Homework Help ⬜ ·
Spelling ⬜ · Times Tables ⬜ · Critical Thinking ⬜

**Sequencing rule: only introduce after the cultural foundation is established** (Units
1–4 minimum). Even here, the adventure voice holds — times tables through market-day
pricing games, spelling through Filipino loanwords.

---

# Standard Lesson Flow

Every episode follows this order (per CONTENT_GUIDELINES.md; steps 1–3 are the platform's
daily frame):

**1. Welcome → 2. Morning Blessings** ("What are you grateful to the Lord for today?") **→
3. Prayer Leader** (optional) **→ 4. Today's Mission → 5. Story → 6. Learning →
7. Interactive Game → 8. Hands-on Activity → 9. Family Challenge → 10. Reflection →
11. Reward → 12. Passport Stamp**

---

# Weekly Schedule

Per Shaun's proposed class schedule:

| Day | Focus |
|---|---|
| **Monday** | Language + Culture |
| **Tuesday** | Travel + Geography |
| **Friday** | Cooking / Baking / Family Project |

> ⚠️ **Sync note for Sharon:** the shipped lesson dates in `config/lessons.ts` currently
> fall on **Mon (Jul 13) / Wed (Jul 15) / Fri (Jul 17) / Mon (Jul 20)** — a Mon/Wed/Fri
> rhythm. This framework says **Mon/Tue/Fri**. Confirm the real schedule with Shaun and
> align the config dates (a 2-minute edit). Whichever wins, record it in `DECISIONS.md`.

---

# Long-Term Learning Progression

| Year | World focus |
|---|---|
| **Year 1** | 🇵🇭 The Philippines (Seasons 1–3: Adventure → Deep Dive → Celebration) |
| **Year 2** | 🌏 Asia (Japan, Korea, and neighbors — the Philippines as home base for comparison) |
| **Year 3** | 🌎 Around the World |
| **Year 4** | 📚 Advanced Academics (study skills, research, presentations — adventure-framed) |

Everything is modular: Sharon can rearrange, stretch, or replace units per family. A
family that loves cooking gets more Unit 7/8; an animal-loving family front-loads Unit 6.
The unit is the unit of customization.

---

# Assessments

**Low-pressure only.** Progress is observed through what children make and say, not what
they score: games · gentle quizzes · family projects · cooking results · presentations
("teach Mom three words") · role play · journal reflections · crafts · photo uploads.

**No traditional exams unless a family requests them.** Per DESIGN_SYSTEM.md: no grades,
no red X's, no sibling rankings. The teacher's dashboard shows participation and
collections (stamps, badges, entries) — evidence of adventure, not test data.

---

# Family Projects

**Every unit ends with a collaborative project** — the unit's memory-maker:

- Create a travel poster (Unit 5)
- Cook a family feast (Unit 7)
- Build a scrapbook page (any unit → Memory Album)
- Teach a Tagalog phrase to a parent (Units 2–3 — children as teachers!)
- Create a miniature village (Ezra & Selah — Unit 1 or 5)
- Make a recipe book section (Units 7–8 → Family Cookbook)
- Family photo challenge (any unit)
- Costume/embroidery study (Rylee — Unit 9)
- Build a jeepney or bangka model (Asa — Units 1, 5)

Projects produce artifacts that live in the Cookbook / future Project Gallery — the
platform's memory-preservation promise made real.

---

# AI Lesson Generation Rules

When generating any episode from this framework, Claude automatically produces the full
editable kit (per CONTENT_GUIDELINES.md, AI Content Rules):

* Teacher Lesson Plan (a complete `Lesson` config object)
* Canva Presentation Outline
* Student Activities
* Family Challenge
* Reflection Questions
* Journal Prompts
* Quiz (gentle, celebration-first)
* Vocabulary List (English + Tagalog + Hiligaynon + pronunciation)
* Resource Links (each with a one-line "why")
* Recipe (if applicable)
* Shopping List (if applicable)
* Teacher Notes
* Parent Summary
* Badge Suggestions

**Everything remains editable** — content lands in config files, never locked in code, and
Sharon reviews all AI-generated content before children see it.

**Generation inputs:** World + Unit + Episode topic from this framework, the family's
interest map, and the weekly schedule slot (a Friday episode should cook; a Monday episode
should speak).

---

# Success Criteria

The curriculum succeeds when:

- **Children look forward to every lesson**
- **Parents actively participate**
- **Learning feels like an adventure**
- **Family memories are created**
- **Culture is experienced, not just taught**
- **The platform can generate months of lessons automatically while remaining customizable**

---

# Final Curriculum Principle

Every lesson should answer three questions:

> **1. What will we discover today?**
> **2. What will we create together?**
> **3. How will this bring our family closer together?**

If an episode can't answer all three, it isn't ready to teach.

---

*Wonder Journey OS — Curriculum Framework v1.0 · July 2026 · World One, Season One begins Monday, July 13*
