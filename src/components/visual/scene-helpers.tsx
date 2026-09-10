import React from "react";

interface SceneBackdropProps {
  variant?: "sky-morning" | "ocean-voyage" | "golden-sunset" | "parchment-archive";
  showArchipelagoHorizon?: boolean;
  showCelestialStars?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * SceneBackdrop Component (WJ-V1.1)
 *
 * Full-width environmental backdrop designed natively for up to 4K Ultra-HD (3840×2160):
 * - Atmospheric sky/ocean/sunset gradients
 * - Soft celestial navigational star cues
 * - Gentle horizon haze
 * - Zero pixelation or stretched raster artifacts
 */
export function SceneBackdrop({
  variant = "sky-morning",
  showArchipelagoHorizon = true,
  showCelestialStars = true,
  className = "",
  children,
}: SceneBackdropProps) {
  const gradientClass =
    variant === "sky-morning"
      ? "from-sky via-paper to-sand/40"
      : variant === "ocean-voyage"
      ? "from-sky-deep via-ocean/10 to-paper"
      : variant === "golden-sunset"
      ? "from-mango/20 via-coral/10 to-sand/50"
      : "from-[#f7f1e1] via-sand to-[#eee3cb]/60";

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-b ${gradientClass} ${className}`}
    >
      {/* 4K Environmental Atmospheric Glows */}
      <div
        className="absolute -top-40 -right-40 w-[600px] 2xl:w-[900px] 4k:w-[1400px] h-[600px] 2xl:h-[900px] 4k:h-[1400px] opacity-20 pointer-events-none -z-0 blur-3xl bg-gradient-to-bl from-sky-deep via-ocean to-transparent rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -left-40 w-[500px] 2xl:w-[800px] 4k:w-[1200px] h-[500px] 2xl:h-[800px] 4k:h-[1200px] opacity-15 pointer-events-none -z-0 blur-3xl bg-gradient-to-tr from-mango via-sand to-transparent rounded-full"
        aria-hidden="true"
      />

      {/* Subtle Archipelago Horizon Silhouette (Vector, non-distorting) */}
      {showArchipelagoHorizon && (
        <div
          className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 4k:h-36 opacity-10 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full text-ocean-deep"
          >
            <path
              d="M0,80 Q180,40 360,70 T720,50 T1080,75 T1440,60 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}

      {/* Navigational Constellation Dots */}
      {showCelestialStars && (
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          aria-hidden="true"
        >
          <div className="absolute top-[12%] left-[18%] w-1.5 h-1.5 rounded-full bg-brass" />
          <div className="absolute top-[22%] left-[34%] w-1 h-1 rounded-full bg-ocean" />
          <div className="absolute top-[15%] right-[25%] w-2 h-2 rounded-full bg-mango" />
          <div className="absolute top-[30%] right-[15%] w-1 h-1 rounded-full bg-brass" />
          <div className="absolute top-[45%] left-[8%] w-1.5 h-1.5 rounded-full bg-sand-deep" />
        </div>
      )}

      {/* Relative Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface FluidMeasureProps {
  as?: React.ElementType;
  maxMeasure?: "prose" | "wide" | "narrow";
  align?: "left" | "center";
  className?: string;
  children: React.ReactNode;
}

const MEASURE_CLASSES = {
  narrow: "max-w-[50ch]",
  prose: "max-w-[65ch]",
  wide: "max-w-[78ch]",
};

/**
 * FluidMeasure Component
 *
 * Enforces editorial reading length (max 65ch) on ultra-wide / 4K displays
 * to prevent wide unreadable paragraphs.
 */
export function FluidMeasure({
  as: Component = "div",
  maxMeasure = "prose",
  align = "left",
  className = "",
  children,
}: FluidMeasureProps) {
  const measureClass = MEASURE_CLASSES[maxMeasure];
  const alignClass = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <Component className={`w-full ${measureClass} ${alignClass} ${className}`}>
      {children}
    </Component>
  );
}
