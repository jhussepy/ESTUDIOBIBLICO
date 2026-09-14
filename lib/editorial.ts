export type EditorialStatus = "draft" | "reviewing" | "published";

export type SourceCategory = "Texto y traducciones" | "Léxico" | "Comentario" | "Contexto";

export interface AcademicSource {
  id: string;
  category: SourceCategory;
  shortTitle: string;
  citation: string;
  use: string;
  url?: string;
}

export interface InterpretiveIssue {
  title: string;
  summary: string;
}

export interface ChapterEditorialRecord {
  studyKey: string;
  status: EditorialStatus;
  updatedAt: string;
  methodVersion: string;
  sourceIds: readonly string[];
  interpretiveIssues: readonly InterpretiveIssue[];
  reviewNote: string;
}

export const editorialStatusMeta: Record<EditorialStatus, { label: string; description: string }> = {
  draft: {
    label: "Borrador editorial",
    description: "Contenido en elaboración que todavía puede cambiar sustancialmente.",
  },
  reviewing: {
    label: "En revisión",
    description: "Estructura y fuentes verificadas técnicamente; revisión humana especializada pendiente.",
  },
  published: {
    label: "Publicado",
    description: "Contenido aprobado mediante revisión editorial humana y control de fuentes.",
  },
};

export const academicSources: readonly AcademicSource[] = [
  {
    id: "api-bible",
    category: "Texto y traducciones",
    shortTitle: "API.Bible",
    citation: "American Bible Society. API.Bible, plataforma de distribución autorizada de textos bíblicos.",
    use: "Consulta dinámica de las traducciones habilitadas por la licencia de la cuenta.",
    url: "https://scripture.api.bible/",
  },
  {
    id: "bhs",
    category: "Texto y traducciones",
    shortTitle: "Biblia Hebraica Stuttgartensia",
    citation: "Elliger, Karl y Wilhelm Rudolph, eds. Biblia Hebraica Stuttgartensia. Stuttgart: Deutsche Bibelgesellschaft, 1997.",
    use: "Texto hebreo masorético y observación de variantes textuales relevantes.",
    url: "https://www.die-bibel.de/en/",
  },
  {
    id: "bdb",
    category: "Léxico",
    shortTitle: "Brown–Driver–Briggs",
    citation: "Brown, Francis; S. R. Driver; y Charles A. Briggs. A Hebrew and English Lexicon of the Old Testament. Oxford: Clarendon Press, 1907.",
    use: "Campo semántico y uso veterotestamentario de términos hebreos.",
  },
  {
    id: "step-bible",
    category: "Léxico",
    shortTitle: "STEP Bible",
    citation: "Tyndale House, Cambridge. STEP Bible: Scripture Tools for Every Person.",
    use: "Comprobación digital de formas, raíces y ocurrencias en las lenguas bíblicas.",
    url: "https://www.stepbible.org/",
  },
  {
    id: "wenham-genesis",
    category: "Comentario",
    shortTitle: "Wenham, Genesis 1–15",
    citation: "Wenham, Gordon J. Genesis 1–15. Word Biblical Commentary 1. Waco: Word Books, 1987.",
    use: "Estructura literaria, exégesis del texto hebreo y discusión de interpretaciones.",
  },
  {
    id: "hamilton-genesis",
    category: "Comentario",
    shortTitle: "Hamilton, Genesis 1–17",
    citation: "Hamilton, Victor P. The Book of Genesis: Chapters 1–17. NICOT. Grand Rapids: Eerdmans, 1990.",
    use: "Análisis filológico, contexto del antiguo Cercano Oriente y síntesis teológica.",
  },
  {
    id: "mathews-genesis",
    category: "Comentario",
    shortTitle: "Mathews, Genesis 1–11:26",
    citation: "Mathews, Kenneth A. Genesis 1–11:26. New American Commentary 1A. Nashville: Broadman & Holman, 1996.",
    use: "Desarrollo canónico, contexto histórico y evaluación de posiciones exegéticas.",
  },
  {
    id: "walton-ane",
    category: "Contexto",
    shortTitle: "Walton, Ancient Near Eastern Thought",
    citation: "Walton, John H. Ancient Near Eastern Thought and the Old Testament. 2.ª ed. Grand Rapids: Baker Academic, 2018.",
    use: "Comparación responsable con ideas, géneros e instituciones del antiguo Cercano Oriente.",
  },
] as const;

const commonGenesisSources = [
  "api-bible",
  "bhs",
  "bdb",
  "step-bible",
  "wenham-genesis",
  "hamilton-genesis",
  "mathews-genesis",
  "walton-ane",
] as const;

