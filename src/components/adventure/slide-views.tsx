"use client";

import Link from "next/link";
import { useState } from "react";
import { AdventureQuiz } from "@/components/adventure/quiz";
import { FactHunt, MemoryFlip, WordScramble } from "@/components/adventure/mini-games";
import { MatchingGame } from "@/components/matching-game";
import { PhotoUpload } from "@/components/photo-upload";
import { Polaroid } from "@/components/smart-photo";
import { Highlight } from "@/lib/highlight";
import { useSmartSrc } from "@/lib/photos";
import { getDestination } from "@/config/destinations";
import { familyAdults, familyName, getStudent, students, teacherName } from "@/config/family";
import type { Lesson } from "@/config/lessons";
import { getRecipe } from "@/config/recipes";
import {
  getTodaysPrayerLeader,
  KEYS,
  todayISO,
  type AdventureMemory,
  type GratitudeEntry,
  type JournalEntry,
  type LessonCompletion,
} from "@/lib/app-state";
import { buildAcademy, buildMission, getYouTubeEmbed, levelForAge, levelMeta, type ExplorerLevel, type Slide } from "@/lib/slides";
import { sfx } from "@/lib/sound";
import { newId, useStored } from "@/lib/storage";

// A mascot introduces each slide with a speech bubble — scaled up so the
// call-to-action is unmissable for young readers (Sharon's guidelines).
export function MascotBubble({ slide, line }: { slide: Slide; line: string }) {
  return (
    <div className="mx-auto mb-4 mt-5 flex max-w-xl items-center justify-center gap-3">
      <span className="wj-sticker wj-bob h-16 w-16 shrink-0 text-3xl">{slide.mascot.emoji}</span>
      <div className="wj-card -ml-1 px-5 py-3 text-left shadow-lg">
        <p className="text-xs font-bold text-ink-soft">
          {slide.mascot.name} · {slide.mascot.role}
        </p>
        <p className="font-hand text-xl leading-snug">{line}</p>
      </div>
    </div>
  );
}

export function SlideView({
  slide,
  lesson,
  onNext,
  onQuizFinish,
  quizResult,
  level = "adventure",
  onExitTheater,
}: {
  slide: Slide;
  lesson: Lesson;
  onNext: () => void;
  onQuizFinish: (score: number, total: number) => void;
  quizResult: { score: number; total: number } | null;
  level?: ExplorerLevel;
  onExitTheater?: () => void;
}) {
  switch (slide.kind) {
    case "welcome":
      return <WelcomeSlide slide={slide} lesson={lesson} onNext={onNext} />;
    case "blessings":
      return <BlessingsSlide slide={slide} />;
    case "prayer":
      return <PrayerSlide slide={slide} />;
    case "mission":
      return <MissionSlide slide={slide} lesson={lesson} />;
    case "story":
    case "learning":
      return <SectionSlide slide={slide} lesson={lesson} />;
    case "vocab":
      return <VocabSlide slide={slide} lesson={lesson} level={level} />;
    case "video":
      return <VideoSlide slide={slide} lesson={lesson} />;
    case "game":
      return <GameSlide slide={slide} lesson={lesson} level={level} />;
    case "recipe":
      return <RecipeSlide slide={slide} lesson={lesson} />;
    case "quiz":
      return (
        <div className="w-full">
          <MascotBubble slide={slide} line="Quiz time! Every answer you find is a treasure." />
          <AdventureQuiz phrases={lesson.phrases ?? []} onFinish={onQuizFinish} level={level} />
        </div>
      );
    case "academy":
      return <AcademySlide slide={slide} lesson={lesson} level={level} />;
    case "reflection":
      return <ReflectionSlide slide={slide} lesson={lesson} />;
    case "challenge":
      return <ChallengeSlide slide={slide} lesson={lesson} />;
    case "memory":
      return <MemorySlide slide={slide} lesson={lesson} />;
    case "complete":
      return <CompleteSlide slide={slide} lesson={lesson} quizResult={quizResult} onNext={onNext} onExitTheater={onExitTheater} />;
  }
}

/* ── Individual slides ─────────────────────────────────────── */

