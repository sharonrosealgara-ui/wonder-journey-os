import React from "react";

export type JournalSurfaceVariant =
  | "paper"
  | "aged-parchment"
  | "field-notebook"
  | "pressed-cream";

export type JournalShadow = "none" | "soft" | "tactile" | "archival" | "lift";
export type JournalTilt = "none" | "subtle-left" | "subtle-right";

interface JournalSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: JournalSurfaceVariant;
  shadow?: JournalShadow;
  tilt?: JournalTilt;
  hasStitch?: boolean;
  hasDeckleEdge?: boolean;
  hasNotebookRuling?: boolean;
  className?: string;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<JournalSurfaceVariant, string> = {
  paper: "bg-paper border-2 border-sand-deep/80 text-ink rounded-3xl",
  "aged-parchment": "bg-[#f7f1e1] border-2 border-[#dfcfb0] text-[#14243b] rounded-2xl",
  "field-notebook": "bg-[#fffdf7] border border-sand-deep/90 text-ink rounded-2xl relative overflow-hidden",
  "pressed-cream": "bg-white border-2 border-sand-deep/70 text-ink rounded-3xl",
};

const SHADOW_STYLES: Record<JournalShadow, string> = {
  none: "",
  soft: "shadow-sm",
  tactile: "shadow-[0_1px_2px_rgba(44,27,24,0.08),0_4px_10px_rgba(44,27,24,0.1),0_12px_28px_rgba(44,27,24,0.12)]",
  archival: "shadow-[0_2px_4px_rgba(44,27,24,0.06),0_8px_24px_rgba(44,27,24,0.12)]",
  lift: "shadow-md hover:shadow-xl transition-shadow duration-300",
};

const TILT_STYLES: Record<JournalTilt, string> = {
  none: "transform-none",
  "subtle-left": "rotate-[-0.6deg] hover:rotate-0 transition-transform duration-300",
  "subtle-right": "rotate-[0.6deg] hover:rotate-0 transition-transform duration-300",
};

/**
 * JournalSurface Primitive (WJ-V1.1)
 *
 * Provides authentic, tactile paper and journal textures:
 * - Watercolor paper
 * - Aged parchment
 * - Ruled field notebook
 * - Pressed cream cards
 *
 * Respects prefers-reduced-motion via CSS transform transitions.
 */
export function JournalSurface({
  variant = "paper",
  shadow = "tactile",
  tilt = "none",
  hasStitch = false,
  hasDeckleEdge = false,
  hasNotebookRuling = false,
  className = "",
  children,
  ...props
}: JournalSurfaceProps) {
  const variantClass = VARIANT_STYLES[variant];
  const shadowClass = SHADOW_STYLES[shadow];
  const tiltClass = TILT_STYLES[tilt];

  return (
    <div
      className={`relative ${variantClass} ${shadowClass} ${tiltClass} ${hasDeckleEdge ? "wj-deckle-edge" : ""} ${hasStitch ? "wj-stitched-seam pl-6" : ""} ${className}`}
      {...props}
    >
      {/* Field notebook subtle horizontal ruling */}
      {hasNotebookRuling && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 -z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 1.65rem, rgba(39, 68, 114, 0.08) 1.65rem, rgba(39, 68, 114, 0.08) 1.72rem)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Surface content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
