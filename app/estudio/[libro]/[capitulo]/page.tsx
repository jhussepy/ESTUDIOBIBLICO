import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Home from "@/app/page";
import { getCatalogEntryBySlug, studyCatalog } from "@/lib/study-catalog";

interface StudyRouteProps {
  params: Promise<{
    libro: string;
    capitulo: string;
  }>;
}

export function generateStaticParams() {
  return studyCatalog.map((study) => ({
    libro: study.bookSlug,
    capitulo: String(study.chapter),
  }));
}

export async function generateMetadata({ params }: StudyRouteProps): Promise<Metadata> {
  const { libro, capitulo } = await params;
  const chapterNumber = Number.parseInt(capitulo, 10);
  const study = getCatalogEntryBySlug(libro.toLowerCase(), chapterNumber);

  if (!study) {
    return {
      title: "Estudio no disponible",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${study.bookName} ${study.chapter}: ${study.title}`,
    description: study.description,
    alternates: {
      canonical: `/estudio/${study.bookSlug}/${study.chapter}`,
    },
    openGraph: {
      title: `${study.bookName} ${study.chapter}: ${study.title}`,
      description: study.description,
      type: "article",
      url: `/estudio/${study.bookSlug}/${study.chapter}`,
      modifiedTime: study.updatedAt,
    },
  };
}

export default async function StudyRoute({ params }: StudyRouteProps) {
  const { libro, capitulo } = await params;
  const chapterNumber = Number.parseInt(capitulo, 10);
  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) notFound();

  const study = getCatalogEntryBySlug(libro.toLowerCase(), chapterNumber);
  if (!study) notFound();

  return (
    <Home
      initialBookId={study.bookId}
      initialChapterNumber={study.chapter}
      initialReference={`${study.bookName} ${study.chapter}`}
    />
  );
}
