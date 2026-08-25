"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ClassroomGameEvent, PermissionLevel } from "@/lib/classroom-protocol";
import {
  generateLearnerSafeGame,
  LearnerSafeGameDTO,
  LearnerSortItem,
} from "@/lib/lesson-game-generator";

async function evaluateGameAttemptViaApi(
  lessonId: string,
  gameType: string,
  attemptData: Record<string, unknown>
): Promise<{ result: "correct" | "try_again"; score: number; feedback: string }> {
  try {
    const res = await fetch("/api/game/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, gameType, attemptData }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        result: "try_again",
        score: 0,
        feedback: errData.feedback || "Evaluation rejected by server. Subukan muli!",
      };
    }
    return await res.json();
  } catch {
    return {
      result: "try_again",
      score: 0,
      feedback: "Error connecting to evaluator. Please try again.",
    };
  }
}

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

  const [activeGame, setActiveGame] = useState<GameType>("drag_drop_sort");
  const [gameDTO, setGameDTO] = useState<LearnerSafeGameDTO>(() =>
    generateLearnerSafeGame(lessonId, lessonTitle)
  );

  // Fetch fresh randomized learner DTO from server endpoint when lessonId changes
  useEffect(() => {
    let isCancelled = false;
    async function loadDTO() {
      try {
        const res = await fetch(`/api/game/dto?lessonId=${encodeURIComponent(lessonId)}&lessonTitle=${encodeURIComponent(lessonTitle)}`);
        if (res.ok && !isCancelled) {
          const data = await res.json();
          setGameDTO(data);
        }
      } catch {
        // Fallback to initial blank structure
      }
    }
    loadDTO();
    setSortedPlacements({});
    setMatchedPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setFlippedCards([]);
    setSolvedMemoryCards([]);
    setSelectedOptionId(null);
    setQuizFeedback(null);
    setSequenceOrder(null);
    setSelectedHotspot(null);
    setHotspotFeedback(null);
    return () => {
      isCancelled = true;
    };
  }, [lessonId, lessonTitle]);

  // ── Feedback & Score State ──
  const [gameScore, setGameScore] = useState<number | null>(null);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);

  // ── 1. Drag & Drop Sorting State ──
  const [sortedPlacements, setSortedPlacements] = useState<Record<string, string>>({}); // itemId -> binId
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [selectedSortItemKey, setSelectedSortItemKey] = useState<string | null>(null); // For keyboard a11y

  // ── 2. Matching State ──
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // matched leftItemIds

  // ── 3. Sequencing State ──
  const [sequenceOrder, setSequenceOrder] = useState<string[] | null>(null);
  const currentSequenceItems = sequenceOrder
    ? sequenceOrder
        .map((id) => gameDTO.sequencing.items.find((i) => i.id === id)!)
        .filter(Boolean)
    : gameDTO.sequencing.items;

  // ── 4. Multiple Choice State ──
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // ── 5. Memory State ──
  const [flippedCards, setFlippedCards] = useState<string[]>([]); // 0, 1, or 2 card IDs
  const [solvedMemoryCards, setSolvedMemoryCards] = useState<string[]>([]);

  // ── 6. Hotspot State ──
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [hotspotFeedback, setHotspotFeedback] = useState<string | null>(null);

  // ── Synchronized Event Dispatcher ──
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

  // ── Handle Incoming LiveKit Game Events ──
  useEffect(() => {
    if (!incomingGameEvent) return;
    const { action, data } = incomingGameEvent.payload;

    if (action === "reset") {
      setSortedPlacements({});
      setMatchedPairs([]);
      setSolvedMemoryCards([]);
      setFlippedCards([]);
      setSelectedOptionId(null);
      setGameFeedback("Teacher reset the classroom activity.");
      setTimeout(() => setGameFeedback(null), 3000);
    } else if (action === "submit_attempt" && isTeacher && data) {
      // Teacher evaluates student attempt and sends broadcast result
      evaluateGameAttemptViaApi(
        lessonId,
        incomingGameEvent.payload.gameType,
        data as Record<string, unknown>
      ).then((evalRes) => {
        setGameScore(evalRes.score);
        setGameFeedback(evalRes.feedback);
      });
    }
  }, [incomingGameEvent, isTeacher, lessonId]);

  // ── Drag and Drop Handlers (HTML5 + Pointer + Touch) ──
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (!canInteract) return;
    setDraggedItemId(itemId);
    e.dataTransfer.setData("text/plain", itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, binId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain") || draggedItemId;
    if (!itemId || !canInteract) return;

    const newPlacements = { ...sortedPlacements, [itemId]: binId };
    setSortedPlacements(newPlacements);
    setDraggedItemId(null);
    setSelectedSortItemKey(null);

    emitGame("sort_item", { itemId, binId });

    // Check if all items sorted
    if (Object.keys(newPlacements).length === gameDTO.sorting.items.length) {
      const evalRes = await evaluateGameAttemptViaApi(lessonId, "sorting", { placements: newPlacements });
      setGameFeedback(evalRes.feedback);
      setGameScore(evalRes.score);
      emitGame("submit_attempt", { placements: newPlacements });
    }
  };

  // Keyboard accessibility for drag and drop
  const handleSortItemKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (!canInteract) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedSortItemKey(selectedSortItemKey === itemId ? null : itemId);
    }
  };

  const handleBinKeyDown = async (e: React.KeyboardEvent, binId: string) => {
    if (!canInteract || !selectedSortItemKey) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const newPlacements = { ...sortedPlacements, [selectedSortItemKey]: binId };
      setSortedPlacements(newPlacements);
      setSelectedSortItemKey(null);
      emitGame("sort_item", { itemId: selectedSortItemKey, binId });

      if (Object.keys(newPlacements).length === gameDTO.sorting.items.length) {
        const evalRes = await evaluateGameAttemptViaApi(lessonId, "sorting", { placements: newPlacements });
        setGameFeedback(evalRes.feedback);
        setGameScore(evalRes.score);
        emitGame("submit_attempt", { placements: newPlacements });
      }
    }
  };

  // ── Matching Handlers ──
  const handleLeftMatchClick = (id: string) => {
    if (!canInteract || matchedPairs.includes(id)) return;
    setSelectedLeft(id);
    if (selectedRight) {
      checkMatchPair(id, selectedRight);
    }
  };

  const handleRightMatchClick = (id: string) => {
    if (!canInteract) return;
    setSelectedRight(id);
    if (selectedLeft) {
      checkMatchPair(selectedLeft, id);
    }
  };

  const checkMatchPair = async (leftId: string, rightId: string) => {
    const evalRes = await evaluateGameAttemptViaApi(lessonId, "matching", { pair: { leftId, rightId } });
    if (evalRes.result === "correct") {
      setMatchedPairs((prev) => [...prev, leftId]);
      setGameFeedback(evalRes.feedback);
    } else {
      setGameFeedback(evalRes.feedback);
    }
    setSelectedLeft(null);
    setSelectedRight(null);
    emitGame("match_pair", { leftId, rightId, matched: evalRes.result === "correct" });
  };

  // ── Sequencing Handlers ──
  const handleMoveSequence = async (index: number, direction: "up" | "down") => {
    if (!canInteract) return;
    const current = currentSequenceItems.map((i) => i.id);
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;

    const temp = current[index];
    current[index] = current[targetIdx];
    current[targetIdx] = temp;

    setSequenceOrder([...current]);
    emitGame("move_order", { newOrder: current });

    const evalRes = await evaluateGameAttemptViaApi(lessonId, "sequencing", { order: current });
    if (evalRes.result === "correct") {
      setGameFeedback("Tumpak! Perfect sequence!");
      setGameScore(100);
      emitGame("submit_attempt", { order: current });
    }
  };

  // ── Multiple Choice Handlers ──
  const handleSelectQuizOption = async (optId: string) => {
    if (!canInteract) return;
    setSelectedOptionId(optId);
    const evalRes = await evaluateGameAttemptViaApi(lessonId, "quiz", { selectedOptionId: optId });
    setQuizFeedback(evalRes.feedback);
    setGameScore(evalRes.score);
    emitGame("submit_attempt", { selectedOptionId: optId });
  };

  // ── Memory Card Handlers ──
  const handleCardClick = async (cardId: string) => {
    if (!canInteract || solvedMemoryCards.includes(cardId) || flippedCards.includes(cardId)) return;

    if (flippedCards.length === 0) {
      setFlippedCards([cardId]);
      emitGame("flip_card", { cardId });
    } else if (flippedCards.length === 1) {
      const firstId = flippedCards[0];
      const secondId = cardId;
      setFlippedCards([firstId, secondId]);
      emitGame("flip_card", { cardId });

      const evalRes = await evaluateGameAttemptViaApi(lessonId, "memory_flip", { cardIds: [firstId, secondId] });
      if (evalRes.result === "correct") {
        setSolvedMemoryCards((prev) => [...prev, firstId, secondId]);
        setFlippedCards([]);
        setGameFeedback("Match found!");
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  // ── Hotspot Handlers ──
  const handleHotspotClick = async (targetId: string) => {
    if (!canInteract) return;
    setSelectedHotspot(targetId);
    const evalRes = await evaluateGameAttemptViaApi(lessonId, "hotspot", { targetId });
    setHotspotFeedback(evalRes.feedback);
    emitGame("tap_hotspot", { targetId, isCorrect: evalRes.result === "correct" });
  };

  // Teacher reset
  const handleTeacherReset = () => {
    if (!isTeacher) return;
    setSortedPlacements({});
    setMatchedPairs([]);
    setSolvedMemoryCards([]);
    setFlippedCards([]);
    setSelectedOptionId(null);
    setSequenceOrder(null);
    setGameFeedback(null);
    setGameScore(null);
    emitGame("reset", {});
  };

  return (
    <div className="w-full bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-2xl border border-slate-800 flex flex-col gap-6">
      {/* Header & Game Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
            Interactive Classroom Activity
          </span>
          <h2 className="text-xl font-black text-white">{lessonTitle}</h2>
        </div>

        {/* Game Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["drag_drop_sort", "Sorting"],
              ["matching", "Matching"],
              ["sequencing", "Sequencing"],
              ["multiple_choice", "Quiz"],
              ["memory_pairs", "Memory"],
              ["hotspot", "Hotspot"],
              ["lesson_review", "Review"],
            ] as [GameType, string][]
          ).map(([gType, label]) => (
            <button
              key={gType}
              onClick={() => {
                setActiveGame(gType);
                setGameFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeGame === gType
                  ? "bg-emerald-500 text-slate-950 shadow-md scale-105"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Teacher Controls */}
        {isTeacher && (
          <button
            onClick={handleTeacherReset}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition shadow"
          >
            Reset Activity
          </button>
        )}
      </div>

      {/* Mode / Permission Status Notice */}
      {!canInteract && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
          <span>👀 View-Only Mode: Teacher will enable student interaction tools shortly.</span>
        </div>
      )}

      {/* Feedback Banner */}
      {gameFeedback && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-sm font-semibold animate-pulse">
          {gameFeedback}
        </div>
      )}

      {/* ── 1. DRAG & DROP / WORD SORTING ACTIVITY ── */}
      {activeGame === "drag_drop_sort" && (
        <div className="flex flex-col gap-6">
          <div className="text-sm font-semibold text-slate-300">
            {gameDTO.sorting.title} ·{" "}
            <span className="text-xs text-slate-400">
              Drag items into their category bins (or use keyboard: select with Space, press Enter in target bin).
            </span>
          </div>

          {/* Unsorted Items Pool */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 min-h-[80px]">
            <div className="text-xs uppercase font-bold text-slate-400 mb-2">Available Items:</div>
            <div className="flex flex-wrap gap-3">
              {gameDTO.sorting.items
                .filter((item) => !sortedPlacements[item.id])
                .map((item) => (
                  <div
                    key={item.id}
                    draggable={canInteract}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    tabIndex={canInteract ? 0 : -1}
                    onKeyDown={(e) => handleSortItemKeyDown(e, item.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all select-none ${
                      selectedSortItemKey === item.id
                        ? "bg-emerald-500 text-slate-950 border-emerald-300 scale-105 ring-2 ring-emerald-400"
                        : "bg-slate-800 text-slate-100 border-slate-700 hover:border-emerald-500 cursor-grab active:cursor-grabbing"
                    }`}
                  >
                    {item.text}
                  </div>
                ))}
              {gameDTO.sorting.items.every((item) => sortedPlacements[item.id]) && (
                <div className="text-sm text-emerald-400 font-bold">All items placed! Excellent work.</div>
              )}
            </div>
          </div>

          {/* Target Categorization Bins */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameDTO.sorting.bins.map((bin) => {
              const itemsInBin = gameDTO.sorting.items.filter(
                (item) => sortedPlacements[item.id] === bin.id
              );

              return (
                <div
                  key={bin.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, bin.id)}
                  tabIndex={selectedSortItemKey ? 0 : -1}
                  onKeyDown={(e) => handleBinKeyDown(e, bin.id)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col gap-3 min-h-[160px] ${
                    selectedSortItemKey
                      ? "border-emerald-400/60 bg-slate-800/80 cursor-pointer hover:bg-emerald-950/20"
                      : "border-dashed border-slate-700 bg-slate-950/40"
                  }`}
                >
                  <div className="text-sm font-black text-emerald-400 flex items-center justify-between">
                    <span>{bin.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {itemsInBin.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {itemsInBin.map((item) => (
                      <div
                        key={item.id}
                        className="px-3 py-1.5 bg-slate-800/90 rounded-lg text-xs font-semibold text-slate-200 border border-slate-700 flex justify-between items-center"
                      >
                        <span>{item.text}</span>
                        {canInteract && (
                          <button
                            onClick={() => {
                              const next = { ...sortedPlacements };
                              delete next[item.id];
                              setSortedPlacements(next);
                            }}
                            className="text-slate-400 hover:text-rose-400 ml-2"
                            title="Remove"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 2. MATCHING ACTIVITY ── */}
      {activeGame === "matching" && (
        <div className="flex flex-col gap-6">
          <div className="text-sm font-semibold text-slate-300">
            {gameDTO.matching.title} · Select one Tagalog item on the left and its English counterpart on the right.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Items */}
            <div className="flex flex-col gap-3">
              <div className="text-xs uppercase font-bold text-slate-400">Tagalog Concept:</div>
              {gameDTO.matching.leftItems.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedLeft === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={!canInteract || isMatched}
                    onClick={() => handleLeftMatchClick(item.id)}
                    className={`p-4 rounded-xl text-sm font-bold border text-left transition-all ${
                      isMatched
                        ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 opacity-80"
                        : isSelected
                        ? "bg-emerald-500 text-slate-950 border-emerald-300 scale-102 ring-2 ring-emerald-400"
                        : "bg-slate-800 text-slate-100 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {item.text} {isMatched && "✓"}
                  </button>
                );
              })}
            </div>

            {/* Right Items */}
            <div className="flex flex-col gap-3">
              <div className="text-xs uppercase font-bold text-slate-400">English Translation:</div>
              {gameDTO.matching.rightItems.map((item) => {
                const isSelected = selectedRight === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={!canInteract}
                    onClick={() => handleRightMatchClick(item.id)}
                    className={`p-4 rounded-xl text-sm font-bold border text-left transition-all ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 border-emerald-300 scale-102 ring-2 ring-emerald-400"
                        : "bg-slate-800 text-slate-100 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. SEQUENCING ACTIVITY ── */}
      {activeGame === "sequencing" && (
        <div className="flex flex-col gap-6">
          <div className="text-sm font-semibold text-slate-300">
            {gameDTO.sequencing.title} · Arrange the steps in the correct chronological order from top to bottom.
          </div>

          <div className="flex flex-col gap-3">
            {currentSequenceItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm font-bold text-slate-100">{item.text}</span>
                </div>

                {canInteract && (
                  <div className="flex gap-2">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveSequence(idx, "up")}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded text-xs font-bold"
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === currentSequenceItems.length - 1}
                      onClick={() => handleMoveSequence(idx, "down")}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded text-xs font-bold"
                    >
                      ▼
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. MULTIPLE CHOICE ACTIVITY ── */}
      {activeGame === "multiple_choice" && (
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl text-base font-bold text-slate-100">
            {gameDTO.quiz.question}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameDTO.quiz.options.map((opt) => (
              <button
                key={opt.id}
                disabled={!canInteract}
                onClick={() => handleSelectQuizOption(opt.id)}
                className={`p-4 rounded-xl text-sm font-bold border text-left transition-all ${
                  selectedOptionId === opt.id
                    ? "bg-emerald-500 text-slate-950 border-emerald-300 scale-102 ring-2 ring-emerald-400"
                    : "bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {quizFeedback && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-sm font-semibold">
              {quizFeedback}
            </div>
          )}
        </div>
      )}

      {/* ── 5. MEMORY PAIRS ACTIVITY ── */}
      {activeGame === "memory_pairs" && (
        <div className="flex flex-col gap-6">
          <div className="text-sm font-semibold text-slate-300">
            {gameDTO.memory.title} · Flip cards to match Tagalog vocabulary pairs.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gameDTO.memory.cards.map((card) => {
              const isFlipped = flippedCards.includes(card.id) || solvedMemoryCards.includes(card.id);
              const isSolved = solvedMemoryCards.includes(card.id);

              return (
                <button
                  key={card.id}
                  disabled={!canInteract || isSolved}
                  onClick={() => handleCardClick(card.id)}
                  className={`h-28 rounded-xl font-black text-sm p-3 border transition-all flex items-center justify-center text-center ${
                    isSolved
                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                      : isFlipped
                      ? "bg-emerald-500 text-slate-950 border-emerald-300"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  {isFlipped ? card.text : "🇵🇭"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 6. HOTSPOT ACTIVITY ── */}
      {activeGame === "hotspot" && (
        <div className="flex flex-col gap-6">
          <div className="text-sm font-semibold text-slate-300">{gameDTO.hotspots.prompt}</div>

          <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
            {gameDTO.hotspots.targets.map((spot) => (
              <button
                key={spot.id}
                disabled={!canInteract}
                onClick={() => handleHotspotClick(spot.id)}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                  selectedHotspot === spot.id
                    ? "bg-emerald-500/60 border-emerald-300 scale-125 animate-pulse"
                    : "bg-emerald-500/20 border-emerald-400 hover:scale-110"
                }`}
              >
                <span className="text-xs font-black text-white">📍</span>
              </button>
            ))}
          </div>

          {hotspotFeedback && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-sm font-semibold">
              {hotspotFeedback}
            </div>
          )}
        </div>
      )}

      {/* ── 7. LESSON REVIEW ── */}
      {activeGame === "lesson_review" && (
        <div className="flex flex-col gap-6 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
          <h3 className="text-lg font-black text-emerald-400">{gameDTO.review.title}</h3>
          <p className="text-sm text-slate-300">{gameDTO.review.summary}</p>
          <ul className="list-disc list-inside text-xs text-slate-400 flex flex-col gap-1">
            {gameDTO.review.keyPoints.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
