import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * Dimensional Icon System for Wonder Journey
 *
 * Custom multi-layered SVG icons featuring:
 * - Brand-tailored gradients (Sunset, Mango, Ocean, Palm, Ube)
 * - Gentle specular highlights
 * - Restrained drop shadows and inner dimensional contours
 * - Prefers-reduced-motion safety
 */

export function LanguageIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 motion-reduce:transform-none hover:scale-105 hover:-translate-y-0.5 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="langGrad1" x1="6" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7A59" />
          <stop offset="0.6" stopColor="#E4573B" />
          <stop offset="1" stopColor="#CF3E6B" />
        </linearGradient>
        <linearGradient id="langGrad2" x1="14" y1="12" x2="42" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD23F" />
          <stop offset="1" stopColor="#E5A917" />
        </linearGradient>
        <filter id="langShadow" x="2" y="4" width="44" height="42" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#274472" floodOpacity="0.18" />
        </filter>
      </defs>
      <g filter="url(#langShadow)">
        {/* Secondary speech bubble (Tagalog / Heritage) */}
        <path
          d="M18 14C18 10.6863 20.6863 8 24 8H36C39.3137 8 42 10.6863 42 14V24C42 27.3137 39.3137 30 36 30H32L26 35V30H24C20.6863 30 18 27.3137 18 24V14Z"
          fill="url(#langGrad2)"
        />
        {/* Primary speech bubble (Bilingual Dialogue) */}
        <path
          d="M6 18C6 14.6863 8.68629 12 12 12H26C29.3137 12 32 14.6863 32 18V28C32 31.3137 29.3137 34 26 34H20L13 39V34H12C8.68629 34 6 31.3137 6 28V18Z"
          fill="url(#langGrad1)"
        />
        {/* Subtle inner highlight gloss */}
        <path
          d="M12 14H26C27.5 14 29 15 29.5 16.5C27 16 16 16 10 21C9.5 19.5 10.5 14 12 14Z"
          fill="white"
          fillOpacity="0.35"
        />
        {/* Dialogue lines in primary bubble */}
        <rect x="12" y="20" width="12" height="2.5" rx="1.25" fill="white" fillOpacity="0.95" />
        <rect x="12" y="25" width="8" height="2.5" rx="1.25" fill="white" fillOpacity="0.95" />
        {/* Baybayin-inspired accent dot */}
        <circle cx="34" cy="18" r="2" fill="white" fillOpacity="0.9" />
      </g>
    </svg>
  );
}

export function CultureIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 motion-reduce:transform-none hover:scale-105 hover:-translate-y-0.5 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="cultGrad1" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2FB8AD" />
          <stop offset="0.6" stopColor="#14837C" />
          <stop offset="1" stopColor="#0B5651" />
        </linearGradient>
        <linearGradient id="cultGold" x1="16" y1="10" x2="32" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD23F" />
          <stop offset="1" stopColor="#E5A917" />
        </linearGradient>
        <filter id="cultShadow" x="2" y="3" width="44" height="43" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#14837C" floodOpacity="0.22" />
        </filter>
      </defs>
      <g filter="url(#cultShadow)">
        {/* Voyaging Balangay Vessel Hull */}
        <path
          d="M6 28C10 35 38 35 42 28C38 38 10 38 6 28Z"
          fill="url(#cultGrad1)"
        />
        {/* Curved Traditional Sail */}
        <path
          d="M16 10C24 12 32 18 34 27H16V10Z"
          fill="url(#cultGrad1)"
        />
        {/* Heritage Sun emblem on Sail */}
        <circle cx="23" cy="18" r="4.5" fill="url(#cultGold)" />
        {/* Radiant sun rays */}
        <path d="M23 11V12.5M23 23.5V25M16.5 18H18M28 18H29.5" stroke="#FFE785" strokeWidth="1.5" strokeLinecap="round" />
        {/* Gloss highlight */}
        <path
          d="M17 12C22 13.5 28 17 30 23H27C25 18 20 15 17 12Z"
          fill="white"
          fillOpacity="0.3"
        />
        {/* Ocean Wave base */}
        <path
          d="M4 35C9 32 15 37 20 34C25 31 31 36 36 34C40 32.5 43 34 44 35"
          stroke="#4DBD85"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function CharacterIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 motion-reduce:transform-none hover:scale-105 hover:-translate-y-0.5 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="charGrad" x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC5D87" />
          <stop offset="0.65" stopColor="#CF3E6B" />
          <stop offset="1" stopColor="#8890D6" />
        </linearGradient>
        <filter id="charShadow" x="3" y="4" width="42" height="42" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#CF3E6B" floodOpacity="0.22" />
        </filter>
      </defs>
      <g filter="url(#charShadow)">
        {/* Heart of Integrity and Kindness */}
        <path
          d="M24 40C24 40 8 30 8 18C8 12 12.5 8 18 8C21 8 23 9.5 24 11.5C25 9.5 27 8 30 8C35.5 8 40 12 40 18C40 30 24 40 24 40Z"
          fill="url(#charGrad)"
        />
        {/* Soft specular crest */}
        <path
          d="M13 16C12 18 12.5 21 14 23C13.5 21 13 18 15 15C16.5 13 18.5 12 21 11.5C17.5 11.5 14 13 13 16Z"
          fill="white"
          fillOpacity="0.45"
        />
        {/* Inner virtuous leaf/sprout */}
        <path
          d="M24 18C24 23 20 27 17 28C17 24 20 20 24 18Z"
          fill="#FFFDF6"
          fillOpacity="0.9"
        />
        <path
          d="M24 21C26 25 29 27 32 27C30 24 28 22 24 21Z"
          fill="#FFD23F"
        />
      </g>
    </svg>
  );
}

