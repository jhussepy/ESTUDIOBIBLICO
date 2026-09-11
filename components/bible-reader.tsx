"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookMarked,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";

declare global {
  interface Window {
    fumsData?: unknown[];
    fums?: (...args: unknown[]) => void;
  }
}

interface BibleSummary {
  id: string;
  abbreviation: string;
  name: string;
  language: string;
}

interface ChapterSummary {
  id: string;
  number: string;
  reference: string;
}

interface BookSummary {
  id: string;
  abbreviation: string;
  name: string;
  nameLong: string;
  chapters: ChapterSummary[];
}

interface ChapterContent {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright?: string;
  fumsToken?: string | null;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const PREFERRED_BIBLE_PATTERNS = [
  /reina.?valera.*1960|rvr.?60|rvr1960/i,
  /nueva traducci[oó]n viviente|\bntv\b/i,
  /biblia de las am[eé]ricas|\blbla\b/i,
];

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.data) {
    throw new Error(payload.error || "No se pudo cargar el contenido bíblico.");
  }

  return payload.data;
}

function biblePriority(bible: BibleSummary) {
  const identity = `${bible.abbreviation} ${bible.name}`;
  const match = PREFERRED_BIBLE_PATTERNS.findIndex((pattern) => pattern.test(identity));
  return match === -1 ? PREFERRED_BIBLE_PATTERNS.length : match;
}

function initialParam(name: string) {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name) || "";
}

