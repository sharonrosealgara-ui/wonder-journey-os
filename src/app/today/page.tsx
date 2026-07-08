"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStudent } from "@/config/family";
import { getTodaysLesson, type Lesson } from "@/config/lessons";
import { celebrations, daysUntil } from "@/config/celebrations";
import { formatDate, getTodaysPrayerLeader, KEYS, todayISO, type GratitudeEntry, type LessonCompletion } from "@/lib/app-state";
import { getLesson } from "@/config/lessons";
import { buildMission } from "@/lib/slides";
import { useStored } from "@/lib/storage";

function daysUntilLesson(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86400000);
}

export default function TodayPage() {
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [gratitude] = useStored<GratitudeEntry[]>(KEYS.gratitude, []);
  const [completions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const student = getStudent(activeStudentId);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [leader, setLeader] = useState("");
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    setLesson(getTodaysLesson());
    setLeader(getTodaysPrayerLeader());
    setDateLabel(formatDate(todayISO()));
  }, []);

  const blessedToday = gratitude.some(
    (g) => g.date === todayISO() && (!activeStudentId || g.studentId === activeStudentId)
  );

  const nextCelebration = [...celebrations].sort((a, b) => daysUntil(a) - daysUntil(b))[0];

  return (
    <div className="space-y-6">
      <section className="wj-card bg-gradient-to-br from-mango/20 to-ocean/10 p-6 sm:p-8">
        <p className="text-sm font-bold text-ink-soft">{dateLabel}</p>
        <h1 className="wj-outline mt-1 font-display text-3xl sm:text-4xl">
          {student ? `Magandang umaga, ${student.name}! ` : "Magandang umaga! "}🌅
        </h1>
        <p className="mt-1 text-ink-soft">
          &ldquo;Good morning&rdquo; in Tagalog — are you ready for today&apos;s adventure?
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Morning blessings */}
        <Link href="/blessings" className="wj-card wj-card-hover wj-note block p-6">
          <div className="text-3xl">🙏</div>
          <h2 className="mt-2 font-display text-xl font-extrabold">Morning Blessings</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {blessedToday
              ? "You already counted your blessings today — beautiful! ✨"
              : "What are you grateful to the Lord for today?"}
          </p>
          <span className={`wj-chip mt-3 ${blessedToday ? "!bg-palm/15 !text-palm-deep" : "!bg-mango/20 !text-mango-deep"}`}>
            {blessedToday ? "✅ Done today" : "Start here first"}
          </span>
        </Link>

        {/* Prayer leader */}
        <Link href="/prayer" className="wj-card wj-card-hover wj-note block p-6">
          <div className="text-3xl">✝️</div>
          <h2 className="mt-2 font-display text-xl font-extrabold">Today&apos;s Prayer Leader</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Today the Lord&apos;s opening prayer may be led by...
          </p>
          <span className="wj-chip mt-3 !bg-ube/15 !text-ube">🌟 {leader || "..."}</span>
        </Link>
      </div>

      {/* Today's lesson */}
      {lesson && (
        <section className="wj-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="wj-chip">Today&apos;s Adventure</span>
            <span className="wj-chip">{lesson.category}</span>
            <span className="wj-chip">
              🗓️ {formatDate(lesson.date)} · {lesson.time}
            </span>
            {(() => {
              const days = daysUntilLesson(lesson.date);
              return (
                <span className={`wj-chip ${days <= 0 ? "!bg-sunset !text-white" : "!bg-mango/25 !text-mango-deep"}`}>
                  {days <= 0 ? "🎉 Class day — today!" : `⏳ ${days} day${days === 1 ? "" : "s"} until class`}
                </span>
              );
            })()}
          </div>
          <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">
            {lesson.emoji} {lesson.title}
          </h2>
          <p className="mt-1 text-ink-soft">{lesson.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/adventure/${lesson.id}`} className="wj-btn text-lg">
              🎬 Start Adventure
            </Link>
            <Link href={`/lessons/${lesson.id}`} className="wj-btn wj-btn-ghost">
              Read the lesson
            </Link>
            <Link href="/lessons" className="wj-btn wj-btn-ghost">
              All lessons
            </Link>
          </div>
        </section>
      )}

      {/* Adventure Lobby: mission + question + last recap */}
      {lesson && (
        <div className="grid gap-4 sm:grid-cols-2">
          <section className="wj-card-bubble wj-note p-5">
            <h2 className="font-display text-lg text-white">🎯 Today&apos;s Mission</h2>
            <ul className="mt-2 space-y-1.5 text-sm font-semibold text-white/95">
              {buildMission(lesson).slice(0, 4).map((m) => (
                <li key={m}>✓ {m}</li>
              ))}
            </ul>
          </section>
          <div className="space-y-4">
            <section className="wj-card p-5">
              <h2 className="font-display text-lg">💭 Question of the Day</h2>
              <p className="font-hand mt-1 text-lg text-ink-soft">&ldquo;{lesson.gratitudePrompt}&rdquo;</p>
            </section>
            {(() => {
              const last = [...completions].sort((a, b) => b.date.localeCompare(a.date))[0];
              const lastLesson = last ? getLesson(last.lessonId) : undefined;
              return lastLesson ? (
                <section className="wj-card p-5">
                  <h2 className="font-display text-lg">🔙 Last Adventure Recap</h2>
                  <p className="font-hand mt-1 text-lg text-ink-soft">
                    {lastLesson.emoji} {lastLesson.title} — completed {formatDate(last.date)}. Magaling!
                  </p>
                </section>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* Upcoming celebration */}
      {nextCelebration && (
        <Link href="/celebrations" className="wj-card wj-card-hover flex items-center gap-4 p-5">
          <span className="text-3xl">{nextCelebration.emoji}</span>
          <div className="flex-1">
            <div className="font-display font-extrabold">
              {nextCelebration.type === "birthday"
                ? `${nextCelebration.name}'s birthday`
                : nextCelebration.name}
            </div>
            <div className="text-sm text-ink-soft">
              {daysUntil(nextCelebration) === 0
                ? "Today! 🎉"
                : `${daysUntil(nextCelebration)} day${daysUntil(nextCelebration) === 1 ? "" : "s"} away`}
            </div>
          </div>
          <span className="text-xl">🎉</span>
        </Link>
      )}
    </div>
  );
}
