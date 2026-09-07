"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, MapPin, Sparkles, BookOpen, ArrowRight } from "lucide-react";

interface IslandRegion {
  id: string;
  name: string;
  tagline: string;
  coordinates: string;
  stageInfo: string;
  lessonRef: string;
  imageSrc: string;
  imageAlt: string;
  creditText: string;
  creditUrl: string;
  license: string;
  highlights: { title: string; desc: string }[];
  culturalNote: string;
}

const REGIONS: IslandRegion[] = [
  {
    id: "luzon",
    name: "Luzon & The North",
    tagline: "Highland Cordilleras, Baybayin heritage, and language foundations",
    coordinates: "14°35′N 120°58′E • Manila Basin & Northern Arc",
    stageInfo: "Stage 1 & 2 Curriculum Focus",
    lessonRef: "Lesson 1 (World Map) & Lesson 12 (Baybayin Bo)",
    imageSrc: "/media/curriculum/l01-visual-a.jpg",
    imageAlt: "Natural color satellite composite of the Philippine archipelago by NASA",
    creditText: "NASA Goddard Space Flight Center",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Satellite_image_of_Philippines_in_March_2002.jpg",
    license: "Public Domain",
    highlights: [
      {
        title: "Archipelago Topography",
        desc: "Children learn to read satellite maps, identify major gulfs, straits, and volcanic arcs.",
      },
      {
        title: "Ancient Baybayin Script",
        desc: "Tracing the indigenous pre-colonial syllabary alongside conversational Tagalog phonetics.",
      },
      {
        title: "Family Respect (Paggalang)",
        desc: "Practicing everyday respectful speech (po and opo) rooted in home family conversations.",
      },
    ],
    culturalNote:
      "From the misty rice terraces of the Cordillera to the historical streets of Intramuros, Luzon anchors our foundational exploration of language, geography, and family virtues.",
  },
  {
    id: "visayas",
    name: "Visayas Island Heart",
    tagline: "Maritime straits, geological wonders, and living history",
    coordinates: "10°18′N 123°54′E • Central Archipelago Seas",
    stageInfo: "Stage 4 & 5 Curriculum Focus",
    lessonRef: "Lesson 13 (Chocolate Hills) & Lesson 31 (Lapu-Lapu & Mactan)",
    imageSrc: "/media/curriculum/l13-visual-b.jpg",
    imageAlt: "Cone karst geological landscape of the Chocolate Hills in Carmen, Bohol",
    creditText: "Ramir Borja via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Chocolate_Hills_-_edit.jpg",
    license: "CC BY-SA 3.0",
    highlights: [
      {
        title: "Cone Karst Geology",
        desc: "Discovering how coral deposits over millennia shaped the 1,776 rolling mounds of Bohol.",
      },
      {
        title: "Mactan & Magellan Timeline",
        desc: "Exploring the documented 1521 encounter and the courage of chieftain Lapu-Lapu.",
      },
      {
        title: "Community Spirit (Bayanihan)",
        desc: "Island fishing villages demonstrating mutual cooperation, boat-building, and neighborly love.",
      },
    ],
    culturalNote:
      "The Visayan seas connect hundreds of emerald islands, where maritime trade routes, folk lullabies, and historical encounters reveal the enduring resilience of the Filipino spirit.",
  },
  {
    id: "mindanao-palawan",
    name: "Mindanao & Palawan",
    tagline: "Limestone sanctuaries, mountain peaks, and rich biodiversity",
    coordinates: "11°11′N 119°23′E • Western Calamianes & Southern Frontier",
    stageInfo: "Stage 6 & 7 Curriculum Focus",
    lessonRef: "Lesson 2 (El Nido Karst) & Lesson 45 (Southern Flora)",
    imageSrc: "/media/curriculum/l02-visual-b.jpg",
    imageAlt: "Coastal limestone karst cliffs and turquoise waters of El Nido, Palawan",
    creditText: "Christian Bickel via Wikimedia Commons",
    creditUrl: "https://commons.wikimedia.org/wiki/File:El_Nido_Palawan_2.jpg",
    license: "CC BY-SA 2.0",
    highlights: [
      {
        title: "Tropical Coastal Karst",
        desc: "Studying coastal marine ecosystems, coral reefs, and limestone formations in Bacuit Bay.",
      },
      {
        title: "Ancestral Weaving Traditions",
        desc: "Appreciating the intricate geometric motifs of T'boli T'nalak and Yakan weaves.",
      },
      {
        title: "Creation Stewardship",
        desc: "Reflecting on Biblical stewardship of God's handiwork in eagle sanctuaries and old-growth rainforests.",
      },
    ],
    culturalNote:
      "Home to the highest peak in the Philippines (Mt. Apo) and the pristine biodiversity of Palawan, this region inspires wonder at the richness of natural creation and indigenous heritage.",
  },
];

