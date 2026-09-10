import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Sparkles,
  Utensils,
  BookOpen,
  Compass,
  Award,
  Shield,
  ArrowRight,
  Heart,
  Volume2,
  Star,
  Users,
  Pin,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Learning Keepsakes & Memory Wall | Wonder Journey",
  description:
    "Explore the living scrapbook of Wonder Journey: hands-on family kitchen recipe cards, nature study sketchbooks, celebration keepsakes, and earned adventure passport stamps.",
};

export default function GalleryPage() {
  return (
    <div className="bg-paper min-h-screen text-ink overflow-x-hidden">
      
      {/* ── 1. VISUAL OPENING: THE MEMORY WALL / SCRAPBOOK DESK ── */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-sand-deep/60 overflow-hidden">
        {/* Atmospheric watercolor background glows */}
        <div
          className="absolute -top-32 -left-20 w-[500px] 2xl:w-[750px] h-[500px] 2xl:h-[750px] opacity-20 pointer-events-none blur-3xl bg-gradient-to-br from-mango via-sand to-transparent rounded-full"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 right-0 w-[550px] 2xl:w-[800px] h-[550px] 2xl:h-[800px] opacity-15 pointer-events-none blur-3xl bg-gradient-to-tl from-sky-deep via-ocean to-transparent rounded-full"
          aria-hidden="true"
        />

        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Editorial Scrapbook Intro */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunset/15 border border-sunset-deep/30 text-sunset-deep text-xs sm:text-sm font-bold tracking-wide mb-4 shadow-2xs">
                <Camera className="w-3.5 h-3.5 text-sunset-deep" aria-hidden="true" />
                <span>The Living Memory Wall</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl 4k:text-8xl text-ocean-deep leading-[1.1] font-bold tracking-tight">
                Family Keepsakes &amp; Tangible Memories
              </h1>

              <div className="my-4 h-1.5 w-24 sm:w-32 bg-gradient-to-r from-sunset to-mango rounded-full opacity-90" />

              <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold leading-relaxed max-w-2xl">
                Wonder Journey lives far beyond the screen. Here are the recipes cooked together, sketchbooks drawn, celebration blessings heard, and passport stamps earned.
              </p>

              {/* Privacy Safeguard Note */}
              <div className="mt-5 p-4 rounded-2xl bg-sand/50 border border-sand-deep/80 text-xs sm:text-sm font-medium text-ink/85 max-w-xl flex items-start gap-3 shadow-2xs">
                <Shield className="w-4 h-4 text-ocean-deep shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-bold text-ocean-deep block">Privacy &amp; Child Safeguarding Invariant:</span>
                  <span>
                    To protect child privacy, real learner photographs and personal submissions remain within private authenticated family workspaces. Previews below represent authentic program activity structures and curriculum materials.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Corkboard / Scrapbook Collage */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-md 2xl:max-w-lg aspect-[4/3] rounded-3xl bg-sand/40 border-2 border-sand-deep/80 p-5 shadow-sm">
                
                {/* Vintage Washi Tape Corner */}
                <div className="absolute -top-3 right-8 w-20 h-6 bg-white/80 border border-sand-deep/60 rounded-xs rotate-2 shadow-2xs z-20" />

                {/* Overlapping Polaroid and Postcard Stack */}
                <div className="relative w-full h-full rounded-2xl bg-white border border-sand-deep/70 p-4 flex flex-col justify-between shadow-inner overflow-hidden">
                  <div className="flex items-center justify-between pb-2 border-b border-sand-deep/50">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ocean-deep">
                      Field Journal Collection
                    </span>
                    <span className="wj-stamp px-2 py-0.5 text-[9px] font-mono font-bold text-sunset-deep -rotate-2">
                      AUTHENTIC KEEPSAKES
                    </span>
                  </div>

                  <div className="relative h-44 my-2">
                    {/* Mini Polaroid 1: Karst Cliffs (tilted -4deg, bottom-left) */}
                    <div className="wj-polaroid absolute left-2 top-1 -rotate-4 p-2 w-40 z-10 shadow-md">
                      <div className="relative aspect-square rounded-xs overflow-hidden bg-sand-deep/20 mb-1.5">
                        <Image
                          src="/media/curriculum/l02-visual-b.jpg"
                          alt="Palawan Karst Observation"
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      </div>
                      <p className="font-hand text-[11px] text-ocean-deep leading-tight text-center">
                        Palawan Karst Sketch
                      </p>
                    </div>

                    {/* Mini Polaroid 2: Botanical Plate (tilted +5deg, overlapping right) */}
                    <div className="wj-polaroid absolute right-2 top-4 rotate-5 p-2 w-44 z-20 shadow-lg">
                      <div className="relative aspect-square rounded-xs overflow-hidden bg-sand-deep/20 mb-1.5">
                        <Image
                          src="/media/curriculum/l11-visual-a.png"
                          alt="Blanco Botanical Lithograph"
                          fill
                          sizes="180px"
                          className="object-contain"
                        />
                      </div>
                      <p className="font-hand text-[11px] text-ocean-deep leading-tight text-center">
                        Flora de Filipinas (1877)
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sand-deep/50 flex items-center justify-between text-[11px] font-mono text-ink/75">
                    <span>4 Activity Clusters</span>
                    <span className="text-mango-deep font-bold">&bull; Family Keepsakes &bull;</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. THE 4 LIVING MEMORY CLUSTERS (SCRAPBOOK MEMORY WALL COMPOSITION) ── */}
      <div className="py-16 sm:py-24 2xl:py-32 space-y-24 sm:space-y-36 max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* ══════════════════════════════════════════════════════════════
            CLUSTER 1: FROM THE FAMILY KITCHEN — SCRAPBOOK WORKTOP
            ══════════════════════════════════════════════════════════════ */}
        <section id="kitchen-cluster" className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-sand-deep/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-mango-deep mb-1">
                <Utensils className="w-3.5 h-3.5" />
                <span>Cluster 01</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
                From the Family Kitchen Table
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink/75 max-w-md font-medium">
              Structured printable recipe index cards turn cultural discoveries into delicious family meals prepared together at home.
            </p>
          </div>

          {/* Organic Scrapbook Composition: Dominant Focal Sheet + Overlapping Cards */}
          <div className="relative grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Focal Recipe 1: Mango Float Celebration (Dominant, 7 cols) */}
            <div className="lg:col-span-7 relative">
              {/* Decorative Washi Tape Strips */}
              <div className="absolute -top-3 left-12 w-24 h-6 bg-mango/45 border border-sand-deep/70 rounded-xs -rotate-2 shadow-2xs z-20 pointer-events-none" />
              <div className="absolute -bottom-2 right-16 w-20 h-5 bg-sand-deep/60 border border-sand-deep/70 rounded-xs rotate-1 shadow-2xs z-20 pointer-events-none" />

              <div className="wj-recipe-card p-6 sm:p-9 relative shadow-md bg-[#fffdf7]">
                {/* Header Strip with Postal Mark */}
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-sand-deep/80 mb-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase text-mango-deep tracking-wider block">
                      Visayas &bull; Stage 2 Living Culture
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl text-ocean-deep font-bold mt-0.5">
                      Mango Float Celebration
                    </h3>
                  </div>
                  <div className="wj-postmark w-16 h-16 shrink-0 -rotate-6 border-2 border-sunset-deep/40 text-sunset-deep p-1 text-center">
                    <span className="text-[8px] font-mono leading-none block">SUNDAY</span>
                    <span className="text-[10px] font-bold font-display leading-tight block">KITCHEN</span>
                    <span className="text-[7px] font-mono leading-none block">DESSERT</span>
                  </div>
                </div>

                <p className="font-hand text-base sm:text-lg text-ocean-deep/90 mb-5 leading-relaxed">
                  &ldquo;Sweet golden Carabao mangoes layered with chilled sweet cream and crispy honey graham crackers &mdash; assembled by little hands!&rdquo;
                </p>

                {/* Two-column Ingredient & Step Scrapbook Notes */}
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <div className="p-4 rounded-2xl bg-sand/40 border border-sand-deep/70 space-y-2 text-xs font-mono">
                    <span className="font-bold text-ocean-deep uppercase text-[10px] tracking-wider block border-b border-sand-deep/50 pb-1">
                      Ingredients from the Market
                    </span>
                    <div className="flex justify-between text-ink/90">
                      <span>&bull; Sweet Philippine Mangoes</span>
                      <span className="font-bold text-ocean-deep">3 ripe</span>
                    </div>
                    <div className="flex justify-between text-ink/90">
                      <span>&bull; Chilled Sweet Cream</span>
                      <span className="font-bold text-ocean-deep">1 cup</span>
                    </div>
                    <div className="flex justify-between text-ink/90">
                      <span>&bull; Honey Graham Crackers</span>
                      <span className="font-bold text-ocean-deep">1 pack</span>
                    </div>
                    <div className="flex justify-between text-ink/90">
                      <span>&bull; Condensed Milk Drizzle</span>
                      <span className="font-bold text-ocean-deep">to taste</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/90 border border-sand-deep/70 space-y-2 text-xs">
                    <span className="font-bold text-ocean-deep uppercase text-[10px] font-mono tracking-wider block border-b border-sand-deep/50 pb-1">
                      Learner Hands-On Tasks
                    </span>
                    <div className="flex items-start gap-2 text-ink/85 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-palm-deep shrink-0 mt-0.5" />
                      <span>Arranging the graham biscuit foundation</span>
                    </div>
                    <div className="flex items-start gap-2 text-ink/85 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-palm-deep shrink-0 mt-0.5" />
                      <span>Scooping thin mango slices in neat rows</span>
                    </div>
                    <div className="flex items-start gap-2 text-ink/85 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-palm-deep shrink-0 mt-0.5" />
                      <span>Dusting golden graham crumbs over top</span>
                    </div>
                  </div>
                </div>

                {/* Hand-written marginal note */}
                <div className="pt-3 border-t border-dashed border-sand-deep/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <p className="font-hand text-sm text-ink/80">
                    &ldquo;Teacher Sharon tip: Chill in the refrigerator overnight before slicing!&rdquo;
                  </p>
                  <span className="text-[10px] text-ink/60 font-mono italic shrink-0">
                    * Structured family kitchen guide
                  </span>
                </div>
              </div>
            </div>

            {/* Overlapping Secondary Recipe Cards (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 relative sm:pt-4">
              
              {/* Recipe 2: Warm Ginger Arroz Caldo (Slightly tilted -2deg, pinned note) */}
              <div className="relative wj-recipe-card p-5 sm:p-6 shadow-sm -rotate-1.5 transition-transform duration-300 hover:rotate-0 hover:shadow-md">
                <div className="absolute -top-2.5 right-10 w-16 h-5 bg-sunset/35 border border-sand-deep/70 rounded-xs rotate-2 shadow-2xs z-10" />
                
                <div className="flex items-center justify-between pb-2 border-b border-sand-deep/50 mb-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-sunset-deep">
                    Luzon &bull; Stage 5 Comfort
                  </span>
                  <span className="wj-stamp px-2 py-0.5 text-[8px] font-mono font-bold text-ocean-deep">
                    WARM RAINY DAY
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl text-ocean-deep font-bold">
                  Warm Ginger Arroz Caldo
                </h3>
                <p className="font-hand text-xs sm:text-sm text-ink/75 mt-0.5 mb-3">
                  &ldquo;Fragrant native ginger broth, toasted garlic bits, and fresh calamansi squeeze.&rdquo;
                </p>

                <div className="p-3 rounded-xl bg-sand/40 border border-sand-deep/60 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-ink/85">
                    <span>&bull; Native Glutinous Rice</span>
                    <span className="text-ink/60 font-bold">1 cup</span>
                  </div>
                  <div className="flex justify-between text-ink/85">
                    <span>&bull; Fresh Crushed Ginger</span>
                    <span className="text-ink/60 font-bold">2 tbsp</span>
                  </div>
                  <div className="flex justify-between text-ink/85">
                    <span>&bull; Golden Crispy Garlic</span>
                    <span className="text-ink/60 font-bold">to top</span>
                  </div>
                </div>
              </div>

              {/* Recipe 3: Crispy Saba Turon (Tilted +2deg, paperclip note) */}
              <div className="relative wj-recipe-card p-5 sm:p-6 shadow-sm rotate-2 transition-transform duration-300 hover:rotate-0 hover:shadow-md">
                <div className="absolute -top-2.5 left-10 w-16 h-5 bg-palm/35 border border-sand-deep/70 rounded-xs -rotate-2 shadow-2xs z-10" />
                
                <div className="flex items-center justify-between pb-2 border-b border-sand-deep/50 mb-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-palm-deep">
                    Mindanao &bull; Stage 7 Snack
                  </span>
                  <span className="wj-stamp px-2 py-0.5 text-[8px] font-mono font-bold text-ocean-deep">
                    AFTER-CLASS CRISP
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl text-ocean-deep font-bold">
                  Crispy Saba Turon
                </h3>
                <p className="font-hand text-xs sm:text-sm text-ink/75 mt-0.5 mb-3">
                  &ldquo;Sweet Saba bananas wrapped crisp with golden jackfruit slivers and caramelized muscovado.&rdquo;
                </p>

                <div className="p-3 rounded-xl bg-sand/40 border border-sand-deep/60 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-ink/85">
                    <span>&bull; Ripe Saba Bananas</span>
                    <span className="text-ink/60 font-bold">4 sliced</span>
                  </div>
                  <div className="flex justify-between text-ink/85">
                    <span>&bull; Sweet Jackfruit (Langka)</span>
                    <span className="text-ink/60 font-bold">slivers</span>
                  </div>
                  <div className="flex justify-between text-ink/85">
                    <span>&bull; Muscovado Sugar Dust</span>
                    <span className="text-ink/60 font-bold">generous</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            CLUSTER 2: FROM OUR SKETCHBOOKS — BOTANICAL & ARCHIVAL FOLIO
            ══════════════════════════════════════════════════════════════ */}
        <section id="sketchbooks-cluster" className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-sand-deep/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-ocean-deep mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Cluster 02</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
                From Our Sketchbooks &amp; Nature Studies
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink/75 max-w-md font-medium">
              Curriculum primary sources, classical botanical plates, and geographical references that learners observe and draw inspiration from in their personal journals.
            </p>
          </div>

          {/* Asymmetrical Memory Wall: Large Focal Botanical Plate + Overlapping Polaroids */}
          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Large Dominant Botanical Lithograph Plate (7 cols) */}
            <div className="lg:col-span-7 relative">
              <div className="wj-polaroid p-5 sm:p-7 shadow-lg bg-white relative border-2 border-sand-deep/70">
                {/* Vintage Archival Stamp */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="wj-stamp px-2.5 py-1 text-[9px] font-mono font-bold text-mango-deep border-mango-deep/60 -rotate-3 bg-white/90">
                    GRAN EDICI&Oacute;N &bull; 1877
                  </span>
                </div>

                <div className="relative aspect-[16/11] rounded-xs overflow-hidden bg-sand-deep/20 mb-4 border border-sand-deep/60">
                  <Image
                    src="/media/curriculum/l11-visual-a.png"
                    alt="Narra Tree Botanical Illustration from Francisco Manuel Blanco's Flora de Filipinas (1877)"
                    fill
                    sizes="(max-width: 1024px) 100vw, 750px"
                    className="object-contain p-3"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-mango-deep tracking-wider">
                      Primary Source Scan &bull; Flora de Filipinas (1877)
                    </span>
                    <span className="text-[10px] font-mono text-ink/50">&bull; Plate 283</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold">
                    Narra Tree Botanical Illustration (Pterocarpus indicus)
                  </h3>
                  <p className="font-hand text-sm sm:text-base text-ink/80 leading-relaxed">
                    &ldquo;Francisco Manuel Blanco botanical lithograph &mdash; observed in Lesson 11 for leaflet symmetry, native tree stewardship, and scientific illustration precision.&rdquo;
                  </p>
                  <p className="text-[11px] font-mono text-ink/65 pt-2 border-t border-sand-deep/50 italic">
                    Learners reproduce the 9 alternating leaflets and winged seed pod in their field sketchbooks.
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping Landscape Polaroids Stack (5 cols) */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-6 relative justify-center">
              
              {/* Polaroid 1: Mayon Volcano (Tomas Tam authentic capture, tilted +3deg) */}
              <div className="wj-polaroid rotate-2 p-4 shadow-md transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] bg-white">
                <div className="relative aspect-[4/3] rounded-xs overflow-hidden bg-sand-deep/20 mb-2.5 border border-sand-deep/50">
                  <Image
                    src="/media/curriculum/l08-visual-a.jpg"
                    alt="Mayon Volcano from Daraga Church in Albay"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                  />
                </div>
                <div className="px-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-sunset-deep block">
                    Topographical Reference &bull; Albay
                  </span>
                  <p className="font-display text-base text-ocean-deep font-bold">
                    Mayon Volcano from Daraga
                  </p>
                  <p className="font-hand text-xs sm:text-sm text-ink/75 mt-0.5">
                    &ldquo;Authentic photograph (Tomas Tam) &mdash; studied in Lesson 8 to trace symmetrical stratovolcano contours.&rdquo;
                  </p>
                </div>
              </div>

              {/* Polaroid 2: El Nido Limestone Karsts (Christian Bickel authentic capture, tilted -2.5deg) */}
              <div className="wj-polaroid -rotate-2 p-4 shadow-md transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] bg-white">
                <div className="relative aspect-[4/3] rounded-xs overflow-hidden bg-sand-deep/20 mb-2.5 border border-sand-deep/50">
                  <Image
                    src="/media/curriculum/l02-visual-b.jpg"
                    alt="El Nido Limestone Karst Formations in Northern Palawan"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                  />
                </div>
                <div className="px-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-palm-deep block">
                    Coastal Geography Reference &bull; Palawan
                  </span>
                  <p className="font-display text-base text-ocean-deep font-bold">
                    El Nido Limestone Karsts
                  </p>
                  <p className="font-hand text-xs sm:text-sm text-ink/75 mt-0.5">
                    &ldquo;Authentic photograph (Christian Bickel) &mdash; studied in Lesson 2 to explore archipelago coastline formations.&rdquo;
                  </p>
                </div>
              </div>

            </div>

          </div>

          <div className="mt-6 pt-3 border-t border-sand-deep/50 text-[11px] font-mono text-ink/65 italic">
            * Reference plates and photographs shown above are authentic curriculum primary sources and field studies. Personal child sketchbook submissions remain private within authenticated family workspaces.
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            CLUSTER 3: FROM CLASS CELEBRATIONS & SPOKEN VOICES
            ══════════════════════════════════════════════════════════════ */}
        <section id="celebrations-cluster" className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-sand-deep/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-sunset-deep mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cluster 03</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
                From Class Celebrations &amp; Spoken Voices
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink/75 max-w-md font-medium">
              Audio memories, birthday blessings, and milestone notes affirming courage in oral language.
            </p>
          </div>

          {/* Organic Layered Pinboard Layout */}
          <div className="relative grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Primary Centerpiece: Birthday Blessing Letter from Teacher Sharon (7 cols) */}
            <div className="lg:col-span-7 relative">
              <div className="absolute -top-3 left-10 w-24 h-6 bg-mango/40 border border-sand-deep/70 rounded-xs -rotate-2 shadow-2xs z-10" />

              <div className="wj-card p-7 sm:p-9 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm relative">
                <div className="flex items-center justify-between pb-4 border-b border-sand-deep/50 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-mango/25 text-ocean-deep flex items-center justify-center">
                      <Heart className="w-5 h-5 text-ocean-deep" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-mango-deep block">
                        Founder Affirmation
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold">
                        Teacher Sharon Birthday Blessing
                      </h3>
                    </div>
                  </div>

                  <div className="wj-postmark w-14 h-14 border-2 border-mango-deep/40 text-mango-deep p-1 text-center -rotate-3 shrink-0">
                    <span className="text-[7px] font-mono block">CELEBRATION</span>
                    <span className="text-[9px] font-bold font-display block">BLESSED</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-sand/35 border border-sand-deep/70 mb-4 space-y-3">
                  <p className="font-hand text-lg sm:text-xl text-ocean-deep leading-relaxed">
                    &ldquo;Maligayang kaarawan sa iyo! May God bless your steps this year as you grow in courage, kindness, and joyful curiosity across our beautiful islands.&rdquo;
                  </p>
                  <p className="font-hand text-sm text-mango-deep font-bold text-right">
                    &mdash; Nagmamahal, Teacher Sharon
                  </p>
                </div>

                <p className="text-[11px] font-mono text-ink/65 italic">
                  * Personalized keepsake generated for each child&apos;s special birthday celebration during the term.
                </p>
              </div>
            </div>

            {/* Overlapping Keepsake Cards (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Voice Postcard (tilted +1.5deg) */}
              <div className="wj-card p-5 sm:p-6 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm relative rotate-1.5 transition-transform duration-300 hover:rotate-0">
                <div className="absolute -top-2.5 right-8 w-16 h-5 bg-sunset/30 border border-sand-deep/60 rounded-xs rotate-2 shadow-2xs z-10" />

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-sunset/15 text-sunset-deep flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-sunset-deep" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-sunset-deep block">
                      Spoken Audio Keepsake
                    </span>
                    <h3 className="font-display text-base text-ocean-deep font-bold">
                      Oral Greeting Audio Postcard
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sand/30 border border-sand-deep/60 mb-2.5">
                  <p className="font-hand text-sm sm:text-base text-ocean-deep leading-relaxed">
                    &ldquo;Listening back to our first Tagalog conversation: &lsquo;Magandang araw po sa inyong lahat!&rsquo;&rdquo;
                  </p>
                  {/* Subtle waveform graphic */}
                  <div className="flex items-center gap-1 mt-2.5 px-2 py-1 bg-white/70 rounded-lg border border-sand-deep/50">
                    <div className="w-1 h-3 bg-ocean-deep/60 rounded-full animate-pulse" />
                    <div className="w-1 h-5 bg-ocean-deep/80 rounded-full" />
                    <div className="w-1 h-4 bg-ocean-deep/60 rounded-full" />
                    <div className="w-1 h-6 bg-sunset-deep rounded-full" />
                    <div className="w-1 h-3 bg-ocean-deep/60 rounded-full" />
                    <div className="w-1 h-5 bg-ocean-deep/80 rounded-full" />
                    <div className="w-1 h-2 bg-ocean-deep/40 rounded-full" />
                    <span className="text-[9px] font-mono text-ocean-deep/75 ml-2 font-bold">0:14 / 0:30 Audio Note</span>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-ink/60">
                  * Stored securely within private authenticated family workspaces.
                </p>
              </div>

              {/* Virtue Ribbon (tilted -2deg) */}
              <div className="wj-card p-5 sm:p-6 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm relative -rotate-2 transition-transform duration-300 hover:rotate-0">
                <div className="absolute -top-2.5 left-8 w-16 h-5 bg-palm/30 border border-sand-deep/60 rounded-xs -rotate-1 shadow-2xs z-10" />

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-palm/20 text-palm-deep flex items-center justify-center">
                    <Award className="w-5 h-5 text-palm-deep" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-palm-deep block">
                      Virtue Milestone
                    </span>
                    <h3 className="font-display text-base text-ocean-deep font-bold">
                      Paggalang &amp; Respect Ribbon
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sand/30 border border-sand-deep/60 mb-2.5">
                  <p className="font-hand text-sm sm:text-base text-ocean-deep leading-relaxed">
                    &ldquo;Practiced &lsquo;po&rsquo; at &lsquo;opo&rsquo; with genuine warmth and respect during today&apos;s island folklore reading.&rdquo;
                  </p>
                </div>

                <p className="text-[10px] font-mono text-ink/60">
                  * Character virtues honored alongside conversational fluency.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            CLUSTER 4: FROM THE ADVENTURE PASSPORT — LOGBOOK MARKS
            ══════════════════════════════════════════════════════════════ */}
        <section id="passport-cluster" className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-sand-deep/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-palm-deep mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Cluster 04</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
                From the Adventure Passport
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink/75 max-w-md font-medium">
              Canonical stamps that commemorate real learning milestones across geography, language, and cultural stewardship.
            </p>
          </div>

          {/* Authentic Logbook Open Spread: Distinct Ink Seal Shapes & Route Trail */}
          <div className="relative rounded-3xl bg-[#fbf6ea] border-2 border-sand-deep/80 p-6 sm:p-10 shadow-sm overflow-hidden">
            {/* Background Grid Lines simulating traveler's logbook */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#274472 1px, transparent 1px), radial-gradient(#274472 1px, #fbf6ea 1px)",
                backgroundSize: "24px 24px",
                backgroundPosition: "0 0, 12px 12px",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-dashed border-sand-deep/80 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-ocean-deep">
                    Official Passport Log &bull; Pages 06 &amp; 07
                  </span>
                </div>
                <span className="wj-stamp px-2.5 py-0.5 text-[9px] font-mono font-bold text-ocean-deep bg-white/70">
                  INK IMPRESSIONS
                </span>
              </div>

              {/* 5 Distinct Rubber Stamp Marks organically placed with rotation & postmark character */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 items-center">
                
                {/* Stamp 1: Island Explorer (Circular double-ring nautical seal, -5deg) */}
                <div className="flex flex-col items-center text-center -rotate-5 transition-transform hover:rotate-0">
                  <div className="w-24 h-24 rounded-full border-4 border-dashed border-ocean-deep/70 p-1 flex items-center justify-center bg-white/60 shadow-xs mb-3">
                    <div className="w-full h-full rounded-full border-2 border-ocean-deep/50 flex flex-col items-center justify-center p-2 text-ocean-deep">
                      <Compass className="w-7 h-7 text-ocean-deep mb-1" />
                      <span className="text-[8px] font-mono font-bold tracking-tighter uppercase leading-none">STAGE 2</span>
                    </div>
                  </div>
                  <h4 className="font-display text-sm sm:text-base text-ocean-deep font-bold">Island Explorer</h4>
                  <span className="font-mono text-[10px] text-mango-deep font-bold">Archipelago Geography</span>
                  <p className="font-hand text-xs text-ink/75 mt-1">&ldquo;7,641 islands mapped&rdquo;</p>
                </div>

                {/* Stamp 2: Language Star (Scalloped mango starburst, +4deg) */}
                <div className="flex flex-col items-center text-center rotate-4 transition-transform hover:rotate-0">
                  <div className="w-24 h-24 rounded-2xl border-4 border-dashed border-mango-deep/70 p-1 flex items-center justify-center bg-white/60 shadow-xs mb-3">
                    <div className="w-full h-full rounded-xl border-2 border-mango-deep/50 flex flex-col items-center justify-center p-2 text-mango-deep">
                      <Star className="w-7 h-7 text-mango-deep mb-1" />
                      <span className="text-[8px] font-mono font-bold tracking-tighter uppercase leading-none">STAGE 4</span>
                    </div>
                  </div>
                  <h4 className="font-display text-sm sm:text-base text-ocean-deep font-bold">Language Star</h4>
                  <span className="font-mono text-[10px] text-mango-deep font-bold">Conversational Tagalog</span>
                  <p className="font-hand text-xs text-ink/75 mt-1">&ldquo;Oral greetings mastered&rdquo;</p>
                </div>

                {/* Stamp 3: Kind Heart (Wax heart postmark, -3deg) */}
                <div className="flex flex-col items-center text-center -rotate-3 transition-transform hover:rotate-0">
                  <div className="w-24 h-24 rounded-full border-4 border-dashed border-sunset-deep/70 p-1 flex items-center justify-center bg-white/60 shadow-xs mb-3">
                    <div className="w-full h-full rounded-full border-2 border-sunset-deep/50 flex flex-col items-center justify-center p-2 text-sunset-deep">
                      <Heart className="w-7 h-7 text-sunset-deep mb-1" />
                      <span className="text-[8px] font-mono font-bold tracking-tighter uppercase leading-none">STAGE 5</span>
                    </div>
                  </div>
                  <h4 className="font-display text-sm sm:text-base text-ocean-deep font-bold">Kind Heart</h4>
                  <span className="font-mono text-[10px] text-mango-deep font-bold">Virtue &amp; Respect</span>
                  <p className="font-hand text-xs text-ink/75 mt-1">&ldquo;Paggalang at po/opo&rdquo;</p>
                </div>

                {/* Stamp 4: Little Chef (Oval culinary baker's mark, +6deg) */}
                <div className="flex flex-col items-center text-center rotate-6 transition-transform hover:rotate-0">
                  <div className="w-24 h-24 rounded-2xl border-4 border-dashed border-palm-deep/70 p-1 flex items-center justify-center bg-white/60 shadow-xs mb-3">
                    <div className="w-full h-full rounded-xl border-2 border-palm-deep/50 flex flex-col items-center justify-center p-2 text-palm-deep">
                      <Utensils className="w-7 h-7 text-palm-deep mb-1" />
                      <span className="text-[8px] font-mono font-bold tracking-tighter uppercase leading-none">STAGE 5</span>
                    </div>
                  </div>
                  <h4 className="font-display text-sm sm:text-base text-ocean-deep font-bold">Little Chef</h4>
                  <span className="font-mono text-[10px] text-mango-deep font-bold">Family Kitchen Joy</span>
                  <p className="font-hand text-xs text-ink/75 mt-1">&ldquo;Turon &amp; Mango float&rdquo;</p>
                </div>

                {/* Stamp 5: Bayanihan (Golden Capstone Seal Preview, 0deg radiant) */}
                <div className="flex flex-col items-center text-center col-span-2 sm:col-span-1 transition-transform hover:scale-105">
                  <div className="w-24 h-24 rounded-full border-4 border-double border-ocean-deep/80 p-1 flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200/80 shadow-md mb-3">
                    <div className="w-full h-full rounded-full border border-ocean-deep/40 flex flex-col items-center justify-center p-2 text-ocean-deep">
                      <Users className="w-7 h-7 text-ocean-deep mb-1" />
                      <span className="text-[8px] font-mono font-bold tracking-tighter uppercase leading-none">&bull; CAPSTONE &bull;</span>
                    </div>
                  </div>
                  <h4 className="font-display text-sm sm:text-base text-ocean-deep font-bold">Bayanihan</h4>
                  <span className="font-mono text-[10px] text-ocean-deep font-bold">&sparkles; Capstone Preview</span>
                  <p className="font-hand text-xs text-ink/75 mt-1">&ldquo;Community stewardship&rdquo;</p>
                </div>

              </div>

              <div className="mt-8 pt-4 border-t border-dashed border-sand-deep/80 flex items-center justify-between text-xs font-mono text-ink/70">
                <span>Passports stamped throughout child journey</span>
                <span>Authentic Ink Language</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── 3. BOTTOM CTA: CURRICULUM BRIDGE ── */}
      <section className="py-14 sm:py-20 bg-sand/30 border-t border-sand-deep/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="wj-card p-8 sm:p-12 rounded-3xl bg-white border-2 border-sand-deep/80 shadow-sm text-center">
            <h3 className="font-display text-xl sm:text-3xl text-ocean-deep font-bold">
              Want to see how an expedition unfolds?
            </h3>
            <p className="text-xs sm:text-sm text-ink/80 mt-2 max-w-md mx-auto font-medium leading-relaxed">
              Explore the daily expedition rhythm with Teacher Sharon, or discover our 65 living lessons across the archipelago.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/experience"
                className="wj-btn text-xs sm:text-sm px-6 py-3 inline-flex items-center gap-2 shadow-xs"
              >
                <span>Walk the Daily Experience</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/learning"
                className="wj-btn wj-btn-ghost text-xs sm:text-sm px-5 py-3 border border-sand-deep/80 bg-paper"
              >
                Discover the 65 Lessons &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
