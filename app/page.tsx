"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  BookOpenText,
  Check,
  ChevronLeft,
  ChevronRight,
  Languages,
  LibraryBig,
  Milestone,
  ScrollText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BibleReader } from "@/components/bible-reader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

declare global {
  interface Document {
    readonly modelContext?: {
      registerTool: (
        tool: {
          name: string;
          title?: string;
          description: string;
          inputSchema: object;
          annotations?: {
            readOnlyHint?: boolean;
            untrustedContentHint?: boolean;
          };
          execute: (input: unknown) => unknown | Promise<unknown>;
        },
        options?: { signal?: AbortSignal },
      ) => void | Promise<void>;
    };
  }
}

const canon = [
  {
    section: "Pentateuco",
    books: [["Génesis", 50], ["Éxodo", 40], ["Levítico", 27], ["Números", 36], ["Deuteronomio", 34]],
  },
  {
    section: "Libros históricos",
    books: [["Josué", 24], ["Jueces", 21], ["Rut", 4], ["1 Samuel", 31], ["2 Samuel", 24], ["1 Reyes", 22], ["2 Reyes", 25], ["1 Crónicas", 29], ["2 Crónicas", 36], ["Esdras", 10], ["Nehemías", 13], ["Ester", 10]],
  },
  {
    section: "Poesía y sabiduría",
    books: [["Job", 42], ["Salmos", 150], ["Proverbios", 31], ["Eclesiastés", 12], ["Cantares", 8]],
  },
  {
    section: "Profetas mayores",
    books: [["Isaías", 66], ["Jeremías", 52], ["Lamentaciones", 5], ["Ezequiel", 48], ["Daniel", 12]],
  },
  {
    section: "Profetas menores",
    books: [["Oseas", 14], ["Joel", 3], ["Amós", 9], ["Abdías", 1], ["Jonás", 4], ["Miqueas", 7], ["Nahúm", 3], ["Habacuc", 3], ["Sofonías", 3], ["Hageo", 2], ["Zacarías", 14], ["Malaquías", 4]],
  },
  {
    section: "Evangelios",
    books: [["Mateo", 28], ["Marcos", 16], ["Lucas", 24], ["Juan", 21]],
  },
  { section: "Historia apostólica", books: [["Hechos", 28]] },
  {
    section: "Cartas de Pablo",
    books: [["Romanos", 16], ["1 Corintios", 16], ["2 Corintios", 13], ["Gálatas", 6], ["Efesios", 6], ["Filipenses", 4], ["Colosenses", 4], ["1 Tesalonicenses", 5], ["2 Tesalonicenses", 3], ["1 Timoteo", 6], ["2 Timoteo", 4], ["Tito", 3], ["Filemón", 1]],
  },
  {
    section: "Cartas generales",
    books: [["Hebreos", 13], ["Santiago", 5], ["1 Pedro", 5], ["2 Pedro", 3], ["1 Juan", 5], ["2 Juan", 1], ["3 Juan", 1], ["Judas", 1]],
  },
  { section: "Profecía", books: [["Apocalipsis", 22]] },
] as const;

const apiBookIds: Record<string, string> = {
  "Génesis": "GEN", "Éxodo": "EXO", "Levítico": "LEV", "Números": "NUM", "Deuteronomio": "DEU",
  "Josué": "JOS", "Jueces": "JDG", "Rut": "RUT", "1 Samuel": "1SA", "2 Samuel": "2SA",
  "1 Reyes": "1KI", "2 Reyes": "2KI", "1 Crónicas": "1CH", "2 Crónicas": "2CH", "Esdras": "EZR",
  "Nehemías": "NEH", "Ester": "EST", "Job": "JOB", "Salmos": "PSA", "Proverbios": "PRO",
  "Eclesiastés": "ECC", "Cantares": "SNG", "Isaías": "ISA", "Jeremías": "JER", "Lamentaciones": "LAM",
  "Ezequiel": "EZK", "Daniel": "DAN", "Oseas": "HOS", "Joel": "JOL", "Amós": "AMO",
  "Abdías": "OBA", "Jonás": "JON", "Miqueas": "MIC", "Nahúm": "NAM", "Habacuc": "HAB",
  "Sofonías": "ZEP", "Hageo": "HAG", "Zacarías": "ZEC", "Malaquías": "MAL", "Mateo": "MAT",
  "Marcos": "MRK", "Lucas": "LUK", "Juan": "JHN", "Hechos": "ACT", "Romanos": "ROM",
  "1 Corintios": "1CO", "2 Corintios": "2CO", "Gálatas": "GAL", "Efesios": "EPH", "Filipenses": "PHP",
  "Colosenses": "COL", "1 Tesalonicenses": "1TH", "2 Tesalonicenses": "2TH", "1 Timoteo": "1TI", "2 Timoteo": "2TI",
  "Tito": "TIT", "Filemón": "PHM", "Hebreos": "HEB", "Santiago": "JAS", "1 Pedro": "1PE",
  "2 Pedro": "2PE", "1 Juan": "1JN", "2 Juan": "2JN", "3 Juan": "3JN", "Judas": "JUD",
  "Apocalipsis": "REV",
};

