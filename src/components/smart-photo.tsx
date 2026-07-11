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

// Convention helpers: real photos live in these public folders, named by id.
// e.g. public/lesson-photos/welcome-to-the-philippines.jpg
export const lessonPhoto = (id: string) => `/lesson-photos/${id}.jpg`;
export const destinationPhoto = (id: string) => `/destination-photos/${id}.jpg`;
export const recipePhoto = (id: string) => `/recipe-photos/${id}.jpg`;
