import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Video, ShieldCheck, Users, Sparkles, Camera } from "lucide-react";
import {
  EditorialContainer,
  JournalSurface,
  LearnerPrivacyShield,
  FluidMeasure,
  WashiTapeStrip,
} from "@/components/visual";

interface IllustratedLearner {
  name: string;
  avatarBg: string;
  badge: string;
  role: string;
  dialogue: string;
  svgAvatar: React.ReactNode;
}

const LEARNERS: IllustratedLearner[] = [
  {
    name: "Learner One",
    avatarBg: "bg-mango/25 border-mango-deep",
    badge: "Tagalog Explorer ✨",
    role: "Practicing 'Salamat Po'",
    dialogue: "“Mabuhay po! We're learning Visayan words today!”",
    svgAvatar: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" aria-label="Illustrated Learner One">
        <circle cx="20" cy="20" r="18" fill="#FCE9C8" stroke="#D97706" strokeWidth="2" />
        <path d="M10 18 C10 12 30 12 30 18 Z" fill="#B45309" />
        <ellipse cx="20" cy="18" rx="14" ry="3" fill="#D97706" />
        <circle cx="16" cy="23" r="2" fill="#451A03" />
        <circle cx="24" cy="23" r="2" fill="#451A03" />
        <path d="M17 27 Q20 31 23 27" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="14" cy="25" r="2" fill="#FCA5A5" opacity="0.6" />
        <circle cx="26" cy="25" r="2" fill="#FCA5A5" opacity="0.6" />
      </svg>
    ),
  },
  {
    name: "Learner Two",
    avatarBg: "bg-sky/25 border-sky-deep",
    badge: "Visayas Navigator 🧭",
    role: "Tracing Coral Reefs",
    dialogue: "“Look! I spotted the Chocolate Hills on the map!”",
    svgAvatar: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" aria-label="Illustrated Learner Two">
        <circle cx="20" cy="20" r="18" fill="#D8F3DC" stroke="#0D9488" strokeWidth="2" />
        <path d="M12 16 Q20 10 28 16 Q26 12 20 12 Q14 12 12 16" fill="#065F46" />
        <circle cx="16" cy="22" r="4.5" stroke="#0F766E" strokeWidth="1.5" />
        <circle cx="24" cy="22" r="4.5" stroke="#0F766E" strokeWidth="1.5" />
        <line x1="20.5" y1="22" x2="19.5" y2="22" stroke="#0F766E" strokeWidth="1.5" />
        <circle cx="16" cy="22" r="1.5" fill="#042F2E" />
        <circle cx="24" cy="22" r="1.5" fill="#042F2E" />
        <path d="M18 28 Q20 30 22 28" stroke="#042F2E" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Learner Three",
    avatarBg: "bg-sunset/20 border-sunset-deep",
    badge: "Nature Artist 🎨",
    role: "Sketching Narra Leaves",
    dialogue: "“My Narra leaf has 9 symmetric leaflets!”",
    svgAvatar: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" aria-label="Illustrated Learner Three">
        <circle cx="20" cy="20" r="18" fill="#FFE4E6" stroke="#E11D48" strokeWidth="2" />
        <path d="M11 17 C13 11 27 11 29 17 Z" fill="#881337" />
        <line x1="12" y1="16" x2="28" y2="16" stroke="#FB7185" strokeWidth="2.5" />
        <circle cx="16" cy="23" r="2" fill="#4C0519" />
        <circle cx="24" cy="23" r="2" fill="#4C0519" />
        <path d="M17 27 Q20 31 23 27" stroke="#4C0519" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="14" cy="25" r="2.5" fill="#FDA4AF" opacity="0.7" />
        <circle cx="26" cy="25" r="2.5" fill="#FDA4AF" opacity="0.7" />
      </svg>
    ),
  },
];