const verses = [
  {
    number: 1,
    title: "El Creador y el comienzo",
    summary: "Dios inaugura la historia bíblica como sujeto soberano de toda la creación.",
    hebrew: "בְּרֵאשִׁית בָּרָא אֱלֹהִים",
    transliteration: "Bereshit bara Elohim",
    rvr: "“En el principio creó Dios los cielos y la tierra.”",
    ntv: "“En el principio, Dios creó los cielos y la tierra.”",
    lbla: "“En el principio creó Dios los cielos y la tierra.”",
    exact: true,
    exegesis: "La Biblia comienza con Dios, no intentando demostrar su existencia, sino presentándolo como el agente que inicia todo cuanto existe. «Los cielos y la tierra» funciona como una expresión totalizadora: comprende la realidad creada en su conjunto.",
    language: "Bereshit significa «en el principio». Bara describe aquí la acción creadora de Dios. Elohim tiene forma plural, pero el verbo está en singular; esta concordancia afirma un solo agente divino y, por sí sola, no constituye una demostración completa de la Trinidad.",
  },
  {
    number: 2,
    title: "La tierra sin ordenar",
    summary: "La escena inicial aparece deshabitada y sin ordenar, mientras el Espíritu de Dios se mueve sobre las aguas.",
    hebrew: "תֹהוּ וָבֹהוּ",
    transliteration: "Tohu va-vohu",
    rvr: "La tierra aparece desordenada y vacía; el Espíritu de Dios se mueve sobre las aguas.",
    ntv: "La creación todavía no tiene su forma habitable; el Espíritu de Dios está presente y activo.",
    lbla: "El relato presenta oscuridad, profundidad y una tierra aún sin forma ni población.",
    exact: false,
    exegesis: "El versículo no describe necesariamente una creación malvada ni una catástrofe previa. Presenta un mundo todavía no organizado para la vida. Los días siguientes mostrarán a Dios formando y llenando aquello que aquí aparece sin forma y vacío.",
    language: "Tohu va-vohu comunica desolación, falta de orden y ausencia de habitantes. Ruaj Elohim puede relacionarse con «Espíritu de Dios» y, según el contexto léxico, con «viento de Dios»; la imagen subraya la presencia divina sobre las aguas.",
  },
  {
    number: 3,
    title: "La palabra que crea",
    summary: "Dios ordena que exista la luz, y la realidad responde eficazmente a su palabra.",
    hebrew: "יְהִי אוֹר",
    transliteration: "Yehi or",
    rvr: "Dios pronuncia su mandato creador y aparece la luz.",
    ntv: "La palabra divina produce inmediatamente aquello que Dios dispone.",
    lbla: "La luz comienza a existir por la orden eficaz del Creador.",
    exact: false,
    exegesis: "El repetido «dijo Dios» establece uno de los ritmos fundamentales del capítulo. La creación no nace de una lucha entre divinidades: responde a la autoridad de la palabra del único Dios.",
    language: "La fórmula yehi or es breve y enfática: «sea luz». La correspondencia entre la orden y su cumplimiento comunica eficacia absoluta, no un deseo incierto.",
  },
  {
    number: 4,
    title: "Bondad y distinción",
    summary: "Dios reconoce la bondad de la luz y establece una distinción entre luz y oscuridad.",
    hebrew: "כִּי־טוֹב",
    transliteration: "Ki tov",
    rvr: "Dios declara buena la luz y la distingue de la oscuridad.",
    ntv: "El Creador evalúa su obra como buena y establece orden mediante separación.",
    lbla: "La valoración divina y la separación muestran propósito dentro de la creación.",
    exact: false,
    exegesis: "La bondad no es definida por una fuerza externa a Dios: el Creador evalúa su obra conforme a su propósito. Separar no implica que la oscuridad sea una divinidad rival, sino que Dios establece límites y funciones.",
    language: "Tov puede expresar bondad, adecuación o aquello que cumple correctamente su finalidad. La frase ki tov actúa como evaluación divina de la obra realizada.",
  },
  {
    number: 5,
    title: "El primer día",
    summary: "Dios nombra el día y la noche; tarde y mañana delimitan el primer ciclo del relato.",
    hebrew: "יוֹם אֶחָד",
    transliteration: "Yom ejad",
    rvr: "Dios nombra Día y Noche; la fórmula de tarde y mañana cierra el primer día.",
    ntv: "El primer ciclo queda definido por la alternancia de tarde y mañana.",
    lbla: "Nombrar manifiesta autoridad, y la fórmula temporal concluye la primera jornada.",
    exact: false,
    exegesis: "En el mundo antiguo, nombrar expresa autoridad. El cierre «tarde y mañana» organiza el relato en jornadas. La naturaleza precisa de estos días ha generado varias interpretaciones cristianas, pero todas deben comenzar por la función literaria de la secuencia en el texto.",
    language: "Yom puede referirse a un día ordinario o, en otros contextos, a un período. Aquí aparece acompañado por una fórmula numérica y temporal; su interpretación debe considerar tanto la gramática como la estructura completa de Génesis 1.",
  },
  {
    number: 6,
    title: "La expansión entre las aguas",
    summary: "Dios establece un espacio ordenado que distingue las aguas superiores de las inferiores.",
    hebrew: "יְהִי רָקִיעַ",
    transliteration: "Yehi raqia",
    rvr: "Dios ordena que exista una expansión en medio de las aguas.",
    ntv: "Dios dispone un espacio que separe unas aguas de otras.",
    lbla: "El Creador establece una bóveda para organizar las aguas.",
    exact: false,
    exegesis: "El segundo día continúa el movimiento desde lo no ordenado hacia un mundo habitable. La expansión no aparece como una divinidad celeste, sino como una parte de la creación que obedece al mandato de Dios.",
    language: "Raqia procede de una raíz asociada con extender o desplegar. Describe el espacio visible del cielo según la perspectiva del observador antiguo, sin convertir el pasaje en un tratado científico moderno.",
  },
  {
    number: 7,
    title: "Dios ejecuta su mandato",
    summary: "El mandato se convierte en obra: Dios hace la expansión y separa las aguas.",
    hebrew: "וַיַּבְדֵּל בֵּין הַמַּיִם",
    transliteration: "Vayavdel bein hamayim",
    rvr: "Dios realiza la separación entre las aguas de abajo y las de arriba.",
    ntv: "El Creador organiza las aguas conforme a la distinción ordenada.",
    lbla: "La obra divina cumple exactamente la palabra pronunciada.",
    exact: false,
    exegesis: "La repetición entre mandato y cumplimiento subraya que la voluntad divina no queda en intención. El relato atribuye directamente a Dios la formación del ámbito donde después aparecerán las criaturas voladoras.",
    language: "Badal significa separar o distinguir. En Génesis 1 la separación no destruye: establece límites que permiten identidad, función y vida.",
  },
  {
    number: 8,
    title: "El cielo recibe nombre",
    summary: "Dios llama cielos a la expansión y concluye el segundo día.",
    hebrew: "וַיִּקְרָא אֱלֹהִים לָרָקִיעַ שָׁמָיִם",
    transliteration: "Vayiqra Elohim laraqia shamayim",
    rvr: "Dios da a la expansión el nombre de cielos.",
    ntv: "El espacio creado recibe su identidad y función bajo la autoridad divina.",
    lbla: "La denominación del cielo confirma el señorío del Creador.",
    exact: false,
    exegesis: "Nombrar expresa autoridad soberana. El cielo que otras culturas podían divinizar queda aquí desmitificado: tiene nombre porque Dios se lo concede y ocupa el lugar que Dios determina.",
    language: "Shamayim es la palabra hebrea habitual para cielos o cielo. Su forma no exige por sí misma múltiples universos; el contexto determina si alude al firmamento visible o a los cielos en sentido amplio.",
  },
  {
    number: 9,
    title: "Aparece la tierra seca",
    summary: "Las aguas se reúnen en un lugar y queda visible el suelo habitable.",
    hebrew: "יִקָּווּ הַמַּיִם",
    transliteration: "Yiqqawu hamayim",
    rvr: "Dios reúne las aguas para que aparezca lo seco.",
    ntv: "El mar recibe límites y emerge la tierra donde habrá vida.",
    lbla: "La palabra divina delimita las aguas y descubre la tierra firme.",
    exact: false,
    exegesis: "El tercer día completa el ámbito terrestre. En vez de combatir un océano divino, Dios simplemente ordena las aguas. La aparición de lo seco prepara el escenario para la vegetación y, más adelante, para animales y seres humanos.",
    language: "El verbo qavah, aquí en forma pasiva-reflexiva, comunica reunión o concentración. La escena enfatiza delimitación, no aniquilación del mar.",
  },
  {
    number: 10,
    title: "Tierra y mares",
    summary: "Dios nombra los nuevos ámbitos y evalúa como buena su organización.",
    hebrew: "אֶרֶץ וּלְמִקְוֵה הַמַּיִם יַמִּים",
    transliteration: "Eretz ulemiqveh hamayim yamim",
    rvr: "Lo seco es llamado tierra y las aguas reunidas, mares.",
    ntv: "Dios asigna identidad a la tierra y al mar y declara buena su obra.",
    lbla: "La creación ordenada recibe nombre y aprobación divina.",
    exact: false,
    exegesis: "La valoración «bueno» indica que estos ámbitos cumplen el propósito asignado. El mar conserva fuerza y misterio en la Biblia, pero nunca aparece fuera del gobierno de Dios.",
    language: "Eretz puede significar tierra, territorio o suelo según el contexto. Yamim es el plural de yam, mar; ambos términos describen realidades creadas y subordinadas.",
  },
  {
    number: 11,
    title: "La tierra produce vegetación",
    summary: "Dios ordena que la tierra haga brotar plantas con semilla y árboles con fruto.",
    hebrew: "תַּדְשֵׁא הָאָרֶץ דֶּשֶׁא",
    transliteration: "Tadshe haaretz deshe",
    rvr: "La tierra recibe el mandato de producir hierba, semilla y fruto.",
    ntv: "Dios dota a la vegetación de continuidad y capacidad reproductiva.",
    lbla: "La fertilidad de la tierra responde a la palabra creadora.",
    exact: false,
    exegesis: "Dios concede a la creación una fecundidad real. La tierra participa como causa secundaria, pero la iniciativa y el diseño pertenecen al Creador. La semilla anticipa continuidad de generación en generación.",
    language: "Deshe designa vegetación tierna o verdor. La repetición sonora con el verbo producir refuerza literariamente la abundancia que comienza a cubrir la tierra.",
  },
  {
    number: 12,
    title: "Cada planta según su género",
    summary: "La tierra produce vegetación ordenada y Dios vuelve a declarar buena su obra.",
    hebrew: "לְמִינֵהוּ",
    transliteration: "Leminehu",
    rvr: "Las plantas y árboles producen conforme a sus géneros.",
    ntv: "La fecundidad creada conserva patrones reconocibles y continuidad.",
    lbla: "El orden vegetal manifiesta estabilidad dentro de la diversidad.",
    exact: false,
    exegesis: "«Según su género» describe orden reproductivo observable; no corresponde directamente a la taxonomía biológica moderna. El énfasis teológico está en una creación fecunda, diversa y no caótica.",
    language: "Min significa clase o género en sentido cotidiano antiguo. No debe equipararse sin más con especie en el sentido técnico contemporáneo.",
  },
  {
    number: 13,
    title: "El tercer día",
    summary: "Tarde y mañana cierran el día en que tierra, mares y vegetación quedan establecidos.",
    hebrew: "יוֹם שְׁלִישִׁי",
    transliteration: "Yom shelishi",
    rvr: "La fórmula temporal concluye el tercer día.",
    ntv: "El tercer ciclo creador termina con una tierra preparada para alimentar vida.",
    lbla: "El relato marca la conclusión ordenada de la tercera jornada.",
    exact: false,
    exegesis: "El tercer día contiene dos actos y dos evaluaciones de bondad: se forman los ámbitos terrestres y se inicia su llenado. Esta correspondencia contribuye a la arquitectura literaria del capítulo.",
    language: "Shelishi es el ordinal «tercero». La numeración funciona como marcador estructural y guía al lector a través de la secuencia creadora.",
  },
  {
    number: 14,
    title: "Luces para tiempos y estaciones",
    summary: "Dios coloca luminarias para distinguir día y noche y ordenar el calendario humano.",
    hebrew: "יְהִי מְאֹרֹת",
    transliteration: "Yehi meorot",
    rvr: "Dios ordena luminarias que sirvan como señales de tiempos, días y años.",
    ntv: "Los astros regulan ritmos de luz y calendario por designio del Creador.",
    lbla: "Las luces celestes reciben funciones temporales concretas.",
    exact: false,
    exegesis: "El texto evita los nombres habituales de sol y luna, posiblemente para negarles estatus divino. Son lámparas funcionales creadas por Dios, no poderes que gobiernan el destino humano.",
    language: "Meorot significa luminarias o portadores de luz. Moedim puede referirse a estaciones y también a tiempos señalados para reuniones o festividades.",
  },
  {
    number: 15,
    title: "Luz sobre la tierra",
    summary: "Las luminarias reciben la tarea práctica de alumbrar el mundo habitado.",
    hebrew: "לְהָאִיר עַל־הָאָרֶץ",
    transliteration: "Lehair al-haaretz",
    rvr: "Las luces del cielo alumbran sobre la tierra.",
    ntv: "Su función beneficia directamente al ámbito donde vivirán las criaturas.",
    lbla: "La iluminación terrestre cumple el mandato de Dios.",
    exact: false,
    exegesis: "La frase recalca finalidad y servicio. Los cuerpos celestes no son objetos de culto; existen para sostener los ritmos de la creación y servir al escenario de la vida.",
    language: "Hair es la forma causativa del verbo or, «dar luz». La construcción expresa propósito: fueron colocadas para iluminar.",
  },
  {
    number: 16,
    title: "Las dos grandes luminarias",
    summary: "Dios hace las luminarias mayor y menor, y también las estrellas.",
    hebrew: "שְׁנֵי הַמְּאֹרֹת הַגְּדֹלִים",
    transliteration: "Shenei hameorot hagedolim",
    rvr: "La luminaria mayor preside el día y la menor, la noche.",
    ntv: "Sol, luna y estrellas son presentados como obras, no como dioses.",
    lbla: "Cada luminaria recibe un ámbito de servicio bajo el Creador.",
    exact: false,
    exegesis: "La mención casi incidental de las estrellas contrasta con su importancia religiosa en el mundo antiguo. Aquello que las naciones temían o adoraban es, en Génesis, producto de la palabra divina.",
    language: "Gadol significa grande. El lenguaje de gobierno de las luminarias describe función en los ciclos del día y la noche, no soberanía independiente.",
  },
  {
    number: 17,
    title: "Colocadas por Dios",
    summary: "Dios sitúa las luminarias en la expansión para cumplir su misión sobre la tierra.",
    hebrew: "וַיִּתֵּן אֹתָם אֱלֹהִים",
    transliteration: "Vayitten otam Elohim",
    rvr: "Dios coloca las luminarias en el cielo.",
    ntv: "El Creador asigna a los astros su lugar y servicio.",
    lbla: "La ubicación de las luces responde a la intención divina.",
    exact: false,
    exegesis: "La acción personal de Dios domina el versículo. El cosmos no encuentra su lugar por voluntad propia: su estabilidad y utilidad proceden del orden que el Creador establece.",
    language: "Natan significa dar, poner o colocar. Aquí comunica asignación: Dios entrega a las luminarias un lugar y una tarea.",
  },
  {
    number: 18,
    title: "Gobierno sin divinización",
    summary: "Las luminarias regulan día y noche y mantienen la distinción entre luz y oscuridad.",
    hebrew: "וְלִמְשֹׁל בַּיּוֹם וּבַלַּיְלָה",
    transliteration: "Velimshol bayom uvalaylah",
    rvr: "Las luces gobiernan los ciclos del día y de la noche.",
    ntv: "Sirven para regular la luz y la oscuridad conforme al diseño divino.",
    lbla: "Su dominio es funcional y subordinado al mandato del Creador.",
    exact: false,
    exegesis: "El verbo gobernar no concede personalidad divina a los astros. Su autoridad es derivada: cumplen una función regular dentro de límites establecidos por Dios.",
    language: "Mashal puede significar gobernar o ejercer dominio. El infinitivo expresa la función asignada a las luminarias, siempre bajo la soberanía mayor de Dios.",
  },
  {
    number: 19,
    title: "El cuarto día",
    summary: "La cuarta jornada concluye con los ritmos celestes establecidos.",
    hebrew: "יוֹם רְבִיעִי",
    transliteration: "Yom revii",
    rvr: "Tarde y mañana cierran el cuarto día.",
    ntv: "El ciclo termina con el cielo ordenado para marcar los tiempos.",
    lbla: "La cuarta jornada completa la función de las luminarias.",
    exact: false,
    exegesis: "El cuarto día corresponde al primero: la luz y la oscuridad reciben ahora portadores que regulan sus ciclos. La estructura muestra una creación cuidadosamente formada y luego poblada.",
    language: "Revii significa «cuarto». Como los demás ordinales, mantiene el ritmo litúrgico y narrativo del capítulo.",
  },
  {
    number: 20,
    title: "Vida en aguas y cielos",
    summary: "Dios ordena abundancia de criaturas acuáticas y aves sobre la tierra.",
    hebrew: "יִשְׁרְצוּ הַמַּיִם שֶׁרֶץ",
    transliteration: "Yishretzu hamayim sheretz",
    rvr: "Las aguas reciben el mandato de llenarse de seres vivientes.",
    ntv: "La vida irrumpe en abundancia en el mar y en el cielo.",
    lbla: "Criaturas acuáticas y voladoras comienzan a poblar sus ámbitos.",
    exact: false,
    exegesis: "El día quinto inicia el llenado de los espacios formados en el segundo día. La abundancia no es accidente: constituye una expresión deliberada de la generosidad creadora.",
    language: "Sharatz expresa pulular o multiplicarse abundantemente. Nefesh hayyah, «ser viviente», destaca vida animada y no equivale automáticamente a la noción filosófica posterior de alma separable.",
  },
  {
    number: 21,
    title: "Los grandes seres marinos",
    summary: "Incluso las criaturas imponentes del mar son creadas y declaradas buenas por Dios.",
    hebrew: "הַתַּנִּינִם הַגְּדֹלִים",
    transliteration: "Hatanninim hagedolim",
    rvr: "Dios crea los grandes monstruos marinos y toda criatura acuática.",
    ntv: "Las criaturas más temidas del océano pertenecen al orden creado.",
    lbla: "Todo ser marino y toda ave existen por la acción de Dios.",
    exact: false,
    exegesis: "En mitos vecinos, seres marinos podían representar poderes rivales. Génesis los incluye entre los animales creados: no amenazan la soberanía divina ni participan en una batalla cósmica contra Dios.",
    language: "Tanninim puede designar grandes criaturas marinas, serpientes o dragones según el contexto. Aquí son animales creados y buenos, no deidades enemigas.",
  },
  {
    number: 22,
    title: "La primera bendición",
    summary: "Dios bendice a los animales y les ordena fructificar y multiplicarse.",
    hebrew: "פְּרוּ וּרְבוּ",
    transliteration: "Peru urevu",
    rvr: "Dios bendice la vida marina y las aves con fecundidad.",
    ntv: "La multiplicación de la vida procede de la bendición divina.",
    lbla: "Criaturas del mar y del cielo reciben capacidad para llenar sus ámbitos.",
    exact: false,
    exegesis: "La bendición es palabra eficaz que concede capacidad para cumplir el mandato. La vida no solo comienza; recibe de Dios continuidad, expansión y futuro.",
    language: "Parah y rabah significan fructificar y multiplicarse. Los imperativos comunican misión acompañada por la provisión divina necesaria para realizarla.",
  },
  {
    number: 23,
    title: "El quinto día",
    summary: "La jornada concluye con mares y cielos llenándose de vida bendecida.",
    hebrew: "יוֹם חֲמִישִׁי",
    transliteration: "Yom jamishi",
    rvr: "Tarde y mañana cierran el quinto día.",
    ntv: "El quinto ciclo termina después de la bendición de los animales.",
    lbla: "La quinta jornada completa el poblamiento de aguas y cielo.",
    exact: false,
    exegesis: "El quinto día corresponde al segundo: los ámbitos separados de aguas y expansión reciben ahora sus habitantes. La simetría literaria sostiene el mensaje de orden intencional.",
    language: "Jamishi es el ordinal «quinto». La forma repetida de cierre mantiene unidad y expectativa hacia el clímax del sexto día.",
  },
  {
    number: 24,
    title: "Seres vivientes de la tierra",
    summary: "La tierra produce animales domésticos, criaturas pequeñas y fauna salvaje.",
    hebrew: "תּוֹצֵא הָאָרֶץ נֶפֶשׁ חַיָּה",
    transliteration: "Totze haaretz nefesh hayyah",
    rvr: "Dios ordena que la tierra produzca seres vivientes según sus géneros.",
    ntv: "El ámbito terrestre se llena con una diversidad organizada de animales.",
    lbla: "La tierra responde al mandato divino produciendo vida animal.",
    exact: false,
    exegesis: "Las categorías reflejan la experiencia cotidiana del antiguo Israel, no una clasificación zoológica exhaustiva. El punto central es que toda forma de vida terrestre depende de la palabra de Dios.",
    language: "Behemah suele referirse a animales domésticos; remes, a criaturas que se desplazan cerca del suelo; jayto-eretz, a fauna del campo. Son categorías observacionales.",
  },
  {
    number: 25,
    title: "Diversidad bajo un solo Creador",
    summary: "Dios hace los distintos animales de la tierra y contempla que su obra es buena.",
    hebrew: "וַיַּעַשׂ אֱלֹהִים",
    transliteration: "Vayaas Elohim",
    rvr: "Dios hace cada grupo de animales según su género.",
    ntv: "La diversidad animal recibe forma y orden del Creador.",
    lbla: "La obra terrestre queda completa y aprobada como buena.",
    exact: false,
    exegesis: "El versículo repite que Dios hace y evalúa. La bondad de los animales precede a su utilidad para los humanos; poseen valor dentro del propósito creador de Dios.",
    language: "Asah, «hacer», aparece junto a bara en el capítulo. Los términos se solapan en parte y no deben convertirse automáticamente en etapas técnicas diferentes de creación.",
  },
  {
    number: 26,
    title: "La humanidad a imagen de Dios",
    summary: "Dios anuncia la creación humana a su imagen y le confía representación responsable sobre la tierra.",
    hebrew: "נַעֲשֶׂה אָדָם בְּצַלְמֵנוּ כִּדְמוּתֵנוּ",
    transliteration: "Naaseh adam betzalmenu kidmutenu",
    rvr: "Dios decide hacer al ser humano a su imagen y semejanza.",
    ntv: "La humanidad es creada para reflejar a Dios y administrar su mundo.",
    lbla: "Imagen, semejanza y dominio aparecen unidos en la vocación humana.",
    exact: false,
    exegesis: "El plural «hagamos» ha recibido varias explicaciones: deliberación divina, consejo celestial y lectura cristiana trinitaria. El versículo por sí solo no define toda la doctrina de la Trinidad, pero dentro del canon es compatible con la revelación posterior. La imagen implica dignidad y una misión representativa.",
    language: "Tselem es imagen o representación; demut, semejanza. Adam puede designar a la humanidad colectivamente antes de funcionar como nombre propio. Radah describe ejercer dominio, que debe imitar el cuidado del Rey divino.",
  },
  {
    number: 27,
    title: "Varón y mujer, imagen divina",
    summary: "Dios crea a la humanidad, masculina y femenina, compartiendo plenamente su imagen.",
    hebrew: "זָכָר וּנְקֵבָה בָּרָא אֹתָם",
    transliteration: "Zakhar uneqevah bara otam",
    rvr: "La humanidad es creada a imagen de Dios: varón y mujer.",
    ntv: "Ambos sexos reciben igual dignidad y la misma vocación ante el Creador.",
    lbla: "La imagen divina pertenece conjuntamente al hombre y a la mujer.",
    exact: false,
    exegesis: "La forma poética repite tres veces el acto creador y coloca la imagen de Dios en el centro. Ningún sexo posee una imagen más plena. La unidad humana incluye diferencia sexual sin jerarquía de valor.",
    language: "Zakhar y neqevah son términos sexuales complementarios. El pronombre plural «los» confirma que la expresión colectiva «el ser humano» comprende a ambos.",
  },
  {
    number: 28,
    title: "Bendición y mandato cultural",
    summary: "Dios bendice a la humanidad para multiplicarse, llenar la tierra y administrarla responsablemente.",
    hebrew: "מִלְאוּ אֶת־הָאָרֶץ וְכִבְשֻׁהָ",
    transliteration: "Milu et-haaretz vekivshuha",
    rvr: "La humanidad recibe fecundidad, dominio y responsabilidad sobre los seres vivos.",
    ntv: "Dios encomienda desarrollar la vida humana y cuidar el mundo bajo su autoridad.",
    lbla: "El mandato une bendición, expansión humana y gobierno de la creación.",
    exact: false,
    exegesis: "Sojuzgar y dominar no autorizan explotación destructiva. Como portadores de la imagen, los humanos representan al Rey cuyo gobierno produce orden y vida. El poder delegado permanece sujeto al carácter y mandato de Dios.",
    language: "Kabash puede expresar someter; radah, gobernar. En este contexto anterior al pecado describen ordenar y administrar una tierra buena, no violencia contra ella.",
  },
  {
    number: 29,
    title: "La provisión de alimento",
    summary: "Dios entrega plantas con semilla y frutos como alimento para la humanidad.",
    hebrew: "נָתַתִּי לָכֶם",
    transliteration: "Natati lakhem",
    rvr: "Dios concede la vegetación y los frutos para alimento.",
    ntv: "La provisión material aparece como un don anterior al esfuerzo humano.",
    lbla: "El Creador sostiene a sus representantes con los recursos de la tierra.",
    exact: false,
    exegesis: "El mandato humano viene acompañado de provisión. El texto presenta originalmente una dieta vegetal; otros pasajes, especialmente Génesis 9, desarrollarán posteriormente la cuestión alimentaria. No debe aislarse este versículo del movimiento total del canon.",
    language: "Natati es perfecto de natan, «he dado». La forma destaca que el alimento se recibe como don divino y no como posesión autónoma.",
  },
  {
    number: 30,
    title: "Dios alimenta a sus criaturas",
    summary: "La vegetación también sostiene a los animales terrestres y a las aves.",
    hebrew: "לְכָל־חַיַּת הָאָרֶץ",
    transliteration: "Lekhol jayat haaretz",
    rvr: "Dios provee alimento para toda criatura con aliento de vida.",
    ntv: "El cuidado creador se extiende más allá de la humanidad.",
    lbla: "Animales y aves participan de la provisión abundante de Dios.",
    exact: false,
    exegesis: "La providencia divina alcanza a toda la comunidad de criaturas. La humanidad ocupa una función singular, pero no es la única destinataria de la bondad del Creador.",
    language: "Kol significa «todo» o «cada». La repetición amplía deliberadamente el alcance de la provisión a los distintos grupos de seres vivientes.",
  },
  {
    number: 31,
    title: "Todo era muy bueno",
    summary: "Dios contempla la totalidad integrada de su obra y declara que es muy buena.",
    hebrew: "טוֹב מְאֹד",
    transliteration: "Tov meod",
    rvr: "Dios evalúa el conjunto de lo creado como muy bueno.",
    ntv: "La creación completa cumple abundantemente el propósito divino.",
    lbla: "La aprobación final alcanza a la totalidad ordenada del mundo.",
    exact: false,
    exegesis: "La evaluación final es más intensa que las anteriores porque contempla el sistema completo: ámbitos, habitantes, relaciones y vocaciones. El mal de los capítulos siguientes no pertenece al diseño original de Dios; irrumpe en una creación inicialmente buena.",
    language: "Meod intensifica tov: no solo bueno, sino muy bueno. Hashishi, «el sexto», aparece con artículo y cierra el clímax antes del reposo del séptimo día.",
  },
];

