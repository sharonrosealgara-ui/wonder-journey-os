"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getBadge } from "@/config/badges";
import { getDestination } from "@/config/destinations";
import { getStudent, students } from "@/config/family";
import { getLesson, lessons } from "@/config/lessons";
import { getRecipe } from "@/config/recipes";
import {
  formatDate,
  KEYS,
  type AdventureMemory,
  type AwardedBadge,
  type CookbookMemory,
  type GratitudeEntry,
  type JournalEntry,
  type LessonCompletion,
} from "@/lib/app-state";
import { useStored } from "@/lib/storage";

// 🎒 The Adventure Backpack — everything a student has collected,
// gathered automatically from every corner of the platform.

export default function BackpackPage() {
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [completions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const [awards] = useStored<AwardedBadge[]>(KEYS.awards, []);
  const [journal] = useStored<JournalEntry[]>(KEYS.journal, []);
  const [gratitude] = useStored<GratitudeEntry[]>(KEYS.gratitude, []);
  const [cookbook] = useStored<CookbookMemory[]>(KEYS.cookbook, []);
  const [memories] = useStored<AdventureMemory[]>(KEYS.memories, []);

  const student = getStudent(activeStudentId);
  const mine = <T extends { studentId: string }>(rows: T[]) =>
    student ? rows.filter((r) => r.studentId === student.id || r.studentId === "family") : rows;

  const myCompletions = mine(completions);
  const stamps = [
    ...new Set(
      myCompletions
        .map((c) => getLesson(c.lessonId)?.destinationId)
        .filter((d): d is string => Boolean(d))
    ),
  ];
  const myAwards = mine(awards);
  const myMemories = mine(memories);

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🎒"
        title={student ? `${student.name}'s Adventure Backpack` : "The Family Backpack"}
        subtitle="Everything you've collected on the journey — packed automatically."
      />

      {/* collection summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <Pocket emoji="📚" label="Adventures" value={myCompletions.length} href="/lessons" />
        <Pocket emoji="🛂" label="Stamps" value={stamps.length} href="/passport" />
        <Pocket emoji="🏅" label="Badges" value={myAwards.length} href="/awards" />
        <Pocket emoji="📔" label="Journal" value={mine(journal).length} href="/journal" />
        <Pocket emoji="🌸" label="Blessings" value={mine(gratitude).length} href="/journal" />
        <Pocket emoji="📖" label="Recipes" value={cookbook.length} href="/cookbook" />
      </div>

      {/* Adventure Tree — progress as a living, growing thing */}
      <section className="wj-card overflow-hidden">
        <div className="bg-gradient-to-b from-sky/60 to-palm/15 p-6 text-center">
          <h2 className="font-display text-xl">🌳 {student ? `${student.name}'s` : "Our"} Adventure Tree</h2>
          {(() => {
            const growth = myCompletions.length;
            const stage =
              growth === 0 ? "🌱" : growth <= 2 ? "🌿" : growth <= 5 ? "🌳" : growth <= 8 ? "🌳🌸" : "🌳🌸🦋";
            const stageLine =
              growth === 0
                ? "A tiny seed, ready to grow with your first adventure!"
                : growth <= 2
                ? "Your tree is sprouting — keep exploring!"
                : growth <= 5
                ? "A young tree, growing strong with every adventure!"
                : growth <= 8
                ? "Your tree is blooming beautifully!"
                : "A magnificent tree, full of life — butterflies have moved in!";
            return (
              <>
                <div className="wj-pop-in mt-2 text-7xl">{stage}</div>
                <p className="font-hand mt-2 text-lg text-ink-soft">{stageLine}</p>
              </>
            );
          })()}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="wj-chip">🍃 {myCompletions.length} leaves (adventures)</span>
            <span className="wj-chip">🌸 {mine(gratitude).length} flowers (blessings)</span>
            <span className="wj-chip">🦋 {myAwards.length} butterflies (badges)</span>
            <span className="wj-chip">🐦 {myMemories.length} birds (memories)</span>
          </div>
        </div>
      </section>

      {/* photo memories */}
      <section className="wj-card p-6">
        <h2 className="font-display text-xl">📷 Adventure Memories</h2>
        {myMemories.length === 0 ? (
          <p className="font-hand mt-2 text-lg text-ink-soft">
            No memories packed yet — capture one at the end of your next Adventure Theater
            class!
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {myMemories.map((m) => {
              const lesson = getLesson(m.lessonId);
              return (
                <figure key={m.id} className="wj-card wj-card-hover overflow-hidden">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt={m.caption} className="h-36 w-full object-cover" />
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-gradient-to-br from-mango/25 to-ocean/15 text-5xl">
                      {lesson?.emoji ?? "🌴"}
                    </div>
                  )}
                  <figcaption className="p-3">
                    <p className="font-hand text-base leading-snug">{m.caption}</p>
                    <p className="mt-1 text-xs text-ink-soft">{formatDate(m.date)}</p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </section>

      {/* stamps & badges shelves */}
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="wj-card p-6">
          <h2 className="font-display text-xl">🛂 Passport Stamps</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {stamps.length === 0 && <p className="font-hand text-ink-soft">The first stamp is waiting!</p>}
            {stamps.map((d) => {
              const dest = getDestination(d);
              return (
                <span key={d} className="wj-stamp wj-stamp-earned px-3 py-2 text-center">
                  <span className="block text-xl">{dest?.emoji}</span>
                  <span className="font-display text-[10px] uppercase">{dest?.name}</span>
                </span>
              );
            })}
          </div>
        </section>
        <section className="wj-card p-6">
          <h2 className="font-display text-xl">🏅 Badges</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {myAwards.length === 0 && <p className="font-hand text-ink-soft">Badges land here as you earn them!</p>}
            {myAwards.map((a) => {
              const b = getBadge(a.badgeId);
              return (
                <span key={a.id} className="wj-sticker px-3 py-2 text-center">
                  <span className="block text-xl">{b?.emoji}</span>
                  <span className="font-display text-[10px]">{b?.name}</span>
                </span>
              );
            })}
          </div>
        </section>
      </div>

      {/* start next adventure */}
      <section className="wj-card-bubble wj-note p-6 text-center">
        <p className="font-display text-xl text-white">Ready to pack more wonders?</p>
        <Link
          href={`/adventure/${(lessons.find((l) => !myCompletions.some((c) => c.lessonId === l.id)) ?? lessons[0]).id}`}
          className="wj-btn mt-3"
        >
          🎬 Start the Next Adventure
        </Link>
      </section>
    </div>
  );
}

// 🎒 A backpack PATCH — each stat is a sewn-on badge patch that wiggles
// playfully under little fingers (Family OS tactility, not a spreadsheet).
function Pocket({ emoji, label, value, href }: { emoji: string; label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border-[3px] border-dashed border-mango/60 bg-[--color-cream-card] p-4 text-center [box-shadow:var(--shadow-tactile)] transition-all duration-300 ease-out hover:-translate-y-1 hover:rotate-2 hover:scale-110 active:rotate-0 active:scale-95"
    >
      <div className="wj-sticker-art text-3xl transition-transform duration-300 group-hover:-rotate-6">{emoji}</div>
      <div className="font-display text-2xl text-ocean-deep">{value}</div>
      <div className="text-xs font-bold text-ink-soft">{label}</div>
    </Link>
  );
}
