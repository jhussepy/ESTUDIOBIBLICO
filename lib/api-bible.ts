import "server-only";

const API_BIBLE_BASE_URL = "https://rest.api.bible/v1";

type CachePolicy =
  | { cache: "no-store" }
  | { next: { revalidate: number } };

export class ApiBibleError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiBibleError";
  }
}

export async function apiBibleRequest<T>(
  path: string,
  cachePolicy: CachePolicy = { cache: "no-store" },
): Promise<T> {
  const apiKey = process.env.API_BIBLE_KEY;

  if (!apiKey) {
    throw new ApiBibleError(
      "API_BIBLE_KEY no está configurada en este entorno.",
      503,
    );
  }

  const response = await fetch(`${API_BIBLE_BASE_URL}${path}`, {
    ...cachePolicy,
    headers: {
      Accept: "application/json",
      "api-key": apiKey,
    },
  });

  if (!response.ok) {
    const status = response.status;
    const message =
      status === 401 || status === 403
        ? "API.Bible rechazó la credencial o esta traducción no está habilitada."
        : status === 404
          ? "No se encontró el contenido bíblico solicitado."
          : status === 429
            ? "Se alcanzó temporalmente el límite de consultas de API.Bible."
            : "API.Bible no pudo responder a la solicitud.";

    throw new ApiBibleError(message, status);
  }

  return (await response.json()) as T;
}

export function apiBibleErrorResponse(error: unknown) {
  if (error instanceof ApiBibleError) {
    return Response.json(
      { error: error.message },
      { status: error.status },
    );
  }

  console.error("Unexpected API.Bible error", error);
  return Response.json(
    { error: "No se pudo cargar el contenido bíblico en este momento." },
    { status: 500 },
  );
}
