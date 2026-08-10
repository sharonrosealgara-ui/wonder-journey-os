"use client";

import { PageHeader } from "@/components/page-header";
import { SmartPhoto, destinationPhoto } from "@/components/smart-photo";
import { usePhotos } from "@/lib/photos";
import { sfx } from "@/lib/sound";
import { destinations } from "@/config/destinations";
import { getStudent } from "@/config/family";
import { lessons } from "@/config/lessons";
import { KEYS, type LessonCompletion } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

export default function PassportPage() {
  const [completions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const student = getStudent(activeStudentId);
  // real photos from the Photo Studio (fall back to /public, then emoji art)
  const [photos] = usePhotos();

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
    <div className="space-y-8 pb-10">
      <div className="relative z-10 mb-8 bg-gradient-to-br from-ocean/5 to-mango/5 p-8 rounded-3xl border border-white shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[-1]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 30 Q 25 5 50 30 T 100 30' stroke='%23004060' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
               backgroundSize: "200px 200px"
             }}
        />
        <PageHeader
          emoji="🛂"
          title={student ? `${student.name}'s Travel Passport` : "Family Travel Passport"}
          subtitle={`${stampedIds.size} of ${destinations.length} destinations stamped — complete lessons to earn stamps!`}
        />
      </div>

      {regions.map((region) => {
        const regionDests = destinations.filter((d) => d.region === region);
        if (regionDests.length === 0) return null;
        return (
          <section key={region} className="relative z-10">
            <h2 className="mb-4 font-display text-2xl font-extrabold text-ocean-deep flex items-center gap-2 drop-shadow-sm">
              <span className="text-3xl">{region === "Nationwide" ? "🇵🇭" : "🗺️"}</span>
              {region === "Nationwide" ? "The Philippines" : region}
              <div className="flex-1 h-px bg-sand-deep/30 ml-4"></div>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {regionDests.map((d) => {
                const earned = stampedIds.has(d.id);
                return (
                  <div
                    key={d.id}
                    className={`wj-card overflow-hidden text-center group border-2 ${earned ? "border-ocean/20 bg-white/90 shadow-md hover:-translate-y-1 hover:shadow-lg" : "border-white/50 bg-white/50 shadow-sm opacity-90"} transition-all duration-300 backdrop-blur-sm p-0`}
                  >
                    {/* real photo of the place (falls back to emoji art) */}
                    <div className="relative aspect-video w-full overflow-hidden bg-sand-deep/20 border-b-2 border-sand/50">
                      <SmartPhoto
                        src={photos.destination[d.id] || destinationPhoto(d.id)}
                        alt={d.name}
                        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${earned ? "" : "grayscale sepia-[0.3] brightness-90 blur-[2px]"}`}
                        emojiClass="text-5xl drop-shadow-md"
                      />
                      {!earned && (
                        <div className="absolute inset-0 bg-ink/10 backdrop-blur-[1px]"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                      <h3 className="absolute bottom-3 left-0 w-full text-center font-display text-xl font-bold text-white drop-shadow-md tracking-wide px-2">
                        {d.name}
                      </h3>
                    </div>

                    <div className="p-5 flex flex-col items-center">
                      <div
                        className={`wj-stamp relative mx-auto w-fit cursor-pointer px-5 py-4 transition-all duration-300 ease-out active:scale-95 flex flex-col items-center justify-center gap-1 ${earned ? "wj-stamp-earned shadow-sm rotate-2 hover:rotate-0 hover:scale-110" : "bg-sand/30 border-2 border-dashed border-sand-deep/50 opacity-70 hover:opacity-100"}`}
                        onClick={() => (earned ? sfx.stamp() : sfx.reveal())}
                        title={earned ? "Stamped! 🛂" : "Adventure awaits!"}
                      >
                        {/* Hidden Treasure: unearned stamps show a ghost of the
                            real place — a promise, not a blank — with a golden
                            key waiting to unlock it */}
                        <div className={`text-4xl drop-shadow-sm ${earned ? "" : "opacity-40 grayscale"}`}>{d.emoji}</div>
                        {!earned && (
                          <span className="wj-sticker-art absolute -right-3 -top-3 text-2xl drop-shadow-sm hover:scale-110 transition-transform" aria-hidden>🗝️</span>
                        )}
                        <div className="font-display text-[10px] font-extrabold uppercase tracking-widest text-ocean-deep/80 mt-1">
                          {earned ? "★ STAMPED ★" : "Adventure awaits"}
                        </div>
                      </div>
                      
                      <p className="mt-4 text-sm font-medium text-ink/80 leading-relaxed min-h-[2.5rem] flex items-center justify-center">
                        {d.knownFor}
                      </p>
                      
                      {earned && (
                        <div className="mt-4 rounded-2xl bg-gradient-to-br from-mango/10 to-sand/40 border border-mango/20 p-3 text-sm text-ink text-left w-full shadow-inner relative overflow-hidden">
                          <span className="absolute -right-2 -bottom-2 text-4xl opacity-10 blur-[1px]">💡</span>
                          <span className="font-bold text-mango-deep mb-1 block text-xs uppercase tracking-wider">Did you know?</span>
                          <span className="font-medium">{d.funFact}</span>
                        </div>
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
