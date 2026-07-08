# ✅ Wonder Journey OS — Testing Strategy

Wonder Journey is not just software — **it is an educational family experience.** Every
release is tested from every angle: Engineering · UI/UX · Performance · Accessibility ·
Educational Quality · Parent Experience · Teacher Experience · Student Experience ·
AI Content Quality · White-Label Readiness.

**Status legend:** ✅ verified in the current build · 🔶 partially shipped/tested ·
⬜ future feature (test activates when it ships). This document doubles as the living
test record — update statuses when reality changes.

---

## Mission

Testing ensures that: **children love learning · parents feel involved · teachers feel
organized · the software is beautiful · the platform creates meaningful family memories ·
nothing feels broken or unfinished.**

## Testing Philosophy

No feature is complete until it passes **all** applicable categories, in this order:

**Software Quality → Educational Quality → Family Experience → Teacher Workflow →
Performance → Accessibility → Production Readiness**

A feature that compiles but doesn't delight is not done.

---

## 1. Engineering Testing ✅

Every change verifies: no build errors · no TypeScript errors · no broken imports · no
console errors · no hydration errors (the `useStored` hook hydrates after mount by
design) · no broken routes (friendly fallbacks for bad ids) · no duplicate code (second
use = extract, e.g., `MatchingGame`) · **no hardcoded client data** (a child's name in a
component is a defect) · reusable components · configuration-first architecture ·
white-label compatibility · responsive layout · clean folder structure.

## 2. Build Validation ✅

Before every release: `npm install` → `npm run build` — **zero errors** (lint runs via
the editor; `next lint` is deprecated in Next 15.5). Known environment note: stop the dev
server before production builds — they share `.next` and corrupt each other (three
incidents logged).

## 3. User Flow Testing

Test every role each release: **Student ✅ · Parent ✅ · Teacher ✅ · Admin ⬜ · Future
Family ⬜** (white-label config swap, §32).

---

## 4. Student Experience

| Check | Status |
|---|---|
| Student selection & profile persistence | ✅ |
| Adventure Lobby (destination, mission, countdown, question of the day, recap) | ✅ |
| Morning Blessings saves (page + theater slide) | ✅ |
| Prayer Leader displays, rotation correct, optional wording verbatim | ✅ |
| Adventure Theater opens; slides load & navigate | ✅ |
| Videos play (embed for real URLs, link cards + offline backup otherwise) | ✅ |
| Interactive activities (tap-reveal vocab, matching game) | ✅ |
| Quiz works (generation, gentle retry, results, age levels) | ✅ |
| Reflection & journal save | ✅ |
| Backpack updates (memories, stamps, badges, counts) | ✅ |
| Passport updates from completions | ✅ |
| Adventure Tree grows with progress | ✅ |
| Badges unlock (teacher-awarded) | ✅ |
| Memory Capture uploads & saves | ✅ |
| Adventure Complete screen + stamp | ✅ |
| Everything autosaves (localStorage on every action) | ✅ |
| Adventure Countdown to class day | ✅ |

## 5. Parent Experience

Dashboard ✅ · Today's lesson ✅ · Weekly schedule ✅ · Materials/ingredients ✅ · Shopping
list (per recipe copy) ✅ · Videos ✅ · Recipes & Cookbook ✅ · Gratitude & journal
entries ✅ · Quiz results (via Parent Summary) ✅ · Child progress ✅ · Birthday
reminders & celebration calendar ✅ · Parent Summary (copy-ready, from theater) ✅ ·
Class Prep Email preview ✅ · Family Storybook ⬜ · Adventure Timeline ⬜.

## 6. Teacher Experience

Teacher dashboard ✅ · Lesson library ✅ · Adventure Classroom presentation mode ✅ ·
Teacher notes (auto-saved) ✅ · Canva/video links ✅ · Class Prep Checklist ✅ · Class
timer ✅ · Participation tracker (per child: answered/participated/great job/star/needs
help) ✅ · Award badges (dashboard) ✅ · Parent Summary generator ✅ · Recording link
placeholder ✅ · Email generator ✅ · Fullscreen ✅ · Google Earth links ⬜ (config rows) ·
Quiz controls (edit) ⬜ · Laser pointer / drawing tools ⬜ · Lesson editor UI ⬜ (config
files today). **Rule verified: a full class runs without opening another application.**

