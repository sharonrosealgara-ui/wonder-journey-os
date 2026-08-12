"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DataBackup } from "@/components/data-backup";
import { PageHeader } from "@/components/page-header";
import { familyName, students } from "@/config/family";
import { getTodaysLesson, lessons, type Lesson } from "@/config/lessons";
import {
  formatDate,
  KEYS,
  type AwardedBadge,
  type GratitudeEntry,
  type JournalEntry,
  type LessonCompletion,
} from "@/lib/app-state";
import { useStored } from "@/lib/storage";

export default function ParentPage() {
  const [completions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const [gratitude] = useStored<GratitudeEntry[]>(KEYS.gratitude, []);
  const [journal] = useStored<JournalEntry[]>(KEYS.journal, []);
  const [awards] = useStored<AwardedBadge[]>(KEYS.awards, []);
  const [todaysLesson, setTodaysLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    setTodaysLesson(getTodaysLesson());
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="👨‍👩‍👧‍👦"
        title="Family Hub"
        subtitle={`Welcome, ${familyName}! Everything for this week's adventure — at a glance.`}
      />

      {/* Up next: lesson + materials */}
      {todaysLesson && (
        <section className="wj-card p-6 sm:p-8">
          <span className="wj-chip">Up next</span>
          <h2 className="mt-2 font-display text-2xl font-extrabold">
            {todaysLesson.emoji} {todaysLesson.title}
          </h2>
          <p className="text-sm text-ink-soft">
            🗓️ {formatDate(todaysLesson.date)} · {todaysLesson.time}
          </p>
          <div className="mt-4 rounded-2xl bg-sand p-4">
            <h3 className="font-display font-extrabold">🧺 Materials & ingredients needed</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {todaysLesson.materials.map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="text-mango-deep">☐</span> {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/lessons/${todaysLesson.id}`} className="wj-btn">
              Preview the lesson
            </Link>
          </div>
        </section>
      )}

      {/* Weekly schedule */}
      <section className="wj-card p-6">
        <h2 className="font-display text-xl font-extrabold">🗓️ Class schedule</h2>
        <div className="mt-4 space-y-2">
          {lessons
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((l) => (
              <Link
                key={l.id}
                href={`/lessons/${l.id}`}
                className="flex items-center gap-3 rounded-2xl border-2 border-sand-deep p-3 transition-colors hover:border-mango"
              >
                <span className="text-2xl">{l.emoji}</span>
                <div className="flex-1">
                  <div className="font-display font-extrabold">{l.title}</div>
                  <div className="text-sm text-ink-soft">
                    {formatDate(l.date)} · {l.time}
                  </div>
                </div>
                <span className="wj-chip">{l.category}</span>
              </Link>
            ))}
        </div>
      </section>

      {/* Children progress */}
      <section>
        <h2 className="mb-3 font-display text-xl font-extrabold">🌟 Each child&apos;s journey</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {students.map((s) => {
            const done = completions.filter((c) => c.studentId === s.id).length;
            const grat = gratitude.filter((g) => g.studentId === s.id);
            const jour = journal.filter((j) => j.studentId === s.id).length;
            const badgeCount = awards.filter((a) => a.studentId === s.id).length;
            const latestGratitude = grat[0];
            return (
              <div key={s.id} className="wj-card p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                    style={{ background: `${s.color}22` }}
                  >
                    {s.emoji}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold">{s.name}</h3>
                    <p className="text-xs text-ink-soft">{s.interests.slice(0, 3).join(" · ")}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  <Stat label="Lessons" value={done} />
                  <Stat label="Blessings" value={grat.length} />
                  <Stat label="Journal" value={jour} />
                  <Stat label="Badges" value={badgeCount} />
                </div>
                {latestGratitude && (
                  <p className="mt-3 rounded-2xl bg-sand p-3 text-xs italic text-ink-soft">
                    Latest blessing: &ldquo;{latestGratitude.text}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick links */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/journal" className="wj-card wj-card-hover p-5 text-center">
          <div className="text-2xl">📔</div>
          <div className="mt-1 font-display font-extrabold">Read the journals</div>
        </Link>
        <Link href="/cookbook" className="wj-card wj-card-hover p-5 text-center">
          <div className="text-2xl">📖</div>
          <div className="mt-1 font-display font-extrabold">Cookbook memories</div>
        </Link>
        <Link href="/celebrations" className="wj-card wj-card-hover p-5 text-center">
          <div className="text-2xl">🎂</div>
          <div className="mt-1 font-display font-extrabold">Birthday calendar</div>
        </Link>
      </section>

      <DataBackup />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-sand p-2">
      <div className="font-display text-xl font-extrabold text-ocean-deep">{value}</div>
      <div className="text-[10px] font-bold text-ink-soft">{label}</div>
    </div>
  );
}
