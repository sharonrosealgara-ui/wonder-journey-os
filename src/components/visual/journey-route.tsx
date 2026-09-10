import React from "react";

export type RouteOrientation = "horizontal" | "vertical" | "curved";
export type RouteTheme = "brass" | "mango" | "ocean" | "ink";

export interface Waypoint {
  id: string;
  label: string;
  coordinate?: string;
  isCompleted?: boolean;
}

interface MaritimeRouteProps {
  orientation?: RouteOrientation;
  theme?: RouteTheme;
  waypoints?: Waypoint[];
  className?: string;
  animated?: boolean;
}

const THEME_COLORS: Record<RouteTheme, { line: string; point: string; text: string }> = {
  brass: {
    line: "#c59b27",
    point: "#8c6b1b",
    text: "text-[#8c6b1b]",
  },
  mango: {
    line: "#e5a917",
    point: "#ffd23f",
    text: "text-mango-deep",
  },
  ocean: {
    line: "#2fb8ad",
    point: "#14837c",
    text: "text-ocean-deep",
  },
  ink: {
    line: "#5d76a3",
    point: "#274472",
    text: "text-ink",
  },
};

/**
 * MaritimeRoute Primitive (WJ-V1.1)
 *
 * Archipelago maritime route lines connecting lessons, island expeditions,
 * and journal milestones with nautical rhumb lines and coordinates.
 *
 * Fully respects prefers-reduced-motion.
 */
export function MaritimeRoute({
  orientation = "horizontal",
  theme = "brass",
  waypoints = [
    { id: "1", label: "Luzon", coordinate: "14°N" },
    { id: "2", label: "Visayas", coordinate: "10°N" },
    { id: "3", label: "Mindanao", coordinate: "7°N" },
  ],
  className = "",
  animated = false,
}: MaritimeRouteProps) {
  const colors = THEME_COLORS[theme];

  if (orientation === "horizontal") {
    return (
      <div className={`relative w-full py-4 ${className}`}>
        {/* SVG Route Line */}
        <div className="relative flex items-center justify-between w-full">
          {/* Background dashed line */}
          <div
            className={`absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 border-t-2 border-dashed ${animated ? "motion-safe:animate-pulse" : ""}`}
            style={{ borderColor: colors.line }}
            aria-hidden="true"
          />

          {/* Waypoints along route */}
          {waypoints.map((wp, idx) => (
            <div
              key={wp.id || idx}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Nautical compass ring */}
              <div
                className="w-7 h-7 rounded-full bg-paper border-2 flex items-center justify-center shadow-xs transition-transform duration-200 motion-reduce:transform-none group-hover:scale-110"
                style={{ borderColor: colors.point }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colors.point }}
                />
              </div>

              {/* Waypoint label & coordinates */}
              <div className="mt-2 flex flex-col items-center">
                <span className={`text-xs font-bold ${colors.text} tracking-wide`}>
                  {wp.label}
                </span>
                {wp.coordinate && (
                  <span className="text-[10px] font-mono text-ink-soft">
                    {wp.coordinate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orientation === "vertical") {
    return (
      <div className={`relative flex flex-col gap-6 py-2 pl-4 ${className}`}>
        {/* Vertical line */}
        <div
          className="absolute left-7 top-4 bottom-4 w-0.5 border-l-2 border-dashed"
          style={{ borderColor: colors.line }}
          aria-hidden="true"
        />

        {waypoints.map((wp, idx) => (
          <div key={wp.id || idx} className="relative z-10 flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full bg-paper border-2 flex items-center justify-center shrink-0 shadow-xs"
              style={{ borderColor: colors.point }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.point }}
              />
            </div>
            <div>
              <p className={`text-xs sm:text-sm font-bold ${colors.text}`}>
                {wp.label}
              </p>
              {wp.coordinate && (
                <p className="text-[10px] font-mono text-ink-soft">
                  {wp.coordinate}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Curved maritime track
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 600 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <path
          d="M 10 40 Q 150 10 300 40 T 590 40"
          stroke={colors.line}
          strokeWidth="2.5"
          strokeDasharray="8 6"
          fill="none"
        />
        {/* Navigation Points */}
        <circle cx="10" cy="40" r="5" fill={colors.point} />
        <circle cx="300" cy="40" r="6" fill={colors.point} />
        <circle cx="590" cy="40" r="5" fill={colors.point} />
      </svg>
    </div>
  );
}
