"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 🎨 Live Teaching Whiteboard — a canvas annotation layer over the lesson.
// Draw / highlight / shapes / text / erase / laser-point, live via the
// teacher's screen-share (no realtime backend needed). Only mounts when
// the teacher turns it on, so it can never interfere with the theater.

type Tool = "pen" | "highlighter" | "line" | "arrow" | "circle" | "text" | "eraser" | "laser";
type Pt = { x: number; y: number };

type Stroke =
  | { kind: "path"; tool: "pen" | "highlighter"; color: string; width: number; points: Pt[] }
  | { kind: "shape"; tool: "line" | "arrow" | "circle"; color: string; width: number; a: Pt; b: Pt }
  | { kind: "text"; color: string; size: number; x: number; y: number; text: string };

const COLORS = ["#e4573b", "#e5a917", "#2e9563", "#14837c", "#cf3e6b", "#274472", "#ffffff"];
const WIDTHS = [3, 6, 12];

const TOOLS: { id: Tool; emoji: string; label: string; key: string }[] = [
  { id: "pen", emoji: "🖊️", label: "Pen", key: "P" },
  { id: "highlighter", emoji: "🖍️", label: "Highlighter", key: "H" },
  { id: "line", emoji: "📏", label: "Line", key: "L" },
  { id: "arrow", emoji: "➡️", label: "Arrow", key: "A" },
  { id: "circle", emoji: "⭕", label: "Circle", key: "C" },
  { id: "text", emoji: "🔤", label: "Text", key: "T" },
  { id: "eraser", emoji: "🧽", label: "Eraser", key: "E" },
  { id: "laser", emoji: "🔦", label: "Laser", key: "K" },
];

export function AnnotationLayer({ onClose }: { onClose: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const draftRef = useRef<Stroke | null>(null);
  const laserRef = useRef<Pt | null>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [width, setWidth] = useState(WIDTHS[1]);
  const [count, setCount] = useState(0); // drives undo button enabled state
  const [textBox, setTextBox] = useState<{ x: number; y: number; value: string } | null>(null);

  const redraw = useCallback(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, cv.width / dpr, cv.height / dpr);
    const all = draftRef.current ? [...strokesRef.current, draftRef.current] : strokesRef.current;
    for (const s of all) drawStroke(ctx, s);
    if (laserRef.current) drawLaser(ctx, laserRef.current);
  }, []);

  // size the canvas to its wrapper (crisp on any screen)
  useEffect(() => {
    const cv = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cv || !wrap) return;
    const fit = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      cv.style.width = `${r.width}px`;
      cv.style.height = `${r.height}px`;
      const ctx = cv.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [redraw]);

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (textBox) return; // typing text
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (e.key === "Escape") {
        onClose();
        return;
      }
      const t = TOOLS.find((x) => x.key.toLowerCase() === e.key.toLowerCase());
      if (t) setTool(t.id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textBox]);

  function pos(e: React.PointerEvent): Pt {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const p = pos(e);
    if (tool === "text") {
      setTextBox({ x: p.x, y: p.y, value: "" });
      return;
    }
    if (tool === "laser") {
      laserRef.current = p;
      redraw();
      return;
    }
    if (tool === "eraser") {
      eraseAt(p);
      return;
    }
    if (tool === "pen" || tool === "highlighter") {
      draftRef.current = { kind: "path", tool, color, width, points: [p] };
    } else {
      draftRef.current = { kind: "shape", tool, color, width, a: p, b: p };
    }
    redraw();
  }

  function onMove(e: React.PointerEvent) {
    const p = pos(e);
    if (tool === "laser") {
      laserRef.current = p;
      redraw();
      return;
    }
    const d = draftRef.current;
    if (!d) {
      if (e.buttons && tool === "eraser") eraseAt(p);
      return;
    }
    if (d.kind === "path") d.points.push(p);
    else if (d.kind === "shape") d.b = p;
    redraw();
  }

  function onUp() {
    if (draftRef.current) {
      strokesRef.current.push(draftRef.current);
      draftRef.current = null;
      setCount((c) => c + 1);
    }
    if (tool === "laser") {
      laserRef.current = null;
    }
    redraw();
  }

  function eraseAt(p: Pt) {
    const before = strokesRef.current.length;
    strokesRef.current = strokesRef.current.filter((s) => !strokeHit(s, p, 16));
    if (strokesRef.current.length !== before) {
      setCount((c) => c + 1);
      redraw();
    }
  }

  function undo() {
    strokesRef.current.pop();
    setCount((c) => c + 1);
    redraw();
  }
  function clearAll() {
    strokesRef.current = [];
    draftRef.current = null;
    setCount((c) => c + 1);
    redraw();
  }

  function commitText() {
    if (textBox && textBox.value.trim()) {
      strokesRef.current.push({
        kind: "text",
        color,
        size: Math.max(18, width * 4),
        x: textBox.x,
        y: textBox.y,
        text: textBox.value,
      });
      setCount((c) => c + 1);
    }
    setTextBox(null);
    redraw();
  }

  return (
    <div ref={wrapRef} className="absolute inset-0 z-30">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none ${
          tool === "laser" ? "cursor-none" : "cursor-crosshair"
        }`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={() => {
          if (tool === "laser") {
            laserRef.current = null;
            redraw();
          }
        }}
      />

      {/* inline text box */}
      {textBox && (
        <input
          autoFocus
          value={textBox.value}
          onChange={(e) => setTextBox({ ...textBox, value: e.target.value })}
          onBlur={commitText}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitText();
            if (e.key === "Escape") setTextBox(null);
          }}
          placeholder="type…"
          className="absolute rounded-lg border-2 border-mango bg-white/95 px-2 py-1 font-display text-lg outline-none"
          style={{ left: textBox.x, top: textBox.y, color }}
        />
      )}

      {/* ── Floating toolbar ─────────────────────────────────── */}
      <div className="pointer-events-auto absolute bottom-4 left-1/2 flex max-w-[95vw] -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 rounded-full border-2 border-sand-deep bg-paper/95 px-3 py-2 shadow-xl backdrop-blur">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            title={`${t.label} (${t.key})`}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors ${
              tool === t.id ? "bg-sunset text-white shadow" : "hover:bg-sand-deep"
            }`}
          >
            {t.emoji}
          </button>
        ))}

        <span className="mx-1 h-6 w-px bg-sand-deep" />

        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            title="Color"
            className={`h-6 w-6 rounded-full border-2 ${color === c ? "border-ink scale-110" : "border-white"}`}
            style={{ background: c, boxShadow: "0 1px 3px rgba(39,68,114,.3)" }}
          />
        ))}

        <span className="mx-1 h-6 w-px bg-sand-deep" />

        {WIDTHS.map((w, i) => (
          <button
            key={w}
            onClick={() => setWidth(w)}
            title={["Thin", "Medium", "Thick"][i]}
            className={`flex h-9 w-8 items-center justify-center rounded-full ${
              width === w ? "bg-ocean text-white" : "hover:bg-sand-deep"
            }`}
          >
            <span className="rounded-full bg-current" style={{ width: 4 + i * 3, height: 4 + i * 3 }} />
          </button>
        ))}

        <span className="mx-1 h-6 w-px bg-sand-deep" />

        <button
          onClick={undo}
          disabled={strokesRef.current.length === 0}
          title="Undo (Ctrl+Z)"
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-sand-deep disabled:opacity-40"
        >
          ↩️
        </button>
        <button
          onClick={clearAll}
          title="Clear page"
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg hover:bg-hibiscus/20"
        >
          🗑️
        </button>
        <button
          onClick={onClose}
          title="Done (Esc)"
          className="ml-1 flex h-9 items-center gap-1 rounded-full bg-palm px-3 font-display text-sm text-white shadow hover:brightness-105"
        >
          ✓ Done
        </button>
      </div>

      {/* hidden marker so the undo button re-renders on stroke changes */}
      <span className="hidden">{count}</span>
    </div>
  );
}

