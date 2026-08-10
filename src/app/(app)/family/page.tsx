"use client";

import Link from "next/link";
import { useEffect, useState, ReactNode } from "react";
import { parentNames, students } from "@/config/family";
import { celebrations, daysUntil, type Celebration } from "@/config/celebrations";
import { getTodaysLesson, type Lesson } from "@/config/lessons";
import { useProgress } from "@/lib/progress";

// 🏠 HOME BASE — the family's dashboard landing.
export default function HomeBase() {
  const p = useProgress();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [nextCeleb, setNextCeleb] = useState<Celebration | null>(null);

  useEffect(() => {
    setLesson(getTodaysLesson());
    setNextCeleb([...celebrations].sort((a, b) => daysUntil(a) - daysUntil(b))[0] ?? null);
  }, []);

  const familyGreeting = `${parentNames.join(" & ")} Family`;

  return (
    <div className="space-y-10 relative z-10">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="wj-card relative overflow-hidden bg-gradient-to-br from-ocean/10 via-sand to-mango/10 border-2 border-white shadow-sm">
        <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
          {/* left: greeting */}
          <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-center">
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-ink drop-shadow-sm">
              Kumusta,
            </h1>
            <h1 className="font-display text-4xl sm:text-5xl text-ocean-deep font-extrabold mt-1 drop-shadow-sm">
              {familyGreeting}!
            </h1>

            <div className="my-6 h-1 w-24 bg-mango rounded-full opacity-80" />

            <p className="text-lg text-ink leading-relaxed max-w-lg font-medium">
              Your backpacks are packed and passports ready.{" "}
              <b className="text-ocean-deep font-bold">World 1: The Philippines</b> awaits!
            </p>
            <p className="mt-3 text-base text-ink-soft leading-relaxed max-w-lg">
              Discover breathtaking islands, cook traditional dishes, learn beautiful words, and write another chapter in our family story.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {students.map((s) => (
                <span key={s.id} className="wj-chip !bg-white/60 !py-1 !px-3 font-semibold text-ocean-deep border border-ocean/10 shadow-sm backdrop-blur-sm">
                  {s.emoji} {s.name}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {lesson && (
                <Link href={`/adventure/${lesson.id}`} className="wj-btn wj-btn-ocean shadow-md hover:-translate-y-0.5 transition-transform">
                  Begin Today&apos;s Adventure 🚀
                </Link>
              )}
              <Link href="/lessons" className="wj-btn wj-btn-ghost shadow-sm bg-white/60 hover:bg-white border border-sand">
                Explore the Map 🗺️
              </Link>
            </div>
          </div>

          {/* right: Adventure Map Scene */}
          <HeroScene />
        </div>
      </section>

      {/* ── Stat cards ───────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon="🗺️"
          color="bg-palm/10"
          textColor="text-palm-deep"
          label="Places Explored"
          value={`${p.placesExplored} / ${p.placesTotal}`}
          note="Discover more places"
        />
        <StatCard
          icon="⭐"
          color="bg-mango/10"
          textColor="text-mango-deep"
          label="Explorer Points"
          value={`${p.points}`}
          note="Keep growing"
        />
        <StatCard
          icon="🛂"
          color="bg-ocean/10"
          textColor="text-ocean-deep"
          label="Passport Stamps"
          value={`${p.stamps}`}
          note="Collect stamps"
        />
        <StatCard
          icon="🏅"
          color="bg-ube/10"
          textColor="text-ube-deep"
          label="Achievements"
          value={`${p.badgesEarned} / ${p.badgesTotal}`}
          note="Earn badges together"
        />
      </section>

      {/* ── Today's Adventure + Upcoming Celebration ─────────── */}
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {lesson && (
          <div className="wj-card overflow-hidden flex flex-col border-2 border-white bg-sand/30 shadow-sm group">
            <div className="flex items-center justify-between bg-ocean-deep px-6 py-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-mango shadow-[0_0_8px_rgba(255,200,50,0.8)]" />
                <h2 className="font-display font-bold text-lg text-white tracking-wide">Today&apos;s Adventure</h2>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-ocean-light bg-white/10 px-2 py-0.5 rounded-full">World 1 · {lesson.category}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 flex-1 bg-gradient-to-b from-white to-sand/20">
              <div>
                <h3 className="font-display text-2xl text-ink font-extrabold flex items-center gap-3">
                  <span aria-hidden className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">{lesson.emoji}</span>
                  {lesson.title}
                </h3>
                <p className="mt-2 text-ink-soft leading-relaxed max-w-md font-medium">{lesson.subtitle}</p>
              </div>
              <Link href={`/adventure/${lesson.id}`} className="wj-btn wj-btn-ocean shrink-0 w-full sm:w-auto shadow-md hover:-translate-y-0.5 transition-transform">
                Continue ✈️
              </Link>
            </div>
          </div>
        )}

        {nextCeleb && (
          <Link href="/celebrations" className="wj-card wj-card-hover flex flex-col justify-center p-6 text-center border-2 border-white bg-gradient-to-br from-hibiscus/10 to-mango/10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl rotate-12 group-hover:rotate-45 transition-transform duration-700 pointer-events-none">✨</div>
            <div className="text-xs font-bold uppercase tracking-widest text-hibiscus-deep mb-4 z-10">
              Upcoming Celebration
            </div>
            <div className="text-5xl mb-3 drop-shadow-sm z-10 group-hover:scale-110 transition-transform">{nextCeleb.emoji}</div>
            <div className="font-display text-2xl text-ink font-extrabold z-10">
              {nextCeleb.type === "birthday" ? `${nextCeleb.name}'s Birthday` : nextCeleb.name}
            </div>
            <div className="mt-2 text-sm font-semibold text-hibiscus-deep z-10 bg-white/60 inline-block px-3 py-1 rounded-full mx-auto backdrop-blur-sm">
              {daysUntil(nextCeleb) === 0
                ? "Today! 🎉"
                : `in ${daysUntil(nextCeleb)} day${daysUntil(nextCeleb) === 1 ? "" : "s"}`}
            </div>
          </Link>
        )}
      </section>
    </div>
  );
}

function HeroScene() {
  return (
    <div className="relative min-h-[220px] overflow-hidden md:min-h-full bg-ocean/5 hidden md:block">
      {/* Topographic map lines motif */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 30 Q 25 5 50 30 T 100 30' stroke='%23004060' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px"
        }}
      />

      {/* Dimensional map layers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/40 rounded-full flex items-center justify-center shadow-lg bg-ocean/10 backdrop-blur-sm">
        <div className="absolute -top-4 -right-4 text-4xl drop-shadow-md rotate-12">🌺</div>
        <div className="absolute -bottom-2 -left-6 text-3xl drop-shadow-md -rotate-12">🥥</div>
        <div className="w-40 h-40 border-2 border-white/60 rounded-full flex items-center justify-center bg-white/40 shadow-inner relative">
           <span className="text-6xl drop-shadow-md hover:scale-110 transition-transform duration-300 cursor-default">🇵🇭</span>

           {/* Dotted travel path */}
           <svg className="absolute w-full h-full text-mango-deep opacity-60 pointer-events-none" viewBox="0 0 100 100">
             <path d="M 20,80 Q 50,10 80,40" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6,6" strokeLinecap="round" />
           </svg>
        </div>
      </div>

      {/* soft edge blend into the card text area */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-sand to-transparent" />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  note,
  color,
  textColor,
}: {
  icon: string;
  label: string;
  value: string;
  note: string;
  color: string;
  textColor: string;
}) {
  return (
    <div className={`wj-card p-5 border-2 border-white shadow-sm bg-gradient-to-b from-white to-sand/20 hover:-translate-y-0.5 transition-transform`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-lg drop-shadow-sm`}>
          {icon}
        </div>
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ink-soft">{label}</div>
      </div>
      <div className={`mt-3 font-display text-3xl font-extrabold ${textColor} drop-shadow-sm`}>
        {value}
      </div>
      <p className="mt-1 text-xs text-ink-soft font-semibold">{note}</p>
    </div>
  );
}
