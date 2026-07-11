"use client";

import { PageHeader } from "@/components/page-header";
import { SmartPhoto, destinationPhoto } from "@/components/smart-photo";
import { destinations } from "@/config/destinations";
import { getStudent } from "@/config/family";
import { lessons } from "@/config/lessons";
import { KEYS, type LessonCompletion } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

export default function PassportPage() {
  const [completions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const student = getStudent(activeStudentId);

  // A destination is stamped when a lesson that awards it is completed
  // (by the active student, or by anyone when no student is selected).
  const stampedIds = new Set(
    completions
      .filter((c) => !student || c.studentId === student.id)
      .map((c) => lessons.find((l) => l.id === c.lessonId)?.destinationId)
      .filter(Boolean)
  );

  const regions = ["Nationwide", "Luzon", "Visayas", "Mindanao"] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🛂"
        title={student ? `${student.name}'s Travel Passport` : "Family Travel Passport"}
        subtitle={`${stampedIds.size} of ${destinations.length} destinations stamped — complete lessons to earn stamps!`}
      />

      {regions.map((region) => {
        const regionDests = destinations.filter((d) => d.region === region);
        if (regionDests.length === 0) return null;
        return (
          <section key={region}>
            <h2 className="mb-3 font-display text-xl font-extrabold text-ocean-deep">
              {region === "Nationwide" ? "🇵🇭 The Philippines" : `🗺️ ${region}`}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {regionDests.map((d) => {
                const earned = stampedIds.has(d.id);
                return (
                  <div
                    key={d.id}
                    className={`wj-card overflow-hidden text-center ${earned ? "" : "opacity-80"}`}
                  >
                    {/* real photo of the place (falls back to emoji art) */}
                    <SmartPhoto
                      src={destinationPhoto(d.id)}
                      alt={d.name}
                      emoji={d.emoji}
                      className={`h-24 w-full ${earned ? "" : "grayscale"}`}
                      emojiClass="text-4xl"
                    />
                    <div className="p-4">
                    <div className={`wj-stamp mx-auto w-fit px-4 py-3 ${earned ? "wj-stamp-earned" : ""}`}>
                      <div className="text-3xl">{earned ? d.emoji : "❔"}</div>
                      <div className="font-display text-xs font-extrabold uppercase tracking-wide">
                        {d.name}
                      </div>
                      <div className="text-[10px]">{earned ? "★ STAMPED ★" : "not yet visited"}</div>
                    </div>
                    <p className="mt-3 text-xs text-ink-soft">{d.knownFor}</p>
                    {earned && (
                      <p className="mt-2 rounded-xl bg-sand p-2 text-xs text-ink-soft">
                        💡 {d.funFact}
                      </p>
                    )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
