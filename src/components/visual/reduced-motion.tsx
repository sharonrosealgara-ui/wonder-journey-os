"use client";

import React, { useState, useEffect } from "react";

/**
 * usePrefersReducedMotion Hook (WJ-V1.1)
 *
 * SSR-safe hook detecting user OS-level preference for reduced motion.
 * Respects accessibility guidelines: stops continuous loops, 3D parallax, and drifting particles.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

interface ReducedMotionSafeProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * ReducedMotionSafe Component
 *
 * Conditionally renders static fallback or disables motion classes when
 * the user has requested reduced motion.
 */
export function ReducedMotionSafe({
  children,
  fallback,
  className = "",
}: ReducedMotionSafeProps) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced && fallback) {
    return <div className={`motion-reduce:transform-none ${className}`}>{fallback}</div>;
  }

  return (
    <div
      className={`transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none motion-reduce:animate-none ${className}`}
    >
      {children}
    </div>
  );
}
