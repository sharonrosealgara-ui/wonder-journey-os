"use client";

import Link from "next/link";
import { teacherName } from "@/config/family";
import { normalizeMode } from "@/config/navigation";
import { KEYS } from "@/lib/app-state";
import { useStored } from "@/lib/storage";

// 🍎 TEACHER-ONLY GUARD — wraps the Teacher Portal pages.
// The role comes from the code entered at the door (two-code system):
// only the device holding the teacher code sees these pages. A family
// member who types the URL gets a warm nudge home, not lesson plans.
export function TeacherOnly({ children }: { children: React.ReactNode }) {
  const [rawMode, , ready] = useStored<string>(KEYS.mode, "family");
  if (!ready) return null; // no flash while the device introduces itself

  if (normalizeMode(rawMode) !== "teacher") {
    return (
      <div className="mx-auto max-w-md">
        <div className="wj-card wj-pop-in p-8 text-center">
          <div className="text-5xl">🍎</div>
          <h1 className="wj-outline mt-3 font-display text-2xl">
            This is {teacherName}&apos;s studio
          </h1>
          <p className="font-hand mt-2 text-lg text-ink-soft">
            Lesson plans and class prep live here — your adventure is waiting out front! 🌴
          </p>
          <Link href="/" className="wj-btn mt-5 inline-block">
            🏠 Back to Home Base
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
