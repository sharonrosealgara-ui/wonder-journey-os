import Link from "next/link";
import { brand } from "@/config/brand";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-sand-deep/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display text-xl text-ocean-deep">
            <span className="text-2xl">🧭</span>
            {brand.productName}
          </Link>
          <nav className="hidden sm:flex items-center gap-6 font-display text-sm">
            <Link href="#features" className="text-ink-soft hover:text-ocean-deep transition-colors">Features</Link>
            <Link href="#process" className="text-ink-soft hover:text-ocean-deep transition-colors">Process</Link>
            <Link href="#contact" className="text-ink-soft hover:text-ocean-deep transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-display text-ocean-deep hover:text-ocean transition-colors hidden sm:inline-block">
              Login
            </Link>
            <Link href="#contact" className="wj-btn text-sm px-4 py-2">
              Book a Call
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-ocean-deep text-white/80 py-12 mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-display text-xl text-white">
            <span className="text-2xl">🧭</span>
            {brand.productName}
          </div>
          <div className="text-sm font-hand text-center md:text-right">
            &copy; {new Date().getFullYear()} {brand.productName}. All rights reserved.<br />
            Custom educational platforms for families and communities.
          </div>
        </div>
      </footer>
    </div>
  );
}
