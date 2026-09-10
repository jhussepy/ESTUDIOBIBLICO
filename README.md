# Academia de Teología Bíblica

Plataforma web de estudio profundo de la Biblia, organizada de **Génesis a Apocalipsis** según el canon protestante de 66 libros.

El proyecto propone un recorrido versículo por versículo con cuatro capas de análisis:

- comparación responsable entre RVR1960, NTV y LBLA;
- exégesis apoyada en el contexto literario e histórico;
- observaciones de hebreo, arameo y griego bíblicos;
- síntesis teológica y conexiones canónicas.

## Estado actual

La primera experiencia interactiva cubre **Génesis 1:1–5** e incluye:

- navegación por los 66 libros y sus capítulos;
- selector de versículos;
- paneles de texto comparado, exégesis, teología y conexiones;
- progreso de estudio por versículo durante la sesión;
- diseño adaptable, modo oscuro y navegación accesible por teclado.

El contenido completo de traducciones bíblicas con copyright no se distribuye en este repositorio. Las citas breves y comparaciones se presentan con fines de estudio; cualquier ampliación deberá respetar las licencias correspondientes.

## Tecnología

- React 19 y TypeScript
- Next.js 16 sobre Vinext/Vite
- Tailwind CSS 4
- componentes accesibles basados en Base UI y shadcn
- Cloudflare Workers para ejecución y alojamiento

## Desarrollo local

Requisitos:

- Node.js `>=22.13.0`
- pnpm `11.19.0`

```bash
pnpm install
pnpm dev
```

Comandos principales:

```bash
pnpm lint
pnpm build
pnpm start
```

## Estructura principal

```text
app/             interfaz y estilos globales
components/ui/   componentes reutilizables
design-system/   decisiones visuales del producto
public/          recursos públicos
scripts/         instalación, compilación y ejecución
```

## Visión editorial

El desarrollo del corpus seguirá el orden canónico, capítulo por capítulo, con trazabilidad de fuentes y separación clara entre:

1. texto bíblico;
2. datos lingüísticos e históricos;
3. interpretación exegética;
4. síntesis doctrinal;
5. aplicación pastoral.

---

**Proyecto en desarrollo.** La interfaz y Génesis 1:1–5 constituyen la base inicial para ampliar el estudio a toda la Biblia.
