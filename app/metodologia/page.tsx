import Link from "next/link";
import { ArrowLeft, BookOpenCheck, GitBranch, LibraryBig, Scale, ShieldCheck } from "lucide-react";

const principles = [
  {
    icon: BookOpenCheck,
    title: "El texto antes que la conclusión",
    text: "Cada estudio comienza con la unidad literaria, su contexto y la intención comunicativa antes de formular doctrina o aplicación.",
  },
  {
    icon: GitBranch,
    title: "Lectura dentro del canon",
    text: "Las conexiones bíblicas respetan el desarrollo progresivo de Génesis a Apocalipsis y distinguen explicación, tipología y aplicación.",
  },
  {
    icon: Scale,
    title: "Rigor con humildad",
    text: "Cuando existen interpretaciones cristianas responsables, el estudio identifica el debate y evita presentar una conclusión discutida como si fuera la única lectura posible.",
  },
  {
    icon: ShieldCheck,
    title: "Uso responsable de las versiones",
    text: "Los capítulos completos se consultan mediante API.Bible. Los resúmenes y comentarios editoriales no deben confundirse con el texto oficial de una traducción.",
  },
];

export default function MethodologyPage() {
  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> Volver al estudio
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground">Estándar editorial</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Cómo estudiamos la Biblia</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            La Academia Bíblica sigue un método exegético, canónico y pastoral. Su propósito es ayudar a comprender el texto con profundidad sin ocultar debates ni sustituir la comunidad de fe, la enseñanza pastoral o la investigación académica especializada.
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Principios de estudio">
          {principles.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </div>
              <h2 className="mt-5 font-serif text-2xl font-semibold">{title}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-8">
          <h2 className="font-serif text-3xl font-semibold">Las cinco etapas</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-5">
            {[
              ["01", "Texto", "Observar qué dice."],
              ["02", "Contexto", "Ubicar la unidad."],
              ["03", "Lenguas", "Examinar términos."],
              ["04", "Teología", "Integrar la doctrina."],
              ["05", "Aplicación", "Responder con fidelidad."],
            ].map(([number, title, text]) => (
              <li key={number} className="rounded-xl bg-muted/55 p-4">
                <span className="text-xs font-bold tracking-[0.12em] text-accent-foreground">{number}</span>
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 rounded-2xl border border-accent/35 bg-accent/9 p-5 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold">Transparencia del proyecto</h2>
          <p className="mt-3 max-w-[75ch] leading-7 text-muted-foreground">
            El contenido está en desarrollo progresivo y debe recibir revisión humana continua. Las observaciones de hebreo, arameo y griego apoyan la interpretación, pero ninguna doctrina se establece únicamente por una palabra aislada. Los errores identificados deben corregirse de forma documentada en GitHub.
          </p>
          <Link
            href="/fuentes"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
          >
            <LibraryBig aria-hidden="true" className="size-4" /> Consultar fuentes y estados editoriales
          </Link>
        </section>
      </div>
    </main>
  );
}
