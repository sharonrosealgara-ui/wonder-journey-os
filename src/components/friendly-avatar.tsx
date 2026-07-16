// 🙂 FRIENDLY AVATAR — the warm silhouette shown when a camera is off.
// Replaces the harsh black 📷 clipart per the brand guidelines: soft
// rounded shapes, cream-on-watercolor, no hard black strokes — the same
// sticker feel as Kiko the mascot.
export function FriendlyAvatar({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      {/* soft halo so it sits gently on any gradient */}
      <circle cx="32" cy="32" r="30" fill="#fffdf6" opacity="0.18" />
      {/* head + shoulders, cream with a warm deep-blue tint edge */}
      <circle cx="32" cy="25" r="11" fill="#fffdf6" opacity="0.92" />
      <path
        d="M12 54c2-12 10-17 20-17s18 5 20 17"
        fill="#fffdf6"
        opacity="0.92"
      />
      {/* tiny sleeping camera badge — friendly, not clipart */}
      <g transform="translate(41 40)">
        <rect x="0" y="2.5" width="13" height="9.5" rx="3" fill="#ffd23f" />
        <rect x="4" y="0" width="5" height="4" rx="1.6" fill="#ffd23f" />
        <circle cx="6.5" cy="7.2" r="2.6" fill="#274472" opacity="0.85" />
      </g>
    </svg>
  );
}

/** Full-tile "camera resting" state: gradient + avatar, ready to drop
 *  into any video tile. Keeps every tile's off-state identical. */
export function CameraOffTile({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-ocean-deep to-ube-deep">
      <FriendlyAvatar />
      {label && <span className="font-hand text-xs text-white/80">{label}</span>}
    </div>
  );
}
