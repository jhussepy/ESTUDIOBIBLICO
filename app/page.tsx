"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  BookOpenText,
  Check,
  ChevronLeft,
  ChevronRight,
  Languages,
  LibraryBig,
  Milestone,
  ScrollText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BibleReader } from "@/components/bible-reader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getChapterStudy } from "@/lib/studies";

declare global {
  interface Document {
    readonly modelContext?: {
      registerTool: (
        tool: {
          name: string;
          title?: string;
          description: string;
          inputSchema: object;
          annotations?: {
            readOnlyHint?: boolean;
            untrustedContentHint?: boolean;
          };
          execute: (input: unknown) => unknown | Promise<unknown>;
        },
        options?: { signal?: AbortSignal },
      ) => void | Promise<void>;
    };
  }
}

const canon = [
  {
    section: "Pentateuco",
    books: [["Génesis", 50], ["Éxodo", 40], ["Levítico", 27], ["Números", 36], ["Deuteronomio", 34]],
  },
  {
    section: "Libros históricos",
    books: [["Josué", 24], ["Jueces", 21], ["Rut", 4], ["1 Samuel", 31], ["2 Samuel", 24], ["1 Reyes", 22], ["2 Reyes", 25], ["1 Crónicas", 29], ["2 Crónicas", 36], ["Esdras", 10], ["Nehemías", 13], ["Ester", 10]],
  },
  {
    section: "Poesía y sabiduría",
    books: [["Job", 42], ["Salmos", 150], ["Proverbios", 31], ["Eclesiastés", 12], ["Cantares", 8]],
  },
  {
    section: "Profetas mayores",
    books: [["Isaías", 66], ["Jeremías", 52], ["Lamentaciones", 5], ["Ezequiel", 48], ["Daniel", 12]],
  },
  {
    section: "Profetas menores",
    books: [["Oseas", 14], ["Joel", 3], ["Amós", 9], ["Abdías", 1], ["Jonás", 4], ["Miqueas", 7], ["Nahúm", 3], ["Habacuc", 3], ["Sofonías", 3], ["Hageo", 2], ["Zacarías", 14], ["Malaquías", 4]],
  },
  {
    section: "Evangelios",
    books: [["Mateo", 28], ["Marcos", 16], ["Lucas", 24], ["Juan", 21]],
  },
  { section: "Historia apostólica", books: [["Hechos", 28]] },
  {
    section: "Cartas de Pablo",
    books: [["Romanos", 16], ["1 Corintios", 16], ["2 Corintios", 13], ["Gálatas", 6], ["Efesios", 6], ["Filipenses", 4], ["Colosenses", 4], ["1 Tesalonicenses", 5], ["2 Tesalonicenses", 3], ["1 Timoteo", 6], ["2 Timoteo", 4], ["Tito", 3], ["Filemón", 1]],
  },
  {
    section: "Cartas generales",
    books: [["Hebreos", 13], ["Santiago", 5], ["1 Pedro", 5], ["2 Pedro", 3], ["1 Juan", 5], ["2 Juan", 1], ["3 Juan", 1], ["Judas", 1]],
  },
  { section: "Profecía", books: [["Apocalipsis", 22]] },
] as const;

