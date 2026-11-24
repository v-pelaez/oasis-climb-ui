# OasisClimb UI: case study

Refactor of a fictional climbing-community landing page (Vue 3) from a Bootstrap prototype into a typed, tested, bilingual SPA.
Demo: <https://v-pelaez.github.io/oasis-climb-ui/> · Code: <https://github.com/v-pelaez/oasis-climb-ui>.
Numbers come from `docs/metrics-baseline.md` (same method before and after, measured on the same machine).

## English

### Problem

The starting point (commit `4dd4a19`) looked finished but was not maintainable:

- About 1,500 lines in 9 components, and no TypeScript in the SFCs although the README said so.
- Bootstrap was loaded twice (SCSS and `coreui.min.css`): 69.7 kB of gzipped CSS for one landing page.
- The brand yellow `#f8c52d` was hard-coded in more than 10 places; some ids were duplicated.
- The particles canvas had a bug (`canvas.height` instead of `canvas.value.height`, no `requestAnimationFrame` cancel); the hero carousel ran on timers.
- Font Awesome icons were used but never installed, so they were invisible; emoji flags do not render on Windows.
- 13 lint errors, no tests, no CI, 55.4 MB of images and video, Spanish only.

### Process

We worked in small tickets, each on its own branch and merged into one epic, with the checks (lint, type-check, tests, build) green at every step:

1. Baseline: measured the untouched commit with a documented method, so the final numbers are comparable.
2. Tooling: SFCs to TypeScript, typed content data, Vitest and CI.
3. Own styles and layout without Bootstrap; then news and ranking, route form, hero carousel and about section rebuilt one at a time.
4. Bootstrap and CoreUI removed, with a test that fails if their packages or classes come back.
5. i18n, search and media optimisation; a contrast and hero-video fix after reviewing against the style guide.
6. Final measurement and this write-up.

History note: the original interface was a static Bootstrap page migrated to Vue; Bootstrap and CoreUI no longer exist in the project.

### Decisions

**1. No CSS framework: Sass tokens + Reka UI.** One `tokens.scss` holds every brand value as `--oc-*` custom properties (a test enforces that the yellow is written only there), plus a small base, mixins and scoped component styles. Behaviour that is hard to get right (dialog, popover, tooltip, tabs, combobox) comes from Reka UI, which is unstyled and accessible.
- Discarded: Tailwind v4 + Reka UI. It would also remove Bootstrap, but a design this small with a fixed style guide gains little from utility classes, and it would put the design values in markup instead of one file.
- Discarded: everything by hand. Focus trapping, keyboard navigation and ARIA for five widgets is where hand-rolled code breaks.
- Trade-off: Reka UI and own styles cost JavaScript (see Result).

**2. i18n by detection, with a button and no flags.** `vue-i18n` (Composition API), Spanish and English. The language is the saved choice, else the first browser language that is `es` or `en`, else English; `<html lang>`, title and meta description follow. The switch is a button that names the other language in that language. Dates, countries and numbers use `Intl`. A test checks both locale files have the same keys.
- Discarded: URL-based locales (`/es`, `/en`). It is a single-page demo, not worth the routing and SEO surface.
- Discarded: flags for languages (a flag is a country, not a language). Ranking countries do use inline SVG flags, because Chrome and Edge on Windows do not draw emoji flags.

**3. Client-side search.** A pure index of news, both rankings and sections in the active language, accent and case insensitive, minimum 2 characters, at most 8 results. It is a Reka UI Combobox; choosing a result opens the right ranking tab, scrolls to the target and outlines it for about 2 seconds.
- Discarded: a search service or library. The content is a few dozen static items; an index is about one file and adds no dependency.

**4. Carousel chained by `ended` instead of timers.** Before: a `setInterval` of 6 s with a loop, which cut videos mid-play. Now each video plays to its end, the next one fades in, progress comes from the video's own `timeupdate`, there is a pause button, only the active and next videos are loaded, and it respects `prefers-reduced-motion`. A real bug found along the way: the fading video kept `data-active`, so the finished video was replayed; videos are now looked up by slide index.
- Discarded: keeping timers and tuning the interval. Durations differ per video, so any fixed interval is wrong for some of them.

