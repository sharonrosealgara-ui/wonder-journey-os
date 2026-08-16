"use client";

import Link from "next/link";
import { useState } from "react";
import { AdventureQuiz } from "@/components/adventure/quiz";
import { FactHunt, MemoryFlip, WordScramble } from "@/components/adventure/mini-games";
import { MatchingGame } from "@/components/matching-game";
import { PhotoUpload } from "@/components/photo-upload";
import { Polaroid, SmartPhoto } from "@/components/smart-photo";
import { Highlight } from "@/lib/highlight";
import { speak } from "@/lib/speak";
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

// A mascot introduces each slide with a speech bubble â€” scaled up so the
// call-to-action is unmissable for young readers (Sharon's guidelines).
export function MascotBubble({ slide, line }: { slide: Slide; line: string }) {
  return (
    <div className="mx-auto mb-4 mt-5 flex max-w-xl items-center justify-center gap-3">
      <span className="wj-sticker wj-bob h-16 w-16 shrink-0 text-3xl">{slide.mascot.emoji}</span>
      <div className="wj-card -ml-1 px-5 py-3 text-left shadow-lg">
        <p className="text-xs font-bold text-ink-soft">
          {slide.mascot.name} Â· {slide.mascot.role}
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

    // Premium Kinds
    case "hook": return <PremiumHookSlide slide={slide} />;
    case "essentialQuestion": return <PremiumEQSlide slide={slide} />;
    case "discoveries": return <PremiumDiscoveriesSlide slide={slide} />;
    case "richExplanation": return <PremiumRichExplanationSlide slide={slide} lesson={lesson} />;
    case "keyFacts": return <PremiumKeyFactsSlide slide={slide} />;
    case "mediaMoment": return <PremiumMediaMomentSlide slide={slide} />;
    case "guidedDiscussion": return <PremiumGuidedDiscussionSlide slide={slide} />;
    case "ageChallenge": return <PremiumAgeChallengeSlide slide={slide} level={level} />;
    case "handsOnMission": return <PremiumHandsOnMissionSlide slide={slide} />;
    case "checkUnderstanding": return <PremiumCheckUnderstandingSlide slide={slide} />;
    case "premiumAssessment": return <PremiumAssessmentSlide slide={slide} />;
  }
}

