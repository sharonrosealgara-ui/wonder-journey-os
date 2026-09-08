import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, Heart, ArrowRight, CheckCircle2, UserCheck, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Child Safety & Privacy Safeguards | Wonder Journey",
  description:
    "Learn about Wonder Journey's child safety and family privacy protections: verified small cohorts, zero public minor media, authenticated family workspaces, and parent-first transparency.",
};

export default function SafetyPage() {
  return (
    <div className="py-12 sm:py-16 md:py-24 bg-paper min-h-screen">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-deep/40 border border-sand-deep/80 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-ocean-deep" aria-hidden="true" />
            <span>Child Safety &amp; Family Privacy</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl text-ocean-deep font-bold leading-tight">
            Our Child Safeguarding &amp; Privacy Commitments
          </h1>
          <p className="text-base sm:text-xl 2xl:text-2xl text-ink font-semibold mt-4 leading-relaxed">
            Wonder Journey was designed from the ground up to protect children, respect parental authority, and guard family privacy in every session.
          </p>
        </div>

        {/* 4 Core Safeguards */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 mb-16 sm:mb-24">
          
          {/* Safeguard 1: Zero Public Minor Media */}
          <div className="wj-card p-8 sm:p-10 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-ocean/15 text-ocean-deep flex items-center justify-center mb-6">
              <Eye className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold mb-3">
              1. Zero Public Minor Media
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium mb-5">
              We never broadcast children&apos;s real faces, voices, or full names for public marketing. All public marketing representations of learners use privacy-safe illustrated representations only.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-ink/80 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-mango-deep shrink-0 mt-0.5" />
                <span>No livestreaming of classrooms to social media or public feeds</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-mango-deep shrink-0 mt-0.5" />
                <span>Learner video streams are visible solely to verified cohort members during live class</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-mango-deep shrink-0 mt-0.5" />
                <span>Learner work and audio keepsakes are stored only within private family portals</span>
              </li>
            </ul>
          </div>

          {/* Safeguard 2: Direct Teacher Sharon Oversight */}
          <div className="wj-card p-8 sm:p-10 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-6">
              <UserCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold mb-3">
              2. Intimate Cohorts &amp; Direct Teacher Care
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium mb-5">
              Wonder Journey is not an open marketplace of unvetted tutors. Every session is directly prepared, hosted, and supervised by Teacher Sharon in a small group setting.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-ink/80 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-mango-deep shrink-0 mt-0.5" />
                <span>Every participating learner and family is personally onboarded by Sharon</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-mango-deep shrink-0 mt-0.5" />
                <span>Small cohort sizing ensures constant teacher attention and guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-mango-deep shrink-0 mt-0.5" />
                <span>Direct parent-teacher communication channel for questions and concerns</span>
              </li>
            </ul>
          </div>

          {/* Safeguard 3: Walled Family Space */}
          <div className="wj-card p-8 sm:p-10 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-palm/20 text-palm-deep flex items-center justify-center mb-6">
              <Lock className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold mb-3">
              3. Authenticated Family Workspace
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium mb-5">
              Enrolled family data, attendance histories, passport stamps, and keepsake recordings are guarded behind individual family authentication with strict database-level row security.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-ink/80 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-palm-deep shrink-0 mt-0.5" />
                <span>Each family can only view their own enrolled learner records and keepsakes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-palm-deep shrink-0 mt-0.5" />
                <span>Protected routes enforce real-time session verification before allowing access</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-palm-deep shrink-0 mt-0.5" />
                <span>No sharing or selling of family contact details to third parties</span>
              </li>
            </ul>
          </div>

          {/* Safeguard 4: Wholesome & Ad-Free */}
          <div className="wj-card p-8 sm:p-10 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sunset/15 text-sunset-deep flex items-center justify-center mb-6">
              <Heart className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-ocean-deep font-bold mb-3">
              4. Wholesome &amp; Ad-Free Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium mb-5">
              Wonder Journey contains zero commercial advertising, zero behavioral tracking pixels, and zero algorithmic attention loops designed to keep children glued to screens.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-ink/80 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sunset-deep shrink-0 mt-0.5" />
                <span>Structured 50-minute sessions that encourage real-world cooking, drawing, and reflection</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sunset-deep shrink-0 mt-0.5" />
                <span>Curated living curriculum free from inappropriate content or algorithmic feeds</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sunset-deep shrink-0 mt-0.5" />
                <span>Full transparency on learning materials provided to parents in advance</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Parental Reporting & Inquiries */}
        <div className="wj-card p-8 sm:p-10 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm max-w-4xl mx-auto mb-16 sm:mb-24">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-ocean/10 text-ocean-deep shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-ocean-deep mb-2">
                Guardian Oversight &amp; Inquiries
              </h3>
              <p className="text-xs sm:text-sm text-ink/85 leading-relaxed font-medium">
                Parents are always welcome to observe class sessions, review upcoming lesson materials, or reach out to Teacher Sharon directly with any questions regarding learning pace, accommodations, or family privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-sand/40 border border-sand-deep/70">
          <div>
            <h3 className="font-display text-lg font-bold text-ocean-deep">Have specific questions about our safeguards?</h3>
            <p className="text-xs sm:text-sm text-ink/80 font-medium">Get in touch with Teacher Sharon through our family inquiry channel.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/inquiry"
              className="wj-btn text-xs sm:text-sm px-5 py-2.5 inline-flex items-center gap-2 shadow-xs"
            >
              <span>Family Inquiry</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
