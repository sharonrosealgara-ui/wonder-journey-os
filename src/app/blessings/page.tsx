"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { familyMembers, familyName, teacherMember, type FamilyMember } from "@/config/family";
import { promptForMember, verseOfTheDay, type Verse } from "@/config/devotional";
import { getTodaysLesson, type Lesson } from "@/config/lessons";
import type { Mode } from "@/config/navigation";
import { normalizeMode } from "@/config/navigation";
import { formatDate, getTodaysPrayerLeader, KEYS, todayISO, type GratitudeEntry } from "@/lib/app-state";
import { sfx } from "@/lib/sound";
import { newId, useStored } from "@/lib/storage";

// 🌅 MORNING BLESSINGS V2 — the family's morning devotional journal.
// Every member has their own journal card; everyone participates
// together before class. Entries feed the Gratitude Garden, the
// Blessings Wall, and Explorer XP automatically (same store).

const confettiColors = ["#ffd23f", "#ff7a59", "#2fb8ad", "#4dbd85", "#ec5d87", "#8890d6"];

export default function BlessingsPage() {
  const [rawMode] = useStored<string>(KEYS.mode, "family");
  const mode: Mode = normalizeMode(rawMode);
  const [entries, setEntries] = useStored<GratitudeEntry[]>(KEYS.gratitude, []);
  const [verse, setVerse] = useState<Verse | null>(null);
  const [leader, setLeader] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [archiveFilter, setArchiveFilter] = useState<string>("all");

  useEffect(() => {
    setVerse(verseOfTheDay());
    setLeader(getTodaysPrayerLeader());
    setDateLabel(formatDate(todayISO()));
    setLesson(getTodaysLesson());
  }, []);

  const today = todayISO();
  const members: FamilyMember[] = useMemo(
    () => (mode === "teacher" ? [...familyMembers, teacherMember] : familyMembers),
    [mode]
  );

  const todayEntryFor = (id: string) =>
    entries.find((e) => e.studentId === id && e.date === today);

  // family progress counts the 7 family members (teacher writes too, but
  // the family celebration is about the family)
  const doneCount = familyMembers.filter((m) => todayEntryFor(m.id)).length;
  const allDone = doneCount === familyMembers.length;

  function saveEntry(member: FamilyMember, prompt: string, text: string, prayer: string, kindness: string) {
    setEntries((prev) => [
      {
        id: newId(),
        studentId: member.id,
        date: today,
        prompt,
        text: text.trim(),
        prayer: prayer.trim() || undefined,
        kindness: kindness.trim() || undefined,
      },
      ...prev,
    ]);
    sfx.correct();
  }

  function encourage(entryId: string, patch: Partial<GratitudeEntry>) {
    setEntries((prev) => prev.map((e) => (e.id === entryId ? { ...e, ...patch } : e)));
  }

  const pastDates = useMemo(() => {
    const dates = [...new Set(entries.filter((e) => e.date !== today).map((e) => e.date))];
    return dates.sort((a, b) => b.localeCompare(a)).slice(0, 14);
  }, [entries, today]);

  return (
    <div className="space-y-8">
      {/* ── Sunrise hero ─────────────────────────────────────── */}
      <section className="wj-card relative overflow-hidden p-0">
        <div className="relative bg-gradient-to-b from-[#ffe9c4] via-[#ffd9b0] to-[#cfe7f5] px-6 py-10 text-center sm:py-12">
          {/* gentle sunrise scene — edges only, never over the words */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="wj-sun-rays absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 opacity-60"
              style={{
                background: "repeating-conic-gradient(from 0deg, rgba(255,214,92,0.4) 0deg 6deg, transparent 6deg 14deg)",
                maskImage: "radial-gradient(circle, black 25%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(circle, black 25%, transparent 70%)",
              }}
            />
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl">🌞</span>
            <span className="wj-cloud text-4xl opacity-60" style={{ left: 0, top: "12%", animationDuration: "48s" }}>☁️</span>
            <span className="wj-cloud text-3xl opacity-45" style={{ left: 0, top: "28%", animationDuration: "66s", animationDelay: "-30s" }}>☁️</span>
            <span className="wj-bob absolute left-[4%] top-[38%] text-2xl">🕊️</span>
            <span className="wj-bob absolute right-[5%] top-[30%] text-xl" style={{ animationDelay: "-1.4s" }}>🦋</span>
            <span className="wj-sway-soft absolute bottom-2 left-3 text-3xl">🌷</span>
            <span className="wj-sway-soft absolute bottom-2 right-3 text-3xl" style={{ animationDelay: "-2s" }}>🌻</span>
            <span className="absolute bottom-3 left-1/4 text-xl opacity-70">🌼</span>
            <span className="absolute bottom-3 right-1/4 text-xl opacity-70">🌸</span>
          </div>

          <div className="relative">
            <p className="font-hand text-lg text-ink-soft">{dateLabel}</p>
            <h1 className="wj-outline mt-1 font-display text-4xl sm:text-5xl">
              🌞 Good Morning, {familyName.replace("The ", "")}!
            </h1>
            <p className="font-hand mx-auto mt-3 max-w-xl text-xl text-ink-soft">
              Before we begin today&apos;s adventure, let&apos;s spend a few quiet moments
              thanking the Lord together.
            </p>

            {verse && (
              <blockquote className="mx-auto mt-6 max-w-2xl rounded-3xl border-2 border-mango/60 bg-paper/90 px-6 py-5 shadow-lg">
                <p className="font-display text-lg leading-relaxed text-ink sm:text-xl">
                  “{verse.text}”
                </p>
                <footer className="mt-2 font-hand text-lg text-mango-deep">— {verse.ref}</footer>
              </blockquote>
            )}

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-paper/90 px-5 py-2 shadow">
              <span className="text-xl">🙏</span>
              <span className="text-sm font-bold text-ink-soft">Today&apos;s Prayer Leader:</span>
              <span className="font-display text-lg text-ube-deep">{leader || "…"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Family blessing progress ─────────────────────────── */}
      <section className="wj-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl">🌈 Family Blessing Progress</h2>
          <span className="wj-chip">{doneCount} of {familyMembers.length} completed</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-sand-deep">
          <div
            className="h-full rounded-full bg-gradient-to-r from-mango via-sunset to-palm transition-[width] duration-700"
            style={{ width: `${(doneCount / familyMembers.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {familyMembers.map((m) => {
            const done = !!todayEntryFor(m.id);
            return (
              <span key={m.id} className={`wj-chip ${done ? "!bg-palm/15 !text-palm-deep" : ""}`}>
                {done ? "🟢" : "⚪"} {m.emoji} {m.name.split(" ")[0]} {done ? "✓" : ""}
              </span>
            );
          })}
        </div>
      </section>

      {/* ── Celebration when the whole family is done ────────── */}
      {allDone && (
        <section className="wj-card relative overflow-hidden p-8 text-center">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 26 }).map((_, i) => (
              <span
                key={i}
                className="wj-confetti"
                style={{
                  left: `${(i * 41) % 100}%`,
                  background: confettiColors[i % confettiColors.length],
                  animationDuration: `${2.6 + (i % 5) * 0.5}s`,
                  animationDelay: `${(i % 8) * 0.3}s`,
                }}
              />
            ))}
          </div>
          <div className="relative">
            <div className="text-5xl">🎉🌅</div>
            <h2 className="wj-outline mt-2 font-display text-3xl">
              The whole family has completed Morning Blessings!
            </h2>
            <p className="font-hand mt-2 text-xl text-ink-soft">
              What a beautiful way to begin. The Lord loves a grateful family. 💛
            </p>
            {lesson && (
              <Link href={`/adventure/${lesson.id}`} className="wj-btn mt-5 text-lg">
                🚀 Begin Today&apos;s Adventure
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── One devotional journal card per member ───────────── */}
      <section>
        <h2 className="wj-outline font-display text-2xl">📖 Our Morning Journals</h2>
        <p className="font-hand mb-4 mt-1 text-lg text-ink-soft">
          Everyone has their own page today — write, share, and pray together.
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          {members.map((m, i) => (
            <MemberJournalCard
              key={m.id}
              member={m}
              promptText={promptForMember(i)}
              entry={todayEntryFor(m.id)}
              isTeacherMode={mode === "teacher"}
              onSave={saveEntry}
              onEncourage={encourage}
            />
          ))}
        </div>
      </section>

      {/* ── Family Prayer Wall (today) ───────────────────────── */}
      <section>
        <h2 className="wj-outline font-display text-2xl">🙏 Family Prayer Wall</h2>
        <p className="font-hand mb-4 mt-1 text-lg text-ink-soft">
          Today&apos;s blessings and prayers, side by side.
        </p>
        {familyMembers.every((m) => !todayEntryFor(m.id)) ? (
          <div className="wj-card p-6 text-center font-hand text-lg text-ink-soft">
            The wall is waiting for today&apos;s first blessing. 💛
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {members
              .map((m) => ({ m, e: todayEntryFor(m.id) }))
              .filter((x): x is { m: FamilyMember; e: GratitudeEntry } => !!x.e)
              .map(({ m, e }, i) => (
                <div
                  key={m.id}
                  className={`wj-card p-5 ${i % 3 === 0 ? "rotate-1" : i % 3 === 1 ? "-rotate-1" : "rotate-0"}`}
                  style={{ borderTop: `6px solid ${m.color}` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="wj-sticker h-9 w-9 text-lg">{m.emoji}</span>
                    <div>
                      <p className="font-display leading-tight">{m.name}</p>
                      <p className="text-[11px] text-ink-soft">{formatDate(e.date)}</p>
                    </div>
                    {(e.hearts ?? 0) > 0 && <span className="ml-auto wj-chip">❤️ {e.hearts}</span>}
                  </div>
                  <p className="font-hand mt-3 text-lg leading-snug">{e.text}</p>
                  {e.prayer && (
                    <p className="mt-2 rounded-2xl bg-ube/10 p-2.5 font-hand text-base text-ink">
                      🙏 {e.prayer}
                    </p>
                  )}
                  {e.kindness && (
                    <p className="mt-2 rounded-2xl bg-palm/10 p-2.5 font-hand text-base text-ink">
                      💗 Kindness goal: {e.kindness}
                    </p>
                  )}
                  {e.teacherNote && (
                    <p className="mt-2 rounded-2xl bg-mango/15 p-2.5 font-hand text-base text-ink">
                      👩‍🏫 “{e.teacherNote}”
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </section>

      {/* ── Past mornings (journal archive) ──────────────────── */}
      {pastDates.length > 0 && (
        <section>
          <h2 className="wj-outline font-display text-2xl">🗂️ Past Mornings</h2>
          <div className="mb-4 mt-2 flex flex-wrap gap-2">
            <FilterChip active={archiveFilter === "all"} onClick={() => setArchiveFilter("all")} label="Everyone" />
            {familyMembers.map((m) => (
              <FilterChip
                key={m.id}
                active={archiveFilter === m.id}
                onClick={() => setArchiveFilter(m.id)}
                label={`${m.emoji} ${m.name.split(" ")[0]}`}
              />
            ))}
          </div>
          <div className="space-y-4">
            {pastDates.map((d) => {
              const dayEntries = entries.filter(
                (e) => e.date === d && (archiveFilter === "all" || e.studentId === archiveFilter)
              );
              if (dayEntries.length === 0) return null;
              return (
                <div key={d} className="wj-card p-5">
                  <p className="font-display text-ink-soft">{formatDate(d)}</p>
                  <div className="mt-2 space-y-2">
                    {dayEntries.map((e) => {
                      const m = members.find((x) => x.id === e.studentId);
                      return (
                        <p key={e.id} className="font-hand text-lg">
                          <span className="mr-1">{m?.emoji ?? "💛"}</span>
                          <b>{m?.name ?? "Family"}:</b> {e.text}
                          {e.prayer ? <span className="text-ink-soft"> · 🙏 {e.prayer}</span> : null}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── One member's journal card ─────────────────────────────── */
function MemberJournalCard({ member, promptText, entry, isTeacherMode, onSave, onEncourage }: {
  member: FamilyMember;
  promptText: string;
  entry: GratitudeEntry | undefined;
  isTeacherMode: boolean;
  onSave: (m: FamilyMember, prompt: string, text: string, prayer: string, kindness: string) => void;
  onEncourage: (entryId: string, patch: Partial<GratitudeEntry>) => void;
}) {
  // drafts autosave per member per day — closing the page never loses words
  const draftKey = `bdraft-${member.id}-${todayISO()}`;
  const [draft, setDraft] = useStored<{ text: string; prayer: string; kindness: string }>(draftKey, {
    text: "",
    prayer: "",
    kindness: "",
  });
  const [note, setNote] = useState("");

  const lined = {
    backgroundImage:
      "repeating-linear-gradient(transparent, transparent 2.05rem, rgba(93,118,163,0.25) 2.05rem, rgba(93,118,163,0.25) calc(2.05rem + 1px))",
  } as const;

  return (
    <div className="wj-card overflow-hidden">
      {/* journal cover spine */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ background: `${member.color}22`, borderBottom: `3px solid ${member.color}` }}>
        <span className="wj-sticker h-11 w-11 text-2xl">{member.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg leading-tight">{member.name}&apos;s Journal</p>
          <p className="font-hand text-sm text-ink-soft">{promptText}</p>
        </div>
        {entry && <span className="wj-chip !bg-palm/15 !text-palm-deep">✅ Done</span>}
      </div>

      {entry ? (
        <div className="space-y-3 p-5">
          <p className="font-hand text-xl leading-[2.05rem]" style={lined}>{entry.text}</p>
          {entry.prayer && <p className="rounded-2xl bg-ube/10 p-3 font-hand text-lg">🙏 {entry.prayer}</p>}
          {entry.kindness && <p className="rounded-2xl bg-palm/10 p-3 font-hand text-lg">💗 {entry.kindness}</p>}
          {entry.teacherNote && (
            <p className="rounded-2xl bg-mango/15 p-3 font-hand text-lg">👩‍🏫 “{entry.teacherNote}”</p>
          )}
          {isTeacherMode && (
            <div className="flex flex-wrap items-center gap-2 border-t-2 border-sand-deep pt-3">
              <button
                className="wj-chip hover:bg-hibiscus/15"
                onClick={() => onEncourage(entry.id, { hearts: (entry.hearts ?? 0) + 1 })}
              >
                ❤️ {entry.hearts ?? 0}
              </button>
              <input
                className="wj-input !w-auto flex-1 !py-1.5 text-sm"
                placeholder="Leave encouragement…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button
                className="wj-btn wj-btn-ocean !px-3 !py-1.5 text-sm"
                onClick={() => {
                  if (note.trim()) {
                    onEncourage(entry.id, { teacherNote: note.trim() });
                    setNote("");
                  }
                }}
              >
                Send 📝
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 p-5">
          <textarea
            className="wj-input font-hand min-h-36 !border-0 !p-1 text-xl !shadow-none leading-[2.05rem] focus:!shadow-none"
            style={lined}
            placeholder="Write your blessing here…"
            value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          />
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-hand text-sm">🌱 Beautiful thoughts grow here.</span>
            <span>{draft.text.length} letters</span>
          </div>
          <input
            className="wj-input"
            placeholder="🙏 Today's prayer request (optional)"
            value={draft.prayer}
            onChange={(e) => setDraft({ ...draft, prayer: e.target.value })}
          />
          <input
            className="wj-input"
            placeholder="💗 How will I show kindness today? (optional)"
            value={draft.kindness}
            onChange={(e) => setDraft({ ...draft, kindness: e.target.value })}
          />
          <button
            className="wj-btn w-full"
            disabled={!draft.text.trim()}
            onClick={() => {
              onSave(member, promptText, draft.text, draft.prayer, draft.kindness);
              setDraft({ text: "", prayer: "", kindness: "" });
            }}
          >
            Plant this blessing 🌱
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
        active ? "bg-sunset text-white shadow" : "bg-white text-ink-soft hover:bg-sand-deep"
      }`}
    >
      {label}
    </button>
  );
}
