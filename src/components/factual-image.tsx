import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export interface FactualMedia {
  url: string;
  status: "verified" | "owner-supplied" | "pending" | "rejected";
  caption?: string;
  alt?: string;
  citation?: string;
}

interface FactualImageProps {
  media: FactualMedia;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

export function FactualImage({ media, className = "", fill = false, priority = false }: FactualImageProps) {
  const isVerified = media.status === "verified" || media.status === "owner-supplied";

  return (
    <figure className={`relative overflow-hidden rounded-xl bg-sand group ${className}`}>
      <div className={fill ? "absolute inset-0" : "relative w-full aspect-[4/3]"}>
        <Image
          src={media.url}
          alt={media.alt || media.caption || "Factual Image"}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Subtle gradient overlay to ensure caption legibility */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent pointer-events-none" />
      </div>

      {(media.caption || isVerified) && (
        <figcaption className="absolute bottom-0 left-0 right-0 p-4 pt-8 text-white">
          <div className="flex items-start gap-2">
            {isVerified && (
              <span className="shrink-0 mt-0.5" title="Verified Information">
                <CheckCircle2 className="w-4 h-4 text-mango" />
              </span>
            )}
            <div className="text-sm leading-snug drop-shadow-md flex-1">
              {media.caption && <span className="font-semibold">{media.caption}</span>}
              {media.citation && (
                <span className="block text-xs text-white/80 mt-0.5">
                  Source: {media.citation}
                </span>
              )}
            </div>
          </div>
        </figcaption>
      )}
    </figure>
  );
}
