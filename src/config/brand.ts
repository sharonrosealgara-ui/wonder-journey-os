// ─────────────────────────────────────────────────────────────
// BRAND CONFIGURATION — the white-label seam.
// To rebrand for a new client or learning world, edit this file
// (and the color tokens in src/app/globals.css @theme).
// ─────────────────────────────────────────────────────────────

// Canonical site URL for SEO/sitemap/OG tags. Works under ANY domain:
// set NEXT_PUBLIC_SITE_URL per deployment (Vercel env var) — never hardcoded.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://wonderjourneyacademy.com";

export const brand = {
  productName: "Wonder Journey OS",
  worldName: "Discover the Philippines",
  worldSubtitle: "Discover the Philippines: A Family Learning Adventure",
  tagline: "Every lesson is an adventure. Every adventure becomes a memory.",
  logoEmoji: "🌺",
  heroEmojis: "🌺🏝️🥭",
  footer: "🌴 Every lesson is an adventure. Every adventure becomes a memory. 🌴",
};
