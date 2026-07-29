"use client";

import { useState } from "react";
import { getMedia } from "@/config/media-registry";

// Shows a real photograph when one exists, and gracefully falls back to
// the emoji + watercolor gradient if the photo is missing or fails to load.
// If a mediaId is provided and its status is "pending", it enforces a strict
// "Real image pending verification" fallback.
// Drop a real photo into /public and pass its path as `src` — done.
export function SmartPhoto({
  mediaId,
  src,
  alt,
  emoji,
  className = "",
  gradient = "from-mango/25 to-ocean/15",
  emojiClass = "text-6xl",
}: {
  mediaId?: string;
  src?: string | null;
  alt: string;
  emoji?: string;
  className?: string;
  gradient?: string;
  emojiClass?: string;
}) {
  const [failed, setFailed] = useState(false);
  const media = mediaId ? getMedia(mediaId) : null;

  // Strict Fallback Policy: If marked as pending OR unknown mediaId, explicitly show the pending verification UI
  if (mediaId && (!media || media.verificationStatus === "pending")) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center bg-[#e5e5e5] text-ink-soft p-4`}
        role="img"
        aria-label={alt || "Image pending verification"}
      >
        <span className="text-3xl mb-2">⏳</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-center">
          Real image pending verification
        </span>
      </div>
    );
  }

  const actualSrc = media?.storedAssetPath || src;

  if (actualSrc && !failed) {
    return (
      <div className={`group relative ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={actualSrc}
        alt={media?.descriptiveAltText || alt}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
        
        {/* Attribution Overlay */}
        {media?.verificationStatus === "verified" && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div className="relative group/tooltip">
              <button className="bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs backdrop-blur-md hover:bg-black/80 transition-colors">
                ℹ️
              </button>
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-paper/95 p-3 rounded-xl shadow-xl border border-sand-deep text-ink hidden group-hover/tooltip:block backdrop-blur-md text-xs text-left">
                <p className="font-bold mb-1">{media.title}</p>
                {media.creatorOrOrganization && <p className="mb-1 text-ink-soft">📷 {media.creatorOrOrganization}</p>}
                {media.license && <p className="mb-1 text-ink-soft">📄 {media.license}</p>}
                {media.originalSourceUrl && (
                  <a href={media.originalSourceUrl} target="_blank" rel="noopener noreferrer" className="text-ocean-deep hover:underline mt-1 block">
                    Source Link ↗
                  </a>
                )}
                <div className="mt-2 pt-2 border-t border-sand-deep/50 text-[10px] text-ink-soft">
                  Reviewed: {media.dateReviewed}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Generic fallback if not explicitly pending but image missing/failed
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
  mediaId,
  src,
  alt,
  emoji,
  caption,
  tilt = "-rotate-2",
  className = "",
}: {
  mediaId?: string;
  src?: string | null;
  alt: string;
  emoji?: string;
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
        mediaId={mediaId}
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