const genesisIssues: Record<number, readonly InterpretiveIssue[]> = {
  1: [
    {
      title: "Duración y estructura de los días",
      summary: "Existen lecturas de días ordinarios, marcos literarios y aproximaciones analógicas. El estudio distingue la función del texto de los modelos científicos posteriores.",
    },
  ],
  2: [
    {
      title: "Relación entre Génesis 1 y 2",
      summary: "Se debate si el segundo relato sigue una secuencia cronológica o amplía temáticamente la creación humana. Se presenta como enfoque complementario sin ocultar la discusión.",
    },
  ],
  3: [
    {
      title: "La serpiente y la promesa de 3:15",
      summary: "El sentido inmediato del relato y su lectura canónica posterior se mantienen diferenciados al hablar del adversario y de la esperanza mesiánica.",
    },
  ],
  4: [
    {
      title: "La señal de Caín",
      summary: "El texto no describe físicamente la señal. Su función protectora es más clara que su forma, por lo que se evitan especulaciones raciales o legendarias.",
    },
  ],
  5: [
    {
      title: "Edades y función de la genealogía",
      summary: "Las propuestas literales, simbólicas y representativas se evalúan sin convertir la lista en un cálculo que el propio capítulo no exige.",
    },
  ],
  6: [
    {
      title: "Los «hijos de Dios»",
      summary: "Se reconocen las principales lecturas —seres celestiales, linaje de Set o gobernantes— y se ponderan desde el vocabulario y el contexto.",
    },
    {
      title: "Alcance del diluvio",
      summary: "Se distingue el lenguaje universal del relato de las preguntas geográficas modernas, exponiendo las posiciones cristianas sin presentar una inferencia como dato textual.",
    },
  ],
  7: [
    {
      title: "Universalidad narrativa y geografía",
      summary: "El juicio abarca el mundo descrito por el narrador. La extensión física precisa se identifica como cuestión interpretativa, no como prueba doctrinal central.",
    },
  ],
  8: [
    {
      title: "Cronología del descenso de las aguas",
      summary: "Las fechas se leen como una secuencia literaria coherente; las reconstrucciones detalladas permanecen subordinadas a los datos explícitos.",
    },
  ],
  9: [
    {
      title: "La llamada «maldición de Cam»",
      summary: "Génesis 9:25 nombra a Canaán, no a Cam. El pasaje no enseña jerarquías raciales ni legitima la esclavitud.",
    },
  ],
  10: [
    {
      title: "Identificación de pueblos antiguos",
      summary: "Las asociaciones geográficas se presentan con distintos grados de certeza y no se trasladan automáticamente a Estados o etnias modernas.",
    },
  ],
};

export const chapterEditorialRecords: readonly ChapterEditorialRecord[] = Array.from(
  { length: 10 },
  (_, index) => {
    const chapter = index + 1;
    return {
      studyKey: `GEN-${chapter}`,
      status: "reviewing" as const,
      updatedAt: "2026-09-14",
      methodVersion: "1.0",
      sourceIds: commonGenesisSources,
      interpretiveIssues: genesisIssues[chapter] ?? [],
      reviewNote: "Revisión técnica de estructura, navegación y consistencia completada. La aprobación teológica humana especializada continúa pendiente.",
    };
  },
);

const sourceIndex = new Map(academicSources.map((source) => [source.id, source]));
const editorialIndex = new Map(chapterEditorialRecords.map((record) => [record.studyKey, record]));

export function getEditorialRecord(studyKey: string) {
  return editorialIndex.get(studyKey);
}

export function getSourcesForStudy(studyKey: string) {
  const record = getEditorialRecord(studyKey);
  if (!record) return [];
  return record.sourceIds.flatMap((sourceId) => {
    const source = sourceIndex.get(sourceId);
    return source ? [source] : [];
  });
}

export function validateEditorialRecords(availableStudyKeys: readonly string[]) {
  const available = new Set(availableStudyKeys);
  const seen = new Set<string>();

  for (const record of chapterEditorialRecords) {
    if (!available.has(record.studyKey)) throw new Error(`Registro editorial sin estudio: ${record.studyKey}`);
    if (seen.has(record.studyKey)) throw new Error(`Registro editorial duplicado: ${record.studyKey}`);
    seen.add(record.studyKey);

    for (const sourceId of record.sourceIds) {
      if (!sourceIndex.has(sourceId)) throw new Error(`Fuente desconocida ${sourceId} en ${record.studyKey}`);
    }
  }

  for (const studyKey of availableStudyKeys) {
    if (!seen.has(studyKey)) throw new Error(`Estudio sin registro editorial: ${studyKey}`);
  }
}
