"use client";

import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { ChapterStudy } from "@/lib/studies";
import { searchStudies, type StudySearchResult } from "@/lib/study-search";

interface StudySearchProps {
  studies: readonly ChapterStudy[];
  onSelect: (result: StudySearchResult) => void;
}

export function StudySearch({ studies, onSelect }: StudySearchProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchStudies(studies, query), [query, studies]);
  const hasQuery = query.trim().length >= 2;

  return (
    <section
      className="rounded-2xl border border-border bg-card p-4 sm:p-5"
      aria-labelledby={inputId + "-title"}
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Search aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h2 id={inputId + "-title"} className="font-serif text-xl font-semibold">
            Buscar en el estudio
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Encuentra referencias, temas y palabras hebreas dentro de Génesis 1–10.
          </p>
        </div>
      </div>

      <label htmlFor={inputId} className="sr-only">
        Buscar por tema, palabra o referencia
      </label>
      <div className="relative mt-4">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ej.: imagen de Dios, pacto, gracia…"
          autoComplete="off"
          className="min-h-11 w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-base outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/35"
        />
      </div>

      <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
        {hasQuery
          ? results.length
            ? `${results.length} resultados más relevantes`
            : "No encontramos coincidencias. Prueba otra palabra."
          : "Escribe al menos dos caracteres."}
      </p>

      {hasQuery && results.length > 0 && (
        <ul className="mt-3 grid max-h-80 gap-2 overflow-y-auto pr-1" aria-label="Resultados de búsqueda">
          {results.map((result) => (
            <li key={result.key}>
              <button
                type="button"
                onClick={() => onSelect(result)}
                className="w-full cursor-pointer rounded-lg border border-border bg-muted/25 p-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  {result.reference}
                </span>
                <span className="mt-1 block font-semibold text-foreground">{result.title}</span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                  {result.excerpt}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
