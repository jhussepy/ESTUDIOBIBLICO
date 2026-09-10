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
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const verses = [
  {
    number: 1,
    title: "El Creador y el comienzo",
    summary: "Dios inaugura la historia bíblica como sujeto soberano de toda la creación.",
    hebrew: "בְּרֵאשִׁית בָּרָא אֱלֹהִים",
    transliteration: "Bereshit bara Elohim",
    rvr: "“En el principio creó Dios los cielos y la tierra.”",
    ntv: "“En el principio, Dios creó los cielos y la tierra.”",
    lbla: "“En el principio creó Dios los cielos y la tierra.”",
    exact: true,
    exegesis: "La Biblia comienza con Dios, no intentando demostrar su existencia, sino presentándolo como el agente que inicia todo cuanto existe. «Los cielos y la tierra» funciona como una expresión totalizadora: comprende la realidad creada en su conjunto.",
    language: "Bereshit significa «en el principio». Bara describe aquí la acción creadora de Dios. Elohim tiene forma plural, pero el verbo está en singular; esta concordancia afirma un solo agente divino y, por sí sola, no constituye una demostración completa de la Trinidad.",
  },
  {
    number: 2,
    title: "La tierra sin ordenar",
    summary: "La escena inicial aparece deshabitada y sin ordenar, mientras el Espíritu de Dios se mueve sobre las aguas.",
    hebrew: "תֹהוּ וָבֹהוּ",
    transliteration: "Tohu va-vohu",
    rvr: "La tierra aparece desordenada y vacía; el Espíritu de Dios se mueve sobre las aguas.",
    ntv: "La creación todavía no tiene su forma habitable; el Espíritu de Dios está presente y activo.",
    lbla: "El relato presenta oscuridad, profundidad y una tierra aún sin forma ni población.",
    exact: false,
    exegesis: "El versículo no describe necesariamente una creación malvada ni una catástrofe previa. Presenta un mundo todavía no organizado para la vida. Los días siguientes mostrarán a Dios formando y llenando aquello que aquí aparece sin forma y vacío.",
    language: "Tohu va-vohu comunica desolación, falta de orden y ausencia de habitantes. Ruaj Elohim puede relacionarse con «Espíritu de Dios» y, según el contexto léxico, con «viento de Dios»; la imagen subraya la presencia divina sobre las aguas.",
  },
  {
    number: 3,
    title: "La palabra que crea",
    summary: "Dios ordena que exista la luz, y la realidad responde eficazmente a su palabra.",
    hebrew: "יְהִי אוֹר",
    transliteration: "Yehi or",
    rvr: "Dios pronuncia su mandato creador y aparece la luz.",
    ntv: "La palabra divina produce inmediatamente aquello que Dios dispone.",
    lbla: "La luz comienza a existir por la orden eficaz del Creador.",
    exact: false,
    exegesis: "El repetido «dijo Dios» establece uno de los ritmos fundamentales del capítulo. La creación no nace de una lucha entre divinidades: responde a la autoridad de la palabra del único Dios.",
    language: "La fórmula yehi or es breve y enfática: «sea luz». La correspondencia entre la orden y su cumplimiento comunica eficacia absoluta, no un deseo incierto.",
  },
  {
    number: 4,
    title: "Bondad y distinción",
    summary: "Dios reconoce la bondad de la luz y establece una distinción entre luz y oscuridad.",
    hebrew: "כִּי־טוֹב",
    transliteration: "Ki tov",
    rvr: "Dios declara buena la luz y la distingue de la oscuridad.",
    ntv: "El Creador evalúa su obra como buena y establece orden mediante separación.",
    lbla: "La valoración divina y la separación muestran propósito dentro de la creación.",
    exact: false,
    exegesis: "La bondad no es definida por una fuerza externa a Dios: el Creador evalúa su obra conforme a su propósito. Separar no implica que la oscuridad sea una divinidad rival, sino que Dios establece límites y funciones.",
    language: "Tov puede expresar bondad, adecuación o aquello que cumple correctamente su finalidad. La frase ki tov actúa como evaluación divina de la obra realizada.",
  },
  {
    number: 5,
    title: "El primer día",
    summary: "Dios nombra el día y la noche; tarde y mañana delimitan el primer ciclo del relato.",
    hebrew: "יוֹם אֶחָד",
    transliteration: "Yom ejad",
    rvr: "Dios nombra Día y Noche; la fórmula de tarde y mañana cierra el primer día.",
    ntv: "El primer ciclo queda definido por la alternancia de tarde y mañana.",
    lbla: "Nombrar manifiesta autoridad, y la fórmula temporal concluye la primera jornada.",
    exact: false,
    exegesis: "En el mundo antiguo, nombrar expresa autoridad. El cierre «tarde y mañana» organiza el relato en jornadas. La naturaleza precisa de estos días ha generado varias interpretaciones cristianas, pero todas deben comenzar por la función literaria de la secuencia en el texto.",
    language: "Yom puede referirse a un día ordinario o, en otros contextos, a un período. Aquí aparece acompañado por una fórmula numérica y temporal; su interpretación debe considerar tanto la gramática como la estructura completa de Génesis 1.",
  },
];

