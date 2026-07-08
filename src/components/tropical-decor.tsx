// Fixed, non-interactive watercolor-storybook decorations:
// palm fronds in the corners (pure CSS leaf shapes), doodle stars,
// and a dotted airplane path — matching the Canva reference video.

const cornerLeaves = [
  // top-left frond fan
  { top: "-1.5rem", left: "-2.5rem", w: 150, h: 46, rot: 35, dark: false },
  { top: "-1rem", left: "-2rem", w: 170, h: 50, rot: 55, dark: true },
  { top: "0.5rem", left: "-2.5rem", w: 150, h: 44, rot: 75, dark: false },
  { top: "-2.5rem", left: "0rem", w: 140, h: 42, rot: 20, dark: true },
  // bottom-right frond fan (mirrored)
  { bottom: "-1.5rem", right: "-2.5rem", w: 160, h: 48, rot: 215, dark: false },
  { bottom: "-1rem", right: "-2rem", w: 175, h: 52, rot: 235, dark: true },
  { bottom: "0.5rem", right: "-2.5rem", w: 150, h: 44, rot: 255, dark: false },
  { bottom: "-2.5rem", right: "0.5rem", w: 140, h: 42, rot: 200, dark: true },
] as const;

export function TropicalDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {cornerLeaves.map((leaf, i) => (
        <span
          key={i}
          className={`wj-leaf ${leaf.dark ? "wj-leaf-dark" : ""}`}
          style={{
            top: "top" in leaf ? leaf.top : undefined,
            left: "left" in leaf ? leaf.left : undefined,
            bottom: "bottom" in leaf ? leaf.bottom : undefined,
            right: "right" in leaf ? leaf.right : undefined,
            width: leaf.w,
            height: leaf.h,
            transform: `rotate(${leaf.rot}deg)`,
          }}
        />
      ))}

      {/* doodle stars */}
      <span className="absolute left-[2%] top-[42%] text-xl opacity-30">⭐</span>
      <span className="absolute right-[6%] top-[45%] text-sm opacity-30">✨</span>
      <span className="absolute left-[4%] bottom-[22%] text-sm opacity-25">✦</span>
      <span className="absolute right-[10%] bottom-[12%] text-xl opacity-25">🌺</span>
      <span className="absolute right-[20%] top-[12%] text-sm opacity-25">☁️</span>
      <span className="absolute left-[18%] top-[8%] text-sm opacity-30">🕊️</span>

      {/* dotted airplane path across the top */}
      <div
        className="wj-doodle-path"
        style={{ top: "4rem", right: "8%", width: "16rem", height: "5rem", transform: "rotate(-6deg)" }}
      />
      <span className="absolute right-[6%] top-[3.2rem] text-lg opacity-60" style={{ transform: "rotate(20deg)" }}>
        ✈️
      </span>
    </div>
  );
}
