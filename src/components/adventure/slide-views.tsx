"use client";

import Link from "next/link";
import { useState } from "react";
import { AdventureQuiz } from "@/components/adventure/quiz";
import { MatchingGame } from "@/components/matching-game";
import { PhotoUpload } from "@/components/photo-upload";
import { getDestination } from "@/config/destinations";
import { getStudent, students } from "@/config/family";
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
import { buildMission, getYouTubeEmbed, type Slide } from "@/lib/slides";
import { newId, useStored } from "@/lib/storage";

// A mascot introduces each slide with a speech bubble.
export function MascotBubble({ slide, line }: { slide: Slide; line: string }) {
  return (
    <div className="mx-auto mb-4 flex max-w-lg items-center justify-center gap-3">
      <span className="wj-sticker h-12 w-12 shrink-0 text-2xl">{slide.mascot.emoji}</span>
      <div className="wj-card px-4 py-2 text-left">
        <p className="text-xs font-bold text-ink-soft">
          {slide.mascot.name} · {slide.mascot.role}
        </p>
        <p className="font-hand text-lg leading-snug">{line}</p>
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
  level = "older",
}: {
  slide: Slide;
  lesson: Lesson;
  onNext: () => void;
  onQuizFinish: (score: number, total: number) => void;
  quizResult: { score: number; total: number } | null;
  level?: "younger" | "older";
}) {
  switch (slide.kind) {
    case "welcome":
      return <WelcomeSlide slide={slide} lesson={lesson} />;
    case "blessings":
      return <BlessingsSlide slide={slide} />;
    case "prayer":
      return <PrayerSlide slide={slide} />;
    case "mission":
      return <MissionSlide slide={slide} lesson={lesson} />;
    case "story":
    case "learning":
      return <SectionSlide slide={slide} />;
    case "vocab":
      return <VocabSlide slide={slide} lesson={lesson} level={level} />;
    case "video":
      return <VideoSlide slide={slide} lesson={lesson} />;
    case "game":
      return <GameSlide slide={slide} lesson={lesson} />;
    case "recipe":
      return <RecipeSlide slide={slide} lesson={lesson} />;
    case "quiz":
      return (
        <div className="w-full">
          <MascotBubble slide={slide} line="Quiz time! Every answer you find is a treasure." />
          <AdventureQuiz phrases={lesson.phrases ?? []} onFinish={onQuizFinish} level={level} />
        </div>
      );
    case "reflection":
      return <ReflectionSlide slide={slide} lesson={lesson} />;
    case "challenge":
      return <ChallengeSlide slide={slide} lesson={lesson} />;
    case "memory":
      return <MemorySlide slide={slide} lesson={lesson} />;
    case "complete":
      return <CompleteSlide slide={slide} lesson={lesson} quizResult={quizResult} onNext={onNext} />;
  }
}

/* ── Individual slides ─────────────────────────────────────── */

function WelcomeSlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const student = getStudent(activeStudentId);
  return (
    <div className="text-center">
      <div className="mb-4 text-6xl">🌴🗺️✨</div>
      <h1 className="wj-outline font-display text-4xl sm:text-6xl">Welcome Explorers!</h1>
      <p className="font-hand mt-3 text-2xl text-ink-soft">
        {student ? `${student.name}, today's` : "Today's"} adventure:
      </p>
      <p className="mt-4">
        <span className="wj-brush font-display text-2xl sm:text-3xl">
          {lesson.emoji} {lesson.title}
        </span>
      </p>
      <p className="font-hand mt-4 text-lg text-ink-soft">{lesson.subtitle}</p>
      <MascotBubble slide={slide} line={slide.mascot.catchphrase} />
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

function SectionSlide({ slide }: { slide: Slide }) {
  const section = slide.section!;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="mb-3 text-6xl">{section.emoji}</div>
        <h1 className="wj-outline font-display text-3xl sm:text-5xl">{section.heading}</h1>
      </div>
      <div className="wj-card mt-6 p-6 sm:p-8">
        <p className="text-lg leading-relaxed sm:text-xl">{section.body}</p>
        {section.bullets && (
          <ul className="mt-5 space-y-2.5">
            {section.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-base sm:text-lg">
                <span className="text-mango-deep">★</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
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
  level: "younger" | "older";
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
      {level === "older" && (
        <p className="mt-2 text-center">
          <span className="wj-chip">🦅 Older Explorer Challenge: use each word in a full sentence!</span>
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
                  <p className="font-display text-lg text-sunset-deep">🇵🇭 {p.tagalog}</p>
                  <p className="font-display text-lg text-ocean-deep">🌺 {p.hiligaynon}</p>
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

function GameSlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  const [lang, setLang] = useState<"tagalog" | "hiligaynon">("tagalog");
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="wj-outline text-center font-display text-3xl sm:text-4xl">🎮 Matching Game</h1>
      <div className="mt-3 flex justify-center">
        <div className="flex rounded-full border-2 border-sand-deep bg-white p-1">
          {(["tagalog", "hiligaynon"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize ${
                lang === l ? "bg-hibiscus text-white" : "text-ink-soft"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <MatchingGame key={lang} phrases={lesson.phrases ?? []} lang={lang} />
      </div>
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
}: {
  slide: Slide;
  lesson: Lesson;
  quizResult: { score: number; total: number } | null;
  onNext: () => void;
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
          <Link href="/today" className="wj-btn wj-btn-ocean w-full" onClick={finish}>
            See you next adventure! 🌴
          </Link>
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
