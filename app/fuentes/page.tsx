import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  ExternalLink,
  FileCheck2,
  LibraryBig,
  Scale,
  SearchCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  academicSources,
  chapterEditorialRecords,
  editorialStatusMeta,
  type SourceCategory,
} from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Fuentes y criterios editoriales",
  description: "Bibliografía, estados de revisión y criterios de citación de los estudios bíblicos.",
  alternates: { canonical: "/fuentes" },
  openGraph: {
    title: "Fuentes y criterios editoriales",
    description: "Bibliografía y criterios de transparencia de la Academia Bíblica.",
    url: "/fuentes",
  },
};

const categories: readonly SourceCategory[] = [
  "Texto y traducciones",
  "Léxico",
  "Comentario",
  "Contexto",
];

const distinctions = [
  {
    icon: BookOpenCheck,
    title: "Dato textual",
    text: "Lo que puede observarse directamente en el texto bíblico, su gramática o su estructura.",
  },
  {
    icon: SearchCheck,
    title: "Interpretación",
    text: "Una explicación razonada que debe contrastarse con contexto, fuentes y lecturas alternativas.",
  },
  {
    icon: Scale,
    title: "Síntesis doctrinal",
    text: "Una formulación teológica construida desde el conjunto del canon, no desde una palabra aislada.",
  },
] as const;

export default function SourcesPage() {
  const reviewingTotal = chapterEditorialRecords.filter((record) => record.status === "reviewing").length;

  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2" aria-label="Navegación editorial">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Volver al estudio
          </Link>
          <Link
            href="/metodologia"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
          >
            Metodología editorial
          </Link>
        </nav>

        <header className="mt-8 grid gap-7 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-accent-foreground">
              <LibraryBig aria-hidden="true" className="size-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.16em]">Transparencia académica</p>
            </div>
            <h1 className="mt-4 max-w-[18ch] text-balance font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Fuentes y criterios editoriales
            </h1>
            <p className="mt-5 max-w-[72ch] text-lg leading-8 text-muted-foreground">
              Cada estudio declara su bibliografía base, sus cuestiones interpretativas y su nivel de revisión. Una fuente orienta y permite comprobar; no reemplaza la lectura responsable del texto.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-muted/45 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Fuentes base</dt>
              <dd className="mt-2 font-serif text-4xl font-semibold">{academicSources.length}</dd>
            </div>
            <div className="rounded-xl border border-border bg-muted/45 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">En revisión</dt>
              <dd className="mt-2 font-serif text-4xl font-semibold">{reviewingTotal}</dd>
            </div>
          </dl>
        </header>

        <section className="mt-6" aria-labelledby="distinctions-title">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-foreground">Cómo leer el análisis</p>
            <h2 id="distinctions-title" className="mt-2 font-serif text-3xl font-semibold">Tres niveles que no deben confundirse</h2>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {distinctions.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-5">
                <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="bibliography-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-foreground">Bibliografía base</p>
              <h2 id="bibliography-title" className="mt-2 font-serif text-3xl font-semibold">Fuentes utilizadas en Génesis 1–10</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Las referencias corresponden al conjunto del capítulo; no implican que una sola obra respalde cada conclusión.
            </p>
          </div>

          <div className="mt-5 space-y-7">
            {categories.map((category) => (
              <section key={category} aria-labelledby={`category-${category.replaceAll(" ", "-").toLowerCase()}`}>
                <h3 id={`category-${category.replaceAll(" ", "-").toLowerCase()}`} className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {category}
                </h3>
                <div className="grid gap-3 lg:grid-cols-2">
                  {academicSources.filter((source) => source.category === category).map((source) => (
                    <article key={source.id} className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold">{source.shortTitle}</h4>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{source.citation}</p>
                        </div>
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Abrir ${source.shortTitle} en una pestaña nueva`}
                            className="grid size-11 shrink-0 place-items-center rounded-lg border border-border text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
                          >
                            <ExternalLink aria-hidden="true" className="size-4" />
                          </a>
                        )}
                      </div>
                      <p className="mt-4 border-t border-border pt-3 text-sm leading-6"><strong>Uso editorial:</strong> {source.use}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8" aria-labelledby="status-title">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <FileCheck2 aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h2 id="status-title" className="font-serif text-3xl font-semibold">Estados editoriales</h2>
              <p className="mt-2 max-w-[72ch] leading-7 text-muted-foreground">
                El estado se muestra dentro de cada capítulo. “En revisión” no equivale a una aprobación teológica humana.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {(Object.entries(editorialStatusMeta) as Array<[keyof typeof editorialStatusMeta, (typeof editorialStatusMeta)[keyof typeof editorialStatusMeta]]>).map(([status, meta]) => (
              <article key={status} className="rounded-xl bg-muted/50 p-4">
                <Badge variant={status === "published" ? "default" : "outline"}>{meta.label}</Badge>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{meta.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
