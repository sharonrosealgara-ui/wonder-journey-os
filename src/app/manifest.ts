import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

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
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
