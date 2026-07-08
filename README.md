# 🌺 Wonder Journey OS

**Discover the Philippines: A Family Learning Adventure**

> Every lesson is an adventure. Every adventure becomes a memory.

A warm family adventure platform where children and parents learn together — Filipino languages, family values, virtual travel, cooking, gratitude, and memory-making.

## Run it

```bash
npm install
npm run dev      # local development → http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## The three modes

Use the toggle in the top-right header (or the doors on the Welcome page):

- **🎒 Student** — pick your name, write Morning Blessings, do lessons, play language games, earn passport stamps & badges.
- **👨‍👩‍👧‍👦 Parent** — schedule, materials needed, each child's progress, journals, cookbook memories, birthday calendar.
- **🍎 Teacher** — students overview, lesson plan with Canva/video links, award badges, Class Prep Email generator.

## Customizing for a family (no code knowledge needed beyond editing text)

Everything lives in `src/config/` — **one file per concern, no hardcoding in components**:

| File | What it controls |
|---|---|
| `family.ts` | Children's names/ages/interests, parents, teacher, prayer-leader rotation |
| `lessons.ts` | All lessons: content, dates, materials, Canva & video links, challenges |
| `recipes.ts` | Cooking & Baking Studio recipes (ingredients, steps, safety, Filipino words) |
| `languages.ts` | Word sets for flashcards & the matching game |
| `destinations.ts` | Travel Passport destinations & fun facts |
| `badges.ts` | Award badge definitions |
| `celebrations.ts` | **⚠️ Birthdays (placeholder dates — edit these!)** & family dates |
| `values.ts` | Filipino family values cards |
| `resources.ts` | Resource library links |
| `navigation.ts` | Nav items & which modes see them |

## Data & storage

MVP stores everything in the browser's `localStorage` (per device) via `src/lib/storage.ts`:
gratitude entries, journals, lesson completions/passport stamps, awarded badges, and cookbook
memories (photos are shrunk client-side before saving). Swapping this layer for a real backend
later will not require touching the pages.

## Notes

- Per the family's preference, seasonal content centers on biblical Feast Days (no Christmas/Easter craft content).
- Class Prep Email is copy-ready for now; Gmail/Resend/SendGrid/EmailJS automation is a planned follow-up (see `src/app/prep-email/page.tsx`).
