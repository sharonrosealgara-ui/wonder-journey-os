"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { getStudent, students } from "@/config/family";
import type { Mode } from "@/config/navigation";
import { formatDate, KEYS, todayISO, type GratitudeEntry, type JournalEntry } from "@/lib/app-state";
import { newId, useStored } from "@/lib/storage";

const flowers = ["🌸", "🌻", "🌺", "🌼", "🌷", "🪻", "🌹", "💐"];

type Tab = "garden" | "wall" | "journal";

export default function JournalPage() {
  const [tab, setTab] = useState<Tab>("garden");
  const [mode] = useStored<Mode>(KEYS.mode, "family");
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [gratitude] = useStored<GratitudeEntry[]>(KEYS.gratitude, []);
  const [journal, setJournal] = useStored<JournalEntry[]>(KEYS.journal, []);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const student = getStudent(activeStudentId);
  const isTeacher = mode === "teacher";

  // The Family Portal is shared — the whole family sees the whole garden,
  // wall, and journal together (Decision 040: no per-student logins).
  const visibleGratitude = gratitude;
  const visibleJournal = journal;

  function addJournal() {
    if (!student || !text.trim()) return;
    setJournal((prev) => [
      { id: newId(), studentId: student.id, date: todayISO(), title: title.trim() || "My journal entry", text: text.trim() },
      ...prev,
    ]);
    setTitle("");
    setText("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="📔"
        title="Gratitude Journal"
        subtitle="Every blessing you write plants a flower in the family garden."
      />

      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === "garden"} onClick={() => setTab("garden")}>🌸 Gratitude Garden</TabButton>
        <TabButton active={tab === "wall"} onClick={() => setTab("wall")}>🧱 Family Blessings Wall</TabButton>
        <TabButton active={tab === "journal"} onClick={() => setTab("journal")}>✏️ My Journal</TabButton>
      </div>

      {tab === "garden" && (
        <section className="wj-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-palm-deep">
            The Family Gratitude Garden
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            {visibleGratitude.length === 0
              ? "The garden is waiting for its first flower — write a Morning Blessing to plant one!"
              : `${visibleGratitude.length} flower${visibleGratitude.length === 1 ? "" : "s"} of gratitude have bloomed 🌱`}
          </p>
          <div className="mt-6 flex min-h-24 flex-wrap items-end gap-1 rounded-2xl bg-gradient-to-t from-palm/20 to-transparent p-4 text-4xl">
            {visibleGratitude.map((g, i) => (
              <span key={g.id} title={`${getStudent(g.studentId)?.name ?? ""}: ${g.text}`} className="cursor-help transition-transform hover:scale-125">
                {flowers[i % flowers.length]}
              </span>
            ))}
            {visibleGratitude.length === 0 && <span className="text-2xl">🌱</span>}
          </div>
        </section>
      )}

      {tab === "wall" && (
        <section className="space-y-3">
          {gratitude.length === 0 && (
            <div className="wj-card p-6 text-center text-ink-soft">
              The Blessings Wall fills up as the family writes Morning Blessings. 💛
            </div>
          )}
          {gratitude.map((g) => {
            const s = getStudent(g.studentId);
            return (
              <div key={g.id} className="wj-card p-5">
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: `${s?.color ?? "#ccc"}22` }}
                  >
                    {s?.emoji ?? "💛"}
                  </span>
                  <span className="font-display font-extrabold">{s?.name ?? "Family"}</span>
                  <span className="text-ink-soft">· {formatDate(g.date)}</span>
                </div>
                <p className="mt-2 text-sm italic text-ink-soft">{g.prompt}</p>
                <p className="mt-1">{g.text}</p>
              </div>
            );
          })}
        </section>
      )}

      {tab === "journal" && (
        <section className="space-y-4">
          {student && !isTeacher && (
            <div className="wj-card space-y-3 p-6">
              <h2 className="font-display text-lg font-extrabold">Write a new entry ✏️</h2>
              <input
                className="wj-input"
                placeholder="Title (like 'My favorite part of today')"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="wj-input min-h-28"
                placeholder="What do you want to remember about today?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button className="wj-btn" onClick={addJournal} disabled={!text.trim()}>
                Save entry 💾
              </button>
            </div>
          )}
          {visibleJournal.length === 0 && (
            <div className="wj-card p-6 text-center text-ink-soft">No journal entries yet.</div>
          )}
          {visibleJournal.map((j) => {
            const s = getStudent(j.studentId);
            return (
              <div key={j.id} className="wj-card p-5">
                <div className="flex items-center gap-2 text-sm text-ink-soft">
                  <span>{s?.emoji}</span>
                  <span className="font-display font-extrabold text-ink">{s?.name}</span>
                  <span>· {formatDate(j.date)}</span>
                </div>
                <h3 className="mt-1 font-display text-lg font-extrabold">{j.title}</h3>
                <p className="mt-1 whitespace-pre-wrap">{j.text}</p>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 font-display text-sm font-bold transition-colors ${
        active ? "bg-ocean text-white shadow" : "bg-white text-ink-soft hover:bg-sand-deep"
      }`}
    >
      {children}
    </button>
  );
}
