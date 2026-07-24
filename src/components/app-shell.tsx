"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/config/brand";
import { familyNav, normalizeMode, teacherNav, type Mode } from "@/config/navigation";
import { KEYS } from "@/lib/app-state";
import { familyName, teacherName } from "@/config/family";
import { useProgress } from "@/lib/progress";
import { initMute, setMuted, sfx } from "@/lib/sound";
import { removeStored, useStored } from "@/lib/storage";
import { AccessGate } from "@/components/access-gate";
import { BirthdayPopup } from "@/components/birthday-popup";
import { CameraDock } from "@/components/camera-dock";
import { TropicalDecor } from "@/components/tropical-decor";
import { CallProvider } from "@/lib/call-context";

// 🌴 Home Base layout — left sidebar + XP top bar, like a family
// learning clubhouse. The Adventure Theater portals over all of this.

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // mode is decided by the code entered at the door (two-code system)
  const [rawMode] = useStored<string>(KEYS.mode, "family");
  const mode: Mode = normalizeMode(rawMode);
  const [open, setOpen] = useState(false); // mobile drawer
  const [theme, setTheme] = useStored<string>("theme", "light");
  const [displayName, setDisplayName] = useStored<string>("displayName", "");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

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
            <SidebarLink key={item.href} item={item} active={isActive(item.href)} />
          ))}

          {/* 🍎 Teacher Portal — exists ONLY on the teacher's device.
              The role comes from the code entered at the door (two-code
              system), so the family never sees teacher tools at all. */}
          {mode === "teacher" && (
            <>
              <div className="mt-5 px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
                Teacher Portal
              </div>
              {teacherNav.map((item) => (
                <SidebarLink key={item.href} item={item} active={isActive(item.href)} />
              ))}
            </>
          )}
        </nav>

        {/* ✏️ This device's camera name — shown right in the sidebar so a
            wrong name (typed by mistake at sign-in, e.g. "Winny" instead
            of "Ferrell Family") is spotted immediately, and fixable in
            one tap without a full sign-out. */}
        <div className="mx-3 mb-2 rounded-2xl bg-white/10 px-3.5 py-2.5">
          {editingName ? (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setDisplayName(nameDraft.trim() || (mode === "teacher" ? teacherName : familyName));
                    setEditingName(false);
                  }
                  if (e.key === "Escape") setEditingName(false);
                }}
                placeholder={mode === "teacher" ? teacherName : familyName}
                className="min-w-0 flex-1 rounded-lg bg-white/90 px-2 py-1 text-sm text-ink outline-none"
              />
              <button
                onClick={() => {
                  setDisplayName(nameDraft.trim() || (mode === "teacher" ? teacherName : familyName));
                  setEditingName(false);
                }}
                className="rounded-full bg-mango px-2 py-1 text-xs font-bold text-ink-soft"
              >
                ✓
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setNameDraft(displayName);
                setEditingName(true);
              }}
              className="flex w-full items-center justify-between gap-2 text-left"
              title="Tap to fix this device's camera name"
            >
              <span className="min-w-0 truncate text-[13px] text-white/85">
                📷 {displayName || (mode === "teacher" ? teacherName : familyName)}
              </span>
              <span className="shrink-0 text-[11px] text-white/50">✏️ edit</span>
            </button>
          )}
        </div>

        {/* 🔒 Sign out — hands the device back to the front door. Clears
            WHO is signed in (code, name, role, guest) but never touches
            the family's treasures (journals, blessings, photos, stamps). */}
        <button
          onClick={() => {
            ["classCode", "displayName", "mode", "guest", "codePromptDismissed"].forEach(removeStored);
            window.location.assign("/");
          }}
          className="mx-3 mb-5 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left font-display text-[13px] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <span className="text-base">🔒</span> Sign out
        </button>
      </aside>

      {/* ── Main column ─────────────────────────────────────── */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <TopBar
          onMenu={() => setOpen(true)}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          teacherMode={mode === "teacher"}
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
}: {
  item: { href: string; label: string; emoji: string };
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      onClick={() => sfx.tap()}
      className={`mt-1 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 font-display text-[15px] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 ${
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
}: {
  onMenu: () => void;
  theme: string;
  onToggleTheme: () => void;
  teacherMode: boolean;
}) {
  const p = useProgress();
  const pct = Math.round((p.xpInLevel / p.xpForLevel) * 100);

  // 🔊 the app's gentle sound layer (synthesized, no files) — one master
  // mute in the header controls every pop, thud, and chime
  const [soundMuted, setSoundMuted] = useState(false);
  useEffect(() => setSoundMuted(initMute()), []);
  function toggleSound() {
    setSoundMuted((m) => {
      const next = !m;
      setMuted(next);
      if (!next) sfx.correct();
      return next;
    });
  }

  function fullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => {});
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b-2 border-sand-deep bg-paper/85 px-4 py-2.5 backdrop-blur sm:px-6">
      <button className="wj-chip lg:hidden" onClick={onMenu} aria-label="Open menu">
        ☰
      </button>

      {/* Explorer level + XP — a 3D-inset track with a star riding the
          progress edge, so growth feels physical */}
      <div className="hidden min-w-0 items-center gap-3 sm:flex">
        <span className="font-display text-sm text-ink">Explorer Level {p.level}</span>
        {/* Zero-lag rule: the fill animates with transform (scaleX), never
            width/left — GPU-cheap even on an old iPad */}
        <div className="relative h-3.5 w-28 overflow-hidden rounded-full bg-sand-deep shadow-[inset_0_2px_4px_rgba(44,27,24,0.28)] md:w-40">
          <div
            className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-mango to-sunset shadow-[inset_0_-2px_3px_rgba(44,27,24,0.18)] transition-transform duration-700 ease-out"
            style={{ transform: `scaleX(${pct / 100})` }}
          />
          <span
            className="wj-sticker absolute top-1/2 h-6 w-6 -translate-y-1/2 text-xs"
            style={{ left: `calc(${Math.min(Math.max(pct, 5), 95)}% - 12px)` }}
            aria-hidden
          >
            ⭐
          </span>
        </div>
        <span className="text-xs font-bold text-ink-soft">
          {p.xpInLevel} / {p.xpForLevel} XP
        </span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Counter emoji="⭐" value={p.points} label="Points" />
        <Counter emoji="🛂" value={p.stamps} label="Stamps" />
        <Counter emoji="🏅" value={p.badgesEarned} label="Badges" />

        {/* the teacher's device wears a quiet badge — the role comes from
            her code, so there is nothing to "exit" anymore */}
        {teacherMode && (
          <span className="wj-chip !bg-hibiscus/15 !text-hibiscus-deep" title="This device holds the teacher code">
            🍎 <span className="hidden sm:inline">Teacher</span>
          </span>
        )}
        <button
          className="wj-chip hover:bg-mango/20"
          onClick={toggleSound}
          title={soundMuted ? "Turn sounds on" : "Turn sounds off"}
          aria-label="Toggle sounds"
        >
          {soundMuted ? "🔇" : "🔊"}
        </button>
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
