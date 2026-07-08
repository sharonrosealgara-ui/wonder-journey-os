"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SlideView } from "@/components/adventure/slide-views";
import { CopyButton } from "@/components/copy-button";
import { getStudent, students } from "@/config/family";
import { lessons, type Lesson } from "@/config/lessons";
import type { Mode } from "@/config/navigation";
import { getTodaysPrayerLeader, KEYS, todayISO } from "@/lib/app-state";
import { buildMission, buildSlides } from "@/lib/slides";
import { useStored } from "@/lib/storage";

// Three-tier Age Adaptation (Decision 042): the family learns together,
// each child gets age-appropriate challenge.
type ExplorerLevel = "explorer" | "adventure" | "trailblazer";

const levelMeta: Record<ExplorerLevel, { emoji: string; label: string; ages: string }> = {
  explorer: { emoji: "🐣", label: "Explorer", ages: "7–8" },
  adventure: { emoji: "🦅", label: "Adventure", ages: "9–10" },
  trailblazer: { emoji: "🏔️", label: "Trailblazer", ages: "11–12" },
};

function levelForAge(age: number): ExplorerLevel {
  return age <= 8 ? "explorer" : age <= 10 ? "adventure" : "trailblazer";
}

// 🌴 ADVENTURE THEATER — the Family Adventure Classroom.
// A full-screen presentation mode (like Canva presentation mode)
// generated automatically from any Lesson config object.

