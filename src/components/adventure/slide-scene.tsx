"use client";

import type { Slide } from "@/lib/slides";

// Animated storybook background for the Adventure Theater.
// RULE: every decoration lives at the EDGES (top strip, corners, bottom
// path) and sits BEHIND the content — it must never cover the text or
// distract the children. Motion is slow and gentle by design.
//
// V2: the scene now FOLLOWS THE STORY — each slide kind gets its own
// tint of sky, its own corner friend, and its own edge sparkles, so
// turning a page feels like stepping into a new part of the island.

type SceneTheme = {
  /** subtle color wash laid over the base sky (kept very light) */
  tint: string;
  /** big friend in the bottom-right corner */
  corner: string;
  /** small emojis twinkling on the left / right edges */
  left: [string, string];
  right: [string, string];
  /** friend riding the top cloud strip */
  flyer?: string;
};

const themes: Record<string, SceneTheme> = {
  welcome:    { tint: "linear-gradient(to bottom, rgba(255,200,120,0.18), transparent 55%)", corner: "🗺️", left: ["✨", "🌺"], right: ["⭐", "🧭"], flyer: "🦋" },
  blessings:  { tint: "linear-gradient(to bottom, rgba(255,214,92,0.20), transparent 60%)", corner: "🌅", left: ["🕊️", "✨"], right: ["🌻", "✨"], flyer: "🕊️" },
  prayer:     { tint: "linear-gradient(to bottom, rgba(186,168,255,0.16), transparent 60%)", corner: "🕊️", left: ["✨", "🤍"], right: ["✨", "🌟"] },
  mission:    { tint: "linear-gradient(to bottom, rgba(120,200,255,0.14), transparent 55%)", corner: "🧭", left: ["📍", "✨"], right: ["🗺️", "⭐"], flyer: "🦅" },
  story:      { tint: "linear-gradient(to bottom, rgba(140,220,160,0.14), transparent 55%)", corner: "🦜", left: ["🌺", "✨"], right: ["🍃", "🦋"], flyer: "🦜" },
  learning:   { tint: "linear-gradient(to bottom, rgba(140,220,160,0.14), transparent 55%)", corner: "🐚", left: ["🌺", "✨"], right: ["🍃", "⭐"], flyer: "🦋" },
  vocab:      { tint: "linear-gradient(to bottom, rgba(255,170,150,0.14), transparent 55%)", corner: "💬", left: ["🔤", "✨"], right: ["💬", "⭐"], flyer: "🦜" },
  video:      { tint: "linear-gradient(to bottom, rgba(150,170,255,0.13), transparent 55%)", corner: "🎬", left: ["🎞️", "✨"], right: ["🍿", "⭐"] },
  game:       { tint: "linear-gradient(to bottom, rgba(255,190,90,0.16), transparent 55%)", corner: "🎲", left: ["🎯", "✨"], right: ["⭐", "🎈"], flyer: "🪁" },
  recipe:     { tint: "linear-gradient(to bottom, rgba(255,205,120,0.18), transparent 55%)", corner: "🍳", left: ["🥭", "✨"], right: ["🍍", "🥥"], flyer: "🦋" },
  quiz:       { tint: "linear-gradient(to bottom, rgba(255,215,100,0.18), transparent 55%)", corner: "🏆", left: ["💎", "✨"], right: ["⭐", "🗝️"], flyer: "🦅" },
  academy:    { tint: "linear-gradient(to bottom, rgba(140,190,255,0.14), transparent 55%)", corner: "📚", left: ["✏️", "✨"], right: ["🔢", "⭐"] },
  reflection: { tint: "linear-gradient(to bottom, rgba(186,168,255,0.18), transparent 65%)", corner: "📔", left: ["🌙", "✨"], right: ["⭐", "✨"] },
  challenge:  { tint: "linear-gradient(to bottom, rgba(255,160,120,0.15), transparent 55%)", corner: "🏅", left: ["💪", "✨"], right: ["⭐", "🌟"], flyer: "🦅" },
  memory:     { tint: "linear-gradient(to bottom, rgba(255,180,200,0.14), transparent 55%)", corner: "📸", left: ["🖼️", "✨"], right: ["💛", "⭐"], flyer: "🦋" },
  complete:   { tint: "linear-gradient(to bottom, rgba(255,200,90,0.22), transparent 65%)", corner: "🎉", left: ["🎊", "⭐"], right: ["🎉", "✨"], flyer: "🎈" },
};

const fallback: SceneTheme = { tint: "transparent", corner: "🌺", left: ["✨", "⭐"], right: ["✦", "✨"] };

export function SlideScene({ kind }: { kind?: Slide["kind"] }) {
  const t = (kind && themes[kind]) || fallback;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* sky → sand → sea wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#c4e5f6] via-[#edf4e2] to-[#cbe9f1]" />

      {/* the story's color of the moment — a whisper of a wash */}
      <div className="absolute inset-0 transition-opacity duration-700" style={{ background: t.tint }} />

      {/* soft sun tucked into the top-right corner (mostly off-screen) */}
      <div className="absolute -right-16 -top-16 h-52 w-52 opacity-70">
        <div
          className="wj-sun-rays absolute inset-0"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, rgba(255,214,92,0.35) 0deg 5deg, transparent 5deg 12deg)",
            maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🌞</span>
        </div>
      </div>

      {/* drifting clouds — TOP strip only, well above the centered card */}
      <span className="wj-cloud text-4xl opacity-70" style={{ left: 0, top: "6%", animationDuration: "42s" }}>☁️</span>
      <span className="wj-cloud text-3xl opacity-55" style={{ left: 0, top: "15%", animationDuration: "58s", animationDelay: "-25s" }}>☁️</span>
      <span className="wj-cloud text-5xl opacity-45" style={{ left: 0, top: "2%", animationDuration: "72s", animationDelay: "-48s" }}>☁️</span>

      {/* a little friend rides the wind across the top */}
      {t.flyer && (
        <span className="wj-cloud text-2xl opacity-80" style={{ left: 0, top: "10%", animationDuration: "36s", animationDelay: "-12s" }}>
          {t.flyer}
        </span>
      )}

      {/* palm swaying in the bottom-left corner */}
      <span className="wj-sway-soft absolute bottom-12 left-1 text-6xl opacity-90">🌴</span>

      {/* this chapter's friend waves from the bottom-right corner */}
      <span key={t.corner} className="wj-bob wj-pop-in absolute bottom-10 right-2 text-5xl opacity-90 drop-shadow-md sm:text-6xl">
        {t.corner}
      </span>

      {/* themed sparkles — far LEFT and RIGHT edges, never the center */}
      <span className="wj-twinkle absolute left-[5%] top-[42%] text-xl" style={{ animationDuration: "3.2s" }}>{t.left[0]}</span>
      <span className="wj-twinkle absolute left-[9%] top-[62%] text-base" style={{ animationDuration: "4s", animationDelay: "-1.5s" }}>{t.left[1]}</span>
      <span className="wj-twinkle absolute right-[6%] top-[48%] text-lg" style={{ animationDuration: "3.6s", animationDelay: "-1s" }}>{t.right[0]}</span>
      <span className="wj-twinkle absolute right-[10%] top-[30%] text-sm" style={{ animationDuration: "4.4s", animationDelay: "-2.5s" }}>{t.right[1]}</span>

      {/* dashed travel path + sea along the very bottom */}
      <div className="wj-path absolute inset-x-0 bottom-7 h-1.5 opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#8fd0e8]/70 to-transparent" />
    </div>
  );
}
