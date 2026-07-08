"use client";

import Link from "next/link";
import { use } from "react";
import { AdventureTheater } from "@/components/adventure/theater";
import { getLesson } from "@/config/lessons";

export default function AdventurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lesson = getLesson(id);

  if (!lesson) {
    return (
      <div className="wj-card p-8 text-center">
        <p>That adventure sailed away. 🛶</p>
        <Link href="/lessons" className="wj-btn mt-4">Back to Lesson Library</Link>
      </div>
    );
  }

  return <AdventureTheater lesson={lesson} />;
}
