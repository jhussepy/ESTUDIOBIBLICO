import { describe, expect, it } from "vitest";

import {
  chapterStudies,
  getAvailableStudyChapters,
  getChapterStudy,
  getChapterStudyBySlug,
} from "../lib/studies";
import { validateEditorialRecords } from "../lib/editorial";

describe("catálogo de estudios", () => {
  it("publica Génesis 1–10 en orden canónico", () => {
    expect(getAvailableStudyChapters("GEN")).toEqual(
      Array.from({ length: 10 }, (_, index) => index + 1),
    );
  });

  it("mantiene claves únicas y versículos consecutivos", () => {
    const keys = chapterStudies.map((study) => study.key);
    expect(new Set(keys).size).toBe(keys.length);

    for (const study of chapterStudies) {
      expect(study.key).toBe(`${study.bookId}-${study.chapter}`);
      expect(study.verses.length).toBeGreaterThan(0);
      expect(study.verses.map((verse) => verse.number)).toEqual(
        Array.from({ length: study.verses.length }, (_, index) => index + 1),
      );
      expect(study.theology.length).toBeGreaterThanOrEqual(3);
      expect(study.connections.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("resuelve las rutas por identificador y slug", () => {
    expect(getChapterStudy("GEN", 1)?.key).toBe("GEN-1");
    expect(getChapterStudyBySlug("genesis", 10)?.key).toBe("GEN-10");
    expect(getChapterStudy("GEN", 11)).toBeUndefined();
    expect(getChapterStudyBySlug("exodo", 1)).toBeUndefined();
  });

  it("mantiene alineados estudios y registros editoriales", () => {
    expect(() =>
      validateEditorialRecords(chapterStudies.map((study) => study.key)),
    ).not.toThrow();
  });
});
