"use client";

import { useRef, useState } from "react";

// Reads a photo, shrinks it (so localStorage stays happy), returns a data URL.
export function PhotoUpload({
  label = "Upload Photo 📸",
  photo,
  onPhoto,
}: {
  label?: string;
  photo: string | null;
  onPhoto: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const dataUrl = await shrinkImage(file, 900, 0.8);
      onPhoto(dataUrl);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
      {photo ? (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="Uploaded memory" className="max-h-64 w-full rounded-2xl object-cover" />
          <div className="flex gap-2">
            <button className="wj-btn wj-btn-ghost text-sm" onClick={() => inputRef.current?.click()}>
              Change photo
            </button>
            <button className="wj-btn wj-btn-ghost text-sm" onClick={() => onPhoto(null)}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sand-deep bg-sand p-8 text-ink-soft transition-colors hover:border-mango hover:text-mango-deep"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <span className="text-3xl">📸</span>
          <span className="font-display font-bold">{busy ? "Loading photo..." : label}</span>
        </button>
      )}
    </div>
  );
}

function shrinkImage(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas unsupported"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