export function FaithIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 motion-reduce:transform-none hover:scale-105 hover:-translate-y-0.5 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="faithGrad" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#274472" />
          <stop offset="0.6" stopColor="#14837C" />
          <stop offset="1" stopColor="#2FB8AD" />
        </linearGradient>
        <linearGradient id="faithLight" x1="18" y1="8" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDF6" />
          <stop offset="1" stopColor="#FFD23F" />
        </linearGradient>
        <filter id="faithShadow" x="4" y="3" width="40" height="43" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#274472" floodOpacity="0.22" />
        </filter>
      </defs>
      <g filter="url(#faithShadow)">
        {/* Stately rounded cross emblem */}
        <rect x="20" y="6" width="8" height="34" rx="4" fill="url(#faithGrad)" />
        <rect x="10" y="14" width="28" height="8" rx="4" fill="url(#faithGrad)" />

        {/* Central glowing radiant morning star of Christ */}
        <path
          d="M24 12L25.8 16.2L30 18L25.8 19.8L24 24L22.2 19.8L18 18L22.2 16.2L24 12Z"
          fill="url(#faithLight)"
        />
        {/* Soft upper bevel */}
        <rect x="21" y="7" width="6" height="3" rx="1.5" fill="white" fillOpacity="0.45" />
        <rect x="11" y="15" width="3" height="6" rx="1.5" fill="white" fillOpacity="0.45" />
      </g>
    </svg>
  );
}

export function FamilyPrivacyIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 motion-reduce:transform-none hover:scale-105 hover:-translate-y-0.5 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="privGrad1" x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14837C" />
          <stop offset="0.6" stopColor="#0D5C75" />
          <stop offset="1" stopColor="#274472" />
        </linearGradient>
        <linearGradient id="privLockGrad" x1="18" y1="18" x2="30" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD23F" />
          <stop offset="1" stopColor="#E5A917" />
        </linearGradient>
        <filter id="privShadow" x="4" y="3" width="40" height="43" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#274472" floodOpacity="0.2" />
        </filter>
      </defs>
      <g filter="url(#privShadow)">
        {/* Protective Hearth / Sanctuary Shield */}
        <path
          d="M24 6L10 11V22C10 31 16 38.5 24 42C32 38.5 38 31 38 22V11L24 6Z"
          fill="url(#privGrad1)"
        />
        {/* Gentle highlight crest */}
        <path
          d="M24 8L12 12.5V20C12 25 14.5 30 18 34C15 29 14 23 14 18V13.5L24 10V8Z"
          fill="white"
          fillOpacity="0.3"
        />
        {/* Family Privacy Padlock */}
        <path
          d="M19 23V20C19 17.2386 21.2386 15 24 15C26.7614 15 29 17.2386 29 20V23"
          stroke="#FFFDF6"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="17" y="23" width="14" height="11" rx="3" fill="url(#privLockGrad)" />
        {/* Keyhole */}
        <circle cx="24" cy="28" r="1.5" fill="#274472" />
        <rect x="23.25" y="28" width="1.5" height="3" rx="0.75" fill="#274472" />
      </g>
    </svg>
  );
}

export function AdventureIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 motion-reduce:transform-none hover:scale-105 hover:-translate-y-0.5 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="advGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD23F" />
          <stop offset="0.5" stopColor="#E5A917" />
          <stop offset="1" stopColor="#FF7A59" />
        </linearGradient>
        <filter id="advShadow" x="3" y="3" width="42" height="43" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#274472" floodOpacity="0.2" />
        </filter>
      </defs>
      <g filter="url(#advShadow)">
        {/* Dimensional Dial Outer Ring */}
        <circle cx="24" cy="24" r="18" fill="url(#advGrad)" />
        <circle cx="24" cy="24" r="14.5" fill="#FFFDF6" />
        {/* Compass Cardinal Ticks */}
        <line x1="24" y1="11" x2="24" y2="13" stroke="#274472" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="35" x2="24" y2="37" stroke="#274472" strokeWidth="2" strokeLinecap="round" />
        <line x1="11" y1="24" x2="13" y2="24" stroke="#274472" strokeWidth="2" strokeLinecap="round" />
        <line x1="35" y1="24" x2="37" y2="24" stroke="#274472" strokeWidth="2" strokeLinecap="round" />
        {/* Explorer Needle */}
        <polygon points="24,14 27.5,24 24,22.5 20.5,24" fill="#E4573B" />
        <polygon points="24,34 27.5,24 24,25.5 20.5,24" fill="#274472" />
        {/* Center Brass Pivot */}
        <circle cx="24" cy="24" r="2.5" fill="#FFD23F" stroke="#274472" strokeWidth="1" />
      </g>
    </svg>
  );
}

export function FounderBadgeIcon({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="badgeGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD23F" />
          <stop offset="0.7" stopColor="#E5A917" />
          <stop offset="1" stopColor="#FF7A59" />
        </linearGradient>
      </defs>
      {/* 8-point heritage star / compass spark */}
      <path
        d="M12 2L14.2 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.8 8.5L12 2Z"
        fill="url(#badgeGrad)"
      />
      <circle cx="12" cy="12" r="3" fill="#FFFDF6" />
      <circle cx="12" cy="12" r="1.5" fill="#14837C" />
    </svg>
  );
}
