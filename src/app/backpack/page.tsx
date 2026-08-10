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
    <div className="space-y-8 pb-10">
      <div className="relative z-10 mb-8 bg-gradient-to-br from-palm/10 to-sky/5 p-8 rounded-3xl border border-white shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[-1]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 30 Q 25 5 50 30 T 100 30' stroke='%23004060' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
               backgroundSize: "200px 200px"
             }}
        />
        <PageHeader
          emoji="🎒"
          title={student ? `${student.name}'s Adventure Backpack` : "The Family Backpack"}
          subtitle="Everything you've collected on the journey — packed automatically."
        />
      </div>

      {/* collection summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 relative z-10">
        <Pocket emoji="📚" label="Adventures" value={myCompletions.length} href="/lessons" />
        <Pocket emoji="🛂" label="Stamps" value={stamps.length} href="/passport" />
        <Pocket emoji="🏅" label="Badges" value={myAwards.length} href="/awards" />
        <Pocket emoji="📔" label="Journal" value={mine(journal).length} href="/journal" />
        <Pocket emoji="🌸" label="Blessings" value={mine(gratitude).length} href="/journal" />
        <Pocket emoji="📖" label="Recipes" value={cookbook.length} href="/cooking" />
      </div>

      {/* Adventure Tree — progress as a living, growing thing */}
      <section className="wj-card overflow-hidden border-2 border-white/60 shadow-lg relative bg-white/50 backdrop-blur-sm group">
        <div className="absolute inset-0 bg-gradient-to-b from-sky/40 to-palm/20 opacity-80 z-0"></div>
        
        {/* Soft sun rays */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-mango/20 blur-[80px] rounded-full z-0 opacity-60"></div>
        
        <div className="relative z-10 p-10 text-center flex flex-col items-center">
          <h2 className="font-display text-3xl font-extrabold text-ocean-deep drop-shadow-sm flex items-center gap-2">
            <span className="text-4xl">🌳</span> {student ? `${student.name}'s` : "Our"} Adventure Tree
          </h2>
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
              <div className="mt-8 flex flex-col items-center justify-center">
                <div className="wj-pop-in text-8xl drop-shadow-xl hover:scale-110 transition-transform duration-500 cursor-help" title={stageLine}>{stage}</div>
                <p className="font-medium mt-6 text-xl text-ocean-deep/90 leading-relaxed max-w-md bg-white/60 px-6 py-3 rounded-2xl border border-white shadow-sm backdrop-blur-sm">
                  {stageLine}
                </p>
              </div>
            );
          })()}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="wj-chip border border-palm/20 shadow-sm bg-white/80">🍃 {myCompletions.length} leaves (adventures)</span>
            <span className="wj-chip border border-hibiscus/20 shadow-sm bg-white/80">🌸 {mine(gratitude).length} flowers (blessings)</span>
            <span className="wj-chip border border-mango/20 shadow-sm bg-white/80">🦋 {myAwards.length} butterflies (badges)</span>
            <span className="wj-chip border border-ocean/20 shadow-sm bg-white/80">🐦 {myMemories.length} birds (memories)</span>
          </div>
        </div>
      </section>

      {/* photo memories */}
      <section className="wj-card p-8 border-2 border-white/60 shadow-lg bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-sand/60 pb-4">
          <span className="text-3xl drop-shadow-sm">📷</span>
          <h2 className="font-display text-2xl font-extrabold text-ocean-deep">Adventure Memories</h2>
        </div>
        
        {myMemories.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-sand bg-sand/20">
            <div className="text-5xl mb-4 opacity-50 grayscale drop-shadow-sm">📸</div>
            <p className="font-medium text-lg text-ink-soft">
              No memories packed yet — capture one at the end of your next Adventure Theater class!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 pt-2">
            {myMemories.map((m) => {
              const lesson = getLesson(m.lessonId);
              return (
                <figure key={m.id} className="wj-card group relative p-3 bg-white border border-sand-deep/30 shadow-md hover:-translate-y-2 hover:rotate-1 hover:shadow-xl transition-all duration-300 transform-gpu overflow-visible">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/80 border border-sand-deep/40 shadow-sm rounded-sm z-10 rotate-[-2deg] opacity-70"></div>
                  
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-deep/20 rounded-sm">
                    {m.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.photo} alt={m.caption} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mango/20 to-ocean/10 text-6xl drop-shadow-md">
                        {lesson?.emoji ?? "🌴"}
                      </div>
                    )}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-sm pointer-events-none"></div>
                  </div>
                  
                  <figcaption className="pt-4 pb-2 px-1 text-center bg-white">
                    <p className="font-hand text-lg leading-snug text-ocean-deep font-bold">{m.caption}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-ink-soft/70">{formatDate(m.date)}</p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </section>

      {/* stamps & badges shelves */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section className="wj-card p-6 border-2 border-white/60 shadow-lg bg-sand/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-5 border-b-2 border-sand/60 pb-3">
            <span className="text-2xl drop-shadow-sm">🛂</span>
            <h2 className="font-display text-xl font-extrabold text-ocean-deep">Passport Stamps</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {stamps.length === 0 && <p className="font-medium text-ink-soft py-2">The first stamp is waiting!</p>}
            {stamps.map((d) => {
              const dest = getDestination(d);
              return (
                <span key={d} className="wj-stamp wj-stamp-earned px-4 py-3 text-center shadow-sm hover:scale-110 hover:rotate-3 transition-transform cursor-help">
                  <span className="block text-2xl drop-shadow-sm mb-1">{dest?.emoji}</span>
                  <span className="font-display text-[11px] font-extrabold uppercase tracking-wider text-ocean-deep/90">{dest?.name}</span>
                </span>
              );
            })}
          </div>
        </section>
        <section className="wj-card p-6 border-2 border-white/60 shadow-lg bg-sand/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-5 border-b-2 border-sand/60 pb-3">
            <span className="text-2xl drop-shadow-sm">🏅</span>
            <h2 className="font-display text-xl font-extrabold text-ocean-deep">Badges</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {myAwards.length === 0 && <p className="font-medium text-ink-soft py-2">Badges land here as you earn them!</p>}
            {myAwards.map((a) => {
              const b = getBadge(a.badgeId);
              return (
                <span key={a.id} className="wj-sticker px-4 py-3 text-center shadow-sm hover:scale-110 hover:-rotate-3 transition-transform cursor-help border border-mango/20">
                  <span className="block text-2xl drop-shadow-sm mb-1">{b?.emoji}</span>
                  <span className="font-display text-[11px] font-extrabold text-ocean-deep/90 tracking-wide">{b?.name}</span>
                </span>
              );
            })}
          </div>
        </section>
      </div>

      {/* start next adventure */}
      <section className="wj-card-bubble wj-note p-10 text-center shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <p className="font-display text-2xl font-extrabold text-white drop-shadow-md mb-2">Ready to pack more wonders?</p>
        <p className="text-white/90 font-medium mb-6">Your backpack always has room for more discoveries.</p>
        <Link
          href={`/adventure/${(lessons.find((l) => !myCompletions.some((c) => c.lessonId === l.id)) ?? lessons[0]).id}`}
          className="wj-btn bg-white text-ocean-deep hover:bg-sand text-lg px-8 py-4 shadow-md hover:-translate-y-1 hover:shadow-xl transition-all"
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
      className="group relative rounded-2xl bg-white border-2 border-sand shadow-md p-5 text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:rotate-3 hover:scale-110 hover:shadow-xl hover:border-mango/40 hover:bg-gradient-to-br hover:from-white hover:to-mango/5 active:rotate-0 active:scale-95 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 L12 6 M6 0 L6 12' stroke='%23004060' fill='none' stroke-width='0.5' stroke-dasharray='1,2'/%3E%3C/svg%3E")`,
             backgroundSize: "6px 6px"
           }}
      />
      <div className="absolute top-1 left-1 right-1 bottom-1 border border-dashed border-sand-deep/30 rounded-xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="wj-sticker-art text-4xl drop-shadow-sm transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 mb-2">{emoji}</div>
        <div className="font-display text-3xl font-extrabold text-ocean-deep drop-shadow-sm leading-none mb-1">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-ink-soft/80 bg-white/80 px-2 py-0.5 rounded-full">{label}</div>
      </div>
    </Link>
  );
}
