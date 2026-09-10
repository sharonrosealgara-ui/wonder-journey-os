import React from "react";

export type WashiColor = "mango" | "ocean" | "sand" | "coral" | "palm" | "brass";
export type WashiPosition = "top-center" | "top-left" | "top-right" | "bottom-right";

const WASHI_COLORS: Record<WashiColor, string> = {
  mango: "bg-[#ffd23f]/50 border-white/60",
  ocean: "bg-[#2fb8ad]/40 border-white/60",
  sand: "bg-[#fdf5e0]/60 border-white/70",
  coral: "bg-[#ff6f59]/45 border-white/60",
  palm: "bg-[#4dbd85]/40 border-white/60",
  brass: "bg-[#c59b27]/45 border-white/60",
};

const WASHI_POSITIONS: Record<WashiPosition, string> = {
  "top-center": "-top-3.5 left-1/2 -translate-x-1/2 rotate-[-1deg]",
  "top-left": "-top-3 -left-2 rotate-[-12deg]",
  "top-right": "-top-3 -right-2 rotate-[12deg]",
  "bottom-right": "-bottom-3 -right-2 rotate-[-8deg]",
};

/**
 * WashiTapeStrip Component
 * Semi-transparent decorative tape with dashed torn edge details.
 */
export function WashiTapeStrip({
  color = "mango",
  position = "top-center",
  className = "",
}: {
  color?: WashiColor;
  position?: WashiPosition;
  className?: string;
}) {
  const colorClass = WASHI_COLORS[color];
  const positionClass = WASHI_POSITIONS[position];

  return (
    <div
      className={`absolute z-20 h-5 w-24 backdrop-blur-[1.5px] shadow-xs border-l-2 border-r-2 border-dashed ${colorClass} ${positionClass} ${className}`}
      aria-hidden="true"
    />
  );
}

interface PolaroidFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  caption?: string;
  subcaption?: string;
  washiTape?: boolean;
  washiColor?: WashiColor;
  washiPosition?: WashiPosition;
  tilt?: "left" | "right" | "none";
  children: React.ReactNode;
  className?: string;
}

/**
 * PolaroidFrame Component
 * Authentic physical photo keepsake frame with handwritten caption area.
 */
export function PolaroidFrame({
  caption,
  subcaption,
  washiTape = true,
  washiColor = "mango",
  washiPosition = "top-center",
  tilt = "none",
  children,
  className = "",
  ...props
}: PolaroidFrameProps) {
  const tiltClass =
    tilt === "left"
      ? "rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300"
      : tilt === "right"
      ? "rotate-[1.5deg] hover:rotate-0 transition-transform duration-300"
      : "";

  return (
    <div
      className={`relative inline-block bg-white p-3 sm:p-4 pb-5 sm:pb-6 rounded-md shadow-[0_4px_16px_rgba(39,68,114,0.12),0_1px_4px_rgba(44,27,24,0.08)] border border-ink/10 ${tiltClass} ${className}`}
      {...props}
    >
      {washiTape && (
        <WashiTapeStrip color={washiColor} position={washiPosition} />
      )}

      {/* Visual media container */}
      <div className="relative overflow-hidden rounded-xs bg-sand/30">
        {children}
      </div>

      {/* Handwritten caption space */}
      {(caption || subcaption) && (
        <div className="mt-3 text-center px-1">
          {caption && (
            <p className="font-hand text-sm sm:text-base text-ink font-bold tracking-wide">
              {caption}
            </p>
          )}
          {subcaption && (
            <p className="text-[11px] text-ink-soft font-medium">
              {subcaption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface ArchivalMatteFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  catalogueNumber?: string;
  sourceTitle?: string;
  provenance?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * ArchivalMatteFrame Component
 * Museum-grade double-bordered archival matte frame for historical primary sources.
 */
export function ArchivalMatteFrame({
  catalogueNumber,
  sourceTitle,
  provenance,
  children,
  className = "",
  ...props
}: ArchivalMatteFrameProps) {
  return (
    <div
      className={`wj-archival-matte p-4 sm:p-6 rounded-lg text-ink ${className}`}
      {...props}
    >
      {/* Media container */}
      <div className="relative overflow-hidden rounded-xs border border-ink/20 shadow-inner bg-sand/40">
        {children}
      </div>

      {/* Archival catalogue footer */}
      {(catalogueNumber || sourceTitle || provenance) && (
        <div className="mt-3.5 pt-2.5 border-t border-brass/30 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {catalogueNumber && (
              <span className="wj-archival-label px-2 py-0.5 rounded-xs bg-white/70 border border-sand-deep font-mono">
                {catalogueNumber}
              </span>
            )}
            {sourceTitle && (
              <span className="font-botanical text-xs sm:text-sm font-semibold text-ocean-deep">
                {sourceTitle}
              </span>
            )}
          </div>
          {provenance && (
            <span className="text-[11px] text-ink-soft font-medium">
              {provenance}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * PostmarkStamp Component
 * Handcrafted vector postmark cancellation mark with authentic ink feel.
 */
export function PostmarkStamp({
  location = "MANILA 14°N",
  date = "ARCHIPELAGO",
  rotation = "-6deg",
  className = "",
}: {
  location?: string;
  date?: string;
  rotation?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 pointer-events-none select-none opacity-85 ${className}`}
      style={{ transform: `rotate(${rotation})` }}
      aria-hidden="true"
    >
      {/* Circular postmark */}
      <div className="w-14 h-14 rounded-full border-2 border-dashed border-ink/50 flex flex-col items-center justify-center text-center p-1 text-ink/75 leading-tight">
        <span className="text-[9px] font-mono font-bold tracking-wider uppercase">
          {location}
        </span>
        <span className="text-[7px] font-mono tracking-widest text-ink/60 mt-0.5">
          {date}
        </span>
      </div>

      {/* Wavy cancellation lines */}
      <svg
        width="38"
        height="22"
        viewBox="0 0 40 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-ink/45"
      >
        <path
          d="M0 6C5 2 10 2 15 6C20 10 25 10 30 6C35 2 40 2 40 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M0 12C5 8 10 8 15 12C20 16 25 16 30 12C35 8 40 8 40 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M0 18C5 14 10 14 15 18C20 22 25 22 30 18C35 14 40 14 40 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