/* ── canvas drawing helpers ─────────────────────────────────── */

function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (s.kind === "text") {
    ctx.fillStyle = s.color;
    ctx.font = `700 ${s.size}px "Baloo 2", system-ui, sans-serif`;
    ctx.textBaseline = "top";
    ctx.fillText(s.text, s.x, s.y);
    ctx.restore();
    return;
  }
  ctx.strokeStyle = s.color;
  if (s.tool === "highlighter") {
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = s.width * 3;
  } else {
    ctx.lineWidth = s.width;
  }
  ctx.beginPath();
  if (s.kind === "path") {
    const pts = s.points;
    if (pts.length) {
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      if (pts.length === 1) ctx.lineTo(pts[0].x + 0.1, pts[0].y + 0.1);
    }
    ctx.stroke();
  } else if (s.tool === "line" || s.tool === "arrow") {
    ctx.moveTo(s.a.x, s.a.y);
    ctx.lineTo(s.b.x, s.b.y);
    ctx.stroke();
    if (s.tool === "arrow") drawArrowHead(ctx, s.a, s.b, s.width);
  } else if (s.tool === "circle") {
    const cx = (s.a.x + s.b.x) / 2;
    const cy = (s.a.y + s.b.y) / 2;
    const rx = Math.abs(s.b.x - s.a.x) / 2;
    const ry = Math.abs(s.b.y - s.a.y) / 2;
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawArrowHead(ctx: CanvasRenderingContext2D, a: Pt, b: Pt, w: number) {
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const len = 8 + w * 2;
  ctx.beginPath();
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(b.x - len * Math.cos(ang - Math.PI / 6), b.y - len * Math.sin(ang - Math.PI / 6));
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(b.x - len * Math.cos(ang + Math.PI / 6), b.y - len * Math.sin(ang + Math.PI / 6));
  ctx.stroke();
}

function drawLaser(ctx: CanvasRenderingContext2D, p: Pt) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,60,60,0.25)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,20,20,0.95)";
  ctx.fill();
  ctx.restore();
}

function strokeHit(s: Stroke, p: Pt, r: number): boolean {
  const near = (a: Pt) => Math.hypot(a.x - p.x, a.y - p.y) <= r;
  if (s.kind === "text") return Math.abs(s.x - p.x) < s.size * 3 && Math.abs(s.y - p.y) < s.size;
  if (s.kind === "path") return s.points.some(near);
  return near(s.a) || near(s.b) || near({ x: (s.a.x + s.b.x) / 2, y: (s.a.y + s.b.y) / 2 });
}
