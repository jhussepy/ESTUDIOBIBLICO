import { describe, expect, it } from "vitest";

import {
  chapterEditorialRecords,
  formatEditorialDate,
  getEditorialRecord,
  getSourcesForStudy,
  isValidEditorialDate,
} from "../lib/editorial";

describe("fechas editoriales", () => {
  it.each([
    "0000-01-01",
    "0004-02-29",
    "0099-12-31",
    "2000-02-29",
    "2026-09-14",
  ])("acepta la fecha válida %s", (value) => {
    expect(isValidEditorialDate(value)).toBe(true);
  });

  it.each([
    "0001-02-29",
    "0099-02-29",
    "1900-02-29",
    "2026-02-30",
    "2026-00-10",
    "2026-13-01",
    "2026-9-14",
    "14-09-2026",
  ])("rechaza la fecha inválida %s", (value) => {
    expect(isValidEditorialDate(value)).toBe(false);
  });

  it.each([
    ["0000-01-01", "1 ene 0000"],
    ["0001-01-01", "1 ene 0001"],
    ["0099-12-31", "31 dic 0099"],
    ["2026-09-14", "14 sept 2026"],
  ])("formatea %s sin alterar su año", (value, expected) => {
    expect(formatEditorialDate(value)).toBe(expected);
  });

  it("conserva literalmente una fecha inválida", () => {
    expect(formatEditorialDate("2026-02-30")).toBe("2026-02-30");
  });
});

describe("catálogo editorial", () => {
  it("mantiene un registro único para cada capítulo publicado", () => {
    const keys = chapterEditorialRecords.map((record) => record.studyKey);
    expect(keys).toHaveLength(10);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toEqual(Array.from({ length: 10 }, (_, index) => `GEN-${index + 1}`));
  });

  it("resuelve el registro y sus fuentes", () => {
    expect(getEditorialRecord("GEN-1")?.status).toBe("reviewing");
    expect(getSourcesForStudy("GEN-1").length).toBeGreaterThanOrEqual(3);
    expect(getEditorialRecord("GEN-999")).toBeUndefined();
    expect(getSourcesForStudy("GEN-999")).toEqual([]);
  });
});
