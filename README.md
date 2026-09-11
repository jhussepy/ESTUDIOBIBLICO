# Academia de Teología Bíblica

Plataforma web de estudio profundo de la Biblia, organizada de **Génesis a Apocalipsis** según el canon protestante de 66 libros.

El proyecto propone un recorrido versículo por versículo con cuatro capas de análisis:

- comparación responsable entre RVR1960, NTV y LBLA;
- exégesis apoyada en el contexto literario e histórico;
- observaciones de hebreo, arameo y griego bíblicos;
- síntesis teológica y conexiones canónicas.

## Estado actual

La experiencia interactiva ofrece lectura bíblica mediante API.Bible y estudios profundos de **Génesis 1–10**, con análisis individual de sus 267 versículos. Incluye:

- navegación por los 66 libros y sus capítulos;
- selector de versículos;
- paneles de lectura, exégesis, lenguas bíblicas, teología y conexiones canónicas;
- progreso de estudio por versículo durante la sesión;
- diseño adaptable, modo oscuro y navegación accesible por teclado.

El contenido completo de traducciones bíblicas con copyright no se distribuye en este repositorio. La lectura autorizada se solicita a API.Bible y el análisis editorial es contenido original; cualquier ampliación deberá respetar las licencias correspondientes.

## Tecnología

- React 19 y TypeScript
- Next.js 16 con App Router
- Tailwind CSS 4
- componentes accesibles basados en Base UI y shadcn
- despliegue optimizado para Vercel

## Desarrollo local

Requisitos:

- Node.js `22.x`
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
```

## Despliegue en Vercel

Importa este repositorio en Vercel y conserva el preset **Next.js**. No es necesario configurar manualmente el directorio de salida: `next build` genera la carpeta `.next` que Vercel detecta automáticamente.

## Visión editorial

El desarrollo del corpus seguirá el orden canónico, capítulo por capítulo, con trazabilidad de fuentes y separación clara entre:

1. texto bíblico;
2. datos lingüísticos e históricos;
3. interpretación exegética;
4. síntesis doctrinal;
5. aplicación pastoral.

---

**Proyecto en desarrollo.** La interfaz y Génesis 1:1–5 constituyen la base inicial para ampliar el estudio a toda la Biblia.
