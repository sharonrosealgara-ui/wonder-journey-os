"use client";

import { useState } from "react";
import { getMedia, getMediaForLesson, FactualMedia } from "@/config/media-registry";

// Shows a real photograph or factual media asset from the Media Registry,
// and gracefully displays attribution tooltip on hover.
export function SmartPhoto({
  mediaId,
  src,
  alt,
  emoji,
  className = "",
  gradient = "from-mango/25 to-ocean/15",
  emojiClass = "text-6xl",
  lessonId,
}: {
  mediaId?: string;
  src?: string | null;
  alt: string;
  emoji?: string;
  className?: string;
  gradient?: string;
  emojiClass?: string;
  lessonId?: string;
}) {
  const [failed, setFailed] = useState(false);

  // 1. Look up by direct mediaId
  let media: FactualMedia | null = mediaId ? getMedia(mediaId) : null;

  // 2. If lessonId is provided, look up registered media for lesson
  if (!media && lessonId) {
    const list = getMediaForLesson(lessonId);
    if (list.length > 0) {
      media = list[0];
    }
  }

  const actualSrc = media?.storedAssetPath || src;

  if (actualSrc && !failed) {
    return (
      <div className={`group relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={actualSrc}
          alt={media?.descriptiveAltText || alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setFailed(true)}
        />

        {/* Verified Badge & Attribution Tooltip */}
        {media?.verificationStatus === "verified" && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <div className="relative group/tooltip">
              <button
                type="button"
                aria-label={`Media provenance for ${media.title}`}
                className="bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs backdrop-blur-md hover:bg-black/90 transition-colors shadow-md"
              >
                ℹ️
              </button>
              <div className="absolute bottom-full right-0 mb-2 w-72 bg-paper/95 p-3 rounded-xl shadow-xl border border-sand-deep text-ink hidden group-hover/tooltip:block backdrop-blur-md text-xs text-left z-20">
                <p className="font-bold mb-1 text-ink">{media.title}</p>
                <p className="mb-1 text-ink-soft">🏛️ {media.creatorOrOrganization}</p>
                <p className="mb-1 text-ink-soft">📄 {media.license}</p>
                <p className="text-ocean-deep font-medium italic mt-1">{media.factualCaption}</p>
                <div className="mt-2 pt-2 border-t border-sand-deep/50 text-[10px] text-ink-soft flex justify-between">
                  <span>Verified Factual Media</span>
                  <span className="font-mono text-[9px]">ID: {media.id}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback if image failed to load
  return (
    <div
      className={`${className} flex items-center justify-center bg-gradient-to-br ${gradient} ${emojiClass}`}
      role="img"
      aria-label={alt}
    >
      {emoji || "🖼️"}
    </div>
  );
}

// 📸 POLAROID — real photos become physical, collectible objects
export function Polaroid({
  mediaId,
  src,
  alt,
  emoji,
  caption,
  tilt = "-rotate-2",
  className = "",
  lessonId,
}: {
  mediaId?: string;
  src?: string | null;
  alt: string;
  emoji?: string;
  caption?: string;
  tilt?: string;
  className?: string;
  lessonId?: string;
}) {
  return (
    <figure
      className={`relative inline-block rounded-md bg-white p-3 pb-4 shadow-2xl transition-transform duration-300 hover:rotate-0 hover:scale-[1.03] ${tilt} ${className}`}
    >
      <span aria-hidden className="wj-tape -top-3 left-1/2 -translate-x-1/2 rotate-3" />
      <SmartPhoto
        mediaId={mediaId}
        lessonId={lessonId}
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

export const lessonPhoto = (id: string) => {
  const list = getMediaForLesson(id);
  if (list.length > 0) return list[0].storedAssetPath;
  return `/lesson-photos/${id}.jpg`;
};

export const destinationPhoto = (id: string) => `/destination-photos/${id}.jpg`;
export const recipePhoto = (id: string) => `/recipe-photos/${id}.jpg`;
