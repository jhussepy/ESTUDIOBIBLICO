import type { ChapterStudy, VerseStudy } from "./studies";

export interface StudySearchResult {
  key: string;
  bookId: string;
  chapter: number;
  verse: number;
  reference: string;
  title: string;
  excerpt: string;
  score: number;
}

export function normalizeStudyQuery(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9\u0590-\u05ff]+/g, " ")
    .trim();
}

function verseHaystack(study: ChapterStudy, verse: VerseStudy) {
  return normalizeStudyQuery([
    study.bookName,
    String(study.chapter),
    verse.title,
    verse.summary,
    verse.exegesis,
    verse.language,
    verse.hebrew,
    verse.transliteration,
  ].join(" "));
}

function scoreVerse(study: ChapterStudy, verse: VerseStudy, terms: string[]) {
  const title = normalizeStudyQuery(verse.title);
  const summary = normalizeStudyQuery(verse.summary);
  const reference = normalizeStudyQuery(`${study.bookName} ${study.chapter} ${verse.number}`);
  const haystack = verseHaystack(study, verse);
  let score = 0;

  for (const term of terms) {
    if (!haystack.includes(term)) return 0;
    if (reference.includes(term)) score += 8;
    if (title.includes(term)) score += 5;
    if (summary.includes(term)) score += 3;
    score += 1;
  }

  return score;
}

function createExcerpt(verse: VerseStudy, terms: string[]) {
  const source = verse.summary || verse.exegesis;
  const normalized = normalizeStudyQuery(source);
  const firstMatch = Math.max(0, ...terms.map((term) => normalized.indexOf(term)));
  if (source.length <= 150) return source;
  const start = firstMatch > 55 ? firstMatch - 45 : 0;
  return `${start > 0 ? "…" : ""}${source.slice(start, start + 150).trim()}${start + 150 < source.length ? "…" : ""}`;
}

export function searchStudies(
  studies: readonly ChapterStudy[],
  query: string,
  limit = 12,
): StudySearchResult[] {
  const normalized = normalizeStudyQuery(query);
  if (normalized.length < 2 || limit < 1) return [];
  const terms = normalized.split(/\s+/).filter(Boolean);
  const results: StudySearchResult[] = [];

  for (const study of studies) {
    for (const verse of study.verses) {
      const score = scoreVerse(study, verse, terms);
      if (!score) continue;
      results.push({
        key: `${study.key}:${verse.number}`,
        bookId: study.bookId,
        chapter: study.chapter,
        verse: verse.number,
        reference: `${study.bookName} ${study.chapter}:${verse.number}`,
        title: verse.title,
        excerpt: createExcerpt(verse, terms),
        score,
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.chapter - b.chapter || a.verse - b.verse)
    .slice(0, limit);
}
