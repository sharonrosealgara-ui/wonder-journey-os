# Checkpoint: Wonder Journey Primary-Source Historical Context Scoping Integrated

**Date:** 2026-09-07  
**Type:** Factual & Provenance Integrity / Curriculum Adventure Context Scoping  
**Status:** IMPLEMENTED, VERIFIED & MERGED TO MAIN  

---

## Summary

Completed the owner-approved Primary-Source Historical Context Scoping remediation under Fast Integration + Bounded Autonomy. Resolved the structural defect in `slide-views.tsx` where broad media classification (`primary_source_scan`) was previously conflated with specific asset identity (the 1734 Murillo Velarde map), causing non-map historical primary sources (specifically `media-l11-primary`) to display 1734 map context notices and offer the `HistoricalMapViewer` interactive modal.

Instituted strict identity-based scoping:
1. Murillo Velarde 1734 map context notice, attribution (Pedro Murillo Velarde, Nicolás de la Cruz Bagay, Francisco Suárez), and `HistoricalMapViewer` interactive modal trigger are strictly isolated to `media-l01-secondary`.
2. Genuine non-map primary sources (such as `media-l11-primary`, Narra botanical illustration from *Flora de Filipinas* by Francisco Manuel Blanco) receive a truthful, generic "Historical Primary Source" notice displaying authentic archival metadata without fabricated dates, archives, or map viewer triggers.
3. Verified zero regression across all other asset types: L12 (`original_diagram`), L31 (`photograph`), and L50 (`photograph`).
4. Preserved the database invariant: strictly 8 migrations (0 SQL modifications).
5. Maintained the local stash on `feat/v1-2-public-landing-page` (`stash@{0}`).

---

## Technical Changes

### 1. Adventure Slide Views (`src/components/adventure/slide-views.tsx`)
- **Strict Identity Scoping:** Replaced the broad `isHistoricalMap` check with separate predicates:
  ```typescript
  const isMurilloVelardeMap = activeMedia?.id === "media-l01-secondary";
  const isPrimarySource = activeMedia?.classification === "primary_source_scan";
  ```
- **Header Icon Treatment:**
  ```typescript
  isVideo ? VideoIcon : isMurilloVelardeMap ? MapIcon : isPrimarySource ? FileText : ImageIcon
  ```
- **Modal & Trigger Guard:** "View and Explore Full Map" button and `HistoricalMapViewer` modal are guarded strictly by `isMurilloVelardeMap`.
- **Generic Primary Source Context:** Rendered for `!isMurilloVelardeMap && isPrimarySource`, utilizing `activeMedia.description` or truthful fallback archival metadata (`activeMedia.title`, `activeMedia.creator`, `activeMedia.organization`).
- **Active Media Resolution:** Enhanced `activeMedia` resolution to match the slide's media moment index with graceful fallback to `lessonMedia[1] || lessonMedia[0]`.

### 2. Media Registry Lookup (`src/config/media-registry.ts`)
- Added prefix fallback in `getMediaForLesson` matching `lesson-XX-` when an exact slug varies across curriculum definitions (e.g. `lesson-31-history-timeline` resolving to `lesson-31-lapu-lapu`).

### 3. Regression Test Suite (`tests/primary-source-historical-context.test.ts`)
Created an automated 10-point test suite integrated into `npm test` verifying:
- Exactly 2 `primary_source_scan` assets exist across the 130 runtime media: `media-l01-secondary` and `media-l11-primary`.
- Defect reproduction and regression: `primary_source_scan` does not imply Murillo Velarde map treatment.
- `media-l01-secondary` retains 1734 context, creator attribution, and map viewer capabilities.
- `media-l11-primary` receives generic archival metadata without 1734 map context.
- `media-l12-primary` remains `original_diagram` with no map leaks.
- `media-l31-secondary` remains `photograph` of Magellan Shrine with zero Laguna Copperplate text.
- `media-l50-primary` remains `photograph` of handcrafted wooden spoons with zero recipe text.
- Missing optional metadata produces no fabricated fallback facts or empty headers.
- Static analysis of `slide-views.tsx` ensures proper scoping predicates and guards.
- Migration invariant: database migration count remains strictly 8.

### 4. Visual QA Verification & Screenshots (`scripts/visual-qa-primary-source-scoping.js`)
Executed automated Playwright visual testing across desktop (1280x800) and mobile (390x844) viewports with authenticated session emulation:
- `01-lesson-1-1734-map-desktop.png`: 1734 notice, Murillo Velarde attribution, and full map button verified.
- `01b-lesson-1-map-viewer-open-desktop.png`: `HistoricalMapViewer` modal verified open and dismissible with Escape key.
- `02-lesson-11-non-map-primary-source-desktop.png`: Generic "Historical Primary Source" label, creator Blanco, no map button.
- `03-lesson-12-diagram-regression-desktop.png`: Diagram presentation, no map button, no 1734 text.
- `04-lesson-31-photograph-regression-desktop.png`: Photograph presentation, no 1734 text, no Laguna text.
- `05-lesson-50-photograph-regression-desktop.png`: Photograph presentation, no 1734 text, no recipe text.
- `06-mobile-lesson-1-1734-map-390x844.png`: Mobile layout for 1734 map verified.
- `07-mobile-lesson-11-primary-source-390x844.png`: Mobile layout for non-map primary source verified.

---

## Git Provenance

- **Product Commit:** `efe8c82fix(adventure): scope 1734 historical map context and viewer to Murillo Velarde map identity`
- **Parent Commit:** `590170c57337952564cdf0304c1f2c343e0dce04`
- **Pull Request:** #14 (Merged into `main` via strict fast-forward)
- **CI Run:** 34048000922 (All 30 release gates passed green in 4m24s)
