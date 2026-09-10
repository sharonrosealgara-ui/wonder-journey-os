import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Sparkles, Compass, Palette, ArrowRight, Eye } from "lucide-react";
import {
  EditorialContainer,
  JournalSurface,
  WashiTapeStrip,
  FluidMeasure,
} from "@/components/visual";

export default function StorybookLearningTeaser() {
  return (
    <EditorialContainer
      id="storybook"
      as="section"
      sceneWidth="4k"
      className="py-16 sm:py-24 md:py-32 bg-white border-b border-sand-deep/60 relative overflow-hidden"
    >
      {/* 4K Environmental Accents */}
      <div
        className="absolute top-1/3 -right-32 w-[500px] 2xl:w-[750px] 4k:w-[1000px] h-[500px] 2xl:h-[750px] 4k:h-[1000px] bg-sunset/10 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 -left-32 w-[500px] 2xl:w-[750px] 4k:w-[1000px] h-[500px] 2xl:h-[750px] 4k:h-[1000px] bg-sand/30 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Section Header: Fluid Measure Bounded */}
      <div className="text-center max-w-3xl 2xl:max-w-4xl 4k:max-w-5xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sunset/15 border border-sunset-deep/30 text-sunset-deep text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-sunset-deep" aria-hidden="true" />
          <span>Living Storybook &bull; Adventure Theater</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl 4k:text-8xl text-ocean-deep font-bold leading-tight">
          Interactive Storybook Learning
        </h2>
        <FluidMeasure align="center" className="mt-4">
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold leading-relaxed">
            Lessons feel like stepping inside an illustrated explorer&apos;s storybook &mdash; where children touch historical maps, uncover natural wonders, and voice living words.
          </p>
        </FluidMeasure>
      </div>

      {/* Discovery Spread & Adventure Sequence (Varied Editorial Hierarchy, Not 3 Identical Cards) */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 2xl:gap-16 items-center max-w-6xl 2xl:max-w-7xl 4k:max-w-[2000px] mx-auto mb-12">
        
        {/* Left Column: Visual Story Stage Mockup Framed in Field Journal (7 cols) */}
        <div className="lg:col-span-7">
          <JournalSurface
            variant="field-notebook"
            hasStitch={true}
            shadow="tactile"
            className="p-4 sm:p-7 2xl:p-9 border-2 border-sand-deep/80 relative"
          >
            <WashiTapeStrip color="mango" position="top-left" />

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-sand-deep/20 border border-sand-deep/70 shadow-inner">
              <Image
                src="/media/product-tour/tour-lesson-adventure.png"
                alt="Interactive Adventure Theater Storybook Stage"
                fill
                sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 650px, 1000px"
                className="object-cover"
                priority={false}
              />
              
              {/* Overlay Floating Clue Pill */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-sand-deep/80 shadow-xs flex items-center gap-2">
                <Palette className="w-4 h-4 text-mango-deep" />
                <span className="text-[11px] 2xl:text-xs font-mono font-bold text-ocean-deep">
                  Interactive Drawing &amp; Map Layer
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-sand-deep/50 flex items-center justify-between text-xs 2xl:text-sm font-mono text-ink/70">
              <span className="font-bold text-ocean-deep uppercase tracking-wider">
                EXPEDITION STAGE: LIVING STORY
              </span>
              <span className="font-semibold text-ocean-deep/80">
                Active Learner Participation
              </span>
            </div>
          </JournalSurface>
        </div>

        {/* Right Column: Varied Editorial Discovery Sequence (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 2xl:gap-5">
          
          {/* Item 1: Dominant Aged Parchment Chapter Card */}
          <JournalSurface
            variant="aged-parchment"
            shadow="tactile"
            tilt="subtle-right"
            className="p-5 2xl:p-6 border-2 border-[#dfcfb0]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-ocean/15 text-ocean-deep text-xs font-mono font-bold">
                <Compass className="w-3.5 h-3.5" />
                <span>Chapter 01</span>
              </div>
              <span className="font-mono text-[10px] 2xl:text-xs font-bold text-ink-soft">
                14°N Visayan Route
              </span>
            </div>
            <h3 className="font-display text-lg 2xl:text-xl font-bold text-ocean-deep mb-1.5">
              Story-Led Archipelago Quests
            </h3>
            <p className="text-xs sm:text-sm 2xl:text-base text-ink/85 leading-relaxed font-medium">
              Children travel through the islands following real historical voyages, regional folklore, and living traditions &mdash; igniting curiosity and geographic connection.
            </p>
          </JournalSurface>

          {/* Item 2: Interactive Discovery Note with Pressed Cream Card */}
          <JournalSurface
            variant="pressed-cream"
            shadow="soft"
            className="p-5 2xl:p-6 border-2 border-mango/40 relative overflow-hidden"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center shrink-0 shadow-2xs">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base 2xl:text-lg font-bold text-ocean-deep mb-1">
                  Active Discovery, Never Passive Video
                </h3>
                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
                  Learners highlight clues on live maps, practice pronunciation in real time, and draw observations in their journals alongside Teacher Sharon.
                </p>
              </div>
            </div>
          </JournalSurface>

          {/* Item 3: Warm Heart & Wonder Affirmation Plaque */}
          <div className="p-4 2xl:p-5 rounded-2xl bg-gradient-to-r from-sunset/10 via-sand/40 to-mango/10 border border-sand-deep/70 shadow-2xs flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full bg-sunset/20 text-sunset-deep flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-sm 2xl:text-base font-bold text-ocean-deep">
                Wonder &bull; Curiosity &bull; Joy
              </h3>
              <p className="text-xs 2xl:text-sm text-ink/80 font-medium mt-0.5">
                Every slide is engineered to spark genuine delight &mdash; replacing test anxiety with the thrill of personal discovery.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Navigation Bridge Link */}
      <div className="text-center">
        <Link
          href="/experience"
          className="wj-btn text-xs sm:text-sm 2xl:text-base px-6 py-3 inline-flex items-center gap-2 shadow-xs hover:-translate-y-0.5 transition-all"
        >
          <span>Explore the Full Live Experience</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

    </EditorialContainer>
  );
}
