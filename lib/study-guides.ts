export interface StudyOutlineItem {
  range: string;
  title: string;
  focus: string;
}

export interface KeyTerm {
  original: string;
  transliteration: string;
  meaning: string;
}

export interface ChapterStudyGuide {
  studyKey: string;
  genre: string;
  thesis: string;
  literaryContext: string;
  outline: StudyOutlineItem[];
  keyTerms: KeyTerm[];
  applications: string[];
  reflectionQuestions: string[];
  interpretiveGuardrail: string;
}

export const studyGuides: ChapterStudyGuide[] = [
  {
    studyKey: "GEN-1",
    genre: "Narrativa teológica de los orígenes",
    thesis: "El único Dios crea por su palabra un cosmos bueno, ordenado y habitable, y encarga a la humanidad representarlo responsablemente.",
    literaryContext: "Abre el Pentateuco y funciona como pórtico de toda la historia bíblica. La secuencia de formar y llenar responde al estado inicial de Génesis 1:2 y culmina en la humanidad como imagen de Dios.",
    outline: [
      { range: "1:1–2", title: "El Creador y el mundo no ordenado", focus: "Dios precede y gobierna todo lo creado." },
      { range: "1:3–25", title: "Dios forma y llena", focus: "Su palabra establece ámbitos y sus habitantes." },
      { range: "1:26–31", title: "Imagen, vocación y bendición", focus: "Varón y mujer representan a Dios dentro de la creación." },
    ],
    keyTerms: [
      { original: "בָּרָא", transliteration: "bara", meaning: "Crear; en este capítulo Dios es su sujeto." },
      { original: "צֶלֶם", transliteration: "tselem", meaning: "Imagen o representación; expresa dignidad y misión." },
      { original: "טוֹב", transliteration: "tov", meaning: "Bueno, adecuado al propósito del Creador." },
    ],
    applications: ["Recibir la creación como don y responsabilidad.", "Reconocer igual dignidad en toda persona.", "Ordenar el trabajo bajo la palabra y el propósito de Dios."],
    reflectionQuestions: ["¿Qué revela el capítulo acerca de quién gobierna la realidad?", "¿Cómo transforma la imagen de Dios mi trato hacia otras personas?", "¿Qué parte de mi vocación necesita recuperar orden y propósito?"],
    interpretiveGuardrail: "El texto debe leerse primero según su propósito teológico y literario. Las posturas cristianas sobre la duración de los días deben exponerse con respeto, sin convertir una reconstrucción científica moderna en el centro del capítulo.",
  },
  {
    studyKey: "GEN-2",
    genre: "Narrativa teológica de los orígenes",
    thesis: "Dios establece descanso, presencia, trabajo obediente y comunión como dimensiones de la vida humana buena.",
    literaryContext: "Génesis 2:4–25 enfoca de cerca la humanidad anunciada en 1:26–31. No compite con el primer relato: desarrolla el jardín, el mandato y la relación entre el hombre y la mujer.",
    outline: [
      { range: "2:1–3", title: "El séptimo día", focus: "Dios cesa, bendice y santifica el tiempo." },
      { range: "2:4–17", title: "El humano en el jardín", focus: "Trabajo, abundancia, límite moral y dependencia." },
      { range: "2:18–25", title: "La mujer y la alianza", focus: "Correspondencia, unidad y ausencia de vergüenza." },
    ],
    keyTerms: [
      { original: "שָׁבַת", transliteration: "shavat", meaning: "Cesar o descansar; raíz relacionada con sábado." },
      { original: "עָבַד", transliteration: "avad", meaning: "Trabajar, servir o cultivar." },
      { original: "עֵזֶר כְּנֶגְדּוֹ", transliteration: "ezer kenegdo", meaning: "Ayuda correspondiente, fuerte y adecuada frente a él." },
    ],
    applications: ["Practicar ritmos de trabajo y descanso.", "Entender el trabajo como servicio encargado por Dios.", "Cultivar relaciones de pacto, reciprocidad y verdad."],
    reflectionQuestions: ["¿Qué revela mi ritmo semanal sobre mi confianza en Dios?", "¿Dónde necesito obedecer un límite bueno?", "¿Cómo puedo tratar a otros como aliados y no como instrumentos?"],
    interpretiveGuardrail: "«Ayuda» no significa inferioridad: el mismo término describe repetidamente la ayuda de Dios. La relación entre Génesis 1 y 2 debe explicarse atendiendo al cambio de enfoque narrativo.",
  },
  {
    studyKey: "GEN-3",
    genre: "Narrativa teológica de caída y promesa",
    thesis: "La desconfianza hacia la palabra de Dios produce vergüenza, ruptura y muerte, pero Dios busca, juzga y anuncia esperanza.",
    literaryContext: "La armonía de Génesis 1–2 se quiebra. Los temas de exilio, descendencia, dolor y conflicto introducidos aquí recorren el resto de Génesis y la historia de la redención.",
    outline: [
      { range: "3:1–7", title: "Tentación y transgresión", focus: "La palabra divina es distorsionada y desobedecida." },
      { range: "3:8–19", title: "Búsqueda, interrogatorio y sentencia", focus: "Dios expone responsabilidades y consecuencias." },
      { range: "3:20–24", title: "Vestidura y expulsión", focus: "Misericordia en medio del exilio y pérdida de acceso." },
    ],
    keyTerms: [
      { original: "נָחָשׁ", transliteration: "najash", meaning: "Serpiente; agente astuto de la tentación." },
      { original: "עָרוּם", transliteration: "arum", meaning: "Astuto; juego sonoro con la desnudez de 2:25." },
      { original: "זֶרַע", transliteration: "zera", meaning: "Descendencia o simiente; eje de conflicto y promesa." },
    ],
    applications: ["Examinar cómo deformamos la palabra de Dios.", "Confesar responsabilidad sin trasladar la culpa.", "Esperar en la gracia que actúa aun dentro de las consecuencias."],
    reflectionQuestions: ["¿Qué mentira sobre Dios hace atractiva mi desobediencia?", "¿Dónde estoy escondiéndome o culpando a otro?", "¿Cómo sostiene la esperanza la promesa de la descendencia?"],
    interpretiveGuardrail: "La lectura cristiana relaciona 3:15 con la victoria final de Cristo, pero debe distinguir el sentido inmediato del conflicto entre descendencias de su desarrollo canónico posterior.",
  },
  {
    studyKey: "GEN-4",
    genre: "Narrativa teológica y genealogía",
    thesis: "El pecado invade la fraternidad y la cultura humana, mientras Dios confronta la violencia y preserva la invocación de su nombre.",
    literaryContext: "El conflicto anunciado en 3:15 aparece dentro de la primera familia. La línea de Caín culmina en la jactancia violenta de Lamec y contrasta con Set y la invocación del Señor.",
    outline: [
      { range: "4:1–16", title: "Caín y Abel", focus: "Adoración, ira, asesinato, juicio y protección." },
      { range: "4:17–24", title: "La ciudad de Caín", focus: "Desarrollo cultural junto con escalada de violencia." },
      { range: "4:25–26", title: "Set y Enós", focus: "Dios preserva una línea que invoca su nombre." },
    ],
    keyTerms: [
      { original: "מִנְחָה", transliteration: "minjah", meaning: "Ofrenda o tributo presentado a una autoridad." },
      { original: "שֹׁמֵר", transliteration: "shomer", meaning: "Guardián; trasfondo de la pregunta por el hermano." },
      { original: "חַטָּאת", transliteration: "jattat", meaning: "Pecado, descrito como amenaza agazapada." },
    ],
    applications: ["Atender la ira antes de que gobierne las acciones.", "Asumir responsabilidad por el bienestar del prójimo.", "Evaluar el progreso cultural también por su fruto moral."],
    reflectionQuestions: ["¿Qué advertencia de Dios estoy dejando de escuchar?", "¿De quién debo actuar como guardián?", "¿Cómo puede la adoración resistir una cultura de venganza?"],
    interpretiveGuardrail: "El texto no explica la naturaleza física de la señal de Caín. No debe usarse para especulaciones raciales ni para identificar poblaciones posteriores.",
  },
  {
    studyKey: "GEN-5",
    genre: "Genealogía teológica",
    thesis: "La muerte confirma la gravedad del pecado, pero la bendición, la imagen y la esperanza continúan de Adán a Noé.",
    literaryContext: "Retoma la creación de la humanidad a imagen de Dios y contrasta con la genealogía de Caín. La repetición «y murió» domina, interrumpida por Enoc y por la esperanza asociada con Noé.",
    outline: [
      { range: "5:1–5", title: "Adán e imagen transmitida", focus: "La historia humana continúa bajo bendición y mortalidad." },
      { range: "5:6–27", title: "Generaciones y muerte", focus: "La fórmula repetida muestra continuidad y juicio." },
      { range: "5:28–32", title: "Noé y la esperanza de consuelo", focus: "La línea avanza hacia el relato del diluvio." },
    ],
    keyTerms: [
      { original: "תּוֹלְדֹת", transliteration: "toledot", meaning: "Generaciones o historia resultante; marcador estructural de Génesis." },
      { original: "דְּמוּת", transliteration: "demut", meaning: "Semejanza; conecta creación, descendencia y dignidad." },
      { original: "הִתְהַלֵּךְ", transliteration: "hithalek", meaning: "Caminar de manera continua; describe la comunión de Enoc con Dios." },
    ],
    applications: ["Ubicar la vida personal dentro de una historia recibida y transmitida.", "Caminar fielmente aun bajo la realidad de la muerte.", "Entregar a la siguiente generación una esperanza centrada en Dios."],
    reflectionQuestions: ["¿Qué legado espiritual estoy transmitiendo?", "¿Qué significa caminar con Dios en mi rutina?", "¿Cómo confronta esta genealogía mi ilusión de autosuficiencia?"],
    interpretiveGuardrail: "Las edades extraordinarias admiten distintas explicaciones. La interpretación debe reconocer su función literaria y teológica sin afirmar como certeza un mecanismo que el texto no ofrece.",
  },
  {
    studyKey: "GEN-6",
    genre: "Narrativa de juicio y preservación",
    thesis: "Ante una humanidad llena de violencia, Dios responde con juicio santo y gracia soberana, y establece con Noé un medio de preservación.",
    literaryContext: "La expansión del pecado de Génesis 3–4 alcanza una crisis universal. Noé contrasta con su generación y el arca prepara una nueva etapa de la creación.",
    outline: [
      { range: "6:1–8", title: "Crisis humana y dolor divino", focus: "Corrupción extensa, límite y gracia para Noé." },
      { range: "6:9–12", title: "Noé y su generación", focus: "Integridad relativa frente a una tierra corrompida." },
      { range: "6:13–22", title: "El arca y el pacto anunciado", focus: "Juicio revelado, instrucciones y obediencia." },
    ],
    keyTerms: [
      { original: "חָמָס", transliteration: "jamas", meaning: "Violencia, injusticia o daño social." },
      { original: "חֵן", transliteration: "jen", meaning: "Favor o gracia recibida por Noé." },
      { original: "תֵּבָה", transliteration: "tevah", meaning: "Arca o caja; término usado también para la cesta de Moisés." },
    ],
    applications: ["Nombrar la violencia como corrupción ante Dios.", "Obedecer con perseverancia antes de ver el resultado.", "Recibir la salvación como gracia que produce fidelidad."],
    reflectionQuestions: ["¿Dónde normaliza mi entorno aquello que entristece a Dios?", "¿Qué obediencia concreta exige paciencia?", "¿Cómo se relacionan gracia e integridad en la vida de Noé?"],
    interpretiveGuardrail: "Las identidades de «hijos de Dios» y nefilim poseen varias lecturas históricas. Ninguna debe desplazar el énfasis narrativo: la corrupción y violencia generalizadas.",
  },
  {
    studyKey: "GEN-7",
    genre: "Narrativa de juicio y nueva creación",
    thesis: "Dios cumple su advertencia, preserva dentro del arca a quienes llamó y deshace temporalmente el orden habitable de la creación.",
    literaryContext: "El capítulo ejecuta las instrucciones de Génesis 6. Sus repeticiones y fechas enfatizan obediencia, totalidad del juicio y control divino.",
    outline: [
      { range: "7:1–10", title: "Entrada en el arca", focus: "Noé responde a la palabra divina con su casa y los animales." },
      { range: "7:11–16", title: "Comienzan las aguas", focus: "Se abren fuentes y compuertas; Dios cierra la puerta." },
      { range: "7:17–24", title: "Las aguas prevalecen", focus: "El mundo habitable queda cubierto mientras el arca es sostenida." },
    ],
    keyTerms: [
      { original: "מַבּוּל", transliteration: "mabbul", meaning: "Diluvio; término técnico del relato de Noé." },
      { original: "גָּבַר", transliteration: "gavar", meaning: "Prevalecer o hacerse poderoso; se repite para las aguas." },
      { original: "סָגַר", transliteration: "sagar", meaning: "Cerrar; el Señor asegura la entrada del arca." },
    ],
    applications: ["Tomar seriamente la palabra de juicio y salvación.", "Comprender que la obediencia puede ser comunitaria y protectora.", "Descansar en el cuidado de Dios en medio de fuerzas incontrolables."],
    reflectionQuestions: ["¿Qué diferencia hay entre temor responsable y alarmismo?", "¿Qué revela la puerta cerrada por Dios acerca de protección?", "¿Cómo debo responder hoy a una advertencia clara de la Escritura?"],
    interpretiveGuardrail: "El alcance geográfico del diluvio se debate entre lectores fieles. Debe presentarse cada postura con sus argumentos textuales, evitando que la discusión eclipse juicio, preservación y nueva creación.",
  },
  {
    studyKey: "GEN-8",
    genre: "Narrativa de restauración y adoración",
    thesis: "Dios recuerda a Noé, hace retroceder las aguas, restaura la tierra habitable y recibe la adoración que responde a su salvación.",
    literaryContext: "Es el punto de giro del relato del diluvio. La secuencia invierte el desorden de Génesis 7 y repite motivos de creación: viento, separación de aguas, tierra seca, animales y bendición.",
    outline: [
      { range: "8:1–5", title: "Dios recuerda y las aguas decrecen", focus: "La fidelidad divina inicia la restauración." },
      { range: "8:6–19", title: "Espera, señales y salida", focus: "Noé discierne con paciencia y sale por mandato." },
      { range: "8:20–22", title: "Altar y promesa", focus: "La adoración responde a la preservación; Dios promete estabilidad." },
    ],
    keyTerms: [
      { original: "זָכַר", transliteration: "zakar", meaning: "Recordar actuando fielmente, no recuperar información olvidada." },
      { original: "רוּחַ", transliteration: "ruaj", meaning: "Viento o espíritu; aquí el viento participa en retirar las aguas." },
      { original: "רֵיחַ הַנִּיחֹחַ", transliteration: "reaj hannijoaj", meaning: "Aroma grato; lenguaje de aceptación sacrificial." },
    ],
    applications: ["Esperar el tiempo de Dios sin confundir señales con autorización.", "Responder a la liberación con adoración.", "Confiar en la fidelidad activa de Dios cuando parece haber silencio."],
    reflectionQuestions: ["¿Dónde necesito esperar una palabra clara antes de avanzar?", "¿Qué acto de adoración expresa gratitud concreta?", "¿Cómo cambia mi ansiedad saber que Dios «recuerda» su pacto?"],
    interpretiveGuardrail: "Decir que Dios recuerda es lenguaje de acción pactual, no evidencia de olvido. El sacrificio no manipula a Dios: responde a la gracia ya recibida.",
  },
  {
    studyKey: "GEN-9",
    genre: "Narrativa pactual y oráculo familiar",
    thesis: "Dios reafirma la vida humana, pacta con toda criatura y muestra que la gracia de un nuevo comienzo no elimina automáticamente el pecado.",
    literaryContext: "Después del diluvio, Dios renueva mandatos de creación y garantiza estabilidad mediante un pacto universal. La caída de Noé anticipa que la solución definitiva aún no ha llegado.",
    outline: [
      { range: "9:1–7", title: "Bendición y santidad de la vida", focus: "Fructificación, alimento, sangre e imagen de Dios." },
      { range: "9:8–17", title: "Pacto y señal del arco", focus: "Dios se compromete con Noé, descendencia y toda criatura." },
      { range: "9:18–29", title: "Noé y sus hijos", focus: "Vergüenza familiar, respuestas morales y palabras sobre Canaán." },
    ],
    keyTerms: [
      { original: "בְּרִית", transliteration: "berit", meaning: "Pacto; compromiso soberanamente establecido." },
      { original: "קֶשֶׁת", transliteration: "qeshet", meaning: "Arco; señal visible del pacto en las nubes." },
      { original: "צֶלֶם אֱלֹהִים", transliteration: "tselem Elohim", meaning: "Imagen de Dios; fundamento de la dignidad de toda vida humana." },
    ],
    applications: ["Defender la dignidad de cada persona.", "Recordar la fidelidad de Dios mediante señales que él mismo provee.", "Vigilar el pecado incluso después de experiencias profundas de gracia."],
    reflectionQuestions: ["¿Qué exige de mí que cada ser humano porte la imagen de Dios?", "¿Qué promesa divina necesito recordar?", "¿Cómo puedo responder con honra ante la vulnerabilidad ajena?"],
    interpretiveGuardrail: "La maldición recae sobre Canaán, no sobre Cam, y el texto jamás justifica esclavitud racial. Las lecturas racistas son una distorsión histórica que debe rechazarse explícitamente.",
  },
  {
    studyKey: "GEN-10",
    genre: "Genealogía etnográfica teológica",
    thesis: "Todas las naciones proceden de una familia preservada por Dios y se desarrollan bajo su soberanía antes del episodio de Babel.",
    literaryContext: "La mesa de las naciones enlaza el pacto con Noé y Babel. Organiza pueblos conocidos por parentesco, territorio, lengua y nación, preparando la dispersión y la posterior elección de Abraham.",
    outline: [
      { range: "10:1–5", title: "Descendientes de Jafet", focus: "Pueblos costeros y expansión territorial." },
      { range: "10:6–20", title: "Descendientes de Cam", focus: "Reinos, ciudades y pueblos vinculados al sur y oriente." },
      { range: "10:21–32", title: "Descendientes de Sem", focus: "La línea que conducirá hacia Abraham dentro del mundo de naciones." },
    ],
    keyTerms: [
      { original: "גּוֹיִם", transliteration: "goyim", meaning: "Naciones o pueblos." },
      { original: "מִשְׁפָּחָה", transliteration: "mishpajah", meaning: "Familia o clan como unidad de pertenencia." },
      { original: "אֶרֶץ", transliteration: "erets", meaning: "Tierra, territorio o país según el contexto." },
    ],
    applications: ["Reconocer la unidad de la familia humana.", "Valorar culturas y pueblos sin absolutizarlos.", "Leer la elección de Abraham como misión de bendición para las naciones."],
    reflectionQuestions: ["¿Cómo corrige este capítulo el orgullo étnico?", "¿Qué diferencia hay entre diversidad y división?", "¿Cómo prepara la lista de pueblos la promesa de Génesis 12:3?"],
    interpretiveGuardrail: "No deben identificarse automáticamente estos nombres antiguos con estados o etnias modernas. Las propuestas geográficas requieren grados de certeza y evidencia histórica explícitos.",
  },
];

export function getStudyGuide(studyKey: string) {
  return studyGuides.find((guide) => guide.studyKey === studyKey);
}

export function validateStudyGuides(expectedStudyKeys: readonly string[]) {
  const expected = new Set(expectedStudyKeys);
  const found = new Set<string>();

  for (const guide of studyGuides) {
    if (found.has(guide.studyKey)) throw new Error(`Guía duplicada: ${guide.studyKey}`);
    found.add(guide.studyKey);
    if (!expected.has(guide.studyKey)) throw new Error(`Guía sin estudio publicado: ${guide.studyKey}`);
    if (guide.outline.length < 3 || guide.keyTerms.length < 3) {
      throw new Error(`Guía incompleta: ${guide.studyKey}`);
    }
    if (guide.applications.length < 3 || guide.reflectionQuestions.length < 3) {
      throw new Error(`Aplicación incompleta: ${guide.studyKey}`);
    }
  }

  for (const key of expected) {
    if (!found.has(key)) throw new Error(`Falta guía para: ${key}`);
  }
  return true;
}
