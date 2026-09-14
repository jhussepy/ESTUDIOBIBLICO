export interface StudyCatalogEntry {
  key: string;
  bookId: string;
  bookSlug: string;
  bookName: string;
  chapter: number;
  title: string;
  description: string;
  verseCount: number;
  updatedAt: string;
}

export const studyCatalog: StudyCatalogEntry[] = [
  { key: "GEN-1", bookId: "GEN", bookSlug: "genesis", bookName: "Génesis", chapter: 1, title: "En el principio", description: "Dios crea, ordena y bendice un mundo bueno; la humanidad recibe su imagen y vocación.", verseCount: 31, updatedAt: "2026-09-14" },
  { key: "GEN-2", bookId: "GEN", bookSlug: "genesis", bookName: "Génesis", chapter: 2, title: "El jardín y la vocación humana", description: "El descanso divino, el huerto, el trabajo humano y la alianza matrimonial.", verseCount: 25, updatedAt: "2026-09-14" },
  { key: "GEN-3", bookId: "GEN", bookSlug: "genesis", bookName: "Génesis", chapter: 3, title: "La caída y la primera esperanza", description: "La rebelión humana rompe la comunión, pero el juicio divino contiene promesa y misericordia.", verseCount: 24, updatedAt: "2026-09-14" },
  { key: "GEN-4", bookId: "GEN", bookSlug: "genesis", bookName: "Génesis", chapter: 4, title: "Caín, Abel y la expansión del pecado", description: "El pecado llega a la fraternidad, mientras Dios juzga, protege y preserva una línea de adoración.", verseCount: 26, updatedAt: "2026-09-14" },
  { key: "GEN-5", bookId: "GEN", bookSlug: "genesis", bookName: "Génesis", chapter: 5, title: "De Adán a Noé", description: "La genealogía conserva la promesa a través de generaciones marcadas por la muerte.", verseCount: 32, updatedAt: "2026-09-14" },
  { key: "GEN-6", bookId: "GEN", bookSlug: "genesis", bookName: "Génesis", chapter: 6, title: "Corrupción, juicio y gracia", description: "La violencia humana provoca juicio; Noé halla gracia y recibe el encargo del arca.", verseCount: 22, updatedAt: "2026-09-14" },
  { key: "GEN-7", bookId: "GEN", bookSlug: "genesis", bookName: "Génesis", chapter: 7, title: "El diluvio", description: "Dios preserva a Noé y su casa mientras las aguas ejecutan el juicio anunciado.", verseCount: 24, updatedAt: "2026-09-14" },
  { key: "GEN-8", bookId: "GEN", bookSlug: "genesis", bookName: "Génesis", chapter: 8, title: "Dios recuerda a Noé", description: "Las aguas retroceden, la creación emerge de nuevo y Noé responde con adoración.", verseCount: 22, updatedAt: "2026-09-14" },
  { key: "GEN-9", bookId: "GEN", bookSlug: "genesis", bookName: "Génesis", chapter: 9, title: "El pacto con toda criatura", description: "Dios establece su pacto, reafirma la dignidad humana y coloca el arco como señal.", verseCount: 29, updatedAt: "2026-09-14" },
  { key: "GEN-10", bookId: "GEN", bookSlug: "genesis", bookName: "Génesis", chapter: 10, title: "La mesa de las naciones", description: "Los descendientes de Noé se extienden por pueblos, lenguas, territorios y familias.", verseCount: 32, updatedAt: "2026-09-14" },
];

export function getCatalogEntry(bookId: string, chapter: number) {
  return studyCatalog.find((entry) => entry.bookId === bookId && entry.chapter === chapter);
}

export function getCatalogEntryBySlug(bookSlug: string, chapter: number) {
  return studyCatalog.find((entry) => entry.bookSlug === bookSlug && entry.chapter === chapter);
}

export function validateStudyCatalog() {
  const keys = new Set<string>();
  for (const entry of studyCatalog) {
    if (keys.has(entry.key)) throw new Error(`Clave de catálogo duplicada: ${entry.key}`);
    keys.add(entry.key);
    if (entry.key !== `${entry.bookId}-${entry.chapter}`) {
      throw new Error(`Clave de catálogo inválida: ${entry.key}`);
    }
    if (!entry.title.trim() || !entry.description.trim() || entry.verseCount < 1) {
      throw new Error(`Metadatos incompletos: ${entry.key}`);
    }
  }
  return true;
}
