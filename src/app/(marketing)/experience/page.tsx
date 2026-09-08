import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Video, Compass, Heart, ArrowRight, ShieldCheck, BookOpen, Clock } from "lucide-react";
import ProductTour from "../product-tour";

export const metadata: Metadata = {
  title: "Experience Wonder Journey | A Living Family Learning Adventure",
  description:
    "Discover what participating in Wonder Journey feels like: live small-group sessions with Teacher Sharon, interactive Adventure Theater, earned passport stamps, and shared family moments.",
};

export default function ExperiencePage() {
  return (
    <div className="py-12 sm:py-16 md:py-24 bg-paper min-h-screen">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mango/20 border border-mango-deep/30 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-4">
            <Sparkles className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
            <span>The Wonder Journey Experience</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl text-ocean-deep font-bold leading-tight">
            What Participating in Wonder Journey Feels Like
          </h1>
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold mt-4 leading-relaxed">
            Every lesson is an expedition. Every adventure becomes a shared family memory.
          </p>
        </div>

        {/* 3-Pillar Experience Cadence */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
          <div className="wj-card p-6 sm:p-8 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-ocean/15 text-ocean-deep flex items-center justify-center mb-5">
              <Video className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg sm:text-xl text-ocean-deep font-bold mb-2">
              1. Live Guided Sessions
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              Intimate, focused small-group classes where Teacher Sharon guides learners directly through conversational Tagalog, living geography, and cultural stories.
            </p>
          </div>

          <div className="wj-card p-6 sm:p-8 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sunset/15 text-sunset-deep flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg sm:text-xl text-ocean-deep font-bold mb-2">
              2. Interactive Adventure Theater
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              No passive video lectures. Children participate actively with synchronized presentation slides, oral questions, map explorations, and drawing layers.
            </p>
          </div>

          <div className="wj-card p-6 sm:p-8 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-5">
              <Heart className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-lg sm:text-xl text-ocean-deep font-bold mb-2">
              3. After-Class Memory &amp; Keepsakes
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              Learning doesn&apos;t stop when the call ends. Families bake mango float, practice greetings at dinner, complete crafts, and earn tangible passport stamps.
            </p>
          </div>
        </div>

        {/* Interactive Platform Tour Showcase */}
        <div className="mb-16 sm:mb-24">
          <ProductTour />
        </div>

        {/* Weekly Learning Rhythm */}
        <div className="wj-card p-8 sm:p-12 2xl:p-16 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm mb-16 sm:mb-24">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-mango-deep block mb-2">
              Weekly Rhythm
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
              A Typical Wonder Journey Session
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-sand/30 border border-sand-deep/60">
              <div className="flex items-center gap-2 text-ocean-deep font-bold text-xs uppercase mb-2">
                <Clock className="w-4 h-4 text-mango-deep" />
                <span>Minutes 0–10</span>
              </div>
              <h3 className="font-display text-base text-ocean-deep font-bold mb-1">Warm Welcome &amp; Opening</h3>
              <p className="text-xs text-ink/80 leading-relaxed">
                Warm greetings, opening prayer of blessing, check-in with Teacher Sharon, and destination reveal on the archipelago map.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand/30 border border-sand-deep/60">
              <div className="flex items-center gap-2 text-ocean-deep font-bold text-xs uppercase mb-2">
                <BookOpen className="w-4 h-4 text-mango-deep" />
                <span>Minutes 10–30</span>
              </div>
              <h3 className="font-display text-base text-ocean-deep font-bold mb-1">Living Story &amp; Vocabulary</h3>
              <p className="text-xs text-ink/80 leading-relaxed">
                Active slide adventure, authentic archival photos and botanical scans, conversational Tagalog phrases, and cultural storytelling.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand/30 border border-sand-deep/60">
              <div className="flex items-center gap-2 text-ocean-deep font-bold text-xs uppercase mb-2">
                <Sparkles className="w-4 h-4 text-mango-deep" />
                <span>Minutes 30–45</span>
              </div>
              <h3 className="font-display text-base text-ocean-deep font-bold mb-1">Interactive Quest &amp; Dialogue</h3>
              <p className="text-xs text-ink/80 leading-relaxed">
                Collaborative discovery questions, oral practice, character virtue discussion, and shared learner reflections.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand/30 border border-sand-deep/60">
              <div className="flex items-center gap-2 text-ocean-deep font-bold text-xs uppercase mb-2">
                <ShieldCheck className="w-4 h-4 text-mango-deep" />
                <span>Minutes 45–50</span>
              </div>
              <h3 className="font-display text-base text-ocean-deep font-bold mb-1">Passport Stamp &amp; Blessing</h3>
              <p className="text-xs text-ink/80 leading-relaxed">
                Awarding the session&apos;s adventure stamp in the journey passport, teacher blessing, and preview of optional family cooking or craft.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-sand/40 border border-sand-deep/70">
          <div>
            <h3 className="font-display text-lg font-bold text-ocean-deep">Curious about our curriculum?</h3>
            <p className="text-xs sm:text-sm text-ink/80 font-medium">Explore the 4 focused learning pillars and our 7,641-island narrative horizon.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/learning"
              className="wj-btn text-xs sm:text-sm px-5 py-2.5 inline-flex items-center gap-2 shadow-xs"
            >
              <span>Explore Curriculum &amp; Learning</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
