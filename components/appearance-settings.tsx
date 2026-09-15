"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Accessibility,
  AlignJustify,
  BookOpen,
  Check,
  CheckCircle2,
  Columns3,
  Contrast,
  Database,
  Download,
  History,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Sun,
  Type,
  Upload,
} from "lucide-react";

import {
  useStudyWorkspace,
  type ReadingFont,
  type ReadingLineHeight,
  type ReadingScale,
  type ReadingWidth,
} from "@/hooks/use-study-workspace";
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

interface BibleSummary {
  id: string;
  abbreviation: string;
  name: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const readingScaleOptions: Array<{ id: ReadingScale; label: string; sample: string }> = [
  { id: "small", label: "Pequeño", sample: "A−" },
  { id: "normal", label: "Normal", sample: "A" },
  { id: "large", label: "Grande", sample: "A+" },
  { id: "extra-large", label: "Extra grande", sample: "A++" },
];

const lineHeightOptions: Array<{ id: ReadingLineHeight; label: string; description: string }> = [
  { id: "compact", label: "Compacto", description: "Más texto visible" },
  { id: "comfortable", label: "Cómodo", description: "Equilibrio recomendado" },
  { id: "spacious", label: "Amplio", description: "Mayor separación" },
];

const widthOptions: Array<{ id: ReadingWidth; label: string; description: string }> = [
  { id: "narrow", label: "Estrecho", description: "58 caracteres" },
  { id: "balanced", label: "Equilibrado", description: "72 caracteres" },
  { id: "wide", label: "Amplio", description: "88 caracteres" },
];

const fontOptions: Array<{ id: ReadingFont; label: string; description: string }> = [
  { id: "serif", label: "Clásica", description: "Crimson Pro, pensada para lectura editorial" },
  { id: "accessible", label: "Accesible", description: "Atkinson Hyperlegible, formas más distinguibles" },
];

function SettingSwitch({
  checked,
  disabled,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  description: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className="flex min-h-16 w-full items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary/45 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-wait disabled:opacity-65"
    >
      <span>
        <span className="block font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">{description}</span>
      </span>
      <span
        aria-hidden="true"
        className={
          "relative h-7 w-12 shrink-0 rounded-full border transition-colors " +
          (checked ? "border-primary bg-primary" : "border-input bg-muted")
        }
      >
        <span
          className={
            "absolute left-0 top-1 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none " +
            (checked ? "translate-x-6" : "translate-x-1")
          }
        />
      </span>
    </button>
  );
}

export function AppearanceSettings() {
  const {
    hydrated,
    completedByStudy,
    bookmarks,
    notes,
    lastReading,
    preferences,
    setColorPalette,
    setColorMode,
    toggleHighContrast,
    setReadingScale,
    setReadingLineHeight,
    setReadingWidth,
    setReadingFont,
    setRememberLastReading,
    setDefaultBibleId,
    toggleReduceMotion,
    resetReading,
    resetAppearance,
    clearStudyData,
    restoreWorkspace,
  } = useStudyWorkspace();
  const [bibles, setBibles] = useState<BibleSummary[]>([]);
  const [versionsStatus, setVersionsStatus] = useState<"loading" | "ready" | "error">("loading");
  const [dataMessage, setDataMessage] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/bible/bibles", { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<BibleSummary[]>;
        if (!response.ok || !payload.data) throw new Error(payload.error || "No se pudieron cargar las versiones.");
        setBibles(payload.data);
        setVersionsStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setVersionsStatus("error");
      });
    return () => controller.abort();
  }, []);

  function exportBackup() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      completedByStudy,
      bookmarks,
      notes,
      lastReading,
      preferences,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `academia-biblica-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setDataMessage("Respaldo descargado correctamente.");
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 2_000_000) {
      setDataMessage("El archivo supera el límite seguro de 2 MB.");
      return;
    }
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      if (!restoreWorkspace(parsed)) {
        setDataMessage("El archivo no contiene un respaldo válido de Academia Bíblica.");
        return;
      }
      setConfirmClear(false);
      setDataMessage("Respaldo restaurado. Tus ajustes y datos ya están activos.");
    } catch {
      setDataMessage("No se pudo leer el archivo. Selecciona un respaldo JSON válido.");
    }
  }

  function handleClearStudyData() {
    if (!confirmClear) {
      setConfirmClear(true);
      setDataMessage("Confirma una vez más para borrar progreso, guardados y notas.");
      return;
    }
    clearStudyData();
    setConfirmClear(false);
    setDataMessage("Los datos de estudio se eliminaron. La apariencia se conservó.");
  }

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
        id="apariencia"
        aria-labelledby="palette-heading"
        className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-7"
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

      <section id="lectura" aria-labelledby="reading-heading" className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Type aria-hidden="true" className="size-5" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-emphasis">Lectura</p>
            <h2 id="reading-heading" className="mt-1 font-serif text-2xl font-semibold">Comodidad tipográfica</h2>
            <p className="mt-1 max-w-2xl leading-7 text-muted-foreground">Ajusta únicamente el texto bíblico y el análisis; los controles mantienen su tamaño accesible.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <fieldset>
            <legend className="flex items-center gap-2 font-semibold"><Type aria-hidden="true" className="size-4 text-primary" /> Tamaño del texto</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {readingScaleOptions.map((option) => (
                <button key={option.id} type="button" disabled={!hydrated} aria-pressed={preferences.readingScale === option.id} onClick={() => setReadingScale(option.id)} className={"min-h-20 rounded-xl border px-3 text-center focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 " + (preferences.readingScale === option.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/45")}>
                  <span className="block text-xl font-semibold">{option.sample}</span>
                  <span className="mt-1 block text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="flex items-center gap-2 font-semibold"><AlignJustify aria-hidden="true" className="size-4 text-primary" /> Interlineado</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {lineHeightOptions.map((option) => (
                <button key={option.id} type="button" disabled={!hydrated} aria-pressed={preferences.readingLineHeight === option.id} onClick={() => setReadingLineHeight(option.id)} className={"min-h-20 rounded-xl border p-3 text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 " + (preferences.readingLineHeight === option.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/45")}>
                  <span className="block font-semibold">{option.label}</span>
                  <span className="mt-1 block text-xs leading-5">{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="flex items-center gap-2 font-semibold"><Columns3 aria-hidden="true" className="size-4 text-primary" /> Ancho de lectura</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {widthOptions.map((option) => (
                <button key={option.id} type="button" disabled={!hydrated} aria-pressed={preferences.readingWidth === option.id} onClick={() => setReadingWidth(option.id)} className={"min-h-20 rounded-xl border p-3 text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 " + (preferences.readingWidth === option.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/45")}>
                  <span className="block font-semibold">{option.label}</span>
                  <span className="mt-1 block text-xs leading-5">{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="flex items-center gap-2 font-semibold"><BookOpen aria-hidden="true" className="size-4 text-primary" /> Tipografía</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {fontOptions.map((option) => (
                <button key={option.id} type="button" disabled={!hydrated} aria-pressed={preferences.readingFont === option.id} onClick={() => setReadingFont(option.id)} className={"min-h-20 rounded-xl border p-3 text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 " + (preferences.readingFont === option.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/45")}>
                  <span className={option.id === "serif" ? "block font-serif text-lg font-semibold" : "block font-semibold"}>{option.label}</span>
                  <span className="mt-1 block text-xs leading-5">{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-emphasis">Vista previa de lectura</p>
          <article data-reading-scale={preferences.readingScale} className="mt-3">
            <p className="api-scripture-content">En el principio, Dios creó los cielos y la tierra.</p>
          </article>
          <button type="button" disabled={!hydrated} onClick={resetReading} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-50">
            <RotateCcw aria-hidden="true" className="size-4" /> Restablecer lectura
          </button>
        </div>
      </section>

      <section id="preferencias" aria-labelledby="preferences-heading" className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><History aria-hidden="true" className="size-5" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-emphasis">Preferencias</p>
            <h2 id="preferences-heading" className="mt-1 font-serif text-2xl font-semibold">Continuidad del estudio</h2>
            <p className="mt-1 leading-7 text-muted-foreground">Decide cómo quieres retomar cada sesión.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <SettingSwitch checked={preferences.rememberLastReading} disabled={!hydrated} label="Recordar la última lectura" description="Al volver, abre automáticamente la versión, libro y capítulo donde terminaste." onChange={() => setRememberLastReading(!preferences.rememberLastReading)} />
          <div className="rounded-xl border border-border bg-background p-4">
            <label htmlFor="default-bible" className="font-semibold text-foreground">Versión bíblica predeterminada</label>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Se usa cuando un enlace no especifica una versión.</p>
            <select id="default-bible" value={preferences.defaultBibleId} disabled={!hydrated || versionsStatus === "loading"} onChange={(event) => setDefaultBibleId(event.target.value)} className="mt-3 min-h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-60">
              <option value="">Automática · primera versión disponible</option>
              {preferences.defaultBibleId && !bibles.some((bible) => bible.id === preferences.defaultBibleId) && <option value={preferences.defaultBibleId}>Versión guardada · no disponible ahora</option>}
              {bibles.map((bible) => <option key={bible.id} value={bible.id}>{bible.abbreviation} · {bible.name}</option>)}
            </select>
            <p className="mt-2 text-xs leading-5 text-muted-foreground" role="status">
              {versionsStatus === "loading" && "Cargando versiones habilitadas…"}
              {versionsStatus === "ready" && `${bibles.length} versiones disponibles en API.Bible.`}
              {versionsStatus === "error" && "No fue posible consultar las versiones. Puedes intentarlo más tarde."}
            </p>
          </div>
        </div>
      </section>

      <section id="accesibilidad" aria-labelledby="accessibility-heading" className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Accessibility aria-hidden="true" className="size-5" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-emphasis">Accesibilidad</p>
            <h2 id="accessibility-heading" className="mt-1 font-serif text-2xl font-semibold">Movimiento y legibilidad</h2>
            <p className="mt-1 leading-7 text-muted-foreground">Preferencias adicionales que respetan tu comodidad.</p>
          </div>
        </div>
        <div className="mt-6">
          <SettingSwitch checked={preferences.reduceMotion} disabled={!hydrated} label="Reducir animaciones" description="Desactiva desplazamientos suaves y minimiza transiciones en toda la aplicación." onChange={toggleReduceMotion} />
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-muted/35 p-4">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm leading-6 text-muted-foreground">Los controles conservan objetivos táctiles amplios, foco visible y etiquetas compatibles con lectores de pantalla.</p>
        </div>
      </section>

      <section id="datos" aria-labelledby="data-heading" className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><Database aria-hidden="true" className="size-5" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-emphasis">Datos y privacidad</p>
            <h2 id="data-heading" className="mt-1 font-serif text-2xl font-semibold">Tu espacio, bajo tu control</h2>
            <p className="mt-1 max-w-2xl leading-7 text-muted-foreground">El progreso, los guardados, las notas y las preferencias permanecen en este dispositivo.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-4"><span className="text-2xl font-semibold tabular-nums">{bookmarks.length}</span><p className="mt-1 text-sm text-muted-foreground">versículos guardados</p></div>
          <div className="rounded-xl border border-border bg-background p-4"><span className="text-2xl font-semibold tabular-nums">{Object.keys(notes).filter((key) => notes[key].trim()).length}</span><p className="mt-1 text-sm text-muted-foreground">notas privadas</p></div>
          <div className="rounded-xl border border-border bg-background p-4"><span className="text-2xl font-semibold tabular-nums">{Object.values(completedByStudy).reduce((total, verses) => total + verses.length, 0)}</span><p className="mt-1 text-sm text-muted-foreground">versículos completados</p></div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <button type="button" disabled={!hydrated} onClick={exportBackup} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 font-semibold hover:border-primary/45 hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-50"><Download aria-hidden="true" className="size-4" /> Exportar respaldo</button>
          <button type="button" disabled={!hydrated} onClick={() => fileInputRef.current?.click()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 font-semibold hover:border-primary/45 hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-50"><Upload aria-hidden="true" className="size-4" /> Importar respaldo</button>
          <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={importBackup} className="sr-only" aria-label="Seleccionar respaldo de Academia Bíblica" />
          <button type="button" disabled={!hydrated} onClick={handleClearStudyData} onBlur={() => setConfirmClear(false)} className={"inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 font-semibold focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-50 " + (confirmClear ? "border-destructive bg-destructive text-white" : "border-border bg-background text-foreground hover:border-destructive/50")}>
            <RotateCcw aria-hidden="true" className="size-4" />{confirmClear ? "Confirmar eliminación" : "Borrar datos de estudio"}
          </button>
        </div>
        <p className="mt-4 min-h-6 text-sm leading-6 text-muted-foreground" role="status" aria-live="polite">{dataMessage}</p>
      </section>
    </div>
  );
}