export function BibleReader() {
  const [bibles, setBibles] = useState<BibleSummary[]>([]);
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [chapter, setChapter] = useState<ChapterContent | null>(null);
  const [selectedBibleId, setSelectedBibleId] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [booksLoading, setBooksLoading] = useState(false);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const pendingBookIdRef = useRef<string | null>(null);

  const selectedBible = useMemo(
    () => bibles.find((bible) => bible.id === selectedBibleId),
    [bibles, selectedBibleId],
  );
  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId),
    [books, selectedBookId],
  );
  const availableChapters = selectedBook?.chapters || [];
  const selectedChapter = availableChapters.find((item) => item.id === selectedChapterId);

  const retry = useCallback(() => {
    setError(null);
    setCatalogLoading(true);
    setBooksLoading(Boolean(selectedBibleId));
    setChapterLoading(Boolean(selectedBibleId && selectedChapterId));
    setRetryKey((value) => value + 1);
  }, [selectedBibleId, selectedChapterId]);

  useEffect(() => {
    const controller = new AbortController();

    fetchJson<BibleSummary[]>("/api/bible/bibles", controller.signal)
      .then((availableBibles) => {
        const ordered = [...availableBibles].sort((a, b) => {
          const priorityDifference = biblePriority(a) - biblePriority(b);
          return priorityDifference || a.name.localeCompare(b.name, "es");
        });
        const requestedBible = initialParam("bible");
        const nextBibleId =
          ordered.some((bible) => bible.id === requestedBible)
            ? requestedBible
            : ordered[0]?.id || "";
        setBibles(ordered);
        setBooksLoading(Boolean(nextBibleId));
        setSelectedBibleId(nextBibleId);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar las versiones bíblicas.");
      })
      .finally(() => setCatalogLoading(false));

    return () => controller.abort();
  }, [retryKey]);

  useEffect(() => {
    if (!selectedBibleId) return;

    const controller = new AbortController();

    fetchJson<BookSummary[]>(
      `/api/bible/books?bibleId=${encodeURIComponent(selectedBibleId)}`,
      controller.signal,
    )
      .then((availableBooks) => {
        const pendingBookId = pendingBookIdRef.current;
        const requestedBook = initialParam("book");
        const nextBook =
          availableBooks.find((book) => book.id === pendingBookId) ||
          availableBooks.find((book) => book.id === requestedBook) ||
          availableBooks.find((book) => book.id === "GEN") ||
          availableBooks[0];
        pendingBookIdRef.current = null;
        setBooks(availableBooks);
        setSelectedBookId(nextBook?.id || "");

        const requestedChapter = initialParam("chapter");
        const nextChapterId =
          nextBook?.chapters.some((item) => item.id === requestedChapter)
            ? requestedChapter
            : nextBook?.chapters[0]?.id || "";
        setChapterLoading(Boolean(nextChapterId));
        setSelectedChapterId(nextChapterId);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar los libros.");
      })
      .finally(() => setBooksLoading(false));

    return () => controller.abort();
  }, [selectedBibleId, retryKey]);

  useEffect(() => {
    if (!selectedBibleId || !selectedChapterId) return;

    const controller = new AbortController();

    fetchJson<ChapterContent>(
      `/api/bible/chapter?bibleId=${encodeURIComponent(selectedBibleId)}&chapterId=${encodeURIComponent(selectedChapterId)}`,
      controller.signal,
    )
      .then(setChapter)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el capítulo.");
      })
      .finally(() => setChapterLoading(false));

    return () => controller.abort();
  }, [selectedBibleId, selectedChapterId, retryKey]);

  useEffect(() => {
    if (!selectedBibleId || !selectedBookId || !selectedChapterId) return;
    const params = new URLSearchParams(window.location.search);
    params.set("bible", selectedBibleId);
    params.set("book", selectedBookId);
    params.set("chapter", selectedChapterId);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [selectedBibleId, selectedBookId, selectedChapterId]);

  useEffect(() => {
    if (!chapter?.fumsToken) return;
    window.fums?.("trackView", chapter.fumsToken);
  }, [chapter?.fumsToken]);

  useEffect(() => {
    if (!selectedBookId) return;
    window.dispatchEvent(new CustomEvent("bible-reader-selection", {
      detail: {
        bookId: selectedBookId,
        reference: chapter?.reference || selectedChapter?.reference || selectedBook?.name || selectedBookId,
        chapterNumber:
          Number.parseInt(selectedChapter?.number || chapter?.number || "", 10) || undefined,
      },
    }));
  }, [
    chapter?.number,
    chapter?.reference,
    selectedBook?.name,
    selectedBookId,
    selectedChapter?.number,
    selectedChapter?.reference,
  ]);

  useEffect(() => {
    function handleNavigation(event: Event) {
      const bookId = (event as CustomEvent<{ bookId?: string }>).detail?.bookId;
      if (!bookId) return;
      const nextBook = books.find((book) => book.id === bookId);
      if (!nextBook) {
        pendingBookIdRef.current = booksLoading ? bookId : null;
        return;
      }
      pendingBookIdRef.current = null;
      if (nextBook.id === selectedBookId) return;
      const nextChapterId = nextBook.chapters[0]?.id || "";
      setSelectedBookId(nextBook.id);
      setSelectedChapterId(nextChapterId);
      setChapterLoading(Boolean(nextChapterId));
      setChapter(null);
      setError(null);
    }

    window.addEventListener("bible-reader-navigate", handleNavigation);
    return () => window.removeEventListener("bible-reader-navigate", handleNavigation);
  }, [books, booksLoading, selectedBookId]);

  function selectBook(bookId: string) {
    const nextBook = books.find((book) => book.id === bookId);
    const nextChapterId = nextBook?.chapters[0]?.id || "";
    setSelectedBookId(bookId);
    setSelectedChapterId(nextChapterId);
    setChapterLoading(Boolean(nextChapterId));
    setChapter(null);
    setError(null);
  }

  function selectBible(bibleId: string) {
    setSelectedBibleId(bibleId);
    setBooks([]);
    setSelectedBookId("");
    setSelectedChapterId("");
    setChapter(null);
    setBooksLoading(Boolean(bibleId));
    setChapterLoading(false);
    setError(null);
  }

  function moveChapter(direction: -1 | 1) {
    const currentIndex = availableChapters.findIndex((item) => item.id === selectedChapterId);
    const nextChapter = availableChapters[currentIndex + direction];
    if (!nextChapter) return;
    setSelectedChapterId(nextChapter.id);
    setChapter(null);
    setChapterLoading(true);
    setError(null);
  }

  const selectedChapterIndex = availableChapters.findIndex((item) => item.id === selectedChapterId);

  const hasNoBibles = !catalogLoading && !error && bibles.length === 0;

  return (
    <section id="lector-biblico" aria-labelledby="bible-reader-title" className="scroll-mt-20 mt-6 overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <BookMarked aria-hidden="true" className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="bible-reader-title" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                Lectura bíblica
              </h2>
              <Badge variant="outline" className="border-primary/25 bg-primary/7 text-primary">
                <CircleCheck aria-hidden="true" className="size-3.5" /> API conectada
              </Badge>
            </div>
            <p className="mt-1 max-w-[68ch] text-sm leading-6 text-muted-foreground">
              Consulta el texto autorizado y navega por la versión, el libro y el capítulo que deseas estudiar.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
          Clave protegida en Vercel
        </div>
      </div>

      <div className="grid gap-4 bg-muted/35 p-5 sm:grid-cols-3 sm:p-6">
        <div className="min-w-0 space-y-2">
          <Label htmlFor="bible-version">Versión bíblica</Label>
          <NativeSelect
            id="bible-version"
            value={selectedBibleId}
            onChange={(event) => selectBible(event.target.value)}
            disabled={catalogLoading || bibles.length === 0}
            aria-describedby="bible-version-help"
            className="h-11 w-full bg-card"
          >
            {catalogLoading && <NativeSelectOption value="">Cargando versiones…</NativeSelectOption>}
            {bibles.map((bible) => (
              <NativeSelectOption key={bible.id} value={bible.id}>
                {bible.abbreviation} · {bible.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <p id="bible-version-help" className="text-xs leading-5 text-muted-foreground">Versiones habilitadas en tu cuenta de API.Bible.</p>
        </div>

        <div className="min-w-0 space-y-2">
          <Label htmlFor="bible-book">Libro</Label>
          <NativeSelect
            id="bible-book"
            value={selectedBookId}
            onChange={(event) => selectBook(event.target.value)}
            disabled={booksLoading || books.length === 0}
            className="h-11 w-full bg-card"
          >
            {booksLoading && <NativeSelectOption value="">Cargando libros…</NativeSelectOption>}
            {books.map((book) => (
              <NativeSelectOption key={book.id} value={book.id}>{book.name}</NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="min-w-0 space-y-2">
          <Label htmlFor="bible-chapter">Capítulo</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => moveChapter(-1)}
              disabled={booksLoading || selectedChapterIndex <= 0}
              aria-label="Capítulo anterior"
              className="size-11 bg-card"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <NativeSelect
              id="bible-chapter"
              value={selectedChapterId}
              onChange={(event) => {
                setSelectedChapterId(event.target.value);
                setChapter(null);
                setChapterLoading(Boolean(event.target.value));
                setError(null);
              }}
              disabled={booksLoading || availableChapters.length === 0}
              className="h-11 w-full bg-card"
            >
              {availableChapters.map((item) => (
                <NativeSelectOption key={item.id} value={item.id}>Capítulo {item.number}</NativeSelectOption>
              ))}
            </NativeSelect>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={() => moveChapter(1)}
              disabled={booksLoading || selectedChapterIndex === -1 || selectedChapterIndex >= availableChapters.length - 1}
              aria-label="Capítulo siguiente"
              className="size-11 bg-card"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6" aria-live="polite">
        {error && (
          <Alert variant="destructive">
            <CircleAlert aria-hidden="true" />
            <AlertTitle>No se pudo abrir la Biblia</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
              <Button type="button" variant="outline" size="sm" onClick={retry} className="mt-2">
                <RefreshCw aria-hidden="true" /> Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {hasNoBibles && (
          <Alert>
            <CircleAlert aria-hidden="true" />
            <AlertTitle>No hay versiones en español habilitadas</AlertTitle>
            <AlertDescription>
              Activa RVR1960, NTV o LBLA en la sección Plan de tu cuenta de API.Bible y vuelve a intentarlo.
            </AlertDescription>
          </Alert>
        )}

        {(catalogLoading || booksLoading || chapterLoading) && !error && (
          <div aria-busy="true" aria-label="Cargando capítulo bíblico" className="space-y-4">
            <Skeleton className="h-8 w-52 bg-muted" />
            <Skeleton className="h-5 w-full bg-muted" />
            <Skeleton className="h-5 w-[94%] bg-muted" />
            <Skeleton className="h-5 w-[88%] bg-muted" />
            <Skeleton className="h-5 w-[91%] bg-muted" />
          </div>
        )}

        {chapter && !chapterLoading && !error && (
          <article aria-labelledby="active-chapter-title">
            <div className="mb-5 flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{selectedBible?.abbreviation}</p>
                <h3 id="active-chapter-title" className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{chapter.reference}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{chapter.verseCount} versículos · {selectedBook?.nameLong || selectedBook?.name}</p>
            </div>
            <div
              className="api-scripture-content"
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />
            {chapter.copyright && (
              <p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">{chapter.copyright}</p>
            )}
          </article>
        )}
      </div>
    </section>
  );
}
