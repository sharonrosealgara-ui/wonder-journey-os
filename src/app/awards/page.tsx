"use client";

import { PageHeader } from "@/components/page-header";
import { badges, getBadge } from "@/config/badges";
import { getStudent, students } from "@/config/family";
import type { Mode } from "@/config/navigation";
import { formatDate, KEYS, type AwardedBadge } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

export default function AwardsPage() {
  const [mode] = useStored<Mode>(KEYS.mode, "family");
  const [awards] = useStored<AwardedBadge[]>(KEYS.awards, []);
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const student = getStudent(activeStudentId);

  // Family Portal is shared — everyone celebrates everyone's badges together.
  const visibleStudents = students;
  void student;

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🏅"
        title="Awards & Badges"
        subtitle="Celebrating every brave word spoken, dish cooked, and kindness shown."
      />

      {visibleStudents.map((s) => {
        const theirAwards = awards.filter((a) => a.studentId === s.id);
        return (
          <section key={s.id} className="wj-card p-6">
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                style={{ background: `${s.color}22` }}
              >
                {s.emoji}
              </span>
              <div>
                <h2 className="font-display text-xl font-extrabold">{s.name}</h2>
                <p className="text-sm text-ink-soft">
                  {theirAwards.length} badge{theirAwards.length === 1 ? "" : "s"} earned
                </p>
              </div>
            </div>
            {theirAwards.length === 0 ? (
              <p className="mt-4 rounded-2xl bg-sand p-4 text-sm text-ink-soft">
                No badges yet — adventures are waiting! 🌟
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {theirAwards.map((a) => {
                  const b = getBadge(a.badgeId);
                  if (!b) return null;
                  return (
                    <div key={a.id} className="rounded-2xl border-2 border-mango/40 bg-mango/10 p-4 text-center">
                      <div className="text-3xl">{b.emoji}</div>
                      <div className="mt-1 font-display text-sm font-extrabold">{b.name}</div>
                      <div className="mt-1 text-xs text-ink-soft">{formatDate(a.date)}</div>
                      {a.note && <div className="mt-1 text-xs italic text-ink-soft">&ldquo;{a.note}&rdquo;</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      <section className="wj-card p-6">
        <h2 className="font-display text-xl font-extrabold">All badges to collect 🎯</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map((b) => (
            <div key={b.id} className="rounded-2xl border-2 border-sand-deep p-4 text-center">
              <div className="text-3xl">{b.emoji}</div>
              <div className="mt-1 font-display text-sm font-extrabold">{b.name}</div>
              <div className="mt-1 text-xs text-ink-soft">{b.description}</div>
            </div>
          ))}
        </div>
        {mode === "teacher" && (
          <p className="mt-4 text-sm text-ink-soft">
            🍎 Award badges from the <b>Teacher Dashboard</b>.
          </p>
        )}
      </section>
    </div>
  );
}
