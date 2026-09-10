import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Compass, Award, ArrowRight, Utensils, Video, BookOpen, Heart } from "lucide-react";
import {
  EditorialContainer,
  JournalSurface,
  MaritimeRoute,
  WashiTapeStrip,
  PostmarkStamp,
  PolaroidFrame,
  FluidMeasure,
} from "@/components/visual";

interface JourneyMoment {
  phase: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  handwrittenNote: string;
  accentBg: string;
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
    accentBg: "bg-sky/15",
    badgeBg: "bg-ocean/15",
    badgeText: "text-ocean-deep",
    icon: <Video className="w-4 h-4 text-ocean-deep" aria-hidden="true" />,
  },
  {
    phase: "DISCOVER",
    stepNumber: "02",
    title: "Open the Living Adventure",
    subtitle: "Language, Geography & Cultural Stories",
    description:
      "No dry lectures. Learners travel across Luzon, Visayas, and Mindanao — speaking conversational Tagalog, deciphering maps, and hearing living folk stories.",
    handwrittenNote: "“Tracing ancient navigation routes across the Visayan Sea.”",
    accentBg: "bg-sand/30",
    badgeBg: "bg-sunset/15",
    badgeText: "text-sunset-deep",
    icon: <Compass className="w-4 h-4 text-sunset-deep" aria-hidden="true" />,
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
    badgeBg: "bg-mango/25",
    badgeText: "text-ocean-deep",
    icon: <Utensils className="w-4 h-4 text-ocean-deep" aria-hidden="true" />,
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
    badgeBg: "bg-palm/25",
    badgeText: "text-palm-deep",
    icon: <Award className="w-4 h-4 text-palm-deep" aria-hidden="true" />,
  },
];

