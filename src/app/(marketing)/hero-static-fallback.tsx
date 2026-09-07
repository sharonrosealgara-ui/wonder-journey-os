import React from "react";

/**
 * Handcrafted SVG static fallback for the Wonder Journey Signature Hero Scene.
 * Rendered during SSR, while WebGL loads, or when WebGL / reduced-motion is active.
 * Depicts the Navigational Astrolabe, Sampaguita blossoms, and Explorer's Journal.
 */
export default function HeroStaticFallback() {
  return (
    <div
      className="relative w-full aspect-square max-w-[540px] 2xl:max-w-[640px] 3xl:max-w-[760px] 4k:max-w-[920px] mx-auto flex items-center justify-center select-none"
      role="img"
      aria-label="Artistic illustration of the Wonder Journey navigational compass, Sampaguita blossoms, and explorer's journal"
    >
      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="compassBgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd23f" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#c9dff2" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#fffdf6" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="brassOuterRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7d070" />
            <stop offset="35%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#997316" />
            <stop offset="100%" stopColor="#e5a917" />
          </linearGradient>

          <linearGradient id="brassInnerRing" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5a917" />
            <stop offset="50%" stopColor="#fff2be" />
            <stop offset="100%" stopColor="#a37812" />
          </linearGradient>

          <linearGradient id="needleNorth" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7a59" />
            <stop offset="100%" stopColor="#e4573b" />
          </linearGradient>

          <linearGradient id="needleSouth" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2fb8ad" />
            <stop offset="100%" stopColor="#14837c" />
          </linearGradient>

          <linearGradient id="parchmentPage" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fdf5e0" />
            <stop offset="50%" stopColor="#fffdf6" />
            <stop offset="100%" stopColor="#f3e8ca" />
          </linearGradient>

          <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a2c1b" />
            <stop offset="100%" stopColor="#2c1a10" />
          </linearGradient>

          <radialGradient id="petalGradient" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="80%" stopColor="#fcf8eb" />
            <stop offset="100%" stopColor="#e9dec1" />
          </radialGradient>
        </defs>

        {/* Ambient Warm Backing Glow */}
        <circle cx="300" cy="300" r="280" fill="url(#compassBgGlow)" />

        {/* Outer Astrolabe Coordinate Tick Ring */}
        <circle
          cx="300"
          cy="280"
          r="190"
          stroke="url(#brassOuterRing)"
          strokeWidth="6"
          strokeDasharray="4 8"
          opacity="0.85"
        />

        {/* Main Burnished Brass Rim */}
        <circle
          cx="300"
          cy="280"
          r="175"
          stroke="url(#brassOuterRing)"
          strokeWidth="14"
          fill="none"
        />
        <circle
          cx="300"
          cy="280"
          r="165"
          stroke="#5a420b"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Inner Coordinate Compass Rose Disc */}
        <circle cx="300" cy="280" r="162" fill="#fffef9" fillOpacity="0.88" />

        {/* Cardinal Latitude Rings (14° North Archipelago Latitude) */}
        <ellipse
          cx="300"
          cy="280"
          rx="140"
          ry="75"
          stroke="url(#brassInnerRing)"
          strokeWidth="2"
          fill="none"
          opacity="0.75"
        />
        <ellipse
          cx="300"
          cy="280"
          rx="110"
          ry="140"
          stroke="url(#brassInnerRing)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          transform="rotate(25 300 280)"
        />

        {/* 8-Point Compass Rose Star */}
        <g transform="translate(300, 280)">
          {/* Diagonal secondary points */}
          <polygon points="0,0 20,-20 0,-110" fill="#c9dff2" opacity="0.9" />
          <polygon points="0,0 -20,-20 0,-110" fill="#a5c6e6" opacity="0.9" />
          <polygon points="0,0 20,20 0,110" fill="#c9dff2" opacity="0.9" />
          <polygon points="0,0 -20,20 0,110" fill="#a5c6e6" opacity="0.9" />
          <polygon points="0,0 20,-20 110,0" fill="#c9dff2" opacity="0.9" />
          <polygon points="0,0 20,20 110,0" fill="#a5c6e6" opacity="0.9" />
          <polygon points="0,0 -20,-20 -110,0" fill="#c9dff2" opacity="0.9" />
          <polygon points="0,0 -20,20 -110,0" fill="#a5c6e6" opacity="0.9" />

          {/* Primary Cardinal Points */}
          <polygon points="0,0 16,-16 0,-140" fill="#ffd23f" />
          <polygon points="0,0 -16,-16 0,-140" fill="#e5a917" />
          <polygon points="0,0 16,16 0,140" fill="#ffd23f" />
          <polygon points="0,0 -16,16 0,140" fill="#e5a917" />
          <polygon points="0,0 16,-16 140,0" fill="#ffd23f" />
          <polygon points="0,0 16,16 140,0" fill="#e5a917" />
          <polygon points="0,0 -16,-16 -140,0" fill="#ffd23f" />
          <polygon points="0,0 -16,16 -140,0" fill="#e5a917" />

          {/* Magnetic Needle (Pointing North) */}
          <g transform="rotate(-18)">
            {/* North Point (Sunset Coral) */}
            <polygon points="0,0 10,-12 0,-148 -10,-12" fill="url(#needleNorth)" />
            {/* South Point (Teak Ocean) */}
            <polygon points="0,0 10,12 0,135 -10,12" fill="url(#needleSouth)" />
            {/* Center Pivot Boss */}
            <circle cx="0" cy="0" r="18" fill="url(#brassOuterRing)" />
            <circle cx="0" cy="0" r="12" fill="#fffdf6" />
            <circle cx="0" cy="0" r="6" fill="#ffd23f" />
          </g>
        </g>

        {/* ── Explorer's Living Book / Field Journal (Lower Left Offset) ── */}
        <g transform="translate(70, 360) rotate(-8)">
          {/* Book Shadow */}
          <rect x="5" y="10" width="180" height="125" rx="10" fill="#14284b" fillOpacity="0.15" />
          {/* Leather Cover */}
          <rect x="0" y="0" width="180" height="120" rx="8" fill="url(#bookCover)" stroke="#744a2c" strokeWidth="2" />
          {/* Left Page (Parchment) */}
          <path d="M12 8 Q85 14 90 14 Q90 106 90 106 Q85 106 12 100 Z" fill="url(#parchmentPage)" stroke="#d9ceb2" strokeWidth="1" />
          {/* Right Page (Parchment) */}
          <path d="M90 14 Q95 14 168 8 Q168 100 90 106 Z" fill="url(#parchmentPage)" stroke="#d9ceb2" strokeWidth="1" />
          {/* Book Spine Center Stitching */}
          <line x1="90" y1="12" x2="90" y2="108" stroke="#a37812" strokeWidth="2" />
          {/* Gold Bookmark Ribbon */}
          <path d="M90 108 Q105 125 110 142 L98 138 L88 144 Q85 125 90 108 Z" fill="#ffd23f" stroke="#e5a917" strokeWidth="1" />
          {/* Subtle Page Text Lines */}
          <line x1="24" y1="28" x2="78" y2="30" stroke="#7a8ba8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="24" y1="42" x2="72" y2="44" stroke="#7a8ba8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="24" y1="56" x2="76" y2="58" stroke="#7a8ba8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="102" y1="28" x2="156" y2="26" stroke="#7a8ba8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="102" y1="42" x2="150" y2="40" stroke="#7a8ba8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="102" y1="56" x2="154" y2="54" stroke="#7a8ba8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* ── Sampaguita Flower Blossoms (Philippine National Flower) ── */}
        {/* Blossom 1 (Foreground Right) */}
        <g transform="translate(460, 380) rotate(15)">
          {/* Shadow */}
          <ellipse cx="0" cy="8" rx="45" ry="30" fill="#14284b" fillOpacity="0.1" />
          {/* 5 Petals */}
          <g>
            {/* Petal 1 (Top) */}
            <path d="M0 0 C-18 -20 -15 -55 0 -62 C15 -55 18 -20 0 0 Z" fill="url(#petalGradient)" stroke="#e4dac1" strokeWidth="1" />
            {/* Petal 2 (Top-Right) */}
            <path d="M0 0 C0 -25 35 -45 54 -32 C58 -10 25 10 0 0 Z" fill="url(#petalGradient)" stroke="#e4dac1" strokeWidth="1" />
            {/* Petal 3 (Bottom-Right) */}
            <path d="M0 0 C15 15 48 30 40 50 C20 55 -5 25 0 0 Z" fill="url(#petalGradient)" stroke="#e4dac1" strokeWidth="1" />
            {/* Petal 4 (Bottom-Left) */}
            <path d="M0 0 C-15 15 -48 30 -40 50 C-20 55 5 25 0 0 Z" fill="url(#petalGradient)" stroke="#e4dac1" strokeWidth="1" />
            {/* Petal 5 (Top-Left) */}
            <path d="M0 0 C0 -25 -35 -45 -54 -32 C-58 -10 -25 10 0 0 Z" fill="url(#petalGradient)" stroke="#e4dac1" strokeWidth="1" />
          </g>
          {/* Golden Flower Center */}
          <circle cx="0" cy="0" r="10" fill="#ffd23f" stroke="#e5a917" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#a37812" />
        </g>

        {/* Blossom 2 (Delicate Bud / Secondary Blossom, Upper Right) */}
        <g transform="translate(440, 150) scale(0.65) rotate(-22)">
          <path d="M0 0 C-16 -18 -12 -48 0 -54 C12 -48 16 -18 0 0 Z" fill="url(#petalGradient)" stroke="#e4dac1" strokeWidth="1" />
          <path d="M0 0 C0 -22 30 -38 48 -28 C50 -8 20 8 0 0 Z" fill="url(#petalGradient)" stroke="#e4dac1" strokeWidth="1" />
          <path d="M0 0 C12 12 40 25 34 42 C16 48 -4 20 0 0 Z" fill="url(#petalGradient)" stroke="#e4dac1" strokeWidth="1" />
          <path d="M0 0 C-12 12 -40 25 -34 42 C-16 48 4 20 0 0 Z" fill="url(#petalGradient)" stroke="#e4dac1" strokeWidth="1" />
          <path d="M0 0 C0 -22 -30 -38 -48 -28 C-50 -8 -20 8 0 0 Z" fill="url(#petalGradient)" stroke="#e4dac1" strokeWidth="1" />
          <circle cx="0" cy="0" r="8" fill="#ffd23f" />
        </g>

        {/* ── Celestial Archipelago Navigation Stars (8-Ray Markers) ── */}
        <g transform="translate(130, 140)">
          <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#ffd23f" />
          <circle cx="0" cy="0" r="2" fill="#fff" />
        </g>
        <g transform="translate(480, 240) scale(0.8)">
          <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#ffd23f" />
          <circle cx="0" cy="0" r="2" fill="#fff" />
        </g>
        <g transform="translate(180, 270) scale(0.6)">
          <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#e5a917" />
        </g>
      </svg>
    </div>
  );
}
