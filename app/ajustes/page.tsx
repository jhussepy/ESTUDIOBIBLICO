import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

import { AppearanceSettings } from "@/components/appearance-settings";

export const metadata: Metadata = {
  title: "Ajustes de apariencia",
  description:
    "Personaliza la paleta de colores, la iluminación y el contraste de la Academia Bíblica.",
  alternates: { canonical: "/ajustes" },
  openGraph: {
    title: "Ajustes de apariencia",
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
              Ajustes de apariencia
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Adapta la Academia Bíblica a tu forma de estudiar. Los cambios se muestran al instante y no modifican el contenido bíblico.
            </p>
          </div>
        </header>

        <div className="mt-8">
          <AppearanceSettings />
        </div>
      </div>
    </main>
  );
}
