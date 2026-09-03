import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles,
  BookOpen,
  Compass,
  Heart,
  Video,
  MapPin,
  BookMarked,
  Award,
  Sun,
  ShieldCheck,
  Lock,
  ArrowRight,
  ExternalLink,
  Users
} from 'lucide-react'
import { isInquiryFormEnabled } from '@/lib/inquiry-config'
import { FounderBadgeIcon } from '@/components/ui/dimensional-icons'
import InquiryForm from './inquiry-form'
import LearningFocusTabs from './learning-focus-tabs'
import ProductTour from './product-tour'

export default function LandingPage() {
  const formEnabled = isInquiryFormEnabled()

  return (
    <div className="bg-paper min-h-screen text-ink">

      {/* ── HERO SECTION: SPLIT LAYOUT ── */}
      <section className="relative overflow-hidden pt-5 pb-10 sm:pt-10 sm:pb-14 md:pt-16 md:pb-20 border-b border-sand-deep/40">
        <div className="max-w-6xl 2xl:max-w-[1440px] 3xl:max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-16 items-center">

            {/* Left Column: Positioning, Headline, Vision, Status, CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mango/20 border border-mango/40 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-3 sm:mb-4">
                <FounderBadgeIcon size={16} className="text-mango-deep shrink-0" />
                <span>Founder-Led Family Learning</span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl 3xl:text-7xl text-ocean-deep leading-[1.18] font-bold">
                A learning journey rooted in culture, character, and Christ.
              </h1>

              <div className="my-3 sm:my-4 h-1 w-20 2xl:w-28 bg-mango rounded-full opacity-90" />

              <p className="text-sm sm:text-lg 2xl:text-xl 3xl:text-2xl text-ink font-semibold leading-relaxed max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl">
                Wonder Journey is a <span className="whitespace-nowrap">Christ-centered</span> learning community helping children grow in language, culture, character, knowledge, and faith.
              </p>

              <p className="text-xs sm:text-base 2xl:text-lg text-ink/80 mt-2 leading-relaxed max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl font-medium">
                An intimate, guided, one-to-few learning experience connecting families with Filipino heritage, language, and Biblical wisdom.
              </p>

              <div className="mt-3 sm:mt-4 p-3 rounded-xl bg-sand/50 border border-sand-deep/70 text-xs font-semibold text-ink/90 max-w-xl 2xl:max-w-2xl leading-relaxed">
                Public enrollment and inquiry submissions are currently closed.
              </div>

              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Link
                  href="#experience"
                  className="wj-btn text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 shadow-sm hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>Explore the Learning Experience</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/login"
                  className="wj-btn wj-btn-ghost text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-ocean-deep/30 bg-white hover:bg-paper transition-all text-center"
                >
                  Existing Family Login
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold">
                <Link
                  href="#tour"
                  className="text-ocean-deep hover:text-ocean flex items-center gap-1.5 transition-colors underline underline-offset-4"
                >
                  <span>See Wonder Journey in action</span>
                  <span aria-hidden="true">&darr;</span>
                </Link>
                <span className="text-sand-deep hidden sm:inline">&bull;</span>
                <Link
                  href="#inquiry"
                  className="text-ink/70 hover:text-ocean-deep transition-colors"
                >
                  Inquiry Information
                </Link>
              </div>
            </div>

            {/* Right Column: Layered Editorial Curriculum Imagery Composition */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 pb-6 sm:pb-12">
              <div className="relative mx-auto max-w-md lg:max-w-none 2xl:max-w-lg 3xl:max-w-xl">

                {/* Primary Card: El Nido Limestone Karst Formations */}
                <div className="wj-card overflow-hidden border border-sand-deep/80 bg-white shadow-md rounded-2xl">
                  <div className="relative aspect-[16/10] bg-sand-deep/20 overflow-hidden">
                    <Image
                      src="/media/curriculum/l02-visual-b.jpg"
                      alt="El Nido Limestone Karst Formations in Palawan"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1536px) 40vw, 600px"
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full border border-sand-deep/60 shadow-sm text-[11px] font-bold text-ocean-deep flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-mango-deep" aria-hidden="true" />
                      <span>Curriculum Photography</span>
                    </div>
                  </div>
                  <div className="p-3.5 pb-4 sm:p-4 sm:pb-6">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-mango-deep">
                      <span>Palawan, Philippines</span>
                      <span>Lesson 2 Geography</span>
                    </div>
                    <h3 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold mt-1">
                      El Nido Limestone Karst Formations
                    </h3>
                    <p className="text-xs 2xl:text-sm text-ink/75 mt-1 leading-relaxed">
                      Natural coastal limestone formations and tropical waters of northern Palawan.
                    </p>
                  </div>
                </div>

                {/* Layered Accent Card: Chocolate Hills */}
                <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 right-2 sm:right-4 bg-white/95 backdrop-blur-sm border-2 border-sand-deep/90 shadow-xl rounded-2xl p-2.5 max-w-xs transition-transform duration-300 hover:scale-[1.02]">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-sand-deep/60">
                    <Image
                      src="/media/curriculum/l13-visual-b.jpg"
                      alt="Chocolate Hills Geological Formation of Bohol"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 pr-1 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-mango-deep block">
                      Bohol Island &bull; Lesson 13
                    </span>
                    <p className="font-display text-xs text-ocean-deep font-bold truncate">
                      Chocolate Hills Formation
                    </p>
                    <p className="text-[11px] text-ink/70 truncate">
                      Cone karst geological landscape
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Soft, non-repeating ambient accent curve (substantially reduced background) */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 opacity-10 pointer-events-none -z-0 blur-3xl bg-gradient-to-bl from-ocean via-sky to-transparent rounded-full"
          aria-hidden="true"
        />
      </section>

      {/* ── SEE WONDER JOURNEY IN ACTION: AUTHENTIC PRODUCT TOUR ── */}
      <ProductTour />

      {/* ── VERIFIED CURRICULUM IMAGERY GALLERY ── */}
      <section id="gallery" className="py-10 md:py-18 max-w-6xl 2xl:max-w-[1440px] 3xl:max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-8">
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-mango-deep">
            Authentic Teaching Materials
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl text-ocean-deep font-bold mt-1">
            Verified curriculum imagery from documented sources
          </h2>
          <p className="text-sm sm:text-base 2xl:text-lg text-ink/80 mt-2 leading-relaxed font-medium">
            Authentic photographs curated from open-access scientific, historical, and cultural repositories.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
          {/* Card 1: Satellite Image */}
          <div className="wj-card overflow-hidden border border-sand-deep/60 flex flex-col bg-white rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="relative aspect-[4/3] bg-sand-deep/30 overflow-hidden">
              <Image
                src="/media/curriculum/l01-visual-a.jpg"
                alt="Satellite Image of the Philippine Islands"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1536px) 33vw, 500px"
                className="object-cover"
              />
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-mango-deep">
                  Photograph
                </span>
                <h3 className="font-display text-base 2xl:text-lg text-ocean-deep mt-1 font-bold">
                  Satellite Image of the Philippine Islands
                </h3>
                <p className="text-xs 2xl:text-sm text-ink/80 mt-1.5 leading-relaxed">
                  Natural color satellite composite of the archipelago showing regional geography and island topography.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-deep/40 text-[11px] text-ink/75">
                <span>Credit: </span>
                <a
                  href="https://commons.wikimedia.org/wiki/File:Satellite_image_of_Philippines_in_March_2002.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-ocean-deep inline-flex items-center gap-0.5"
                >
                  <span>NASA Goddard Space Flight Center</span>
                  <ExternalLink className="w-3 h-3 inline" aria-hidden="true" />
                </a>
                <span> (Public Domain)</span>
              </div>
            </div>
          </div>

          {/* Card 2: El Nido Limestone Karst Formations */}
          <div className="wj-card overflow-hidden border border-sand-deep/60 flex flex-col bg-white rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="relative aspect-[4/3] bg-sand-deep/30 overflow-hidden">
              <Image
                src="/media/curriculum/l02-visual-b.jpg"
                alt="El Nido Limestone Karst Formations"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1536px) 33vw, 500px"
                className="object-cover"
              />
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-mango-deep">
                  Photograph
                </span>
                <h3 className="font-display text-base 2xl:text-lg text-ocean-deep mt-1 font-bold">
                  El Nido Limestone Karst Formations
                </h3>
                <p className="text-xs 2xl:text-sm text-ink/80 mt-1.5 leading-relaxed">
                  Natural coastal limestone formations and tropical waters of northern Palawan.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-deep/40 text-[11px] text-ink/75">
                <span>Credit: </span>
                <a
                  href="https://commons.wikimedia.org/wiki/File:El_Nido_Palawan_2.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-ocean-deep inline-flex items-center gap-0.5"
                >
                  <span>Christian Bickel</span>
                  <ExternalLink className="w-3 h-3 inline" aria-hidden="true" />
                </a>
                <span> (</span>
                <a
                  href="https://creativecommons.org/licenses/by-sa/2.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-ocean-deep"
                >
                  CC BY-SA 2.0
                </a>
                <span> via Wikimedia Commons)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Chocolate Hills */}
          <div className="wj-card overflow-hidden border border-sand-deep/60 flex flex-col bg-white rounded-2xl shadow-sm hover:shadow transition-shadow">
            <div className="relative aspect-[4/3] bg-sand-deep/30 overflow-hidden">
              <Image
                src="/media/curriculum/l13-visual-b.jpg"
                alt="Chocolate Hills Geological Formation of Bohol"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1536px) 33vw, 500px"
                className="object-cover"
              />
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-mango-deep">
                  Photograph
                </span>
                <h3 className="font-display text-base 2xl:text-lg text-ocean-deep mt-1 font-bold">
                  Chocolate Hills Geological Formation of Bohol
                </h3>
                <p className="text-xs 2xl:text-sm text-ink/80 mt-1.5 leading-relaxed">
                  Distinctive grass-covered conical karst formations in Carmen, Bohol.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-deep/40 text-[11px] text-ink/75">
                <span>Credit: </span>
                <a
                  href="https://commons.wikimedia.org/wiki/File:Chocolate_Hills_-_edit.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-ocean-deep inline-flex items-center gap-0.5"
                >
                  <span>Ramir Borja</span>
                  <ExternalLink className="w-3 h-3 inline" aria-hidden="true" />
                </a>
                <span> (</span>
                <a
                  href="https://creativecommons.org/licenses/by-sa/3.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-ocean-deep"
                >
                  CC BY-SA 3.0
                </a>
                <span> via Wikimedia Commons)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER-LED LEARNING STUDIO & JOURNEY ── */}
      <section id="experience" className="py-10 md:py-18 bg-white border-y border-sand-deep/40">
        <div className="max-w-5xl 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 2xl:px-8">

          <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-mango-deep">
              The Learning Studio
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl text-ocean-deep font-bold mt-1">
              Founder-Led, Guided, and One-to-Few
            </h2>
            <p className="text-base 2xl:text-lg text-ink font-semibold mt-2.5 leading-relaxed">
              The current V1 learning experience is personally prepared and guided by Sharon in a one-to-few setting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8 mb-12 sm:mb-16">
            <div className="wj-card p-4 sm:p-6 bg-paper border border-sand-deep/50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-3 sm:mb-4">
                <Users className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg text-ocean-deep font-bold">Intimate One-to-Few Learning</h3>
              <p className="text-sm text-ink/80 mt-1.5 leading-relaxed">
                Sharon personally prepares and guides each lesson, giving attentive encouragement and individual pacing.
              </p>
            </div>

            <div className="wj-card p-4 sm:p-6 bg-paper border border-sand-deep/50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-3 sm:mb-4">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg text-ocean-deep font-bold">Living Curriculum</h3>
              <p className="text-sm text-ink/80 mt-1.5 leading-relaxed">
                Structured lessons woven with rich storytelling, primary sources, map exploration, and conversational language practice.
              </p>
            </div>

            <div className="wj-card p-4 sm:p-6 bg-paper border border-sand-deep/50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-3 sm:mb-4">
                <Heart className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg text-ocean-deep font-bold">Faith and Family Alignment</h3>
              <p className="text-sm text-ink/80 mt-1.5 leading-relaxed">
                Rooted in Christ and centered on Christian character virtues, shared family discussion, and mutual respect.
              </p>
            </div>
          </div>

          {/* 4 Steps when inquiries are closed */}
          <div className="pt-4 border-t border-sand-deep/40">
            <div className="text-center max-w-2xl 2xl:max-w-3xl mx-auto mb-8 sm:mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-mango-deep">
                The Learning Flow
              </span>
              <h3 className="font-display text-xl sm:text-2xl 2xl:text-3xl text-ocean-deep font-bold mt-1">
                How the Learning Experience Works
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 2xl:gap-6">
              {/* Step 1: Discover Wonder Journey */}
              <div className="wj-card p-4 sm:p-5 border border-sand-deep/50 bg-paper rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-ocean-deep text-white font-display font-bold flex items-center justify-center text-sm mb-2.5 sm:mb-3">
                    1
                  </div>
                  <h4 className="font-display text-base text-ocean-deep font-bold">
                    Discover Wonder Journey
                  </h4>
                  <p className="text-xs text-ink/80 mt-1.5 leading-relaxed">
                    Explore the mission, educational approach, four learning pillars, and clear family participation boundaries.
                  </p>
                </div>
              </div>

              {/* Step 2: Private Family Learning Space */}
              <div className="wj-card p-4 sm:p-5 border border-sand-deep/50 bg-paper rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-ocean-deep text-white font-display font-bold flex items-center justify-center text-sm mb-2.5 sm:mb-3">
                    2
                  </div>
                  <h4 className="font-display text-base text-ocean-deep font-bold">
                    Private Family Learning Space
                  </h4>
                  <p className="text-xs text-ink/80 mt-1.5 leading-relaxed">
                    Enrolled families access a quiet, ad-free private family learning space for session schedules, lessons, and journals.
                  </p>
                </div>
              </div>

              {/* Step 3: Founder-Led Live Learning */}
              <div className="wj-card p-4 sm:p-5 border border-sand-deep/50 bg-paper rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-ocean-deep text-white font-display font-bold flex items-center justify-center text-sm mb-2.5 sm:mb-3">
                    3
                  </div>
                  <h4 className="font-display text-base text-ocean-deep font-bold">
                    Founder-Led Live Learning
                  </h4>
                  <p className="text-xs text-ink/80 mt-1.5 leading-relaxed">
                    Sharon personally prepares and leads interactive sessions featuring geography maps, vocabulary, and living history stories.
                  </p>
                </div>
              </div>

              {/* Step 4: Family Reflection and Growth */}
              <div className="wj-card p-4 sm:p-5 border border-sand-deep/50 bg-paper rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-ocean-deep text-white font-display font-bold flex items-center justify-center text-sm mb-2.5 sm:mb-3">
                    4
                  </div>
                  <h4 className="font-display text-base text-ocean-deep font-bold">
                    Family Reflection and Growth
                  </h4>
                  <p className="text-xs text-ink/80 mt-1.5 leading-relaxed">
                    Safe reflection, values discussion, and guardian visibility into approved lesson progress and shared memories.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── ACCURATE LEARNING FOCUS ── */}
      <section id="focus" className="py-10 md:py-18 bg-ocean-deep text-white shadow-inner">
        <div className="max-w-5xl 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 2xl:px-8">
          <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-mango">
              Curriculum Pillars
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl text-white font-bold mt-1">
              Four Focused Learning Pillars
            </h2>
            <p className="text-white/85 mt-2.5 text-sm sm:text-base 2xl:text-lg leading-relaxed font-medium max-w-2xl 2xl:max-w-3xl mx-auto">
              Our core curriculum concepts (language, culture, character, knowledge, and faith) are organized through four focused learning pillars. Foundational knowledge is integrated directly across all four pillars through island geography, natural science, historical primary sources, and practical life skills.
            </p>
          </div>

          <LearningFocusTabs />
        </div>
      </section>

      {/* ── PRIVATE FAMILY LEARNING SPACE FEATURES ── */}
      <section id="family-space" className="py-10 md:py-18 bg-white">
        <div className="max-w-5xl 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 2xl:px-8">
          <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-mango-deep">
              Family Workspace
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl text-ocean-deep font-bold mt-1">
              Private Family Learning Space
            </h2>
            <p className="text-ink/80 text-sm sm:text-base 2xl:text-lg mt-2 leading-relaxed font-medium">
              A private digital space built exclusively for enrolled families.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 2xl:gap-6">
            <div className="wj-card p-4 sm:p-5 border border-sand-deep/60 bg-paper rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-2.5 sm:mb-3">
                <Video className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold">Live Guided Classes</h3>
              <p className="text-xs 2xl:text-sm text-ink/80 mt-1 leading-relaxed">
                Integrated video classroom with interactive presentation slides and quizzes.
              </p>
            </div>

            <div className="wj-card p-4 sm:p-5 border border-sand-deep/60 bg-paper rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-2.5 sm:mb-3">
                <MapPin className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold">Adventure Map</h3>
              <p className="text-xs 2xl:text-sm text-ink/80 mt-1 leading-relaxed">
                Curriculum exploration taking children across Philippine island provinces with bilingual activities.
              </p>
            </div>

            <div className="wj-card p-4 sm:p-5 border border-sand-deep/60 bg-paper rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-2.5 sm:mb-3">
                <BookMarked className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold">Family Journals</h3>
              <p className="text-xs 2xl:text-sm text-ink/80 mt-1 leading-relaxed">
                Shared family journals to document reflections, prayers, and milestones in a permanent family archive.
              </p>
            </div>

            <div className="wj-card p-4 sm:p-5 border border-sand-deep/60 bg-paper rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-2.5 sm:mb-3">
                <Award className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold">Milestones and Passport</h3>
              <p className="text-xs 2xl:text-sm text-ink/80 mt-1 leading-relaxed">
                Children collect passport stamps and achievement badges celebrating consistent learning and effort.
              </p>
            </div>

            <div className="wj-card p-4 sm:p-5 border border-sand-deep/60 bg-paper rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-2.5 sm:mb-3">
                <Sun className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold">Morning Blessings</h3>
              <p className="text-xs 2xl:text-sm text-ink/80 mt-1 leading-relaxed">
                Daily Scripture inspiration and gratitude prompts designed for peaceful morning starts.
              </p>
            </div>

            <div className="wj-card p-4 sm:p-5 border border-sand-deep/60 bg-paper rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-2.5 sm:mb-3">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base 2xl:text-lg text-ocean-deep font-bold">Guardian Visibility</h3>
              <p className="text-xs 2xl:text-sm text-ink/80 mt-1 leading-relaxed">
                Direct guardian access to session schedules, attendance records, approved lesson reports, and consent controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAITH TRANSPARENCY ── */}
      <section id="faith" className="py-10 md:py-18 border-t border-sand-deep/40 bg-paper">
        <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 2xl:px-8">
          <div className="wj-card p-5 sm:p-8 md:p-10 border border-sand-deep/80 bg-white rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Heart className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl 2xl:text-4xl text-center text-ocean-deep font-bold">
              Faith Transparency
            </h2>
            <div className="my-2.5 sm:my-3 h-0.5 w-16 bg-mango rounded-full mx-auto" />
            <p className="text-base sm:text-lg 2xl:text-xl text-ink font-semibold text-center max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed">
              Wonder Journey is openly rooted in Christ and welcoming to families from every background.
            </p>
            <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-3.5 text-sm 2xl:text-base text-ink/80 leading-relaxed font-medium">
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

      {/* ── FOUNDER SECTION ── */}
      <section id="founder" className="py-10 md:py-18 bg-white border-t border-sand-deep/40">
        <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6 2xl:px-8">
          <div className="grid md:grid-cols-[1fr_2fr] gap-6 sm:gap-8 items-start">
            <div className="text-center md:text-left">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-ocean-deep text-white font-display text-2xl sm:text-3xl flex items-center justify-center mx-auto md:mx-0 shadow-sm">
                SA
              </div>
              <h3 className="font-display text-lg sm:text-xl 2xl:text-2xl text-ocean-deep font-bold mt-3">
                Sharon Rose Algara
              </h3>
              <p className="text-xs 2xl:text-sm font-semibold uppercase tracking-wider text-mango-deep mt-1 leading-snug">
                Founder, platform builder, teacher, curriculum creator, and family onboarding lead
              </p>
            </div>

            <div className="space-y-3 sm:space-y-3.5 text-sm 2xl:text-base text-ink/80 leading-relaxed font-medium">
              <h2 className="font-display text-xl sm:text-2xl 2xl:text-3xl text-ocean-deep font-bold">
                The Heart Behind Wonder Journey
              </h2>
              <p>
                Wonder Journey was born out of a journey of faith, recovery, and God&apos;s faithful provision. After walking through a season of profound testing and renewal, Sharon was inspired to build a gentle, wholesome, and culturally grounded learning environment where children can discover their heritage and God&apos;s love.
              </p>
              <p>
                The current V1 learning experience is personally prepared and guided by Sharon in a one-to-few setting.
              </p>
              <div className="p-3.5 sm:p-4 rounded-xl bg-paper border border-sand-deep/60 text-xs 2xl:text-sm text-ink/90 leading-relaxed">
                For V1, Sharon is the only teacher. Teacher matching is a future direction that may be considered after public expansion is formally approved. Families cannot currently request or receive another teacher.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INQUIRY INFORMATION ── */}
      <section id="inquiry" className="py-10 md:py-18 border-t border-sand-deep/40 bg-paper">
        <div className="max-w-2xl 2xl:max-w-3xl mx-auto px-4 sm:px-6 2xl:px-8">
          <div className="wj-card p-5 sm:p-8 border border-sand-deep/80 bg-white rounded-2xl shadow-sm text-center">
            <h2 className="font-display text-2xl sm:text-3xl 2xl:text-4xl text-ocean-deep font-bold">
              {formEnabled ? 'Family Inquiry' : 'Inquiry Information'}
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
              <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5 text-ocean-deep" aria-hidden="true" />
                </div>
                <div className="inline-block px-3.5 py-1.5 rounded-full bg-sand/60 border border-sand-deep/80 text-xs font-bold text-ocean-deep">
                  Public enrollment and inquiry submissions are currently closed.
                </div>
                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed max-w-md mx-auto font-medium">
                  Submissions remain paused pending formal privacy notice review. For enrolled families, please access your space through the family portal.
                </p>
                <div className="pt-1.5 sm:pt-2">
                  <Link
                    href="/login"
                    className="wj-btn text-sm px-6 py-2.5 inline-block shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep focus-visible:ring-offset-2"
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
  )
}
