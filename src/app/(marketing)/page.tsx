import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Sparkles,
  BookOpen,
  Heart,
  Video,
  MapPin,
  BookMarked,
  Award,
  Sun,
  ShieldCheck,
  Lock,
  ArrowRight,
  Compass,
  Users,
  Layers,
} from "lucide-react";
import { isInquiryFormEnabled } from "@/lib/inquiry-config";
import { FounderBadgeIcon } from "@/components/ui/dimensional-icons";
import InquiryForm from "./inquiry-form";
import LearningFocusTabs from "./learning-focus-tabs";
import ProductTour from "./product-tour";
import ArchipelagoJourneyBand from "./archipelago-journey-band";
import PrimarySourcesGallery from "./primary-sources-gallery";
import Hero3DWrapper from "./hero-3d-wrapper";
import CelebrationsShowcase from "./celebrations-showcase";
import RealClassroomExperience from "./real-classroom-experience";
import ParentReflection from "./parent-reflection";

export default function LandingPage() {
  const formEnabled = isInquiryFormEnabled();

  return (
    <div className="bg-paper min-h-screen text-ink">

      {/* ── 1. CINEMATIC HERO: SIGNATURE 3D + EDITORIAL ASYMMETRY ── */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 md:pt-18 md:pb-28 border-b border-sand-deep/50">
        {/* Soft atmospheric background lighting */}
        <div
          className="absolute -top-32 -right-32 w-[600px] 2xl:w-[900px] h-[600px] 2xl:h-[900px] opacity-15 pointer-events-none -z-0 blur-3xl bg-gradient-to-bl from-sky-deep via-ocean to-transparent rounded-full"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] 2xl:w-[700px] h-[500px] 2xl:h-[700px] opacity-15 pointer-events-none -z-0 blur-3xl bg-gradient-to-tr from-mango via-sand to-transparent rounded-full"
          aria-hidden="true"
        />

        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 2xl:gap-16 items-center">

            {/* Left Column: Grand Editorial Narrative & Call to Action (7 columns) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Founder-Led Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mango/20 border border-mango/40 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-4 sm:mb-5 shadow-xs">
                <FounderBadgeIcon size={16} className="text-mango-deep shrink-0" />
                <span>Founder-Led Family Learning</span>
              </div>

              {/* Main Headline with fluid clamp scaling */}
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl 4k:text-9xl text-ocean-deep leading-[1.1] font-bold tracking-tight">
                A learning journey rooted in culture, character, and Christ.
              </h1>

              {/* Handcrafted Mango Brush Accent Bar */}
              <div className="my-4 sm:my-5 h-1.5 w-24 sm:w-32 2xl:w-44 bg-gradient-to-r from-mango to-mango-deep rounded-full opacity-95" />

              {/* Core Mission Subtitle */}
              <p className="text-base sm:text-xl 2xl:text-2xl 4k:text-3xl text-ink font-semibold leading-relaxed max-w-2xl 2xl:max-w-3xl 4k:max-w-5xl">
                Wonder Journey is an intimate, Christ-centered learning community helping children grow in language, culture, character, knowledge, and faith across the 7,641 islands of the Philippines.
              </p>

              <p className="text-xs sm:text-base 2xl:text-lg 4k:text-xl text-ink/80 mt-2.5 leading-relaxed max-w-2xl 2xl:max-w-3xl font-medium">
                A guided, one-to-few learning experience weaving conversational Tagalog, living history stories, authentic archival maps, and Biblical wisdom.
              </p>

              {/* Dignified Enrollment Status Banner */}
              <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-2xl bg-sand/60 border border-sand-deep/80 text-xs sm:text-sm font-semibold text-ink/90 max-w-xl 2xl:max-w-2xl flex items-center gap-3">
                <Lock className="w-4 h-4 text-ocean-deep shrink-0" aria-hidden="true" />
                <span>Public enrollment and inquiry submissions are currently closed for V1.</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <Link
                  href="#journey"
                  className="wj-btn text-sm sm:text-base 2xl:text-lg px-6 sm:px-8 py-3 sm:py-3.5 shadow-sm hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2.5"
                >
                  <span>Explore the 7,641 Islands</span>
                  <ArrowRight className="w-4 h-4 2xl:w-5 2xl:h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/login"
                  className="wj-btn wj-btn-ghost text-sm sm:text-base 2xl:text-lg px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-ocean-deep/30 bg-white hover:bg-paper transition-all text-center"
                >
                  Existing Family Login
                </Link>
              </div>

              {/* Exploration Metrics Strip */}
              <div className="mt-8 pt-6 border-t border-sand-deep/60 w-full flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm font-bold text-ocean-deep">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-mango" />
                  <span>82 Provinces</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ocean" />
                  <span>7,641 Islands</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-palm" />
                  <span>65 Living Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sunset" />
                  <span>100% Authentic Media</span>
                </div>
              </div>
            </div>

            {/* Right Column: Signature 3D Scene & Layered Archival Composition (5 columns) */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex flex-col items-center">
              {/* Interactive 3D Canvas Container */}
              <div className="relative w-full aspect-square max-w-[500px] lg:max-w-none 2xl:max-w-[580px] 4k:max-w-[720px] mx-auto">
                <Hero3DWrapper />

                {/* Layered Floating Accent: Authentic Palawan Karst Note Card */}
                <div className="hidden sm:flex items-center gap-3.5 absolute -bottom-6 right-2 sm:right-4 bg-white/95 backdrop-blur-md border-2 border-sand-deep/90 shadow-xl rounded-2xl p-3 max-w-xs 2xl:max-w-sm transition-transform duration-300 hover:scale-[1.03]">
                  <div className="relative w-16 h-16 2xl:w-18 2xl:h-18 rounded-xl overflow-hidden shrink-0 border border-sand-deep/70">
                    <Image
                      src="/media/curriculum/l02-visual-b.jpg"
                      alt="El Nido Limestone Karst Formations in Palawan"
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 pr-1 text-left">
                    <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-wider text-mango-deep block">
                      Lesson 2 &bull; Geography
                    </span>
                    <p className="font-display text-xs 2xl:text-sm text-ocean-deep font-bold truncate">
                      El Nido Karst Formations
                    </p>
                    <p className="text-[11px] 2xl:text-xs text-ink/75 truncate font-medium">
                      Northern Palawan coastal cliffs
                    </p>
                  </div>
                </div>

                {/* Tactile Compass Rose Cue */}
                <div className="hidden md:flex items-center gap-1.5 absolute top-2 left-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-sand-deep/70 text-[11px] font-mono text-ocean-deep shadow-2xs">
                  <Compass className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
                  <span>14°N Archipelago Compass</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. ARCHIPELAGO PANORAMA: 7,641 ISLAND HORIZON ── */}
      <div id="journey">
        <ArchipelagoJourneyBand />
      </div>

      {/* ── 3. AUTHENTIC PRODUCT TOUR: SEE WONDER JOURNEY IN ACTION ── */}
      <div id="tour">
        <ProductTour />
      </div>

      {/* ── 4. FOUR FOCUSED CURRICULUM PILLARS (DEEP OCEAN THEME) ── */}
      <section id="focus" className="py-14 sm:py-20 md:py-28 bg-ocean-deep text-white shadow-inner relative overflow-hidden">
        {/* Subtle celestial stars background pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#ffd23f_1px,transparent_1px)] [background-size:36px_36px]"
          aria-hidden="true"
        />

        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16 relative z-10">
          <div className="text-center max-w-3xl 2xl:max-w-4xl 4k:max-w-5xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-mango">
              Curriculum Architecture
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl 4k:text-7xl text-white font-bold mt-1.5">
              Four Focused Learning Pillars
            </h2>
            <p className="text-white/85 mt-3 text-sm sm:text-base 2xl:text-lg 4k:text-xl leading-relaxed font-medium">
              Our core curriculum concepts (language, culture, character, knowledge, and faith) are organized through four focused learning pillars. Foundational knowledge is integrated directly across all four pillars through island geography, natural science, historical primary sources, and practical life skills.
            </p>
          </div>

          <LearningFocusTabs />
        </div>
      </section>

      {/* ── 5. AUTHENTIC PRIMARY SOURCES & CURATED GALLERY ── */}
      <PrimarySourcesGallery />

      {/* ── 6. FOUNDER-LED LEARNING STUDIO & 1-TO-FEW MODEL ── */}
      <section id="experience" className="py-14 sm:py-20 md:py-28 bg-white border-b border-sand-deep/50">
        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">

          {/* Section Header */}
          <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-mango-deep">
              The Learning Studio
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl 4k:text-7xl text-ocean-deep font-bold mt-1.5">
              Founder-Led, Guided, and One-to-Few
            </h2>
            <p className="text-base sm:text-lg 2xl:text-xl text-ink font-semibold mt-3 leading-relaxed">
              The current V1 learning experience is personally prepared and guided by Sharon in a one-to-few setting.
            </p>
          </div>

          {/* 3 Studio Philosophy Cards */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 2xl:gap-10 mb-14 sm:mb-20">
            <div className="wj-card p-6 sm:p-8 bg-paper border-2 border-sand-deep/60 rounded-3xl hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-5">
                  <Users className="w-6 h-6 text-ocean-deep" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg sm:text-xl 2xl:text-2xl text-ocean-deep font-bold">
                  Intimate One-to-Few Learning
                </h3>
                <p className="text-xs sm:text-sm 2xl:text-base text-ink/80 mt-2 leading-relaxed font-medium">
                  Sharon personally prepares and guides each lesson, giving attentive encouragement, gentle conversational correction, and individualized pacing.
                </p>
              </div>
            </div>

            <div className="wj-card p-6 sm:p-8 bg-paper border-2 border-sand-deep/60 rounded-3xl hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-ocean/20 text-ocean-deep flex items-center justify-center mb-5">
                  <BookOpen className="w-6 h-6 text-ocean-deep" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg sm:text-xl 2xl:text-2xl text-ocean-deep font-bold">
                  Living Curriculum
                </h3>
                <p className="text-xs sm:text-sm 2xl:text-base text-ink/80 mt-2 leading-relaxed font-medium">
                  Structured lessons woven with rich storytelling, verified archival maps, historical lithographs, and natural conversational Tagalog dialogue.
                </p>
              </div>
            </div>

            <div className="wj-card p-6 sm:p-8 bg-paper border-2 border-sand-deep/60 rounded-3xl hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sunset/20 text-ocean-deep flex items-center justify-center mb-5">
                  <Heart className="w-6 h-6 text-sunset-deep" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg sm:text-xl 2xl:text-2xl text-ocean-deep font-bold">
                  Faith and Family Alignment
                </h3>
                <p className="text-xs sm:text-sm 2xl:text-base text-ink/80 mt-2 leading-relaxed font-medium">
                  Rooted in Christ and centered on Christian character virtues, shared family discussions, mutual respect, and honoring parents as primary spiritual guides.
                </p>
              </div>
            </div>
          </div>

          {/* 4-Step Interconnected Learning Flow */}
          <div className="pt-8 border-t border-sand-deep/50">
            <div className="text-center max-w-2xl 2xl:max-w-3xl mx-auto mb-10 sm:mb-14">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-mango-deep">
                The Learning Flow
              </span>
              <h3 className="font-display text-xl sm:text-3xl 2xl:text-4xl text-ocean-deep font-bold mt-1">
                How the Learning Experience Works
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
              {/* Step 1: Discover */}
              <div className="wj-card p-5 sm:p-6 border border-sand-deep/70 bg-paper rounded-2xl flex flex-col justify-between hover:border-sand-deep transition-all">
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-ocean-deep text-white font-display font-bold flex items-center justify-center text-sm sm:text-base mb-3.5 shadow-xs">
                    1
                  </div>
                  <h4 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold">
                    Discover Wonder Journey
                  </h4>
                  <p className="text-xs sm:text-sm text-ink/80 mt-2 leading-relaxed font-medium">
                    Explore the mission, educational approach, four learning pillars, and clear family participation boundaries.
                  </p>
                </div>
              </div>

              {/* Step 2: Private Space */}
              <div className="wj-card p-5 sm:p-6 border border-sand-deep/70 bg-paper rounded-2xl flex flex-col justify-between hover:border-sand-deep transition-all">
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-ocean-deep text-white font-display font-bold flex items-center justify-center text-sm sm:text-base mb-3.5 shadow-xs">
                    2
                  </div>
                  <h4 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold">
                    Private Family Space
                  </h4>
                  <p className="text-xs sm:text-sm text-ink/80 mt-2 leading-relaxed font-medium">
                    Enrolled families access a quiet, ad-free private family learning space for session schedules, lessons, and journals.
                  </p>
                </div>
              </div>

              {/* Step 3: Live Learning */}
              <div className="wj-card p-5 sm:p-6 border border-sand-deep/70 bg-paper rounded-2xl flex flex-col justify-between hover:border-sand-deep transition-all">
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-ocean-deep text-white font-display font-bold flex items-center justify-center text-sm sm:text-base mb-3.5 shadow-xs">
                    3
                  </div>
                  <h4 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold">
                    Founder-Led Live Learning
                  </h4>
                  <p className="text-xs sm:text-sm text-ink/80 mt-2 leading-relaxed font-medium">
                    Sharon personally prepares and leads interactive sessions featuring geography maps, vocabulary, and living history stories.
                  </p>
                </div>
              </div>

              {/* Step 4: Reflection */}
              <div className="wj-card p-5 sm:p-6 border border-sand-deep/70 bg-paper rounded-2xl flex flex-col justify-between hover:border-sand-deep transition-all">
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-ocean-deep text-white font-display font-bold flex items-center justify-center text-sm sm:text-base mb-3.5 shadow-xs">
                    4
                  </div>
                  <h4 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold">
                    Family Reflection & Growth
                  </h4>
                  <p className="text-xs sm:text-sm text-ink/80 mt-2 leading-relaxed font-medium">
                    Safe reflection, values discussion, and guardian visibility into approved lesson progress and shared memories.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. REAL CLASSROOM EXPERIENCE: FOCUSED SMALL-GROUP LEARNING ── */}
      <RealClassroomExperience />

      {/* ── 8. CELEBRATIONS & LEARNER MEMORIES: HANDCRAFTED KEEPSAKES & AUDIO POSTCARD PREVIEW ── */}
      <CelebrationsShowcase />

      {/* ── 9. PARENT REFLECTION: EDITORIAL INTEGRITY & PRIVACY PROTOCOL ── */}
      <ParentReflection />

      {/* ── 10. PRIVATE FAMILY LEARNING SPACE FEATURES ── */}
      <section id="family-space" className="py-14 sm:py-20 md:py-28 bg-sand/30 border-b border-sand-deep/50">
        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
          <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-mango-deep">
              Family Workspace
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl 4k:text-7xl text-ocean-deep font-bold mt-1.5">
              Private Family Learning Space
            </h2>
            <p className="text-ink/80 text-sm sm:text-base 2xl:text-lg mt-2.5 leading-relaxed font-medium">
              A private digital home base built exclusively for enrolled families to celebrate milestones together.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <div className="wj-card p-5 sm:p-6 border border-sand-deep/70 bg-white rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-3.5">
                <Video className="w-5 h-5 text-ocean-deep" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base sm:text-lg 2xl:text-xl text-ocean-deep font-bold">Live Guided Classes</h3>
              <p className="text-xs sm:text-sm text-ink/80 mt-1.5 leading-relaxed font-medium">
                Integrated video classroom with synchronized interactive presentation slides, oral questions, and joyful learning moments.
              </p>
            </div>

            <div className="wj-card p-5 sm:p-6 border border-sand-deep/70 bg-white rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-ocean/20 text-ocean-deep flex items-center justify-center mb-3.5">
                <MapPin className="w-5 h-5 text-ocean-deep" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base sm:text-lg 2xl:text-xl text-ocean-deep font-bold">Adventure Map</h3>
              <p className="text-xs sm:text-sm text-ink/80 mt-1.5 leading-relaxed font-medium">
                Curriculum exploration taking children across Philippine island provinces with interactive maps, regional history, and bilingual activities.
              </p>
            </div>

            <div className="wj-card p-5 sm:p-6 border border-sand-deep/70 bg-white rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-sunset/20 text-ocean-deep flex items-center justify-center mb-3.5">
                <BookMarked className="w-5 h-5 text-sunset-deep" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base sm:text-lg 2xl:text-xl text-ocean-deep font-bold">Family Journals</h3>
              <p className="text-xs sm:text-sm text-ink/80 mt-1.5 leading-relaxed font-medium">
                Shared family journals to document reflections, prayers, and milestones in a permanent, private family archive.
              </p>
            </div>

            <div className="wj-card p-5 sm:p-6 border border-sand-deep/70 bg-white rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-palm/20 text-palm-deep flex items-center justify-center mb-3.5">
                <Award className="w-5 h-5 text-palm-deep" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base sm:text-lg 2xl:text-xl text-ocean-deep font-bold">Milestones and Passport</h3>
              <p className="text-xs sm:text-sm text-ink/80 mt-1.5 leading-relaxed font-medium">
                Children collect tactile digital passport stamps and cultural badges celebrating consistent learning, character, and curiosity.
              </p>
            </div>

            <div className="wj-card p-5 sm:p-6 border border-sand-deep/70 bg-white rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-3.5">
                <Sun className="w-5 h-5 text-mango-deep" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base sm:text-lg 2xl:text-xl text-ocean-deep font-bold">Morning Blessings</h3>
              <p className="text-xs sm:text-sm text-ink/80 mt-1.5 leading-relaxed font-medium">
                Daily Scripture inspiration, praise reflections, and gratitude prompts designed for peaceful, encouraging morning starts.
              </p>
            </div>

            <div className="wj-card p-5 sm:p-6 border border-sand-deep/70 bg-white rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-ocean/20 text-ocean-deep flex items-center justify-center mb-3.5">
                <ShieldCheck className="w-5 h-5 text-ocean-deep" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base sm:text-lg 2xl:text-xl text-ocean-deep font-bold">Guardian Visibility</h3>
              <p className="text-xs sm:text-sm text-ink/80 mt-1.5 leading-relaxed font-medium">
                Direct guardian access to session schedules, attendance records, approved lesson reports, and strict privacy controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. FAITH TRANSPARENCY: QUIET SANCTUARY SPREAD ── */}
      <section id="faith" className="py-14 sm:py-20 md:py-28 bg-paper border-b border-sand-deep/50">
        <div className="max-w-4xl 2xl:max-w-5xl 4k:max-w-6xl mx-auto px-4 sm:px-6 2xl:px-8">
          <div className="wj-card p-6 sm:p-10 md:p-14 border-2 border-sand-deep/80 bg-white rounded-3xl shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <Heart className="w-7 h-7 text-ocean-deep" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl sm:text-4xl 2xl:text-5xl text-center text-ocean-deep font-bold">
              Faith Transparency
            </h2>
            <div className="my-3 sm:my-4 h-1 w-16 bg-mango rounded-full mx-auto" />
            <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold text-center max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed">
              Wonder Journey is openly rooted in Christ and welcoming to families from every background.
            </p>
            <div className="mt-6 sm:mt-8 space-y-4 text-sm sm:text-base 2xl:text-lg text-ink/80 leading-relaxed font-medium">
              <p>
                Our lessons incorporate Bible verses, prayerful reflection, and Christian character virtues. We explain our Bible-based approach thoroughly during private family onboarding so parents understand our learning approach and content.
              </p>
              <p>
                Participation boundary: Children are never forced to pray aloud, profess belief, convert, or participate in any religious practice beyond their family&apos;s stated comfort. We honor parents as the primary spiritual guides in their children&apos;s lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. FOUNDER SECTION: SHARON ROSE ALGARA ── */}
      <section id="founder" className="py-14 sm:py-20 md:py-28 bg-white border-b border-sand-deep/50">
        <div className="max-w-4xl 2xl:max-w-5xl 4k:max-w-6xl mx-auto px-4 sm:px-6 2xl:px-8">
          <div className="grid md:grid-cols-[1fr_2.2fr] gap-8 sm:gap-10 items-start">
            <div className="text-center md:text-left">
              <div className="w-28 h-28 sm:w-32 sm:h-32 2xl:w-36 2xl:h-36 rounded-3xl bg-ocean-deep text-white font-display text-3xl sm:text-4xl flex items-center justify-center mx-auto md:mx-0 shadow-md">
                SA
              </div>
              <h3 className="font-display text-xl sm:text-2xl 2xl:text-3xl text-ocean-deep font-bold mt-4">
                Sharon Rose Algara
              </h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-mango-deep mt-1 leading-snug">
                Founder, platform builder, teacher, curriculum creator, and family onboarding lead
              </p>
            </div>

            <div className="space-y-4 text-sm sm:text-base 2xl:text-lg text-ink/80 leading-relaxed font-medium">
              <h2 className="font-display text-2xl sm:text-3xl 2xl:text-4xl text-ocean-deep font-bold">
                The Heart Behind Wonder Journey
              </h2>
              <p>
                Wonder Journey was born out of a journey of faith, recovery, and God&apos;s faithful provision. After walking through a season of profound testing and renewal, Sharon was inspired to build a gentle, wholesome, and culturally grounded learning environment where children can discover their heritage and God&apos;s love.
              </p>
              <p>
                The current V1 learning experience is personally prepared and guided by Sharon in a one-to-few setting.
              </p>
              <div className="p-4 rounded-2xl bg-paper border border-sand-deep/70 text-xs sm:text-sm 2xl:text-base text-ink/90 leading-relaxed font-medium">
                For V1, Sharon is the only teacher. Teacher matching is a future direction that may be considered after public expansion is formally approved. Families cannot currently request or receive another teacher.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 13. INQUIRY INFORMATION: RESTRAINED PORTAL GATE ── */}
      <section id="inquiry" className="py-14 sm:py-20 md:py-28 bg-paper">
        <div className="max-w-2xl 2xl:max-w-3xl 4k:max-w-4xl mx-auto px-4 sm:px-6 2xl:px-8">
          <div className="wj-card p-6 sm:p-10 border-2 border-sand-deep/80 bg-white rounded-3xl shadow-sm text-center">
            <h2 className="font-display text-2xl sm:text-3xl 2xl:text-4xl text-ocean-deep font-bold">
              {formEnabled ? "Family Inquiry" : "Inquiry Information"}
            </h2>

            {formEnabled ? (
              <div className="mt-6 text-left">
                <InquiryForm />
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-sand-deep/40 text-xs text-ink/80 leading-relaxed">
                  <h4 className="font-bold text-ocean-deep uppercase tracking-wider mb-1">
                    Data Handling Notice
                  </h4>
                  <p>
                    We collect guardian contact information solely to respond to your inquiry and discuss potential learning fit. We do not sell or share family details, and child personal data is never requested on this public form.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 text-ocean-deep" aria-hidden="true" />
                </div>
                <div className="inline-block px-4 py-1.5 rounded-full bg-sand/60 border border-sand-deep/80 text-xs sm:text-sm font-bold text-ocean-deep">
                  Public enrollment and inquiry submissions are currently closed.
                </div>
                <p className="text-xs sm:text-sm 2xl:text-base text-ink/80 leading-relaxed max-w-md mx-auto font-medium">
                  Submissions remain paused pending formal privacy notice review. For enrolled families, please access your space through the family portal.
                </p>
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="wj-btn text-sm sm:text-base px-7 py-3 inline-block shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep focus-visible:ring-offset-2"
                  >
                    Existing Family Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
