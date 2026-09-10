import {
  apiBibleErrorResponse,
  apiBibleRequest,
} from "@/lib/api-bible";

interface ApiChapterResponse {
  data: {
    id: string;
    bibleId: string;
    number: string;
    bookId: string;
    content: string;
    reference: string;
    verseCount: number;
    copyright?: string;
    next?: { id: string; bookId: string; number: string } | null;
    previous?: { id: string; bookId: string; number: string } | null;
  };
  meta?: {
    fumsToken?: string;
    fums?: string;
  };
}

const BIBLE_ID_PATTERN = /^[a-zA-Z0-9-]+$/;
const CHAPTER_ID_PATTERN = /^[0-9A-Z]{3}\.\d+$/;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const bibleId = searchParams.get("bibleId") || "";
  const chapterId = searchParams.get("chapterId") || "";

  if (!BIBLE_ID_PATTERN.test(bibleId) || !CHAPTER_ID_PATTERN.test(chapterId)) {
    return Response.json(
      { error: "La versión o el capítulo solicitado no es válido." },
      { status: 400 },
    );
  }

  try {
    const response = await apiBibleRequest<ApiChapterResponse>(
      `/bibles/${encodeURIComponent(bibleId)}/chapters/${encodeURIComponent(chapterId)}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=true`,
      { cache: "no-store" },
    );

    return Response.json(
      {
        data: {
          ...response.data,
          fumsToken: response.meta?.fumsToken || response.meta?.fums || null,
        },
      },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  } catch (error) {
    return apiBibleErrorResponse(error);
  }
}
