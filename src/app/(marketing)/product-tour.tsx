"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Compass,
  Video,
  Home,
  Award,
  Layers,
  ExternalLink
} from "lucide-react";

interface TourView {
  id: string;
  label: string;
  category: string;
  badge: string;
  imageSrc: string;
  caption: string;
  description: string;
  highlights: string[];
}

const TOUR_VIEWS: TourView[] = [
  {
    id: "adventure",
    label: "Lesson Adventure",
    category: "Interactive Learning",
    badge: "Demo data",
    imageSrc: "/media/product-tour/tour-lesson-adventure.png",
    caption: "Adventure Theater: Storybook Presentation Mode",
    description:
      "Children journey through interactive story slides, authentic primary media, and guided oral language practice in a calm, focused environment.",
    highlights: [
      "Guided slide progression with island scenery",
      "Interactive questions and cultural stories",
      "Kid-friendly reading typography"
    ]
  },
  {
    id: "classroom",
    label: "Live Classroom",
    category: "Real-Time Connection",
    badge: "Demo data",
    imageSrc: "/media/product-tour/tour-live-classroom.png",
    caption: "Live Adventure Classroom: Guided Learning Stage",
    description:
      "An intimate 1-to-few learning stage connecting learners directly with Teacher Guide, built on dedicated, privacy-respecting video infrastructure.",
    highlights: [
      "Dedicated camera and audio stage",
      "Direct teacher guidance and community sharing",
      "Integrated curriculum media moments"
    ]
  },
  {
    id: "family-space",
    label: "Family Learning Space",
    category: "Home Portal",
    badge: "Demo data",
    imageSrc: "/media/product-tour/tour-family-space.png",
    caption: "Family Home Base: Central Portal Dashboard",
    description:
      "Parents and children gather in a shared workspace to review daily blessings, track destination journeys, and celebrate milestones together.",
    highlights: [
      "Shared family workspace greeting",
      "Quick access to today's adventure",
      "Overview of exploration progress and stamps"
    ]
  },
  {
    id: "progress",
    label: "Progress & Reflection",
    category: "Milestones",
    badge: "Demo data",
    imageSrc: "/media/product-tour/tour-progress-reflection.png",
    caption: "Family Travel Passport: Visual Exploration Record",
    description:
      "Learners earn tactile digital passport stamps and cultural badges as they explore the 82 provinces and three major island groups of the Philippines.",
    highlights: [
      "Provincial passport stamps and milestones",
      "Cultural learning reflections and memories",
      "Encouraging, mastery-based recognition"
    ]
  },
  {
    id: "teacher",
    label: "Teacher Studio",
    category: "Educator Center",
    badge: "Demo data",
    imageSrc: "/media/product-tour/tour-teacher-studio.png",
    caption: "Teacher Operations: Studio Command Center",
    description:
      "Educators coordinate curriculum progression, issue learner badges, and prepare individualized family updates.",
    highlights: [
      "Curriculum overview across 65 lessons",
      "Learner profiles and achievement issuance",
      "Studio tools for lesson preparation"
    ]
  }
];

