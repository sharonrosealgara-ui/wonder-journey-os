import React from "react";
import Link from "next/link";
import { Camera, Utensils, BookOpen, Sparkles, Award, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import {
  EditorialContainer,
  JournalSurface,
  PolaroidFrame,
  ArchivalMatteFrame,
  WashiTapeStrip,
  PostmarkStamp,
  FluidMeasure,
} from "@/components/visual";

export default function AfterClassGalleryTeaser() {
  return (
    <EditorialContainer
      id="gallery-teaser"
      as="section"
      sceneWidth="4k"
      className="py-16 sm:py-24 md:py-32 bg-sand/30 border-b border-sand-deep/60 relative overflow-hidden"
    >
      {/* 4K Environmental Atmospheric Glows */}
      <div
        className="absolute top-1/4 -right-40 w-[500px] 2xl:w-[800px] 4k:w-[1200px] h-[500px] 2xl:h-[800px] 4k:h-[1200px] bg-mango/10 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -left-40 w-[500px] 2xl:w-[800px] 4k:w-[1200px] h-[500px] 2xl:h-[800px] 4k:h-[1200px] bg-sky/15 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Section Header: Fluid Measure Bounded */}
      <div className="text-center max-w-3xl 2xl:max-w-4xl 4k:max-w-5xl mx-auto mb-14 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-deep/40 border border-sand-deep/80 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
          <Camera className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
          <span>After-Class Keepsakes</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl 4k:text-8xl text-ocean-deep font-bold leading-tight">
          Learning Doesn&apos;t End When the Call Ends
        </h2>
        <FluidMeasure align="center" className="mt-4">
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold leading-relaxed">
            From the family kitchen to the nature journal, Wonder Journey inspires real-world family traditions and tangible keepsakes.
          </p>
        </FluidMeasure>
      </div>

      {/* Physical Keepsake Scrapbook Spread (Asymmetrical Collector's Desk Composition) */}
      <div className="grid md:grid-cols-12 gap-6 sm:gap-8 2xl:gap-10 items-stretch max-w-6xl 2xl:max-w-7xl 4k:max-w-[2200px] mx-auto mb-14 sm:mb-18">

        {/* Keepsake 1: COOKING — Ruled Notebook Recipe Card (md:col-span-6 lg:col-span-6) */}
        <div className="md:col-span-6 flex">
          <JournalSurface
            variant="field-notebook"
            hasNotebookRuling={true}
            shadow="tactile"
            tilt="subtle-left"
            className="p-6 sm:p-8 flex flex-col justify-between w-full border-2 border-sand-deep/80"
          >
            <WashiTapeStrip color="mango" position="top-center" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                <span className="font-mono text-xs 2xl:text-sm font-bold uppercase tracking-wider text-mango-deep">
                  COOKING
                </span>
                <div className="w-8 h-8 rounded-xl bg-mango/20 flex items-center justify-center text-ocean-deep shadow-2xs">
                  <Utensils className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-display text-xl 2xl:text-2xl font-bold text-ocean-deep mb-1">
                Family Kitchen Explorations
              </h3>
              <span className="inline-block text-[11px] 2xl:text-xs font-mono font-semibold text-ink/70 mb-3">
                Mango Float &amp; Arroz Caldo
              </span>

              <p className="text-xs sm:text-sm 2xl:text-base text-ink/85 leading-relaxed font-medium">
                Structured family recipes turning cultural lessons into delicious meals prepared and enjoyed together at home.
              </p>

              {/* Recipe card step lines */}
              <div className="mt-4 p-3 rounded-xl bg-white/80 border border-sand-deep/60 space-y-1.5 text-xs text-ink/80 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-mango-deep" />
                  <span>Sweet Carabao Mango Slices</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-mango-deep" />
                  <span>Graham Crackers &amp; Whipped Cream</span>
                </div>
              </div>
            </div>

            {/* Handwritten note */}
            <div className="mt-6 pt-4 border-t border-sand-deep/50">
              <div className="p-2.5 rounded-xl bg-white/90 border border-sand-deep/60 shadow-2xs">
                <p className="font-hand text-xs sm:text-sm text-ocean-deep leading-snug font-medium">
                  “Sweet mango layers with cream &amp; graham crackers!”
                </p>
              </div>
            </div>
          </JournalSurface>
        </div>

        {/* Keepsake 2: CREATIVE WORK — Charlotte Mason Botanical Matte Frame (md:col-span-6 lg:col-span-6) */}
        <div className="md:col-span-6 flex">
          <ArchivalMatteFrame
            catalogueNumber="WJ-BOT-014"
            sourceTitle="CREATIVE WORK"
            provenance="Nature Study & Sketchbooks"
            className="w-full flex flex-col justify-between"
          >
            <div className="p-2">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs 2xl:text-sm font-bold uppercase tracking-wider text-palm-deep">
                  CREATIVE WORK
                </span>
                <div className="w-8 h-8 rounded-xl bg-palm/20 flex items-center justify-center text-palm-deep shadow-2xs">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-display text-xl 2xl:text-2xl font-bold text-ocean-deep mb-1">
                Nature Study &amp; Sketchbooks
              </h3>
              <span className="inline-block text-[11px] 2xl:text-xs font-mono font-semibold text-ink/70 mb-3">
                Botanical &amp; Map Drawing
              </span>

              <p className="text-xs sm:text-sm 2xl:text-base text-ink/85 leading-relaxed font-medium mb-4">
                Charlotte Mason-inspired observation sheets where children draw indigenous flora, coastal animals, and island maps.
              </p>

              {/* Botanical sketch diagram area */}
              <div className="p-4 rounded-xl bg-paper border border-dashed border-sand-deep/80 text-center">
                <div className="font-serif italic text-xs 2xl:text-sm text-ocean-deep font-semibold">
                  Observation Template: Pterocarpus indicus (Narra)
                </div>
                <div className="text-[10px] 2xl:text-xs font-mono text-ink/65 mt-1">
                  Leaflet symmetry &bull; Yellow fragrant blossoms &bull; Living botany
                </div>
              </div>

              {/* Handwritten leaf margin note */}
              <div className="mt-4 pt-3 border-t border-sand-deep/50">
                <div className="p-2.5 rounded-xl bg-white/90 border border-sand-deep/60 shadow-2xs">
                  <p className="font-hand text-xs sm:text-sm text-ocean-deep leading-snug font-medium">
                    “Narra leaf observation: jagged margins &amp; yellow petals.”
                  </p>
                </div>
              </div>
            </div>
          </ArchivalMatteFrame>
        </div>

        {/* Keepsake 3: CLASS MEMORIES — Tactile Polaroid Photo Keepsake (md:col-span-6 lg:col-span-6) */}
        <div className="md:col-span-6 flex">
          <JournalSurface
            variant="pressed-cream"
            shadow="tactile"
            tilt="subtle-right"
            className="p-6 sm:p-8 flex flex-col justify-between w-full border-2 border-sunset-deep/30"
          >
            <WashiTapeStrip color="ocean" position="top-right" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                <span className="font-mono text-xs 2xl:text-sm font-bold uppercase tracking-wider text-sunset-deep">
                  CLASS MEMORIES
                </span>
                <div className="w-8 h-8 rounded-xl bg-sunset/20 flex items-center justify-center text-sunset-deep shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-display text-xl 2xl:text-2xl font-bold text-ocean-deep mb-1">
                Voice Postcards &amp; Audio Blessings
              </h3>
              <span className="inline-block text-[11px] 2xl:text-xs font-mono font-semibold text-ink/70 mb-3">
                Oral Language Keepsakes
              </span>

              <p className="text-xs sm:text-sm 2xl:text-base text-ink/85 leading-relaxed font-medium">
                Personal audio memories celebrating courage in speaking Tagalog phrases and teacher birthday blessings.
              </p>

              {/* Audio waveform illustration placeholder */}
              <div className="mt-4 p-3.5 rounded-xl bg-paper border border-sand-deep/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sunset/20 flex items-center justify-center text-sunset-deep shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-ocean-deep block">Audio Postcard Archive</span>
                  <span className="text-[10px] font-mono text-ink/65 block">Private Family Vault Preview</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-sand-deep/50">
              <div className="p-2.5 rounded-xl bg-white/90 border border-sand-deep/60 shadow-2xs">
                <p className="font-serif italic text-xs sm:text-sm text-ocean-deep leading-snug font-medium">
                  “Listening back to our very first Tagalog greeting!”
                </p>
              </div>
            </div>
          </JournalSurface>
        </div>

        {/* Keepsake 4: ADVENTURE JOURNEY — Certified Passport Seal Sheet (md:col-span-6 lg:col-span-6) */}
        <div className="md:col-span-6 flex">
          <JournalSurface
            variant="aged-parchment"
            shadow="tactile"
            tilt="subtle-left"
            className="p-6 sm:p-8 flex flex-col justify-between w-full border-2 border-[#dfcfb0]"
          >
            <WashiTapeStrip color="coral" position="top-left" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                <span className="font-mono text-xs 2xl:text-sm font-bold uppercase tracking-wider text-palm-deep">
                  ADVENTURE JOURNEY
                </span>
                <div className="w-8 h-8 rounded-xl bg-palm/20 flex items-center justify-center text-palm-deep shadow-2xs">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-display text-xl 2xl:text-2xl font-bold text-ocean-deep mb-1">
                Regional Passport Milestone Stamps
              </h3>
              <span className="inline-block text-[11px] 2xl:text-xs font-mono font-semibold text-ink/70 mb-3">
                Archipelago Progress Record
              </span>

              <p className="text-xs sm:text-sm 2xl:text-base text-ink/85 leading-relaxed font-medium">
                Tangible passport seals honoring completed expeditions across Luzon, Visayas, and Mindanao.
              </p>

              {/* Certified postmark stamp graphic */}
              <div className="mt-4 flex items-center justify-center py-2">
                <PostmarkStamp location="VISAYAS 10°N" date="EXPEDITION SEAL" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-sand-deep/50">
              <div className="p-2.5 rounded-xl bg-white/90 border border-sand-deep/60 shadow-2xs">
                <p className="font-hand text-xs sm:text-sm text-ocean-deep leading-snug font-medium">
                  “Visayan Sea expedition stamp sealed &amp; certified.”
                </p>
              </div>
            </div>
          </JournalSurface>
        </div>

      </div>

      {/* Truthful Archival & Recipe Integrity Notice (Required Safeguarding Disclosure) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-sand-deep/80 max-w-3xl 2xl:max-w-4xl mx-auto mb-10 text-center text-xs 2xl:text-sm text-ink/75 font-medium">
        <p>
          * Culinary activities and nature templates are provided as structured family guides inside the enrolled portal. Learner submissions are held in private family vaults to guard child privacy.
        </p>
      </div>

      {/* Navigation Bridge Link */}
      <div className="text-center">
        <Link
          href="/gallery"
          className="wj-btn text-xs sm:text-sm 2xl:text-base px-6 py-3 inline-flex items-center gap-2 shadow-xs hover:-translate-y-0.5 transition-all"
        >
          <span>View the Journey Gallery &amp; Keepsakes</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

    </EditorialContainer>
  );
}
