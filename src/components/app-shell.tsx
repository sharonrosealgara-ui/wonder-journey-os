"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { brand } from "@/config/brand";
import { navItems, normalizeMode, type Mode } from "@/config/navigation";
import { getStudent } from "@/config/family";
import { KEYS } from "@/lib/app-state";
import { useStored } from "@/lib/storage";
import { BirthdayPopup } from "@/components/birthday-popup";
import { TropicalDecor } from "@/components/tropical-decor";

// Wonder Journey has exactly two portals (Decision 040):
//   👨‍👩‍👧‍👦 Family Portal — the warm adventure world, zero admin controls
//   🍎 Teacher Portal — Sharon's organized studio, tools first
// They must feel like completely different experiences.

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [rawMode, setMode] = useStored<string>(KEYS.mode, "family");
  const mode: Mode = normalizeMode(rawMode);
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const student = getStudent(activeStudentId);
  const isHome = pathname === "/";
  const isTeacher = mode === "teacher";

  const visibleNav = navItems.filter((item) => item.modes.includes(mode));

  function switchMode(target: Mode) {
    setMode(target);
    router.push(target === "teacher" ? "/teacher" : "/today");
  }

  return (
    <div className="min-h-screen">
      <TropicalDecor />
      <header
        className={`sticky top-0 z-40 border-b-2 bg-paper/85 backdrop-blur ${
          isTeacher ? "border-hibiscus/40" : "border-sand-deep"
        }`}
      >
        {/* teacher mode gets a distinct studio stripe */}
        {isTeacher && (
          <div className="bg-gradient-to-r from-hibiscus/15 via-ube/15 to-hibiscus/15 px-4 py-0.5 text-center text-[11px] font-bold text-hibiscus-deep">
            🍎 Teacher Studio — {brand.productName}
          </div>
        )}
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href={isTeacher ? "/teacher" : "/"} className="flex items-center gap-2">
            <span className="text-3xl">{isTeacher ? "🍎" : brand.logoEmoji}</span>
            <div className="leading-tight">
              <div
                className={`font-display text-lg font-bold ${
                  isTeacher ? "text-hibiscus-deep" : "text-sunset-deep"
                }`}
              >
                {brand.productName}
              </div>
              <div className="hidden text-xs text-ink-soft sm:block">
                {isTeacher ? "Teacher Studio" : brand.worldName}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {!isTeacher && student && (
              <span
                className="wj-chip"
                style={{ background: `${student.color}22`, color: student.color }}
              >
                {student.emoji} {student.name}
              </span>
            )}
            <div className="flex rounded-full border-2 border-sand-deep bg-white p-1">
              <button
                onClick={() => switchMode("family")}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  !isTeacher ? "bg-ocean text-white" : "text-ink-soft hover:bg-sand-deep"
                }`}
                title="Family Portal"
              >
                <span className="sm:hidden">👨‍👩‍👧‍👦</span>
                <span className="hidden sm:inline">👨‍👩‍👧‍👦 Family</span>
              </button>
              <button
                onClick={() => switchMode("teacher")}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  isTeacher ? "bg-hibiscus text-white" : "text-ink-soft hover:bg-sand-deep"
                }`}
                title="Teacher Portal"
              >
                <span className="sm:hidden">🍎</span>
                <span className="hidden sm:inline">🍎 Teacher</span>
              </button>
            </div>
          </div>
        </div>

        {!isHome && (
          <nav className="mx-auto max-w-6xl overflow-x-auto px-4 pb-2">
            <div className="flex gap-2">
              {visibleNav.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
                      active
                        ? `${isTeacher ? "bg-hibiscus" : "bg-sunset"} text-white shadow`
                        : "bg-white text-ink-soft hover:bg-sand-deep"
                    }`}
                  >
                    {item.emoji} {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 pb-16">{children}</main>

      <BirthdayPopup />

      <footer className="font-hand relative z-10 pb-8 text-center text-base text-ink-soft">
        {brand.footer}
      </footer>
    </div>
  );
}
