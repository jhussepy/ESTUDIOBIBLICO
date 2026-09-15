export const colorPaletteGroups = [
  {
    id: "classic",
    label: "Clásicas",
    description: "Tonos sobrios inspirados en manuscritos, naturaleza y tradición.",
  },
  {
    id: "vibrant",
    label: "Vivas",
    description: "Colores intensos para una experiencia con mayor energía visual.",
  },
  {
    id: "pastel",
    label: "Pastel",
    description: "Superficies luminosas y suaves que conservan una lectura nítida.",
  },
] as const;

export const colorPalettes = [
  {
    id: "manuscript",
    category: "classic",
    label: "Manuscrito",
    description: "Verde bosque, oro y papel marfil.",
    swatches: ["#1f332e", "#d29b40", "#f7f5f0"],
  },
  {
    id: "parchment",
    category: "classic",
    label: "Pergamino",
    description: "Granate, bronce y pergamino cálido.",
    swatches: ["#522b2f", "#b7793b", "#f8f0df"],
  },
  {
    id: "ocean",
    category: "classic",
    label: "Mar profundo",
    description: "Azul tinta, cobre y niebla clara.",
    swatches: ["#17354d", "#bd7b45", "#f2f6f7"],
  },
  {
    id: "olive",
    category: "classic",
    label: "Olivo",
    description: "Oliva, ámbar y arena natural.",
    swatches: ["#384331", "#b58a37", "#f4f1e6"],
  },
  {
    id: "royal",
    category: "classic",
    label: "Púrpura real",
    description: "Ciruela, oro antiguo y lino suave.",
    swatches: ["#472e4b", "#c09945", "#f7f2f5"],
  },
  {
    id: "ruby",
    category: "vibrant",
    label: "Rubí vivo",
    description: "Carmesí intenso, ámbar y rosa luminoso.",
    swatches: ["#be123c", "#f59e0b", "#fff1f2"],
  },
  {
    id: "turquoise",
    category: "vibrant",
    label: "Turquesa luminoso",
    description: "Turquesa profundo, naranja y agua clara.",
    swatches: ["#0f766e", "#f97316", "#ecfeff"],
  },
  {
    id: "cobalt",
    category: "vibrant",
    label: "Azul radiante",
    description: "Azul cobalto, cielo brillante y coral.",
    swatches: ["#1d4ed8", "#38bdf8", "#fb923c"],
  },
  {
    id: "lavender",
    category: "pastel",
    label: "Lavanda suave",
    description: "Lavanda, lila y blanco floral.",
    swatches: ["#7e22ce", "#d8b4fe", "#faf5ff"],
  },
  {
    id: "blush",
    category: "pastel",
    label: "Rosa pétalo",
    description: "Rosa frambuesa, pétalo y nácar.",
    swatches: ["#be185d", "#f9a8d4", "#fff1f5"],
  },
  {
    id: "mint",
    category: "pastel",
    label: "Menta fresca",
    description: "Esmeralda, menta y blanco vegetal.",
    swatches: ["#047857", "#6ee7b7", "#ecfdf5"],
  },
] as const;

export const colorModes = [
  { id: "system", label: "Automático" },
  { id: "light", label: "Claro" },
  { id: "dark", label: "Oscuro" },
] as const;

export type ColorPalette = (typeof colorPalettes)[number]["id"];
export type ColorPaletteCategory = (typeof colorPaletteGroups)[number]["id"];
export type ColorMode = (typeof colorModes)[number]["id"];

const paletteIds = new Set<string>(colorPalettes.map((palette) => palette.id));
const modeIds = new Set<string>(colorModes.map((mode) => mode.id));

export function isColorPalette(value: unknown): value is ColorPalette {
  return typeof value === "string" && paletteIds.has(value);
}

export function isColorMode(value: unknown): value is ColorMode {
  return typeof value === "string" && modeIds.has(value);
}

export function resolveColorMode(mode: ColorMode, prefersDark: boolean): "light" | "dark" {
  if (mode === "system") return prefersDark ? "dark" : "light";
  return mode;
}
