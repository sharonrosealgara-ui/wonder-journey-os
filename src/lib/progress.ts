"use client";

import { badges } from "@/config/badges";
import { destinations } from "@/config/destinations";
import { getLesson } from "@/config/lessons";
import {
  KEYS,
  type AdventureMemory,
  type AwardedBadge,
  type GratitudeEntry,
  type JournalEntry,
  type LessonCompletion,
} from "@/lib/app-state";
import { useStored } from "@/lib/storage";

// Explorer progression — every bit of family activity earns points.
// 250 XP per level (matches the Home Base top bar).
const XP_PER_LEVEL = 250;

const POINTS = {
  adventure: 50, // completed lesson
  badge: 20,
  memory: 10,
  blessing: 5,
  journal: 5,
};

export type Progress = {
  points: number;
  level: number;
  xpInLevel: number;
  xpForLevel: number;
  placesExplored: number;
  placesTotal: number;
  stamps: number;
  badgesEarned: number;
  badgesTotal: number;
  adventuresDone: number;
};

export function useProgress(): Progress {
  const [completions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const [gratitude] = useStored<GratitudeEntry[]>(KEYS.gratitude, []);
  const [journal] = useStored<JournalEntry[]>(KEYS.journal, []);
  const [awards] = useStored<AwardedBadge[]>(KEYS.awards, []);
  const [memories] = useStored<AdventureMemory[]>(KEYS.memories, []);

  const uniqueStamps = new Set(
    completions
      .map((c) => getLesson(c.lessonId)?.destinationId)
      .filter((d): d is string => Boolean(d))
  );
  const uniqueBadges = new Set(awards.map((a) => a.badgeId));

  const points =
    completions.length * POINTS.adventure +
    awards.length * POINTS.badge +
    memories.length * POINTS.memory +
    gratitude.length * POINTS.blessing +
    journal.length * POINTS.journal;

  return {
    points,
    level: Math.floor(points / XP_PER_LEVEL) + 1,
    xpInLevel: points % XP_PER_LEVEL,
    xpForLevel: XP_PER_LEVEL,
    placesExplored: uniqueStamps.size,
    placesTotal: destinations.length,
    stamps: uniqueStamps.size,
    badgesEarned: uniqueBadges.size,
    badgesTotal: badges.length,
    adventuresDone: completions.length,
  };
}
