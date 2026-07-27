import Link from "next/link";
import { AdventureTheater } from "@/components/adventure/theater";
import { getLesson, lessons } from "@/config/lessons";

export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}

export default async function AdventurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) {
    return (
      <div className="wj-card p-8 text-center">
        <p>That adventure sailed away.</p>
        <Link href="/lessons" className="wj-btn mt-4">Back to Lesson Library</Link>
      </div>
    );
  }
  return <AdventureTheater lesson={lesson} />;
}
