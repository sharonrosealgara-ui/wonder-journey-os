"use client";

import Link from "next/link";
import { CheckCircle2, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { lessons } from "@/config/lessons";
import { familyValues } from "@/config/values";
import { formatDate, KEYS, type LessonCompletion, getLessonDisplayStatus } from "@/lib/app-state";
import { useStored } from "@/lib/storage";
import { FactualImage } from "@/components/factual-image";

export default function LessonsPage() {
  const [completions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);

  return (
    <div className="relative z-10">
      <PageHeader
        emoji="🗺️"
        title="Adventure Map"
        subtitle="Our journey through the Philippines — one destination at a time."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {lessons
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((lesson) => {
            const status = getLessonDisplayStatus(lesson.id, lesson.date, completions, activeStudentId);
            const isUpcoming = status === "upcoming";
            const isCompleted = status === "completed";

            // Visual category identity
            const isCooking = lesson.category === "Cooking";
            const isValues = lesson.category === "Values";
            const borderColor = isCooking ? "border-mango/50" : isValues ? "border-ube/50" : "border-ocean/50";
            const badgeColor = isCooking ? "bg-mango/10 text-mango-deep" : isValues ? "bg-ube/10 text-ube-deep" : "bg-ocean/10 text-ocean-deep";

            return (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className={`wj-card wj-card-hover group flex flex-col overflow-hidden bg-white/90 border-2 ${borderColor} shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative`}
              >
                {/* Small travel decoration in the background */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0"
                     style={{
                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 Q 10 10 20 20 T 40 20' stroke='%23004060' fill='none' stroke-width='1' stroke-dasharray='2,2'/%3E%3C/svg%3E")`,
                       backgroundSize: "60px 60px"
                     }}
                />

                {/* Premium Visual Anchor using FactualImage (pending state fallback) */}
                <div className="relative aspect-[4/3] w-full bg-sand-deep border-b-2 border-white z-10">
                  <FactualImage media={{ status: "pending" }} fill className="rounded-none border-0 opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    {isCompleted && (
                      <span className="wj-chip !bg-palm !text-white !py-1 backdrop-blur-sm shadow-sm font-bold flex items-center tracking-wide text-[10px] uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="wj-chip !bg-white/90 !text-ube-deep !py-1 backdrop-blur-sm shadow-sm font-bold flex items-center tracking-wide text-[10px] uppercase">
                        <CalendarDays className="w-3.5 h-3.5 mr-1" /> Scheduled
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col relative z-10 bg-gradient-to-b from-white to-sand/10">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform origin-bottom-left" aria-hidden>{lesson.emoji}</span>
                  </div>
                  
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className={`wj-chip !font-bold text-[10px] tracking-widest uppercase ${badgeColor}`}>Destination {lesson.order}</span>
                    <span className={`wj-chip !font-bold text-[10px] tracking-widest uppercase ${badgeColor}`}>{lesson.category}</span>
                  </div>
                  
                  <h2 className="font-display text-2xl font-extrabold text-ink leading-tight">{lesson.title}</h2>
                  <p className="mt-1.5 text-sm text-ink-soft line-clamp-2 font-medium">{lesson.subtitle}</p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                    <span className="flex items-center"><CalendarDays className="w-3 h-3 mr-1" /> {formatDate(lesson.date)}</span>
                    <span className="bg-sand-deep px-2 py-0.5 rounded-sm">{lesson.time}</span>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>

      <section className="mt-14 wj-card p-8 border-2 border-white bg-gradient-to-br from-sand to-hibiscus/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl -rotate-12 pointer-events-none">❤️</div>
        <div className="relative z-10">
          <h2 className="mb-2 font-display text-3xl font-extrabold text-hibiscus-deep">Values we carry</h2>
          <p className="mb-6 text-sm font-semibold text-ink-soft">
            Filipino family values woven through every adventure.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {familyValues.map((v) => (
              <div key={v.id} className="wj-card p-5 border-2 border-white bg-white/60 hover:bg-white transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl drop-shadow-sm">{v.emoji}</span>
                  <div>
                    <div className="font-display font-extrabold leading-tight text-ink">{v.name}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-ink-soft">{v.filipinoName}</div>
                  </div>
                </div>
                <p className="text-sm text-ink-soft font-medium leading-relaxed">{v.meaning}</p>
                <p className="mt-3 text-[10px] font-bold text-ocean-deep tracking-widest uppercase bg-ocean/5 p-2 rounded-md">{v.verse}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
