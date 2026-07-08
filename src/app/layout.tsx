import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: `${brand.productName} — ${brand.worldName}`,
  description: `${brand.tagline} ${brand.worldSubtitle}.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts load in the browser at runtime; the app falls back to
            friendly system fonts if offline. (Avoids build-time font fetching.) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Quicksand:wght@400;500;600;700&family=Patrick+Hand&family=Baloo+2:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
