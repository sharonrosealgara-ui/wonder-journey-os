"use client";

import { useEffect, useState } from "react";
import { birthdayBlessing, getTodaysBirthdays } from "@/config/celebrations";
import { KEYS, todayISO } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

const confettiColors = ["#ffb42e", "#ff7d4d", "#14a3a8", "#4da66a", "#e5568a", "#7f7ad1"];

export function BirthdayPopup() {
  const [dismissedOn, setDismissedOn] = useStored<string | null>(KEYS.birthdayDismissed, null);
  const [birthdays, setBirthdays] = useState<ReturnType<typeof getTodaysBirthdays>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBirthdays(getTodaysBirthdays());
    setMounted(true);
  }, []);

  if (!mounted || birthdays.length === 0 || dismissedOn === todayISO()) return null;

  const names = birthdays.map((b) => b.name).join(" & ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
      {/* confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="wj-confetti"
            style={{
              left: `${(i * 37) % 100}%`,
              background: confettiColors[i % confettiColors.length],
              animationDuration: `${2.4 + (i % 5) * 0.5}s`,
              animationDelay: `${(i % 10) * 0.25}s`,
            }}
          />
        ))}
      </div>

      <div className="wj-card wj-pop-in relative w-full max-w-md p-8 text-center">
        <div className="mb-2 text-4xl">
          <span className="wj-balloon">🎈</span>
          <span className="wj-balloon" style={{ animationDelay: "0.4s" }}>🎂</span>
          <span className="wj-balloon" style={{ animationDelay: "0.8s" }}>🎈</span>
        </div>
        <h2 className="font-display text-3xl font-extrabold text-hibiscus">
          Happy Birthday, {names}!
        </h2>
        <p className="mt-3 text-ink-soft">{birthdayBlessing}</p>
        <p className="mt-2 font-display text-lg font-bold text-mango-deep">
          Maligayang kaarawan! 🎉
        </p>
        <button className="wj-btn mt-6" onClick={() => setDismissedOn(todayISO())}>
          Continue to Adventure Home ✨
        </button>
      </div>
    </div>
  );
}
