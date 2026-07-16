"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TeacherOnly } from "@/components/teacher-only";
import { SmartPhoto } from "@/components/smart-photo";
import { destinations } from "@/config/destinations";
import { lessons } from "@/config/lessons";
import { recipes } from "@/config/recipes";
import { clearPhoto, fileToResizedDataUrl, usePhotos, setPhoto, type PhotoKind } from "@/lib/photos";

// 🖼️ PHOTO STUDIO — real photographs, no redeploy needed.
// Paste an image link (or upload a picture) for any lesson, place, or
// recipe and it appears everywhere instantly. Saved on this device and
// synced to the family's cloud, so it travels to the family's screen too.

type Item = { id: string; name: string; emoji: string; note: string };

const tabs: { kind: PhotoKind; label: string; emoji: string; items: () => Item[] }[] = [
  {
    kind: "lesson",
    label: "Lessons",
    emoji: "🗺️",
    items: () =>
      lessons.map((l) => ({ id: l.id, name: l.title, emoji: l.emoji, note: l.subtitle })),
  },
  {
    kind: "destination",
    label: "Places",
    emoji: "🛂",
    items: () =>
      destinations.map((d) => ({ id: d.id, name: d.name, emoji: d.emoji, note: d.knownFor })),
  },
  {
    kind: "recipe",
    label: "Recipes",
    emoji: "🍳",
    items: () =>
      recipes.map((r) => ({ id: r.id, name: r.name, emoji: r.emoji, note: r.filipinoName })),
  },
];

export default function PhotoStudioPage() {
  return (
    <TeacherOnly>
      <PhotoStudioContent />
    </TeacherOnly>
  );
}

function PhotoStudioContent() {
  const [kind, setKind] = useState<PhotoKind>("lesson");
  const [photos, setPhotos] = usePhotos();
  const tab = tabs.find((t) => t.kind === kind)!;
  const count = Object.keys(photos[kind]).length;

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🖼️"
        title="Photo Studio"
        subtitle="Add real photographs to your lessons — they appear right away, no waiting."
      />

      {/* where to find photos you're allowed to use */}
      <section className="wj-card bg-gradient-to-br from-ocean/10 to-mango/10 p-5">
        <h2 className="font-display text-lg font-extrabold">📸 Where to get beautiful, free photos</h2>
        <p className="font-hand mt-1 text-base text-ink-soft">
          These sites offer photos that are free to use — search a place or dish, open the photo,
          then right-click it and choose <b>&ldquo;Copy image address&rdquo;</b> and paste it below.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a className="wj-chip hover:bg-mango/20" href="https://unsplash.com/s/photos/philippines" target="_blank" rel="noopener noreferrer">Unsplash ↗</a>
          <a className="wj-chip hover:bg-mango/20" href="https://www.pexels.com/search/philippines/" target="_blank" rel="noopener noreferrer">Pexels ↗</a>
          <a className="wj-chip hover:bg-mango/20" href="https://commons.wikimedia.org/w/index.php?search=philippines" target="_blank" rel="noopener noreferrer">Wikimedia Commons ↗</a>
        </div>
        <p className="mt-3 rounded-2xl bg-white/60 p-3 text-xs text-ink-soft">
          💛 Best of all: use your <b>own</b> family photos — tap <b>Upload</b> on any card. Your own
          pictures of cooking, crafts, and adventures make the lessons truly yours.
        </p>
      </section>

      {/* tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.kind}
              onClick={() => setKind(t.kind)}
              className={`wj-chip ${kind === t.kind ? "!bg-ocean !text-white" : "hover:bg-mango/20"}`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        <span className="wj-chip">{count} photo{count === 1 ? "" : "s"} added</span>
      </div>

      {/* the cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {tab.items().map((item) => (
          <PhotoCard
            key={item.id}
            item={item}
            kind={kind}
            current={photos[kind][item.id]}
            onSet={(url) => setPhoto(setPhotos, kind, item.id, url)}
            onClear={() => clearPhoto(setPhotos, kind, item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoCard({
  item,
  kind,
  current,
  onSet,
  onClear,
}: {
  item: Item;
  kind: PhotoKind;
  current?: string;
  onSet: (url: string) => void;
  onClear: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const url = await fileToResizedDataUrl(file);
      onSet(url);
    } catch {
      setError("We couldn't read that picture — try a JPG or PNG.");
    }
    setBusy(false);
  }

  return (
    <div className="wj-card overflow-hidden">
      <SmartPhoto
        src={current ?? null}
        alt={item.name}
        emoji={item.emoji}
        className="h-36 w-full"
        emojiClass="text-5xl"
      />
      <div className="space-y-2 p-4">
        <div>
          <p className="font-display text-base font-extrabold">{item.emoji} {item.name}</p>
          <p className="font-hand text-sm text-ink-soft">{item.note}</p>
        </div>

        {current ? (
          <div className="flex items-center justify-between gap-2">
            <span className="wj-chip !bg-palm/15 !text-palm-deep !text-xs">✅ Photo added</span>
            <button className="wj-btn wj-btn-ghost !px-3 !py-1 text-xs" onClick={onClear}>
              🗑️ Remove
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                className="wj-input !py-1.5 text-sm"
                placeholder="Paste image link…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && draft.trim()) {
                    onSet(draft.trim());
                    setDraft("");
                  }
                }}
              />
              <button
                className="wj-btn !px-3 !py-1.5 text-sm"
                disabled={!draft.trim()}
                onClick={() => {
                  onSet(draft.trim());
                  setDraft("");
                }}
              >
                Add
              </button>
            </div>
            <label className="block cursor-pointer text-center">
              <span className="wj-chip hover:bg-mango/20">
                {busy ? "Adding…" : "📁 or Upload your own photo"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void upload(e.target.files?.[0])}
              />
            </label>
          </>
        )}
        {error && <p className="text-xs font-bold text-hibiscus-deep">{error}</p>}
        {!current && (
          <p className="text-[10px] text-ink-soft">
            No photo yet — the {kind === "recipe" ? "dish" : kind === "destination" ? "place" : "lesson"} shows its emoji art until you add one.
          </p>
        )}
      </div>
    </div>
  );
}