**5. Optimised media.** Videos: VP8 to VP9, two-pass ffmpeg, crf 34-38, audio removed except in the about video (Opus 64 kbps); one video drops to 720p because 1080p did not fit the budget. Images: WebP quality 80, thumbnails up to 800 px and headers up to 1920 px (one source was 6720x4480), explicit `width`/`height`, lazy loading below the fold. Scripts are in `scripts/` so it is reproducible. Media went from 55.4 MB to 13.9 MB.
- Discarded: AV1 (slower to encode, weaker support at the time) and an image CDN (no infrastructure for a demo).

**6. Tests and CI.** 117 Vitest tests (components, composables, data, locale parity, a guard against Bootstrap coming back, docs checks) and a GitHub Actions workflow running lint, type-check, tests and build on pull requests. Lint is strict (`--max-warnings 0`).
- Discarded: end-to-end tests for now; unit and component tests cover the logic, and the cost of a browser pipeline was not justified for this size.

**Differences applied from the style guide** (`docs/style-guide.pdf`), as seen in the git history:
- Light surfaces are no longer pure white: `--oc-page` is `#e9ebec` and a new `--oc-surface` (`#f3f4f4`) is used on cards, tables, inputs and popovers.
- The secondary and placeholder gray was darkened to keep AA contrast on that surface.
- The logo is imported through Vite and has explicit dimensions (120x57 in the header).
- Pagination, subscribe and the unavailable links open a popover on click (Reka UI Popover) instead of navigating or doing nothing.
- Countries are written with `Intl.DisplayNames` in the active language (for example «Chequia» in Spanish) and drawn with SVG flags.
- A language button in the header, and a search field with results.
- Dark route-form inputs with a yellow focus border; the hero carousel with pause and progress.

### Result

| Metric | Before | After |
| --- | ---: | ---: |
| JS, gzip | 79.29 kB | 116.07 kB |
| CSS, gzip | 69.71 kB | 6.30 kB |
| `dist/` | 56.2 MB | 14.3 MB |
| Media in `dist/assets` | 55.4 MB | 13.9 MB |
| Production dependencies | 9 | 5 |
| Tests | 0 | 117 |
| Lighthouse mobile, Performance | 92 | 86 |
| Lighthouse mobile, Accessibility | 81 | 100 |
| Lighthouse mobile, Best Practices | 100 | 100 |
| Lighthouse mobile, SEO | 82 | 100 |

Lighthouse 12.8.2, mobile profile, headless Edge against `npm run preview`; the baseline was one run, the final Performance score is the median of three (86, 86, 83).

What did not improve: JavaScript grew by about 37 kB gzipped because `vue-i18n` and Reka UI were added. Lighthouse Performance went down six points (LCP 2.8 s to 3.5 s, TBT 90 ms to 130 ms), even though the page transfers 4.9 MB instead of 14.9 MB: the hero video now arrives a bit later than in the old build and there is more JavaScript to run. We accepted that for accessibility, i18n and search; the next steps would be to lazy-load the combobox and the second locale, and to serve a smaller first video.

## Español

### Problem

El punto de partida (commit `4dd4a19`) parecía terminado, pero no se podía mantener:

- Unas 1.500 líneas en 9 componentes y sin TypeScript en los SFC, aunque el README decía lo contrario.
- Bootstrap se cargaba dos veces (SCSS y `coreui.min.css`): 69,7 kB de CSS en gzip para una sola página.
- El amarillo de marca `#f8c52d` estaba escrito a mano en más de 10 sitios; había ids duplicados.
- El canvas de partículas tenía un fallo (`canvas.height` en lugar de `canvas.value.height`, sin cancelar el `requestAnimationFrame`); el carrusel de la portada funcionaba con temporizadores.
- Los iconos de Font Awesome se usaban sin estar instalados, así que no se veían; las banderas emoji no se dibujan en Windows.
- 13 errores de lint, sin tests ni CI, 55,4 MB de imágenes y vídeo y solo en español.

