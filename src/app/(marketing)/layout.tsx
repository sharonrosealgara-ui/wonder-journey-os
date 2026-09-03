import Link from "next/link";
import { Compass, LogIn } from "lucide-react";
import { isInquiryFormEnabled } from "@/lib/inquiry-config";
import MobileNav from "./mobile-nav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const formEnabled = isInquiryFormEnabled();

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink overflow-x-hidden">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-sand-deep/60">
        <div className="max-w-6xl 2xl:max-w-[1440px] 3xl:max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-8 h-16 2xl:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl text-ocean-deep font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep focus-visible:ring-offset-2 rounded-lg"
          >
            <Compass className="w-6 h-6 text-ocean-deep" aria-hidden="true" />
            <span>Wonder Journey</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 font-display text-sm font-semibold">
            <Link
              href="#experience"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Experience
            </Link>
            <Link
              href="#gallery"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Curriculum Imagery
            </Link>
            <Link
              href="#focus"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Learning Focus
            </Link>
            <Link
              href="#family-space"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Family Space
            </Link>
            <Link
              href="#faith"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Faith
            </Link>
            <Link
              href="#founder"
              className="text-ink hover:text-ocean-deep transition-colors px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Founder
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="#inquiry"
              className="text-xs sm:text-sm text-ink hover:text-ocean-deep transition-colors font-semibold hidden sm:inline-block px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Inquiry Info
            </Link>
            <Link
              href="/login"
              className="sm:hidden text-xs font-bold text-ocean-deep hover:text-ocean transition-colors px-2.5 py-1.5 rounded-lg border border-sand-deep/80 bg-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
            >
              Login
            </Link>
            <div className="hidden sm:flex items-center">
              <Link
                href="/login"
                className="wj-btn text-xs sm:text-sm px-3.5 sm:px-4 py-2 flex items-center gap-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep focus-visible:ring-offset-2"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>{formEnabled ? 'Login' : 'Existing Family Login'}</span>
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

      {/* ── FOOTER ── */}
      <footer className="bg-ocean-deep text-white py-12 2xl:py-16 border-t border-ocean-deep/80">
        <div className="max-w-6xl 2xl:max-w-[1440px] 3xl:max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 font-display text-xl text-white font-bold">
              <Compass className="w-6 h-6 text-mango" aria-hidden="true" />
              <span>Wonder Journey</span>
            </div>
            <p className="text-xs text-white/85 mt-2 max-w-md leading-relaxed font-medium">
              Wonder Journey is a Christ-centered learning community helping children grow in language, culture, character, knowledge, and faith.
            </p>
          </div>
          <div className="text-xs text-white/75 md:text-right space-y-1">
            <p>&copy; {new Date().getFullYear()} Wonder Journey. All rights reserved.</p>
            <p>Founder-Led Family Learning Community</p>
            <p className="text-[11px] text-white/60 pt-1">
              Informational website. Public enrollment is currently closed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
