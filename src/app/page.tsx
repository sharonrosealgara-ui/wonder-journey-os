"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { parentNames } from "@/config/family";
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
    <div className="space-y-6">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="wj-card relative overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
          {/* left: greeting */}
          <div className="p-6 sm:p-8">
            <h1 className="wj-outline font-display text-4xl leading-none sm:text-5xl">
              <span className="mr-1 text-2xl text-mango-deep" style={{ WebkitTextStroke: "0" }}>✦</span>
              Kumusta,
            </h1>
            <h1 className="wj-outline mt-1 font-display text-3xl leading-tight text-ocean-deep sm:text-4xl">
              {familyGreeting}! 👋
            </h1>
            <div className="my-4 h-0.5 w-40 bg-gradient-to-r from-mango to-transparent" />
            <p className="text-lg text-ink">
              Your backpacks are packed and your passports are ready —{" "}
              <b className="text-ocean-deep">World 1: the Philippines</b> 🇵🇭 is calling!
            </p>
            <p className="font-hand mt-2 text-lg text-ink-soft">
              Together we&apos;ll wander breathtaking islands, cook delicious dishes, learn
              beautiful new words, and write another page in our family&apos;s story — one
              adventure at a time.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {lesson && (
                <Link href={`/adventure/${lesson.id}`} className="wj-btn text-lg">
                  🌴 Begin Today&apos;s Adventure
                </Link>
              )}
              <Link href="/lessons" className="wj-btn wj-btn-ghost text-lg">
                🧭 Explore the Adventure Map
              </Link>
            </div>
          </div>

          {/* right: CSS tropical scene (drop a real image here later) */}
          <HeroScene />
        </div>
      </section>

      {/* ── Stat cards ───────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          emoji="🗺️"
          label="Places Explored"
          value={`${p.placesExplored} / ${p.placesTotal}`}
          note="Let's discover more amazing places!"
          color="var(--color-palm-deep)"
        />
        <StatCard
          emoji="⭐"
          label="Explorer Points"
          value={`${p.points}`}
          note="Keep learning, keep growing!"
          color="var(--color-mango-deep)"
        />
        <StatCard
          emoji="🛂"
          label="Passport Stamps"
          value={`${p.stamps}`}
          note="Collect stamps from every journey!"
          color="var(--color-ocean-deep)"
        />
        <StatCard
          emoji="🏅"
          label="Adventure Achievements"
          value={`${p.badgesEarned} / ${p.badgesTotal}`}
          note="Earn badges and celebrate together!"
          color="var(--color-ube-deep)"
        />
      </section>

      {/* ── Today's Adventure + Upcoming Celebration ─────────── */}
      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {lesson && (
          <div className="wj-card overflow-hidden">
            <div className="flex items-center gap-2 bg-gradient-to-r from-ocean/15 to-mango/15 px-6 py-3">
              <span className="text-2xl">🌴</span>
              <h2 className="font-display text-xl">Today&apos;s Adventure</h2>
              <span className="font-hand text-ink-soft">Your journey continues here...</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <span className="wj-chip">World 1 · {lesson.category}</span>
                <h3 className="mt-2 font-display text-2xl text-ocean-deep">
                  {lesson.emoji} {lesson.title}
                </h3>
                <p className="font-hand text-lg text-ink-soft">{lesson.subtitle}</p>
              </div>
              <Link href={`/adventure/${lesson.id}`} className="wj-btn">
                Continue Adventure ›
              </Link>
            </div>
          </div>
        )}

        {nextCeleb && (
          <Link href="/celebrations" className="wj-card wj-card-hover flex flex-col justify-center p-6 text-center">
            <div className="text-sm font-bold uppercase tracking-wide text-ink-soft">
              🎉 Upcoming Celebration
            </div>
            <div className="mt-2 text-4xl">{nextCeleb.emoji}</div>
            <div className="mt-1 font-display text-xl text-hibiscus-deep">
              {nextCeleb.type === "birthday" ? `${nextCeleb.name}'s Birthday` : nextCeleb.name}
            </div>
            <div className="font-hand text-lg text-ink-soft">
              {daysUntil(nextCeleb) === 0
                ? "Today! 🎊"
                : `in ${daysUntil(nextCeleb)} day${daysUntil(nextCeleb) === 1 ? "" : "s"}`}
            </div>
          </Link>
        )}
      </section>
    </div>
  );
}

function HeroScene() {
  // Layered watercolor-style scene in pure CSS. Replace with a real
  // illustration by dropping an <img> here (e.g. /hero-philippines.jpg).
  return (
    <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-b from-[#bfe3f5] via-[#dff0d8] to-[#f3e6c8] md:min-h-full">
      {/* passport stamp watermark */}
      <div className="absolute right-5 top-4 h-20 w-20 rotate-[-8deg] rounded-full border-2 border-ink-soft/25 text-center text-[8px] font-bold uppercase leading-[80px] tracking-widest text-ink-soft/30">
        Philippines
      </div>
      <span className="absolute left-6 top-8 text-4xl">🌋</span>
      <span className="absolute left-24 top-6 text-5xl">🌋</span>
      <span className="absolute right-16 top-6 text-3xl">🦅</span>
      <span className="absolute right-6 top-14 text-2xl">☀️</span>
      <span className="absolute bottom-16 left-8 text-3xl">⛵</span>
      <span className="absolute bottom-6 right-10 text-5xl">🚙</span>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl">🏝️</span>
      <span className="absolute bottom-8 right-1/3 text-2xl">🌴</span>
      <span className="absolute bottom-3 left-6 text-2xl">🌺</span>
      {/* sea */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#8fd0e8]/70 to-transparent" />
    </div>
  );
}

function StatCard({
  emoji,
  label,
  value,
  note,
  color,
}: {
  emoji: string;
  label: string;
  value: string;
  note: string;
  color: string;
}) {
  return (
    <div className="wj-card p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">{label}</div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="font-display text-3xl" style={{ color }}>
          {value}
        </div>
        <span className="text-3xl">{emoji}</span>
      </div>
      <p className="font-hand mt-1 text-sm text-ink-soft">{note}</p>
    </div>
  );
}