### Process

Trabajamos en tickets pequeños, cada uno en su rama y fusionado en una rama de épica, con las comprobaciones (lint, tipos, tests, build) en verde en cada paso:

1. Línea base: medimos el commit original con un método documentado, para que las cifras finales sean comparables.
2. Herramientas: SFC a TypeScript, datos de contenido tipados, Vitest y CI.
3. Estilos y maquetación propios sin Bootstrap; después noticias y ranking, formulario de ruta, carrusel de portada y «Sobre nosotros», uno a uno.
4. Bootstrap y CoreUI eliminados, con un test que falla si vuelven sus paquetes o sus clases.
5. i18n, búsqueda y optimización de medios; una corrección de contraste y del carrusel tras revisar con la guía de estilos.
6. Medición final y este documento.

Nota histórica: la interfaz original era una página estática con Bootstrap migrada a Vue; Bootstrap y CoreUI ya no existen en el proyecto.

### Decisions

**1. Sin framework CSS: tokens Sass + Reka UI.** Un único `tokens.scss` guarda todos los valores de marca como propiedades `--oc-*` (un test exige que el amarillo solo se escriba ahí), más una base pequeña, mixins y estilos de componente con scope. Lo difícil de hacer bien (diálogo, popover, tooltip, pestañas, combobox) viene de Reka UI, que no trae estilos y es accesible.
- Descartado: Tailwind v4 + Reka UI. También quitaría Bootstrap, pero con un diseño tan pequeño y una guía de estilos fija las utilidades aportan poco, y los valores de diseño acabarían en el marcado en lugar de en un archivo.
- Descartado: todo a mano. Atrapar el foco, el teclado y ARIA de cinco widgets es donde falla el código hecho a mano.
- Coste: Reka UI y los estilos propios suman JavaScript (ver Result).

**2. i18n por detección, con botón y sin banderas.** `vue-i18n` (Composition API), español e inglés. El idioma es la elección guardada, si no el primer idioma del navegador que sea `es` o `en`, si no inglés; `<html lang>`, título y meta descripción lo siguen. El cambio es un botón que nombra el otro idioma en ese idioma. Fechas, países y números usan `Intl`. Un test comprueba que ambos ficheros tienen las mismas claves.
- Descartado: idioma en la URL (`/es`, `/en`). Es una demo de una sola página y no compensa el enrutado ni la superficie de SEO.
- Descartado: banderas para los idiomas (una bandera es un país, no un idioma). Los países del ranking sí usan banderas SVG en línea, porque Chrome y Edge en Windows no dibujan las banderas emoji.

**3. Buscador en cliente.** Un índice puro de noticias, los dos rankings y las secciones en el idioma activo, sin distinguir tildes ni mayúsculas, mínimo 2 caracteres y como máximo 8 resultados. Es un Combobox de Reka UI; al elegir un resultado se abre la pestaña de ranking correcta, se hace scroll al destino y se resalta unos 2 segundos.
- Descartado: un servicio o librería de búsqueda. El contenido son unas decenas de elementos estáticos; el índice es un archivo y no añade dependencias.

**4. Carrusel encadenado por `ended`, no por temporizadores.** Antes: un `setInterval` de 6 s con bucle, que cortaba los vídeos a medias. Ahora cada vídeo se reproduce hasta el final, el siguiente aparece con fundido, el progreso sale del `timeupdate` del propio vídeo, hay botón de pausa, solo se cargan el vídeo activo y el siguiente, y respeta `prefers-reduced-motion`. Un fallo real que encontramos: el vídeo que se desvanecía conservaba `data-active`, así que se repetía el terminado; ahora se busca por índice de diapositiva.
- Descartado: mantener temporizadores y afinar el intervalo. Cada vídeo dura distinto, así que cualquier intervalo fijo falla en alguno.

