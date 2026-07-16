"use client";

import { useState } from "react";

// Shows a real photograph when one exists, and gracefully falls back to
// the emoji + watercolor gradient if the photo is missing or fails to load.
// Drop a real photo into /public and pass its path as `src` — done.
export function SmartPhoto({
  src,
  alt,
  emoji,
  className = "",
  gradient = "from-mango/25 to-ocean/15",
  emojiClass = "text-6xl",
}: {
  src?: string | null;
  alt: string;
  emoji: string;
  className?: string;
  gradient?: string;
  emojiClass?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${className} object-cover`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center bg-gradient-to-br ${gradient} ${emojiClass}`}
      role="img"
      aria-label={alt}
    >
      {emoji}
    </div>
  );
}

// 📸 POLAROID — real photos become physical, collectible objects:
// a thick white mat, a deep soft shadow, a gentle tilt, and a strip of
// washi tape holding it to the page. Hovering straightens it, like
// picking the photo up to look closer.
export function Polaroid({
  src,
  alt,
  emoji,
  caption,
  tilt = "-rotate-2",
  className = "",
}: {
  src?: string | null;
  alt: string;
  emoji: string;
  caption?: string;
  tilt?: string; // e.g. "rotate-2" | "-rotate-2" — alternate for variety
  className?: string;
}) {
  return (
    <figure
      className={`relative inline-block rounded-md bg-white p-3 pb-4 shadow-2xl transition-transform duration-300 hover:rotate-0 hover:scale-[1.03] ${tilt} ${className}`}
    >
      <span aria-hidden className="wj-tape -top-3 left-1/2 -translate-x-1/2 rotate-3" />
      <SmartPhoto
        src={src}
        alt={alt}
        emoji={emoji}
        className="h-48 w-full rounded-sm sm:h-60"
        emojiClass="text-7xl"
      />
      {caption && (
        <figcaption className="font-hand pt-2 text-center text-base text-ink-soft">{caption}</figcaption>
      )}
    </figure>
  );
}

// Convention helpers: real photos live in these public folders, named by id.
// e.g. public/lesson-photos/welcome-to-the-philippines.jpg
export const lessonPhoto = (id: string) => `/lesson-photos/${id}.jpg`;
export const destinationPhoto = (id: string) => `/destination-photos/${id}.jpg`;
export const recipePhoto = (id: string) => `/recipe-photos/${id}.jpg`;
