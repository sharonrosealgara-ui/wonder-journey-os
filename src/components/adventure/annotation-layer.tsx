"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnnotationTool,
  NormalizedPoint,
  SynchronizedStroke,
  normalizeStageCoordinates,
  denormalizeStageCoordinates,
  PermissionLevel,
} from "@/lib/classroom-protocol";

// 🎨 Real-Time Synchronized Classroom Annotation Layer
// Operates on normalized stage coordinates (0.0 to 1.0) so annotations
// align identically across desktop (1920x1080, 1366x768), tablet (768x1024),
// and mobile (390x844) viewports.

const COLORS = ["#e4573b", "#e5a917", "#2e9563", "#14837c", "#cf3e6b", "#274472", "#ffffff"];
const WIDTHS = [3, 6, 12];

const TOOLS: { id: AnnotationTool; emoji: string; label: string; key: string }[] = [
  { id: "pointer", emoji: "👆", label: "Pointer", key: "V" },
  { id: "laser", emoji: "🔦", label: "Laser", key: "K" },
  { id: "pen", emoji: "🖊️", label: "Pen", key: "P" },
  { id: "highlighter", emoji: "🖍️", label: "Highlighter", key: "H" },
  { id: "underline", emoji: "〰️", label: "Underline", key: "U" },
  { id: "circle", emoji: "⭕", label: "Circle", key: "C" },
  { id: "rect", emoji: "⬜", label: "Rectangle", key: "R" },
  { id: "line", emoji: "📏", label: "Line", key: "L" },
  { id: "arrow", emoji: "➡️", label: "Arrow", key: "A" },
  { id: "eraser", emoji: "🧽", label: "Eraser", key: "E" },
];

export interface RemotePointer {
  senderId: string;
  displayName: string;
  role: "teacher" | "family" | "student";
  point: NormalizedPoint;
  color: string;
  active: boolean;
}

interface AnnotationLayerProps {
  onClose?: () => void;
  isTeacher?: boolean;
  permission?: PermissionLevel;
  userId?: string;
  userName?: string;
  userRole?: "teacher" | "family" | "student";
  slideIndex?: number;
  onEmitStroke?: (stroke: SynchronizedStroke) => void;
  onEmitPointer?: (point: NormalizedPoint, active: boolean) => void;
  onClearAll?: () => void;
  remoteStrokes?: SynchronizedStroke[];
  remotePointers?: RemotePointer[];
}