export function AdventureTheater({ lesson }: { lesson: Lesson }) {
  const slides = useMemo(() => buildSlides(lesson), [lesson]);
  const [index, setIndex] = useState(0);
  const [showChapters, setShowChapters] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(false); // teacher sees the prep checklist first
  const [level, setLevel] = useState<ExplorerLevel>("adventure");
  const stageRef = useRef<HTMLDivElement>(null);

  const [mode] = useStored<Mode>(KEYS.mode, "family");
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);

  // Age Level Adaptation: default from the selected explorer's age.
  useEffect(() => {
    const s = getStudent(activeStudentId);
    if (s) setLevel(levelForAge(s.age));
  }, [activeStudentId]);

  // Portal to <body> so the theater escapes the app shell's stacking
  // context and truly covers everything (header, nav, footer).
  useEffect(() => setMounted(true), []);

  const slide = slides[index];

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, slides.length - 1)),
    [slides.length]
  );
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  // class timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // keyboard navigation (arrows / space) — but never while typing
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // scroll stage back to top on slide change
  useEffect(() => {
    stageRef.current?.scrollTo({ top: 0 });
  }, [index]);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-sky">
      {/* watercolor wash behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70rem 35rem at 10% -5%, rgba(255,255,255,0.55) 0%, transparent 60%)," +
            "radial-gradient(ellipse 55rem 30rem at 105% 20%, rgba(165,198,230,0.8) 0%, transparent 65%)," +
            "radial-gradient(ellipse 60rem 40rem at 90% 110%, rgba(140,186,226,0.6) 0%, transparent 60%)",
        }}
      />

      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="relative z-20 flex items-center gap-2 border-b-2 border-sand-deep bg-paper/90 px-3 py-2 backdrop-blur">
        <span className="text-xl">🌺</span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-display text-sm text-sunset-deep">
            {lesson.emoji} {lesson.title}
          </p>
          <p className="hidden text-[11px] text-ink-soft sm:block">
            Today&apos;s Episode {lesson.order} · Adventure Theater
          </p>
        </div>
        {/* Timer is a teacher tool — never shown to the family (Decision 042) */}
        {mode === "teacher" && (
          <span className="wj-chip hidden sm:inline-flex">⏱️ {mins}:{secs}</span>
        )}
        <button
          className="wj-chip hover:bg-mango/20"
          onClick={() =>
            setLevel((l) =>
              l === "explorer" ? "adventure" : l === "adventure" ? "trailblazer" : "explorer"
            )
          }
          title={`Age Adaptation (ages ${levelMeta[level].ages}) — tap to switch tier`}
        >
          {levelMeta[level].emoji}{" "}
          <span className="hidden sm:inline">{levelMeta[level].label}</span>
        </button>
        <button
          className="wj-chip hover:bg-mango/20"
          onClick={() => setShowChapters((s) => !s)}
          title="Adventure Map — jump to any chapter"
        >
          🗺️ <span className="hidden sm:inline">Map</span>
        </button>
        {/* Presenter-only controls — families see only the adventure (Viewer Mode) */}
        {mode === "teacher" && (
          <button
            className="wj-chip hover:bg-mango/20"
            onClick={() => setShowPanel((s) => !s)}
            title="Teacher Panel"
          >
            🍎 <span className="hidden sm:inline">Teacher</span>
          </button>
        )}
        <button className="wj-chip hover:bg-mango/20" onClick={toggleFullscreen} title="Fullscreen">
          ⛶ <span className="hidden sm:inline">Full</span>
        </button>
        <Link href={`/lessons/${lesson.id}`} className="wj-chip hover:bg-hibiscus/15" title="Exit Adventure">
          ✖ <span className="hidden sm:inline">Exit</span>
        </Link>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1">
        {/* ── Chapters drawer (Adventure Map) ─────────────────── */}
        {showChapters && (
          <aside className="w-60 shrink-0 overflow-y-auto border-r-2 border-sand-deep bg-paper/95 p-3">
            <p className="mb-2 font-display text-sm text-ink-soft">🗺️ Adventure Map</p>
            <ol className="space-y-1">
              {slides.map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      setIndex(i);
                      setShowChapters(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-sm font-bold transition-colors ${
                      i === index
                        ? "bg-sunset text-white"
                        : i < index
                        ? "text-palm-deep hover:bg-sand"
                        : "text-ink-soft hover:bg-sand"
                    }`}
                  >
                    <span>{i < index ? "✅" : s.emoji}</span>
                    <span className="truncate">{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-3 space-y-1 border-t-2 border-sand-deep pt-3 text-sm">
              <Link href="/passport" target="_blank" className="block rounded-xl px-2.5 py-1.5 font-bold text-ink-soft hover:bg-sand">🛂 Travel Passport</Link>
              <Link href="/cookbook" target="_blank" className="block rounded-xl px-2.5 py-1.5 font-bold text-ink-soft hover:bg-sand">📖 Cookbook</Link>
              <Link href="/journal" target="_blank" className="block rounded-xl px-2.5 py-1.5 font-bold text-ink-soft hover:bg-sand">📔 Journal</Link>
              <Link href="/backpack" target="_blank" className="block rounded-xl px-2.5 py-1.5 font-bold text-ink-soft hover:bg-sand">🎒 Backpack</Link>
            </div>
          </aside>
        )}

        {/* ── Presentation stage ──────────────────────────────── */}
        <div ref={stageRef} className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full max-w-4xl items-center justify-center px-4 py-8">
            <div key={slide.id} className="wj-slide-in w-full">
              <SlideView
                slide={slide}
                lesson={lesson}
                onNext={next}
                onQuizFinish={(score, total) => {
                  setQuizResult({ score, total });
                  next();
                }}
                quizResult={quizResult}
                level={level}
              />
            </div>
          </div>
        </div>

        {/* ── Teacher panel (presenter mode only) ─────────────── */}
        {mode === "teacher" && showPanel && <TeacherPanel lesson={lesson} quizResult={quizResult} />}
      </div>

      {/* ── Class Prep Checklist — teacher sees this before class ── */}
      {mode === "teacher" && !started && (
        <PrepChecklist lesson={lesson} onStart={() => setStarted(true)} />
      )}

      {/* ── Bottom controls ───────────────────────────────────── */}
      <footer className="relative z-20 flex items-center gap-3 border-t-2 border-sand-deep bg-paper/90 px-4 py-2.5 backdrop-blur">
        <button className="wj-btn wj-btn-ghost !px-4 !py-1.5 text-sm" onClick={prev} disabled={index === 0}>
          ← Back
        </button>
        <div className="flex flex-1 items-center gap-1.5 overflow-hidden">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              title={s.title}
              className={`h-2.5 flex-1 rounded-full transition-colors ${
                i === index ? "bg-sunset" : i < index ? "bg-palm/70" : "bg-sand-deep"
              }`}
            />
          ))}
        </div>
        <span className="wj-chip hidden sm:inline-flex">
          {index + 1} / {slides.length}
        </span>
        <button
          className="wj-btn !px-5 !py-1.5 text-sm"
          onClick={next}
          disabled={index === slides.length - 1}
        >
          Next →
        </button>
      </footer>
    </div>,
    document.body
  );
}

// participation tally per student per class day: { [studentId]: { [action]: count } }
type Participation = Record<string, Record<string, number>>;

const participationActions = [
  { id: "answered", emoji: "✋", label: "Answered" },
  { id: "participated", emoji: "💬", label: "Participated" },
  { id: "greatJob", emoji: "💛", label: "Great Job" },
  { id: "star", emoji: "⭐", label: "Star" },
  { id: "needsHelp", emoji: "🤝", label: "Needs Help" },
] as const;

function buildParentSummary(
  lesson: Lesson,
  quizResult: { score: number; total: number } | null,
  teacherNote: string,
  recordingLink: string,
  participation: Participation
): string {
  const nextLesson = lessons.find((l) => l.order === lesson.order + 1);
  const tl = (lesson.phrases ?? []).map((p) => `${p.tagalog} (${p.english})`).join(", ");
  const hil = (lesson.phrases ?? []).map((p) => `${p.hiligaynon} (${p.english})`).join(", ");
  const activities = [
    "Morning Blessings & gratitude journal",
    "Story & discovery slides",
    lesson.phrases?.length ? "Vocabulary practice + matching game" : null,
    lesson.recipeId ? "Cooking adventure" : null,
    "Adventure quiz",
    "Reflection journal",
  ].filter(Boolean);
  const stars = students
    .map((s) => {
      const p = participation[s.id];
      if (!p) return null;
      const bits = participationActions
        .filter((a) => p[a.id])
        .map((a) => `${a.emoji}×${p[a.id]}`)
        .join(" ");
      return bits ? `  • ${s.name}: ${bits}` : null;
    })
    .filter(Boolean);

  return `🌴 WONDER JOURNEY — CLASS SUMMARY
${lesson.emoji} ${lesson.title}
Date: ${todayISO()}

📚 TODAY'S LESSON
${lesson.subtitle}

💬 NEW TAGALOG WORDS
${tl || "—"}

🌺 NEW HILIGAYNON WORDS
${hil || "—"}

🎯 ACTIVITIES COMPLETED
${activities.map((a) => `  • ${a}`).join("\n")}

🧠 QUIZ RESULT
${quizResult ? `${quizResult.score} of ${quizResult.total} first-try — Magaling!` : "Completed together in class"}
${lesson.destinationId ? `\n🛂 PASSPORT STAMP EARNED\n  • ${lesson.destinationId}` : ""}
${stars.length ? `\n🌟 PARTICIPATION\n${stars.join("\n")}` : ""}

🏆 FAMILY CHALLENGE THIS WEEK
${lesson.familyChallenge}
${nextLesson ? `\n🧺 SUPPLIES FOR NEXT CLASS (${nextLesson.title} — ${nextLesson.date})\n${nextLesson.materials.map((m) => `  [ ] ${m}`).join("\n")}` : ""}
${recordingLink ? `\n🎥 CLASS RECORDING\n${recordingLink}` : ""}
${teacherNote ? `\n📝 TEACHER NOTE\n${teacherNote}` : ""}

Salamat for adventuring with us!
Teacher Sharon 🌺`;
}

function PrepChecklist({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  const items = [
    "Canva / presentation ready",
    "Videos tested and ready",
    "Quiz ready (auto-generated ✓)",
    `Prayer leader ready: ${getTodaysPrayerLeader()}`,
    "Materials ready",
    ...(lesson.recipeId ? ["Cooking ingredients ready"] : []),
    "Family challenge ready ✓",
    "Parent prep email sent",
  ];
  const [checked, setChecked] = useState<number[]>([]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink/40 p-4">
      <div className="wj-card wj-pop-in max-h-full w-full max-w-md overflow-y-auto p-6">
        <h2 className="wj-outline font-display text-2xl">🍎 Class Prep Checklist</h2>
        <p className="font-hand mt-1 text-lg text-ink-soft">
          {lesson.emoji} {lesson.title} — ready when you are, Teacher Sharon!
        </p>
        <ul className="mt-4 space-y-2">
          {items.map((item, i) => {
            const done = checked.includes(i);
            return (
              <li key={item}>
                <button
                  onClick={() =>
                    setChecked((c) => (done ? c.filter((x) => x !== i) : [...c, i]))
                  }
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-2.5 text-left text-sm font-bold transition-colors ${
                    done
                      ? "border-palm/60 bg-palm/10 text-palm-deep"
                      : "border-sand-deep bg-white text-ink-soft hover:border-mango"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      done ? "bg-palm text-white" : "bg-sand-deep"
                    }`}
                  >
                    {done ? "✓" : ""}
                  </span>
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
        <button className="wj-btn mt-5 w-full text-lg" onClick={onStart}>
          🎬 Start Adventure
        </button>
        <p className="font-hand mt-2 text-center text-ink-soft">
          (You can start anytime — the checklist is a helper, not a gate.)
        </p>
      </div>
    </div>
  );
}

function TeacherPanel({
  lesson,
  quizResult,
}: {
  lesson: Lesson;
  quizResult: { score: number; total: number } | null;
}) {
  const mission = buildMission(lesson);
  const [note, setNote] = useStored<string>(`teacherNote-${lesson.id}`, "");
  const [recording, setRecording] = useStored<string>(`recording-${lesson.id}`, "");
  const [participation, setParticipation] = useStored<Participation>(
    `participation-${lesson.id}-${todayISO()}`,
    {}
  );

  function tally(studentId: string, action: string) {
    setParticipation((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [action]: (prev[studentId]?.[action] ?? 0) + 1 },
    }));
  }

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l-2 border-sand-deep bg-paper/95 p-4">
      <p className="font-display text-sm text-ink-soft">🍎 Teacher Panel</p>

      {/* Class Participation Panel */}
      <div className="mt-3 rounded-2xl border-2 border-sand-deep p-3">
        <p className="font-display text-sm text-ink">🌟 Participation</p>
        {students.map((s) => {
          const p = participation[s.id] ?? {};
          return (
            <div key={s.id} className="mt-2">
              <p className="text-xs font-bold">
                {s.emoji} {s.name}{" "}
                <span className="text-ink-soft">
                  {participationActions
                    .filter((a) => p[a.id])
                    .map((a) => `${a.emoji}${p[a.id]}`)
                    .join(" ")}
                </span>
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {participationActions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => tally(s.id, a.id)}
                    title={a.label}
                    className="rounded-full border border-sand-deep bg-white px-1.5 py-0.5 text-xs hover:bg-mango/20"
                  >
                    {a.emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Post-class Parent Summary */}
      <div className="mt-3 rounded-2xl border-2 border-sand-deep p-3">
        <p className="font-display text-sm text-ink">✉️ Parent Summary</p>
        <p className="mt-1 text-xs text-ink-soft">
          Copy-ready recap for Shaun — words, quiz, challenge, next-class supplies.
        </p>
        <div className="mt-2">
          <CopyButton
            text={buildParentSummary(lesson, quizResult, note, recording, participation)}
            label="Copy summary 📋"
          />
        </div>
      </div>

      {/* Lesson recording placeholder */}
      <div className="mt-3 rounded-2xl border-2 border-sand-deep p-3">
        <p className="font-display text-sm text-ink">🎥 Class Recording</p>
        <input
          className="wj-input mt-1 !p-2 text-xs"
          placeholder="Paste Zoom/Drive/YouTube link..."
          value={recording}
          onChange={(e) => setRecording(e.target.value)}
        />
      </div>

      <div className="mt-3 space-y-4 text-sm">
        <div>
          <p className="font-display text-ink">🎯 Today&apos;s Mission</p>
          <ul className="mt-1 space-y-1 text-ink-soft">
            {mission.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-ink">🌟 Prayer Leader</p>
          <p className="text-ink-soft">{getTodaysPrayerLeader()}</p>
        </div>

        <div>
          <p className="font-display text-ink">🧺 Materials</p>
          <ul className="mt-1 space-y-1 text-ink-soft">
            {lesson.materials.map((m) => (
              <li key={m}>☐ {m}</li>
            ))}
          </ul>
        </div>

        {lesson.notes && (
          <div>
            <p className="font-display text-ink">📝 Lesson Notes</p>
            <p className="text-ink-soft">{lesson.notes}</p>
          </div>
        )}

        <div>
          <p className="font-display text-ink">🎨 Links</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <a href={lesson.canvaLink} target="_blank" rel="noopener noreferrer" className="wj-chip hover:bg-mango/20">Canva</a>
            {lesson.videoLinks.map((v, i) => (
              <a key={v.url} href={v.url} target="_blank" rel="noopener noreferrer" className="wj-chip hover:bg-mango/20">
                Video {i + 1}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-ink">✏️ Quick Notes</p>
          <textarea
            className="wj-input mt-1 min-h-24 text-sm"
            placeholder="Notes during class... (saved automatically)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </aside>
  );
}
