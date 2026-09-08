import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Compass, Sparkles, BookOpen, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Teacher Sharon & Wonder Journey | Faith, Culture & Mission",
  description:
    "Learn about Sharon Rose Algara and the founding heart of Wonder Journey: a Christ-centered, culturally grounded learning community for diaspora and homeschool families.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 md:py-24 bg-paper min-h-screen">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-deep/40 border border-sand-deep/80 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-4">
            <Compass className="w-3.5 h-3.5 text-ocean-deep" aria-hidden="true" />
            <span>Our Origin &amp; Vision</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl text-ocean-deep font-bold leading-tight">
            The Heart Behind Wonder Journey
          </h1>
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold mt-4 leading-relaxed">
            Building a gentle, wholesome, and culturally grounded sanctuary where children discover their heritage, cultivate wisdom, and know God&apos;s love.
          </p>
        </div>

        {/* Founder Bio Card */}
        <div className="wj-card p-8 sm:p-12 md:p-16 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm mb-16 sm:mb-24">
          <div className="grid md:grid-cols-[1fr_2.2fr] gap-8 sm:gap-12 items-start">
            <div className="text-center md:text-left">
              <div className="w-32 h-32 sm:w-36 sm:h-36 2xl:w-40 2xl:h-40 rounded-3xl bg-ocean-deep text-white font-display text-4xl sm:text-5xl flex items-center justify-center mx-auto md:mx-0 shadow-md">
                SA
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-ocean-deep font-bold mt-5">
                Sharon Rose Algara
              </h2>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-mango-deep mt-1 leading-snug">
                Founder, Teacher &amp; Curriculum Author
              </p>
              <div className="mt-4 pt-4 border-t border-sand-deep/60 space-y-1.5 text-xs text-ink/75 font-medium">
                <p>Origin: Negros Occidental, Philippines</p>
                <p>Role: One-to-Few Live Guide &amp; Family Onboarding Lead</p>
              </div>
            </div>

            <div className="space-y-5 text-sm sm:text-base 2xl:text-lg text-ink/85 leading-relaxed font-medium">
              <h3 className="font-display text-2xl sm:text-3xl text-ocean-deep font-bold">
                Why Wonder Journey Was Created
              </h3>
              <p>
                Wonder Journey was born out of a journey of faith, recovery, and God&apos;s faithful provision. After walking through a season of profound testing and renewal, Sharon was inspired to build a gentle, wholesome, and culturally grounded learning environment where children can discover their heritage and God&apos;s love.
              </p>
              <p>
                As a teacher from the Philippines serving families in both local and diaspora communities across North America, Europe, and the Middle East, Sharon recognized that heritage education often felt either fragmented or overly academic.
              </p>
              <p>
                Wonder Journey was created to be different: an intimate, living learning experience where conversational language, living history, natural science, and culinary joy are united under personal, caring mentorship.
              </p>
              <p className="text-xs sm:text-sm text-ink/70 italic border-l-2 border-mango pl-4 pt-1">
                The current V1 learning experience is personally prepared and guided by Sharon in a focused one-to-few setting.
              </p>
            </div>
          </div>
        </div>

        {/* Faith Transparency Spread */}
        <div className="wj-card p-8 sm:p-12 md:p-16 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm mb-16 sm:mb-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <Heart className="w-7 h-7 text-ocean-deep" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl sm:text-4xl 2xl:text-5xl text-ocean-deep font-bold">
              Faith Transparency
            </h2>
            <div className="my-3 sm:my-4 h-1 w-16 bg-mango rounded-full mx-auto" />
            <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold leading-relaxed">
              Wonder Journey is openly rooted in Christ and welcoming to families from every background.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 max-w-3xl mx-auto space-y-5 text-sm sm:text-base 2xl:text-lg text-ink/80 leading-relaxed font-medium">
            <p>
              Our lessons incorporate Bible verses, prayerful reflection, and Christian character virtues. We explain our Bible-based approach thoroughly during private family onboarding so parents understand our learning approach and content before participating.
            </p>
            <div className="p-5 sm:p-6 rounded-2xl bg-sand/30 border border-sand-deep/70">
              <div className="flex items-center gap-2 text-ocean-deep font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-mango-deep" />
                <span>Parental Honor &amp; Freedom of Conscience</span>
              </div>
              <p className="text-xs sm:text-sm text-ink/85 leading-relaxed font-medium">
                Children are never forced to pray aloud, profess belief, convert, or participate in any religious practice beyond their family&apos;s stated comfort. We honor parents as the primary spiritual guides in their children&apos;s lives.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Guiding Tenets */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
          <div className="wj-card p-6 sm:p-8 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-ocean/15 text-ocean-deep flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg text-ocean-deep font-bold mb-2">Living Books &amp; Sources</h3>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              We reject synthetic history and dull textbooks. We read rich literary stories, observe authentic botanical lithographs, and study real historical artifacts.
            </p>
          </div>

          <div className="wj-card p-6 sm:p-8 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg text-ocean-deep font-bold mb-2">Whole-Child Warmth</h3>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              Every child is known by name. We celebrate birthdays, listen patiently to pronunciation practice, and encourage character virtues like kindness and respect.
            </p>
          </div>

          <div className="wj-card p-6 sm:p-8 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sunset/15 text-sunset-deep flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg text-ocean-deep font-bold mb-2">Family Cultural Heritage</h3>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              We empower diaspora children to take pride in their Philippine roots &mdash; connecting generations through conversational Tagalog and family culinary traditions.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-sand/40 border border-sand-deep/70">
          <div>
            <h3 className="font-display text-lg font-bold text-ocean-deep">Have questions for Teacher Sharon?</h3>
            <p className="text-xs sm:text-sm text-ink/80 font-medium">Learn how family onboarding and admissions inquiries work.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/inquiry"
              className="wj-btn text-xs sm:text-sm px-5 py-2.5 inline-flex items-center gap-2 shadow-xs"
            >
              <span>Inquiry Information</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