/* â”€â”€ Individual slides â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

// Family Mode opening screen â€” one shared screen, the whole family together.
function WelcomeSlide({ slide, lesson, onNext }: { slide: Slide; lesson: Lesson; onNext: () => void }) {
  const explorers = [
    ...students.map((s) => `${s.emoji} ${s.name}`),
    ...familyAdults.map((a) => `ðŸ’› ${a}`),
    `ðŸŒº ${teacherName}`,
  ];
  return (
    <div className="text-center">
      <div className="mb-3 text-6xl">ðŸŒ´ðŸ—ºï¸âœ¨</div>
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
        ðŸŽ’ Start Today&apos;s Adventure
      </button>
      <MascotBubble slide={slide} line={slide.mascot.catchphrase} />
    </div>
  );
}

// Adventure Academy â€” 15-min English + 15-min Math at the end of every class.
// Oral and shared-screen: prompts the family answers together, not forms.
// ðŸŽ“ ADVENTURE ACADEMY
// One shared screen, four explorers, four ages (7â€“12). "Everyone" mode
// shows each child their OWN mission at the same time, so nobody waits
// and nobody is stretched too far. Each card is that explorer's
// adventure role â€” never a grade, never a ranking
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

  // Which explorers wear which role today â€” read from config, so a new
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
                {checked ? "âœ“" : ""}
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
          <h3 className="font-display text-base">ðŸ“– English</h3>
          {renderList(english, `${keyPrefix}-en`)}
        </div>
        <div>
          <h3 className="font-display text-base">âž• Math</h3>
          {renderList(math, `${keyPrefix}-ma`)}
        </div>
      </div>
    );
  };

  return (
    <div className={`mx-auto ${everyone ? "max-w-4xl" : "max-w-2xl"}`}>
      <h1 className="wj-outline text-center font-display text-3xl sm:text-4xl">
        ðŸŽ“ Adventure Academy
      </h1>
      <p className="font-hand mt-2 text-center text-lg text-ink-soft">
        A quick brain workout before we finish â€” answer out loud, together!
      </p>

      {/* Everyone at once (the real family screen) vs one role at a time */}
      <div className="mt-3 flex justify-center">
        <div className="flex rounded-full border-2 border-sand-deep bg-white p-1">
          <button
            onClick={() => setEveryone(true)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${everyone ? "bg-ocean text-white" : "text-ink-soft"}`}
          >
            ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦ Everyone
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
            Everyone has their own mission today â€” big explorers can help the little ones! ðŸ’›
          </p>
          <div className="mt-4 space-y-4">
            {tiersInFamily.map(({ tier, kids }) => (
              <section key={tier} className="wj-card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-2xl">{levelMeta[tier].emoji}</span>
                  <span className="font-display text-lg">
                    {kids.map((k) => k.name).join(" & ")}
                    <span className="text-ink-soft"> Â· {levelMeta[tier].label} mission</span>
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
              {levelMeta[level].emoji} {levelMeta[level].label} ({levelMeta[level].ages}) â€” switch roles with the button up top
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
      <div className="mb-3 text-5xl">ðŸŒ…</div>
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">Morning Blessings</h1>
      <p className="font-hand mt-3 text-2xl text-mango-deep">
        What are you grateful to the Lord for today?
      </p>
      {saved ? (
        <div className="wj-card wj-pop-in mt-5 p-6">
          <div className="text-4xl">ðŸŒ»</div>
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
            Plant this blessing ðŸŒ±
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
      <div className="mb-3 text-5xl">ðŸ•Šï¸</div>
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">Opening Prayer</h1>
      <div className="wj-card mt-6 p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
          Today&apos;s Prayer Leader
        </p>
        <p className="mt-2 font-display text-4xl text-ube-deep">ðŸŒŸ {leader}</p>
        <p className="font-hand mx-auto mt-5 max-w-md text-lg text-ink-soft">
          If you feel comfortable, you may lead us in a short opening prayer. If not, another
          family member or Teacher Sharon can lead. ðŸ’›
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
      <h1 className="wj-outline text-center font-display text-3xl sm:text-4xl">ðŸŽ¯ Today&apos;s Mission</h1>
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
                    {done ? "âœ“" : ""}
                  </span>
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <MascotBubble slide={slide} line="Check them off as we go â€” explorers love a good list!" />
    </div>
  );
}

// ðŸŽ¨ CONTEXTUAL THEMES â€” each subject wears its own world (Sharon's
// premium art direction): Geography = explorer's field journal Â·
// Cooking = family recipe card Â· Language = giant speech bubble Â·
// Values = watercolor canvas. Same content model, different clothes.
const lessonThemes: Record<
  Lesson["category"],
  { card: string; bullet: string; accent: string; panel: string; tilt: string }
> = {
  Philippines: {
    card: "border-2 border-dashed border-amber-700/30 bg-[#fffaf0]",
    bullet: "ðŸ§­",
    accent: "text-sunset-deep",
    panel: "bg-amber-100/50",
    tilt: "-rotate-2",
  },
  Cooking: {
    card: "border-2 border-stone-200 bg-orange-50/70",
    bullet: "ðŸ¥„",
    accent: "text-mango-deep",
    panel: "bg-orange-100/40",
    tilt: "rotate-2",
  },
  Language: {
    card: "border-4 border-sky-200 bg-sky-50/80",
    bullet: "ðŸ’¬",
    accent: "text-ocean-deep",
    panel: "bg-sky-100/50",
    tilt: "-rotate-1",
  },
  Values: {
    card: "border-2 border-teal-200/80 bg-teal-50/60",
    bullet: "â­",
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

      {/* 60/40 split on wide screens â€” reading card left, visual right */}
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
        ðŸ’¬ Words for the Adventure
      </h1>
      <p className="font-hand mt-2 text-center text-lg text-ink-soft">
        Tap a card to reveal â€” then everyone says it out loud, three times, big smile!
      </p>
      {level === "adventure" && (
        <p className="mt-2 text-center">
          <span className="wj-chip">ðŸ¦… Adventure Challenge: use each word in a full sentence!</span>
        </p>
      )}
      {level === "trailblazer" && (
        <p className="mt-2 text-center">
          <span className="wj-chip">ðŸ”ï¸ Trailblazer Challenge: build a mini dialogue using three of these words!</span>
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
                  <p className="font-display text-xl text-sunset-deep">ðŸ‡µðŸ‡­ {p.tagalog}</p>
                  {p.pronunciation && (
                    <p className="font-hand text-ink-soft">ðŸ—£ï¸ {p.pronunciation}</p>
                  )}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(p.tagalog);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        speak(p.tagalog);
                      }
                    }}
                    className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-mango/30 px-3 py-1 font-display text-sm text-mango-deep transition-transform hover:scale-105 active:scale-95"
                  >
                    ðŸ”Š Hear it
                  </span>
                </div>
              ) : (
                <p className="font-hand mt-1 text-ink-soft">Tap to reveal! âœ¨</p>
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
      <h1 className="wj-outline text-center font-display text-3xl sm:text-4xl">ðŸŽ¬ Adventure Videos</h1>
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
              <span className="wj-sticker h-14 w-14 text-3xl">ðŸŽ¬</span>
              <div>
                <p className="font-display text-lg">{v.label}</p>
                <p className="font-hand text-ink-soft">Opens in a new tab â€” watch together!</p>
              </div>
            </a>
          );
        })}
      </div>
      {/* Offline / backup mode â€” the class never stops because a video fails */}
      <div className="wj-card mt-4 border-2 border-dashed border-sand-deep p-5">
        <p className="font-display text-ink">ðŸ“´ No internet? Backup plan:</p>
        <ul className="font-hand mt-2 space-y-1 text-lg text-ink-soft">
          <li>ðŸ—£ï¸ Retell today&apos;s story in your own words â€” kids act it out!</li>
          <li>ðŸ’­ Family discussion: {lesson.reflection}</li>
          <li>ðŸŽ¨ Draw what we just learned while someone describes it.</li>
        </ul>
      </div>
      <MascotBubble slide={slide} line="Paste a real YouTube link in the lesson config and it plays right here!" />
    </div>
  );
}

// ðŸŽ® GAME ARCADE â€” the family picks a game, so the same lesson feels
// fresh every class. Variety + a score to beat + sibling turns = the
// cure for boredom. Difficulty follows each explorer's age tier.
type GameId = "facthunt" | "match" | "memory" | "scramble";

const arcadeGames: { id: GameId; emoji: string; label: string; blurb: string; needsVocab: boolean }[] = [
  { id: "facthunt", emoji: "ðŸ”", label: "Fact Hunt", blurb: "Spot the true fact from today's lesson", needsVocab: false },
  { id: "match", emoji: "ðŸƒ", label: "Word Match", blurb: "Pair each English word with its Filipino partner", needsVocab: true },
  { id: "memory", emoji: "ðŸ§ ", label: "Memory Flip", blurb: "Flip cards and remember where the pairs hide", needsVocab: true },
  { id: "scramble", emoji: "ðŸ”¤", label: "Word Scramble", blurb: "Unscramble the jumbled Filipino word", needsVocab: true },
];

const pairsForLevel: Record<ExplorerLevel, number> = { explorer: 4, adventure: 5, trailblazer: 6 };

function stars(n: number): string {
  return "â­".repeat(n) + "â˜†".repeat(3 - n);
}

function GameSlide({ slide, lesson, level }: { slide: Slide; lesson: Lesson; level: ExplorerLevel }) {
  // Tagalog-only (Sharon's decision) â€” the games always use the Tagalog word.
  const lang = "tagalog" as const;
  const [game, setGame] = useState<GameId | null>(null);
  const phrases = lesson.phrases ?? [];
  const hasVocab = phrases.length > 0;
  const active = arcadeGames.find((g) => g.id === game);

  // ðŸ… "beat your best" â€” best star rating per game, per lesson.
  const [best, setBest] = useStored<Record<string, number>>(`gamebest-${lesson.id}`, {});
  const [newBest, setNewBest] = useState(false);
  const [xp, setXp] = useStored<Record<string, number>>(KEYS.xp, {});
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);

  // ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦ Pass & Play â€” optional sibling turns on the shared screen.
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
    // team stars + advance turn + award XP
    if (teamOn && current) {
      setTally((prev) => ({ ...prev, [current.id]: (prev[current.id] ?? 0) + s }));
      setXp((prev) => ({ ...prev, [current.id]: (prev[current.id] ?? 0) + s * 10 }));
      setTimeout(() => setTurn((t) => t + 1), 300);
    } else if (activeStudentId) {
      // If solo mode, award to active student
      setXp((prev) => ({ ...prev, [activeStudentId]: (prev[activeStudentId] ?? 0) + s * 10 }));
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="wj-outline text-center font-display text-3xl sm:text-4xl">
        ðŸŽ® {active ? active.label : "Game Arcade"}
      </h1>


      {/* whose turn (team mode) */}
      {teamOn && current && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="wj-chip !bg-sunset !text-white">{current.emoji} {current.name}&apos;s turn!</span>
          {players.map((id) => {
            const s = getStudent(id);
            return s ? (
              <span key={id} className="wj-chip !text-xs">{s.emoji} {tally[id] ?? 0}â­</span>
            ) : null;
          })}
          <button className="wj-chip !text-xs hover:bg-hibiscus/15" onClick={() => setPlayers([])}>âœ– end turns</button>
        </div>
      )}

      {newBest && (
        <p className="wj-pop-in mt-3 text-center font-display text-lg text-sunset-deep">ðŸ… New best score!</p>
      )}

      {!game ? (
        <>
          <p className="font-hand mt-3 text-center text-lg text-ink-soft">
            Pick a game â€” every one uses today&apos;s lesson! ðŸŒ´
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
            <p className="font-display text-sm">ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦ Pass &amp; Play â€” take turns!</p>
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
                    {s.emoji} {s.name}{on ? " âœ“" : ""}
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
              â† Choose another game
            </button>
            {best[game] ? <span className="wj-chip">ðŸ… Best {stars(best[game])}</span> : null}
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
      <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
        <SmartPhoto
          mediaId={recipe.mediaId}
          alt={recipe.name}
          className="h-full w-full object-cover"
        />
      </div>
      <h1 className="wj-outline font-display text-3xl sm:text-5xl">Cooking Time!</h1>
      <p className="font-hand mt-2 text-2xl text-ink-soft">
        {recipe.name} Â· <span className="italic">{recipe.filipinoName}</span>
      </p>
      <div className="wj-card mt-5 p-6 text-left">
        <div className="flex flex-wrap justify-center gap-2">
          <span className="wj-chip">{recipe.type}</span>
          <span className="wj-chip">{recipe.difficulty}</span>
          <span className="wj-chip">â±ï¸ {recipe.time}</span>
          <span className="wj-chip">ðŸ§º {recipe.ingredients.length} ingredients</span>
          <span className="wj-chip">ðŸ‘£ {recipe.steps.length} steps</span>
        </div>
        <p className="font-hand mt-4 text-center text-lg text-ink-soft">
          Aprons on! Open the full recipe with tap-to-check steps, safety reminders, and
          kitchen words:
        </p>
        <div className="mt-4 text-center">
          <Link href={`/cooking/${recipe.id}`} target="_blank" className="wj-btn">
            Open Cooking Mode ðŸ‘©â€ðŸ³
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
      <div className="mb-3 text-5xl">ðŸ’­</div>
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">Reflection</h1>
      <p className="font-hand mt-3 text-xl text-ink-soft">{lesson.reflection}</p>
      {saved ? (
        <div className="wj-card wj-pop-in mt-5 p-6">
          <div className="text-4xl">ðŸ“”âœ¨</div>
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
            Save My Reflection ðŸ“”
          </button>
        </div>
      )}
    </div>
  );
}

function ChallengeSlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mb-3 text-5xl">ðŸ†</div>
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">Family Challenge</h1>
      <div className="wj-card-bubble wj-note mt-6 p-7">
        <p className="font-display text-xl leading-relaxed text-white">{lesson.familyChallenge}</p>
      </div>
      <MascotBubble slide={slide} line="The adventure continues at home â€” that's the best part!" />
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
      <h1 className="wj-outline font-display text-3xl sm:text-4xl">ðŸ“· Capture Today&apos;s Memory</h1>
      <p className="font-hand mt-2 text-lg text-ink-soft">
        A photo, a drawing, a project â€” save today into the family Backpack!
      </p>
      {saved ? (
        <div className="wj-card wj-pop-in mt-5 p-6">
          <div className="text-4xl">ðŸŽ’âœ¨</div>
          <p className="mt-2 font-display text-xl text-palm-deep">Memory packed in the Backpack!</p>
        </div>
      ) : (
        <div className="wj-card mt-5 space-y-3 p-6 text-left">
          <PhotoUpload label="Upload today's photo ðŸ“¸" photo={photo} onPhoto={setPhoto} />
          <input
            className="wj-input"
            placeholder="Caption this memory..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button className="wj-btn w-full" onClick={save}>
            Save to Backpack ðŸŽ’
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
          <div className="text-6xl">ðŸŒ…</div>
          <h1 className="wj-outline mt-2 font-display text-4xl">Adventure Complete!</h1>
          <p className="font-hand mt-1 text-xl text-ink">
            {lesson.emoji} {lesson.title}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3">
          <Stat label="New Words" value={`${lesson.phrases?.length ?? 0}`} emoji="ðŸ’¬" />
          <Stat
            label="Quiz"
            value={quizResult ? `${quizResult.score}/${quizResult.total}` : "Done!"}
            emoji="ðŸ§ "
          />
          <Stat label="Journal" value="Saved" emoji="ðŸ“”" />
          <Stat
            label="Passport"
            value={destination ? "Stamp!" : "â€”"}
            emoji={destination?.emoji ?? "ðŸ›‚"}
          />
          <Stat label="Backpack" value="Updated" emoji="ðŸŽ’" />
          <Stat label="Family" value="Together" emoji="ðŸ’›" />
        </div>
        {destination && (
          <div className="pb-4">
            <div className="wj-stamp wj-stamp-earned mx-auto inline-block px-6 py-3">
              <div className="text-3xl">{destination.emoji}</div>
              <div className="font-display text-xs uppercase tracking-wide">
                {destination.name}
              </div>
              <div className="text-[10px]">â˜… STAMPED â˜…</div>
            </div>
          </div>
        )}
        <div className="space-y-2 p-6 pt-0">
          <button className="wj-btn w-full" onClick={finish} disabled={alreadyDone}>
            {alreadyDone ? "Adventure recorded! âœ…" : "Stamp my passport & finish ðŸ›‚"}
          </button>
          {onExitTheater ? (
            // Live class: return to the classroom â€” never navigate away
            // (the LiveKit room and cameras stay connected).
            <button
              className="wj-btn wj-btn-ocean w-full"
              onClick={() => {
                finish();
                onExitTheater();
              }}
            >
              Back to the Classroom ðŸŽ¥
            </button>
          ) : (
            <Link href="/today" className="wj-btn wj-btn-ocean w-full" onClick={finish}>
              See you next adventure! ðŸŒ´
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

// -- Premium Presentation Slides -----------------------------

function PremiumHookSlide({ slide }: { slide: Slide }) {
  const content = slide.content as string;
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 text-6xl">??</div>
      <h1 className="wj-outline font-display text-4xl sm:text-5xl">Adventure Hook</h1>
      <div className="mt-8 rounded-3xl bg-sand p-8 shadow-xl">
        <p className="font-hand text-2xl text-ink leading-relaxed">{content}</p>
      </div>
      <MascotBubble slide={slide} line="Ready to cast our line? Let's see what we catch today!" />
    </div>
  );
}

function PremiumEQSlide({ slide }: { slide: Slide }) {
  const content = slide.content as string;
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 text-6xl">?</div>
      <h1 className="wj-outline font-display text-4xl sm:text-5xl">Essential Question</h1>
      <div className="mt-8 rounded-3xl bg-mango-light p-8 shadow-xl border-4 border-mango">
        <p className="font-display text-3xl text-mango-deep leading-relaxed">{content}</p>
      </div>
      <MascotBubble slide={slide} line="Keep this question in your head during our whole adventure!" />
    </div>
  );
}

function PremiumDiscoveriesSlide({ slide }: { slide: Slide }) {
  const content = slide.content as any[];
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 text-6xl">??</div>
      <h1 className="wj-outline font-display text-4xl sm:text-5xl">Discoveries</h1>
      <div className="mt-8 space-y-4">
        {content.map((c, i) => (
          <div key={i} className="rounded-3xl bg-white p-6 shadow-md border-l-8 border-ocean">
            <h3 className="font-display text-2xl text-ocean-deep text-left">{c.title}</h3>
            <p className="font-hand text-xl text-ink-soft text-left mt-2">{c.description}</p>
          </div>
        ))}
      </div>
      <MascotBubble slide={slide} line="Look closely! What did we just discover?" />
    </div>
  );
}

function PremiumRichExplanationSlide({ slide, lesson }: { slide: Slide; lesson: Lesson }) {
  const content = slide.content as any;
  const photoSrc = useSmartSrc("lesson", lesson.id);
  const t = lessonThemes[lesson.category] || lessonThemes.Philippines;
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="text-center">
        <div className="mb-2 text-6xl">{content.emoji || "??"}</div>
        <h1 className="wj-outline font-display text-3xl sm:text-5xl">{content.heading || "Explanation"}</h1>
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-5">
        <div className={`rounded-3xl p-6 shadow-lg sm:p-8 lg:col-span-3 ${t.card}`}>
          <p className="wj-read">
            <Highlight text={content.text} accent={t.accent} />
          </p>
        </div>
        <div className={`hidden items-center justify-center rounded-3xl p-6 lg:col-span-2 lg:flex ${t.panel}`}>
          <Polaroid
            src={photoSrc}
            alt={content.heading || "Explanation"}
            tilt={t.tilt}
            caption={lesson.title}
            className="w-full max-w-xs"
          />
        </div>
      </div>
    </div>
  );
}

function PremiumKeyFactsSlide({ slide }: { slide: Slide }) {
  const content = slide.content as string[];
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 text-6xl">??</div>
      <h1 className="wj-outline font-display text-4xl sm:text-5xl">Key Facts</h1>
      <ul className="mt-8 space-y-4 text-left">
        {content.map((c, i) => (
          <li key={i} className="flex gap-4 rounded-2xl bg-sand p-4 shadow-sm items-center">
            <span className="text-3xl text-sunset-deep flex-shrink-0">?</span>
            <span className="font-hand text-xl text-ink leading-tight">{c}</span>
          </li>
        ))}
      </ul>
      <MascotBubble slide={slide} line="These are the gems we want to remember!" />
    </div>
  );
}

function PremiumMediaMomentSlide({ slide }: { slide: Slide }) {
  const content = slide.content as any;
  const embed = content.type === "video" ? getYouTubeEmbed(content.url) : null;
  return (
    <div className="mx-auto max-w-4xl text-center">
      <div className="mb-3 text-6xl">{content.type === "video" ? "??" : "??"}</div>
      <h1 className="wj-outline font-display text-4xl sm:text-5xl">{content.caption}</h1>
      <div className="mt-8 wj-card overflow-hidden p-2">
        {content.type === "video" && embed ? (
          <iframe
            src={embed}
            title={content.caption}
            className="aspect-video w-full rounded-2xl bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : content.type === "image" ? (
          <img src={content.url} alt={content.caption} className="w-full h-auto rounded-2xl object-cover max-h-[60vh]" />
        ) : (
          <div className="p-8"><a href={content.url} target="_blank" rel="noreferrer" className="wj-btn">Open Media Link</a></div>
        )}
      </div>
      {content.discussionPrompt && (
         <div className="mt-4 p-4 bg-ocean-light rounded-xl">
           <p className="font-hand text-xl text-ocean-deep">?? {content.discussionPrompt}</p>
         </div>
      )}
      <MascotBubble slide={slide} line="A picture is worth a thousand words — let's take a look!" />
    </div>
  );
}

function PremiumGuidedDiscussionSlide({ slide }: { slide: Slide }) {
  const content = slide.content as string[];
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 text-6xl">???</div>
      <h1 className="wj-outline font-display text-4xl sm:text-5xl">Guided Discussion</h1>
      <div className="mt-8 space-y-6">
        {content.map((q, i) => (
          <div key={i} className="rounded-3xl bg-hibiscus-light p-6 shadow-md">
            <p className="font-display text-2xl text-hibiscus-deep leading-relaxed">{q}</p>
          </div>
        ))}
      </div>
      <MascotBubble slide={slide} line="There are no wrong answers here — tell us what you think!" />
    </div>
  );
}

function PremiumAgeChallengeSlide({ slide, level }: { slide: Slide; level: ExplorerLevel }) {
  const content = slide.content as any;
  const challenge = content[level];
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 text-6xl">?</div>
      <h1 className="wj-outline font-display text-4xl sm:text-5xl">Age Challenge</h1>
      <div className="mt-8 rounded-3xl border-4 border-mango bg-white p-8 shadow-xl">
        <div className="text-lg text-ink-soft mb-2 uppercase font-bold tracking-wider">{levelMeta[level].label} ({levelMeta[level].ages})</div>
        <p className="font-hand text-3xl text-ink leading-relaxed">{challenge}</p>
      </div>
      <MascotBubble slide={slide} line="You got this! Give it your best shot." />
    </div>
  );
}

function PremiumHandsOnMissionSlide({ slide }: { slide: Slide }) {
  const content = slide.content as string;
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 text-6xl">???</div>
      <h1 className="wj-outline font-display text-4xl sm:text-5xl">Hands-On Mission</h1>
      <div className="mt-8 rounded-3xl bg-palm-light border-4 border-palm p-8 shadow-xl">
        <p className="font-hand text-2xl text-palm-deep leading-relaxed">{content}</p>
      </div>
      <MascotBubble slide={slide} line="Time to roll up our sleeves and make something happen!" />
    </div>
  );
}

function PremiumCheckUnderstandingSlide({ slide }: { slide: Slide }) {
  const content = slide.content as any[];
  const [revealed, setRevealed] = useState<number[]>([]);
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 text-6xl">?</div>
      <h1 className="wj-outline font-display text-4xl sm:text-5xl">Check for Understanding</h1>
      <div className="mt-8 space-y-4">
        {content.map((q, i) => {
           const open = revealed.includes(i);
           return (
             <button
               key={i}
               onClick={() => setRevealed((r) => open ? r.filter(x => x !== i) : [...r, i])}
               className="wj-card w-full text-left p-6 hover:shadow-lg transition-all"
             >
               <p className="font-display text-xl">{q.question}</p>
               {open ? (
                 <div className="mt-3 pt-3 border-t-2 border-sand-deep wj-pop-in">
                   <p className="font-hand text-xl text-ocean-deep">A: {q.answer}</p>
                 </div>
               ) : (
                 <p className="mt-2 text-sm text-ink-soft italic">Tap to reveal answer...</p>
               )}
             </button>
           );
        })}
      </div>
    </div>
  );
}

function PremiumAssessmentSlide({ slide }: { slide: Slide }) {
  const content = slide.content as any;
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 text-6xl">??</div>
      <h1 className="wj-outline font-display text-4xl sm:text-5xl">Assessment</h1>
      <div className="mt-8 space-y-4">
        <div className="rounded-3xl bg-ube-light p-6 shadow-md border-l-8 border-ube text-left">
           <h3 className="font-display text-2xl text-ube-deep">{content.rubric || "Rubric"}</h3>
           <p className="font-hand text-xl text-ink-soft mt-2">{content.prompt}</p>
        </div>
      </div>
      <MascotBubble slide={slide} line="Show us what you learned today!" />
    </div>
  );
}
