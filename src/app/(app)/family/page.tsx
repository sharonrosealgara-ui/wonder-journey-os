"use client";

import Link from "next/link";
import { useEffect, useState, ReactNode } from "react";
import { parentNames } from "@/config/family";
import { celebrations, daysUntil, type Celebration } from "@/config/celebrations";
import { getTodaysLesson, type Lesson } from "@/config/lessons";
import { useProgress } from "@/lib/progress";
import { Map, Star, BookHeart, Medal, MoveRight } from "lucide-react";

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
    <div className="space-y-8">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="wj-card relative overflow-hidden bg-sand-deep border border-sand">
        <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
          {/* left: greeting */}
          <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-center">
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-ink">
              Kumusta,
            </h1>
            <h1 className="font-display text-3xl sm:text-4xl text-ocean-deep font-semibold mt-1">
              {familyGreeting}.
            </h1>
            <div className="my-6 h-px w-32 bg-gradient-to-r from-ocean/50 to-transparent" />
            <p className="text-lg text-ink/80 leading-relaxed max-w-lg">
              Your backpacks are packed and passports ready.{" "}
              <b className="text-ocean-deep font-semibold">World 1: The Philippines</b> awaits!
            </p>
            <p className="mt-3 text-base text-ink-soft leading-relaxed max-w-lg">
              Discover breathtaking islands, cook traditional dishes, learn beautiful words, and write another chapter in our family story.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {lesson && (
                <Link href={`/adventure/${lesson.id}`} className="wj-btn shadow-sm">
                  Begin Today&apos;s Adventure
                </Link>
              )}
              <Link href="/lessons" className="wj-btn wj-btn-ghost shadow-sm bg-white/50">
                Explore the Adventure Map
              </Link>
            </div>
          </div>

          {/* right: Premium Geometric Scene */}
          <HeroScene />
        </div>
      </section>

      {/* ── Stat cards ───────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Map className="w-5 h-5 text-palm-deep" />}
          label="Places Explored"
          value={`${p.placesExplored} / ${p.placesTotal}`}
          note="Discover more places"
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-mango-deep" />}
          label="Explorer Points"
          value={`${p.points}`}
          note="Keep growing"
        />
        <StatCard
          icon={<BookHeart className="w-5 h-5 text-ocean-deep" />}
          label="Passport Stamps"
          value={`${p.stamps}`}
          note="Collect stamps"
        />
        <StatCard
          icon={<Medal className="w-5 h-5 text-ube-deep" />}
          label="Achievements"
          value={`${p.badgesEarned} / ${p.badgesTotal}`}
          note="Earn badges together"
        />
      </section>

      {/* ── Today's Adventure + Upcoming Celebration ─────────── */}
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {lesson && (
          <div className="wj-card overflow-hidden flex flex-col border border-sand">
            <div className="flex items-center justify-between bg-sand-deep/50 px-6 py-4 border-b border-sand/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ocean" />
                <h2 className="font-display font-semibold text-lg text-ink tracking-wide">Today&apos;s Adventure</h2>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">World 1 · {lesson.category}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 flex-1 bg-white">
              <div>
                <h3 className="font-display text-2xl text-ocean-deep font-bold flex items-center gap-2">
                  <span aria-hidden className="text-3xl">{lesson.emoji}</span>
                  {lesson.title}
                </h3>
                <p className="mt-2 text-ink-soft leading-relaxed max-w-md">{lesson.subtitle}</p>
              </div>
              <Link href={`/adventure/${lesson.id}`} className="wj-btn shrink-0 w-full sm:w-auto shadow-sm">
                Continue <MoveRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        )}

        {nextCeleb && (
          <Link href="/celebrations" className="wj-card wj-card-hover flex flex-col justify-center p-6 text-center border border-sand bg-gradient-to-b from-white to-sand-deep/20">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-soft/70 mb-4">
              Upcoming Celebration
            </div>
            <div className="text-4xl mb-3">{nextCeleb.emoji}</div>
            <div className="font-display text-xl text-hibiscus-deep font-bold">
              {nextCeleb.type === "birthday" ? `${nextCeleb.name}'s Birthday` : nextCeleb.name}
            </div>
            <div className="mt-2 text-sm font-medium text-ink-soft">
              {daysUntil(nextCeleb) === 0
                ? "Today!"
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
    <div className="relative min-h-[220px] overflow-hidden md:min-h-full bg-sand-deep/40 hidden md:block">
      {/* Topographic map lines motif */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' stroke='%23000' fill='none' stroke-width='1'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' stroke='%23000' fill='none' stroke-width='1'/%3E%3Cpath d='M0 30 Q 25 5 50 30 T 100 30' stroke='%23000' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px"
        }}
      />
      
      {/* Restrained structural layers to provide depth without WebGL or photos */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-ocean/5 mix-blend-multiply blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-mango/5 mix-blend-multiply blur-2xl" />
      
      <div className="absolute inset-y-0 right-0 w-full max-w-xs flex items-center justify-center opacity-80">
        <div className="w-full h-[120%] border-l border-ink/5 -rotate-12 translate-x-12" />
        <div className="w-full h-[120%] border-l border-ink/5 -rotate-12 translate-x-6" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-ink/10 rounded-full flex items-center justify-center shadow-sm bg-white/30 backdrop-blur-[2px]">
        <div className="w-32 h-32 border border-ink/5 rounded-full flex items-center justify-center bg-white/40">
           <span className="text-4xl opacity-90 drop-shadow-sm">🇵🇭</span>
        </div>
      </div>

      {/* soft edge blend into the card text area */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-sand-deep to-transparent" />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="wj-card p-5 border border-sand bg-white/80">
      <div className="flex items-center gap-2 text-ink-soft">
        {icon}
        <div className="text-xs font-bold uppercase tracking-widest">{label}</div>
      </div>
      <div className="mt-3 font-display text-3xl font-semibold text-ink">
        {value}
      </div>
      <p className="mt-1 text-xs text-ink-soft/80 font-medium">{note}</p>
    </div>
  );
}