export default function LiveClassroomExperience() {
  return (
    <EditorialContainer
      id="live-classroom"
      as="section"
      sceneWidth="4k"
      className="py-16 sm:py-24 md:py-32 bg-white border-b border-sand-deep/60 relative overflow-hidden"
    >
      {/* Subtle Environmental 4K Background Glows */}
      <div
        className="absolute top-1/3 -right-32 w-[500px] 2xl:w-[750px] 4k:w-[1000px] h-[500px] 2xl:h-[750px] 4k:h-[1000px] bg-ocean/10 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 -left-32 w-[500px] 2xl:w-[750px] 4k:w-[1000px] h-[500px] 2xl:h-[750px] 4k:h-[1000px] bg-sand/30 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Section Header: Fluid Measure Bounded */}
      <div className="text-center max-w-3xl 2xl:max-w-4xl 4k:max-w-5xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ocean/15 border border-ocean/30 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
          <Video className="w-3.5 h-3.5 text-ocean-deep" aria-hidden="true" />
          <span>Interactive Living Classroom</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl 4k:text-8xl text-ocean-deep font-bold leading-tight">
          Real Live Sessions. Real Connection.
        </h2>
        <FluidMeasure align="center" className="mt-4">
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold leading-relaxed">
            Designed for focused, small-group learning &mdash; where Teacher Sharon knows every child, guides living dialogue, and nurtures family cultural pride.
          </p>
        </FluidMeasure>
      </div>

      {/* Classroom Frame Mockup: Expanded for 4K */}
      <div className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4k:max-w-[2000px] mx-auto mb-10">
        <JournalSurface
          variant="pressed-cream"
          shadow="archival"
          className="p-5 sm:p-8 md:p-10 border-2 border-sand-deep/80"
        >
          {/* Top Bar with Guardian Authorization Protocol Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-sand-deep/60">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-mango animate-pulse" />
              <span className="font-display text-xs sm:text-sm 2xl:text-base font-bold text-ocean-deep">
                Live Guided Session Stage
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sand text-ink/75 font-mono text-[11px] 2xl:text-xs font-bold">
                Stage 4 &bull; Visayas Expedition
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean/10 text-ocean-deep text-[11px] 2xl:text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-ocean-deep" />
              <span>PRIVACY-SAFE LEARNER PRESENTATION &bull; ILLUSTRATED REPRESENTATIONS</span>
            </div>
          </div>

          {/* Interactive Live Classroom Layout: Stage (7 cols) + Teacher & Learners Sidebar (5 cols) */}
          <div className="grid md:grid-cols-12 gap-6 2xl:gap-8 items-start">
            
            {/* Main Presentation Stage: 7 cols */}
            <div className="md:col-span-7 relative aspect-[16/11] rounded-2xl overflow-hidden bg-sand-deep/20 border-2 border-sand-deep/70 shadow-inner">
              <Image
                src="/media/product-tour/tour-live-classroom.png"
                alt="Wonder Journey Live Classroom Session Stage"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1536px) 750px, 1100px"
                className="object-cover"
                priority={false}
              />
              {/* Overlay live topic badge */}
              <div className="absolute top-3 left-3 bg-ocean-deep/90 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs 2xl:text-sm font-mono font-semibold shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-mango" />
                <span>Topic: Bohol Maritime &amp; Coral Wonders</span>
              </div>
            </div>

            {/* Sidebar: Teacher Sharon (Human Anchor Frame) + 3 Illustrated Explorer Learners (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              
              {/* Teacher Sharon Tile — The Real Human Anchor */}
              <JournalSurface
                variant="aged-parchment"
                shadow="soft"
                className="p-4 2xl:p-5 border-2 border-mango/50 relative overflow-hidden"
              >
                <WashiTapeStrip color="mango" position="top-right" />
                
                <div className="flex items-start gap-3.5">
                  {/* Editorial Archival Portrait Frame (Reserved Area) */}
                  <div className="w-16 h-18 rounded-xl bg-sand/60 border-2 border-dashed border-ocean-deep/50 flex flex-col items-center justify-center p-1 text-center shrink-0 shadow-2xs relative">
                    <Camera className="w-5 h-5 text-ocean-deep mb-1" aria-hidden="true" />
                    <span className="text-[8px] font-mono font-bold leading-tight text-ocean-deep uppercase">
                      Portrait Area Reserved
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base 2xl:text-lg font-bold text-ocean-deep">
                        Teacher Sharon
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-mango/25 text-ocean-deep text-[10px] font-mono font-bold uppercase tracking-wider">
                        Lead Guide
                      </span>
                    </div>
                    <p className="text-xs 2xl:text-sm text-ink/80 font-medium mt-0.5">
                      Negros Occidental, Philippines &bull; Founder
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-palm/15 text-palm-deep text-[10px] font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-palm animate-ping" />
                        <span>Speaking Tagalog</span>
                      </span>
                      <span className="text-[10px] font-mono text-ink/60">
                        One-to-Few Live
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-sand-deep/50 text-[10px] font-mono text-ink/65 italic">
                  * Lead mentor who personally greets each child by name in every session. Authentic portrait media reserved for owner file upload.
                </div>
              </JournalSurface>

              {/* 3 Intentionally Illustrated Child Explorer Avatars with Speech Dialogue */}
              <div className="space-y-2.5">
                <span className="text-[10px] 2xl:text-xs font-mono font-bold uppercase tracking-widest text-ocean-deep/70 px-1 block">
                  Illustrated Cohort Explorers (Privacy-Safe)
                </span>

                {LEARNERS.map((lrn) => (
                  <div
                    key={lrn.name}
                    className="p-2.5 sm:p-3 rounded-2xl bg-white/90 border border-sand-deep/70 shadow-2xs flex items-center gap-3 transition-transform hover:translate-x-1"
                  >
                    {/* Character Illustrated Avatar Badge */}
                    <div className={`p-0.5 rounded-2xl ${lrn.avatarBg} border-2 flex items-center justify-center shrink-0 shadow-2xs`}>
                      {lrn.svgAvatar}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs 2xl:text-sm font-bold text-ocean-deep">
                          {lrn.name}
                        </span>
                        <span className="inline-block text-[9px] font-mono font-bold text-ocean-deep bg-sand/70 px-1.5 py-0.5 rounded-xs">
                          {lrn.badge}
                        </span>
                      </div>
                      <p className="font-hand text-xs 2xl:text-sm text-ink/80 leading-snug mt-0.5">
                        {lrn.dialogue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Bottom Caption Bar */}
          <div className="mt-5 pt-4 border-t border-sand-deep/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs 2xl:text-sm text-ink/75 font-medium">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-mango-deep" />
              <span className="font-semibold text-ocean-deep">
                Designed for focused, small-group learning.
              </span>
            </div>
            <span className="text-[11px] 2xl:text-xs text-ink/65 font-mono">
              Teacher Sharon personally mentors every cohort member.
            </span>
          </div>

        </JournalSurface>
      </div>

      {/* Required Child Privacy Note Banner (LearnerPrivacyShield) */}
      <div className="max-w-4xl 2xl:max-w-5xl mx-auto">
        <LearnerPrivacyShield
          variant="callout"
          text="Learner visuals are illustrated/anonymized representations used to protect children's identities. The classroom experience shown is based on a real Wonder Journey session."
        />
      </div>

    </EditorialContainer>
  );
}