**5. Medios optimizados.** Vídeos: de VP8 a VP9, ffmpeg en dos pasadas, crf 34-38, sin audio salvo en el vídeo de «Sobre nosotros» (Opus 64 kbps); uno baja a 720p porque en 1080p no cabía en el presupuesto. Imágenes: WebP calidad 80, miniaturas de hasta 800 px y cabeceras de hasta 1920 px (una fuente era de 6720x4480), `width`/`height` explícitos y carga diferida bajo el pliegue. Los scripts están en `scripts/`, así que es reproducible. Los medios pasaron de 55,4 MB a 13,9 MB.
- Descartado: AV1 (codifica más lento y tenía menos soporte entonces) y un CDN de imágenes (no hay infraestructura para una demo).

**6. Tests y CI.** 117 tests de Vitest (componentes, composables, datos, paridad de idiomas, una guarda contra el regreso de Bootstrap, comprobaciones de los documentos) y un workflow de GitHub Actions que ejecuta lint, tipos, tests y build en las pull requests. El lint es estricto (`--max-warnings 0`).
- Descartado: tests end-to-end por ahora; los tests unitarios y de componentes cubren la lógica y una pipeline con navegador no compensaba en este tamaño.

**Diferencias aplicadas de la guía de estilos** (`docs/style-guide.pdf`), según el historial de git:
- Las superficies claras ya no son blanco puro: `--oc-page` es `#e9ebec` y un nuevo `--oc-surface` (`#f3f4f4`) se usa en tarjetas, tablas, campos y popovers.
- El gris secundario y el de los placeholders se oscureció para mantener contraste AA sobre esa superficie.
- El logo se importa con Vite y tiene dimensiones explícitas (120x57 en la cabecera).
- La paginación, la suscripción y los enlaces no disponibles abren un popover al hacer clic (Reka UI Popover) en lugar de navegar o no hacer nada.
- Los países se escriben con `Intl.DisplayNames` en el idioma activo (por ejemplo «Chequia» en español) y se dibujan con banderas SVG.
- Botón de idioma en la cabecera y campo de búsqueda con resultados.
- Campos oscuros del formulario de ruta con borde amarillo al enfocar; carrusel de portada con pausa y progreso.

### Result

| Métrica | Antes | Después |
| --- | ---: | ---: |
| JS, gzip | 79,29 kB | 116,07 kB |
| CSS, gzip | 69,71 kB | 6,30 kB |
| `dist/` | 56,2 MB | 14,3 MB |
| Medios en `dist/assets` | 55,4 MB | 13,9 MB |
| Dependencias de producción | 9 | 5 |
| Tests | 0 | 117 |
| Lighthouse móvil, Performance | 92 | 86 |
| Lighthouse móvil, Accessibility | 81 | 100 |
| Lighthouse móvil, Best Practices | 100 | 100 |
| Lighthouse móvil, SEO | 82 | 100 |

Lighthouse 12.8.2, perfil móvil, Edge headless contra `npm run preview`; la línea base fue una sola ejecución y la puntuación final de Performance es la mediana de tres (86, 86, 83).

Lo que no mejoró: el JavaScript creció unos 37 kB en gzip porque se añadieron `vue-i18n` y Reka UI. La puntuación de Performance de Lighthouse bajó seis puntos (LCP de 2,8 s a 3,5 s, TBT de 90 ms a 130 ms) aunque la página transfiere 4,9 MB en lugar de 14,9 MB: el vídeo de portada llega algo más tarde que en la versión anterior y hay más JavaScript que ejecutar. Lo aceptamos a cambio de accesibilidad, i18n y búsqueda; los siguientes pasos serían cargar de forma diferida el combobox y el segundo idioma, y servir un primer vídeo más pequeño.

## Portfolio fields

Shape of `PortfolioProject` (`summary`, `context`, `decisions`, `challenges`; each text is `{ en, es }`).

