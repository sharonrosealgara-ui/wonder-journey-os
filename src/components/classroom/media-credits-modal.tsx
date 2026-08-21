"use client";

import React from "react";
import { X, ShieldCheck, ExternalLink, Image as ImageIcon, BookOpen } from "lucide-react";
import { FactualMedia } from "@/config/media-registry";

interface MediaCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: FactualMedia[];
  lessonTitle: string;
}

export function MediaCreditsModal({
  isOpen,
  onClose,
  mediaList,
  lessonTitle,
}: MediaCreditsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-credits-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-paper shadow-2xl overflow-hidden border-2 border-sand-deep">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-sand-deep bg-sand px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <h2 id="media-credits-title" className="font-display text-xl text-ink">
                Media Provenance &amp; Attribution
              </h2>
              <p className="text-xs text-ink-soft">{lessonTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close media provenance dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-soft hover:bg-sand-deep hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="rounded-2xl bg-palm/10 p-4 border border-palm/20 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-palm shrink-0 mt-0.5" />
            <p className="text-xs text-ink leading-relaxed">
              Every image, map, artifact, and diagram rendered in Wonder Journey OS is
              independently verified for authentic cultural fidelity, educational accuracy, and
              compliant open-access licensing.
            </p>
          </div>

          {mediaList.length === 0 ? (
            <p className="text-center text-sm text-ink-soft py-8">
              No specific media assets registered for this slide.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {mediaList.map((media) => (
                <div
                  key={media.id}
                  className="flex flex-col rounded-2xl border-2 border-sand-deep bg-white p-4 shadow-sm"
                >
                  <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-sand flex items-center justify-center border border-sand-deep">
                    <img
                      src={media.storedAssetPath}
                      alt={media.altText || media.descriptiveAltText || media.title}
                      className="h-full w-full object-contain"
                    />
                    <span className="absolute top-2 left-2 rounded-md bg-ink/75 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      {media.classification}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-ink leading-snug">
                    {media.title}
                  </h3>
                  <p className="font-hand text-sm text-ocean-deep mt-1 leading-snug">
                    {media.caption || media.factualCaption || media.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-sand-deep text-xs text-ink-soft space-y-1">
                    <p>
                      <strong>Source / Authority:</strong> {media.creator || media.creatorOrOrganization || media.sourceOrganization}
                    </p>
                    <p>
                      <strong>License:</strong> {media.license}
                    </p>
                    <p>
                      <strong>Purpose:</strong> {media.description || media.educationalPurpose}
                    </p>
                    <p className="font-mono text-[10px] text-ink-soft/70 truncate">
                      SHA256: {media.sha256Checksum || media.sha256}
                    </p>
                  </div>

                  {media.originalSourceUrl && (
                    <a
                      href={media.originalSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ocean hover:underline"
                    >
                      <span>View Source Repository</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-sand-deep bg-sand px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="rounded-full bg-ocean px-5 py-2 text-sm font-bold text-white shadow hover:bg-ocean-deep transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
