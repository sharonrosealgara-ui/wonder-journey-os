import React from "react";
import Link from "next/link";
import { Heart, Compass, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function TeacherSharonPreview() {
  return (
    <section id="teacher-sharon" className="py-16 sm:py-24 md:py-32 bg-paper border-b border-sand-deep/60 relative overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Founder & Faith Card Container */}
        <div className="max-w-4xl 2xl:max-w-5xl mx-auto">
          <div className="wj-card p-8 sm:p-12 md:p-14 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            
            <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-12 items-center">
              
              {/* Left Column: Avatar & Provenance */}
              <div className="text-center md:text-left">
                <div className="w-32 h-32 2xl:w-36 2xl:h-36 rounded-3xl bg-ocean-deep text-white font-display text-4xl 2xl:text-5xl flex items-center justify-center mx-auto md:mx-0 shadow-md">
                  SA
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold mt-4">
                  Sharon Rose Algara
                </h3>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-mango-deep mt-1 leading-snug">
                  Founder &amp; Lead Teacher
                </p>
                <div className="mt-3 pt-3 border-t border-sand-deep/60 text-xs text-ink/75 font-medium space-y-1">
                  <p>Negros Occidental, Philippines</p>
                  <p>One-to-Few Live Guide</p>
                </div>
              </div>

              {/* Right Column: Narrative & Warm Faith Signal */}
              <div className="space-y-4 text-left">
                
                {/* Gentle Faith Signal Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/60 border border-sand-deep/70 text-ocean-deep text-xs font-mono font-bold">
                  <Heart className="w-3.5 h-3.5 text-mango-deep" />
                  <span>Christ-Rooted &bull; Family-Centered &bull; Learning with Purpose</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl text-ocean-deep font-bold leading-tight">
                  Guided with Heart, Wisdom, and Cultural Pride
                </h2>

                <p className="text-xs sm:text-sm 2xl:text-base text-ink/85 leading-relaxed font-medium">
                  Wonder Journey was born out of a journey of faith and a heartfelt calling to serve diaspora and homeschool families. Raised in the Western Visayas, Teacher Sharon personally crafts every lesson &mdash; weaving living Philippine geography, conversational Tagalog, and Christian character virtues into an intimate learning circle.
                </p>

                <p className="text-xs sm:text-sm text-ink/70 italic border-l-2 border-mango pl-3.5 py-0.5">
                  &ldquo;Every child deserves to know their heritage, speak with joy, and feel valued in a safe, wholesome space.&rdquo;
                </p>

                {/* Direct Action Links to /about and /safety */}
                <div className="pt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-bold">
                  <Link
                    href="/about"
                    className="text-ocean-deep hover:text-ocean transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Meet Teacher Sharon &amp; Our Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-sand-deep">&bull;</span>
                  <Link
                    href="/safety"
                    className="text-ink/75 hover:text-ocean-deep transition-colors inline-flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-palm-deep" />
                    <span>Our Child Safeguards</span>
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