```ts
summary: {
  en: 'Refactor of a climbing-community landing page from a Bootstrap prototype to a typed, tested, bilingual Vue 3 SPA: CSS 70 kB to 6 kB gzipped, media 55 MB to 14 MB, Lighthouse accessibility 81 to 100.',
  es: 'Refactor de una landing de comunidad de escalada de un prototipo con Bootstrap a una SPA Vue 3 tipada, con tests y bilingüe: CSS de 70 kB a 6 kB en gzip, medios de 55 MB a 14 MB, accesibilidad en Lighthouse de 81 a 100.',
},
context: {
  en: 'A fictional brand site built as a frontend showcase. The original loaded Bootstrap twice, had no TypeScript in its components, no tests or CI, 55 MB of media and a carousel on timers. The goal was to keep the look and make the code something a team could maintain.',
  es: 'Web de una marca ficticia hecha como escaparate de frontend. La original cargaba Bootstrap dos veces, no tenía TypeScript en los componentes, ni tests ni CI, tenía 55 MB de medios y un carrusel con temporizadores. El objetivo era mantener el aspecto y dejar un código que un equipo pueda mantener.',
},
decisions: [
  {
    title: {
      en: 'Sass tokens and Reka UI instead of a CSS framework',
      es: 'Tokens Sass y Reka UI en lugar de un framework CSS',
    },
    description: {
      en: 'All brand values live in one tokens file and components use scoped styles; dialogs, popovers, tabs and the search combobox come from unstyled, accessible Reka UI primitives. Tailwind v4 and hand-written widgets were discarded. The cost is more JavaScript (79 kB to 116 kB gzipped).',
      es: 'Todos los valores de marca viven en un único archivo de tokens y los componentes usan estilos con scope; diálogos, popovers, pestañas y el combobox del buscador salen de primitivas de Reka UI, accesibles y sin estilos. Se descartaron Tailwind v4 y los widgets hechos a mano. El coste es más JavaScript (de 79 kB a 116 kB en gzip).',
    },
  },
  {
    title: {
      en: 'Language detection with a button, and a client-side index for search',
      es: 'Detección de idioma con botón e índice en cliente para la búsqueda',
    },
    description: {
      en: 'vue-i18n picks the saved or browser language (Spanish or English), names the other language on the button and formats dates, countries and numbers with Intl. Search is a pure in-memory index over the static content, with no service or extra dependency.',
      es: 'vue-i18n elige el idioma guardado o el del navegador (español o inglés), el botón nombra el otro idioma y las fechas, países y números se formatean con Intl. La búsqueda es un índice puro en memoria sobre el contenido estático, sin servicio ni dependencias extra.',
    },
  },
  {
    title: {
      en: 'Event-driven hero carousel and optimised media',
      es: 'Carrusel de portada por eventos y medios optimizados',
    },
    description: {
      en: 'Each hero video advances on its own ended event instead of a 6 s timer, and loads only when it is next. Videos were re-encoded to two-pass VP9 and images to WebP, cutting media from 55.4 MB to 13.9 MB.',
      es: 'Cada vídeo de la portada avanza con su propio evento ended en lugar de un temporizador de 6 s y solo se carga cuando es el siguiente. Los vídeos se recodificaron a VP9 en dos pasadas y las imágenes a WebP, con lo que los medios pasan de 55,4 MB a 13,9 MB.',
    },
  },
],
challenges: [
  {
    en: 'Chrome and Edge on Windows do not draw emoji flags, so ranking countries use inline SVG flags and Intl.DisplayNames.',
    es: 'Chrome y Edge en Windows no dibujan las banderas emoji, así que los países del ranking usan banderas SVG en línea e Intl.DisplayNames.',
  },
  {
    en: 'Chaining videos by ended replayed a finished video while it was fading out; fixed by looking videos up by slide index.',
    es: 'Encadenar vídeos por ended repetía un vídeo terminado mientras se desvanecía; se corrigió buscando los vídeos por índice de diapositiva.',
  },
  {
    en: 'Lighthouse Performance went from 92 to 86 (LCP 2.8 s to 3.5 s) because of the extra JavaScript, while accessibility and SEO reached 100; lazy-loading the combobox and the second locale is the next step.',
    es: 'El Performance de Lighthouse pasó de 92 a 86 (LCP de 2,8 s a 3,5 s) por el JavaScript añadido, mientras accesibilidad y SEO llegaron a 100; cargar de forma diferida el combobox y el segundo idioma es el siguiente paso.',
  },
],
```
