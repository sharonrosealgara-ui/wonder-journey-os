import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Sparkles, Utensils, BookOpen, Compass, Award, Shield, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Learning Keepsakes & Outcomes Gallery | Wonder Journey",
  description:
    "Explore the tangible outcomes of Wonder Journey: hands-on culinary activities, nature study sketchbooks, passport milestone keepsakes, and family traditions.",
};

export default function GalleryPage() {
  return (
    <div className="py-12 sm:py-16 md:py-24 bg-paper min-h-screen">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sunset/15 border border-sunset-deep/30 text-sunset-deep text-xs sm:text-sm font-bold tracking-wide mb-4">
            <Camera className="w-3.5 h-3.5 text-sunset-deep" aria-hidden="true" />
            <span>Tangible Learning Outcomes</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl text-ocean-deep font-bold leading-tight">
            Learning Keepsakes &amp; Family Memories
          </h1>
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold mt-4 leading-relaxed">
            Wonder Journey lives beyond the screen. Here are the four meaningful ways children and families experience and preserve their cultural adventure.
          </p>
        </div>

        {/* Privacy Notice Card */}
        <div className="wj-card p-5 sm:p-6 bg-sand/30 border-2 border-sand-deep/80 rounded-2xl mb-12 sm:mb-16 flex items-start sm:items-center gap-4 max-w-4xl mx-auto">
          <div className="p-2.5 rounded-xl bg-white border border-sand-deep/70 text-ocean-deep shrink-0">
            <Shield className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-sm sm:text-base font-bold text-ocean-deep">
              Privacy &amp; Child Safeguarding Invariant
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 font-medium mt-0.5 leading-relaxed">
              Wonder Journey strictly protects child privacy. Learner photos, audio keepsakes, and family submissions are securely contained within the authenticated family portal. Public gallery previews depict program activity structures and curriculum representations only.
            </p>
          </div>
        </div>

        {/* 4 Tangible Learning Outcome Pillars */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 mb-16 sm:mb-24">
          
          {/* Pillar 1: Culinary Traditions */}
          <div className="wj-card p-8 sm:p-10 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-6">
                <Utensils className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-mango-deep block mb-1">
                Program Activity 01
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold mb-3">
                Family Kitchen Adventures
              </h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium mb-6">
                Every stage features age-appropriate Filipino cooking explorations designed for families to prepare together. Children measure, blend, and taste authentic dishes while reviewing cultural vocabulary and culinary history.
              </p>
              <div className="space-y-2.5 border-t border-sand-deep/50 pt-5">
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Mango Float Celebration Cake</span>
                  <span className="text-ink/65 font-mono text-xs">Stage 2 &bull; Visayas</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Warm Ginger Arroz Caldo</span>
                  <span className="text-ink/65 font-mono text-xs">Stage 5 &bull; Luzon</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Crispy Banana Turon with Jackfruit</span>
                  <span className="text-ink/65 font-mono text-xs">Stage 7 &bull; Capstone</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-ink-soft italic mt-6">
              * Recipes are shared as structured printable guides and video demonstrations inside the enrolled family portal.
            </p>
          </div>

          {/* Pillar 2: Creative Keepsakes & Sketchbooks */}
          <div className="wj-card p-8 sm:p-10 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-ocean/15 text-ocean-deep flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ocean-deep block mb-1">
                Program Activity 02
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold mb-3">
                Nature Journals &amp; Sketchbooks
              </h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium mb-6">
                Children build physical and digital expedition journals. Following classical Charlotte Mason nature study principles, learners draw indigenous wildlife like the Philippine Eagle, trace island coastlines, and record new Tagalog terms.
              </p>
              <div className="space-y-2.5 border-t border-sand-deep/50 pt-5">
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Botanical Study: Narra &amp; Sampaguita</span>
                  <span className="text-ink/65 font-mono text-xs">Observation Notes</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Archipelago Cartography Sketches</span>
                  <span className="text-ink/65 font-mono text-xs">Topographical Maps</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Conversational Phrase Calligraphy</span>
                  <span className="text-ink/65 font-mono text-xs">Baybayin &amp; Latin Script</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-ink-soft italic mt-6">
              * Journaling sheets and botanical observation templates are provided for every expedition.
            </p>
          </div>

          {/* Pillar 3: Interactive Dialogue & Celebrations */}
          <div className="wj-card p-8 sm:p-10 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sunset/15 text-sunset-deep flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-sunset-deep block mb-1">
                Program Activity 03
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold mb-3">
                Audio Postcards &amp; Celebrations
              </h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium mb-6">
                Each child receives personalized birthday blessings, milestone recognition from Teacher Sharon, and audio postcards celebrating courage in speaking and progress along the journey.
              </p>
              <div className="space-y-2.5 border-t border-sand-deep/50 pt-5">
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Teacher Sharon Voice Blessing</span>
                  <span className="text-ink/65 font-mono text-xs">Birthday Keepsake</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Oral Language Pronunciation Milestones</span>
                  <span className="text-ink/65 font-mono text-xs">Pronunciation Check</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Family Heritage Stories</span>
                  <span className="text-ink/65 font-mono text-xs">Oral History Record</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-ink-soft italic mt-6">
              * Stored securely in each enrolled family&apos;s private keepsakes vault.
            </p>
          </div>

          {/* Pillar 4: Adventure Passport */}
          <div className="wj-card p-8 sm:p-10 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-palm/20 text-palm-deep flex items-center justify-center mb-6">
                <Award className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-palm-deep block mb-1">
                Program Activity 04
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold mb-3">
                Adventure Passport Progress
              </h3>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium mb-6">
                Learners collect bespoke regional passport stamps as they travel through Luzon, Visayas, and Mindanao. Each stamp honors an achieved milestone &mdash; from mastering greetings to completing botanical studies.
              </p>
              <div className="space-y-2.5 border-t border-sand-deep/50 pt-5">
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Mayon Volcano Elevation Badge</span>
                  <span className="text-ink/65 font-mono text-xs">Luzon Stamp</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Visayan Navigator Sea Stamp</span>
                  <span className="text-ink/65 font-mono text-xs">Visayas Stamp</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 font-medium">
                  <span className="text-ocean-deep font-bold">Archipelago Master Explorer Ribbon</span>
                  <span className="text-ink/65 font-mono text-xs">Stage 7 Capstone</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-ink-soft italic mt-6">
              * Digital and physical passport booklets celebrate tangible learner growth.
            </p>
          </div>

        </div>

        {/* Bottom Navigation CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-sand/40 border border-sand-deep/70">
          <div>
            <h3 className="font-display text-lg font-bold text-ocean-deep">Want to see the live session structure?</h3>
            <p className="text-xs sm:text-sm text-ink/80 font-medium">Learn how our 50-minute live interactive sessions are structured with Teacher Sharon.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/experience"
              className="wj-btn text-xs sm:text-sm px-5 py-2.5 inline-flex items-center gap-2 shadow-xs"
            >
              <span>Explore Live Experience</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
