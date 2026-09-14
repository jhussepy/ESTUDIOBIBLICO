import { describe, expect, it } from "vitest";

import {
  getCatalogEntryBySlug,
  studyCatalog,
  validateStudyCatalog,
} from "../lib/study-catalog";
import {
  getStudyGuide,
  studyGuides,
  validateStudyGuides,
} from "../lib/study-guides";
import {
  normalizeStudyQuery,
  searchStudies,
} from "../lib/study-search";
import { chapterStudies } from "../lib/studies";

describe("fundamentos profesionales del estudio", () => {
  it("mantiene el catálogo ligero alineado con el contenido publicado", () => {
    expect(validateStudyCatalog()).toBe(true);
    expect(studyCatalog.map((entry) => entry.key)).toEqual(
      chapterStudies.map((study) => study.key),
    );

    for (const entry of studyCatalog) {
      const study = chapterStudies.find((item) => item.key === entry.key);
      expect(study?.verses).toHaveLength(entry.verseCount);
    }
  });

  it("resuelve rutas SEO sin cargar el contenido exegético completo", () => {
    expect(getCatalogEntryBySlug("genesis", 1)?.key).toBe("GEN-1");
    expect(getCatalogEntryBySlug("genesis", 10)?.key).toBe("GEN-10");
    expect(getCatalogEntryBySlug("genesis", 11)).toBeUndefined();
  });

  it("publica una guía completa y única para cada capítulo", () => {
    const keys = chapterStudies.map((study) => study.key);
    expect(validateStudyGuides(keys)).toBe(true);
    expect(studyGuides).toHaveLength(10);
    expect(new Set(studyGuides.map((guide) => guide.studyKey)).size).toBe(10);

    for (const key of keys) {
      const guide = getStudyGuide(key);
      expect(guide?.thesis.length).toBeGreaterThan(40);
      expect(guide?.literaryContext.length).toBeGreaterThan(40);
      expect(guide?.interpretiveGuardrail.length).toBeGreaterThan(40);
    }
  });
});

describe("buscador del estudio", () => {
  it("normaliza mayúsculas, puntuación y tildes", () => {
    expect(normalizeStudyQuery("  Creación, GRACIA  ")).toBe("creacion gracia");
  });

  it("encuentra temas sin exigir tildes", () => {
    const results = searchStudies(chapterStudies, "creacion");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.bookId === "GEN")).toBe(true);
  });

  it("combina todos los términos y prioriza títulos o referencias", () => {
    const results = searchStudies(chapterStudies, "imagen Dios");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].reference).toMatch(/^Génesis/);
    expect(results.every((result) => result.score > 0)).toBe(true);
  });

  it("admite escritura hebrea y limita resultados", () => {
    expect(searchStudies(chapterStudies, "בָּרָא", 3).length).toBeGreaterThan(0);
    expect(searchStudies(chapterStudies, "Dios", 3)).toHaveLength(3);
  });

  it("evita búsquedas accidentales o sin coincidencias", () => {
    expect(searchStudies(chapterStudies, "d")).toEqual([]);
    expect(searchStudies(chapterStudies, "término-inexistente-xyz")).toEqual([]);
    expect(searchStudies(chapterStudies, "Dios", 0)).toEqual([]);
  });
});