export default function ArchipelagoJourneyBand() {
  const [selectedRegion, setSelectedRegion] = useState<string>("visayas");
  const active = REGIONS.find((r) => r.id === selectedRegion) || REGIONS[1];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-sand/30 border-b border-sand-deep/50 relative overflow-hidden">
      {/* Background Subtle Nautical Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#14837c_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16 relative z-10">
        {/* Section Header: Editorial Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14 border-b border-sand-deep/60 pb-6 sm:pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean/10 border border-ocean/30 text-ocean-deep text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5 text-ocean" aria-hidden="true" />
              <span>Living Curriculum Journey</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl 4k:text-7xl text-ocean-deep font-bold leading-tight">
              A 7,641-Island Narrative Horizon
            </h2>
            <p className="text-sm sm:text-base 2xl:text-lg 4k:text-xl text-ink/80 mt-2 max-w-2xl 4k:max-w-4xl font-medium">
              Every lesson is an authentic expedition through Philippine geography, literature, and living history — organized across three major island realms.
            </p>
          </div>

          {/* Region Selector Tabs (Handcrafted tactile pills) */}
          <div
            role="tablist"
            aria-label="Philippine Island Realms"
            className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur p-1.5 rounded-2xl border border-sand-deep/80 shadow-xs overflow-x-auto max-w-full"
          >
            {REGIONS.map((region) => {
              const isSelected = region.id === selectedRegion;
              return (
                <button
                  key={region.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-display tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-ocean-deep text-white shadow-sm font-bold scale-[1.02]"
                      : "text-ink/75 hover:text-ocean-deep hover:bg-sand/40"
                  }`}
                >
                  {region.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Editorial Spread */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-16 items-center">
          {/* Left Column (7 cols on large): Photographic & Archival Composition */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-sand-deep/80 bg-white shadow-md aspect-[16/10] sm:aspect-[16/9] 2xl:aspect-[16/10]">
              <Image
                src={active.imageSrc}
                alt={active.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, (max-width: 1920px) 58vw, 1200px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Verified Image Archival Plaque */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-sand-deep/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-mango-deep uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>{active.lessonRef}</span>
                  </div>
                  <p className="font-display text-xs sm:text-sm text-ocean-deep font-bold truncate mt-0.5">
                    {active.imageAlt}
                  </p>
                </div>

                <div className="shrink-0 text-[10px] sm:text-xs text-ink/70">
                  <span>Source: </span>
                  <a
                    href={active.creditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ocean-deep font-medium"
                  >
                    {active.creditText}
                  </a>
                  <span className="text-ink/50"> ({active.license})</span>
                </div>
              </div>

              {/* Coordinates Pill */}
              <div className="absolute top-3 left-3 bg-ocean-deep/90 text-white backdrop-blur text-[11px] font-mono px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-mango" aria-hidden="true" />
                <span>{active.coordinates}</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Storytelling & Educational Breakdown */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-block text-xs font-bold uppercase tracking-widest text-mango-deep mb-1">
                {active.stageInfo}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl 2xl:text-4xl text-ocean-deep font-bold leading-tight">
                {active.name}
              </h3>
              <p className="text-sm sm:text-base 2xl:text-lg text-ink font-semibold mt-2 leading-relaxed">
                {active.tagline}
              </p>

              <blockquote className="mt-4 p-4 rounded-2xl bg-white border border-sand-deep/70 text-xs sm:text-sm text-ink/85 italic leading-relaxed shadow-xs">
                &ldquo;{active.culturalNote}&rdquo;
              </blockquote>

              {/* 3 Editorial Highlights */}
              <div className="mt-6 space-y-3.5">
                {active.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white/70 border border-sand-deep/50 hover:bg-white hover:border-sand-deep transition-all"
                  >
                    <div className="flex items-center gap-2 font-display text-sm sm:text-base text-ocean-deep font-bold">
                      <span className="w-5 h-5 rounded-full bg-mango/25 text-ocean-deep flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span>{h.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink/80 mt-1 pl-7 leading-relaxed">
                      {h.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Link to product tour anchor */}
            <div className="pt-2">
              <Link
                href="#tour"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-ocean-deep hover:text-ocean transition-colors"
              >
                <BookOpen className="w-4 h-4 text-mango-deep" aria-hidden="true" />
                <span>See interactive lesson presentation mode</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
