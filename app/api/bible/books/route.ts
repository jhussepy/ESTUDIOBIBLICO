import {
  apiBibleErrorResponse,
  apiBibleRequest,
} from "@/lib/api-bible";

interface ApiBookListResponse {
  data: Array<{
    id: string;
    bibleId: string;
    abbreviation: string;
    name: string;
    nameLong: string;
    chapters?: Array<{
      id: string;
      number: string;
      reference: string;
    }>;
  }>;
}

const BIBLE_ID_PATTERN = /^[a-zA-Z0-9-]+$/;

export const runtime = "nodejs";

export async function GET(request: Request) {
  const bibleId = new URL(request.url).searchParams.get("bibleId") || "";

  if (!BIBLE_ID_PATTERN.test(bibleId)) {
    return Response.json(
      { error: "El identificador de la versión bíblica no es válido." },
      { status: 400 },
    );
  }

  try {
    const response = await apiBibleRequest<ApiBookListResponse>(
      `/bibles/${encodeURIComponent(bibleId)}/books?include-chapters=true`,
      { next: { revalidate: 3600 } },
    );

    const data = response.data.map((book) => ({
      id: book.id,
      abbreviation: book.abbreviation,
      name: book.name,
      nameLong: book.nameLong,
      chapters: (book.chapters || [])
        .filter((chapter) => /^\d+$/.test(chapter.number))
        .map((chapter) => ({
          id: chapter.id,
          number: chapter.number,
          reference: chapter.reference,
        })),
    }));

    return Response.json(
      { data },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch (error) {
    return apiBibleErrorResponse(error);
  }
}
