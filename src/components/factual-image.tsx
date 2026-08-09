import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export type FactualMedia =
  | {
      status: "verified";
      url: string;
      alt: string;
      caption: string;
      sourceUrl: string;
      sourcePage: string;
      license: string;
      licenseUrl: string;
      attribution: string;
      focalPoint?: string;
    }
  | {
      status: "owner-supplied";
      url: string;
      alt: string;
      caption: string;
      ownerNote?: string;
      attribution?: string;
      focalPoint?: string;
    }
  | {
      status: "illustrative";
      url: string;
      alt: string;
      focalPoint?: string;
    }
  | {
      status: "pending";
    }
  | {
      status: "rejected";
    };

interface FactualImageProps {
  media: FactualMedia;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

export function FactualImage({ media, className = "", fill = false, priority = false }: FactualImageProps) {
  if (media.status === "pending" || media.status === "rejected") {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-sand/50 flex items-center justify-center ${className}`}>
        <div className={fill ? "absolute inset-0" : "relative w-full aspect-[4/3] flex items-center justify-center"}>
          <span className="text-ink-soft text-sm font-medium">Image not available</span>
        </div>
      </div>
    );
  }

  const isVerified = media.status === "verified";
  const isOwnerSupplied = media.status === "owner-supplied";
  const isIllustrative = media.status === "illustrative";

  const captionText = (media.status === "verified" || media.status === "owner-supplied") ? media.caption : undefined;

  // Format compact citation for verified media
  const citationText = media.status === "verified"
    ? `Source: ${media.attribution}`
    : media.status === "owner-supplied" && media.attribution
      ? `Source: ${media.attribution}`
      : undefined;

  return (
    <figure className={`relative overflow-hidden rounded-xl bg-sand group ${className}`}>
      <div className={fill ? "absolute inset-0" : "relative w-full aspect-[4/3]"}>
        <Image
          src={media.url}
          alt={media.alt}
          fill
          priority={priority}
          className="object-cover transition-transform duration-200 group-hover:scale-[1.01]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Subtle gradient overlay to ensure caption legibility */}
        {(captionText || citationText || isVerified) && (
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent pointer-events-none" />
        )}
      </div>

      {(captionText || isVerified || isIllustrative) && (
        <figcaption className="absolute bottom-0 left-0 right-0 p-4 pt-8 text-white pointer-events-none">
          <div className="flex items-start gap-2">
            {isVerified && (
              <span className="shrink-0 mt-0.5 pointer-events-auto" title="Verified Factual Media">
                <CheckCircle2 className="w-4 h-4 text-mango" />
              </span>
            )}
            <div className="text-sm leading-snug drop-shadow-md flex-1">
              {captionText && <span className="font-semibold block">{captionText}</span>}
              {citationText && (
                <span className="block text-xs text-white/80 mt-0.5">
                  {citationText}
                </span>
              )}
              {isIllustrative && (
                <span className="block text-xs text-white/60 italic mt-0.5">
                  Illustrative representation
                </span>
              )}
            </div>
          </div>
        </figcaption>
      )}
    </figure>
  );
}