// Family Mode opening screen — one shared screen, the whole family together.
function WelcomeSlide({ slide, lesson, onNext }: { slide: Slide; lesson: Lesson; onNext: () => void }) {
  const explorers = [
    ...students.map((s) => `${s.emoji} ${s.name}`),
    ...familyAdults.map((a) => `💛 ${a}`),
    `🌺 ${teacherName}`,
  ];
  return (
    <div className="text-center">
      <div className="mb-3 text-6xl">🌴🗺️✨</div>
      <h1 className="wj-outline font-display text-4xl sm:text-6xl">
        Welcome, {familyName}!
      </h1>
      <p className="mt-4">
        <span className="wj-brush font-display text-2xl sm:text-3xl">
          {lesson.emoji} {lesson.title}
        </span>
      </p>
      <p className="font-hand mt-3 text-lg text-ink-soft">{lesson.subtitle}</p>

      <p className="font-hand mt-5 text-xl text-ink-soft">Today&apos;s Explorers:</p>
      <div className="mx-auto mt-2 flex max-w-xl flex-wrap justify-center gap-2">
        {explorers.map((e) => (
          <span key={e} className="wj-chip !text-sm">{e}</span>
        ))}
      </div>

      <button className="wj-btn mt-6 text-xl" onClick={onNext}>
        🎒 Start Today&apos;s Adventure
      </button>
      <MascotBubble slide={slide} line={slide.mascot.catchphrase} />
    </div>
  );
}

