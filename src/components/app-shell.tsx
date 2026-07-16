"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/config/brand";
import { familyNav, normalizeMode, teacherNav, type Mode } from "@/config/navigation";
import { KEYS } from "@/lib/app-state";
import { useProgress } from "@/lib/progress";
import { useStored } from "@/lib/storage";
import { AccessGate } from "@/components/access-gate";
import { BirthdayPopup } from "@/components/birthday-popup";
import { CameraDock } from "@/components/camera-dock";
import { TropicalDecor } from "@/components/tropical-decor";
import { CallProvider } from "@/lib/call-context";

// 🌴 Home Base layout — left sidebar + XP top bar, like a family
// learning clubhouse. The Adventure Theater portals over all of this.

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [rawMode, setMode] = useStored<string>(KEYS.mode, "family");
  const mode: Mode = normalizeMode(rawMode);
  const [open, setOpen] = useState(false); // mobile drawer
  const [theme, setTheme] = useStored<string>("theme", "light");

  // apply dark mode to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("wj-dark", theme === "dark");
  }, [theme]);

  // close the mobile drawer on route change
  useEffect(() => setOpen(false), [pathname]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  // 🎥 Fullscreen Classroom Mode: /classroom is a dedicated teaching room —
  // no sidebar, no dashboard nav, no footer. Only the lesson, the cameras,
  // and the teaching tools (Decision 044). The CallProvider wraps BOTH
  // layouts so the live call survives every route change, and the
  // CameraDock keeps both cameras on screen everywhere else.
  if (pathname.startsWith("/classroom")) {
    return (
      <AccessGate>
        <CallProvider>
          <div className="min-h-screen px-3 py-3 sm:px-4">
            {children}
          </div>
          <CameraDock />
        </CallProvider>
      </AccessGate>
    );
  }

  return (
    <AccessGate>
    <CallProvider>
    <div className="min-h-screen lg:flex">
      <TropicalDecor />

      {/* mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ocean-deep text-white transition-transform lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mango text-2xl shadow-lg">
            🧭
          </span>
          <div className="leading-tight">
            <div className="font-display text-xl">{brand.productName.replace(" OS", "")}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              Family Learning OS
            </div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {familyNav.map((item) => (
            <SidebarLink key={item.href} item={item} active={isActive(item.href)} onClick={() => setMode("family")} />
          ))}

          <div className="mt-5 px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
            Teacher Portal
          </div>
          {teacherNav.map((item) => (
            <SidebarLink key={item.href} item={item} active={isActive(item.href)} onClick={() => setMode("teacher")} />
          ))}
        </nav>
      </aside>

      {/* ── Main column ─────────────────────────────────────── */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <TopBar
          onMenu={() => setOpen(true)}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          teacherMode={mode === "teacher"}
          onExitTeacher={() => {
            setMode("family");
            router.push("/");
          }}
        />

        <main className="flex-1 px-4 py-6 pb-16 sm:px-6">{children}</main>

        <BirthdayPopup />

        <footer className="font-hand pb-8 text-center text-base text-ink-soft">
          {brand.footer}
        </footer>
      </div>
    </div>
      <CameraDock />
    </CallProvider>
    </AccessGate>
  );
}

function SidebarLink({
  item,
  active,
  onClick,
}: {
  item: { href: string; label: string; emoji: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`mt-1 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 font-display text-[15px] transition-colors ${
        active ? "bg-white text-ocean-deep shadow" : "text-white/85 hover:bg-white/10"
      }`}
    >
      <span className="text-lg">{item.emoji}</span>
      {item.label}
    </Link>
  );
}

function TopBar({
  onMenu,
  theme,
  onToggleTheme,
  teacherMode,
  onExitTeacher,
}: {
  onMenu: () => void;
  theme: string;
  onToggleTheme: () => void;
  teacherMode: boolean;
  onExitTeacher: () => void;
}) {
  const p = useProgress();
  const pct = Math.round((p.xpInLevel / p.xpForLevel) * 100);

  function fullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => {});
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b-2 border-sand-deep bg-paper/85 px-4 py-2.5 backdrop-blur sm:px-6">
      <button className="wj-chip lg:hidden" onClick={onMenu} aria-label="Open menu">
        ☰
      </button>

      {/* Explorer level + XP */}
      <div className="hidden min-w-0 items-center gap-3 sm:flex">
        <span className="font-display text-sm text-ink">Explorer Level {p.level}</span>
        <div className="h-2.5 w-28 overflow-hidden rounded-full bg-sand-deep md:w-40">
          <div className="h-full rounded-full bg-gradient-to-r from-mango to-sunset" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-bold text-ink-soft">
          {p.xpInLevel} / {p.xpForLevel} XP
        </span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Counter emoji="⭐" value={p.points} label="Points" />
        <Counter emoji="🛂" value={p.stamps} label="Stamps" />
        <Counter emoji="🏅" value={p.badgesEarned} label="Badges" />

        {teacherMode && (
          <button className="wj-chip !bg-hibiscus/15 !text-hibiscus-deep" onClick={onExitTeacher}>
            🍎 <span className="hidden sm:inline">Exit Teacher</span>
          </button>
        )}
        <button className="wj-chip hover:bg-mango/20" onClick={fullscreen} title="Fullscreen" aria-label="Fullscreen">
          ⛶
        </button>
        <button
          className="wj-chip hover:bg-mango/20"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

function Counter({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <span className="wj-chip" title={label}>
      {emoji} <b className="text-ink">{value}</b>
      <span className="hidden text-ink-soft md:inline"> {label}</span>
    </span>
  );
}
