import { lessons } from "@/config/lessons";
import { LessonView } from "./lesson-view";

// Pre-render one static page per lesson (static export for Netlify).
export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LessonView id={id} />;
}
