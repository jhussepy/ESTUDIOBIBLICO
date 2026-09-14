# Arquitectura editorial y técnica

Este documento define la forma obligatoria de publicar nuevos capítulos sin degradar calidad, rendimiento ni trazabilidad.

## Capas

| Capa | Archivo | Responsabilidad |
|---|---|---|
| Catálogo ligero | `lib/study-catalog.ts` | Ruta, título, descripción, cantidad de versículos y fecha SEO |
| Contenido exegético | `lib/studies.ts` y módulos por rango | Texto de estudio versículo por versículo |
| Guía del capítulo | `lib/study-guides.ts` | Tesis, contexto, estructura, términos, aplicación y límites |
| Registro editorial | `lib/editorial.ts` | Estado, fecha, método, bibliografía y debates |
| Búsqueda | `lib/study-search.ts` | Índice normalizado de temas, referencias y lenguas bíblicas |
| Presentación | `app/page.tsx` | Interfaz y estado de navegación; no contiene doctrina |

Al crecer, cada libro debe usar su propio módulo de contenido, por ejemplo `lib/studies/genesis-11-20.ts`. El catálogo permanece pequeño para rutas, metadatos y mapa del sitio.

## Contrato mínimo por capítulo

Antes de publicar un capítulo debe existir:

- Una entrada única en el catálogo.
- Todos los versículos consecutivos, sin huecos ni duplicados.
- Título, resumen, exégesis y nota lingüística en cada versículo.
- Al menos tres puntos teológicos y tres conexiones canónicas.
- Una guía con tres secciones estructurales, tres términos clave, tres aplicaciones y tres preguntas.
- Un registro editorial con fecha válida, fuentes existentes, estado y nota de revisión.
- Un límite interpretativo explícito para temas discutidos.
- Pruebas actualizadas y el flujo de GitHub Actions en verde.

## Flujo editorial

1. Preparar el texto y delimitar unidades literarias.
2. Redactar exégesis desde el contexto inmediato.
3. Verificar hebreo, arameo o griego con fuentes identificadas.
4. Formular teología dentro del desarrollo canónico.
5. Distinguir dato textual, inferencia y postura debatida.
6. Añadir aplicaciones derivadas del sentido del pasaje.
7. Ejecutar `pnpm test`, `pnpm lint` y `pnpm build`.
8. Solicitar revisión humana especializada antes de cambiar el estado a `published`.

## Criterios de lenguaje

- No presentar una interpretación debatida como si fuera el texto mismo.
- No usar etimologías como sustituto del contexto.
- No introducir anacronismos geográficos, científicos o raciales.
- Diferenciar cita textual autorizada de paráfrasis de estudio.
- Mantener las traducciones protegidas detrás de la fuente autorizada API.Bible.
- Escribir para lectores no especialistas sin perder precisión académica.

## Definition of Done

Un capítulo está técnicamente terminado cuando las validaciones automáticas confirman alineación entre contenido, catálogo, guía y registro editorial. Está editorialmente publicado solo después de revisión humana competente; una compilación exitosa no reemplaza esa revisión.
