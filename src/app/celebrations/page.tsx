"use client";

import { PageHeader } from "@/components/page-header";
import { VoiceGifts } from "@/components/voice-gifts";
import { celebrations, daysUntil } from "@/config/celebrations";
import { getStudent } from "@/config/family";
import { KEYS } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CelebrationsPage() {
  const [, setDismissed] = useStored<string | null>(KEYS.birthdayDismissed, null);

  const sorted = [...celebrations].sort((a, b) => daysUntil(a) - daysUntil(b));
  const next = sorted[0];

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🎉"
        title="Family Celebrations"
        subtitle="Birthdays, milestones, and every reason to celebrate together."
      />

      {/* Countdown to the next celebration */}
      {next && (
        <section className="wj-card bg-gradient-to-br from-hibiscus/15 to-ube/10 p-6 text-center sm:p-8">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-ink-soft">
            Next celebration
          </p>
          <div className="mt-2 text-5xl">{next.emoji}</div>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-hibiscus-deep">
            {next.type === "birthday" ? `${next.name}'s Birthday` : next.name}
          </h2>
          <p className="mt-1 text-ink-soft">
            {monthNames[next.month - 1]} {next.day}
          </p>
          <div className="wj-pop-in mx-auto mt-4 inline-block rounded-2xl bg-white px-8 py-4 shadow">
            <span className="font-display text-4xl font-extrabold text-sunset-deep">
              {daysUntil(next)}
            </span>
            <span className="ml-2 text-ink-soft">
              {daysUntil(next) === 1 ? "day to go!" : daysUntil(next) === 0 ? "— TODAY! 🎊" : "days to go!"}
            </span>
          </div>
        </section>
      )}

      {/* 🎙️ Voice messages for the celebrant */}
      <VoiceGifts />

      {/* Calendar list */}
      <section className="wj-card p-6">
        <h2 className="font-display text-xl font-extrabold">📅 Celebration calendar</h2>
        <div className="mt-4 space-y-2">
          {sorted.map((c) => {
            const s = c.studentId ? getStudent(c.studentId) : undefined;
            const days = daysUntil(c);
            return (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-2xl border-2 border-sand-deep p-3"
                style={s ? { borderColor: `${s.color}55` } : undefined}
              >
                <span className="text-2xl">{c.emoji}</span>
                <div className="flex-1">
                  <div className="font-display font-extrabold">
                    {c.type === "birthday" ? `${c.name}'s Birthday 🎂` : c.name}
                  </div>
                  <div className="text-sm text-ink-soft">
                    {monthNames[c.month - 1]} {c.day} · {c.note}
                  </div>
                </div>
                <span className={`wj-chip ${days <= 7 ? "!bg-hibiscus/15 !text-hibiscus-deep" : ""}`}>
                  {days === 0 ? "Today! 🎉" : `${days}d`}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 rounded-2xl bg-sand p-3 text-xs text-ink-soft">
          ✏️ To update birthdays, edit <b>src/config/celebrations.ts</b> — the pop-up, countdown,
          and calendar all follow automatically. Feast days and family milestones can be added the
          same way.
        </p>
      </section>

      {/* Preview the pop-up */}
      <section className="wj-card p-6 text-center">
        <h2 className="font-display text-lg font-extrabold">🎈 Birthday pop-up</h2>
        <p className="mt-1 text-sm text-ink-soft">
          On a family member&apos;s birthday, a celebration pop-up with balloons, confetti, and a
          blessing appears right after login. If you dismissed today&apos;s pop-up, you can bring
          it back:
        </p>
        <button className="wj-btn wj-btn-hibiscus mt-4" onClick={() => setDismissed(null)}>
          Replay today&apos;s birthday pop-up 🎊
        </button>
        <p className="mt-2 text-xs text-ink-soft">(It only appears if today is someone&apos;s birthday.)</p>
      </section>
    </div>
  );
}
