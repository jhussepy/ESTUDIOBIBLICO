import { describe, expect, it } from "vitest";

import {
  colorModes,
  colorPalettes,
  isColorMode,
  isColorPalette,
  resolveColorMode,
} from "../lib/theme-palettes";

describe("sistema de paletas", () => {
  it("publica cinco paletas únicas con metadatos visuales completos", () => {
    expect(colorPalettes).toHaveLength(5);
    expect(new Set(colorPalettes.map((palette) => palette.id)).size).toBe(5);

    for (const palette of colorPalettes) {
      expect(palette.label.trim()).not.toBe("");
      expect(palette.description.trim()).not.toBe("");
      expect(palette.swatches).toHaveLength(3);
      expect(palette.swatches.every((color) => /^#[0-9a-f]{6}$/i.test(color))).toBe(true);
    }
  });

  it("reconoce solo identificadores de paleta admitidos", () => {
    expect(isColorPalette("manuscript")).toBe(true);
    expect(isColorPalette("royal")).toBe(true);
    expect(isColorPalette("unknown")).toBe(false);
    expect(isColorPalette(null)).toBe(false);
  });

  it("incluye modos automático, claro y oscuro", () => {
    expect(colorModes.map((mode) => mode.id)).toEqual(["system", "light", "dark"]);
    expect(isColorMode("system")).toBe(true);
    expect(isColorMode("sepia")).toBe(false);
  });

  it("resuelve el modo automático siguiendo la preferencia del sistema", () => {
    expect(resolveColorMode("system", true)).toBe("dark");
    expect(resolveColorMode("system", false)).toBe("light");
    expect(resolveColorMode("light", true)).toBe("light");
    expect(resolveColorMode("dark", false)).toBe("dark");
  });
});