export default function ProductTour() {
  const [activeTab, setActiveTab] = useState<string>("adventure");
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const activeView = TOUR_VIEWS.find((v) => v.id === activeTab) || TOUR_VIEWS[0];

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    let nextIndex = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % TOUR_VIEWS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + TOUR_VIEWS.length) % TOUR_VIEWS.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = TOUR_VIEWS.length - 1;
    }

    if (nextIndex >= 0) {
      const nextView = TOUR_VIEWS[nextIndex];
      setActiveTab(nextView.id);
      tabRefs.current[nextView.id]?.focus();
    }
  }

  return (
    <section
      id="tour"
      aria-labelledby="product-tour-heading"
      className="py-16 md:py-24 bg-gradient-to-b from-paper via-sand/20 to-paper border-b border-sand-deep/40 relative overflow-hidden"
    >
      <div className="max-w-6xl 2xl:max-w-[1440px] 3xl:max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-10 2xl:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean/15 border border-ocean/30 text-ocean-deep text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-ocean-deep" aria-hidden="true" />
            <span>Platform Tour</span>
          </div>
          <h2
            id="product-tour-heading"
            className="font-display text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl text-ocean-deep font-bold leading-tight"
          >
            See Wonder Journey in Action
          </h2>
          <p className="text-sm sm:text-base 2xl:text-lg text-ink/80 mt-2 leading-relaxed font-medium">
            Explore the real Wonder Journey learning experience through representative platform views.
          </p>
        </div>

        {/* Keyboard-Accessible Segmented Tabs */}
        <div className="flex justify-center mb-8">
          <div
            role="tablist"
            aria-label="Wonder Journey application views"
            className="flex flex-wrap justify-center gap-1.5 sm:gap-2 p-1.5 bg-sand/60 border border-sand-deep/80 rounded-2xl shadow-sm max-w-full overflow-x-auto"
          >
            {TOUR_VIEWS.map((view, index) => {
              const isSelected = activeTab === view.id;
              return (
                <button
                  key={view.id}
                  ref={(el) => { tabRefs.current[view.id] = el; }}
                  role="tab"
                  id={`tab-${view.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${view.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveTab(view.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`relative px-3 sm:px-4 py-2 rounded-xl font-display text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep focus-visible:ring-offset-2 ${
                    isSelected
                      ? "bg-ocean-deep text-white shadow-md transform -translate-y-0.5"
                      : "text-ink hover:text-ocean-deep hover:bg-white/80 bg-transparent"
                  }`}
                >
                  <span>{view.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Panel with Restrained Perspective and Layered Depth */}
        <div
          role="tabpanel"
          id={`panel-${activeView.id}`}
          aria-labelledby={`tab-${activeView.id}`}
          className="relative max-w-5xl 2xl:max-w-[1360px] 3xl:max-w-[1560px] mx-auto"
        >
          {/* Layered Underlay Card for Depth */}
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-y-3 translate-x-2 rounded-3xl bg-sand-deep/40 border border-sand-deep/60 -z-10 transition-transform duration-300 motion-reduce:transform-none"
          />

          {/* Primary View Card */}
          <div className="wj-card overflow-hidden border-2 border-sand-deep/90 bg-white shadow-xl rounded-3xl p-4 sm:p-6 lg:p-8">
            {/* View Header with True Product Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-sand-deep/50">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-mango-deep">
                  {activeView.category}
                </span>
                <h3 className="font-display text-lg sm:text-xl text-ocean-deep font-bold mt-0.5">
                  {activeView.caption}
                </h3>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand/80 border border-sand-deep/80 text-ink/70 text-[11px] font-medium">
                  <span>Demo data</span>
                </span>
              </div>
            </div>

            {/* Authentic Screenshot Display: Restrained Perspective, Never Distorted */}
            <div
              className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-sand/20 border border-sand-deep/60 shadow-inner group"
              style={{
                perspective: "1200px"
              }}
            >
              <div
                className="w-full h-full relative transition-transform duration-500 ease-out motion-reduce:transform-none group-hover:scale-[1.008]"
                style={{
                  transform: "rotateX(1deg) rotateY(-0.5deg)"
                }}
              >
                <Image
                  src={activeView.imageSrc}
                  alt={`${activeView.caption}: Representative Wonder Journey interface screenshot`}
                  fill
                  priority={activeView.id === "adventure"}
                  sizes="(max-width: 1024px) 100vw, 980px"
                  className="object-contain"
                />
              </div>
            </div>

            {/* View Explanation and Feature Highlights */}
            <div className="mt-6 grid md:grid-cols-12 gap-6 items-start pt-2">
              <div className="md:col-span-7">
                <p className="text-sm sm:text-base text-ink leading-relaxed font-medium">
                  {activeView.description}
                </p>
              </div>
              <div className="md:col-span-5 bg-sand/40 p-4 rounded-2xl border border-sand-deep/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ocean-deep mb-2">
                  Key Experience Elements
                </h4>
                <ul className="space-y-1.5 text-xs text-ink/85">
                  {activeView.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ocean-deep shrink-0" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
