"use client";

import Link from "next/link";
import { useState } from "react";
import { getStudent, students } from "@/config/family";
import { KEYS, todayISO, type GratitudeEntry } from "@/lib/app-state";
import { newId, useStored } from "@/lib/storage";

const prompts = [
  "Today I am grateful to the Lord because...",
  "One blessing I noticed today is...",
  "One thing that made me happy today is...",
];

export default function BlessingsPage() {
  const [activeStudentId, setActiveStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [gratitude, setGratitude] = useStored<GratitudeEntry[]>(KEYS.gratitude, []);
  const [prompt, setPrompt] = useState(prompts[0]);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const student = getStudent(activeStudentId);

  function save() {
    if (!student || !text.trim()) return;
    setGratitude((prev) => [
      { id: newId(), studentId: student.id, date: todayISO(), prompt, text: text.trim() },
      ...prev,
    ]);
    setText("");
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <div className="mb-2 text-4xl">🌅🙏</div>
        <h1 className="font-display text-3xl font-extrabold text-ocean-deep sm:text-4xl">
          Morning Blessings
        </h1>
        <p className="mt-2 text-lg text-ink-soft">
          Take a quiet moment before we begin...
        </p>
        <p className="mt-1 font-display text-xl font-bold text-mango-deep">
          What are you grateful to the Lord for today?
        </p>
      </div>

      {!student ? (
        <div className="wj-card p-6 text-center">
          <p className="mb-4 text-ink-soft">First, tell us who you are:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStudentId(s.id)}
                className="wj-btn wj-btn-ghost"
                style={{ borderColor: s.color }}
              >
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
        </div>
      ) : saved ? (
        <div className="wj-card wj-pop-in p-8 text-center">
          <div className="text-5xl">🌻</div>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-palm-deep">
            Blessing planted, {student.name}!
          </h2>
          <p className="mt-2 text-ink-soft">
            Your gratitude has been added to your journal — and a new flower grows in the
            Gratitude Garden.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/journal" className="wj-btn wj-btn-ocean">
              See the Gratitude Garden 🌸
            </Link>
            <Link href="/today" className="wj-btn">
              Continue to Today&apos;s Adventure 🚀
            </Link>
            <button className="wj-btn wj-btn-ghost" onClick={() => setSaved(false)}>
              Write another
            </button>
          </div>
        </div>
      ) : (
        <div className="wj-card space-y-4 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
              style={{ background: `${student.color}22` }}
            >
              {student.emoji}
            </span>
            <span className="font-display font-extrabold">{student.name}&apos;s blessing</span>
          </div>

          <div className="space-y-2">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className={`block w-full rounded-2xl border-2 p-3 text-left text-sm font-bold transition-colors ${
                  prompt === p
                    ? "border-mango bg-mango/15 text-mango-deep"
                    : "border-sand-deep bg-white text-ink-soft hover:border-mango/50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <textarea
            className="wj-input min-h-32"
            placeholder="Write your blessing here... 💛"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button className="wj-btn w-full" onClick={save} disabled={!text.trim()}>
            Plant this blessing 🌱
          </button>
        </div>
      )}
    </div>
  );
}
