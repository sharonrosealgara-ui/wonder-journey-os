import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

export const dynamic = "force-static";

// Progressive Web App manifest — lets families install Wonder Journey
// on desktop, tablet, and mobile. Offline caching is a future phase
// (service worker); install + standalone display work today.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brand.productName} — ${brand.worldName}`,
    short_name: brand.productName,
    description: brand.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#c9dff2",
    theme_color: "#c9dff2",
    orientation: "any",
    icons: [
      // PNG sizes phones require for the real "install app" experience
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // maskable = Android adaptive icons (circle/squircle) never clip the flower
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
