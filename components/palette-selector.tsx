"use client";

import { Check, Contrast, Monitor, Moon, Palette, Sun } from "lucide-react";

import {
  colorModes,
  colorPalettes,
  type ColorMode,
  type ColorPalette,
} from "@/lib/theme-palettes";

interface PaletteSelectorProps {
  palette: ColorPalette;
  mode: ColorMode;
  highContrast: boolean;
  onPaletteChange: (palette: ColorPalette) => void;
  onModeChange: (mode: ColorMode) => void;
  onContrastChange: () => void;
}

const modeIcons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const;

export function PaletteSelector({
  palette,
  mode,
  highContrast,
  onPaletteChange,
  onModeChange,
  onContrastChange,
}: PaletteSelectorProps) {
  const selectedPalette =
    colorPalettes.find((option) => option.id === palette) ?? colorPalettes[0];

  return (
    <section
      className="rounded-xl border border-sidebar-border bg-sidebar-accent/35 p-3"
      aria-labelledby="palette-selector-title"
    >
      <div className="flex items-center gap-2">
        <Palette aria-hidden="true" className="size-4 text-sidebar-primary" />
        <h2 id="palette-selector-title" className="text-sm font-semibold text-sidebar-foreground">
          Apariencia
        </h2>
      </div>

      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/65">
        Paleta
      </p>
      <div
        className="mt-2 flex flex-wrap gap-1"
        role="radiogroup"
        aria-label="Seleccionar paleta de colores"
      >
        {colorPalettes.map((option) => {
          const active = option.id === palette;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={option.label}
              title={option.label}
              onClick={() => onPaletteChange(option.id)}
              className={
                "relative grid size-11 shrink-0 place-items-center rounded-full border-2 transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/55 " +
                (active
                  ? "border-sidebar-primary ring-2 ring-sidebar-primary/25"
                  : "border-sidebar-border hover:border-sidebar-foreground/55")
              }
            >
              <span
                aria-hidden="true"
                className="size-8 rounded-full border border-black/15 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${option.swatches[0]} 0 46%, ${option.swatches[1]} 46% 70%, ${option.swatches[2]} 70% 100%)`,
                }}
              />
              {active && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                  <Check aria-hidden="true" className="size-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs leading-5 text-sidebar-foreground/72">
        <strong className="text-sidebar-foreground">{selectedPalette.label}:</strong>{" "}
        {selectedPalette.description}
      </p>

      <p className="mt-3 border-t border-sidebar-border pt-3 text-xs font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/65">
        Iluminación
      </p>
      <div className="mt-2 grid grid-cols-3 gap-1" role="radiogroup" aria-label="Modo de color">
        {colorModes.map((option) => {
          const Icon = modeIcons[option.id];
          const active = option.id === mode;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={option.label}
              onClick={() => onModeChange(option.id)}
              className={
                "flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg border px-1 text-[0.68rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/55 " +
                (active
                  ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground"
                  : "border-sidebar-border text-sidebar-foreground/78 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")
              }
            >
              <Icon aria-hidden="true" className="size-4" />
              {option.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-pressed={highContrast}
        onClick={onContrastChange}
        className={
          "mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border px-3 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/55 " +
          (highContrast
            ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground"
            : "border-sidebar-border text-sidebar-foreground/78 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")
        }
      >
        <span className="flex items-center gap-2">
          <Contrast aria-hidden="true" className="size-4" />
          Alto contraste
        </span>
        <span aria-hidden="true">{highContrast ? "Activado" : "—"}</span>
      </button>
    </section>
  );
}
