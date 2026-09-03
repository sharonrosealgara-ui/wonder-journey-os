"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Info, Compass, Shield } from "lucide-react";

interface HistoricalMapViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
}

export function HistoricalMapViewer({
  isOpen,
  onClose,
  imageSrc,
  title
}: HistoricalMapViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard controls & focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setZoom((z) => Math.min(3, z + 0.25));
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        setZoom((z) => Math.max(0.75, z - 0.25));
      } else if (e.key === "0") {
        e.preventDefault();
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPosition((p) => ({ ...p, x: p.x + 30 }));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPosition((p) => ({ ...p, x: p.x - 30 }));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setPosition((p) => ({ ...p, y: p.y + 30 }));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setPosition((p) => ({ ...p, y: p.y - 30 }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleMouseDown(e: React.MouseEvent) {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function resetView() {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Historical Map Interactive Viewer"
      className="fixed inset-0 z-[120] flex flex-col bg-ocean-deep/90 backdrop-blur-md text-paper overflow-hidden"
    >
      {/* Viewer Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-ocean-deep border-b border-sand-deep/30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-mango/20 text-mango flex items-center justify-center">
            <Compass className="w-5 h-5 text-mango" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-xl text-white font-bold">{title}</h2>
            <p className="text-xs text-white/70">
              Carta Hydrographica y Chorographica de las Yslas Filipinas (1734) &bull; Complete Primary Source Scan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-paper/10 rounded-xl p-1 border border-white/20">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
              aria-label="Zoom out (or press minus)"
              className="p-1.5 rounded-lg text-white hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mango"
            >
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="px-2 text-xs font-mono font-bold text-white/90 min-w-[3rem] text-center" aria-live="polite">
              {zoom === 1 ? "Fit" : `${Math.round(zoom * 100)}%`}
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              aria-label="Zoom in (or press plus)"
              className="p-1.5 rounded-lg text-white hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mango"
            >
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetView}
              aria-label="Reset zoom and position to Fit (or press 0)"
              title="Fit"
              className="p-1.5 ml-1 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mango"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close historical map explorer"
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mango cursor-pointer"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Historical Context Notice */}
      <div className="bg-sand/15 border-b border-sand/20 px-6 py-2.5 text-xs text-white/90 flex items-start gap-2.5 shrink-0">
        <Info className="w-4 h-4 text-mango shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="text-mango font-bold">Historical Primary Source Notice:</strong> This 1734 map was engraved during the Spanish colonial era by Jesuit father Pedro Murillo Velarde with Filipino artisans Nicolás de la Cruz Bagay and Francisco Suárez. The border illustrations, geographic labels, regional details, and historical terminology reflect 18th-century Spanish colonial-era perspectives and differ from modern geography and inclusive cultural understanding.
        </p>
      </div>

      {/* Map Pan & Zoom Stage */}
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing bg-ocean-deep/95 select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: isDragging ? "none" : "transform 180ms ease-out",
            maxHeight: "100%",
            maxWidth: "100%"
          }}
          className="relative flex items-center justify-center"
        >
          <img
            src={imageSrc}
            alt="Complete 1734 Carta Hydrographica y Chorographica de las Yslas Filipinas high-resolution archival scan"
            className="max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl pointer-events-none"
          />
        </div>
      </div>

      {/* Viewer Footer: Archival Provenance & License */}
      <div className="bg-ocean-deep border-t border-sand-deep/30 px-6 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/80">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span><strong>Creator:</strong> Pedro Murillo Velarde, Nicolás de la Cruz Bagay, Francisco Suárez</span>
          <span>&bull;</span>
          <span><strong>Date:</strong> 1734</span>
          <span>&bull;</span>
          <span><strong>Institutional Source:</strong> Biblioteca Nacional de España (BNE MR/45/31) / Library of Congress</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-palm/20 border border-palm/40 text-palm font-bold">
            <Shield className="w-3 h-3 text-palm" aria-hidden="true" />
            Public Domain
          </span>
          <span className="text-white/60">Keyboard: [+/-] zoom, [0] reset, [Arrows] pan</span>
        </div>
      </div>
    </div>
  );
}
