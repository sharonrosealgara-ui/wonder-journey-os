"use client";

import { useEffect, useState } from "react";
import { prayerLeaders } from "@/config/family";
import { getTodaysPrayerLeader, getTomorrowsPrayerLeader } from "@/lib/app-state";

export default function PrayerPage() {
  const [leader, setLeader] = useState("");
  const [tomorrow, setTomorrow] = useState("");

  useEffect(() => {
    setLeader(getTodaysPrayerLeader());
    setTomorrow(getTomorrowsPrayerLeader());
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <div className="mb-2 text-4xl">🕊️</div>
        <h1 className="font-display text-3xl font-extrabold text-ube sm:text-4xl">Opening Prayer</h1>
        <p className="mt-2 text-ink-soft">A gentle moment to begin our adventure with the Lord.</p>
      </div>

      <div className="wj-card p-8 text-center">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-ink-soft">
          Today&apos;s Prayer Leader
        </p>
        <div className="wj-pop-in mt-4 inline-flex flex-col items-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ube/15 text-4xl">
            🌟
          </span>
          <span className="mt-3 font-display text-3xl font-extrabold text-ube">
            {leader || "..."}
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-md rounded-2xl bg-sand p-5 text-ink-soft">
          If you feel comfortable, you may lead us in a short opening prayer. If not, another
          family member or Teacher Sharon can lead. 💛
        </p>
        <p className="mt-4 text-sm text-ink-soft">
          Prayer is always an invitation, never a requirement.
        </p>
      </div>

      <div className="wj-card p-6">
        <h2 className="font-display text-lg font-extrabold">Prayer ideas 💡</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          <li>🙏 Thank the Lord for one thing from your Morning Blessing.</li>
          <li>🌏 Ask a blessing over the people of the Philippines as we learn about them.</li>
          <li>👨‍👩‍👧‍👦 Pray for each member of the family by name.</li>
          <li>📖 Keep it short and from the heart — the Lord loves simple prayers.</li>
        </ul>
      </div>

      <div className="wj-card p-6">
        <h2 className="font-display text-lg font-extrabold">The rotation 🔄</h2>
        <p className="mt-1 text-sm text-ink-soft">
          The leader rotates automatically each day. Tomorrow: <b>{tomorrow}</b>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {prayerLeaders.map((p) => (
            <span
              key={p}
              className={`wj-chip ${p === leader ? "!bg-ube/20 !text-ube" : ""}`}
            >
              {p === leader ? "🌟 " : ""}{p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
