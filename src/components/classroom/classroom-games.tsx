"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ClassroomGameEvent, PermissionLevel } from "@/lib/classroom-protocol";

export type GameType =
  | "hotspot"
  | "drag_drop_sort"
  | "matching"
  | "sequencing"
  | "multiple_choice"
  | "memory_pairs"
  | "lesson_review";

export interface ClassroomGamesProps {
  lessonId: string;
  lessonTitle: string;
  role: "teacher" | "family" | "student";
  permissionLevel: PermissionLevel;
  onEmitGameEvent?: (event: Partial<ClassroomGameEvent>) => void;
  incomingGameEvent?: ClassroomGameEvent | null;
}

// ── Deterministic Lesson Game Data (Answer Keys isolated) ──────

interface HotspotTarget {
  id: string;
  label: string;
  x: number; // percentage [0..100]
  y: number; // percentage [0..100]
  radius: number;
}

interface MatchingPair {
  id: string;
  leftText: string;
  rightText: string;
}

interface SequenceStep {
  id: string;
  stepNumber: number;
  text: string;
  emoji: string;
}

interface SortItem {
  id: string;
  text: string;
  category: string;
}

interface MemoryCard {
  id: string;
  pairId: string;
  content: string;
  type: "tagalog" | "english";
}

export function ClassroomGames({
  lessonId,
  lessonTitle,
  role,
  permissionLevel,
  onEmitGameEvent,
  incomingGameEvent,
}: ClassroomGamesProps) {
  const isTeacher = role === "teacher";
  const canInteract =
    isTeacher ||
    permissionLevel === "game_interactive" ||
    permissionLevel === "full_interactive";

  const [activeGame, setActiveGame] = useState<GameType>("matching");

  // ── Game States ──
  // 1. Hotspot State
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [foundHotspots, setFoundHotspots] = useState<string[]>([]);

  // 2. Drag & Drop Sorting State
  const [sortedItems, setSortedItems] = useState<Record<string, string>>({}); // itemId -> category
  const [unplacedItems, setUnplacedItems] = useState<string[]>([
    "Mango", "Luzon", "Rice", "Visayas", "Adobo", "Mindanao"
  ]);

  // 3. Matching State
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // 4. Sequencing State
  const [currentSequence, setCurrentSequence] = useState<string[]>([
    "Serve & Share with Family",
    "Layer Sweet Cream & Condensed Milk",
    "Arrange Fresh Ripe Mango Slices",
    "Line Bottom with Graham Crackers",
  ]);

  // 5. Multiple Choice State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  // 6. Memory Pairs State
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [solvedPairIds, setSolvedPairIds] = useState<string[]>([]);

  // 7. Review Activity State
  const [score, setScore] = useState<number>(0);
  const [reviewStep, setReviewStep] = useState<number>(1);

  // ── Handle Incoming Synced Game Events ──
  useEffect(() => {
    if (!incomingGameEvent) return;
    const { payload } = incomingGameEvent;
    if (!payload) return;

    if (payload.action === "reset") {
      setFoundHotspots([]);
      setSelectedHotspot(null);
      setSortedItems({});
      setMatchedPairs([]);
      setSelectedLeft(null);
      setFlippedCardIds([]);
      setSolvedPairIds([]);
      setRevealed(false);
      setSelectedOption(null);
      setScore(0);
      setReviewStep(1);
    } else if (payload.action === "tap_hotspot") {
      const spotId = payload.data?.spotId as string;
      if (spotId && !foundHotspots.includes(spotId)) {
        setFoundHotspots((prev) => [...prev, spotId]);
      }
    } else if (payload.action === "sort_item") {
      const { itemId, category } = payload.data as { itemId: string; category: string };
      if (itemId && category) {
        setSortedItems((prev) => ({ ...prev, [itemId]: category }));
        setUnplacedItems((prev) => prev.filter((i) => i !== itemId));
      }
    } else if (payload.action === "match_pair") {
      const pairId = payload.data?.pairId as string;
      if (pairId && !matchedPairs.includes(pairId)) {
        setMatchedPairs((prev) => [...prev, pairId]);
      }
    } else if (payload.action === "move_order") {
      const newSeq = payload.data?.sequence as string[];
      if (Array.isArray(newSeq)) {
        setCurrentSequence(newSeq);
      }
    } else if (payload.action === "flip_card") {
      const cardId = payload.data?.cardId as string;
      if (cardId && !flippedCardIds.includes(cardId)) {
        setFlippedCardIds((prev) => (prev.length >= 2 ? [cardId] : [...prev, cardId]));
      }
    } else if (payload.action === "reveal_authorized") {
      setRevealed(true);
    }
  }, [incomingGameEvent]);

  // ── Game Action Dispatchers ──
  const emitGame = useCallback(
    (action: ClassroomGameEvent["payload"]["action"], data: Record<string, unknown>) => {
      if (!onEmitGameEvent) return;
      onEmitGameEvent({
        topic: "classroom.game",
        version: 1,
        payload: {
          gameType:
            activeGame === "drag_drop_sort"
              ? "sorting"
              : activeGame === "memory_pairs"
              ? "memory_flip"
              : activeGame === "multiple_choice"
              ? "quiz"
              : activeGame === "lesson_review"
              ? "review"
              : activeGame,
          action,
          data,
        },
      });
    },
    [activeGame, onEmitGameEvent]
  );

  // Hotspot Handlers
  const handleHotspotClick = (spot: HotspotTarget) => {
    if (!canInteract) return;
    setSelectedHotspot(spot.id);
    if (!foundHotspots.includes(spot.id)) {
      setFoundHotspots((prev) => [...prev, spot.id]);
      emitGame("tap_hotspot", { spotId: spot.id, label: spot.label });
    }
  };

  // Matching Handlers
  const matchingPairs: MatchingPair[] = [
    { id: "m1", leftText: "Salamat", rightText: "Thank You" },
    { id: "m2", leftText: "Magandang Umaga", rightText: "Good Morning" },
    { id: "m3", leftText: "Masarap", rightText: "Delicious" },
    { id: "m4", leftText: "Pamilya", rightText: "Family" },
  ];

  const handleLeftClick = (id: string) => {
    if (!canInteract) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (pairId: string) => {
    if (!canInteract) return;
    if (selectedLeft === pairId && !matchedPairs.includes(pairId)) {
      setMatchedPairs((prev) => [...prev, pairId]);
      setSelectedLeft(null);
      emitGame("match_pair", { pairId });
    } else {
      setSelectedLeft(null);
    }
  };

  // Sorting Handlers
  const categories = ["Island Groups", "Heritage Foods"];
  const handleSort = (item: string, cat: string) => {
    if (!canInteract) return;
    setSortedItems((prev) => ({ ...prev, [item]: cat }));
    setUnplacedItems((prev) => prev.filter((i) => i !== item));
    emitGame("sort_item", { itemId: item, category: cat });
  };

  // Sequencing Handlers
  const moveSequenceItem = (index: number, direction: "up" | "down") => {
    if (!canInteract) return;
    const newSeq = [...currentSequence];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSeq.length) return;
    const temp = newSeq[index];
    newSeq[index] = newSeq[targetIdx];
    newSeq[targetIdx] = temp;
    setCurrentSequence(newSeq);
    emitGame("move_order", { sequence: newSeq });
  };

  // Multiple Choice Handlers
  const quizOptions = [
    "7,641 beautiful tropical islands",
    "Only 50 islands",
    "12 volcanic islands",
    "300 coral reefs",
  ];
  const handleSelectQuiz = (idx: number) => {
    if (!canInteract) return;
    setSelectedOption(idx);
    emitGame("submit_attempt", { optionIndex: idx });
  };

  // Memory Game Handlers
  const memoryCards: MemoryCard[] = [
    { id: "c1", pairId: "p1", content: "Araw (Sun)", type: "tagalog" },
    { id: "c2", pairId: "p1", content: "☀️ Sun", type: "english" },
    { id: "c3", pairId: "p2", content: "Dagat (Sea)", type: "tagalog" },
    { id: "c4", pairId: "p2", content: "🌊 Sea", type: "english" },
    { id: "c5", pairId: "p3", content: "Bundok (Mountain)", type: "tagalog" },
    { id: "c6", pairId: "p3", content: "⛰️ Mountain", type: "english" },
  ];

  const handleCardClick = (card: MemoryCard) => {
    if (!canInteract) return;
    if (solvedPairIds.includes(card.pairId) || flippedCardIds.includes(card.id)) return;

    const newFlipped = flippedCardIds.length >= 2 ? [card.id] : [...flippedCardIds, card.id];
    setFlippedCardIds(newFlipped);
    emitGame("flip_card", { cardId: card.id });

    if (newFlipped.length === 2) {
      const c1 = memoryCards.find((c) => c.id === newFlipped[0]);
      const c2 = memoryCards.find((c) => c.id === newFlipped[1]);
      if (c1 && c2 && c1.pairId === c2.pairId) {
        setSolvedPairIds((prev) => [...prev, c1.pairId]);
        setTimeout(() => setFlippedCardIds([]), 800);
      } else {
        setTimeout(() => setFlippedCardIds([]), 1200);
      }
    }
  };

  // Reset Game
  const handleReset = () => {
    if (!isTeacher) return;
    setFoundHotspots([]);
    setSelectedHotspot(null);
    setSortedItems({});
    setUnplacedItems(["Mango", "Luzon", "Rice", "Visayas", "Adobo", "Mindanao"]);
    setMatchedPairs([]);
    setSelectedLeft(null);
    setFlippedCardIds([]);
    setSolvedPairIds([]);
    setRevealed(false);
    setSelectedOption(null);
    setScore(0);
    setReviewStep(1);
    emitGame("reset", {});
  };

  return (
    <div
      id="classroom-interactive-games-engine"
      className="w-full h-full flex flex-col bg-slate-950/90 backdrop-blur-md rounded-2xl border border-sky-500/20 text-white p-5 select-none overflow-y-auto"
      role="region"
      aria-label="Synchronized Classroom Games"
    >
      {/* ── Game Navigation Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Live Classroom Game
          </div>
          <h2 className="text-lg font-bold text-slate-100">{lessonTitle}</h2>
        </div>

        {/* Game Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          {(
            [
              ["matching", "🧩 Match Pairs"],
              ["hotspot", "📍 Hotspots"],
              ["drag_drop_sort", "📦 Sort Words"],
              ["sequencing", "🔢 Sequence"],
              ["multiple_choice", "❓ Quiz"],
              ["memory_pairs", "🃏 Memory"],
              ["lesson_review", "🌟 Quest Review"],
            ] as [GameType, string][]
          ).map(([type, label]) => (
            <button
              key={type}
              onClick={() => {
                setActiveGame(type);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeGame === type
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Teacher Controls */}
        {isTeacher && (
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-rose-600/20 border border-rose-500/30 hover:bg-rose-600/30 text-rose-300 rounded-lg text-xs font-semibold transition"
          >
            🔄 Reset Board
          </button>
        )}
      </div>

      {/* Permission Warning Banner for Students */}
      {!canInteract && (
        <div className="mt-3 py-2 px-4 bg-amber-900/30 border border-amber-600/40 rounded-xl text-amber-200 text-xs flex items-center justify-between">
          <span>👀 View-Only Mode: Teacher Sharon will enable student game tools shortly.</span>
        </div>
      )}

      {/* ── Active Game Stage ── */}
      <div className="flex-1 mt-4 flex flex-col justify-center">
        {/* 1. MATCHING GAME */}
        {activeGame === "matching" && (
          <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-6 p-4">
            {/* Left Column (Tagalog) */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Tagalog Word
              </span>
              {matchingPairs.map((p) => {
                const isMatched = matchedPairs.includes(p.id);
                const isSelected = selectedLeft === p.id;
                return (
                  <button
                    key={p.id}
                    disabled={!canInteract || isMatched}
                    onClick={() => handleLeftClick(p.id)}
                    className={`p-3.5 rounded-xl border text-sm font-semibold transition text-left flex items-center justify-between ${
                      isMatched
                        ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                        : isSelected
                        ? "bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-500/30 scale-[1.02]"
                        : "bg-slate-900/80 border-slate-800 text-slate-200 hover:border-sky-500/40"
                    }`}
                  >
                    <span>{p.leftText}</span>
                    {isMatched && <span className="text-emerald-400">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Right Column (English) */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                English Meaning
              </span>
              {matchingPairs.map((p) => {
                const isMatched = matchedPairs.includes(p.id);
                return (
                  <button
                    key={p.id}
                    disabled={!canInteract || isMatched || !selectedLeft}
                    onClick={() => handleRightClick(p.id)}
                    className={`p-3.5 rounded-xl border text-sm font-semibold transition text-left flex items-center justify-between ${
                      isMatched
                        ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                        : selectedLeft
                        ? "bg-slate-900 border-sky-500/40 text-sky-200 hover:bg-sky-950/60 cursor-pointer animate-pulse"
                        : "bg-slate-900/50 border-slate-800 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <span>{p.rightText}</span>
                    {isMatched && <span className="text-emerald-400">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. HOTSPOTS GAME */}
        {activeGame === "hotspot" && (
          <div className="relative max-w-2xl mx-auto w-full aspect-video bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/40 to-slate-900 flex items-center justify-center pointer-events-none">
              <span className="text-6xl opacity-20">🗺️</span>
            </div>

            {/* Hotspot Target Markers */}
            {[
              { id: "h1", label: "Luzon (North)", x: 50, y: 25, radius: 24 },
              { id: "h2", label: "Visayas (Central)", x: 55, y: 55, radius: 24 },
              { id: "h3", label: "Mindanao (South)", x: 65, y: 80, radius: 24 },
            ].map((spot) => {
              const isFound = foundHotspots.includes(spot.id);
              return (
                <button
                  key={spot.id}
                  disabled={!canInteract}
                  onClick={() => handleHotspotClick(spot)}
                  style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg ${
                    isFound
                      ? "bg-emerald-500 text-white ring-4 ring-emerald-500/30 scale-110"
                      : "bg-sky-500/80 hover:bg-sky-400 text-white ring-2 ring-sky-400/50 animate-bounce"
                  }`}
                >
                  <span>{isFound ? "📍" : "⭕"}</span>
                  <span>{spot.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. DRAG & DROP / SORTING */}
        {activeGame === "drag_drop_sort" && (
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
            {/* Unplaced Items Pool */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-wrap gap-2.5 items-center min-h-[64px]">
              <span className="text-xs text-slate-400 font-bold mr-2">Items to Sort:</span>
              {unplacedItems.map((item) => (
                <div
                  key={item}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold rounded-lg text-xs flex items-center gap-2 border border-slate-700 shadow-sm"
                >
                  <span>{item}</span>
                  {canInteract && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSort(item, categories[0])}
                        title={`Move to ${categories[0]}`}
                        className="px-1.5 py-0.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-[10px]"
                      >
                        1
                      </button>
                      <button
                        onClick={() => handleSort(item, categories[1])}
                        title={`Move to ${categories[1]}`}
                        className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px]"
                      >
                        2
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {unplacedItems.length === 0 && (
                <span className="text-xs text-emerald-400 font-semibold">🎉 All items sorted!</span>
              )}
            </div>

            {/* Target Bins */}
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <div
                  key={cat}
                  className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 min-h-[140px]"
                >
                  <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>{cat}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-400">
                      Bin {i + 1}
                    </span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sortedItems)
                      .filter(([_, c]) => c === cat)
                      .map(([item]) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-medium"
                        >
                          {item} ✓
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SEQUENCING GAME */}
        {activeGame === "sequencing" && (
          <div className="max-w-md mx-auto w-full flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
              Order the Steps Correctly (1 to 4)
            </span>
            {currentSequence.map((step, idx) => (
              <div
                key={step}
                className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 font-medium">{step}</span>
                </div>
                {canInteract && (
                  <div className="flex gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveSequenceItem(idx, "up")}
                      className="p-1 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs"
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === currentSequence.length - 1}
                      onClick={() => moveSequenceItem(idx, "down")}
                      className="p-1 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs"
                    >
                      ▼
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 5. MULTIPLE CHOICE / QUIZ */}
        {activeGame === "multiple_choice" && (
          <div className="max-w-lg mx-auto w-full flex flex-col gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm font-semibold text-slate-100">
              How many islands make up the Philippine archipelago?
            </div>
            <div className="flex flex-col gap-2.5">
              {quizOptions.map((opt, i) => {
                const isSelected = selectedOption === i;
                return (
                  <button
                    key={opt}
                    disabled={!canInteract}
                    onClick={() => handleSelectQuiz(i)}
                    className={`p-3.5 rounded-xl border text-sm text-left font-medium transition flex items-center justify-between ${
                      isSelected
                        ? "bg-sky-600 border-sky-400 text-white font-bold"
                        : "bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800/80"
                    }`}
                  >
                    <span>{opt}</span>
                    {revealed && i === 0 && <span className="text-emerald-400">✓ Correct</span>}
                  </button>
                );
              })}
            </div>
            {isTeacher && (
              <button
                onClick={() => emitGame("reveal_authorized", {})}
                className="mt-2 py-2 px-4 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-600/40"
              >
                📢 Reveal Answer to Students
              </button>
            )}
          </div>
        )}

        {/* 6. MEMORY PAIRS */}
        {activeGame === "memory_pairs" && (
          <div className="max-w-lg mx-auto w-full grid grid-cols-3 gap-3">
            {memoryCards.map((card) => {
              const isFlipped =
                flippedCardIds.includes(card.id) || solvedPairIds.includes(card.pairId);
              const isSolved = solvedPairIds.includes(card.pairId);
              return (
                <button
                  key={card.id}
                  disabled={!canInteract || isSolved}
                  onClick={() => handleCardClick(card)}
                  className={`aspect-video rounded-xl border p-2 flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                    isSolved
                      ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                      : isFlipped
                      ? "bg-sky-600 border-sky-400 text-white scale-105"
                      : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  {isFlipped ? card.content : "🇵🇭"}
                </button>
              );
            })}
          </div>
        )}

        {/* 7. LESSON REVIEW ACTIVITY */}
        {activeGame === "lesson_review" && (
          <div className="max-w-lg mx-auto w-full bg-slate-900/90 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center gap-4">
            <span className="text-4xl">🌟</span>
            <h3 className="text-base font-bold text-white">Grand Lesson Adventure Quest</h3>
            <p className="text-xs text-slate-300 max-w-sm">
              Work together with Teacher Sharon to complete today&apos;s heritage challenges and earn your
              Wonder Journey adventure badge!
            </p>
            <div className="flex items-center gap-4 py-2 px-5 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400">Stars Earned:</span>
              <span className="text-base font-black text-amber-400">⭐⭐⭐⭐⭐ 5/5</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
