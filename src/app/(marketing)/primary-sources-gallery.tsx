import React from "react";
import Image from "next/image";
import { Sparkles, FileText, ExternalLink, ShieldCheck, MapPin } from "lucide-react";

interface ArchivalAsset {
  id: string;
  badge: string;
  title: string;
  creator: string;
  dateOrPeriod: string;
  provenance: string;
  sourceUrl: string;
  imageSrc: string;
  imageAlt: string;
  aspectRatio: string;
  culturalImportance: string;
}

const ARCHIVAL_ASSETS: ArchivalAsset[] = [
  {
    id: "murillo-map",
    badge: "1734 Historical Map",
    title: "Carta Hydrographica y Chorographica de las Yslas Filipinas",
    creator: "Pedro Murillo Velarde; engraved by Nicolás de la Cruz Bagay; illustrated by Francisco Suárez",
    dateOrPeriod: "1734 (Manila, Philippines)",
    provenance: "Library of Congress / World Digital Library",
    sourceUrl: "https://www.loc.gov/item/2013585226/",
    imageSrc: "/media/curriculum/l01-visual-b.jpg",
    imageAlt: "Historical 1734 Murillo Velarde Philippine Map",
    aspectRatio: "aspect-[4/3]",
    culturalImportance:
      "The first scientific and authoritative map of the entire Philippine archipelago drawn and engraved by Filipino artisans. Featured in Lesson 1.",
  },
  {
    id: "blanco-flora",
    badge: "Botanical Primary Source",
    title: "Narra Tree Botanical Illustration (Pterocarpus indicus)",
    creator: "Francisco Manuel Blanco (Illustrated Edition)",
    dateOrPeriod: "1877–1883 (Gran Edición, Manila)",
    provenance: "Flora de Filipinas / Real Jardín Botánico",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pterocarpus_indicus_Blanco2.308-cropped.jpg",
    imageSrc: "/media/curriculum/l11-visual-a.jpg",
    imageAlt: "Narra Tree Botanical Illustration from Flora de Filipinas",
    aspectRatio: "aspect-[3/4]",
    culturalImportance:
      "Historical lithographic folio document of the national tree of the Philippines, illustrating botanical anatomy and regional woodcraft. Featured in Lesson 11.",
  },
  {
    id: "el-nido-geology",
    badge: "Geographic Photography",
    title: "El Nido Coastal Limestone Karst Formations",
    creator: "Christian Bickel",
    dateOrPeriod: "Documented Field Photography",
    provenance: "Wikimedia Commons (CC BY-SA 2.0)",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:El_Nido_Palawan_2.jpg",
    imageSrc: "/media/curriculum/l02-visual-b.jpg",
    imageAlt: "Limestone karst formations of El Nido, Palawan",
    aspectRatio: "aspect-[4/3]",
    culturalImportance:
      "Natural coastal marine cliffs formed from 250-million-year-old Permian limestone deposits in northern Palawan. Featured in Lesson 2.",
  },
];

