import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export — the app is 100% client-side (localStorage),
  // so it deploys as plain HTML/JS to Netlify (out/) with no server.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