const connections = [
  ["Salmo 33:6", "La creación mediante la palabra del Señor."],
  ["Juan 1:1–3", "El prólogo identifica al Verbo como agente de la creación."],
  ["Colosenses 1:16", "Todas las cosas fueron creadas por medio de Cristo y para él."],
  ["Hebreos 11:3", "La fe reconoce que el universo fue constituido por la palabra de Dios."],
] as const;

export default function Home() {
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [completedVerses, setCompletedVerses] = useState<number[]>([]);
  const current = useMemo(
    () => verses.find((verse) => verse.number === selectedVerse) ?? verses[0],
    [selectedVerse],
  );
  const isComplete = completedVerses.includes(selectedVerse);
  const chapterProgress = (completedVerses.length / 31) * 100;

  function toggleCompleted() {
    setCompletedVerses((currentVerses) =>
      currentVerses.includes(selectedVerse)
        ? currentVerses.filter((verse) => verse !== selectedVerse)
        : [...currentVerses, selectedVerse].sort((a, b) => a - b),
    );
  }

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    try {
      const registration = context.registerTool({
        name: "set_genesis_verse_studied",
        title: "Actualizar progreso de Génesis",
        description:
          "Marca o desmarca como estudiado uno de los versículos 1 al 5 de Génesis 1 y lo muestra en la interfaz.",
        inputSchema: {
          type: "object",
          properties: {
            verse: { type: "integer", minimum: 1, maximum: 5 },
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
            (input as { verse: number }).verse > 5 ||
            typeof (input as { studied?: unknown }).studied !== "boolean"
          ) {
            throw new Error("El versículo debe estar entre 1 y 5 y «studied» debe ser verdadero o falso.");
          }

          const { verse, studied } = input as { verse: number; studied: boolean };
          setSelectedVerse(verse);
          setCompletedVerses((currentVerses) => {
            const next = currentVerses.filter((item) => item !== verse);
            if (studied) next.push(verse);
            return next.sort((a, b) => a - b);
          });
          await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
          return { reference: `Génesis 1:${verse}`, studied };
        },
      }, { signal: lifecycle.signal });
      void Promise.resolve(registration).catch(() => undefined);
    } catch {
      return () => lifecycle.abort();
    }

    return () => lifecycle.abort();
  }, []);

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
                    const active = book === "Génesis";
                    return (
                      <SidebarMenuItem key={book}>
                        <SidebarMenuButton
                          isActive={active}
                          disabled={!active}
                          aria-label={active ? `${book}, libro actual` : `${book}, ${chapters} capítulos, pendiente`}
                          className="h-9 disabled:opacity-100 data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                        >
                          <span className={active ? "font-semibold" : "text-sidebar-foreground/76"}>{book}</span>
                        </SidebarMenuButton>
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
              <span className="hidden sm:inline">Antiguo Testamento</span>
              <ChevronRight aria-hidden="true" className="hidden size-3 sm:block" />
              <span>Pentateuco</span>
            </div>
            <p className="truncate text-sm font-semibold text-foreground sm:text-base">Génesis 1 · La creación</p>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <Button variant="outline" size="icon" disabled aria-label="Capítulo anterior">
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button variant="outline" className="min-w-28" disabled>
              Capítulo 1 de 50
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
                    <Badge variant="outline" className="border-primary/25 bg-primary/7 text-primary">GÉNESIS</Badge>
                    <Badge variant="outline" className="border-border bg-background/70">Capítulo 1</Badge>
                    <Badge variant="outline" className="border-border bg-background/70">31 versículos</Badge>
                  </div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground">Primera lección</p>
                  <h1 id="chapter-title" className="font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-6xl">
                    En el principio
                  </h1>
                  <p className="mt-4 max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg">
                    Génesis 1 presenta a Dios como Creador soberano y ordena el mundo mediante su palabra. Empezamos con el texto, su contexto y su significado antes de evaluar debates posteriores.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 lg:w-64">
                  <div className="metric-card"><span className="metric-value">66</span><span className="metric-label">libros</span></div>
                  <div className="metric-card"><span className="metric-value">1.189</span><span className="metric-label">capítulos</span></div>
                  <div className="metric-card"><span className="metric-value">3</span><span className="metric-label">versiones</span></div>
                </div>
              </div>
            </section>

            <section aria-labelledby="verse-selector-title" className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p id="verse-selector-title" className="text-sm font-semibold">Análisis versículo por versículo</p>
                  <p className="mt-1 text-sm text-muted-foreground">Primera unidad literaria · Génesis 1:1–5</p>
                </div>
                <div className="flex items-center gap-2" role="group" aria-label="Seleccionar versículo">
                  {verses.map((verse) => (
                    <button
                      key={verse.number}
                      type="button"
                      onClick={() => setSelectedVerse(verse.number)}
                      aria-pressed={selectedVerse === verse.number}
                      aria-label={`Estudiar Génesis 1:${verse.number}${completedVerses.includes(verse.number) ? ", estudiado" : ""}`}
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
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Génesis 1:{current.number}</p>
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
                        {[
                          ["Dios es anterior a la creación", "El relato distingue radicalmente al Creador de todo lo creado."],
                          ["La creación tiene propósito", "El orden y la evaluación divina muestran intención, no azar teológico."],
                          ["La palabra divina es eficaz", "Lo que Dios dispone llega a existir y cumple su función."],
                          ["Cristo y la creación", "El Nuevo Testamento identifica al Hijo como agente de la creación sin borrar la unidad de Dios."],
                        ].map(([title, text], index) => (
                          <div key={title} className="theology-card">
                            <span className="theology-index">0{index + 1}</span>
                            <h3>{title}</h3>
                            <p>{text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 rounded-xl border border-accent/35 bg-accent/9 p-4 text-sm leading-6">
                        <strong>Precisión doctrinal:</strong> la creación de la nada se formula con mayor claridad al leer Génesis junto con pasajes como Hebreos 11:3. No conviene exigir que Génesis 1:1 responda por sí solo a todas las preguntas filosóficas posteriores.
                      </div>
                    </TabsContent>

                    <TabsContent value="conexiones" className="pt-5">
                      <div className="divide-y divide-border rounded-xl border border-border">
                        {connections.map(([reference, text]) => (
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
                  {isComplete ? `Génesis 1:${selectedVerse} marcado como estudiado.` : `Estudiando Génesis 1:${selectedVerse} de 31.`}
                </p>
                <Button onClick={toggleCompleted} variant={isComplete ? "outline" : "default"} className="min-h-11 sm:min-w-52">
                  {isComplete && <Check aria-hidden="true" />}
                  {isComplete ? "Versículo estudiado" : "Marcar como estudiado"}
                </Button>
              </div>
            </section>
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
                <span className="text-sm font-semibold tabular-nums">{completedVerses.length}/31</span>
              </div>
              <Progress value={chapterProgress} aria-label={`${completedVerses.length} de 31 versículos estudiados`} />
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
