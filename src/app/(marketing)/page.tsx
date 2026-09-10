import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Heart,
  Lock,
  ArrowRight,
  Compass,
  Users,
} from "lucide-react";
import { isInquiryFormEnabled } from "@/lib/inquiry-config";
import { FounderBadgeIcon } from "@/components/ui/dimensional-icons";
import {
  EditorialContainer,
  JournalSurface,
  WashiTapeStrip,
  FluidMeasure,
} from "@/components/visual";
import Hero3DWrapper from "./hero-3d-wrapper";
import WhatWonderJourneyFeelsLike from "./what-it-feels-like";
import LiveClassroomExperience from "./live-classroom-experience";
import AdventurePassportShowcase from "./adventure-passport-showcase";
import StorybookLearningTeaser from "./storybook-learning-teaser";
import AfterClassGalleryTeaser from "./after-class-gallery-teaser";
import CelebrationsShowcase from "./celebrations-showcase";
import TeacherSharonPreview from "./teacher-sharon-preview";
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

        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-20 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 2xl:gap-16 4k:gap-24 items-center">

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

              {/* Core Mission Subtitle: Communicates Joy, Family, Filipino Heritage, Faith, Adventure */}
              <p className="text-base sm:text-xl 2xl:text-2xl 4k:text-3xl text-ink font-semibold leading-relaxed max-w-2xl 2xl:max-w-3xl 4k:max-w-5xl">
                Wonder Journey is an intimate family learning community helping children grow in language, cultural heritage, and faith across the 7,641 islands of the Philippines.
              </p>

              <p className="text-xs sm:text-base 2xl:text-lg 4k:text-xl text-ink/80 mt-2.5 leading-relaxed max-w-2xl 2xl:max-w-3xl font-medium">
                An intimate, guided expedition weaving conversational Tagalog, living history adventures, nature study, and joyful family keepsakes.
              </p>

              {/* Dignified Enrollment Status Banner */}
              <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-2xl bg-sand/60 border border-sand-deep/80 text-xs sm:text-sm font-semibold text-ink/90 max-w-xl 2xl:max-w-2xl flex items-center gap-3">
                <Lock className="w-4 h-4 text-ocean-deep shrink-0" aria-hidden="true" />
                <span>Public enrollment and inquiry submissions are currently closed for V1.</span>
              </div>

              {/* Action Buttons: Clear Bridge Links to Experience, Learning, and Login */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <Link
                  href="/experience"
                  className="wj-btn text-sm sm:text-base 2xl:text-lg px-6 sm:px-8 py-3 sm:py-3.5 shadow-sm hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2.5"
                >
                  <span>Explore the Experience</span>
                  <ArrowRight className="w-4 h-4 2xl:w-5 2xl:h-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/learning"
                  className="wj-btn wj-btn-ghost text-sm sm:text-base 2xl:text-lg px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-ocean-deep/30 bg-white hover:bg-paper transition-all text-center"
                >
                  Discover the Learning
                </Link>
                <Link
                  href="/login"
                  className="text-xs sm:text-sm 2xl:text-base font-bold text-ocean-deep hover:text-ocean transition-colors px-3 py-2 text-center"
                >
                  Existing Family Login &rarr;
                </Link>
              </div>

              {/* Value Signals: Joy, Heritage, Small Groups, Faith */}
              <div className="mt-8 pt-6 border-t border-sand-deep/60 w-full flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm font-bold text-ocean-deep">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-mango" />
                  <span>Living Heritage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ocean" />
                  <span>Conversational Tagalog</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-palm" />
                  <span>Focused Small Groups</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sunset" />
                  <span>Christ-Rooted Values</span>
                </div>
              </div>
            </div>

            {/* Right Column: Signature 3D Scene & Layered Archival Composition (5 columns) */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex flex-col items-center">
              {/* Interactive 3D Canvas Container */}
              <div className="relative w-full aspect-square max-w-[500px] lg:max-w-none 2xl:max-w-[620px] 3xl:max-w-[760px] 4k:max-w-[980px] mx-auto">
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
                      Archipelago Geography
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

      {/* ── 2. WHAT WONDER JOURNEY FEELS LIKE: BRIGHT ILLUSTRATED NARRATIVE ── */}
      <WhatWonderJourneyFeelsLike />

      {/* ── 3. REAL LIVE CLASS EXPERIENCE: TEACHER SHARON & ILLUSTRATED LEARNERS ── */}
      <LiveClassroomExperience />

      {/* ── 4. ADVENTURE PASSPORT: LARGE TACTILE SPREAD & CANONICAL STAMPS ── */}
      <AdventurePassportShowcase />

      {/* ── 5. INTERACTIVE STORYBOOK LEARNING: DISCOVERY QUEST & ADVENTURE THEATER ── */}
      <StorybookLearningTeaser />

      {/* ── 6. AFTER-CLASS GALLERY: SCRAPBOOK KEEPSAKES & TANGIBLE OUTCOMES ── */}
      <AfterClassGalleryTeaser />

      {/* ── 7. CELEBRATIONS & BIRTHDAY KEEPSAKES: AUDIO MEMORY & BLESSINGS ── */}
      <CelebrationsShowcase />

      {/* ── 8. TEACHER SHARON & GENTLE FAITH FOUNDATION: WARM FOUNDER PREVIEW ── */}
      <TeacherSharonPreview />

      {/* ── 9. PARENT REFLECTION: EDITORIAL INTEGRITY & PRIVACY PROTOCOL ── */}
      <ParentReflection />

      {/* ── 10. INQUIRY + EXISTING FAMILY LOGIN: RESTRAINED PORTAL GATE ── */}
      <EditorialContainer
        id="inquiry"
        as="section"
        sceneWidth="4k"
        className="py-16 sm:py-24 md:py-32 bg-paper relative overflow-hidden"
      >
        <div className="max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl 4k:max-w-5xl mx-auto">
          <JournalSurface
            variant="pressed-cream"
            shadow="archival"
            className="p-6 sm:p-10 md:p-12 2xl:p-14 border-2 border-sand-deep/80 rounded-3xl text-center relative overflow-hidden"
          >
            <WashiTapeStrip color="mango" position="top-center" />
            
            <div className="w-12 h-12 2xl:w-14 2xl:h-14 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <Compass className="w-6 h-6 2xl:w-7 2xl:h-7 text-ocean-deep" aria-hidden="true" />
            </div>

            <h2 className="font-display text-2xl sm:text-3xl 2xl:text-4xl 4k:text-5xl text-ocean-deep font-bold">
              {formEnabled ? "Family Inquiry" : "Inquiry & Family Portal"}
            </h2>

            <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-sand/60 border border-sand-deep/80 text-xs sm:text-sm 2xl:text-base font-bold text-ocean-deep">
              Public enrollment and inquiry submissions are currently closed for V1.
            </div>

            <FluidMeasure align="center" className="mt-4">
              <p className="text-xs sm:text-sm 2xl:text-base text-ink/80 leading-relaxed font-medium">
                Wonder Journey serves an intimate number of families to maintain authentic relationship. Existing enrolled families may access their space anytime via the family portal.
              </p>
            </FluidMeasure>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/login"
                className="wj-btn text-sm sm:text-base 2xl:text-lg px-7 py-3 inline-block shadow-sm"
              >
                Existing Family Login
              </Link>
              <Link
                href="/inquiry"
                className="wj-btn wj-btn-ghost text-sm sm:text-base 2xl:text-lg px-6 py-3 border border-sand-deep/80 bg-paper"
              >
                Inquiry Information &rarr;
              </Link>
            </div>

          </JournalSurface>
        </div>
      </EditorialContainer>

    </div>
  );
}
