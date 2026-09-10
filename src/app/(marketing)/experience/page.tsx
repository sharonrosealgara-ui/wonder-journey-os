import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  Sparkles,
  Heart,
  Video,
  BookOpen,
  Utensils,
  Award,
  ArrowRight,
  ShieldCheck,
  Palette,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Experience Wonder Journey | A Day Inside Wonder Journey",
  description:
    "Discover what participating in Wonder Journey feels like: an illustrated vertical expedition through live sessions with Teacher Sharon, interactive Adventure Theater, earned passport stamps, and possible family keepsakes.",
};

interface JourneyWaypoint {
  id: string;
  step: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  handNote: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
}

const EXPEDITION_WAYPOINTS: JourneyWaypoint[] = [
  {
    id: "arrive",
    step: "01",
    phase: "ARRIVE",
    title: "Gather in the Living Circle",
    subtitle: "Morning Greetings Across Timezones",
    description:
      "A warm, welcoming face awaits. Learners check in from across North America, Europe, and Asia-Pacific. Teacher Sharon greets each child by name in an intimate circle designed for focused, personal dialogue.",
    handNote: "“Kumusta! The compass is calibrated for today's island destination.”",
    accentBg: "bg-sky/15",
    accentBorder: "border-sky-deep/30",
    badgeBg: "bg-sky-deep/20",
    badgeText: "text-ocean-deep",
    icon: <Video className="w-5 h-5 text-ocean-deep" />,
  },
  {
    id: "welcome",
    step: "02",
    phase: "WELCOME",
    title: "Heartfelt Welcome & Island Reveal",
    subtitle: "Setting the Expedition Compass",
    description:
      "Every gathering begins with a peaceful, prayerful welcome and mutual honor. Sharon unfolds the regional map — revealing the morning's destination among the archipelago's 7,641 islands.",
    handNote: "“Today we set sail for the limestone karst cliffs of Palawan!”",
    accentBg: "bg-sand/40",
    accentBorder: "border-sand-deep/60",
    badgeBg: "bg-mango/25",
    badgeText: "text-ocean-deep",
    icon: <Compass className="w-5 h-5 text-mango-deep" />,
  },
  {
    id: "open",
    step: "03",
    phase: "OPEN THE ADVENTURE",
    title: "The Living Story Unfolds",
    subtitle: "Historical Maps & Conversational Phrases",
    description:
      "No passive lectures. Through the synchronized Adventure Theater stage, children follow real maritime voyages, examine authentic archival maps, and encounter conversational Tagalog words embedded directly in the story.",
    handNote: "“Key phrase to unlock today's trail: 'Magandang umaga po!'”",
    accentBg: "bg-ocean/10",
    accentBorder: "border-ocean/25",
    badgeBg: "bg-ocean/20",
    badgeText: "text-ocean-deep",
    icon: <BookOpen className="w-5 h-5 text-ocean-deep" />,
  },
  {
    id: "explore",
    step: "04",
    phase: "DISCOVER & DRAW",
    title: "Oral Dialogue & Sketchbook Observations",
    subtitle: "Active Participation on the Presentation Canvas",
    description:
      "Children highlight topographical features on live maps, practice authentic pronunciation in real time, and sketch native flora in their expedition journals — inspired by classical nature study principles.",
    handNote: "“Sketching the native Narra tree leaf with its distinctive jagged edge.”",
    accentBg: "bg-sunset/10",
    accentBorder: "border-sunset/25",
    badgeBg: "bg-sunset/20",
    badgeText: "text-sunset-deep",
    icon: <Palette className="w-5 h-5 text-sunset-deep" />,
  },
  {
    id: "create",
    step: "05",
    phase: "CREATE",
    title: "Tangible Family Extensions",
    subtitle: "Hands-on Kitchen & Cultural Crafts (Example)",
    description:
      "Curriculum extensions often invite the whole family into the kitchen or craft table. For example, families may layer sweet mango float or fold paper bangka boats to reinforce the morning's maritime themes.",
    handNote: "“Kitchen mission: Sweet ripe mangoes layered with cream & crackers.”",
    accentBg: "bg-mango/15",
    accentBorder: "border-mango/30",
    badgeBg: "bg-mango/30",
    badgeText: "text-ocean-deep",
    icon: <Utensils className="w-5 h-5 text-ocean-deep" />,
  },
  {
    id: "passport",
    step: "06",
    phase: "PASSPORT MOMENT",
    title: "The Explorer's Seal & Milestone Stamp",
    subtitle: "Honoring Curiosity & Courage",
    description:
      "At the journey's summit, learners earn a regional adventure stamp for their digital and physical passports — commemorating new vocabulary spoken, geography mastered, and character virtues demonstrated.",
    handNote: "“Stamp stamped: Palawan Karst Navigator Certified!”",
    accentBg: "bg-palm/15",
    accentBorder: "border-palm/30",
    badgeBg: "bg-palm/25",
    badgeText: "text-palm-deep",
    icon: <Award className="w-5 h-5 text-palm-deep" />,
  },
  {
    id: "reflect",
    step: "07",
    phase: "REFLECT",
    title: "Teacher Blessing & Home Connection",
    subtitle: "Taking Heritage to the Family Dinner Table",
    description:
      "Class concludes with warm personal affirmations from Teacher Sharon and a closing word of blessing. Children leave energized to share Tagalog greetings and island folklore at the family dinner table.",
    handNote: "“Remember to honor grandparents with 'Mano po' this weekend!”",
    accentBg: "bg-sky/20",
    accentBorder: "border-sky-deep/40",
    badgeBg: "bg-ocean/15",
    badgeText: "text-ocean-deep",
    icon: <Heart className="w-5 h-5 text-ocean-deep" />,
  },
];