const apiBookIds: Record<string, string> = {
  "Génesis": "GEN", "Éxodo": "EXO", "Levítico": "LEV", "Números": "NUM", "Deuteronomio": "DEU",
  "Josué": "JOS", "Jueces": "JDG", "Rut": "RUT", "1 Samuel": "1SA", "2 Samuel": "2SA",
  "1 Reyes": "1KI", "2 Reyes": "2KI", "1 Crónicas": "1CH", "2 Crónicas": "2CH", "Esdras": "EZR",
  "Nehemías": "NEH", "Ester": "EST", "Job": "JOB", "Salmos": "PSA", "Proverbios": "PRO",
  "Eclesiastés": "ECC", "Cantares": "SNG", "Isaías": "ISA", "Jeremías": "JER", "Lamentaciones": "LAM",
  "Ezequiel": "EZK", "Daniel": "DAN", "Oseas": "HOS", "Joel": "JOL", "Amós": "AMO",
  "Abdías": "OBA", "Jonás": "JON", "Miqueas": "MIC", "Nahúm": "NAM", "Habacuc": "HAB",
  "Sofonías": "ZEP", "Hageo": "HAG", "Zacarías": "ZEC", "Malaquías": "MAL", "Mateo": "MAT",
  "Marcos": "MRK", "Lucas": "LUK", "Juan": "JHN", "Hechos": "ACT", "Romanos": "ROM",
  "1 Corintios": "1CO", "2 Corintios": "2CO", "Gálatas": "GAL", "Efesios": "EPH", "Filipenses": "PHP",
  "Colosenses": "COL", "1 Tesalonicenses": "1TH", "2 Tesalonicenses": "2TH", "1 Timoteo": "1TI", "2 Timoteo": "2TI",
  "Tito": "TIT", "Filemón": "PHM", "Hebreos": "HEB", "Santiago": "JAS", "1 Pedro": "1PE",
  "2 Pedro": "2PE", "1 Juan": "1JN", "2 Juan": "2JN", "3 Juan": "3JN", "Judas": "JUD",
  "Apocalipsis": "REV",
};

