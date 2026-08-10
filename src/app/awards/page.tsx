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
    <div className="space-y-8 pb-10">
      <div className="relative z-10 mb-8 bg-gradient-to-br from-mango/5 to-hibiscus/5 p-8 rounded-3xl border border-white shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[-1]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 30 Q 25 5 50 30 T 100 30' stroke='%23004060' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
               backgroundSize: "200px 200px"
             }}
        />
        <PageHeader
          emoji="🏅"
          title="Awards & Badges"
          subtitle="Celebrating every brave word spoken, dish cooked, and kindness shown."
        />
      </div>

      {visibleStudents.map((s) => {
        const theirAwards = awards.filter((a) => a.studentId === s.id);
        return (
          <section key={s.id} className="wj-card p-6 border-2 border-white/60 shadow-lg bg-white/90 backdrop-blur-sm relative overflow-hidden group transition-all duration-300">
            {/* Subtle student color glow */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: s.color }} />
            
            <div className="flex items-center gap-4 border-b-2 border-sand/50 pb-5 mb-5">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm border border-white"
                style={{ background: `linear-gradient(135deg, ${s.color}22, ${s.color}44)` }}
              >
                {s.emoji}
              </span>
              <div>
                <h2 className="font-display text-2xl font-extrabold text-ocean-deep">{s.name}</h2>
                <p className="text-sm font-bold uppercase tracking-widest text-ink-soft/70">
                  {theirAwards.length} badge{theirAwards.length === 1 ? "" : "s"} earned
                </p>
              </div>
            </div>
            
            {theirAwards.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-sand bg-gradient-to-br from-sand/30 to-sand/10">
                <div className="text-6xl mb-4 opacity-50 grayscale drop-shadow-sm">🏆</div>
                <p className="font-display font-bold text-xl text-ocean-deep mb-2">
                  Your badge shelf is ready!
                </p>
                <p className="font-medium text-ink-soft max-w-sm leading-relaxed">
                  Finish today&apos;s adventure and the first badge is yours.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {theirAwards.map((a) => {
                  const b = getBadge(a.badgeId);
                  if (!b) return null;
                  return (
                    <div key={a.id} className="group/badge relative rounded-2xl border-[3px] border-mango/30 bg-gradient-to-b from-white to-mango/10 p-5 text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:rotate-2 shadow-sm hover:shadow-xl hover:border-mango/60 active:scale-95 cursor-pointer">
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/badge:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                      <div className="wj-sticker-art text-5xl drop-shadow-md group-hover/badge:drop-shadow-xl group-hover/badge:scale-110 transition-all duration-300">{b.emoji}</div>
                      <div className="mt-4 font-display text-sm font-extrabold text-ocean-deep leading-tight">{b.name}</div>
                      <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-ink-soft/80">{formatDate(a.date)}</div>
                      {a.note && <div className="mt-3 rounded-xl bg-white/60 p-2 text-xs font-medium text-ink italic border border-mango/20 leading-snug shadow-inner">&ldquo;{a.note}&rdquo;</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      <section className="wj-card p-8 border-2 border-white/60 shadow-lg bg-sand/30 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-sand/60 pb-4">
          <span className="text-3xl drop-shadow-sm">🎯</span>
          <h2 className="font-display text-2xl font-extrabold text-ocean-deep">All badges to collect</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {badges.map((b) => (
            <div key={b.id} className="rounded-2xl border-2 border-sand-deep/40 bg-white/50 p-5 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:bg-white/80 cursor-help group shadow-inner">
              <div className="wj-sticker-art text-4xl opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-500 drop-shadow-sm">{b.emoji}</div>
              <div className="mt-3 font-display text-[13px] font-extrabold text-ocean-deep/80 leading-tight">{b.name}</div>
              <div className="mt-2 text-xs text-ink-soft/90 font-medium leading-relaxed">{b.description}</div>
            </div>
          ))}
        </div>
        {mode === "teacher" && (
          <div className="mt-6 p-4 rounded-xl bg-white/60 border border-sand-deep/30 flex items-center gap-3 text-sm font-medium text-ink shadow-sm">
            <span className="text-2xl">🍎</span>
            <p>Award badges from the <b className="text-ocean-deep">Teacher Dashboard</b>.</p>
          </div>
        )}
      </section>
    </div>
  );
}