export default function WhatWonderJourneyFeelsLike() {
  return (
    <EditorialContainer
      id="feels-like"
      as="section"
      sceneWidth="4k"
      className="py-16 sm:py-24 md:py-32 bg-paper border-b border-sand-deep/60 relative overflow-hidden"
    >
      {/* Environmental Atmospheric Glows for 4K */}
      <div
        className="absolute top-1/4 -right-40 w-[500px] 2xl:w-[800px] 4k:w-[1100px] h-[500px] 2xl:h-[800px] 4k:h-[1100px] bg-mango/10 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -left-40 w-[500px] 2xl:w-[800px] 4k:w-[1100px] h-[500px] 2xl:h-[800px] 4k:h-[1100px] bg-sky/15 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Section Header: Fluid Measure Bounded */}
      <div className="text-center max-w-3xl 2xl:max-w-4xl 4k:max-w-5xl mx-auto mb-14 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-deep/40 border border-sand-deep/80 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
          <span>The Daily Rhythm</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl 4k:text-8xl text-ocean-deep font-bold leading-tight">
          What Wonder Journey Feels Like
        </h2>
        <FluidMeasure align="center" className="mt-4">
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold leading-relaxed">
            Every session is a living family memory &mdash; moving from intimate welcome to interactive storytelling, shared kitchen fun, and earned passport stamps.
          </p>
        </FluidMeasure>
      </div>

      {/* Editorial Travel-Journal Asymmetrical Composition */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 2xl:gap-16 4k:gap-24 items-start mb-16 sm:mb-20">

        {/* Left Column (7 cols): Dominant Field Journal Expedition Spread */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <JournalSurface
            variant="field-notebook"
            hasStitch={true}
            hasNotebookRuling={true}
            shadow="tactile"
            className="p-6 sm:p-9 md:p-10"
          >
            {/* Field Journal Header Plate */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-sand-deep/70">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-mango-deep" />
                <span className="font-mono text-xs 2xl:text-sm font-bold uppercase tracking-widest text-ocean-deep">
                  Expedition Log &bull; Daily Learning Arc
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold text-ink-soft">
                  ARCHIPELAGO WAYPOINTS
                </span>
                <span className="px-2 py-0.5 rounded-xs bg-sand-deep/30 text-ocean-deep font-mono text-[10px] font-bold">
                  4 STAGES
                </span>
              </div>
            </div>

            {/* Travel Journal Waypoints Flow: 4 Progressive Moments */}
            <div className="space-y-6 relative">
              {/* Subtle Vertical Connector Thread */}
              <div
                className="absolute left-6 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-sand-deep/80 hidden sm:block pointer-events-none"
                aria-hidden="true"
              />

              {MOMENTS.map((m, idx) => (
                <div
                  key={m.phase}
                  className={`p-4 sm:p-5 rounded-2xl ${m.accentBg} border border-sand-deep/70 relative transition-all duration-300 hover:translate-x-1 sm:ml-4`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Step Number Circle */}
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-sand-deep flex items-center justify-center font-mono text-xs font-bold text-ocean-deep shrink-0 shadow-2xs">
                        {m.stepNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${m.badgeBg} ${m.badgeText} text-[11px] font-mono font-bold tracking-wider`}>
                            {m.icon}
                            <span>{m.phase}</span>
                          </span>
                          <span className="font-mono text-[10px] font-bold text-mango-deep uppercase tracking-wider">
                            {m.subtitle}
                          </span>
                        </div>
                        <h3 className="font-display text-base sm:text-lg 2xl:text-xl font-bold text-ocean-deep">
                          {m.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-ink/85 font-medium leading-relaxed mt-1.5 max-w-[55ch]">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    {/* Margin handwritten note tag */}
                    <div className="sm:w-48 shrink-0 mt-2 sm:mt-0 p-2.5 rounded-xl bg-white/95 border border-sand-deep/60 shadow-2xs">
                      <p className="font-hand text-xs sm:text-sm text-ocean-deep leading-snug">
                        {m.handwrittenNote}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Journal Footer Inscription */}
            <div className="mt-7 pt-4 border-t border-sand-deep/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink/75 font-medium">
              <span className="font-serif italic text-ocean-deep">
                &ldquo;Designed to be lived, not just watched on a screen.&rdquo;
              </span>
              <span className="font-mono text-[11px] text-ink-soft">
                Teacher-Led Live Rhythm &bull; Manila Standard Time
              </span>
            </div>
          </JournalSurface>
        </div>

        {/* Right Column (5 cols): Supporting Travel Artifacts & Botanical Accents */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Supporting Artifact 1: Authentic Palawan Coastal Polaroid Frame */}
          <div className="relative flex justify-center">
            <PolaroidFrame
              caption="Northern Palawan Coastal Exploration"
              subcaption="Primary Geography Reference • Lesson 02 Archipelago"
              washiColor="ocean"
              tilt="left"
              className="w-full max-w-sm sm:max-w-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/media/curriculum/l02-visual-b.jpg"
                  alt="Northern Palawan Limestone Karst Formations"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <PostmarkStamp location="PALAWAN 10°N" date="EXPEDITION 02" />
                </div>
              </div>
            </PolaroidFrame>
          </div>

          {/* Supporting Artifact 2: Tactile Family Kitchen Field Card */}
          <JournalSurface
            variant="aged-parchment"
            shadow="tactile"
            tilt="subtle-right"
            className="p-5 sm:p-6"
          >
            <WashiTapeStrip color="mango" position="top-right" />
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="w-4 h-4 text-palm-deep" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-palm-deep">
                Hands-on Family Tradition
              </span>
            </div>
            <h4 className="font-display text-base 2xl:text-lg font-bold text-ocean-deep">
              The Living Kitchen Keepsake
            </h4>
            <p className="text-xs sm:text-sm text-ink/85 font-medium mt-1 leading-relaxed">
              When class wraps, learning steps right into your kitchen. Structured family recipes turn language words like <em className="font-serif font-bold text-ocean-deep">&ldquo;mangga&rdquo;</em> and <em className="font-serif font-bold text-ocean-deep">&ldquo;gatas&rdquo;</em> into shared meals and sensory memories.
            </p>
            <div className="mt-3 p-2.5 rounded-xl bg-white/70 border border-sand-deep/60">
              <p className="font-hand text-xs text-ocean-deep">
                &ldquo;Carabao mango float &bull; No oven required &bull; Layered with love&rdquo;
              </p>
            </div>
          </JournalSurface>

          {/* Supporting Artifact 3: Direct Bridge to Experience */}
          <JournalSurface
            variant="pressed-cream"
            shadow="soft"
            className="p-5 sm:p-6 border-2 border-sand-deep/80"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-mango-deep block">
                  Curious How A Full Session Unfolds?
                </span>
                <h4 className="font-display text-base font-bold text-ocean-deep mt-0.5">
                  Explore the Complete 3-Pillar Experience
                </h4>
              </div>
              <Link
                href="/experience"
                className="wj-btn text-xs px-4 py-2.5 inline-flex items-center gap-1.5 shrink-0 shadow-xs hover:-translate-y-0.5 transition-all"
              >
                <span>Discover</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </JournalSurface>

        </div>

      </div>

      {/* Maritime Archipelago Route Connector Accent */}
      <div className="hidden lg:block max-w-4xl 2xl:max-w-5xl mx-auto pt-4">
        <MaritimeRoute
          orientation="horizontal"
          theme="brass"
          waypoints={[
            { id: "1", label: "Gather & Greet", coordinate: "Living Circle" },
            { id: "2", label: "Living Story", coordinate: "Storybook Stage" },
            { id: "3", label: "Kitchen & Nature", coordinate: "Family Hands-on" },
            { id: "4", label: "Passport Stamp", coordinate: "Milestone Celebration" },
          ]}
        />
      </div>

    </EditorialContainer>
  );
}
