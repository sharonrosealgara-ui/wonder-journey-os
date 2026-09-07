"use client";

import React from "react";
import dynamic from "next/dynamic";
import HeroStaticFallback from "./hero-static-fallback";

// In Next.js App Router, dynamic import with ssr: false is supported in Client Components
const HeroSignatureScene = dynamic(() => import("./hero-signature-scene"), {
  ssr: false,
  loading: () => <HeroStaticFallback />,
});

export default function Hero3DWrapper() {
  return <HeroSignatureScene />;
}
