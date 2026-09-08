import React from "react";
import Image from "next/image";
import { Video, ShieldAlert, Users, Sparkles } from "lucide-react";

export default function RealClassroomExperience() {
  return (
    <section id="live-experience" className="py-14 sm:py-20 md:py-28 bg-white border-b border-sand-deep/50">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ocean/15 border border-ocean/30 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-3">
            <Video className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Documentary Archive</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl 4k:text-7xl text-ocean-deep font-bold mt-1 leading-tight">
            Real Classes. Real Connections. Real Care.
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl text-ink font-semibold mt-3 leading-relaxed">
            A genuine Wonder Journey classroom session &mdash; Teacher Sharon guiding young learners through living Philippine geography, language, and culture. Designed for focused, small-group learning.
          </p>
        </div>

        {/* Documentary Presentation Card (Responsive across 4K, Desktop, Tablet, and Mobile) */}
        <div className="max-w-5xl 2xl:max-w-6xl mx-auto">
          <div className="wj-card p-5 sm:p-8 2xl:p-10 bg-paper border-2 border-sand-deep/80 rounded-3xl shadow-sm overflow-hidden">
            
            {/* Top Bar with Guardian Authorization Protocol Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-sand-deep/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-mango animate-pulse" />
                <span className="font-display text-xs sm:text-sm font-bold text-ocean-deep">
                  Synchronized Live Session Stage
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/80 border border-sand-deep/70 text-[10px] sm:text-xs font-mono font-bold text-ocean-deep">
                <ShieldAlert className="w-3.5 h-3.5 text-sunset-deep shrink-0" aria-hidden="true" />
                <span>PENDING EXPLICIT GUARDIAN AUTHORIZATION FOR PUBLIC/MARKETING USE</span>
              </div>
            </div>

            {/* Documentary Stage Visual Canvas (Using verified safe product tour capture) */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-sand-deep/20 border-2 border-sand-deep/70 shadow-inner">
              <Image
                src="/media/product-tour/tour-live-classroom.png"
                alt="Wonder Journey Live Classroom Session Stage"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="object-cover"
                priority={false}
              />

              {/* Documentary Overlay Watermark */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-sand-deep/80 shadow-xs flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-ocean-deep" aria-hidden="true" />
                <span className="text-[11px] sm:text-xs font-display font-bold text-ocean-deep">
                  Designed for focused, small-group learning
                </span>
              </div>
            </div>

            {/* Bottom Safeguard Note */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink/75 font-medium">
              <p>
                Learner identities, family names, and meeting infrastructure are strictly protected under Wonder Journey child privacy standards.
              </p>
              <span className="font-mono text-[10px] text-ink/60 shrink-0">
                All minor faces and identifiers masked in local review derivatives
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
