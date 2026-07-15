"use client";

// ─────────────────────────────────────────────────────────────
// RUNTIME PHOTO STORE
// Real photos without a redeploy. Paste an image link (or upload a
// picture) for any lesson, place, or recipe and it shows instantly —
// stored on the device and synced to the family's cloud backend.
//
// A photo file dropped into /public still works too: if there's no
// runtime override, we fall back to the /public convention path, then
// to the emoji art (SmartPhoto handles the final fallback).
// ─────────────────────────────────────────────────────────────

import { destinationPhoto, lessonPhoto, recipePhoto } from "@/components/smart-photo";
import { useStored } from "@/lib/storage";

export type PhotoKind = "lesson" | "destination" | "recipe";

export type PhotoMap = {
  lesson: Record<string, string>;
  destination: Record<string, string>;
  recipe: Record<string, string>;
};

const EMPTY: PhotoMap = { lesson: {}, destination: {}, recipe: {} };

const conventionPath: Record<PhotoKind, (id: string) => string> = {
  lesson: lessonPhoto,
  destination: destinationPhoto,
  recipe: recipePhoto,
};

export function usePhotos(): [PhotoMap, (updater: (prev: PhotoMap) => PhotoMap) => void] {
  const [map, setMap] = useStored<PhotoMap>("photos", EMPTY);
  // guard against older/partial shapes
  const safe: PhotoMap = {
    lesson: map.lesson ?? {},
    destination: map.destination ?? {},
    recipe: map.recipe ?? {},
  };
  return [safe, (updater) => setMap((prev) => updater({ lesson: prev.lesson ?? {}, destination: prev.destination ?? {}, recipe: prev.recipe ?? {} }))];
}

export function setPhoto(setMap: (u: (p: PhotoMap) => PhotoMap) => void, kind: PhotoKind, id: string, url: string) {
  setMap((prev) => ({ ...prev, [kind]: { ...prev[kind], [id]: url } }));
}

export function clearPhoto(setMap: (u: (p: PhotoMap) => PhotoMap) => void, kind: PhotoKind, id: string) {
  setMap((prev) => {
    const next = { ...prev[kind] };
    delete next[id];
    return { ...prev, [kind]: next };
  });
}

/** The best available src for a photo: runtime override → /public path. */
export function useSmartSrc(kind: PhotoKind, id: string): string {
  const [photos] = usePhotos();
  return photos[kind][id] || conventionPath[kind](id);
}

// ── image helpers ────────────────────────────────────────────
// Shrink an uploaded picture so it's light enough to store & sync.
export function fileToResizedDataUrl(file: File, maxW = 900, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image failed"));
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
