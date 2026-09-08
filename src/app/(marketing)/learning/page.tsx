import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Compass, BookOpen, Layers, ArrowRight, ShieldCheck } from "lucide-react";
import ArchipelagoJourneyBand from "../archipelago-journey-band";
import LearningFocusTabs from "../learning-focus-tabs";

export const metadata: Metadata = {
  title: "Learning Horizon & Curriculum Architecture | Wonder Journey",
  description:
    "Explore Wonder Journey's comprehensive curriculum: 65 living lessons across the 7,641 islands of the Philippines, four focused learning pillars, and authentic primary sources.",
};

export default function LearningPage() {
  return (
    <div className="py-12 sm:py-16 md:py-24 bg-paper min-h-screen">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ocean/15 border border-ocean/30 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-4">
            <Compass className="w-3.5 h-3.5 text-ocean-deep" aria-hidden="true" />
            <span>Living Curriculum Architecture</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl text-ocean-deep font-bold leading-tight">
            A 7,641-Island Narrative Horizon
          </h1>
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold mt-4 leading-relaxed">
            Every lesson is an authentic expedition through Philippine geography, literature, living history, and conversational language &mdash; organized across three major island realms.
          </p>
        </div>

        {/* 1. Regional Archipelago Journey Band */}
        <div className="mb-16 sm:mb-24">
          <ArchipelagoJourneyBand />
        </div>

        {/* 2. Four Focused Learning Pillars */}
        <div className="mb-16 sm:mb-24">
          <LearningFocusTabs />
        </div>

        {/* 3. 65 Living Lessons Horizon Overview */}
        <div className="wj-card p-8 sm:p-12 2xl:p-16 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm mb-16 sm:mb-24">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand text-ink/75 font-mono text-xs font-bold mb-3">
              <Layers className="w-3.5 h-3.5 text-ocean-deep" />
              <span>Stages 2, 4, 5, 6, &amp; 7</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
              Curriculum Stages &amp; Scope
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 font-medium mt-2">
              Our 65 living lessons progress systematically through foundational world geography, island ecosystems, biodiversity, language dialogue, and cultural synthesis.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-paper border border-sand-deep/70">
              <span className="font-mono text-xs font-bold text-mango-deep block mb-1">Stage 2 &bull; Foundations</span>
              <h3 className="font-display text-lg text-ocean-deep font-bold mb-2">The Archipelago &amp; Our Place</h3>
              <p className="text-xs text-ink/80 leading-relaxed font-medium">
                13 foundational lessons establishing map literacy, compass orientation, island topology, the Philippine Sea, and respect for elders (po at opo).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-paper border border-sand-deep/70">
              <span className="font-mono text-xs font-bold text-ocean-deep block mb-1">Stage 4 &bull; Island Heart</span>
              <h3 className="font-display text-lg text-ocean-deep font-bold mb-2">Visayas &amp; Maritime Wonders</h3>
              <p className="text-xs text-ink/80 leading-relaxed font-medium">
                13 lessons journeying through Bohol&apos;s Chocolate Hills, coral geology, historical navigation routes, Lapu-Lapu encounters, and community bayanihan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-paper border border-sand-deep/70">
              <span className="font-mono text-xs font-bold text-sunset-deep block mb-1">Stage 5 &bull; Living Land</span>
              <h3 className="font-display text-lg text-ocean-deep font-bold mb-2">Luzon Mountains &amp; Heritage</h3>
              <p className="text-xs text-ink/80 leading-relaxed font-medium">
                13 lessons exploring the Cordillera rice terraces, volcanic soil, botanical treasures from Blanco&apos;s Flora de Filipinas, and ancestral traditions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-paper border border-sand-deep/70">
              <span className="font-mono text-xs font-bold text-ocean-deep block mb-1">Stage 6 &bull; Wild Southern Seas</span>
              <h3 className="font-display text-lg text-ocean-deep font-bold mb-2">Mindanao &amp; Palawan Frontiers</h3>
              <p className="text-xs text-ink/80 leading-relaxed font-medium">
                13 lessons across subterranean river karst systems, ancient weaving patterns, marine biodiversity, and peace-building narratives.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-paper border border-sand-deep/70 sm:col-span-2 lg:col-span-2">
              <span className="font-mono text-xs font-bold text-palm-deep block mb-1">Stage 7 &bull; Capstone Synthesis</span>
              <h3 className="font-display text-lg text-ocean-deep font-bold mb-2">Living Heritage &amp; Stewardship</h3>
              <p className="text-xs text-ink/80 leading-relaxed font-medium">
                13 capstone lessons uniting conversational Tagalog fluency, culinary mastery (cooking family meals), historical primary source synthesis, and faithful stewardship.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Contextual Link to Primary Sources */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10 rounded-3xl bg-white border-2 border-sand-deep/80 shadow-sm">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sunset-deep font-bold text-xs uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Archival Credibility</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ocean-deep">
              Authentic Historical Artifacts &amp; Curated Media
            </h3>
            <p className="text-xs sm:text-sm text-ink/80 font-medium mt-2 leading-relaxed">
              We reject synthetic and AI-generated approximations of history. Wonder Journey lessons rely strictly on authentic archival scans, scientific botanical lithographs, and verified field photography.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/primary-sources"
              className="wj-btn text-xs sm:text-sm px-6 py-3 inline-flex items-center gap-2 shadow-xs"
            >
              <span>Explore Historical Sources</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
