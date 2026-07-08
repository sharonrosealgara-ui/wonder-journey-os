"use client";

import { useRouter } from "next/navigation";
import { brand } from "@/config/brand";
import { familyName, students, teacherName } from "@/config/family";
import type { Mode } from "@/config/navigation";
import { KEYS } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

export default function WelcomePage() {
  const router = useRouter();
  const [, setMode] = useStored<Mode>(KEYS.mode, "family");
  const [, setActiveStudent] = useStored<string | null>(KEYS.activeStudent, null);

  function enterAsStudent(id: string) {
    setActiveStudent(id);
    setMode("family");
    router.push("/today");
  }

  function enterAs(mode: Mode, path: string) {
    setMode(mode);
    router.push(path);
  }

  return (
    <div className="space-y-10 py-6">
      {/* Hero */}
      <section className="text-center">
        <div className="mb-3 text-5xl">{brand.heroEmojis}</div>
        <h1 className="wj-outline font-display text-4xl sm:text-6xl">
          {brand.productName}
        </h1>
        <p className="mt-2 font-display text-xl text-ocean-deep">
          {brand.worldSubtitle}
        </p>
        <p className="font-hand mx-auto mt-3 max-w-xl text-lg text-ink-soft">
          {brand.tagline}
        </p>
        <p className="mt-4">
          <span className="wj-brush font-display text-xl text-ink">
            Welcome, {familyName}! 💛
          </span>
        </p>
      </section>

      {/* Student picker */}
      <section>
        <h2 className="wj-outline mb-4 text-center font-display text-3xl">
          Who&apos;s ready for an adventure? 🎒
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {students.map((s) => (
            <button
              key={s.id}
              onClick={() => enterAsStudent(s.id)}
              className="wj-card wj-card-hover flex flex-col items-center p-6 text-center"
            >
              <span
                className="wj-sticker mb-3 flex h-16 w-16 items-center justify-center text-3xl"
                style={{ background: `${s.color}30` }}
              >
                {s.emoji}
              </span>
              <span className="font-display text-xl font-extrabold" style={{ color: s.color }}>
                {s.name}
              </span>
              <span className="text-sm text-ink-soft">Age {s.age}</span>
              <span className="mt-2 text-xs text-ink-soft">{s.funFact}</span>
            </button>
          ))}
        </div>
      </section>

      {/* The two portals — deliberately different worlds */}
      <section className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => enterAs("family", "/parent")}
          className="wj-card wj-card-hover flex items-center gap-4 p-6 text-left"
        >
          <span className="wj-sticker flex h-14 w-14 items-center justify-center text-3xl">
            👨‍👩‍👧‍👦
          </span>
          <div>
            <div className="font-display text-xl font-extrabold text-ocean-deep">Family Portal</div>
            <div className="text-sm text-ink-soft">
              {familyName}&apos;s adventure world — today&apos;s class, memories, cookbook & celebrations
            </div>
          </div>
        </button>
        <button
          onClick={() => enterAs("teacher", "/teacher")}
          className="wj-card wj-card-hover flex items-center gap-4 border-2 border-hibiscus/30 bg-gradient-to-br from-hibiscus/10 to-ube/10 p-6 text-left"
        >
          <span className="wj-sticker flex h-14 w-14 items-center justify-center text-3xl">
            🍎
          </span>
          <div>
            <div className="font-display text-xl font-extrabold text-hibiscus-deep">
              Teacher Portal
            </div>
            <div className="text-sm text-ink-soft">
              {teacherName}&apos;s studio — lessons, prep, awards & class tools
            </div>
          </div>
        </button>
      </section>
    </div>
  );
}
