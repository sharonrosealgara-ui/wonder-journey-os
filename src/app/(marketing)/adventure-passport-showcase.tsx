import React from "react";
import Link from "next/link";
import { Award, Compass, Sparkles, Check, ArrowRight, BookOpen, Star, Heart, Utensils, Users } from "lucide-react";

interface PassportStamp {
  id: string;
  name: string;
  category: string;
  stage: string;
  stampDate: string;
  inkColor: string;
  borderColor: string;
  bgTint: string;
  isNew?: boolean;
  icon: React.ReactNode;
}

const CANONICAL_STAMPS: PassportStamp[] = [
  {
    id: "island-explorer",
    name: "Island Explorer",
    category: "Geography & Maritime",
    stage: "Stage 2: Archipelago",
    stampDate: "Expedition 01",
    inkColor: "text-ocean-deep",
    borderColor: "border-ocean-deep/60",
    bgTint: "bg-ocean/10",
    icon: <Compass className="w-6 h-6 text-ocean-deep" />,
  },
  {
    id: "language-star",
    name: "Language Star",
    category: "Conversational Tagalog",
    stage: "Stage 4: Visayas",
    stampDate: "Expedition 04",
    inkColor: "text-mango-deep",
    borderColor: "border-mango-deep/60",
    bgTint: "bg-mango/15",
    icon: <Star className="w-6 h-6 text-mango-deep" />,
  },
  {
    id: "kind-heart",
    name: "Kind Heart",
    category: "Character & Paggalang",
    stage: "Stage 5: Luzon",
    stampDate: "Expedition 07",
    inkColor: "text-sunset-deep",
    borderColor: "border-sunset-deep/60",
    bgTint: "bg-sunset/15",
    icon: <Heart className="w-6 h-6 text-sunset-deep" />,
  },
  {
    id: "little-chef",
    name: "Little Chef",
    category: "Family Culinary Heritage",
    stage: "Stage 5: Kitchen Lab",
    stampDate: "Expedition 10",
    inkColor: "text-palm-deep",
    borderColor: "border-palm-deep/60",
    bgTint: "bg-palm/15",
    icon: <Utensils className="w-6 h-6 text-palm-deep" />,
  },
  {
    id: "bayanihan",
    name: "Bayanihan",
    category: "Community & Blessing",
    stage: "Stage 7: Capstone",
    stampDate: "Expedition 13",
    inkColor: "text-ocean-deep",
    borderColor: "border-ocean-deep/70",
    bgTint: "bg-sand-deep/40",
    isNew: true,
    icon: <Users className="w-6 h-6 text-ocean-deep" />,
  },
];

