import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Compass, Clock, Users, ShieldCheck, CheckCircle2 } from "lucide-react";
import { isInquiryFormEnabled } from "@/lib/inquiry-config";
import InquiryForm from "../inquiry-form";

export const metadata: Metadata = {
  title: "Family Inquiry & Admissions | Wonder Journey",
  description:
    "Inquire about Wonder Journey cohort placement, term schedules, and family onboarding directly with Teacher Sharon.",
};

export default function InquiryPage() {
  const formEnabled = isInquiryFormEnabled();

  return (
    <div className="py-12 sm:py-16 md:py-24 bg-paper min-h-screen">
      <div className="max-w-4xl 2xl:max-w-5xl 4k:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sand-deep/40 border border-sand-deep/80 text-ocean-deep text-xs sm:text-sm font-bold tracking-wide mb-4">
            <Mail className="w-3.5 h-3.5 text-ocean-deep" aria-hidden="true" />
            <span>Admissions &amp; Family Placement</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-ocean-deep font-bold leading-tight">
            Family Inquiry &amp; Direct Dialogue
          </h1>
          <p className="text-base sm:text-xl text-ink font-semibold mt-4 leading-relaxed">
            Wonder Journey operates on an intimate cohort rhythm. Every new family is personally welcomed and onboarded by Teacher Sharon.
          </p>
        </div>

        {/* Admissions Rhythm Context Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12 sm:mb-16">
          <div className="p-6 rounded-2xl bg-white border-2 border-sand-deep/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-ocean/15 text-ocean-deep flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-ocean-deep mb-1.5">
              Intimate Cohort Sizing
            </h3>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              We preserve low teacher-to-learner ratios so every child is actively engaged and heard in each live session.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border-2 border-sand-deep/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-mango/20 text-ocean-deep flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-ocean-deep mb-1.5">
              Term Rhythm
            </h3>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              Expeditions run across multi-week stages. New family placements occur ahead of each regional term kickoff.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border-2 border-sand-deep/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-palm/20 text-palm-deep flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display text-base font-bold text-ocean-deep mb-1.5">
              Parent-First Alignment
            </h3>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              We ensure our Christ-centered, living curriculum approach aligns warmly with your family&apos;s educational goals.
            </p>
          </div>
        </div>

        {/* Inquiry Form or Waitlist Notice */}
        <div className="wj-card p-8 sm:p-12 bg-white border-2 border-sand-deep/80 rounded-3xl shadow-sm mb-16 sm:mb-24">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand text-ink/75 font-mono text-xs font-bold mb-3">
              <Compass className="w-3.5 h-3.5 text-ocean-deep" aria-hidden="true" />
              <span>Direct Inquiries</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-ocean-deep font-bold mb-2">
              Send an Inquiry to Teacher Sharon
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              Share details about your child&apos;s age, timezone, and your family&apos;s interest in Philippine heritage learning.
            </p>
          </div>

          {formEnabled ? (
            <div className="max-w-2xl mx-auto">
              <InquiryForm />
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-2xl bg-sand/30 border border-sand-deep/70 max-w-xl mx-auto text-center">
              <p className="text-sm font-semibold text-ocean-deep mb-2">
                Admissions are Currently Focused on Active Cohorts
              </p>
              <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
                Direct inquiry submissions open prior to upcoming term placements. Existing enrolled families may access their portals anytime via the family login.
              </p>
              <div className="mt-5">
                <Link
                  href="/login"
                  className="wj-btn text-xs sm:text-sm px-5 py-2.5 inline-block shadow-xs"
                >
                  Existing Family Portal Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Preview */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h3 className="font-display text-xl text-ocean-deep font-bold text-center mb-6">
            Frequently Asked Questions
          </h3>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-sand-deep/80">
            <h4 className="font-display text-base text-ocean-deep font-bold mb-1.5">
              What ages is Wonder Journey designed for?
            </h4>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              Wonder Journey is crafted for elementary and middle school learners (approx. ages 6–12), with activities and discussions thoughtfully adapted for mixed-age family participation.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-sand-deep/80">
            <h4 className="font-display text-base text-ocean-deep font-bold mb-1.5">
              Do children need prior Tagalog knowledge?
            </h4>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              No prior language background is required. Wonder Journey introduces conversational vocabulary gently through living stories, songs, and context-rich repetition.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-sand-deep/80">
            <h4 className="font-display text-base text-ocean-deep font-bold mb-1.5">
              How are international timezones accommodated?
            </h4>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
              We offer session blocks suited for North American morning/afternoon schedules, European timezones, and Asia-Pacific families.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