export function AnnotationLayer({
  onClose,
  isTeacher = true,
  permission = "annotate",
  userId = "local-user",
  userName = "Teacher",
  userRole = "teacher",
  slideIndex = 0,
  onEmitStroke,
  onEmitPointer,
  onClearAll,
  remoteStrokes = [],
  remotePointers = [],
}: AnnotationLayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localStrokesRef = useRef<SynchronizedStroke[]>([]);
  const draftPointsRef = useRef<NormalizedPoint[]>([]);
  const isDrawingRef = useRef(false);
  const currentPointerRef = useRef<NormalizedPoint | null>(null);

  const [tool, setTool] = useState<AnnotationTool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [width, setWidth] = useState(WIDTHS[1]);
  const [undoStack, setUndoStack] = useState<SynchronizedStroke[]>([]);
  const [redoStack, setRedoStack] = useState<SynchronizedStroke[]>([]);

  const isInteractive = isTeacher || permission === "annotate" || permission === "full_interactive";
  const isPointerOnly = !isTeacher && permission === "pointer_only";

  // Redraw all strokes (local + remote) and remote laser pointers
  const redraw = useCallback(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = cv.width / dpr;
    const h = cv.height / dpr;

    ctx.clearRect(0, 0, w, h);

    // Filter strokes for active slide
    const allStrokes = [...localStrokesRef.current, ...remoteStrokes].filter(
      (s) => s.slideIndex === slideIndex
    );

    // 1. Draw completed strokes
    for (const stroke of allStrokes) {
      drawNormalizedStroke(ctx, stroke, w, h);
    }

    // 2. Draw active local draft stroke
    if (draftPointsRef.current.length > 0) {
      const draftStroke: SynchronizedStroke = {
        id: "draft",
        senderId: userId,
        senderName: userName,
        senderRole: userRole,
        tool,
        color,
        width,
        points: draftPointsRef.current,
        slideIndex,
        createdAt: Date.now(),
      };
      drawNormalizedStroke(ctx, draftStroke, w, h);
    }

    // 3. Draw remote pointers
    for (const p of remotePointers) {
      if (p.active && p.point) {
        drawRemotePointer(ctx, p, w, h);
      }
    }

    // 4. Draw local laser pointer if active
    if (tool === "laser" && currentPointerRef.current) {
      const px = denormalizeStageCoordinates(currentPointerRef.current, w, h);
      drawLaserDot(ctx, px.x, px.y, color, userName);
    }
  }, [remoteStrokes, remotePointers, slideIndex, tool, color, width, userId, userName, userRole]);

  // Handle Canvas Resize and DPI Scaling
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

  // Pointer Down / Start Drawing
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!wrapRef.current) return;
    if (!isInteractive && !isPointerOnly) return;

    const rect = wrapRef.current.getBoundingClientRect();
    const normPt = normalizeStageCoordinates(e.clientX, e.clientY, rect);

    if (tool === "laser" || tool === "pointer") {
      currentPointerRef.current = normPt;
      onEmitPointer?.(normPt, true);
      redraw();
      return;
    }

    if (!isInteractive) return;

    isDrawingRef.current = true;
    draftPointsRef.current = [normPt];
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    redraw();
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const normPt = normalizeStageCoordinates(e.clientX, e.clientY, rect);

    if (tool === "laser" || tool === "pointer") {
      currentPointerRef.current = normPt;
      onEmitPointer?.(normPt, true);
      redraw();
      return;
    }

    if (isDrawingRef.current && isInteractive) {
      draftPointsRef.current.push(normPt);
      redraw();
    }
  };

  // Pointer Up / Finish Stroke
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === "laser" || tool === "pointer") {
      currentPointerRef.current = null;
      onEmitPointer?.({ x: 0, y: 0 }, false);
      redraw();
      return;
    }

    if (!isDrawingRef.current || !isInteractive) return;
    isDrawingRef.current = false;

    if (draftPointsRef.current.length > 1) {
      const newStroke: SynchronizedStroke = {
        id: `stroke-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        senderId: userId,
        senderName: userName,
        senderRole: userRole,
        tool,
        color,
        width,
        points: [...draftPointsRef.current],
        slideIndex,
        createdAt: Date.now(),
      };

      localStrokesRef.current.push(newStroke);
      setUndoStack((prev) => [...prev, newStroke]);
      setRedoStack([]);
      onEmitStroke?.(newStroke);
    }

    draftPointsRef.current = [];
    redraw();
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
    localStrokesRef.current = localStrokesRef.current.filter((s) => s.id !== last.id);
    redraw();
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, next]);
    localStrokesRef.current.push(next);
    onEmitStroke?.(next);
    redraw();
  };

  const handleClear = () => {
    localStrokesRef.current = [];
    setUndoStack([]);
    setRedoStack([]);
    draftPointsRef.current = [];
    if (isTeacher) {
      onClearAll?.();
    }
    redraw();
  };

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-30 touch-none select-none pointer-events-auto"
      style={{ cursor: tool === "laser" ? "crosshair" : tool === "pointer" ? "default" : "crosshair" }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 h-full w-full"
      />

      {/* Floating Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border-2 border-sand-deep bg-white/95 px-4 py-2 shadow-xl backdrop-blur-md z-40">
        {/* Tool Selectors */}
        <div className="flex items-center gap-1">
          {TOOLS.map((t) => {
            const isSelected = tool === t.id;
            const isAllowed = isInteractive || (isPointerOnly && (t.id === "laser" || t.id === "pointer"));
            if (!isAllowed) return null;

            return (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                title={`${t.label} (${t.key})`}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-base transition-transform cursor-pointer ${
                  isSelected
                    ? "bg-ocean text-white scale-110 shadow-md ring-2 ring-ocean/30"
                    : "text-ink hover:bg-sand-deep"
                }`}
              >
                {t.emoji}
              </button>
            );
          })}
        </div>

        {/* Color Palette (only for draw tools) */}
        {isInteractive && tool !== "laser" && tool !== "pointer" && tool !== "eraser" && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-sand-deep">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-5 w-5 rounded-full border border-black/10 transition-transform cursor-pointer ${
                  color === c ? "scale-125 ring-2 ring-ocean shadow-sm" : "hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
                title={`Color: ${c}`}
              />
            ))}
          </div>
        )}

        {/* Undo / Clear Actions */}
        {isInteractive && (
          <div className="flex items-center gap-1 pl-2 border-l border-sand-deep">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="flex h-8 px-2.5 items-center justify-center rounded-lg text-xs font-bold text-ink hover:bg-sand-deep disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              ↩ Undo
            </button>
            <button
              onClick={handleClear}
              className="flex h-8 px-2.5 items-center justify-center rounded-lg text-xs font-bold text-sunset hover:bg-sunset/10 cursor-pointer"
              title={isTeacher ? "Clear all board annotations" : "Clear your annotations"}
            >
              🗑️ Clear
            </button>
          </div>
        )}

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-sand-deep text-xs font-bold text-ink hover:bg-ink hover:text-white cursor-pointer"
            title="Close whiteboard (Esc)"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

