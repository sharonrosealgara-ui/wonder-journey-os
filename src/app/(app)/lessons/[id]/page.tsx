import Link from "next/link";
import { getLesson, lessons } from "@/config/lessons";
import { LessonView } from "./lesson-view";

// Pre-render lesson routes for efficient Hostinger Managed Next.js delivery.
export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);

  if (!lesson) {
    return (
      <div className="wj-card p-8 text-center">
        <p>Hmm, that lesson has sailed away. ⛵</p>
        <Link href="/lessons" className="wj-btn mt-4">Back to Lesson Library</Link>
      </div>
    );
  }

  return <LessonView lesson={lesson} />;
}