export default function PrimarySourcesGallery() {
  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-24 bg-white border-b border-sand-deep/50 relative overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        {/* Editorial Section Header */}
        <div className="max-w-3xl 2xl:max-w-4xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-deep/30 border border-sand-deep/70 text-ocean-deep text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-ocean-deep" aria-hidden="true" />
            <span>Factual Media & Provenance Standard</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl 4k:text-7xl text-ocean-deep font-bold leading-tight">
            Authentic Historical Artifacts & Curated Media
          </h2>
          <p className="text-sm sm:text-base 2xl:text-lg 4k:text-xl text-ink/80 mt-3 leading-relaxed font-medium">
            We reject synthetic and AI-generated approximations of history. Wonder Journey lessons rely strictly on authentic archival scans, scientific botanical lithographs, and verified field photography.
          </p>
        </div>

        {/* Gallery Salon Grid (Asymmetrical Art-Directed Cards) */}
        <div className="grid md:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Item 1: Large Featured Historical Map (7 columns) */}
          <div className="md:col-span-7 bg-paper border-2 border-sand-deep/80 rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-sand-deep/20 border border-sand-deep/60">
                <Image
                  src={ARCHIVAL_ASSETS[0].imageSrc}
                  alt={ARCHIVAL_ASSETS[0].imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1920px) 58vw, 1000px"
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full border border-sand-deep/80 text-xs font-display font-bold text-ocean-deep flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
                  <span>{ARCHIVAL_ASSETS[0].badge}</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-2 text-xs font-bold text-mango-deep uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{ARCHIVAL_ASSETS[0].dateOrPeriod}</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl 2xl:text-2xl text-ocean-deep font-bold mt-1">
                  {ARCHIVAL_ASSETS[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-ink/85 mt-2 leading-relaxed font-medium">
                  {ARCHIVAL_ASSETS[0].culturalImportance}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-sand-deep/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-ink/75">
              <span className="font-semibold text-ocean-deep">{ARCHIVAL_ASSETS[0].creator}</span>
              <a
                href={ARCHIVAL_ASSETS[0].sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold underline hover:text-ocean-deep"
              >
                <span>{ARCHIVAL_ASSETS[0].provenance}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column: 2 Staggered Artifact Cards (5 columns) */}
          <div className="md:col-span-5 space-y-6">
            {/* Item 2: Botanical Plate */}
            <div className="bg-paper border-2 border-sand-deep/80 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-center">
                <div className="relative w-28 h-36 sm:w-32 sm:h-40 shrink-0 rounded-xl overflow-hidden bg-sand-deep/20 border border-sand-deep/60">
                  <Image
                    src={ARCHIVAL_ASSETS[1].imageSrc}
                    alt={ARCHIVAL_ASSETS[1].imageAlt}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block text-[10px] font-bold text-mango-deep uppercase tracking-wider mb-1">
                    {ARCHIVAL_ASSETS[1].badge}
                  </span>
                  <h4 className="font-display text-sm sm:text-base text-ocean-deep font-bold leading-snug">
                    {ARCHIVAL_ASSETS[1].title}
                  </h4>
                  <p className="text-xs text-ink/75 mt-1 line-clamp-3">
                    {ARCHIVAL_ASSETS[1].culturalImportance}
                  </p>
                  <div className="mt-2 text-[11px] text-ink/70">
                    <a
                      href={ARCHIVAL_ASSETS[1].sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:text-ocean-deep inline-flex items-center gap-1"
                    >
                      <span>{ARCHIVAL_ASSETS[1].provenance}</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 3: Karst Geology Plate */}
            <div className="bg-paper border-2 border-sand-deep/80 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-sand-deep/20 border border-sand-deep/60">
                  <Image
                    src={ARCHIVAL_ASSETS[2].imageSrc}
                    alt={ARCHIVAL_ASSETS[2].imageAlt}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block text-[10px] font-bold text-mango-deep uppercase tracking-wider mb-1">
                    {ARCHIVAL_ASSETS[2].badge}
                  </span>
                  <h4 className="font-display text-sm sm:text-base text-ocean-deep font-bold leading-snug">
                    {ARCHIVAL_ASSETS[2].title}
                  </h4>
                  <p className="text-xs text-ink/75 mt-1 line-clamp-2">
                    {ARCHIVAL_ASSETS[2].culturalImportance}
                  </p>
                  <div className="mt-2 text-[11px] text-ink/70">
                    <a
                      href={ARCHIVAL_ASSETS[2].sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold hover:text-ocean-deep inline-flex items-center gap-1"
                    >
                      <span>{ARCHIVAL_ASSETS[2].provenance}</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Callout */}
            <div className="p-4 rounded-2xl bg-sand/50 border border-sand-deep/80 flex items-start gap-3">
              <FileText className="w-5 h-5 text-ocean-deep shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-ink/80 leading-relaxed font-medium">
                All 130 media assets across 65 curriculum lessons are cataloged with strict provenance verification, licensing integrity, and zero synthetic media.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
