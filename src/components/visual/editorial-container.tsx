import React from "react";
import { WJ_SCENE_WIDTHS } from "./tokens";

export type EditorialLayoutVariant =
  | "asymmetric-7-5"
  | "asymmetric-5-7"
  | "split-equal"
  | "editorial-single"
  | "full-bleed";

export type SceneWidth = "standard" | "wide" | "ultrawide" | "4k";

interface EditorialContainerProps {
  as?: React.ElementType;
  variant?: EditorialLayoutVariant;
  sceneWidth?: SceneWidth;
  className?: string;
  children?: React.ReactNode;
  narrativeContent?: React.ReactNode;
  visualContent?: React.ReactNode;
  environmentalBleed?: boolean;
  id?: string;
}

const WIDTH_CLASSES: Record<SceneWidth, string> = {
  standard: WJ_SCENE_WIDTHS.standard,
  wide: `${WJ_SCENE_WIDTHS.standard} ${WJ_SCENE_WIDTHS.wide}`,
  ultrawide: `${WJ_SCENE_WIDTHS.standard} ${WJ_SCENE_WIDTHS.wide} ${WJ_SCENE_WIDTHS.ultrawide}`,
  "4k": `${WJ_SCENE_WIDTHS.standard} ${WJ_SCENE_WIDTHS.wide} ${WJ_SCENE_WIDTHS.ultrawide} ${WJ_SCENE_WIDTHS["4k"]}`,
};

/**
 * EditorialContainer Primitive (WJ-V1.1)
 *
 * Implements native 4K responsive layout constraints with intentional asymmetry:
 * - 3840x2160 (4K): uses horizontal canvas, allows atmospheric scenery to reach edges,
 *   maintains editorial focal points, prevents text paragraphs from stretching past 65ch.
 * - Mobile to 2K: smooth fluid padding and responsive column stacking.
 */
export function EditorialContainer({
  as: Component = "section",
  variant = "editorial-single",
  sceneWidth = "4k",
  className = "",
  children,
  narrativeContent,
  visualContent,
  environmentalBleed = false,
  id,
}: EditorialContainerProps) {
  const containerWidthClass = WIDTH_CLASSES[sceneWidth];

  return (
    <Component
      id={id}
      className={`relative w-full ${environmentalBleed ? "overflow-visible" : "overflow-hidden"} ${className}`}
    >
      <div
        className={`${containerWidthClass} mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-16 4k:px-24`}
      >
        {variant === "editorial-single" && (
          <div className="w-full">
            {children}
          </div>
        )}

        {variant === "asymmetric-7-5" && (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 2xl:gap-16 4k:gap-24 items-center">
            <div className="lg:col-span-7 flex flex-col items-start text-left w-full">
              <div className="w-full max-w-[65ch]">
                {narrativeContent || children}
              </div>
            </div>
            <div className="lg:col-span-5 relative w-full flex flex-col items-center">
              {visualContent}
            </div>
          </div>
        )}

        {variant === "asymmetric-5-7" && (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 2xl:gap-16 4k:gap-24 items-center">
            <div className="lg:col-span-5 relative w-full flex flex-col items-center order-2 lg:order-1">
              {visualContent}
            </div>
            <div className="lg:col-span-7 flex flex-col items-start text-left w-full order-1 lg:order-2">
              <div className="w-full max-w-[65ch]">
                {narrativeContent || children}
              </div>
            </div>
          </div>
        )}

        {variant === "split-equal" && (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 4k:gap-20 items-center">
            <div className="lg:col-span-6 flex flex-col items-start text-left w-full">
              <div className="w-full max-w-[60ch]">
                {narrativeContent || children}
              </div>
            </div>
            <div className="lg:col-span-6 relative w-full flex flex-col items-center">
              {visualContent}
            </div>
          </div>
        )}

        {variant === "full-bleed" && (
          <div className="w-full">
            {children}
          </div>
        )}
      </div>
    </Component>
  );
}