// Adventure Academy — 15-min English + 15-min Math at the end of every class.
// Oral and shared-screen: prompts the family answers together, not forms.
// 🎓 ADVENTURE ACADEMY
// One shared screen, four explorers, four ages (7–12). "Everyone" mode
// shows each child their OWN mission at the same time, so nobody waits
// and nobody is stretched too far. Each card is that explorer's
// adventure role — never a grade, never a ranking
// (CURRICULUM_FRAMEWORK: no sibling rankings).
function AcademySlide({
  slide,
  lesson,
  level,
}: {
  slide: Slide;
  lesson: Lesson;
  level: ExplorerLevel;
}) {
  const [everyone, setEveryone] = useState(true); // the real teaching context
  const [done, setDone] = useState<string[]>([]);
  const toggle = (id: string) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  // Which explorers wear which role today — read from config, so a new
  // family just edits config/family.ts and this follows automatically.
  const tiersInFamily = (["explorer", "adventure", "trailblazer"] as ExplorerLevel[])
    .map((tier) => ({ tier, kids: students.filter((s) => levelForAge(s.age) === tier) }))
    .filter((g) => g.kids.length > 0);

  const renderList = (items: string[], prefix: string) => (
    <ul className="mt-2 space-y-2">
      {items.map((item, i) => {
        const id = `${prefix}-${i}`;
        const checked = done.includes(id);
        return (
          <li key={id}>
            <button
              onClick={() => toggle(id)}
              className={`flex w-full items-start gap-2.5 rounded-2xl border-2 p-2.5 text-left text-sm transition-colors ${
                checked
                  ? "border-palm/50 bg-palm/10 text-ink-soft line-through"
                  : "border-sand-deep bg-white hover:border-mango"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                  checked ? "bg-palm text-white" : "bg-sand-deep"
                }`}
              >
                {checked ? "✓" : ""}
              </span>
              {item}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const renderMissions = (tier: ExplorerLevel, keyPrefix: string) => {
    const { english, math } = buildAcademy(lesson, tier);
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <h3 className="font-display text-base">📖 English</h3>
          {renderList(english, `${keyPrefix}-en`)}
        </div>
        <div>
          <h3 className="font-display text-base">➕ Math</h3>
          {renderList(math, `${keyPrefix}-ma`)}
        </div>
      </div>
    );
  };

  return (
    <div className={`mx-auto ${everyone ? "max-w-4xl" : "max-w-2xl"}`}>
      <h1 className="wj-outline text-center font-display text-3xl sm:text-4xl">
        🎓 Adventure Academy
      </h1>
      <p className="font-hand mt-2 text-center text-lg text-ink-soft">
        A quick brain workout before we finish — answer out loud, together!
      </p>

      {/* Everyone at once (the real family screen) vs one role at a time */}
      <div className="mt-3 flex justify-center">
        <div className="flex rounded-full border-2 border-sand-deep bg-white p-1">
          <button
            onClick={() => setEveryone(true)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${everyone ? "bg-ocean text-white" : "text-ink-soft"}`}
          >
            👨‍👩‍👧‍👦 Everyone
          </button>
          <button
            onClick={() => setEveryone(false)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${!everyone ? "bg-ocean text-white" : "text-ink-soft"}`}
          >
            {levelMeta[level].emoji} {levelMeta[level].label} only
          </button>
        </div>
      </div>

      {everyone ? (
        <>
          <p className="font-hand mt-3 text-center text-base text-ink-soft">
            Everyone has their own mission today — big explorers can help the little ones! 💛
          </p>
          <div className="mt-4 space-y-4">
            {tiersInFamily.map(({ tier, kids }) => (
              <section key={tier} className="wj-card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-2xl">{levelMeta[tier].emoji}</span>
                  <span className="font-display text-lg">
                    {kids.map((k) => k.name).join(" & ")}
                    <span className="text-ink-soft"> · {levelMeta[tier].label} mission</span>
                  </span>
                  {kids.map((k) => (
                    <span key={k.id} className="wj-chip !text-xs">{k.emoji} {k.name}</span>
                  ))}
                </div>
                <div className="mt-3">{renderMissions(tier, tier)}</div>
              </section>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-center">
            <span className="wj-chip">
              {levelMeta[level].emoji} {levelMeta[level].label} ({levelMeta[level].ages}) — switch roles with the button up top
            </span>
          </p>
          <div className="mt-5">{renderMissions(level, "solo")}</div>
        </>
      )}

      <MascotBubble slide={slide} line="Every subject is part of the same adventure!" />
    </div>
  );
}

function BlessingsSlide({ slide }: { slide: Slide }) {
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [, setGratitude] = useStored<GratitudeEntry[]>(KEYS.gratitude, []);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const student = getStudent(activeStudentId);

  function save() {
    if (!text.trim()) return;
    setGratitude((prev) => [
      {
        id: newId(),
        studentId: student?.id ?? "family",
        date: todayISO(),
        prompt: "Today I am grateful to the Lord because...",
        text: text.trim(),
      },
      ...prev,
    ]);
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mb-3 text-5xl">🌅</div>
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">Morning Blessings</h1>
      <p className="font-hand mt-3 text-2xl text-mango-deep">
        What are you grateful to the Lord for today?
      </p>
      {saved ? (
        <div className="wj-card wj-pop-in mt-5 p-6">
          <div className="text-4xl">🌻</div>
          <p className="mt-2 font-display text-xl text-palm-deep">
            Blessing planted in your journal!
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <textarea
            className="wj-input min-h-28 text-center font-hand text-xl"
            placeholder="Today I am grateful to the Lord because..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="wj-btn" onClick={save} disabled={!text.trim()}>
            Plant this blessing 🌱
          </button>
        </div>
      )}
      <MascotBubble slide={slide} line={slide.mascot.catchphrase} />
    </div>
  );
}

function PrayerSlide({ slide }: { slide: Slide }) {
  const leader = getTodaysPrayerLeader();
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mb-3 text-5xl">🕊️</div>
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">Opening Prayer</h1>
      <div className="wj-card mt-6 p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          Today&apos;s Prayer Leader
        </p>
        <p className="mt-2 font-display text-4xl text-ube-deep">🌟 {leader}</p>
        <p className="font-hand mx-auto mt-5 max-w-md text-lg text-ink-soft">
          If you feel comfortable, you may lead us in a short opening prayer. If not, another
          family member or Teacher Sharon can lead. 💛
        </p>
      </div>
      <MascotBubble slide={slide} line="Prayer is always an invitation, never a requirement." />
    </div>
  );
}

function MissionSlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  const items = buildMission(lesson);
  const [checked, setChecked] = useState<number[]>([]);
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="wj-outline text-center font-display text-3xl sm:text-4xl">🎯 Today&apos;s Mission</h1>
      <p className="font-hand mt-2 text-center text-xl text-ink-soft">Today we will...</p>
      <div className="wj-card-bubble wj-note mt-5 p-6">
        <ul className="space-y-3">
          {items.map((item, i) => {
            const done = checked.includes(i);
            return (
              <li key={item}>
                <button
                  className="flex w-full items-center gap-3 text-left font-display text-lg text-white"
                  onClick={() =>
                    setChecked((c) => (done ? c.filter((x) => x !== i) : [...c, i]))
                  }
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white/70 ${
                      done ? "bg-mango text-ink" : "bg-white/15"
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
      </div>
      <MascotBubble slide={slide} line="Check them off as we go — explorers love a good list!" />
    </div>
  );
}

// 🎨 CONTEXTUAL THEMES — each subject wears its own world (Sharon's
// premium art direction): Geography = explorer's field journal ·
// Cooking = family recipe card · Language = giant speech bubble ·
// Values = watercolor canvas. Same content model, different clothes.
const lessonThemes: Record<
  Lesson["category"],
  { card: string; bullet: string; accent: string; panel: string; tilt: string }
> = {
  Philippines: {
    card: "border-2 border-dashed border-amber-700/30 bg-[#fffaf0]",
    bullet: "🧭",
    accent: "text-sunset-deep",
    panel: "bg-amber-100/50",
    tilt: "-rotate-2",
  },
  Cooking: {
    card: "border-2 border-stone-200 bg-orange-50/70",
    bullet: "🥄",
    accent: "text-mango-deep",
    panel: "bg-orange-100/40",
    tilt: "rotate-2",
  },
  Language: {
    card: "border-4 border-sky-200 bg-sky-50/80",
    bullet: "💬",
    accent: "text-ocean-deep",
    panel: "bg-sky-100/50",
    tilt: "-rotate-1",
  },
  Values: {
    card: "border-2 border-teal-200/80 bg-teal-50/60",
    bullet: "⭐",
    accent: "text-hibiscus-deep",
    panel: "bg-teal-100/40",
    tilt: "rotate-1",
  },
};

function SectionSlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  const section = slide.section!;
  const t = lessonThemes[lesson.category];
  // real photo from the Photo Studio (falls back to warm emoji art)
  const photoSrc = useSmartSrc("lesson", lesson.id);
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="text-center">
        <div className="mb-2 text-6xl">{section.emoji}</div>
        <h1 className="wj-outline font-display text-3xl sm:text-5xl">{section.heading}</h1>
      </div>

      {/* 60/40 split on wide screens — reading card left, visual right */}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-5">
        <div className={`rounded-3xl p-6 shadow-lg sm:p-8 lg:col-span-3 ${t.card}`}>
          <p className="wj-read">
            <Highlight text={section.body} accent={t.accent} />
          </p>
          {section.bullets && (
            <ul className="mt-5 space-y-3">
              {section.bullets.map((b) => (
                <li key={b} className="wj-read flex items-start gap-3 !text-lg">
                  <span className="wj-sticker h-8 w-8 shrink-0 text-base">{t.bullet}</span>
                  <span>
                    <Highlight text={b} accent={t.accent} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`hidden items-center justify-center rounded-3xl p-6 lg:col-span-2 lg:flex ${t.panel}`}>
          <Polaroid
            src={photoSrc}
            alt={section.heading}
            emoji={section.emoji}
            tilt={t.tilt}
            caption={lesson.title}
            className="w-full max-w-xs"
          />
        </div>
      </div>

      {slide.kind === "story" && (
        <MascotBubble slide={slide} line="Close your eyes for a second... can you picture it?" />
      )}
    </div>
  );
}

function VocabSlide({
  slide,
  lesson,
  level,
}: {
  slide: Slide;
  lesson: Lesson;
  level: ExplorerLevel;
}) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const phrases = lesson.phrases ?? [];
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="wj-outline text-center font-display text-3xl sm:text-4xl">
        💬 Words for the Adventure
      </h1>
      <p className="font-hand mt-2 text-center text-lg text-ink-soft">
        Tap a card to reveal — then everyone says it out loud, three times, big smile!
      </p>
      {level === "adventure" && (
        <p className="mt-2 text-center">
          <span className="wj-chip">🦅 Adventure Challenge: use each word in a full sentence!</span>
        </p>
      )}
      {level === "trailblazer" && (
        <p className="mt-2 text-center">
          <span className="wj-chip">🏔️ Trailblazer Challenge: build a mini dialogue using three of these words!</span>
        </p>
      )}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {phrases.map((p, i) => {
          const open = revealed.includes(i);
          return (
            <button
              key={p.english}
              onClick={() =>
                setRevealed((r) => (open ? r.filter((x) => x !== i) : [...r, i]))
              }
              className="wj-card wj-card-hover p-4 text-left"
            >
              <p className="font-display text-xl">{p.english}</p>
              {open ? (
                <div className="wj-pop-in mt-2 space-y-1">
                  <p className="font-display text-xl text-sunset-deep">🇵🇭 {p.tagalog}</p>
                  {p.pronunciation && (
                    <p className="font-hand text-ink-soft">🗣️ {p.pronunciation}</p>
                  )}
                </div>
              ) : (
                <p className="font-hand mt-1 text-ink-soft">Tap to reveal! ✨</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VideoSlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="wj-outline text-center font-display text-3xl sm:text-4xl">🎬 Adventure Videos</h1>
      <div className="mt-5 space-y-4">
        {lesson.videoLinks.map((v) => {
          const embed = getYouTubeEmbed(v.url);
          return embed ? (
            <div key={v.url} className="wj-card overflow-hidden p-2">
              <iframe
                src={embed}
                title={v.label}
                className="aspect-video w-full rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <p className="p-3 text-center font-display">{v.label}</p>
            </div>
          ) : (
            <a
              key={v.url}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="wj-card wj-card-hover flex items-center gap-4 p-5"
            >
              <span className="wj-sticker h-14 w-14 text-3xl">🎬</span>
              <div>
                <p className="font-display text-lg">{v.label}</p>
                <p className="font-hand text-ink-soft">Opens in a new tab — watch together!</p>
              </div>
            </a>
          );
        })}
      </div>
      {/* Offline / backup mode — the class never stops because a video fails */}
      <div className="wj-card mt-4 border-2 border-dashed border-sand-deep p-5">
        <p className="font-display text-ink">📴 No internet? Backup plan:</p>
        <ul className="font-hand mt-2 space-y-1 text-lg text-ink-soft">
          <li>🗣️ Retell today&apos;s story in your own words — kids act it out!</li>
          <li>💭 Family discussion: {lesson.reflection}</li>
          <li>🎨 Draw what we just learned while someone describes it.</li>
        </ul>
      </div>
      <MascotBubble slide={slide} line="Paste a real YouTube link in the lesson config and it plays right here!" />
    </div>
  );
}

// 🎮 GAME ARCADE — the family picks a game, so the same lesson feels
// fresh every class. Variety + a score to beat + sibling turns = the
// cure for boredom. Difficulty follows each explorer's age tier.
type GameId = "facthunt" | "match" | "memory" | "scramble";

const arcadeGames: { id: GameId; emoji: string; label: string; blurb: string; needsVocab: boolean }[] = [
  { id: "facthunt", emoji: "🔍", label: "Fact Hunt", blurb: "Spot the true fact from today's lesson", needsVocab: false },
  { id: "match", emoji: "🃏", label: "Word Match", blurb: "Pair each English word with its Filipino partner", needsVocab: true },
  { id: "memory", emoji: "🧠", label: "Memory Flip", blurb: "Flip cards and remember where the pairs hide", needsVocab: true },
  { id: "scramble", emoji: "🔤", label: "Word Scramble", blurb: "Unscramble the jumbled Filipino word", needsVocab: true },
];

const pairsForLevel: Record<ExplorerLevel, number> = { explorer: 4, adventure: 5, trailblazer: 6 };

function stars(n: number): string {
  return "⭐".repeat(n) + "☆".repeat(3 - n);
}

function GameSlide({ slide, lesson, level }: { slide: Slide; lesson: Lesson; level: ExplorerLevel }) {
  // Tagalog-only (Sharon's decision) — the games always use the Tagalog word.
  const lang = "tagalog" as const;
  const [game, setGame] = useState<GameId | null>(null);
  const phrases = lesson.phrases ?? [];
  const hasVocab = phrases.length > 0;
  const active = arcadeGames.find((g) => g.id === game);

  // 🏅 "beat your best" — best star rating per game, per lesson.
  const [best, setBest] = useStored<Record<string, number>>(`gamebest-${lesson.id}`, {});
  const [newBest, setNewBest] = useState(false);

  // 👨‍👩‍👧‍👦 Pass & Play — optional sibling turns on the shared screen.
  const [players, setPlayers] = useState<string[]>([]);
  const [turn, setTurn] = useState(0);
  const [tally, setTally] = useStored<Record<string, number>>(`gamestars-${lesson.id}-${todayISO()}`, {});
  const teamOn = players.length > 0;
  const current = teamOn ? getStudent(players[turn % players.length]) : null;

  function handleResult(gameId: GameId, s: number) {
    // best score
    setBest((prev) => {
      if (s > (prev[gameId] ?? 0)) {
        setNewBest(true);
        setTimeout(() => setNewBest(false), 2600);
        return { ...prev, [gameId]: s };
      }
      return prev;
    });
    // team stars + advance turn
    if (teamOn && current) {
      setTally((prev) => ({ ...prev, [current.id]: (prev[current.id] ?? 0) + s }));
      setTimeout(() => setTurn((t) => t + 1), 300);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="wj-outline text-center font-display text-3xl sm:text-4xl">
        🎮 {active ? active.label : "Game Arcade"}
      </h1>


      {/* whose turn (team mode) */}
      {teamOn && current && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="wj-chip !bg-sunset !text-white">{current.emoji} {current.name}&apos;s turn!</span>
          {players.map((id) => {
            const s = getStudent(id);
            return s ? (
              <span key={id} className="wj-chip !text-xs">{s.emoji} {tally[id] ?? 0}⭐</span>
            ) : null;
          })}
          <button className="wj-chip !text-xs hover:bg-hibiscus/15" onClick={() => setPlayers([])}>✖ end turns</button>
        </div>
      )}

      {newBest && (
        <p className="wj-pop-in mt-3 text-center font-display text-lg text-sunset-deep">🏅 New best score!</p>
      )}

      {!game ? (
        <>
          <p className="font-hand mt-3 text-center text-lg text-ink-soft">
            Pick a game — every one uses today&apos;s lesson! 🌴
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {arcadeGames.map((g) => {
              const locked = g.needsVocab && !hasVocab;
              return (
                <button
                  key={g.id}
                  disabled={locked}
                  onClick={() => {
                    sfx.reveal();
                    setGame(g.id);
                  }}
                  className={`wj-card flex items-center gap-3 p-4 text-left transition-transform ${
                    locked ? "opacity-50" : "hover:-translate-y-1 hover:shadow-xl"
                  }`}
                >
                  <span className="text-4xl">{g.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-display text-lg">
                      {g.label}
                      {best[g.id] ? <span className="text-xs text-mango-deep">{stars(best[g.id])}</span> : null}
                    </span>
                    <span className="font-hand block text-sm text-ink-soft">
                      {locked ? "This lesson has no vocabulary words" : g.blurb}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pass & Play setup */}
          <div className="mt-5 rounded-2xl border-2 border-dashed border-sand-deep p-4 text-center">
            <p className="font-display text-sm">👨‍👩‍👧‍👦 Pass &amp; Play — take turns!</p>
            <p className="font-hand text-sm text-ink-soft">Tap the players, then pick a game. Stars are shared on the family screen.</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {students.map((s) => {
                const on = players.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() =>
                      setPlayers((p) => (on ? p.filter((x) => x !== s.id) : [...p, s.id]))
                    }
                    className={`wj-chip !text-sm ${on ? "!bg-ocean !text-white" : "hover:bg-mango/20"}`}
                  >
                    {s.emoji} {s.name}{on ? " ✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-center gap-2">
            <button className="wj-chip hover:bg-mango/20" onClick={() => setGame(null)}>
              ← Choose another game
            </button>
            {best[game] ? <span className="wj-chip">🏅 Best {stars(best[game])}</span> : null}
          </div>
          {game === "facthunt" && (
            <FactHunt key={`fh-${turn}`} lesson={lesson} level={level} onResult={(s) => handleResult("facthunt", s)} />
          )}
          {game === "match" && (
            <MatchingGame
              key={`m-${lang}-${turn}`}
              phrases={phrases}
              lang={lang}
              maxPairs={pairsForLevel[level]}
              onResult={(s) => handleResult("match", s)}
            />
          )}
          {game === "memory" && (
            <MemoryFlip key={`mf-${lang}-${turn}`} phrases={phrases} lang={lang} level={level} onResult={(s) => handleResult("memory", s)} />
          )}
          {game === "scramble" && (
            <WordScramble key={`ws-${lang}-${turn}`} phrases={phrases} lang={lang} level={level} onResult={(s) => handleResult("scramble", s)} />
          )}
        </div>
      )}
    </div>
  );
}

function RecipeSlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  const recipe = lesson.recipeId ? getRecipe(lesson.recipeId) : undefined;
  if (!recipe) return null;
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mb-3 text-6xl">{recipe.emoji}</div>
      <h1 className="wj-outline font-display text-3xl sm:text-5xl">Cooking Time!</h1>
      <p className="font-hand mt-2 text-2xl text-ink-soft">
        {recipe.name} · <span className="italic">{recipe.filipinoName}</span>
      </p>
      <div className="wj-card mt-5 p-6 text-left">
        <div className="flex flex-wrap justify-center gap-2">
          <span className="wj-chip">{recipe.type}</span>
          <span className="wj-chip">{recipe.difficulty}</span>
          <span className="wj-chip">⏱️ {recipe.time}</span>
          <span className="wj-chip">🧺 {recipe.ingredients.length} ingredients</span>
          <span className="wj-chip">👣 {recipe.steps.length} steps</span>
        </div>
        <p className="font-hand mt-4 text-center text-lg text-ink-soft">
          Aprons on! Open the full recipe with tap-to-check steps, safety reminders, and
          kitchen words:
        </p>
        <div className="mt-4 text-center">
          <Link href={`/cooking/${recipe.id}`} target="_blank" className="wj-btn">
            Open Cooking Mode 👩‍🍳
          </Link>
        </div>
      </div>
      <MascotBubble slide={slide} line={slide.mascot.catchphrase} />
    </div>
  );
}

function ReflectionSlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [, setJournal] = useStored<JournalEntry[]>(KEYS.journal, []);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const student = getStudent(activeStudentId);

  function save() {
    if (!text.trim()) return;
    setJournal((prev) => [
      {
        id: newId(),
        studentId: student?.id ?? "family",
        date: todayISO(),
        title: `Reflection: ${lesson.title}`,
        text: text.trim(),
      },
      ...prev,
    ]);
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mb-3 text-5xl">💭</div>
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">Reflection</h1>
      <p className="font-hand mt-3 text-xl text-ink-soft">{lesson.reflection}</p>
      {saved ? (
        <div className="wj-card wj-pop-in mt-5 p-6">
          <div className="text-4xl">📔✨</div>
          <p className="mt-2 font-display text-xl text-palm-deep">Saved to your journal!</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <textarea
            className="wj-input min-h-28 font-hand text-lg"
            placeholder="Today I learned... my favorite part was..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="wj-btn" onClick={save} disabled={!text.trim()}>
            Save My Reflection 📔
          </button>
        </div>
      )}
    </div>
  );
}

function ChallengeSlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mb-3 text-5xl">🏆</div>
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">Family Challenge</h1>
      <div className="wj-card-bubble wj-note mt-6 p-7">
        <p className="font-display text-xl leading-relaxed text-white">{lesson.familyChallenge}</p>
      </div>
      <MascotBubble slide={slide} line="The adventure continues at home — that's the best part!" />
    </div>
  );
}

function MemorySlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [, setMemories] = useStored<AdventureMemory[]>(KEYS.memories, []);
  const [photo, setPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [saved, setSaved] = useState(false);

  function save() {
    setMemories((prev) => [
      {
        id: newId(),
        lessonId: lesson.id,
        studentId: activeStudentId ?? "family",
        date: todayISO(),
        photo,
        caption: caption.trim() || `Our ${lesson.title} adventure`,
      },
      ...prev,
    ]);
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">📷 Capture Today&apos;s Memory</h1>
      <p className="font-hand mt-2 text-lg text-ink-soft">
        A photo, a drawing, a project — save today into the family Backpack!
      </p>
      {saved ? (
        <div className="wj-card wj-pop-in mt-5 p-6">
          <div className="text-4xl">🎒✨</div>
          <p className="mt-2 font-display text-xl text-palm-deep">Memory packed in the Backpack!</p>
        </div>
      ) : (
        <div className="wj-card mt-5 space-y-3 p-6 text-left">
          <PhotoUpload label="Upload today's photo 📸" photo={photo} onPhoto={setPhoto} />
          <input
            className="wj-input"
            placeholder="Caption this memory..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button className="wj-btn w-full" onClick={save}>
            Save to Backpack 🎒
          </button>
        </div>
      )}
      <MascotBubble slide={slide} line="You can skip this and add photos later, too!" />
    </div>
  );
}

function CompleteSlide({
  slide,
  lesson,
  quizResult,
  onNext,
  onExitTheater,
}: {
  slide: Slide;
  lesson: Lesson;
  quizResult: { score: number; total: number } | null;
  onNext: () => void;
  onExitTheater?: () => void;
}) {
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [completions, setCompletions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const destination = lesson.destinationId ? getDestination(lesson.destinationId) : undefined;
  const studentId = activeStudentId ?? "family";
  const alreadyDone = completions.some(
    (c) => c.lessonId === lesson.id && c.studentId === studentId
  );

  function finish() {
    if (!alreadyDone) {
      sfx.stamp();
      setCompletions((prev) => [...prev, { lessonId: lesson.id, studentId, date: todayISO() }]);
    }
  }

  return (
    <div className="mx-auto max-w-xl text-center">
      {/* sunset finale */}
      <div className="wj-card overflow-hidden">
        <div className="bg-gradient-to-b from-sunset/70 via-mango/60 to-sky p-8">
          <div className="text-6xl">🌅</div>
          <h1 className="wj-outline mt-2 font-display text-4xl">Adventure Complete!</h1>
          <p className="font-hand mt-1 text-xl text-ink">
            {lesson.emoji} {lesson.title}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3">
          <Stat label="New Words" value={`${lesson.phrases?.length ?? 0}`} emoji="💬" />
          <Stat
            label="Quiz"
            value={quizResult ? `${quizResult.score}/${quizResult.total}` : "Done!"}
            emoji="🧠"
          />
          <Stat label="Journal" value="Saved" emoji="📔" />
          <Stat
            label="Passport"
            value={destination ? "Stamp!" : "—"}
            emoji={destination?.emoji ?? "🛂"}
          />
          <Stat label="Backpack" value="Updated" emoji="🎒" />
          <Stat label="Family" value="Together" emoji="💛" />
        </div>
        {destination && (
          <div className="pb-4">
            <div className="wj-stamp wj-stamp-earned mx-auto inline-block px-6 py-3">
              <div className="text-3xl">{destination.emoji}</div>
              <div className="font-display text-xs uppercase tracking-wide">
                {destination.name}
              </div>
              <div className="text-[10px]">★ STAMPED ★</div>
            </div>
          </div>
        )}
        <div className="space-y-2 p-6 pt-0">
          <button className="wj-btn w-full" onClick={finish} disabled={alreadyDone}>
            {alreadyDone ? "Adventure recorded! ✅" : "Stamp my passport & finish 🛂"}
          </button>
          {onExitTheater ? (
            // Live class: return to the classroom — never navigate away
            // (the LiveKit room and cameras stay connected).
            <button
              className="wj-btn wj-btn-ocean w-full"
              onClick={() => {
                finish();
                onExitTheater();
              }}
            >
              Back to the Classroom 🎥
            </button>
          ) : (
            <Link href="/today" className="wj-btn wj-btn-ocean w-full" onClick={finish}>
              See you next adventure! 🌴
            </Link>
          )}
        </div>
      </div>
      <MascotBubble slide={slide} line="Every adventure becomes a memory. Salamat, explorers!" />
    </div>
  );
}

function Stat({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="rounded-2xl bg-sand p-3">
      <div className="text-2xl">{emoji}</div>
      <div className="font-display text-lg text-ink">{value}</div>
      <div className="text-[11px] font-bold text-ink-soft">{label}</div>
    </div>
  );
}
