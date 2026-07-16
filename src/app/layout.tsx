import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { brand, siteUrl } from "@/config/brand";

const title = `${brand.productName} — ${brand.worldName}`;
const description = `${brand.tagline} ${brand.worldSubtitle}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: brand.productName,
  openGraph: {
    title,
    description,
    siteName: brand.productName,
    type: "website",
    url: siteUrl,
    images: [{ url: "/icon.svg", width: 512, height: 512, alt: brand.productName }],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/icon.svg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.svg",
    // iPhone/iPad "Add to Home Screen" icon — a real PNG, full-bleed
    apple: "/apple-touch-icon.png",
  },
  // Installed on a phone, Wonder Journey opens fullscreen like a native
  // app — no browser bar, just the adventure.
  appleWebApp: {
    capable: true,
    title: brand.productName,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#c9dff2",
  width: "device-width",
  initialScale: 1,
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
