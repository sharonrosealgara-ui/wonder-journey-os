import React from "react";
import Link from "next/link";
import { Award, Compass, Sparkles, ArrowRight, Star, Heart, Utensils, Users } from "lucide-react";
import {
  EditorialContainer,
  JournalSurface,
  PostmarkStamp,
  WashiTapeStrip,
  FluidMeasure,
} from "@/components/visual";

export default function AdventurePassportShowcase() {
  return (
    <EditorialContainer
      id="passport"
      as="section"
      sceneWidth="4k"
      className="py-16 sm:py-24 md:py-32 bg-sand/30 border-b border-sand-deep/60 relative overflow-hidden"
    >
      {/* 4K Environmental Atmospheric Accents */}
      <div
        className="absolute top-1/3 -left-32 w-[500px] 2xl:w-[800px] 4k:w-[1200px] h-[500px] 2xl:h-[800px] 4k:h-[1200px] bg-ocean/10 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 -right-32 w-[500px] 2xl:w-[800px] 4k:w-[1200px] h-[500px] 2xl:h-[800px] 4k:h-[1200px] bg-mango/15 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Section Header: Fluid Measure Bounded */}
      <div className="text-center max-w-3xl 2xl:max-w-4xl 4k:max-w-5xl mx-auto mb-14 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-deep/40 border border-sand-deep/80 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
          <Award className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
          <span>Tangible Milestone Keepsake</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl 4k:text-8xl text-ocean-deep font-bold leading-tight">
          The Adventure Passport
        </h2>
        <FluidMeasure align="center" className="mt-4">
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold leading-relaxed">
            Every completed class becomes another stamp in the learner&apos;s Wonder Journey &mdash; a physical and digital record of island discoveries, conversational courage, and keepsake moments.
          </p>
        </FluidMeasure>
      </div>

      {/* Large Tactile Open Passport Spread: Expanded for 4K */}
      <div className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4k:max-w-[2200px] mx-auto mb-12">
        <div className="p-4 sm:p-8 md:p-10 lg:p-12 bg-[#F6EEDD] border-3 border-sand-deep/90 rounded-3xl shadow-xl relative">
          
          {/* Decorative Corner Washi Tapes */}
          <WashiTapeStrip color="mango" position="top-left" />
          <WashiTapeStrip color="ocean" position="top-right" />

          {/* Dedicated Passport Title Banner (Placed CLEARLY ABOVE the 2-page book spread — Zero Seam Collision) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-dashed border-sand-deep/70 relative z-10">
            <div>
              <span className="font-mono text-xs 2xl:text-sm font-bold uppercase tracking-widest text-mango-deep block mb-1">
                Republic of the Philippines &bull; Heritage Expedition
              </span>
              <h3 className="font-display text-2xl sm:text-3xl 2xl:text-4xl 4k:text-5xl text-ocean-deep font-bold">
                Official Explorer&apos;s Journey Logbook
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 border border-sand-deep/80 shadow-2xs text-xs 2xl:text-sm font-mono font-bold text-ocean-deep self-start sm:self-auto">
              <Sparkles className="w-4 h-4 text-mango" />
              <span>5 Canonical Milestone Stamps</span>
            </div>
          </div>

          {/* Physical 2-Page Collectible Passport Spread */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 2xl:gap-12 items-stretch relative z-10">
            
            {/* Center Spine Binding (Absolute divider between the two pages) */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-sand-deep/90 via-sand/50 to-sand-deep/90 shadow-md z-20 pointer-events-none rounded-full" />

            {/* ── LEFT PAGE: PAGE 04 — ARCHIPELAGO & LANGUAGE WAYPOINTS ── */}
            <div>
              <JournalSurface
                variant="aged-parchment"
                hasStitch={true}
                shadow="archival"
                className="p-5 sm:p-7 flex flex-col justify-between h-full min-h-[480px] border-2 border-[#dfcfb0]"
              >
                <div>
                  {/* Page Top Watermark & Header */}
                  <div className="flex items-center justify-between text-[11px] 2xl:text-xs font-mono font-bold text-ocean-deep pb-3 mb-4 border-b border-sand-deep/50">
                    <span>EXPLORER PASSPORT &bull; PHILIPPINES</span>
                    <span className="text-mango-deep font-bold">PAGE 04</span>
                  </div>

                  <p className="font-serif italic text-xs 2xl:text-sm text-ink/75 mb-4 leading-relaxed">
                    &ldquo;Granted to young explorers observing island coastlines, practicing conversational greetings, and learning virtues.&rdquo;
                  </p>

                  {/* Stamped Area 1: Island Explorer (Circular Postmark Seal) */}
                  <div className="my-3 p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-dashed border-ocean-deep/40 shadow-2xs flex items-center justify-between gap-3 transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 2xl:w-16 2xl:h-16 rounded-full border-2 border-dashed border-ocean-deep flex flex-col items-center justify-center text-ocean-deep -rotate-6 shrink-0 bg-ocean/10 p-1 shadow-2xs">
                        <Compass className="w-5 h-5 2xl:w-6 2xl:h-6 text-ocean-deep mb-0.5" />
                        <span className="text-[7px] 2xl:text-[8px] font-mono font-bold uppercase tracking-tighter">
                          14&deg;N ENTRY
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] 2xl:text-xs font-mono font-bold uppercase tracking-wider text-ocean-deep block">
                          Stage 2 &bull; Archipelago
                        </span>
                        <h4 className="font-display text-base 2xl:text-lg font-bold text-ocean-deep">
                          Island Explorer
                        </h4>
                        <p className="font-hand text-xs 2xl:text-sm text-ink/80 mt-0.5">
                          &ldquo;Spotted limestone karst cliffs in Northern Palawan!&rdquo;
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] 2xl:text-[10px] text-ocean-deep/75 font-bold uppercase tracking-widest self-start pt-1">
                      #island-explorer
                    </span>
                  </div>

                  {/* Connecting Nautical Route Track */}
                  <div className="my-1.5 flex items-center justify-center">
                    <span className="h-6 w-0.5 border-l-2 border-dashed border-mango-deep/50" />
                  </div>

                  {/* Stamped Area 2: Language Star (Octagonal Oral Tagalog Seal) */}
                  <div className="my-3 p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-dashed border-mango-deep/40 shadow-2xs flex items-center justify-between gap-3 transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 2xl:w-16 2xl:h-16 rounded-2xl border-2 border-dashed border-mango-deep flex flex-col items-center justify-center text-mango-deep rotate-6 shrink-0 bg-mango/15 p-1 shadow-2xs">
                        <Star className="w-5 h-5 2xl:w-6 2xl:h-6 text-mango-deep mb-0.5" />
                        <span className="text-[7px] 2xl:text-[8px] font-mono font-bold uppercase tracking-tighter">
                          ORAL FLUENCY
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] 2xl:text-xs font-mono font-bold uppercase tracking-wider text-mango-deep block">
                          Stage 4 &bull; Visayas
                        </span>
                        <h4 className="font-display text-base 2xl:text-lg font-bold text-ocean-deep">
                          Language Star
                        </h4>
                        <p className="font-hand text-xs 2xl:text-sm text-ink/80 mt-0.5">
                          &ldquo;Spoke &apos;Magandang araw po&apos; and &apos;Salamat po&apos;!&rdquo;
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] 2xl:text-[10px] text-mango-deep/80 font-bold uppercase tracking-widest self-start pt-1">
                      #language-star
                    </span>
                  </div>
                </div>

                {/* Left Page Footer */}
                <div className="pt-3 mt-4 border-t border-sand-deep/50 flex justify-between items-center text-[10px] 2xl:text-xs font-mono text-ink/60">
                  <span>EXPEDITION WAYPOINT 04</span>
                  <span>RECORD VERIFIED IN SESSION</span>
                </div>
              </JournalSurface>
            </div>

            {/* ── RIGHT PAGE: PAGE 05 — VIRTUE, CULINARY & CAPSTONE ── */}
            <div>
              <JournalSurface
                variant="aged-parchment"
                shadow="archival"
                className="p-5 sm:p-7 flex flex-col justify-between h-full min-h-[480px] border-2 border-[#dfcfb0]"
              >
                <div>
                  {/* Page Top Watermark & Header */}
                  <div className="flex items-center justify-between text-[11px] 2xl:text-xs font-mono font-bold text-ocean-deep pb-3 mb-4 border-b border-sand-deep/50">
                    <span className="text-mango-deep font-bold">PAGE 05</span>
                    <span>CHARACTER &bull; CULINARY &bull; CAPSTONE</span>
                  </div>

                  {/* Top Section: Kind Heart & Little Chef Side-by-Side */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Stamp 3: Kind Heart */}
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-white/80 border border-dashed border-sunset-deep/50 text-center relative hover:-translate-y-0.5 transition-transform shadow-2xs">
                      <div className="w-11 h-11 2xl:w-12 2xl:h-12 mx-auto rounded-full bg-sunset/15 border-2 border-dashed border-sunset-deep flex items-center justify-center text-sunset-deep -rotate-3 mb-1.5">
                        <Heart className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] 2xl:text-[10px] font-mono font-bold text-sunset-deep uppercase block">
                        Stage 5 &bull; Virtue
                      </span>
                      <h5 className="font-display text-xs 2xl:text-sm font-bold text-ocean-deep">
                        Kind Heart
                      </h5>
                      <p className="font-hand text-[11px] 2xl:text-xs text-ink/80 mt-1 leading-tight">
                        &ldquo;Mano po respect practiced.&rdquo;
                      </p>
                      <span className="font-mono text-[8px] text-sunset-deep/70 block mt-1">#kind-heart</span>
                    </div>

                    {/* Stamp 4: Little Chef */}
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-white/80 border border-dashed border-palm-deep/50 text-center relative hover:-translate-y-0.5 transition-transform shadow-2xs">
                      <div className="w-11 h-11 2xl:w-12 2xl:h-12 mx-auto rounded-xl bg-palm/15 border-2 border-dashed border-palm-deep flex items-center justify-center text-palm-deep rotate-4 mb-1.5">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] 2xl:text-[10px] font-mono font-bold text-palm-deep uppercase block">
                        Stage 5 &bull; Culinary
                      </span>
                      <h5 className="font-display text-xs 2xl:text-sm font-bold text-ocean-deep">
                        Little Chef
                      </h5>
                      <p className="font-hand text-[11px] 2xl:text-xs text-ink/80 mt-1 leading-tight">
                        &ldquo;Carabao mango float layered.&rdquo;
                      </p>
                      <span className="font-mono text-[8px] text-palm-deep/70 block mt-1">#little-chef</span>
                    </div>
                  </div>

                  {/* Stamp 5: The Bayanihan Capstone Golden Wax Seal */}
                  <div className="my-2 p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-mango shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-mango text-ocean-deep font-mono text-[9px] 2xl:text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                        <Sparkles className="w-3 h-3" />
                        <span>Capstone Preview</span>
                      </span>
                      <span className="font-mono text-[10px] 2xl:text-xs text-ink/65 font-bold">
                        #bayanihan
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      {/* Embossed Gold Seal */}
                      <div className="w-14 h-14 2xl:w-16 2xl:h-16 rounded-full bg-gradient-to-br from-mango to-sunset border-3 border-white flex flex-col items-center justify-center text-white shadow-md rotate-2 shrink-0">
                        <Users className="w-5 h-5 2xl:w-6 2xl:h-6" />
                        <span className="text-[7px] font-mono font-bold uppercase tracking-tighter">
                          COMMUNITY
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-base 2xl:text-lg font-bold text-ocean-deep">
                          Bayanihan Seal
                        </h4>
                        <p className="font-serif italic text-xs 2xl:text-sm text-ocean-deep font-medium">
                          &ldquo;Sharing community cooperation, gratitude, and mutual blessing.&rdquo;
                        </p>
                        <span className="inline-block mt-1 text-[10px] 2xl:text-xs font-mono font-bold text-mango-deep">
                          Illustrative Program Milestone
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Page Footer */}
                <div className="pt-3 mt-4 border-t border-sand-deep/50 flex justify-between items-center text-[10px] 2xl:text-xs font-mono text-ink/60">
                  <span>EXPEDITION WAYPOINT 05</span>
                  <span>CAPSTONE ARCHIPELAGO RECORD</span>
                </div>
              </JournalSurface>
            </div>

          </div>

          {/* Handwritten Explorer Micro-Note */}
          <div className="mt-8 pt-5 border-t-2 border-dashed border-sand-deep/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-ink/75">
            <p className="font-hand text-sm sm:text-base 2xl:text-lg text-ocean-deep font-medium text-center sm:text-left">
              &ldquo;Every stamp is a living memory of courage spoken, recipes tasted, and stories learned.&rdquo;
            </p>
            <div className="text-right shrink-0 font-mono text-[11px] 2xl:text-xs text-ink/60">
              <span>Personalized Family Keepsake &bull; Illustrative Journey Demo</span>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Link to /learning */}
      <div className="text-center">
        <Link
          href="/learning"
          className="inline-flex items-center gap-2 text-xs sm:text-sm 2xl:text-base font-bold text-ocean-deep hover:text-ocean transition-colors"
        >
          <span>Discover the 65-Lesson Living Curriculum Stages</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </EditorialContainer>
  );
}