## 7–8. Adventure Classroom & Presentation Mode

Theater covers the full app (portal to body — regression test after the stacking-context
bug) ✅ · prev/next/keyboard/space navigation ✅ · progress-bar scrubbing ✅ · Adventure
Map chapter drawer with visited checkmarks ✅ · smooth slide transitions (reduced-motion
respected) ✅ · fullscreen toggle ✅ · timer ✅ · teacher panel ✅ · embedded video slots ✅ ·
responsive scaling ✅ · Adventure Lobby ✅ · Backpack ✅ · Adventure Tree ✅ · Cookbook ✅ ·
Adventure Mailbox ⬜ · Family Storybook ⬜ · Memory Timeline ⬜ · pointer/highlight/drawing
⬜ · animations-per-slide-object ⬜.

## 9. Lesson Flow Testing ✅

Every lesson MUST follow: **Welcome → Morning Blessings → Prayer → Mission → Story →
Learning → Videos → Interactive → Hands-on → Quiz → Reflection → Family Challenge →
Memory Capture → Adventure Complete.** The slide engine generates this order structurally
— a lesson literally cannot skip the quiz. Verified by a scripted 16-slide walkthrough of
Lesson 1. **If any section is missing: FAIL** (engine change required, flag in review).

## 10. Morning Blessings ✅

Prompt appears verbatim ("What are you grateful to the Lord for today?") · entry saves ·
Gratitude Garden updates · Family Blessings Wall updates · journal updates · autosaves.
One write, three displays — verified.

## 11. Prayer Leader ✅

Rotation correct (day-of-year deterministic; tomorrow preview) · optional participation
wording verbatim · Family Choice & Teacher Sharon in rotation · never tracked or scored
(verify no such code sneaks in — this is a values regression test).

## 12. Quiz Engine

Multiple choice ✅ · Vocabulary match ✅ (matching game) · Family discussion ✅ (every
lesson's table-talk) · Adaptive difficulty 🔶 (Younger 2-choice / Older 3-choice manual
toggle; auto-defaults from student age) · True/False ⬜ · Drag & drop ⬜ · Picture quiz ⬜ ·
Listening/Speaking ⬜ (needs audio) · Ordering ⬜ · Treasure hunt ⬜ · Word search ⬜ ·
Teacher edit UI ⬜ (config today) · XP ⬜ (Phase 7, gently). Quiz autogenerates for every
lesson with ≥2 phrases ✅.

## 13. Quiz Results ✅

Score ✅ · Stars (1–3) ✅ · Badge/stamp shown at finale ✅ · Retry (wrong answers retryable
in-place — gentler than a retry screen) ✅ · Continue ✅ · Review incorrect ⬜ · XP ⬜.

## 14. Adventure Map

Chapter map in theater (click to jump) ✅ · Passport destinations by region ✅ · zoomable
geographic map with clickable destinations ⬜ (Phase 2) · lesson launch from map ⬜.

## 15. Adventure Backpack ✅

Lessons, stamps, badges, journal, blessings, recipes, photo memories — all collected
automatically and counted. Worksheets/certificates/coloring pages ⬜ (when those exist).

## 16. Adventure Tree ✅

Grows through 5 stages with completions · leaves = adventures · flowers = blessings ·
butterflies = badges · birds = memories. Animated growth ⬜ (Phase 2 polish).

## 17–18. Memory Timeline & Family Storybook ⬜

Phase 3. Data already accumulates (completions, journals, photos, quiz results are all
dated) — these features are read-views; test when built.

## 19–21. Cookbook, Cooking & Baking Modes

Recipe pages (ingredients, measurements, tools, tap-check steps, safety, vocabulary,
culture, discussion) ✅ · shopping list copy ✅ · cookbook save with photo/memory/
reflection ✅ · theater cooking slide → Cooking Mode ✅ · kitchen timer ⬜ · dedicated
baking theme ⬜ · teacher/family-photo fields on memories ⬜.

## 22. Birthday Experience ✅

