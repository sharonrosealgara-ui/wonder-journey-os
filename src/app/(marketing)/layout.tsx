import Link from "next/link";
import { Compass, LogIn } from "lucide-react";
import { isInquiryFormEnabled } from "@/lib/inquiry-config";
import MobileNav from "./mobile-nav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const formEnabled = isInquiryFormEnabled();

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink overflow-x-hidden">
      {/* ── HEADER: 4K FLUID ART-DIRECTED BAR ── */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b border-sand-deep/70 shadow-xs">
        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16 h-16 sm:h-20 2xl:h-22 4k:h-26 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display text-xl sm:text-2xl 2xl:text-3xl 4k:text-4xl text-ocean-deep font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep focus-visible:ring-offset-2 rounded-lg"
          >
            <Compass className="w-6 h-6 sm:w-7 sm:h-7 2xl:w-8 2xl:h-8 text-ocean-deep" aria-hidden="true" />
            <span className="tracking-tight">Wonder Journey</span>
          </Link>

          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 4k:gap-10 font-display text-sm 2xl:text-base 4k:text-lg font-semibold">
            <Link
              href="/"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Home
            </Link>
            <Link
              href="/experience"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Experience
            </Link>
            <Link
              href="/learning"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Learning
            </Link>
            <Link
              href="/gallery"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              About
            </Link>
            <Link
              href="/safety"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Safety
            </Link>
            <Link
              href="/inquiry"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Inquiry
            </Link>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/inquiry"
              className="text-xs sm:text-sm 2xl:text-base text-ink/80 hover:text-ocean-deep transition-colors font-semibold hidden sm:inline-block px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Inquiry Info
            </Link>
            <Link
              href="/login"
              className="sm:hidden text-xs font-bold text-ocean-deep hover:text-ocean transition-colors px-3 py-1.5 rounded-lg border border-sand-deep/80 bg-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Login
            </Link>
            <div className="hidden sm:flex items-center">
              <Link
                href="/login"
                className="wj-btn whitespace-nowrap text-xs sm:text-sm 2xl:text-base 4k:text-lg px-4 sm:px-5 2xl:px-6 py-2 sm:py-2.5 4k:py-3 flex items-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep focus-visible:ring-offset-2"
              >
                <LogIn className="w-4 h-4 2xl:w-5 2xl:h-5" aria-hidden="true" />
                <span>{formEnabled ? "Login" : "Existing Family Login"}</span>
              </Link>
            </div>

            {/* Mobile Navigation Toggle & Drawer */}
            <MobileNav formEnabled={formEnabled} />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>

      {/* ── FOOTER: 4K FLUID DIGNIFIED FOOTER ── */}
      <footer className="bg-ocean-deep text-white py-14 sm:py-18 2xl:py-24 4k:py-28 border-t border-ocean-deep/80 relative">
        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4k:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 4k:px-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2.5 font-display text-xl sm:text-2xl 2xl:text-3xl text-white font-bold">
              <Compass className="w-6 h-6 2xl:w-8 2xl:h-8 text-mango" aria-hidden="true" />
              <span>Wonder Journey</span>
            </div>
            <p className="text-xs sm:text-sm 2xl:text-base 4k:text-lg text-white/85 mt-2.5 max-w-lg 4k:max-w-xl leading-relaxed font-medium">
              A Christ-centered learning community helping children grow in language, culture, character, knowledge, and faith across the 7,641 islands of the Philippines.
            </p>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs sm:text-sm text-white/70 font-semibold">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/experience" className="hover:text-white transition-colors">Experience</Link>
              <Link href="/learning" className="hover:text-white transition-colors">Learning</Link>
              <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/safety" className="hover:text-white transition-colors">Safety</Link>
              <Link href="/inquiry" className="hover:text-white transition-colors">Inquiry</Link>
              <Link href="/primary-sources" className="hover:text-mango transition-colors">Primary Sources</Link>
              <Link href="/login" className="hover:text-white transition-colors">Family Login</Link>
            </nav>
          </div>
          <div className="text-xs sm:text-sm 2xl:text-base text-white/75 md:text-right space-y-1.5 font-medium">
            <p>&copy; {new Date().getFullYear()} Wonder Journey. All rights reserved.</p>
            <p className="text-mango/90 font-semibold">Founder-Led Family Learning Community</p>
            <p className="text-[11px] sm:text-xs text-white/60 pt-1">
              Informational website for founding families. Public enrollment is currently closed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
