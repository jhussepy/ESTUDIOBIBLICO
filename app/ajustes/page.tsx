import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

import { AppearanceSettings } from "@/components/appearance-settings";

export const metadata: Metadata = {
  title: "Centro de ajustes",
  description:
    "Personaliza la lectura, apariencia, accesibilidad, continuidad y datos de la Academia Bíblica.",
  alternates: { canonical: "/ajustes" },
  openGraph: {
    title: "Centro de ajustes",
    description:
      "Configura una experiencia de lectura bíblica cómoda y accesible.",
    url: "/ajustes",
  },
};

export default function SettingsPage() {
  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver al estudio
        </Link>

        <header className="mt-8 grid gap-5 border-b border-border pb-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
          <div className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Settings aria-hidden="true" className="size-6" />
          </div>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-emphasis">
              Preferencias personales
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Centro de ajustes
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Configura una experiencia de estudio cómoda, accesible y coherente. Los cambios se guardan en este dispositivo y se aplican al instante.
            </p>
          </div>
        </header>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <nav
            aria-label="Secciones de ajustes"
            className="sticky top-0 z-20 -mx-4 overflow-x-auto border-y border-border bg-background/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-6 lg:mx-0 lg:rounded-2xl lg:border lg:bg-card lg:p-3"
          >
            <p className="hidden px-3 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:block">
              Configuración
            </p>
            <div className="flex min-w-max gap-1 lg:min-w-0 lg:flex-col">
              {[
                ["apariencia", "Apariencia"],
                ["lectura", "Lectura"],
                ["preferencias", "Preferencias"],
                ["accesibilidad", "Accesibilidad"],
                ["datos", "Datos y privacidad"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
          <div className="min-w-0">
            <AppearanceSettings />
          </div>
        </div>
      </div>
    </main>
  );
}