Automatic pop-up on matching date · confetti · balloons · blessing · continue button ·
once-per-day with replay. Birthday badge auto-award ⬜ · family messages ⬜ · music ⬜.
**⚠️ Blocked on real birthdays in config — placeholder dates make this untestable for real.**

## 23. Family Celebrations ✅

Birthdays, family dates, countdowns, calendar. Milestones/achievement entries ⬜.

## 24. Resources ✅

Videos/websites/printables/presentations categorized. Google Earth & worksheet
categories ⬜ (add rows).

## 25. AI Content ⬜ (Phases 4–5)

When AI generation ships, verify: every output type in the CONTENT_GUIDELINES kit ·
output type-checks against config models · **everything editable** · teacher review gate
before children see anything.

## 26. Performance

Targets: first load < 3s ✅ (static pages, ~120 kB first-load JS) · navigation < 500ms ✅ ·
animations smooth ✅ · no freezing ✅. Watch: cookbook/backpack pages as photo data-URLs
accumulate (lazy-loading images is first mitigation).

## 27. Responsive Design ✅

Mobile (nav pills scroll, cards stack) · tablet (2-col) · desktop (3–4 col) · theater
scales at all sizes · fullscreen mode. Re-verify on the family's actual devices Monday.

## 28. Accessibility

Keyboard navigation ✅ (real buttons/links; theater arrow keys) · large tap targets ✅ ·
readable fonts ✅ · reduced motion ✅ (media query, verified in compiled CSS) · focus
indicators ✅ (mango glow) · alt text ✅ (uploads use captions/recipe names) · high
contrast ✅ (navy on cream/paper) · screen-reader pass ⬜ (do a full pass before white-label
sale) · video captions ⬜ (placeholder when embeds land).

## 29. Error Handling ✅

Missing lesson/recipe → friendly fallback pages ("That recipe wandered off to the market
🧺") · broken video → link card + offline backup activity · missing image → emoji
placeholder block · empty journal/cookbook → warm empty states · storage full → soft
console warning, no crash · invalid config dates → date math clamps. **The app must never
crash in front of a child.**

## 30. Offline Mode 🔶

Video slides carry a "📴 No internet? Backup plan" card (retell the story, discussion
prompt, drawing activity) ✅ · all lesson content is local ✅ (only videos/Canva/fonts are
external; fonts fall back to system) · full offline caching (service worker) ⬜.
**The class never stops because a link fails.**

## 31. Security ⬜ (activates with the backend, DATABASE.md)

Authentication · family isolation (RLS) · teacher/parent permissions · student privacy ·
secure uploads. MVP posture: data never leaves the device — isolation by physics.

## 32. White Label Testing 🔶

Change family / students / lessons / birthdays → config-only ✅ by construction · brand
name/tagline/logo → `brand.ts` ✅ · colors → `@theme` tokens ✅ · **full dress rehearsal
(clone for a fictional second family, zero code edits) ⬜ — required before Phase 8.**

## 33. Deployment Testing

Before every release: build passes ✅ · responsive ✅ · no broken assets ✅ · no console
errors ✅ · documentation updated ✅ · performance acceptable ✅. Production hosting
(Vercel) smoke test ⬜ — pending the deployment decision.

## 34. Final Experience Test

Before calling any release done, ask:

- Would **Rylee** enjoy this? Would **Ezra** stay engaged? Would **Asa** feel excited? Would **Selah** smile?
- Would **Shaun** easily understand today's lesson? Would **Taylor** know what to prepare?
- Would **Teacher Sharon** enjoy teaching inside this platform?
- Would **another teacher** want to purchase this platform?

**If any answer is "No" — continue improving.**

## 35. Final Acceptance Criteria

Wonder Journey OS is ready when: children forget they are attending an online class ·
parents feel like they are sharing an adventure · Teacher Sharon never needs Canva, Zoom,
PowerPoint, or multiple applications during class · every lesson creates memories · every
class feels magical · every feature is reusable for future families.

---

## Final Testing Principle

> **Do not test only for functionality.**
> **Test for joy. Test for curiosity. Test for wonder.**
> **Test for family connection. Test for educational quality.**
>
> Wonder Journey succeeds when families leave every lesson smiling and looking forward to
> the next adventure.

---

*Wonder Journey OS — Testing Strategy v1.0 · July 2026*
