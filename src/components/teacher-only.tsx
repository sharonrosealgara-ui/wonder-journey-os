"use client";

import Link from "next/link";
import { teacherName } from "@/config/family";
import { useAuth } from "@/lib/auth-context";
import { Apple, Home } from "lucide-react";

// 🍎 TEACHER-ONLY GUARD — wraps the Teacher Portal pages.
export function TeacherOnly({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.loading) return null;
  if (auth.error) return null;

  if (auth.role !== "teacher") {
    return (
      <div className="mx-auto max-w-md">
        <div className="wj-card wj-pop-in p-8 text-center">
          <Apple className="w-16 h-16 mx-auto text-sunset" />
          <h1 className="wj-outline mt-3 font-display text-2xl">
            This is {teacherName}&apos;s studio
          </h1>
          <p className="font-hand mt-2 text-lg text-ink-soft">
            Lesson plans and class prep live here — your adventure is waiting out front!
          </p>
          <Link href="/" className="wj-btn mt-5 inline-flex items-center gap-2">
            <Home className="w-4 h-4" /> Back to Home Base
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
