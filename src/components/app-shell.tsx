"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { brand } from "@/config/brand";
import { familyNav, teacherNav, type NavItem, type NavIcon } from "@/config/navigation";
import { familyName, teacherName } from "@/config/family";
import { useProgress } from "@/lib/progress";
import { initMute, setMuted, sfx } from "@/lib/sound";
import { useStored } from "@/lib/storage";
import { useAuth } from "@/lib/auth-context";
import { BirthdayPopup } from "@/components/birthday-popup";
import { CameraDock } from "@/components/camera-dock";
import { FamilyDecor } from "@/components/family-decor";
import { CallProvider } from "@/lib/call-context";
import {
  Home, Presentation, Map, BookHeart, BookOpen, Medal,
  PartyPopper, Trees, ChefHat, BookA, Languages, Film,
  LayoutDashboard, MessageCircle, Image as ImageIcon,
  LoaderCircle, Camera, Pencil, LogOut, Volume2, VolumeX, Maximize, Sun, Moon, Menu, Compass
} from "lucide-react";

function renderNavIcon(icon?: NavIcon, emoji?: string) {
  if (icon) {
    const props = { className: "w-5 h-5 opacity-90" };
    switch (icon) {
      case "home": return <Home {...props} />;
      case "classroom": return <Presentation {...props} />;
      case "map": return <Map {...props} />;
      case "passport": return <BookHeart {...props} />;
      case "award": return <Medal {...props} />;
      case "celebrations": return <PartyPopper {...props} />;
      case "backpack": return <Trees {...props} />;
      case "cooking": return <ChefHat {...props} />;
      case "journal": return <BookA {...props} />;
      case "language": return <Languages {...props} />;
      case "resources": return <Film {...props} />;
      case "lesson-plan": return <LayoutDashboard {...props} />;
      case "message": return <MessageCircle {...props} />;
      case "photos": return <ImageIcon {...props} />;
      case "blessings": return <Sun {...props} />;
    }
  }

  if (emoji) return <span className="text-lg w-5 text-center leading-none">{emoji}</span>;

  return <span className="text-lg w-5 text-center leading-none">·</span>;
}

// 🌴 Home Base layout — left sidebar + XP top bar, like a family
// learning clubhouse. The Adventure Theater portals over all of this.

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
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
    return href === "/family" ? pathname === "/family" : pathname.startsWith(href);
  }

  if (auth.error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-paper">
        <div className="wj-card max-w-md p-8 text-center space-y-6">
          <h1 className="text-4xl font-display text-hibiscus-deep">Error</h1>
          <p className="text-lg font-hand text-ink-soft">{auth.error}</p>
        </div>
      </div>
    );
  }

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-paper">
        <div className="text-center">
          <LoaderCircle className="w-10 h-10 animate-spin text-ink-soft mx-auto" />
        </div>
      </div>
    );
  }

  // 🎥 Fullscreen Classroom Mode
  if (pathname.startsWith("/classroom")) {
    return (
        <CallProvider>
          <div className="min-h-screen px-3 py-3 sm:px-4">
            {children}
          </div>
          <CameraDock />
        </CallProvider>
    );
  }

  const isTeacherWorkspace = pathname.startsWith('/teacher') || pathname.startsWith('/prep-email') || pathname.startsWith('/photos');
  const showFamilyDecor = !isTeacherWorkspace;
  const effectiveDisplayName = auth.role === "teacher" ? teacherName : (displayName || familyName);

  return (
    <CallProvider>
    <div className="min-h-screen lg:flex">
      {showFamilyDecor && <FamilyDecor />}
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
        <Link href="/family" className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mango text-ocean-deep shadow-lg">
            <Compass className="w-6 h-6" />
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
              The role comes from Supabase Auth -> public.profiles -> auth.role,
              so the family never sees teacher tools at all. */}
          {auth.role === "teacher" && (
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

        {/* This device's camera name — shown right in the sidebar so a
            wrong name is spotted immediately, and fixable in
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
                    setDisplayName(nameDraft.trim() || familyName);
                    setEditingName(false);
                  }
                  if (e.key === "Escape") setEditingName(false);
                }}
                placeholder={effectiveDisplayName}
                className="min-w-0 flex-1 rounded-lg bg-white/90 px-2 py-1 text-sm text-ink outline-none"
              />
              <button
                onClick={() => {
                  setDisplayName(nameDraft.trim() || familyName);
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
                if (auth.role !== "teacher") {
                  setNameDraft(effectiveDisplayName);
                  setEditingName(true);
                }
              }}
              className="flex w-full items-center justify-between gap-2 text-left"
              title={auth.role === "teacher" ? "" : "Tap to fix this device's camera name"}
            >
              <span className="min-w-0 truncate text-[13px] text-white/85 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5" /> {effectiveDisplayName}
              </span>
              {auth.role !== "teacher" && <span className="shrink-0 text-white/50"><Pencil className="w-3 h-3" /></span>}
            </button>
          )}
        </div>

        {/* 🔒 Sign out — clears Auth session. Clears
            WHO is signed in (name, role) but never touches
            the family's treasures (journals, blessings, photos, stamps). */}
        <button
          onClick={() => {
            auth.signOut();
          }}
          className="mx-3 mb-5 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left font-display text-[13px] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </aside>

      {/* ── Main column ─────────────────────────────────────── */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <TopBar
          onMenu={() => setOpen(true)}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          teacherMode={auth.role === "teacher"}
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
  );
}

function SidebarLink({
  item,
  active,
}: {
  item: NavItem;
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
      <div className="flex h-6 w-6 items-center justify-center">
        {renderNavIcon(item.icon, item.emoji)}
      </div>
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
          {theme === "dark" ? "☀" : "🌙"}
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
