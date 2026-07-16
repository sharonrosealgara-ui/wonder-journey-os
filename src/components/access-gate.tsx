"use client";

import { useEffect, useState } from "react";
import { brand } from "@/config/brand";
import { familyName, teacherName } from "@/config/family";
import { readStored, useStored, writeStored } from "@/lib/storage";

// 🔑 ACCESS GATE — the front door of Wonder Journey.
// One class code, entered ONCE on this device, opens everything: the
// platform, the live classroom, and the cloud. The same code works for
// Teacher Sharon and for the family, so there is nothing else to
// remember and no second code inside the classroom.
//
// Magic links skip the door entirely:
//   ?code=12345 — invited family: saved instantly, straight in
//   ?guest=1    — future clients: explore freely, no code needed

type Phase = "checking" | "locked" | "open";

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("checking");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [, setGuest] = useStored<boolean>("guest", false);

  // Read magic links + any saved code before painting the door.
  useEffect(() => {
    let unlocked = false;
    try {
      const url = new URL(window.location.href);
      const linkCode = url.searchParams.get("code");
      const guest = url.searchParams.get("guest");

      if (linkCode && linkCode.trim()) {
        writeStored("classCode", linkCode.trim());
        url.searchParams.delete("code");
        unlocked = true;
      }
      if (guest) {
        writeStored("guest", true);
        writeStored("dock", "off"); // guests explore quietly, no camera
        url.searchParams.delete("guest");
        unlocked = true;
      }
      if (linkCode || guest) {
        const clean = url.pathname + url.search + url.hash;
        setTimeout(() => window.history.replaceState(null, "", clean), 400);
      }
    } catch { /* ignore */ }

    const saved = readStored<string>("classCode", "");
    const isGuest = readStored<boolean>("guest", false);
    setPhase(unlocked || saved || isGuest ? "open" : "locked");
  }, []);

  async function unlock() {
    const c = code.trim();
    if (!c) return;
    setBusy(true);
    setError(null);
    try {
      // Check with the server when it's reachable; a wrong code is a 401.
      const res = await fetch("/api/family-data", { headers: { "x-family-code": c } });
      if (res.status === 401) {
        setError("That code doesn't match — please check it with Teacher Sharon. 💛");
        setBusy(false);
        return;
      }
    } catch {
      // Offline or no server (local preview) — trust the code and let
      // the classroom verify it later. Never lock the family out.
    }
    writeStored("classCode", c);
    setPhase("open");
  }

  if (phase === "checking") return null; // avoid a flash of the door
  if (phase === "open") return <>{children}</>;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#c4e5f6] via-[#edf4e2] to-[#cbe9f1] p-4">
      {/* a little island scenery, kept to the edges */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="wj-cloud text-5xl opacity-60" style={{ left: 0, top: "8%", animationDuration: "50s" }}>☁️</span>
        <span className="wj-cloud text-3xl opacity-50" style={{ left: 0, top: "18%", animationDuration: "70s", animationDelay: "-30s" }}>☁️</span>
        <span className="wj-sway-soft absolute bottom-4 left-2 text-6xl opacity-90">🌴</span>
        <span className="wj-bob absolute bottom-8 right-3 text-5xl opacity-90">🌺</span>
        <span className="wj-twinkle absolute left-[12%] top-[30%] text-xl">✨</span>
        <span className="wj-twinkle absolute right-[14%] top-[26%] text-lg" style={{ animationDelay: "-1.4s" }}>⭐</span>
      </div>

      <div className="wj-card wj-pop-in relative z-10 w-full max-w-md p-7 text-center shadow-2xl sm:p-9">
        <div className="text-5xl">🧭</div>
        <h1 className="wj-outline mt-2 font-display text-3xl sm:text-4xl">
          {brand.productName.replace(" OS", "")}
        </h1>
        <p className="font-hand mt-1 text-lg text-ink-soft">
          Mabuhay! Let&apos;s open your family&apos;s adventure. 💛
        </p>

        <label className="mt-6 block text-left text-sm font-bold text-ink-soft" htmlFor="class-code">
          🔑 Enter your class code
        </label>
        <input
          id="class-code"
          className="wj-input mt-1 text-center font-display text-2xl tracking-widest"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && void unlock()}
          placeholder="12345"
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
        />
        <p className="font-hand mt-2 text-sm text-ink-soft">
          The same code for {teacherName} and the {familyName} — you only do this once on this device.
        </p>

        {error && (
          <p className="mt-3 rounded-2xl bg-hibiscus/10 p-3 text-sm font-bold text-hibiscus-deep">{error}</p>
        )}

        <button className="wj-btn mt-5 w-full text-lg" onClick={() => void unlock()} disabled={busy || !code.trim()}>
          {busy ? "Opening… 🌴" : "🚀 Start the Adventure"}
        </button>

        <button
          className="font-hand mt-4 text-sm text-ink-soft underline underline-offset-4 hover:text-ocean-deep"
          onClick={() => {
            setGuest(true);
            writeStored("dock", "off");
            setPhase("open");
          }}
        >
          Just looking around? Explore as a guest →
        </button>
      </div>
    </div>
  );
}
