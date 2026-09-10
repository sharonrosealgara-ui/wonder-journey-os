import React from "react";
import Link from "next/link";
import { Camera, Utensils, BookOpen, Sparkles, Award, ArrowRight, ShieldCheck } from "lucide-react";

interface ScrapbookCard {
  category: string;
  title: string;
  tag: string;
  description: string;
  handwrittenNote: string;
  tapeAngle: string;
  accentBg: string;
  accentBorder: string;
  icon: React.ReactNode;
}

const SCRAPBOOK_CARDS: ScrapbookCard[] = [
  {
    category: "COOKING",
    title: "Family Kitchen Explorations",
    tag: "Mango Float & Arroz Caldo",
    description:
      "Structured family recipes turning cultural lessons into delicious meals prepared and enjoyed together at home.",
    handwrittenNote: "“Sweet mango layers with cream & graham crackers!”",
    tapeAngle: "-rotate-2",
    accentBg: "bg-mango/15",
    accentBorder: "border-mango-deep/40",
    icon: <Utensils className="w-5 h-5 text-ocean-deep" />,
  },
  {
    category: "CREATIVE WORK",
    title: "Nature Study & Sketchbooks",
    tag: "Botanical & Map Drawing",
    description:
      "Charlotte Mason-inspired observation sheets where children draw indigenous flora, coastal animals, and island maps.",
    handwrittenNote: "“Narra leaf observation: jagged margins & yellow petals.”",
    tapeAngle: "rotate-2",
    accentBg: "bg-sky/20",
    accentBorder: "border-sky-deep/40",
    icon: <BookOpen className="w-5 h-5 text-ocean-deep" />,
  },
  {
    category: "CLASS MEMORIES",
    title: "Voice Postcards & Audio Blessings",
    tag: "Oral Language Keepsakes",
    description:
      "Personal audio memories celebrating courage in speaking Tagalog phrases and teacher birthday blessings.",
    handwrittenNote: "“Listening back to our very first Tagalog greeting!”",
    tapeAngle: "-rotate-1",
    accentBg: "bg-sunset/15",
    accentBorder: "border-sunset-deep/40",
    icon: <Sparkles className="w-5 h-5 text-sunset-deep" />,
  },
  {
    category: "ADVENTURE JOURNEY",
    title: "Regional Passport Milestone Stamps",
    tag: "Archipelago Progress Record",
    description:
      "Tangible passport seals honoring completed expeditions across Luzon, Visayas, and Mindanao.",
    handwrittenNote: "“Visayan Sea expedition stamp sealed & certified.”",
    tapeAngle: "rotate-3",
    accentBg: "bg-palm/15",
    accentBorder: "border-palm-deep/40",
    icon: <Award className="w-5 h-5 text-palm-deep" />,
  },
];

export default function AfterClassGalleryTeaser() {
  return (
    <section id="gallery-teaser" className="py-16 sm:py-24 md:py-32 bg-sand/30 border-b border-sand-deep/60 relative overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-deep/40 border border-sand-deep/80 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
            <Camera className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
            <span>After-Class Keepsakes</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-ocean-deep font-bold leading-tight">
            Learning Doesn&apos;t End When the Call Ends
          </h2>
          <p className="text-base sm:text-xl text-ink font-semibold mt-4 leading-relaxed max-w-2xl mx-auto">
            From the family kitchen to the nature journal, Wonder Journey inspires real-world family traditions and tangible keepsakes.
          </p>
        </div>

        {/* 4 Scrapbook Polaroid Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 2xl:gap-8 mb-12 sm:mb-16">
          {SCRAPBOOK_CARDS.map((card) => (
            <div
              key={card.category}
              className={`wj-card p-6 rounded-3xl ${card.accentBg} border-2 ${card.accentBorder} shadow-sm flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Top Washi Tape */}
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/80 border border-sand-deep/60 rounded-xs ${card.tapeAngle} shadow-2xs`} />

              <div>
                {/* Category Badge + Icon */}
                <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-ocean-deep/80">
                    {card.category}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-2xs">
                    {card.icon}
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold text-ocean-deep mb-1">
                  {card.title}
                </h3>
                <span className="inline-block text-[11px] font-mono font-semibold text-ink/70 mb-3">
                  {card.tag}
                </span>

                <p className="text-xs sm:text-sm text-ink/85 leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>

              {/* Handwritten micro-note */}
              <div className="mt-6 pt-4 border-t border-sand-deep/50">
                <div className="p-2.5 rounded-xl bg-white/90 border border-sand-deep/60 shadow-2xs">
                  <p className="font-serif italic text-xs text-ocean-deep leading-snug font-medium">
                    {card.handwrittenNote}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Truthful Archival & Recipe Integrity Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-deep/80 max-w-3xl mx-auto mb-10 text-center text-xs text-ink/75 font-medium">
          <p>
            * Culinary activities and nature templates are provided as structured family guides inside the enrolled portal. Learner submissions are held in private family vaults to guard child privacy.
          </p>
        </div>

        {/* Navigation Bridge Link */}
        <div className="text-center">
          <Link
            href="/gallery"
            className="wj-btn text-xs sm:text-sm px-6 py-3 inline-flex items-center gap-2 shadow-xs hover:-translate-y-0.5 transition-all"
          >
            <span>View the Journey Gallery &amp; Keepsakes</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}
