/**
 * WONDER JOURNEY OS — Visual Foundation Design Tokens (WJ-V1.1)
 *
 * Core design tokens supporting both:
 * - FULL MULTI-PAGE WEBSITE
 * - CINEMATIC 4K LANDING-PAGE COMPOSITIONS
 *
 * Established palette:
 * soft sky blue, warm cream, mango sunlight, ocean teal, deep Filipino green,
 * coral accents, burnished brass, navy ink, natural wood, paper / journal textures.
 */

export const WJ_COLORS = {
  // Watercolor sky
  sky: {
    DEFAULT: "#c9dff2",
    deep: "#a5c6e6",
    light: "#e3effa",
  },
  // Paper & Warm Cream
  sand: {
    DEFAULT: "#fdf5e0",
    deep: "#c9d9ee",
    card: "#fffdf9",
  },
  paper: {
    DEFAULT: "#fffdf6",
    pure: "#ffffff",
  },
  // Sunshine brush-stroke yellow
  mango: {
    DEFAULT: "#ffd23f",
    deep: "#e5a917",
    light: "#ffefa8",
  },
  // Coral & Sunset (Primary action & warm accents)
  coral: {
    DEFAULT: "#ff6f59",
    deep: "#e2503d",
    light: "#ffa192",
  },
  sunset: {
    DEFAULT: "#ff7a59",
    deep: "#e4573b",
  },
  // Ocean Teal (Dots, exploration, maritime cues)
  ocean: {
    DEFAULT: "#2fb8ad",
    deep: "#14837c",
    light: "#6de2d9",
  },
  // Palm & Deep Filipino Green (Living flora & rainforest depth)
  palm: {
    DEFAULT: "#4dbd85",
    deep: "#2e9563",
  },
  filipinoGreen: {
    DEFAULT: "#1b4332",
    deep: "#0f281e",
    light: "#2d6a4f",
  },
  // Burnished Brass (Astrolabe, celestial compass, metallic accents)
  brass: {
    DEFAULT: "#c59b27",
    deep: "#8c6b1b",
    light: "#e6be58",
  },
  // Natural Wood (Field kit, binding desk, warm earth)
  wood: {
    DEFAULT: "#8a5a36",
    deep: "#54361e",
    light: "#c49a6c",
  },
  // Aged Parchment (Historic lithographs & field journal leaves)
  parchment: {
    DEFAULT: "#f7f1e1",
    aged: "#eee3cb",
    border: "#dfcfb0",
  },
  // Navy Ink (Headings, typography, archival text)
  ink: {
    DEFAULT: "#274472",
    soft: "#5d76a3",
    deep: "#14243b",
  },
  // Cultural accent notes
  hibiscus: {
    DEFAULT: "#ec5d87",
    deep: "#cf3e6b",
  },
  ube: {
    DEFAULT: "#8890d6",
    deep: "#656fc0",
  },
} as const;

export const WJ_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
  "4k": 2560,
} as const;

export const WJ_SCENE_WIDTHS = {
  standard: "max-w-7xl", // 1280px
  wide: "2xl:max-w-[1600px]",
  ultrawide: "3xl:max-w-[1920px]",
  "4k": "4k:max-w-[2800px]",
  readingMeasure: "max-w-[65ch]",
} as const;

export const WJ_SHADOWS = {
  soft: "0 4px 18px rgba(39, 68, 114, 0.14)",
  lift: "0 10px 30px rgba(39, 68, 114, 0.22)",
  tactile: "0 1px 2px rgba(44, 27, 24, 0.08), 0 4px 10px rgba(44, 27, 24, 0.1), 0 12px 28px rgba(44, 27, 24, 0.12)",
  archival: "0 2px 4px rgba(44, 27, 24, 0.06), 0 8px 24px rgba(44, 27, 24, 0.12)",
} as const;

export const WJ_TYPOGRAPHY = {
  fonts: {
    display: '"Lilita One", "Baloo 2", "Segoe UI", sans-serif',
    body: '"Quicksand", "Nunito", "Segoe UI", sans-serif',
    hand: '"Patrick Hand", "Comic Sans MS", "Segoe Print", cursive',
    botanical: '"Georgia", "Baskerville", "Times New Roman", serif',
    archival: '"Courier New", "Consolas", monospace',
  },
  clamp: {
    heroHeading: "clamp(2.25rem, 1.5rem + 4vw, 5.5rem)",
    sectionHeading: "clamp(1.75rem, 1.25rem + 2.5vw, 3.75rem)",
    deckLead: "clamp(1.125rem, 1rem + 0.8vw, 1.75rem)",
    body: "clamp(1rem, 0.95rem + 0.3vw, 1.25rem)",
    caption: "clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)",
  },
} as const;