export default function ExperiencePage() {
  return (
    <div className="bg-paper min-h-screen text-ink overflow-x-hidden">
      
      {/* ── 1. VISUAL OPENING: THE EXPEDITION DESK ── */}
      <section className="relative pt-12 pb-16 sm:pt-18 sm:pb-24 border-b border-sand-deep/60 overflow-hidden">
        {/* Atmospheric watercolor glows */}
        <div
          className="absolute -top-32 right-0 w-[550px] 2xl:w-[800px] h-[550px] 2xl:h-[800px] opacity-20 pointer-events-none blur-3xl bg-gradient-to-bl from-sky-deep via-ocean to-transparent rounded-full"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-20 w-[450px] 2xl:w-[700px] h-[450px] 2xl:h-[700px] opacity-15 pointer-events-none blur-3xl bg-gradient-to-tr from-mango via-sand to-transparent rounded-full"
          aria-hidden="true"
        />

        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Asymmetrical Editorial Narrative */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mango/20 border border-mango/40 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-4 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
                <span>The Wonder Journey Experience</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl 4k:text-8xl text-ocean-deep leading-[1.1] font-bold tracking-tight">
                A Day Inside Wonder Journey
              </h1>

              <div className="my-4 h-1.5 w-24 sm:w-32 bg-gradient-to-r from-mango to-mango-deep rounded-full opacity-90" />

              <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold leading-relaxed max-w-2xl">
                Every session is an expedition. From the morning check-in to hands-on kitchen memories and earned passport seals, learning is a living family journey.
              </p>

              <p className="text-xs sm:text-sm 2xl:text-base text-ink/80 mt-2.5 leading-relaxed max-w-xl font-medium">
                Here is how a typical expedition unfolds — guided personally by Teacher Sharon in an intimate, small-group learning circle.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#expedition-trail"
                  className="wj-btn text-xs sm:text-sm px-6 py-3 inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Walk the Daily Trail</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/learning"
                  className="wj-btn wj-btn-ghost text-xs sm:text-sm px-5 py-3 border border-sand-deep/80 bg-white"
                >
                  Curriculum &amp; Atlas &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column: Tactile Explorer Desk Composition */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-md 2xl:max-w-lg aspect-[4/3] rounded-3xl bg-sand/40 border-2 border-sand-deep/80 p-5 shadow-sm">
                
                {/* Vintage Washi Tape Corner */}
                <div className="absolute -top-3 left-8 w-20 h-6 bg-white/80 border border-sand-deep/60 rounded-xs -rotate-2 shadow-2xs z-20" />

                {/* Layered Open Travel Log Mockup */}
                <div className="relative w-full h-full rounded-2xl bg-white border border-sand-deep/70 p-4 sm:p-5 flex flex-col justify-between shadow-inner">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-sand-deep/50">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-ocean-deep" />
                        <span className="font-display text-xs sm:text-sm text-ocean-deep font-bold">
                          Expedition Field Log
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-ocean-deep/60 uppercase font-bold">
                        14°N Archipelago
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-mango-deep block">
                        Today&apos;s Focus
                      </span>
                      <p className="font-display text-sm sm:text-base text-ocean-deep font-bold">
                        Living Archipelago Geography &amp; Oral Tagalog
                      </p>
                      <p className="font-hand text-xs sm:text-sm text-ink/75 leading-snug pt-1">
                        &ldquo;We don&apos;t just read about the islands — we journey through them together.&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Tactile Stamp Impression in Field Log */}
                  <div className="pt-3 border-t border-sand-deep/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-palm animate-pulse" />
                      <span className="text-[11px] font-mono text-ocean-deep font-bold">
                        Intimate Cohort Circle
                      </span>
                    </div>
                    <div className="wj-stamp px-2.5 py-0.5 text-[10px] font-mono font-bold text-sunset-deep rotate-3">
                      LIVING LESSON
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. THE CONTINUOUS ILLUSTRATED EXPEDITION SCENE (NOT CARD GRIDS) ── */}
      <section id="expedition-trail" className="py-16 sm:py-24 md:py-32 bg-paper relative overflow-hidden">
        
        {/* Soft atmospheric background journey glow */}
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-ocean/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-2/3 -left-40 w-[600px] h-[600px] bg-mango/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative z-10">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-mango-deep block mb-1">
              Example Expedition Rhythm
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-ocean-deep font-bold leading-tight">
              An Example Journey Progression
            </h2>
            <p className="text-sm sm:text-base text-ink/80 mt-3 font-medium">
              An illustrative progression showing how an expedition may unfold &mdash; traveling through visual environments from morning welcome to possible family keepsakes.
            </p>
          </div>

          {/* CONTINUOUS SCENIC EXPEDITION SCENES (NO REPETITIVE BOXED GRIDS) */}
          <div className="space-y-20 sm:space-y-28 relative">
            
            {/* ── SCENE 1: MORNING DEPARTURE & THE LIVING CIRCLE ── */}
            <div className="relative grid lg:grid-cols-12 gap-8 items-center">
              {/* Visual Anchor: Wooden Deck & Compass Rosette (5 cols) */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl bg-sand/50 border-2 border-sand-deep/80 p-5 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-sand-deep/60">
                    <span className="text-[10px] font-mono font-bold uppercase text-ocean-deep">
                      HARBOR WAYPOINT 01 &bull; MORNING
                    </span>
                    <span className="wj-stamp px-2 py-0.5 text-[9px] font-mono font-bold text-sunset-deep rotate-2">
                      LIVING CIRCLE
                    </span>
                  </div>

                  <div className="my-auto flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-ocean/20 border-2 border-ocean-deep flex items-center justify-center text-ocean-deep -rotate-6 shrink-0 shadow-2xs">
                      <Compass className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-ocean-deep/70 uppercase block">
                        Departure Coordinate
                      </span>
                      <p className="font-display text-base font-bold text-ocean-deep">
                        14&deg;N Archipelago Dock
                      </p>
                      <p className="font-hand text-xs text-ink/80 mt-0.5">
                        &ldquo;Kumusta! The compass is calibrated for today&apos;s island trail.&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sand-deep/50 text-[10px] font-mono text-ink/65 flex justify-between">
                    <span>Intimate Cohort Circle</span>
                    <span>Morning Prayer &bull; Blessing</span>
                  </div>
                </div>
              </div>

              {/* Environmental Narrative (7 cols) */}
              <div className="lg:col-span-7 text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean/15 text-ocean-deep text-xs font-mono font-bold">
                  <Video className="w-3.5 h-3.5" />
                  <span>STEP 01 &bull; ARRIVE &amp; GATHER</span>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
                  Gather in the Living Circle
                </h3>
                <p className="text-sm sm:text-base text-ink/85 leading-relaxed font-medium">
                  A warm, welcoming face awaits. Learners check in from across timezones into an intimate circle. Teacher Sharon personally greets each child by name, opening class with prayer, warmth, and joyful island orientation.
                </p>
                <div className="p-3.5 rounded-2xl bg-white/90 border border-sand-deep/70 shadow-2xs max-w-lg">
                  <p className="font-hand text-sm sm:text-base text-ocean-deep">
                    &ldquo;Mabuhay! Are your expedition notebooks ready for today&apos;s discoveries?&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Route River Connector */}
            <div className="flex items-center justify-center -my-8 sm:-my-12">
              <div className="w-0.5 h-16 sm:h-20 border-l-2 border-dashed border-mango-deep/60" />
            </div>

            {/* ── SCENE 2: UNFOLDING THE NAUTICAL ARCHIPELAGO MAP ── */}
            <div className="relative grid lg:grid-cols-12 gap-8 items-center">
              {/* Narrative Left (7 cols) */}
              <div className="lg:col-span-7 order-2 lg:order-1 text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mango/20 text-ocean-deep text-xs font-mono font-bold">
                  <MapPin className="w-3.5 h-3.5 text-mango-deep" />
                  <span>STEP 02 &bull; NAUTICAL REVEAL</span>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
                  The Living Story Unfolds
                </h3>
                <p className="text-sm sm:text-base text-ink/85 leading-relaxed font-medium">
                  No dry lectures. Through synchronized maps and maritime charts, children follow real historical voyages, decipher coastal topography, and encounter conversational Tagalog words embedded directly in the adventure.
                </p>
                <div className="p-3.5 rounded-2xl bg-white/90 border border-sand-deep/70 shadow-2xs max-w-lg">
                  <p className="font-hand text-sm sm:text-base text-ocean-deep">
                    &ldquo;Tracing ancient sea lanes across the Visayan Sea: &apos;Magandang umaga po sa inyong lahat!&apos;&rdquo;
                  </p>
                </div>
              </div>

              {/* Visual Anchor: Nautical Chart Fragment (5 cols) */}
              <div className="lg:col-span-5 order-1 lg:order-2 relative flex justify-center">
                <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl bg-[#F4EEDD] border-2 border-sand-deep/90 p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-3 left-8 w-20 h-5 bg-mango/40 border border-sand-deep/60 rounded-xs -rotate-2 z-10" />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-sand-deep/70 shadow-inner">
                    <Image
                      src="/media/curriculum/l02-visual-b.jpg"
                      alt="El Nido Karst Formations Coastal Chart"
                      fill
                      sizes="350px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/85 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-mango">
                        12&deg;N &bull; PALAWAN KARST
                      </span>
                      <span className="font-display text-xs font-bold">
                        Northern Palawan Coastal Soundings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Route River Connector */}
            <div className="flex items-center justify-center -my-8 sm:-my-12">
              <div className="w-0.5 h-16 sm:h-20 border-l-2 border-dashed border-ocean-deep/50" />
            </div>

            {/* ── SCENE 3: THE LIVE PRESENTATION STUDIO (EMBEDDED DOCUMENTARY STAGE) ── */}
            <div className="relative bg-sand/40 border-2 border-sand-deep/80 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-deep/50 text-ocean-deep text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-mango-deep" />
                  <span>STEP 03 &bull; VERIFIED STUDIO INTERFACE</span>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
                  Interactive Drawing &amp; Live Dialogue
                </h3>
                <p className="text-xs sm:text-sm text-ink/80 mt-2 font-medium">
                  Synchronized presentation slides, active drawing layers, and privacy-shielded illustrated learner tiles.
                </p>
              </div>

              {/* Framed Studio Window */}
              <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-white border-2 border-sand-deep/80 shadow-md p-3 sm:p-4">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-sand-deep/50 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-mango animate-pulse" />
                    <span className="font-bold text-ocean-deep">Live Classroom Session</span>
                    <span className="text-ink/60">&bull; Stage 4: Visayas Expedition</span>
                  </div>
                  <span className="text-[11px] text-ocean-deep/70 font-semibold">
                    No real learner imagery is used in this public presentation.
                  </span>
                </div>

                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-sand-deep/20 border border-sand-deep/70 shadow-inner">
                  <Image
                    src="/media/product-tour/tour-live-classroom.png"
                    alt="Live Presentation Studio Interface"
                    fill
                    sizes="(max-width: 1024px) 100vw, 850px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Visual Route River Connector */}
            <div className="flex items-center justify-center -my-8 sm:-my-12">
              <div className="w-0.5 h-16 sm:h-20 border-l-2 border-dashed border-sunset-deep/50" />
            </div>

            {/* ── SCENE 4: NATURE STUDY SKETCHBOOK & CLASSICAL BOTANY ── */}
            <div className="relative grid lg:grid-cols-12 gap-8 items-center">
              {/* Botanical Plate Anchor (5 cols) */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="wj-polaroid -rotate-2 p-4 w-full max-w-sm shadow-md">
                  <div className="relative aspect-[4/3] rounded-xs overflow-hidden bg-sand-deep/20 mb-3 border border-sand-deep/50">
                    <Image
                      src="/media/curriculum/l11-visual-a.png"
                      alt="Blanco Flora de Filipinas (1877) Botanical Lithograph"
                      fill
                      sizes="350px"
                      className="object-contain p-2"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-mango-deep block">
                    Primary Source Plate &bull; Gran Edici&oacute;n (1877)
                  </span>
                  <p className="font-display text-sm font-bold text-ocean-deep">
                    Narra Leaf Observation
                  </p>
                  <p className="font-hand text-xs text-ink/75 mt-0.5">
                    &ldquo;Sketching 9 alternating leaflets and collecting native botanical terms.&rdquo;
                  </p>
                </div>
              </div>

              {/* Narrative Right (7 cols) */}
              <div className="lg:col-span-7 text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunset/15 text-sunset-deep text-xs font-mono font-bold">
                  <Palette className="w-3.5 h-3.5" />
                  <span>STEP 04 &bull; DISCOVER &amp; DRAW</span>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
                  Oral Dialogue &amp; Sketchbook Observations
                </h3>
                <p className="text-sm sm:text-base text-ink/85 leading-relaxed font-medium">
                  Children observe classical primary sources like Francisco Manuel Blanco&apos;s 1877 botanical lithographs, record leaf symmetry in their personal sketchbooks, and practice authentic Tagalog nature terms.
                </p>
                <div className="p-3.5 rounded-2xl bg-white/90 border border-sand-deep/70 shadow-2xs max-w-lg">
                  <p className="font-hand text-sm sm:text-base text-ocean-deep">
                    &ldquo;Observing how the Narra leaflet edges curve &mdash; classical nature study inspired by Charlotte Mason.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Route River Connector */}
            <div className="flex items-center justify-center -my-8 sm:-my-12">
              <div className="w-0.5 h-16 sm:h-20 border-l-2 border-dashed border-palm-deep/50" />
            </div>

            {/* ── SCENE 5: THE FAMILY KITCHEN EXTENSION TABLE ── */}
            <div className="relative grid lg:grid-cols-12 gap-8 items-center">
              {/* Narrative Left (7 cols) */}
              <div className="lg:col-span-7 order-2 lg:order-1 text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-palm/15 text-palm-deep text-xs font-mono font-bold">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>STEP 05 &bull; TANGIBLE EXTENSIONS</span>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
                  From Screen to Family Kitchen Table
                </h3>
                <p className="text-sm sm:text-base text-ink/85 leading-relaxed font-medium">
                  Curriculum extensions frequently invite the whole family into the kitchen. Structured printable recipe guides turn maritime and island lessons into delicious shared experiences prepared at home.
                </p>
                <div className="p-3.5 rounded-2xl bg-white/90 border border-sand-deep/70 shadow-2xs max-w-lg">
                  <p className="font-hand text-sm sm:text-base text-ocean-deep">
                    &ldquo;Tonight&apos;s kitchen mission: Sweet Carabao mangoes layered with sweet cream and graham crackers!&rdquo;
                  </p>
                </div>
              </div>

              {/* Taped Recipe Guide Card (5 cols) */}
              <div className="lg:col-span-5 order-1 lg:order-2 relative flex justify-center">
                <div className="wj-recipe-card p-6 w-full max-w-sm shadow-md relative">
                  <div className="absolute -top-3 right-8 w-16 h-5 bg-mango/40 border border-sand-deep/60 rounded-xs rotate-2 shadow-2xs" />
                  <div className="flex items-center justify-between pb-2 border-b border-sand-deep/50 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-mango-deep">
                      VISAYAS &bull; STAGE 2
                    </span>
                    <span className="wj-stamp px-2 py-0.5 text-[9px] font-mono font-bold text-ocean-deep">
                      FAMILY RECIPE
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-ocean-deep">
                    Mango Float Celebration
                  </h4>
                  <div className="my-2 p-2 rounded-xl bg-sand/40 border border-sand-deep/50 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between"><span>&bull; Sweet Carabao Mangoes</span><span>3 ripe</span></div>
                    <div className="flex justify-between"><span>&bull; Chilled Sweet Cream</span><span>1 cup</span></div>
                    <div className="flex justify-between"><span>&bull; Honey Graham Crackers</span><span>1 pack</span></div>
                  </div>
                  <p className="text-[10px] text-ink/60 font-mono italic">
                    * Structured recipe guide &mdash; shared in the family workspace.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Route River Connector */}
            <div className="flex items-center justify-center -my-8 sm:-my-12">
              <div className="w-0.5 h-16 sm:h-20 border-l-2 border-dashed border-ocean-deep/50" />
            </div>

            {/* ── SCENE 6: THE PASSPORT MILESTONE SEAL & CLOSING BLESSING ── */}
            <div className="relative bg-white border-2 border-sand-deep/80 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                {/* Left: Collectible Passport Postmark Moment (5 cols) */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative p-6 rounded-3xl bg-[#FBF7EE] border-2 border-sand-deep/90 shadow-sm text-center w-full max-w-xs">
                    <div className="w-20 h-20 mx-auto rounded-full border-3 border-dashed border-ocean-deep flex flex-col items-center justify-center text-ocean-deep -rotate-6 bg-ocean/10 p-2 shadow-2xs mb-3">
                      <Award className="w-8 h-8 mb-0.5" />
                      <span className="text-[8px] font-mono font-bold uppercase tracking-tighter">
                        MILESTONE SEAL
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-ocean-deep uppercase tracking-wider block">
                      Stage 2 &bull; Archipelago
                    </span>
                    <h4 className="font-display text-base font-bold text-ocean-deep">
                      Island Explorer Stamp
                    </h4>
                    <p className="font-hand text-xs text-ink/80 mt-1">
                      &ldquo;Palawan Karst Navigator Certified!&rdquo;
                    </p>
                  </div>
                </div>

                {/* Right: Closing Blessing & Family Dinner Table (7 cols) */}
                <div className="md:col-span-7 text-left space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean/15 text-ocean-deep text-xs font-mono font-bold">
                    <Heart className="w-3.5 h-3.5 text-ocean-deep" />
                    <span>STEPS 06 &amp; 07 &bull; AFFIRMATION &amp; BLESSING</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-4xl text-ocean-deep font-bold">
                    Teacher Blessing &amp; Home Connection
                  </h3>
                  <p className="text-sm sm:text-base text-ink/85 leading-relaxed font-medium">
                    At the journey&apos;s summit, learners earn a regional adventure stamp. Class concludes with warm personal affirmations from Teacher Sharon and a closing word of blessing. Children leave energized to share Tagalog greetings and island folklore at the family dinner table.
                  </p>
                  <div className="p-3.5 rounded-2xl bg-sand/30 border border-sand-deep/70 shadow-2xs max-w-lg">
                    <p className="font-hand text-sm sm:text-base text-ocean-deep">
                      &ldquo;Remember to honor grandparents with &apos;Mano po&apos; this weekend!&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. BOTTOM JOURNEY INVITATION ── */}
      <section className="py-14 sm:py-20 bg-paper border-t border-sand-deep/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="wj-card p-8 sm:p-12 rounded-3xl bg-white border-2 border-sand-deep/80 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-ocean-deep" aria-hidden="true" />
            </div>

            <h3 className="font-display text-xl sm:text-3xl text-ocean-deep font-bold">
              Ready to Explore Our 7,641-Island Horizon?
            </h3>
            <p className="text-xs sm:text-sm text-ink/80 mt-2 max-w-md mx-auto font-medium leading-relaxed">
              Discover the full living curriculum across Luzon, Visayas, and Mindanao, or review our child safety commitments.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/learning"
                className="wj-btn text-xs sm:text-sm px-6 py-3 inline-flex items-center gap-2 shadow-xs"
              >
                <span>Discover the Learning Atlas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/gallery"
                className="wj-btn wj-btn-ghost text-xs sm:text-sm px-5 py-3 border border-sand-deep/80 bg-paper"
              >
                View Keepsakes &amp; Memory Wall &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
