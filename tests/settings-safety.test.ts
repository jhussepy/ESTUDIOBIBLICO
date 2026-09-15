import { describe, expect, it } from "vitest";

import {
  getRememberedBibleId,
  getRememberedReading,
} from "../lib/bible-reader-startup";
import {
  isWorkspaceBackup,
  normalizeWorkspace,
  type ReadingLocation,
  type StudyWorkspaceState,
} from "../lib/study-workspace";

const rememberedReading: ReadingLocation = {
  bibleId: "NTV",
  bookId: "EXO",
  chapterId: "EXO.4",
  chapterNumber: 4,
};

const validBackup: StudyWorkspaceState = {
  version: 1,
  completedByStudy: { "GEN-1": [1, 2] },
  bookmarks: ["GEN-1:1"],
  notes: { "GEN-1:1": "Dios crea por su palabra." },
  lastReading: rememberedReading,
  preferences: {
    readingScale: "normal",
    readingLineHeight: "comfortable",
    readingWidth: "balanced",
    readingFont: "serif",
    focusMode: false,
    rememberLastReading: true,
    defaultBibleId: "NTV",
    reduceMotion: false,
    colorPalette: "manuscript",
    colorMode: "system",
    highContrast: false,
  },
};

describe("prioridad de navegación inicial", () => {
  it("no aplica la lectura recordada sobre una ruta canónica explícita", () => {
    expect(
      getRememberedReading({
        requestedBookId: "",
        selectedBibleId: "NTV",
        initialLocationIsExplicit: true,
        rememberLastReading: true,
        lastReading: rememberedReading,
      }),
    ).toBeNull();

    expect(
      getRememberedBibleId({
        requestedBibleId: "",
        initialLocationIsExplicit: true,
        rememberLastReading: true,
        lastReading: rememberedReading,
      }),
    ).toBe("");
  });

  it("restaura la lectura recordada únicamente en la portada genérica", () => {
    expect(
      getRememberedReading({
        requestedBookId: "",
        selectedBibleId: "NTV",
        initialLocationIsExplicit: false,
        rememberLastReading: true,
        lastReading: rememberedReading,
      }),
    ).toEqual(rememberedReading);
  });

  it("prioriza los parámetros de consulta sobre cualquier recuerdo", () => {
    expect(
      getRememberedReading({
        requestedBookId: "GEN",
        selectedBibleId: "NTV",
        initialLocationIsExplicit: false,
        rememberLastReading: true,
        lastReading: rememberedReading,
      }),
    ).toBeNull();
  });
});

describe("seguridad de respaldos", () => {
  it("acepta el esquema completo exportado por la aplicación", () => {
    expect(isWorkspaceBackup(validBackup)).toBe(true);
  });

  it("rechaza arrays usados como objetos antes de reemplazar datos", () => {
    expect(
      isWorkspaceBackup({
        version: 1,
        bookmarks: [],
        completedByStudy: [],
        notes: [],
        preferences: [],
        lastReading: null,
      }),
    ).toBe(false);
  });

  it("rechaza versiones y valores internos malformados", () => {
    expect(isWorkspaceBackup({ ...validBackup, version: 2 })).toBe(false);
    expect(
      isWorkspaceBackup({
        ...validBackup,
        completedByStudy: { "GEN-1": [1, "2"] },
      }),
    ).toBe(false);
    expect(
      isWorkspaceBackup({
        ...validBackup,
        notes: { "GEN-1:1": 42 },
      }),
    ).toBe(false);
  });

  it("mantiene una migración tolerante para datos locales anteriores", () => {
    const migrated = normalizeWorkspace({
      version: 1,
      completedByStudy: { "GEN-1": [1, -1, 1] },
      bookmarks: ["GEN-1:1"],
      notes: { "GEN-1:1": "Nota" },
      preferences: { readingScale: "large" },
    });

    expect(migrated.completedByStudy["GEN-1"]).toEqual([1]);
    expect(migrated.preferences.readingScale).toBe("large");
    expect(migrated.preferences.readingWidth).toBe("balanced");
  });
});
