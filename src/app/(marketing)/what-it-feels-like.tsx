import React from "react";
import Link from "next/link";
import { Sparkles, Compass, Heart, Award, ArrowRight, BookOpen, Utensils, Video } from "lucide-react";

interface JourneyMoment {
  phase: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  handwrittenNote: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
}

const MOMENTS: JourneyMoment[] = [
  {
    phase: "JOIN",
    stepNumber: "01",
    title: "Gather in the Living Circle",
    subtitle: "Warm Welcome & Community Blessing",
    description:
      "A friendly face awaits. Every child is greeted by name as Teacher Sharon opens class with warm conversation, island orientation, and an opening prayer.",
    handwrittenNote: "“Mabuhay! Are you ready for today's expedition?”",
    accentBg: "bg-sky/20",
    accentBorder: "border-sky-deep/40",
    badgeBg: "bg-ocean/15",
    badgeText: "text-ocean-deep",
    icon: <Video className="w-5 h-5 text-ocean-deep" aria-hidden="true" />,
  },
  {
    phase: "DISCOVER",
    stepNumber: "02",
    title: "Open the Living Adventure",
    subtitle: "Language, Geography & Cultural Stories",
    description:
      "No dry lectures. Learners travel across Luzon, Visayas, and Mindanao — speaking conversational Tagalog, deciphering maps, and hearing living folk stories.",
    handwrittenNote: "“Tracing ancient navigation routes across the Visayan Sea.”",
    accentBg: "bg-sand/40",
    accentBorder: "border-sand-deep/70",
    badgeBg: "bg-sunset/15",
    badgeText: "text-sunset-deep",
    icon: <Compass className="w-5 h-5 text-sunset-deep" aria-hidden="true" />,
  },
  {
    phase: "CREATE",
    stepNumber: "03",
    title: "Make, Cook & Sketch Together",
    subtitle: "Hands-on Kitchen & Nature Keepsakes",
    description:
      "Learning spills into the family kitchen and sketchbook. From layering mango float to observing native narra leaves, children create tangible cultural connections.",
    handwrittenNote: "“Today's kitchen mission: layering sweet mangoes and cream!”",
    accentBg: "bg-mango/15",
    accentBorder: "border-mango-deep/40",
    badgeBg: "bg-mango/25",
    badgeText: "text-ocean-deep",
    icon: <Utensils className="w-5 h-5 text-ocean-deep" aria-hidden="true" />,
  },
  {
    phase: "CELEBRATE",
    stepNumber: "04",
    title: "Stamp the Adventure Passport",
    subtitle: "Milestone Honors & Personal Blessings",
    description:
      "Every expedition closes with celebration. Learners earn bespoke regional stamps in their physical and digital passports, affirmed by teacher recognition and gratitude.",
    handwrittenNote: "“Stamp earned: Chocolate Hills Island Navigator!”",
    accentBg: "bg-palm/15",
    accentBorder: "border-palm-deep/40",
    badgeBg: "bg-palm/25",
    badgeText: "text-palm-deep",
    icon: <Award className="w-5 h-5 text-palm-deep" aria-hidden="true" />,
  },
];

export default function WhatWonderJourneyFeelsLike() {
  return (
    <section id="feels-like" className="py-16 sm:py-24 md:py-32 bg-paper border-b border-sand-deep/60 relative overflow-hidden">
      {/* Subtle organic background accents */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-mango/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-sky/15 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16 relative z-10">
        
        {/* Section Header: Experience-First Anchor */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-deep/40 border border-sand-deep/80 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
            <span>The Daily Rhythm</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-ocean-deep font-bold leading-tight">
            What Wonder Journey Feels Like
          </h2>
          <p className="text-base sm:text-xl text-ink font-semibold mt-4 leading-relaxed">
            Every session is a living family memory &mdash; moving from intimate welcome to interactive storytelling, shared kitchen fun, and earned passport stamps.
          </p>
        </div>

        {/* Illustrated Journey Trail Flow (Not Generic Cards) */}
        <div className="relative mb-14 sm:mb-20">
          {/* Subtle SVG connector trail behind milestones (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-8 h-12 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 1000 60" fill="none" preserveAspectRatio="none">
              <path
                d="M 50,30 Q 250,5 450,35 T 850,25 Q 950,45 980,30"
                stroke="#ffd23f"
                strokeWidth="3"
                strokeDasharray="8 8"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 2xl:gap-8 relative z-10">
            {MOMENTS.map((m, idx) => (
              <div
                key={m.phase}
                className={`wj-card p-6 sm:p-7 rounded-3xl ${m.accentBg} border-2 ${m.accentBorder} shadow-sm flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
                  idx % 2 === 0 ? "lg:translate-y-0" : "lg:translate-y-4"
                }`}
              >
                {/* Washi-Tape Accent */}
                <div
                  className={`absolute -top-3 left-8 w-16 h-5 bg-white/85 border border-sand-deep/60 rounded-xs shadow-2xs opacity-90 ${
                    idx % 2 === 0 ? "-rotate-2" : "rotate-2"
                  }`}
                />

                <div>
                  {/* Phase Stamp + Step Waypoint */}
                  <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${m.badgeBg} ${m.badgeText} text-xs font-mono font-bold tracking-wider shadow-2xs`}>
                      {m.icon}
                      <span>{m.phase}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-ocean-deep/50 tracking-wider">
                      STEP {m.stepNumber}
                    </span>
                  </div>

                  {/* Title and Subtitle */}
                  <h3 className="font-display text-lg sm:text-xl text-ocean-deep font-bold leading-snug mb-1">
                    {m.title}
                  </h3>
                  <p className="font-mono text-[11px] text-mango-deep font-bold uppercase tracking-wider mb-3">
                    {m.subtitle}
                  </p>

                  {/* Narrative description */}
                  <p className="text-xs sm:text-sm text-ink/85 leading-relaxed font-medium">
                    {m.description}
                  </p>
                </div>

                {/* Hand-lettered margin note */}
                <div className="mt-6 pt-4 border-t border-sand-deep/50">
                  <div className="p-3 rounded-xl bg-white/95 border border-sand-deep/60 shadow-2xs">
                    <p className="font-hand text-sm sm:text-base text-ocean-deep leading-snug">
                      {m.handwrittenNote}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative Flow Banner with Direct Bridge to /experience */}
        <div className="wj-card p-6 sm:p-10 rounded-3xl bg-white border-2 border-sand-deep/80 shadow-sm max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-ocean-deep/80 uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5 text-mango-deep" />
              <span>Living Curriculum Examples</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold">
              Curious how a full class unfolds with Teacher Sharon?
            </h3>
            <p className="text-xs sm:text-sm text-ink/80 font-medium mt-1.5 leading-relaxed">
              Explore the 3-pillar learning structure, interactive presentation stages, and family keepsakes rhythm.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/experience"
              className="wj-btn text-xs sm:text-sm px-6 py-3 inline-flex items-center gap-2 shadow-xs hover:-translate-y-0.5 transition-all"
            >
              <span>Explore the Experience</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