function CanonBookButton({
  active,
  book,
  chapters,
  onSelect,
}: {
  active: boolean;
  book: string;
  chapters: number;
  onSelect: () => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  function handleSelect() {
    if (isMobile) setOpenMobile(false);
    onSelect();
  }

  return (
    <SidebarMenuButton
      isActive={active}
      onClick={handleSelect}
      aria-current={active ? "page" : undefined}
      aria-label={`${book}, ${chapters} capítulos${active ? ", libro seleccionado" : ""}`}
      className="h-9 data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
    >
      <span className={active ? "font-semibold" : "text-sidebar-foreground/76"}>{book}</span>
    </SidebarMenuButton>
  );
}

export default function Home() {
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [completedByStudy, setCompletedByStudy] = useState<Record<string, number[]>>({});
  const [activeBookId, setActiveBookId] = useState("GEN");
  const [activeChapterNumber, setActiveChapterNumber] = useState(1);
  const [activeReference, setActiveReference] = useState("Génesis 1");

  const activeStudy = useMemo(
    () => getChapterStudy(activeBookId, activeChapterNumber),
    [activeBookId, activeChapterNumber],
  );
  const activeVerseNumber =
    activeStudy?.verses.some((verse) => verse.number === selectedVerse)
      ? selectedVerse
      : activeStudy?.verses[0]?.number ?? 1;
  const current = useMemo(
    () => activeStudy?.verses.find((verse) => verse.number === activeVerseNumber),
    [activeStudy, activeVerseNumber],
  );
  const completedVerses = activeStudy ? completedByStudy[activeStudy.key] ?? [] : [];
  const isComplete = completedVerses.includes(activeVerseNumber);
  const chapterProgress = activeStudy?.verses.length
    ? (completedVerses.length / activeStudy.verses.length) * 100
    : 0;
  const activeBookName =
    Object.entries(apiBookIds).find(([, bookId]) => bookId === activeBookId)?.[0] ?? activeBookId;
  const activeBookChapterCount =
    canon
      .flatMap((group) => group.books.map(([book, chapters]) => ({ book, chapters })))
      .find(({ book }) => apiBookIds[book] === activeBookId)?.chapters ??
    activeStudy?.chapterCount ??
    0;

  function toggleCompleted() {
    if (!activeStudy) return;
    setCompletedByStudy((progress) => {
      const currentVerses = progress[activeStudy.key] ?? [];
      const nextVerses = currentVerses.includes(activeVerseNumber)
        ? currentVerses.filter((verse) => verse !== activeVerseNumber)
        : [...currentVerses, activeVerseNumber].sort((a, b) => a - b);
      return { ...progress, [activeStudy.key]: nextVerses };
    });
  }

  useEffect(() => {
    if (!activeStudy) return;
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const verseMaximum = activeStudy.verses.length;
    const studyKey = activeStudy.key;
    try {
      const registration = context.registerTool({
        name: "set_bible_verse_studied",
        title: "Actualizar progreso del estudio",
        description:
          "Marca o desmarca un versículo del capítulo activo y actualiza el progreso visible.",
        inputSchema: {
          type: "object",
          properties: {
            verse: { type: "integer", minimum: 1, maximum: verseMaximum },
            studied: { type: "boolean" },
          },
          required: ["verse", "studied"],
          additionalProperties: false,
        },
        annotations: {
          readOnlyHint: false,
          untrustedContentHint: false,
        },
        async execute(input) {
          if (
            typeof input !== "object" ||
            input === null ||
            !Number.isInteger((input as { verse?: unknown }).verse) ||
            (input as { verse: number }).verse < 1 ||
            (input as { verse: number }).verse > verseMaximum ||
            typeof (input as { studied?: unknown }).studied !== "boolean"
          ) {
            throw new Error(
              "El versículo debe estar entre 1 y " +
                verseMaximum +
                " y «studied» debe ser verdadero o falso.",
            );
          }

          const { verse, studied } = input as { verse: number; studied: boolean };
          setSelectedVerse(verse);
          setCompletedByStudy((progress) => {
            const currentVerses = progress[studyKey] ?? [];
            const next = currentVerses.filter((item) => item !== verse);
            if (studied) next.push(verse);
            return { ...progress, [studyKey]: next.sort((a, b) => a - b) };
          });
          await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
          return {
            reference: activeStudy.bookName + " " + activeStudy.chapter + ":" + verse,
            studied,
          };
        },
      }, { signal: lifecycle.signal });
      void Promise.resolve(registration).catch(() => undefined);
    } catch {
      return () => lifecycle.abort();
    }

    return () => lifecycle.abort();
  }, [activeStudy]);

  useEffect(() => {
    function handleSelection(event: Event) {
      const detail = (
        event as CustomEvent<{ bookId?: string; reference?: string; chapterNumber?: number }>
      ).detail;
      if (detail?.bookId) setActiveBookId(detail.bookId);
      if (detail?.reference) setActiveReference(detail.reference);
      if (detail?.chapterNumber && detail.chapterNumber > 0) {
        setActiveChapterNumber(detail.chapterNumber);
      }
    }

    window.addEventListener("bible-reader-selection", handleSelection);
    return () => window.removeEventListener("bible-reader-selection", handleSelection);
  }, []);

  function openBook(book: string) {
    const bookId = apiBookIds[book];
    if (!bookId) return;
    window.dispatchEvent(new CustomEvent("bible-reader-navigate", { detail: { bookId } }));
    const reader = document.getElementById("lector-biblico");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reader?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "18rem" } as CSSProperties}
      className="bg-background"
    >
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido principal
      </a>
      <Sidebar variant="sidebar" collapsible="offcanvas" className="border-r-0">
        <SidebarHeader className="px-4 pb-3 pt-5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-[inset_0_0_0_1px_rgb(255_255_255/12%)]">
              <BookOpenText aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-lg font-semibold leading-tight tracking-tight">Academia Bíblica</p>
              <p className="mt-0.5 text-xs tracking-wide text-sidebar-foreground/60">66 LIBROS · ESTUDIO PROFUNDO</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent className="px-2 pb-3">
          {canon.map((group) => (
            <SidebarGroup key={group.section} className="py-1.5">
              <SidebarGroupLabel className="font-semibold uppercase tracking-[0.12em]">
                {group.section}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.books.map(([book, chapters]) => {
                    const active = apiBookIds[book] === activeBookId;
                    return (
                      <SidebarMenuItem key={book}>
                        <CanonBookButton
                          active={active}
                          book={book}
                          chapters={chapters}
                          onSelect={() => openBook(book)}
                        />
                        <SidebarMenuBadge className={active ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/65"}>
                          {chapters}
                        </SidebarMenuBadge>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter className="p-4">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/65 p-3.5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold">Progreso del canon</span>
              <span className="tabular-nums text-sidebar-foreground/60">0 / 1.189</span>
            </div>
            <Progress value={0} aria-label="Progreso total: cero de 1.189 capítulos" className="h-1.5" />
            <p className="mt-2 text-xs leading-relaxed text-sidebar-foreground/58">Recorrido canónico: Génesis → Apocalipsis</p>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset id="contenido-principal" tabIndex={-1} className="min-w-0 bg-background">
        <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-border bg-background/92 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <SidebarTrigger aria-label="Abrir biblioteca bíblica" className="size-11 md:size-9" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <span className="hidden sm:inline">{activeStudy?.testament ?? "Canon bíblico"}</span>
              <ChevronRight aria-hidden="true" className="hidden size-3 sm:block" />
              <span>{activeStudy?.section ?? "Estudio profundo"}</span>
            </div>
            <p className="truncate text-sm font-semibold text-foreground sm:text-base">Lectura bíblica · {activeReference}</p>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <Button variant="outline" size="icon" disabled aria-label="Capítulo anterior">
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button variant="outline" className="min-w-28" disabled>
              Capítulo {activeChapterNumber} de {activeBookChapterCount || "—"}
            </Button>
            <Button variant="outline" size="icon" disabled aria-label="Capítulo siguiente, disponible al completar el estudio">
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_18.5rem] xl:gap-8">
          <div className="min-w-0">
            <section aria-labelledby="chapter-title" className="chapter-masthead overflow-hidden rounded-2xl border border-border bg-card">
              <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-9">
                <div className="max-w-3xl">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-primary/25 bg-primary/7 text-primary">{activeBookName.toUpperCase()}</Badge>
                    <Badge variant="outline" className="border-border bg-background/70">Capítulo {activeChapterNumber}</Badge>
                    <Badge variant="outline" className="border-border bg-background/70">
                      {activeStudy ? activeStudy.verses.length + " versículos estudiados" : "Estudio en preparación"}
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground">
                    {activeStudy?.lessonLabel ?? "Lectura canónica"}
                  </p>
                  <h1 id="chapter-title" className="font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-6xl">
                    {activeStudy?.title ?? activeReference}
                  </h1>
                  <p className="mt-4 max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg">
                    {activeStudy?.introduction ??
                      "El texto bíblico está disponible en el lector. El estudio profundo de este capítulo será incorporado progresivamente siguiendo el orden canónico."}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 lg:w-64">
                  <div className="metric-card"><span className="metric-value">66</span><span className="metric-label">libros</span></div>
                  <div className="metric-card"><span className="metric-value">1.189</span><span className="metric-label">capítulos</span></div>
                  <div className="metric-card"><span className="metric-value">3</span><span className="metric-label">versiones</span></div>
                </div>
              </div>
            </section>

            <BibleReader />

            {activeStudy && current ? (
            <section aria-labelledby="verse-selector-title" className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p id="verse-selector-title" className="text-sm font-semibold">Análisis versículo por versículo</p>
                  <p className="mt-1 text-sm text-muted-foreground">Capítulo completo · {activeStudy.bookName} {activeStudy.chapter}:1–{activeStudy.verses.length}</p>
                </div>
                <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-2 sm:flex-1" role="group" aria-label="Seleccionar versículo">
                  {activeStudy.verses.map((verse) => (
                    <button
                      key={verse.number}
                      type="button"
                      onClick={() => setSelectedVerse(verse.number)}
                      aria-pressed={activeVerseNumber === verse.number}
                      aria-label={`Estudiar ${activeStudy.bookName} ${activeStudy.chapter}:${verse.number}${completedVerses.includes(verse.number) ? ", estudiado" : ""}`}
                      className="verse-button"
                    >
                      {verse.number}
                      {completedVerses.includes(verse.number) && <span className="completed-dot" aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 border-t border-border pt-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="min-w-0">
                  <div className="mb-5 flex items-start gap-4">
                    <span className="verse-number" aria-hidden="true">{current.number}</span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{activeStudy.bookName} {activeStudy.chapter}:{current.number}</p>
                      <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{current.title}</h2>
                      <p className="mt-2 max-w-[70ch] leading-7 text-muted-foreground">{current.summary}</p>
                    </div>
                  </div>

                  <Tabs defaultValue="texto" className="w-full">
                    <TabsList variant="line" className="scrollbar-none h-auto max-w-full justify-start overflow-x-auto border-b border-border pb-0">
                      <TabsTrigger value="texto" className="min-h-11 px-3">Texto comparado</TabsTrigger>
                      <TabsTrigger value="exegesis" className="min-h-11 px-3">Exégesis</TabsTrigger>
                      <TabsTrigger value="teologia" className="min-h-11 px-3">Teología</TabsTrigger>
                      <TabsTrigger value="conexiones" className="min-h-11 px-3">Conexiones</TabsTrigger>
                    </TabsList>

                    <TabsContent value="texto" className="pt-5">
                      <Tabs defaultValue="rvr" className="w-full">
                        <TabsList aria-label="Versiones bíblicas" className="h-11 w-full justify-start overflow-x-auto bg-muted/70 p-1 sm:w-fit">
                          <TabsTrigger value="rvr" className="min-h-9 px-4">RVR1960</TabsTrigger>
                          <TabsTrigger value="ntv" className="min-h-9 px-4">NTV</TabsTrigger>
                          <TabsTrigger value="lbla" className="min-h-9 px-4">LBLA</TabsTrigger>
                        </TabsList>
                        {(["rvr", "ntv", "lbla"] as const).map((version) => (
                          <TabsContent key={version} value={version} className="pt-4">
                            <blockquote className="scripture-quote">
                              <span className="font-serif text-2xl leading-relaxed sm:text-3xl">{current[version]}</span>
                            </blockquote>
                            <p className="mt-3 text-xs leading-5 text-muted-foreground">
                              {current.exact
                                ? "Fragmento breve para comparación académica."
                                : "Resumen de estudio del contenido; no es una cita textual de la traducción."}
                            </p>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </TabsContent>

                    <TabsContent value="exegesis" className="pt-5">
                      <article className="reading-copy max-w-[72ch]">
                        <h3>Lectura del texto</h3>
                        <p>{current.exegesis}</p>
                        <div className="language-note">
                          <Languages aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
                          <div>
                            <p className="font-serif text-2xl leading-relaxed" lang="he" dir="rtl">{current.hebrew}</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">{current.transliteration}</p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{current.language}</p>
                          </div>
                        </div>
                      </article>
                    </TabsContent>

                    <TabsContent value="teologia" className="pt-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {activeStudy.theology.map(({ title, text }, index) => (
                          <div key={title} className="theology-card">
                            <span className="theology-index">0{index + 1}</span>
                            <h3>{title}</h3>
                            <p>{text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 rounded-xl border border-accent/35 bg-accent/9 p-4 text-sm leading-6">
                        <strong>Precisión doctrinal:</strong> {activeStudy.doctrinalNote}
                      </div>
                    </TabsContent>

                    <TabsContent value="conexiones" className="pt-5">
                      <div className="divide-y divide-border rounded-xl border border-border">
                        {activeStudy.connections.map(([reference, text]) => (
                          <div key={reference} className="grid gap-1 p-4 sm:grid-cols-[8rem_1fr] sm:gap-5">
                            <p className="font-semibold text-primary">{reference}</p>
                            <p className="text-sm leading-6 text-muted-foreground">{text}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <aside className="rounded-xl border border-border bg-muted/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Palabra clave</p>
                  <p className="mt-3 font-serif text-3xl leading-tight" lang="he" dir="rtl">{current.hebrew.split(" ")[0]}</p>
                  <p className="mt-1 font-semibold">{current.transliteration.split(" ")[0]}</p>
                  <div className="my-4 h-px bg-border" />
                  <p className="text-sm leading-6 text-muted-foreground">El análisis léxico apoya la lectura del pasaje, pero ninguna doctrina debe construirse únicamente a partir de la forma de una palabra.</p>
                </aside>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {isComplete
                    ? `${activeStudy.bookName} ${activeStudy.chapter}:${activeVerseNumber} marcado como estudiado.`
                    : `Estudiando ${activeStudy.bookName} ${activeStudy.chapter}:${activeVerseNumber} de ${activeStudy.verses.length}.`}
                </p>
                <Button onClick={toggleCompleted} variant={isComplete ? "outline" : "default"} className="min-h-11 sm:min-w-52">
                  {isComplete && <Check aria-hidden="true" />}
                  {isComplete ? "Versículo estudiado" : "Marcar como estudiado"}
                </Button>
              </div>
            </section>
            ) : (
            <section className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8" aria-labelledby="study-pending-title">
              <Badge variant="outline" className="border-primary/25 bg-primary/7 text-primary">PRÓXIMAMENTE</Badge>
              <h2 id="study-pending-title" className="mt-4 font-serif text-3xl font-semibold tracking-tight">
                Estudio profundo en preparación
              </h2>
              <p className="mt-3 max-w-[68ch] leading-7 text-muted-foreground">
                Puedes leer {activeReference} completo en el lector superior. El análisis versículo por versículo se incorporará siguiendo el orden canónico; actualmente están disponibles Génesis 1 y Génesis 2.
              </p>
            </section>
            )}
          </div>

          <aside className="space-y-5 xl:sticky xl:top-22 xl:self-start" aria-label="Ruta y progreso del estudio">
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Milestone aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Ruta del estudio</h2>
                  <p className="text-sm text-muted-foreground">Método exegético</p>
                </div>
              </div>
              <ol className="study-path mt-5">
                {[
                  ["Texto", "Comparar las traducciones"],
                  ["Contexto", "Ubicar el pasaje"],
                  ["Lenguas", "Examinar términos clave"],
                  ["Teología", "Formular la doctrina"],
                  ["Aplicación", "Responder al mensaje"],
                ].map(([title, description], index) => (
                  <li key={title}>
                    <span>{index + 1}</span>
                    <div>
                      <p>{title}</p>
                      <small>{description}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">Progreso del capítulo</h2>
                <span className="text-sm font-semibold tabular-nums">
                  {completedVerses.length}/{activeStudy?.verses.length ?? 0}
                </span>
              </div>
              <Progress
                value={chapterProgress}
                aria-label={`${completedVerses.length} de ${activeStudy?.verses.length ?? 0} versículos estudiados`}
              />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Cada versículo completado se conservará durante esta sesión de estudio.</p>
            </section>

            <section className="rounded-2xl bg-foreground p-5 text-background">
              <div className="flex items-center gap-2 text-background/68">
                <ScrollText aria-hidden="true" className="size-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">Principio hermenéutico</p>
              </div>
              <blockquote className="mt-4 font-serif text-xl leading-7">
                Comprender primero lo que el texto dice; interpretar después lo que significa; aplicar finalmente lo que enseña.
              </blockquote>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <LibraryBig aria-hidden="true" className="size-4 text-primary" />
                <h2 className="font-semibold">Base textual</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">RVR1960 como versión principal, acompañada por NTV y LBLA, con consulta del hebreo, arameo y griego.</p>
              <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">La publicación de capítulos completos de traducciones protegidas requerirá licencia o una fuente autorizada.</p>
            </section>
          </aside>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
