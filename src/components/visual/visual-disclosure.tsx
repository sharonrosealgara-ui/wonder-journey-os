import React from "react";
import { ShieldCheck, Lock, BookOpen } from "lucide-react";

interface ProvenanceTagProps {
  sourceName: string;
  sourceYear?: string;
  institution?: string;
  classification?: "Botanical Lithograph" | "Historical Cartography" | "Archival Document" | "Living Tradition";
  className?: string;
}

/**
 * ProvenanceTag Component (WJ-V1.1)
 *
 * Dignified archival provenance tag for authentic historical primary sources.
 * Rejects synthetic/AI history; establishes verifiable institutional lineage.
 */
export function ProvenanceTag({
  sourceName,
  sourceYear,
  institution,
  classification = "Historical Primary Source" as any,
  className = "",
}: ProvenanceTagProps) {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-md bg-sand/70 border border-parchment-border text-xs text-ink ${className}`}
    >
      <div className="flex items-center gap-1.5 font-bold text-ocean-deep">
        <BookOpen className="w-3.5 h-3.5 text-brass-deep shrink-0" aria-hidden="true" />
        <span className="wj-archival-label text-[10px] text-brass-deep font-mono">
          {classification}
        </span>
      </div>
      <span className="text-sand-deep">•</span>
      <span className="font-semibold text-ink">
        {sourceName}
        {sourceYear ? ` (${sourceYear})` : ""}
      </span>
      {institution && (
        <>
          <span className="text-sand-deep">•</span>
          <span className="text-ink-soft text-[11px] font-medium italic">
            {institution}
          </span>
        </>
      )}
    </div>
  );
}

interface LearnerPrivacyShieldProps {
  text?: string;
  className?: string;
  variant?: "badge" | "callout" | "inline";
}

/**
 * LearnerPrivacyShield Component (WJ-V1.1)
 *
 * Required child safeguarding invariant:
 * "Learner visuals are illustrated/anonymized representations used to protect
 * children's identities. The classroom experience shown is based on a real Wonder Journey session."
 */
export function LearnerPrivacyShield({
  text = "Learner visuals are illustrated/anonymized representations used to protect children's identities. The classroom experience shown is based on a real Wonder Journey session.",
  className = "",
  variant = "callout",
}: LearnerPrivacyShieldProps) {
  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/80 border border-sand-deep/80 text-[11px] font-semibold text-ink/90 shadow-2xs ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-palm-deep shrink-0" aria-hidden="true" />
        <span>Child Privacy Protected • Illustrated Representation</span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <p className={`text-xs text-ink/75 font-medium leading-relaxed flex items-start gap-2 ${className}`}>
        <ShieldCheck className="w-4 h-4 text-palm-deep shrink-0 mt-0.5" aria-hidden="true" />
        <span>{text}</span>
      </p>
    );
  }

  // Default: callout container
  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl bg-sand/60 border border-sand-deep/80 text-xs sm:text-sm font-medium text-ink/85 flex items-start gap-3 ${className}`}
      role="note"
      aria-label="Child privacy safeguarding statement"
    >
      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-palm-deep shrink-0 mt-0.5" aria-hidden="true" />
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}

interface ParentAuthorizationNoticeProps {
  sender?: string;
  statusText?: string;
  className?: string;
}

/**
 * ParentAuthorizationNotice Component (WJ-V1.1)
 *
 * Preserves strict editorial privacy: prevents unauthorized publishing of parent
 * messages or personal details. Displays dignified editorial gate notice.
 */
export function ParentAuthorizationNotice({
  sender = "Parent Reflection",
  statusText = "PENDING EXPLICIT SENDER AUTHORIZATION FOR PUBLIC USE",
  className = "",
}: ParentAuthorizationNoticeProps) {
  return (
    <div
      className={`p-4 rounded-2xl bg-sand/50 border border-sand-deep/90 text-center flex flex-col items-center gap-2 ${className}`}
    >
      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-deep">
        <Lock className="w-3.5 h-3.5 text-ocean-deep shrink-0" aria-hidden="true" />
        <span>Private Editorial Placeholder</span>
      </div>
      <p className="text-[11px] font-mono tracking-wider text-ink-soft uppercase font-bold">
        {statusText}
      </p>
      <p className="text-xs text-ink/70 max-w-md mx-auto">
        Wonder Journey honors family correspondence with absolute privacy. Testimonials and reflections are only presented with affirmative, written sender permission.
      </p>
    </div>
  );
}