export default function AdventurePassportShowcase() {
  return (
    <section id="passport" className="py-16 sm:py-24 md:py-32 bg-sand/30 border-b border-sand-deep/60 relative overflow-hidden">
      {/* Subtle organic travel background accents */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-ocean/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-mango/15 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-deep/40 border border-sand-deep/80 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
            <span>Tangible Milestone Keepsake</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-ocean-deep font-bold leading-tight">
            The Adventure Passport
          </h2>
          <p className="text-base sm:text-xl text-ink font-semibold mt-4 leading-relaxed max-w-2xl mx-auto">
            Every completed class becomes another stamp in the learner&apos;s Wonder Journey &mdash; a physical and digital record of island discoveries, conversational courage, and keepsake moments.
          </p>
        </div>

        {/* Large Tactile Open Passport Spread */}
        <div className="max-w-5xl 2xl:max-w-6xl mx-auto mb-12">
          <div className="wj-card bg-[#FBF7EE] p-6 sm:p-10 md:p-12 border-3 border-sand-deep/90 rounded-3xl shadow-xl relative overflow-hidden">
            
            {/* Passport Book Spine & Corner Accents */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-gradient-to-b from-sand-deep/80 via-sand/40 to-sand-deep/80 hidden md:block pointer-events-none z-20 shadow-inner" />
            <div className="absolute -top-3 left-12 w-20 h-6 bg-mango/40 border border-sand-deep/70 rounded-xs rotate-2 shadow-2xs opacity-85 z-20" />
            <div className="absolute -top-3 right-12 w-20 h-6 bg-sky/40 border border-sand-deep/70 rounded-xs -rotate-2 shadow-2xs opacity-85 z-20" />

            {/* Passport Header Title Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b-2 border-dashed border-sand-deep/70">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-mango-deep block mb-1">
                  Republic of the Philippines &bull; Heritage Expedition
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-ocean-deep font-bold">
                  Official Explorer&apos;s Journey Logbook
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sand-deep/80 shadow-2xs text-xs font-mono font-bold text-ocean-deep">
                <Sparkles className="w-3.5 h-3.5 text-mango" />
                <span>5 Canonical Milestone Stamps</span>
              </div>
            </div>

            {/* 2-Page Collectible Passport Spread */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-14 relative z-10">
              
              {/* ── LEFT PAGE: PAGE 04 — ARCHIPELAGO & LANGUAGE WAYPOINTS ── */}
              <div className="relative p-5 sm:p-6 rounded-2xl bg-white/70 border border-sand-deep/60 shadow-inner flex flex-col justify-between min-h-[460px]">
                {/* Page Watermark / Security Pattern */}
                <div className="absolute top-3 right-4 font-mono text-[10px] font-bold text-sand-deep/90 tracking-widest">
                  PAGE 04
                </div>

                {/* Identity Header Box */}
                <div className="border-b border-sand-deep/50 pb-3 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-ocean-deep">
                    <span>EXPLORER PASSPORT &bull; PHILIPPINES</span>
                    <span className="text-mango-deep">VISAYAS TRAIL</span>
                  </div>
                  <p className="font-serif italic text-xs text-ink/75 mt-1">
                    &ldquo;Granted to young explorers observing island coastlines, practicing conversational greetings, and learning virtues.&rdquo;
                  </p>
                </div>

                {/* Stamped Area 1: Island Explorer (Circular Postmark Seal) */}
                <div className="my-2 relative flex items-center justify-between p-3.5 rounded-2xl bg-paper border border-dashed border-ocean-deep/40 transition-transform hover:-translate-y-0.5 shadow-2xs">
                  {/* Rubber Postmark Stamp Icon */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-ocean-deep flex flex-col items-center justify-center text-ocean-deep -rotate-6 shrink-0 bg-ocean/10 p-1 shadow-2xs">
                      <Compass className="w-6 h-6 text-ocean-deep mb-0.5" />
                      <span className="text-[8px] font-mono font-bold uppercase tracking-tighter">
                        14&deg;N ENTRY
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ocean-deep block">
                        Stage 2 &bull; Archipelago
                      </span>
                      <h4 className="font-display text-base font-bold text-ocean-deep">
                        Island Explorer
                      </h4>
                      <p className="font-hand text-xs text-ink/80">
                        &ldquo;Spotted limestone karst cliffs in Northern Palawan!&rdquo;
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-ocean-deep/75 font-bold uppercase tracking-widest self-start pt-1">
                    #island-explorer
                  </span>
                </div>

                {/* Connecting Illustrated Route Line */}
                <div className="my-1 flex items-center justify-center">
                  <span className="h-6 w-0.5 border-l-2 border-dashed border-mango-deep/50" />
                </div>

                {/* Stamped Area 2: Language Star (Octagonal Oral Tagalog Seal) */}
                <div className="my-2 relative flex items-center justify-between p-3.5 rounded-2xl bg-paper border border-dashed border-mango-deep/40 transition-transform hover:-translate-y-0.5 shadow-2xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-mango-deep flex flex-col items-center justify-center text-mango-deep rotate-6 shrink-0 bg-mango/15 p-1 shadow-2xs">
                      <Star className="w-6 h-6 text-mango-deep mb-0.5" />
                      <span className="text-[8px] font-mono font-bold uppercase tracking-tighter">
                        ORAL FLUENCY
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-mango-deep block">
                        Stage 4 &bull; Visayas
                      </span>
                      <h4 className="font-display text-base font-bold text-ocean-deep">
                        Language Star
                      </h4>
                      <p className="font-hand text-xs text-ink/80">
                        &ldquo;Spoke &apos;Magandang araw po&apos; and &apos;Salamat po&apos;!&rdquo;
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-mango-deep/80 font-bold uppercase tracking-widest self-start pt-1">
                    #language-star
                  </span>
                </div>

                {/* Page Footer */}
                <div className="pt-3 border-t border-sand-deep/40 flex justify-between items-center text-[10px] font-mono text-ink/60">
                  <span>EXPEDITION WAYPOINT 04</span>
                  <span>RECORD VERIFIED IN SESSION</span>
                </div>
              </div>

              {/* ── RIGHT PAGE: PAGE 05 — VIRTUE, CULINARY & CAPSTONE ── */}
              <div className="relative p-5 sm:p-6 rounded-2xl bg-white/70 border border-sand-deep/60 shadow-inner flex flex-col justify-between min-h-[460px]">
                {/* Page Watermark */}
                <div className="absolute top-3 right-4 font-mono text-[10px] font-bold text-sand-deep/90 tracking-widest">
                  PAGE 05
                </div>

                {/* Top Section: Kind Heart & Little Chef Side-by-Side Stamps */}
                <div className="grid grid-cols-2 gap-3 mb-2">
                  {/* Stamp 3: Kind Heart (Scalloped Stamp) */}
                  <div className="p-3 rounded-2xl bg-paper border border-dashed border-sunset-deep/50 text-center relative hover:-translate-y-0.5 transition-transform shadow-2xs">
                    <div className="w-12 h-12 mx-auto rounded-full bg-sunset/15 border-2 border-dashed border-sunset-deep flex items-center justify-center text-sunset-deep -rotate-3 mb-1.5">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-sunset-deep uppercase block">
                      Stage 5 &bull; Virtue
                    </span>
                    <h5 className="font-display text-xs font-bold text-ocean-deep">
                      Kind Heart
                    </h5>
                    <p className="font-hand text-[11px] text-ink/80 mt-1 leading-tight">
                      &ldquo;Mano po respect practiced.&rdquo;
                    </p>
                    <span className="hidden">#kind-heart</span>
                  </div>

                  {/* Stamp 4: Little Chef (Rectangular Recipe Stamp) */}
                  <div className="p-3 rounded-2xl bg-paper border border-dashed border-palm-deep/50 text-center relative hover:-translate-y-0.5 transition-transform shadow-2xs">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-palm/15 border-2 border-dashed border-palm-deep flex items-center justify-center text-palm-deep rotate-4 mb-1.5">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-palm-deep uppercase block">
                      Stage 5 &bull; Culinary
                    </span>
                    <h5 className="font-display text-xs font-bold text-ocean-deep">
                      Little Chef
                    </h5>
                    <p className="font-hand text-[11px] text-ink/80 mt-1 leading-tight">
                      &ldquo;Carabao mango float layered.&rdquo;
                    </p>
                    <span className="hidden">#little-chef</span>
                  </div>
                </div>

                {/* Stamp 5: The Bayanihan Capstone Golden Wax Seal */}
                <div className="my-2 p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-mango shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-mango text-ocean-deep font-mono text-[9px] font-bold uppercase tracking-wider shadow-2xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Capstone Preview</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink/65 font-bold">
                      #bayanihan
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    {/* Embossed Gold Seal */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mango to-sunset border-3 border-white flex flex-col items-center justify-center text-white shadow-md rotate-2 shrink-0 animate-pulse">
                      <Users className="w-6 h-6" />
                      <span className="text-[7px] font-mono font-bold uppercase tracking-tighter">
                        COMMUNITY
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-base font-bold text-ocean-deep">
                        Bayanihan Seal
                      </h4>
                      <p className="font-serif italic text-xs text-ocean-deep font-medium">
                        &ldquo;Sharing community cooperation, gratitude, and mutual blessing.&rdquo;
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-mono font-bold text-mango-deep">
                        Illustrative Program Milestone
                      </span>
                    </div>
                  </div>
                </div>

                {/* Page Footer */}
                <div className="pt-3 border-t border-sand-deep/40 flex justify-between items-center text-[10px] font-mono text-ink/60">
                  <span>EXPEDITION WAYPOINT 05</span>
                  <span>CAPSTONE ARCHIPELAGO RECORD</span>
                </div>
              </div>

            </div>

            {/* Handwritten Explorer Micro-Note */}
            <div className="mt-7 pt-5 border-t-2 border-dashed border-sand-deep/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-ink/75">
              <p className="font-hand text-sm sm:text-base text-ocean-deep font-medium text-center sm:text-left">
                &ldquo;Every stamp is a living memory of courage spoken, recipes tasted, and stories learned.&rdquo;
              </p>
              <div className="text-right shrink-0 font-mono text-[11px] text-ink/60">
                <span>Personalized Family Keepsake &bull; Illustrative Journey Demo</span>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Link to /learning */}
        <div className="text-center">
          <Link
            href="/learning"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-ocean-deep hover:text-ocean transition-colors"
          >
            <span>Discover the 65-Lesson Living Curriculum Stages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
