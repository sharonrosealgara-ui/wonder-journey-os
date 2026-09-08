import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Compass, ArrowLeft, ShieldCheck } from "lucide-react";
import PrimarySourcesGallery from "../primary-sources-gallery";

export const metadata: Metadata = {
  title: "Archival Primary Sources & Cultural Heritage | Wonder Journey",
  description:
    "Explore Wonder Journey's curated primary sources: authentic 19th-century botanical lithographs from Blanco's Flora de Filipinas, archival cartography, and verified Philippine historical artifacts.",
};

export default function PrimarySourcesPage() {
  return (
    <div className="py-12 sm:py-16 md:py-24 bg-paper min-h-screen">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/learning"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-ocean-deep hover:text-ocean transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Curriculum &amp; Learning</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-deep/40 border border-sand-deep/80 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-4">
            <BookOpen className="w-3.5 h-3.5 text-ocean-deep" aria-hidden="true" />
            <span>Living History &bull; Archival Provenance</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl text-ocean-deep font-bold leading-tight">
            Curated Archival Primary Sources
          </h1>
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold mt-4 leading-relaxed">
            Wonder Journey grounds every lesson in authentic artifacts &mdash; botanical lithographs, archival cartography, and historical documents with verified institutional provenance.
          </p>
        </div>

        {/* Archival Principles Banner */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16 sm:mb-20">
          <div className="p-6 rounded-2xl bg-white border-2 border-sand-deep/80 shadow-xs">
            <h2 className="font-display text-base sm:text-lg text-ocean-deep font-bold mb-2">
              Authentic Historical Scans
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              We draw directly from public domain holdings including the Real Jardín Botánico de Madrid, Library of Congress, and Wikimedia Commons archives.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border-2 border-sand-deep/80 shadow-xs">
            <h2 className="font-display text-base sm:text-lg text-ocean-deep font-bold mb-2">
              Zero Synthetic Historical Art
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              We reject AI approximations or fictitious depictions of Philippine history. Children encounter real botanical specimens and historical maps as they existed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border-2 border-sand-deep/80 shadow-xs">
            <h2 className="font-display text-base sm:text-lg text-ocean-deep font-bold mb-2">
              Curricular Integration
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              Primary sources are not decorative gallery items; they are actively examined in live class sessions to anchor geography, biology, and historical inquiry.
            </p>
          </div>
        </div>

        {/* Primary Sources Component */}
        <div className="mb-16 sm:mb-24">
          <PrimarySourcesGallery />
        </div>

        {/* Provenance and Citation Ethics Footer */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-sand-deep/80 shadow-sm max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ocean-deep mb-2">
            <ShieldCheck className="w-4 h-4 text-mango-deep" />
            <span>Provenance &amp; Archival Integrity</span>
          </div>
          <p className="text-xs sm:text-sm text-ink/85 leading-relaxed font-medium">
            All botanical lithographs presented are from Father Manuel Blanco&apos;s landmark third edition (&ldquo;Gran Edición&rdquo;) of <em>Flora de Filipinas</em> (1877–1883), illustrated by master Filipino and Spanish artists. Cartographic artifacts reference canonical 18th and 19th-century regional charts.
          </p>
        </div>

      </div>
    </div>
  );
}
