"use client";

// Animated storybook background for the Adventure Theater.
// RULE: every decoration lives at the EDGES (top strip, corners, bottom
// path) and sits BEHIND the content — it must never cover the text or
// distract the children. Motion is slow and gentle by design.
export function SlideScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* sky → sand → sea wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#c4e5f6] via-[#edf4e2] to-[#cbe9f1]" />

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

      {/* palm swaying in the bottom-left corner */}
      <span className="wj-sway-soft absolute bottom-12 left-1 text-6xl opacity-90">🌴</span>

      {/* sparkles — kept to the far LEFT and RIGHT edges, never the center */}
      <span className="wj-twinkle absolute left-[5%] top-[42%] text-xl" style={{ animationDuration: "3.2s" }}>✨</span>
      <span className="wj-twinkle absolute left-[9%] top-[62%] text-base" style={{ animationDuration: "4s", animationDelay: "-1.5s" }}>⭐</span>
      <span className="wj-twinkle absolute right-[6%] top-[48%] text-lg" style={{ animationDuration: "3.6s", animationDelay: "-1s" }}>✦</span>
      <span className="wj-twinkle absolute right-[10%] top-[30%] text-sm" style={{ animationDuration: "4.4s", animationDelay: "-2.5s" }}>✨</span>

      {/* dashed travel path + sea along the very bottom */}
      <div className="wj-path absolute inset-x-0 bottom-7 h-1.5 opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#8fd0e8]/70 to-transparent" />
    </div>
  );
}
