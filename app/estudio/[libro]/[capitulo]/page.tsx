import { notFound, redirect } from "next/navigation";

import { chapterStudies, getChapterStudyBySlug } from "@/lib/studies";

interface StudyRouteProps {
  params: Promise<{
    libro: string;
    capitulo: string;
  }>;
}

export function generateStaticParams() {
  return chapterStudies.map((study) => ({
    libro: study.bookSlug,
    capitulo: String(study.chapter),
  }));
}

export default async function StudyRoute({ params }: StudyRouteProps) {
  const { libro, capitulo } = await params;
  const chapterNumber = Number.parseInt(capitulo, 10);
  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) notFound();

  const study = getChapterStudyBySlug(libro.toLowerCase(), chapterNumber);
  if (!study) notFound();

  const query = new URLSearchParams({
    book: study.bookId,
    chapter: study.bookId + "." + study.chapter,
  });
  redirect("/?" + query.toString());
}
