import {
  apiBibleErrorResponse,
  apiBibleRequest,
} from "@/lib/api-bible";

interface ApiBibleListResponse {
  data: Array<{
    id: string;
    abbreviation: string;
    abbreviationLocal?: string;
    name: string;
    nameLocal?: string;
    language?: {
      id: string;
      name: string;
      nameLocal?: string;
    };
  }>;
}

export const runtime = "nodejs";

export async function GET() {
  try {
    const response = await apiBibleRequest<ApiBibleListResponse>(
      "/bibles?language=spa",
      { next: { revalidate: 3600 } },
    );

    const data = response.data
      .map((bible) => ({
        id: bible.id,
        abbreviation: bible.abbreviationLocal || bible.abbreviation,
        name: bible.nameLocal || bible.name,
        language: bible.language?.nameLocal || bible.language?.name || "Español",
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));

    return Response.json(
      { data },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch (error) {
    return apiBibleErrorResponse(error);
  }
}