const connections = [
  ["Salmo 33:6", "La creación mediante la palabra del Señor."],
  ["Juan 1:1–3", "El prólogo identifica al Verbo como agente de la creación."],
  ["Colosenses 1:16", "Todas las cosas fueron creadas por medio de Cristo y para él."],
  ["Hebreos 11:3", "La fe reconoce que el universo fue constituido por la palabra de Dios."],
] as const;

export default function Home() {
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [completedVerses, setCompletedVerses] = useState<number[]>([]);
  const [activeBookId, setActiveBookId] = useState("GEN");
  const [activeReference, setActiveReference] = useState("Génesis 1");
  const current = useMemo(
    () => verses.find((verse) => verse.number === selectedVerse) ?? verses[0],
    [selectedVerse],
  );
  const isComplete = completedVerses.includes(selectedVerse);
  const chapterProgress = (completedVerses.length / 31) * 100;

  function toggleCompleted() {
    setCompletedVerses((currentVerses) =>
      currentVerses.includes(selectedVerse)
        ? currentVerses.filter((verse) => verse !== selectedVerse)
        : [...currentVerses, selectedVerse].sort((a, b) => a - b),
    );
  }

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    try {
      const registration = context.registerTool({
        name: "set_genesis_verse_studied",
        title: "Actualizar progreso de Génesis",
        description:
          "Marca o desmarca como estudiado uno de los 31 versículos de Génesis 1 y lo muestra en la interfaz.",
        inputSchema: {
          type: "object",
          properties: {
            verse: { type: "integer", minimum: 1, maximum: 31 },
            studied: { type: "boolean" },
          },
          required: ["verse", "studied"],
          additionalProperties: false,
        },
        annotations: {
          readOnlyHint: false,
          untrustedContentHint: false,
        },
        async execute(input) {
          if (
            typeof input !== "object" ||
            input === null ||
            !Number.isInteger((input as { verse?: unknown }).verse) ||
            (input as { verse: number }).verse < 1 ||
            (input as { verse: number }).verse > 31 ||
            typeof (input as { studied?: unknown }).studied !== "boolean"
          ) {
            throw new Error("El versículo debe estar entre 1 y 31 y «studied» debe ser verdadero o falso.");
          }

          const { verse, studied } = input as { verse: number; studied: boolean };
          setSelectedVerse(verse);
          setCompletedVerses((currentVerses) => {
            const next = currentVerses.filter((item) => item !== verse);
            if (studied) next.push(verse);
            return next.sort((a, b) => a - b);
          });
          await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
          return { reference: `Génesis 1:${verse}`, studied };
        },
      }, { signal: lifecycle.signal });
      void Promise.resolve(registration).catch(() => undefined);
    } catch {
      return () => lifecycle.abort();
    }

    return () => lifecycle.abort();
  }, []);

  useEffect(() => {
    function handleSelection(event: Event) {
      const detail = (event as CustomEvent<{ bookId?: string; reference?: string }>).detail;
      if (detail?.bookId) setActiveBookId(detail.bookId);
      if (detail?.reference) setActiveReference(detail.reference);
    }

    window.addEventListener("bible-reader-selection", handleSelection);
    return () => window.removeEventListener("bible-reader-selection", handleSelection);
  }, []);

  function openBook(book: string) {
    const bookId = apiBookIds[book];
    if (!bookId) return;
    setActiveBookId(bookId);
    setActiveReference(book);
    window.dispatchEvent(new CustomEvent("bible-reader-navigate", { detail: { bookId } }));
    const reader = document.getElementById("lector-biblico");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reader?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "18rem" } as CSSProperties}
      className="bg-background"
    >
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido principal
      </a>
      <Sidebar variant="sidebar" collapsible="offcanvas" className="border-r-0">
        <SidebarHeader className="px-4 pb-3 pt-5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-[inset_0_0_0_1px_rgb(255_255_255/12%)]">
              <BookOpenText aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-lg font-semibold leading-tight tracking-tight">Academia Bíblica</p>
              <p className="mt-0.5 text-xs tracking-wide text-sidebar-foreground/60">66 LIBROS · ESTUDIO PROFUNDO</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent className="px-2 pb-3">
          {canon.map((group) => (
            <SidebarGroup key={group.section} className="py-1.5">
              <SidebarGroupLabel className="font-semibold uppercase tracking-[0.12em]">
                {group.section}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.books.map(([book, chapters]) => {
                    const active = apiBookIds[book] === activeBookId;
                    return (
                      <SidebarMenuItem key={book}>
                        <SidebarMenuButton
                          isActive={active}
                          onClick={() => openBook(book)}
                          aria-label={`${book}, ${chapters} capítulos${active ? ", libro seleccionado" : ""}`}
                          className="h-9 data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                        >
                          <span className={active ? "font-semibold" : "text-sidebar-foreground/76"}>{book}</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge className={active ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/65"}>
                          {chapters}
                        </SidebarMenuBadge>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter className="p-4">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/65 p-3.5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold">Progreso del canon</span>
              <span className="tabular-nums text-sidebar-foreground/60">0 / 1.189</span>
            </div>
            <Progress value={0} aria-label="Progreso total: cero de 1.189 capítulos" className="h-1.5" />
            <p className="mt-2 text-xs leading-relaxed text-sidebar-foreground/58">Recorrido canónico: Génesis → Apocalipsis</p>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset id="contenido-principal" tabIndex={-1} className="min-w-0 bg-background">
        <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-border bg-background/92 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <SidebarTrigger aria-label="Abrir biblioteca bíblica" className="size-11 md:size-9" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <span className="hidden sm:inline">Antiguo Testamento</span>
              <ChevronRight aria-hidden="true" className="hidden size-3 sm:block" />
              <span>Pentateuco</span>
            </div>
            <p className="truncate text-sm font-semibold text-foreground sm:text-base">Lectura bíblica · {activeReference}</p>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <Button variant="outline" size="icon" disabled aria-label="Capítulo anterior">
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button variant="outline" className="min-w-28" disabled>
              Capítulo 1 de 50
            </Button>
            <Button variant="outline" size="icon" disabled aria-label="Capítulo siguiente, disponible al completar el estudio">
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_18.5rem] xl:gap-8">
          <div className="min-w-0">
            <section aria-labelledby="chapter-title" className="chapter-masthead overflow-hidden rounded-2xl border border-border bg-card">
              <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-9">
                <div className="max-w-3xl">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-primary/25 bg-primary/7 text-primary">GÉNESIS</Badge>
                    <Badge variant="outline" className="border-border bg-background/70">Capítulo 1</Badge>
                    <Badge variant="outline" className="border-border bg-background/70">31 versículos</Badge>
                  </div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground">Primera lección</p>
                  <h1 id="chapter-title" className="font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-6xl">
                    En el principio
                  </h1>
                  <p className="mt-4 max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg">
                    Génesis 1 presenta a Dios como Creador soberano y ordena el mundo mediante su palabra. Empezamos con el texto, su contexto y su significado antes de evaluar debates posteriores.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 lg:w-64">
                  <div className="metric-card"><span className="metric-value">66</span><span className="metric-label">libros</span></div>
                  <div className="metric-card"><span className="metric-value">1.189</span><span className="metric-label">capítulos</span></div>
                  <div className="metric-card"><span className="metric-value">3</span><span className="metric-label">versiones</span></div>
                </div>
              </div>
            </section>

            <BibleReader />

            <section aria-labelledby="verse-selector-title" className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p id="verse-selector-title" className="text-sm font-semibold">Análisis versículo por versículo</p>
                  <p className="mt-1 text-sm text-muted-foreground">Capítulo completo · Génesis 1:1–31</p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-2" role="group" aria-label="Seleccionar versículo">
                  {verses.map((verse) => (
                    <button
                      key={verse.number}
                      type="button"
                      onClick={() => setSelectedVerse(verse.number)}
                      aria-pressed={selectedVerse === verse.number}
                      aria-label={`Estudiar Génesis 1:${verse.number}${completedVerses.includes(verse.number) ? ", estudiado" : ""}`}
                      className="verse-button"
                    >
                      {verse.number}
                      {completedVerses.includes(verse.number) && <span className="completed-dot" aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 border-t border-border pt-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="min-w-0">
                  <div className="mb-5 flex items-start gap-4">
                    <span className="verse-number" aria-hidden="true">{current.number}</span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Génesis 1:{current.number}</p>
                      <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{current.title}</h2>
                      <p className="mt-2 max-w-[70ch] leading-7 text-muted-foreground">{current.summary}</p>
                    </div>
                  </div>

                  <Tabs defaultValue="texto" className="w-full">
                    <TabsList variant="line" className="scrollbar-none h-auto max-w-full justify-start overflow-x-auto border-b border-border pb-0">
                      <TabsTrigger value="texto" className="min-h-11 px-3">Texto comparado</TabsTrigger>
                      <TabsTrigger value="exegesis" className="min-h-11 px-3">Exégesis</TabsTrigger>
                      <TabsTrigger value="teologia" className="min-h-11 px-3">Teología</TabsTrigger>
                      <TabsTrigger value="conexiones" className="min-h-11 px-3">Conexiones</TabsTrigger>
                    </TabsList>

                    <TabsContent value="texto" className="pt-5">
                      <Tabs defaultValue="rvr" className="w-full">
                        <TabsList aria-label="Versiones bíblicas" className="h-11 w-full justify-start overflow-x-auto bg-muted/70 p-1 sm:w-fit">
                          <TabsTrigger value="rvr" className="min-h-9 px-4">RVR1960</TabsTrigger>
                          <TabsTrigger value="ntv" className="min-h-9 px-4">NTV</TabsTrigger>
                          <TabsTrigger value="lbla" className="min-h-9 px-4">LBLA</TabsTrigger>
                        </TabsList>
                        {(["rvr", "ntv", "lbla"] as const).map((version) => (
                          <TabsContent key={version} value={version} className="pt-4">
                            <blockquote className="scripture-quote">
                              <span className="font-serif text-2xl leading-relaxed sm:text-3xl">{current[version]}</span>
                            </blockquote>
                            <p className="mt-3 text-xs leading-5 text-muted-foreground">
                              {current.exact
                                ? "Fragmento breve para comparación académica."
                                : "Resumen de estudio del contenido; no es una cita textual de la traducción."}
                            </p>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </TabsContent>

                    <TabsContent value="exegesis" className="pt-5">
                      <article className="reading-copy max-w-[72ch]">
                        <h3>Lectura del texto</h3>
                        <p>{current.exegesis}</p>
                        <div className="language-note">
                          <Languages aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
                          <div>
                            <p className="font-serif text-2xl leading-relaxed" lang="he" dir="rtl">{current.hebrew}</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">{current.transliteration}</p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{current.language}</p>
                          </div>
                        </div>
                      </article>
                    </TabsContent>

                    <TabsContent value="teologia" className="pt-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          ["Dios es anterior a la creación", "El relato distingue radicalmente al Creador de todo lo creado."],
                          ["La creación tiene propósito", "El orden y la evaluación divina muestran intención, no azar teológico."],
                          ["La palabra divina es eficaz", "Lo que Dios dispone llega a existir y cumple su función."],
                          ["Cristo y la creación", "El Nuevo Testamento identifica al Hijo como agente de la creación sin borrar la unidad de Dios."],
                        ].map(([title, text], index) => (
                          <div key={title} className="theology-card">
                            <span className="theology-index">0{index + 1}</span>
                            <h3>{title}</h3>
                            <p>{text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 rounded-xl border border-accent/35 bg-accent/9 p-4 text-sm leading-6">
                        <strong>Precisión doctrinal:</strong> la creación de la nada se formula con mayor claridad al leer Génesis junto con pasajes como Hebreos 11:3. No conviene exigir que Génesis 1:1 responda por sí solo a todas las preguntas filosóficas posteriores.
                      </div>
                    </TabsContent>

                    <TabsContent value="conexiones" className="pt-5">
                      <div className="divide-y divide-border rounded-xl border border-border">
                        {connections.map(([reference, text]) => (
                          <div key={reference} className="grid gap-1 p-4 sm:grid-cols-[8rem_1fr] sm:gap-5">
                            <p className="font-semibold text-primary">{reference}</p>
                            <p className="text-sm leading-6 text-muted-foreground">{text}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <aside className="rounded-xl border border-border bg-muted/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Palabra clave</p>
                  <p className="mt-3 font-serif text-3xl leading-tight" lang="he" dir="rtl">{current.hebrew.split(" ")[0]}</p>
                  <p className="mt-1 font-semibold">{current.transliteration.split(" ")[0]}</p>
                  <div className="my-4 h-px bg-border" />
                  <p className="text-sm leading-6 text-muted-foreground">El análisis léxico apoya la lectura del pasaje, pero ninguna doctrina debe construirse únicamente a partir de la forma de una palabra.</p>
                </aside>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {isComplete ? `Génesis 1:${selectedVerse} marcado como estudiado.` : `Estudiando Génesis 1:${selectedVerse} de 31.`}
                </p>
                <Button onClick={toggleCompleted} variant={isComplete ? "outline" : "default"} className="min-h-11 sm:min-w-52">
                  {isComplete && <Check aria-hidden="true" />}
                  {isComplete ? "Versículo estudiado" : "Marcar como estudiado"}
                </Button>
              </div>
            </section>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-22 xl:self-start" aria-label="Ruta y progreso del estudio">
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Milestone aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Ruta del estudio</h2>
                  <p className="text-sm text-muted-foreground">Método exegético</p>
                </div>
              </div>
              <ol className="study-path mt-5">
                {[
                  ["Texto", "Comparar las traducciones"],
                  ["Contexto", "Ubicar el pasaje"],
                  ["Lenguas", "Examinar términos clave"],
                  ["Teología", "Formular la doctrina"],
                  ["Aplicación", "Responder al mensaje"],
                ].map(([title, description], index) => (
                  <li key={title}>
                    <span>{index + 1}</span>
                    <div>
                      <p>{title}</p>
                      <small>{description}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">Progreso del capítulo</h2>
                <span className="text-sm font-semibold tabular-nums">{completedVerses.length}/31</span>
              </div>
              <Progress value={chapterProgress} aria-label={`${completedVerses.length} de 31 versículos estudiados`} />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Cada versículo completado se conservará durante esta sesión de estudio.</p>
            </section>

            <section className="rounded-2xl bg-foreground p-5 text-background">
              <div className="flex items-center gap-2 text-background/68">
                <ScrollText aria-hidden="true" className="size-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">Principio hermenéutico</p>
              </div>
              <blockquote className="mt-4 font-serif text-xl leading-7">
                Comprender primero lo que el texto dice; interpretar después lo que significa; aplicar finalmente lo que enseña.
              </blockquote>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <LibraryBig aria-hidden="true" className="size-4 text-primary" />
                <h2 className="font-semibold">Base textual</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">RVR1960 como versión principal, acompañada por NTV y LBLA, con consulta del hebreo, arameo y griego.</p>
              <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">La publicación de capítulos completos de traducciones protegidas requerirá licencia o una fuente autorizada.</p>
            </section>
          </aside>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
