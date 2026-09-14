"use client";

import { Check, Palette } from "lucide-react";

import {
  colorPalettes,
  type ColorPalette,
} from "@/lib/theme-palettes";

interface PaletteSelectorProps {
  value: ColorPalette;
  onChange: (palette: ColorPalette) => void;
  compact?: boolean;
}

export function PaletteSelector({
  value,
  onChange,
  compact = false,
}: PaletteSelectorProps) {
  const selected = colorPalettes.find((palette) => palette.id === value) ?? colorPalettes[0];

  return (
    <section
      className={compact ? "rounded-xl border border-sidebar-border p-3" : "rounded-2xl border border-border bg-card p-5"}
      aria-labelledby="palette-selector-title"
    >
      <div className="flex items-center gap-2">
        <Palette aria-hidden="true" className={compact ? "size-4 text-sidebar-primary" : "size-4 text-primary"} />
        <h2
          id="palette-selector-title"
          className={compact ? "text-sm font-semibold text-sidebar-foreground" : "font-semibold"}
        >
          Paleta de colores
        </h2>
      </div>

      <div
        className="mt-3 flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Seleccionar paleta de colores"
      >
        {colorPalettes.map((palette) => {
          const active = palette.id === value;
          return (
            <button
              key={palette.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={palette.label}
              title={palette.label}
              onClick={() => onChange(palette.id)}
              className={
                "relative grid size-11 shrink-0 place-items-center rounded-full border-2 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-3 " +
                (compact
                  ? active
                    ? "border-sidebar-primary ring-2 ring-sidebar-primary/25 focus-visible:ring-sidebar-ring/50"
                    : "border-sidebar-border focus-visible:ring-sidebar-ring/50"
                  : active
                    ? "border-primary ring-2 ring-primary/20 focus-visible:ring-ring/40"
                    : "border-border focus-visible:ring-ring/40")
              }
            >
              <span
                aria-hidden="true"
                className="size-8 rounded-full border border-black/10 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${palette.swatches[0]} 0 46%, ${palette.swatches[1]} 46% 70%, ${palette.swatches[2]} 70% 100%)`,
                }}
              />
              {active && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <Check aria-hidden="true" className="size-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className={compact ? "mt-3 text-xs leading-5 text-sidebar-foreground/72" : "mt-3 text-sm leading-6 text-muted-foreground"}>
        <strong className={compact ? "text-sidebar-foreground" : "text-foreground"}>{selected.label}:</strong>{" "}
        {selected.description}
      </p>
    </section>
  );
}
