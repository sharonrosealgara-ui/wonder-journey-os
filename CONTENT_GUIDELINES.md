# 📚 Wonder Journey OS — Content Guidelines

**The official content creation standard for the platform.**

Every lesson, activity, game, recipe, presentation, worksheet, email, journal prompt, and
AI-generated resource must follow these guidelines. Content that doesn't fit these
guidelines doesn't ship — regardless of how good it looks.

> **Practical note:** content lives in `src/config/` as typed objects (`Lesson`, `Recipe`,
> `Phrase`, `Resource` — see ARCHITECTURE.md §6). These guidelines define what goes *inside*
> those shapes. Where a guideline needs a model field that doesn't exist yet (e.g., audio,
> mission checklist), it is marked **[Future field]**.

---

# Content Philosophy

Children should not feel like they are attending school. They should feel:

> **"I'm going on another adventure with my family!"**

Learning happens through: **stories · exploration · games · cooking · baking · creativity ·
conversation · family interaction · reflection · curiosity.**

If a piece of content would be at home in a worksheet packet, rewrite it until it would be
at home in an adventure book.

---

# Target Age

Primary design target: **7–12 years old** (Selah is 7; Rylee is 12).

- Understandable by the youngest: short sentences, concrete words, pictures over paragraphs.
- Engaging for the oldest: real facts, real skills, real responsibility (Rylee can be the
  pronunciation coach; Ezra the sous-chef).
- **Always allow family participation** — every activity has a role for a parent, and no
  activity requires a child to be alone with a screen.

---

# Learning Approach

Every lesson combines multiple learning styles — aim for at least five of these nine:

**Visual** (maps, photos, illustrations) · **Auditory** (pronunciation, videos, music) ·
**Reading** (short story sections) · **Discussion** (family table talk) ·
**Hands-on** (cook, build, craft) · **Reflection** (journal prompts) ·
**Games** (matching, flashcards) · **Movement** (role play, treasure hunts, actions) ·
**Creativity** (draw, design, invent).

---

# Lesson Structure

Every lesson — human-written or AI-generated — follows this ten-part order. In the app,
parts 1–3 are the platform's daily frame (Adventure Home → Morning Blessings → Prayer);
parts 4–10 live inside the lesson itself.

### 1. Welcome
Friendly greeting in the adventure voice. Animated introduction **[Future: mascot-led]**.
Sets the theme: today we are explorers, not students.

### 2. Morning Blessings
Display, verbatim: **"What are you grateful to the Lord for today?"**
Journal entry with sentence starters; response saved to the Gratitude Journal.

### 3. Prayer
Show today's prayer leader from the rotation. Prayer remains optional — the gentle
invitation wording (DESIGN_SYSTEM.md §12) is canonical. Parents may lead; Teacher Sharon
may lead; declining is always safe.

### 4. Today's Mission
A short checklist that frames the episode:

> Today we will:
> ✓ Learn one new Tagalog word
> ✓ Discover a beautiful place
> ✓ Meet one amazing animal
> ✓ Cook something delicious
> ✓ Earn a passport stamp

