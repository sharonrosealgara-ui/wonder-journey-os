"use client";

import { useEffect, useState } from "react";
import { birthdayBlessing, getTodaysBirthdays } from "@/config/celebrations";
import { KEYS, todayISO, type VoiceGift } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

const confettiColors = ["#ffb42e", "#ff7d4d", "#14a3a8", "#4da66a", "#e5568a", "#7f7ad1"];

export function BirthdayPopup() {
  const [dismissedOn, setDismissedOn] = useStored<string | null>(KEYS.birthdayDismissed, null);
  const [gifts] = useStored<VoiceGift[]>(KEYS.voiceGifts, []);
  const [birthdays, setBirthdays] = useState<ReturnType<typeof getTodaysBirthdays>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBirthdays(getTodaysBirthdays());
    setMounted(true);
  }, []);

  if (!mounted || birthdays.length === 0 || dismissedOn === todayISO()) return null;

  const names = birthdays.map((b) => b.name).join(" & ");
  // voice gifts recorded for anyone celebrating today
  const birthdayIds = new Set(birthdays.map((b) => b.id));
  const todaysGifts = gifts.filter((g) => birthdayIds.has(g.celebrationId));

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

        {/* 🎁 Voice gifts the family recorded for the celebrant */}
        {todaysGifts.length > 0 && (
          <div className="mt-5 rounded-2xl bg-mango/10 p-3 text-left">
            <p className="text-center font-display text-sm font-extrabold text-sunset-deep">
              🎁 {todaysGifts.length === 1 ? "A voice gift is" : `${todaysGifts.length} voice gifts are`} waiting for you!
            </p>
            <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto">
              {todaysGifts.map((g) => (
                <li key={g.id} className="flex items-center gap-2 rounded-xl bg-white/70 p-2">
                  <span className="text-xl">{g.fromEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-xs font-extrabold">{g.fromName}</p>
                    <audio controls src={g.audio} className="mt-0.5 h-8 w-full" />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-1 text-center font-hand text-xs text-ink-soft">
              Press play to hear each loving message 💛
            </p>
          </div>
        )}

        <button className="wj-btn mt-6" onClick={() => setDismissedOn(todayISO())}>
          Continue to Adventure Home ✨
        </button>
      </div>
    </div>
  );
}
