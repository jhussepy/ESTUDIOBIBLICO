"use client";

import {
  Check,
  Contrast,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Sun,
} from "lucide-react";

import { useStudyWorkspace } from "@/hooks/use-study-workspace";
import {
  colorModes,
  colorPaletteGroups,
  colorPalettes,
  type ColorMode,
} from "@/lib/theme-palettes";

const modeIcons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const;

const modeDescriptions: Record<ColorMode, string> = {
  system: "Sigue automáticamente la configuración de tu dispositivo.",
  light: "Mantiene una superficie clara para estudiar durante el día.",
  dark: "Reduce el brillo para sesiones nocturnas o con poca luz.",
};

export function AppearanceSettings() {
  const {
    hydrated,
    preferences,
    setColorPalette,
    setColorMode,
    toggleHighContrast,
    resetAppearance,
  } = useStudyWorkspace();

  const selectedPalette =
    colorPalettes.find((palette) => palette.id === preferences.colorPalette) ??
    colorPalettes[0];
  const selectedMode =
    colorModes.find((mode) => mode.id === preferences.colorMode) ?? colorModes[0];
  const isDefault =
    preferences.colorPalette === "manuscript" &&
    preferences.colorMode === "system" &&
    !preferences.highContrast;

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="palette-heading"
        className="rounded-2xl border border-border bg-card p-5 sm:p-7"
      >
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Palette aria-hidden="true" className="size-5" />
          </div>
          <div>
            <h2 id="palette-heading" className="font-serif text-2xl font-semibold">
              Paleta de colores
            </h2>
            <p className="mt-1 max-w-2xl leading-7 text-muted-foreground">
              Elige una atmósfera visual. El contenido y la estructura del estudio permanecen iguales.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-7" role="radiogroup" aria-label="Paleta de colores">
          {colorPaletteGroups.map((group) => {
            const options = colorPalettes.filter(
              (palette) => palette.category === group.id,
            );
            return (
              <div key={group.id}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{group.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {group.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-accent-emphasis">
                    {options.length} opciones
                  </span>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {options.map((option) => {
                    const active = option.id === preferences.colorPalette;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={!hydrated}
                        onClick={() => setColorPalette(option.id)}
                        className={
                          "group relative min-h-36 cursor-pointer rounded-2xl border p-4 text-left transition-[border-color,box-shadow,transform] duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-wait disabled:opacity-65 motion-safe:hover:-translate-y-0.5 " +
                          (active
                            ? "border-primary bg-primary/6 shadow-sm ring-1 ring-primary/20"
                            : "border-border bg-background hover:border-primary/45 hover:shadow-sm")
                        }
                      >
                        <span
                          aria-hidden="true"
                          className="block h-14 rounded-xl border border-black/10 shadow-inner"
                          style={{
                            background: `linear-gradient(135deg, ${option.swatches[0]} 0 48%, ${option.swatches[1]} 48% 72%, ${option.swatches[2]} 72% 100%)`,
                          }}
                        />
                        <span className="mt-3 flex items-center justify-between gap-3">
                          <span className="font-semibold text-foreground">
                            {option.label}
                          </span>
                          <span
                            aria-hidden="true"
                            className={
                              "grid size-6 shrink-0 place-items-center rounded-full border " +
                              (active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-transparent")
                            }
                          >
                            <Check className="size-3.5" />
                          </span>
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section
          aria-labelledby="mode-heading"
          className="rounded-2xl border border-border bg-card p-5 sm:p-7"
        >
          <h2 id="mode-heading" className="font-serif text-2xl font-semibold">
            Iluminación
          </h2>
          <p className="mt-1 leading-7 text-muted-foreground">
            Selecciona cómo se adapta la interfaz a la luz del entorno.
          </p>

          <div
            className="mt-5 grid gap-3 sm:grid-cols-3"
            role="radiogroup"
            aria-label="Modo de iluminación"
          >
            {colorModes.map((option) => {
              const Icon = modeIcons[option.id];
              const active = option.id === preferences.colorMode;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={!hydrated}
                  onClick={() => setColorMode(option.id)}
                  className={
                    "min-h-28 cursor-pointer rounded-xl border p-4 text-left transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-wait disabled:opacity-65 " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/45 hover:bg-muted/55")
                  }
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span className="mt-3 block font-semibold">{option.label}</span>
                  <span
                    className={
                      "mt-1 block text-xs leading-5 " +
                      (active ? "text-primary-foreground" : "text-muted-foreground")
                    }
                  >
                    {modeDescriptions[option.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="contrast-heading"
          className="rounded-2xl border border-border bg-card p-5 sm:p-7"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Contrast aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h2 id="contrast-heading" className="font-serif text-2xl font-semibold">
                Contraste
              </h2>
              <p className="text-sm text-muted-foreground">Mayor separación visual.</p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={preferences.highContrast}
            disabled={!hydrated}
            onClick={toggleHighContrast}
            className="mt-6 flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 text-left transition-colors duration-200 hover:border-primary/45 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-wait disabled:opacity-65"
          >
            <span>
              <span className="block font-semibold">Alto contraste</span>
              <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                Refuerza bordes y legibilidad.
              </span>
            </span>
            <span
              aria-hidden="true"
              className={
                "relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200 " +
                (preferences.highContrast
                  ? "border-primary bg-primary"
                  : "border-input bg-muted")
              }
            >
              <span
                className={
                  "absolute left-0 top-1 size-4 rounded-full bg-white shadow-sm transition-transform duration-200 motion-reduce:transition-none " +
                  (preferences.highContrast ? "translate-x-6" : "translate-x-1")
                }
              />
            </span>
          </button>
        </section>
      </div>

      <section
        aria-labelledby="preview-heading"
        className="overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="border-b border-border px-5 py-4 sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-emphasis">
            Vista previa en vivo
          </p>
          <h2 id="preview-heading" className="mt-1 font-serif text-2xl font-semibold">
            {selectedPalette.label} · {selectedMode.label}
          </h2>
        </div>
        <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_12rem]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-emphasis">
              Génesis 1:1
            </p>
            <p className="mt-3 font-serif text-2xl leading-relaxed text-foreground sm:text-3xl">
              En el principio, Dios creó los cielos y la tierra.
            </p>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              La selección se aplica inmediatamente y se conserva en este dispositivo para tus próximas visitas.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/55 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Estado
            </span>
            <p className="mt-2 font-semibold text-foreground">
              {preferences.highContrast ? "Alto contraste" : "Contraste estándar"}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {hydrated ? "Cambios guardados" : "Cargando preferencias…"}
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground" role="status" aria-live="polite">
          Los ajustes se guardan automáticamente en este dispositivo.
        </p>
        <button
          type="button"
          disabled={!hydrated || isDefault}
          onClick={resetAppearance}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Restablecer apariencia
        </button>
      </div>
    </div>
  );
}