3–5 items, each concrete and completable today. **[Future field: `mission: string[]` on
`Lesson`; currently expressed in the lesson's opening section.]**

### 5. Storytelling
**Every lesson begins with a story. Never start with facts.** Turn the topic into a
narrative the children step into ("Long ago, when a family needed to move, the whole
village would lift their house..."). Children are explorers inside the story, not readers
outside it.

### 6. Learning Content
Small sections — one idea per section, 2–4 sentences plus starred bullets. No information
overload: a lesson teaches 3–5 things well, not 15 things badly. Use images, maps,
illustrations, videos, real examples, and stories — in that spirit even when the asset is
still a placeholder.

### 7. Interactive Activity
Interaction every few minutes. Choose from: **guess · match · choose · click · discuss ·
draw · build · cook · role play · treasure hunt.** Every lesson includes at least one
in-app interactive (game, tap-to-check steps) and one off-screen interactive.

### 8. Family Activity
Every lesson encourages doing something **together**: talk together · cook together · watch
together · pray together · play together · explore together. This is the `familyChallenge`
field — required on every lesson.

### 9. Reflection
Prompts such as: *Today I learned...* · *My favorite part...* · *One new word...* · *One
thing I'm grateful for...* · *One thing I want to explore next...* Every lesson carries a
`reflection` question and a `gratitudePrompt` that feeds Morning Blessings.

### 10. Reward
Award on completion: **passport stamp** (shipped ✅), **badge** (teacher-awarded ✅), XP
**[Future — Phase 7, built gently]**, achievement, certificate (end of unit, when
appropriate). The reward is the closing beat of the episode — always celebrate.

---

# Language Lessons

Support **English, Tagalog, Hiligaynon** — always all three together, never Tagalog-only
(Hiligaynon is Teacher Sharon's home language and a first-class citizen).

Each vocabulary entry includes:

| Field | Status |
|---|---|
| English | ✅ |
| Tagalog | ✅ |
| Hiligaynon | ✅ |
| Pronunciation (friendly phonetics: "koo-MOOS-tah") | ✅ |
| Meaning/context | ✅ (via category + emoji) |
| Picture | ✅ emoji today; **[Future: illustrations]** |
| Sentence example | **[Future field]** |
| Mini game | ✅ every category auto-feeds flashcards + matching game |
| Audio placeholder | **[Future field: `audioUrl`]** |

Rule: pronunciations use approachable syllables with CAPS stress — never IPA.

---

# Culture Lessons

Focus on: **daily life · family · food · music · dance · traditions · hospitality ·
community · nature · history.**

Always explain cultural topics respectfully: real, specific, and warm — never exoticizing,
never "weird food" framing, never comparisons that rank cultures. The Philippines is
presented from the inside (Teacher Sharon's home), with pride and affection. Connect every
cultural topic back to the family's own life with a discussion question ("What is our
family's version of this?").

---

# Family Values Lessons

Priority topics: **Respect · Kindness · Gratitude · Hospitality · Bayanihan · Helping
others · Responsibility · Stewardship · Honesty · Humility · Forgiveness · Family Love.**

Every values lesson always includes all five:

1. **Story** — the value shown, not lectured (the village lifting the house)
2. **Discussion** — open family questions with no wrong answers
3. **Real-life example** — from Filipino daily life and from the children's own week
4. **Family challenge** — practice the value this week (secret kindness helper)
5. **Reflection** — journal prompt connecting the value to gratitude

Values may be paired with Scripture (as in `config/values.ts`) — warm and invitational,
per the family's preferences (AI_BEHAVIOR.md §9).

---

# Travel Lessons

Each destination includes: map · beautiful photos (real-location placeholders until
sourced) · Google Earth link placeholder **[Future field: `mapUrl`]** · interesting facts ·
animals · plants · food · language connection · history · culture · mini game · **passport
stamp** (shipped ✅ — every travel lesson must award one).

Destinations are collectible: show locked ones to spark curiosity (❔ "not yet visited"),
reveal the fun fact only after the stamp is earned.

---

# Festivals

Present festivals from a **cultural and historical perspective**: history · traditional
clothing · music · dance · food · community spirit.

**Do not require activities that conflict with the family's beliefs.** Specifically: no
Christmas or Easter crafts/activities unless the family requests them; the family honors
Jesus through biblical Feast Days. Festivals with religious dimensions are *described*
respectfully as culture and history — participation-style activities center on the shared
human elements (food, music, community, bayanihan).

---

# Cooking Lessons

Every recipe includes (all shipped ✅ in the `Recipe` model): real food photo placeholder ·
ingredients with measurements · kitchen tools · preparation steps · **safety reminders**
(hot/sharp/raw steps explicitly marked "ADULT JOB") · Tagalog + Hiligaynon vocabulary ·
cultural note · family discussion question · upload photo placeholder · Add-to-Cookbook
entry.

Recipes are language lessons and values lessons in disguise — the vocabulary and the
discussion question are never optional garnish.

---

# Baking Lessons

Beyond the cooking rules, baking content deliberately teaches: **measuring** (math in
disguise) · **mixing** (following sequences) · **decorating** (creativity — Selah's rainbow
puto) · **kitchen safety** (ovens and steam are adult jobs) · **patience** ("chill
overnight — patience makes it perfect") · **sharing** (who gets the first taste? why?).

Always encourage family participation: every recipe assigns kid jobs and adult jobs.

---

# Games

Games reinforce learning — they are practice wearing a costume. Approved shapes:
**Memory Match · Vocabulary Match (shipped ✅) · Treasure Hunt · Find the Animal · Would You
Rather · Guess the Food · Spin the Wheel · True or False.**

**Never make games stressful:** no timers by default, no lives, no harsh failure sounds or
red X's; wrong answers get a gentle color and a retry; every completion celebrates
("Magaling!"). Tries are counted as curiosity, never as a grade.

---

# Videos

Recommend from: **National Geographic Kids · Google Earth · tourism videos · cooking
demonstrations · reputable educational YouTube channels · museum resources.**

Embed placeholders for future implementation (MVP links out in a new tab). Every video
recommendation states *why it's valuable* and is short enough for a 7-year-old's attention
(prefer under ~8 minutes). Teacher previews everything before class.

---

# Presentations

Every lesson should have a Canva-ready presentation (`canvaLink` field ✅; outline
generation is Phase 4/5). Presentations must:

- **tell a story** — slides follow the lesson's narrative arc, not its fact list
- **use minimal text** — one idea, few words, big type
- **rely on visuals** — full-bleed photos and maps
- **include interaction every few slides** — "everyone say it together!", guess-before-reveal
- **feel cinematic** — an episode opening, not a report

---

# Journals

Every lesson ends with reflection. Core prompts:

- *What did you enjoy most today?*
- *What surprised you?*
- *What are you grateful to the Lord for?*
- *What would you like to learn next?*

Plus the notebook prompts in DESIGN_SYSTEM.md §23. Journals are private-feeling and
pressure-free: sentence starters always offered, no minimum length, no correction of
spelling in a child's reflection.

---

# Family Challenges

Every lesson includes **one simple family activity** (`familyChallenge` — required field ✅).
Examples: teach a new Tagalog word · cook together · take a family photo · watch a short
video together · practice greetings · visit a local park · draw today's lesson.

Rules: doable within the week with things the family already has; includes every age;
produces a shareable moment (photo, drawing, story) that can become a cookbook/scrapbook
memory.

---

# Badges

Reward **positive participation**, never speed or correctness. Vocabulary: Language
Explorer · Cooking Star · Kindness Champion · Travel Adventurer · Creative Builder ·
Grateful Heart · Family Helper — extend in `config/badges.ts` (ten shipped ✅).

Badge names celebrate character and effort. Teacher awards them personally with a note —
automation may *suggest* badges, never silently grant ones tied to character.

---

# Accessibility

All content uses: **simple language · short paragraphs · friendly tone · large visuals ·
minimal required reading · positive encouragement.**

A 7-year-old must be able to follow every student-facing screen with light parent help.
Reading is never the gate to participating — pictures, emoji, and read-aloud-friendly
phrasing carry the meaning too.

---

# AI Content Rules

Whenever AI generates lesson content, it produces the **full editable kit**:

1. Lesson Plan (as a `Lesson` config object)
2. Canva Presentation Outline
3. Worksheet
4. Game (phrase set feeding the existing game engine)
5. Reflection prompts
6. Quiz (gentle, celebration-first)
7. Family Challenge
8. Resource List (with the *why* per resource)
9. Teacher Notes
10. Parent Summary
11. Shopping List (when the lesson cooks)

**Everything editable, nothing locked into code** — output lands in config files where
Sharon can change every word. The teacher reviews all AI content before children see it
(AI_BEHAVIOR.md §15).

---

# Final Principle

Every lesson should leave the family with:

> **One new thing learned.**
> **One meaningful conversation.**
> **One shared experience.**
> **One joyful memory.**
> **One reason to look forward to the next adventure.**

If a lesson delivers all five, it was a Wonder Journey lesson. If it delivers facts
without a memory, revise it.

---

*Wonder Journey OS — Content Guidelines v1.0 · July 2026*
