export const colorPalettes = [
  {
    id: "manuscript",
    label: "Manuscrito",
    description: "Verde bosque, oro y papel marfil.",
    swatches: ["#1f332e", "#d29b40", "#f7f5f0"],
  },
  {
    id: "parchment",
    label: "Pergamino",
    description: "Sepia, granate y pergamino cálido.",
    swatches: ["#522b2f", "#b7793b", "#f8f0df"],
  },
  {
    id: "ocean",
    label: "Mar profundo",
    description: "Azul tinta, cobre y niebla clara.",
    swatches: ["#17354d", "#bd7b45", "#f2f6f7"],
  },
  {
    id: "olive",
    label: "Olivo",
    description: "Oliva, ámbar y arena natural.",
    swatches: ["#384331", "#b58a37", "#f4f1e6"],
  },
  {
    id: "royal",
    label: "Púrpura real",
    description: "Ciruela, oro viejo y lino suave.",
    swatches: ["#472e4b", "#c09945", "#f7f2f5"],
  },
] as const;

export type ColorPalette = (typeof colorPalettes)[number]["id"];

const paletteIds = new Set<string>(colorPalettes.map((palette) => palette.id));

export function isColorPalette(value: unknown): value is ColorPalette {
  return typeof value === "string" && paletteIds.has(value);
}