// ── Rendering Utilities ───────────────────────────────────────

function drawNormalizedStroke(
  ctx: CanvasRenderingContext2D,
  stroke: SynchronizedStroke,
  w: number,
  h: number
) {
  if (!stroke.points || stroke.points.length === 0) return;

  const pts = stroke.points.map((p) => denormalizeStageCoordinates(p, w, h));

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = stroke.width;

  if (stroke.tool === "highlighter") {
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = stroke.width * 2.5;
  } else if (stroke.tool === "underline") {
    ctx.lineWidth = 4;
  }

  if (stroke.tool === "circle" && pts.length >= 2) {
    const a = pts[0];
    const b = pts[pts.length - 1];
    const rx = Math.abs(b.x - a.x) / 2;
    const ry = Math.abs(b.y - a.y) / 2;
    const cx = Math.min(a.x, b.x) + rx;
    const cy = Math.min(a.y, b.y) + ry;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (stroke.tool === "rect" && pts.length >= 2) {
    const a = pts[0];
    const b = pts[pts.length - 1];
    ctx.beginPath();
    ctx.strokeRect(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y),
      Math.abs(b.x - a.x),
      Math.abs(b.y - a.y)
    );
    ctx.restore();
    return;
  }

  if ((stroke.tool === "line" || stroke.tool === "arrow") && pts.length >= 2) {
    const a = pts[0];
    const b = pts[pts.length - 1];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    if (stroke.tool === "arrow") {
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      const headlen = 16;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(
        b.x - headlen * Math.cos(angle - Math.PI / 6),
        b.y - headlen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(
        b.x - headlen * Math.cos(angle + Math.PI / 6),
        b.y - headlen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // Freehand path (pen, highlighter, underline, eraser)
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawLaserDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  name: string
) {
  ctx.save();
  // Glowing laser dot
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fill();

  // Name tag
  ctx.font = "bold 11px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowBlur = 4;
  ctx.shadowColor = "rgba(0,0,0,0.8)";
  ctx.fillText(name, x + 12, y + 4);
  ctx.restore();
}

function drawRemotePointer(
  ctx: CanvasRenderingContext2D,
  p: RemotePointer,
  w: number,
  h: number
) {
  const pt = denormalizeStageCoordinates(p.point, w, h);
  drawLaserDot(ctx, pt.x, pt.y, p.color || "#e4573b", p.displayName);
}
