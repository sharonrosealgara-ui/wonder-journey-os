import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Sparkles, Compass, Palette, ArrowRight, Eye, Layers } from "lucide-react";

export default function StorybookLearningTeaser() {
  return (
    <section id="storybook" className="py-16 sm:py-24 md:py-32 bg-white border-b border-sand-deep/60 relative overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sunset/15 border border-sunset-deep/30 text-sunset-deep text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-sunset-deep" aria-hidden="true" />
            <span>Living Storybook &bull; Adventure Theater</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-ocean-deep font-bold leading-tight">
            Interactive Storybook Learning
          </h2>
          <p className="text-base sm:text-xl text-ink font-semibold mt-4 leading-relaxed">
            Lessons feel like stepping inside an illustrated explorer&apos;s storybook &mdash; where children touch historical maps, uncover natural wonders, and voice living words.
          </p>
        </div>

        {/* 2-Column Visual Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto mb-12">
          
          {/* Left Column: Visual Story Stage Mockup (7 cols) */}
          <div className="lg:col-span-7">
            <div className="wj-card p-4 sm:p-6 bg-paper border-2 border-sand-deep/80 rounded-3xl shadow-lg relative">
              {/* Decorative paper tape motif */}
              <div className="absolute -top-3 left-10 w-20 h-5 bg-mango/40 border border-sand-deep/60 rounded-xs -rotate-2 shadow-2xs" />

              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-sand-deep/20 border border-sand-deep/70 shadow-inner">
                <Image
                  src="/media/product-tour/tour-lesson-adventure.png"
                  alt="Interactive Adventure Theater Storybook Stage"
                  fill
                  sizes="(max-width: 1024px) 100vw, 650px"
                  className="object-cover"
                  priority={false}
                />
                
                {/* Overlay Floating Clue Pill */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sand-deep/80 shadow-xs flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-mango-deep" />
                  <span className="text-[11px] font-mono font-bold text-ocean-deep">
                    Interactive Drawing &amp; Map Layer
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono text-ink/70">
                <span className="font-bold text-ocean-deep">EXPEDITION STAGE: LIVING STORY</span>
                <span>Active Learner Participation</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Emotional Highlights (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="p-5 rounded-2xl bg-paper border-2 border-sand-deep/70 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-ocean/15 text-ocean-deep flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ocean-deep mb-1">
                Story-Led Archipelago Quests
              </h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
                Children travel through the islands following real historical voyages, regional folklore, and living traditions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-paper border-2 border-sand-deep/70 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-3">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ocean-deep mb-1">
                Active Discovery, Never Passive Video
              </h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
                Learners highlight clues on live maps, practice pronunciation in real time, and draw observations in their journals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-paper border-2 border-sand-deep/70 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-sunset/15 text-sunset-deep flex items-center justify-center mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ocean-deep mb-1">
                Wonder &bull; Curiosity &bull; Joy
              </h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
                Every slide is engineered to spark genuine delight &mdash; replacing test anxiety with the thrill of personal discovery.
              </p>
            </div>

          </div>

        </div>

        {/* Navigation Bridge Link */}
        <div className="text-center">
          <Link
            href="/experience"
            className="wj-btn text-xs sm:text-sm px-6 py-3 inline-flex items-center gap-2 shadow-xs hover:-translate-y-0.5 transition-all"
          >
            <span>Explore the Full Live Experience</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}
