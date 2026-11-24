# Métricas de línea base («antes»)

Estado del proyecto **antes** de cualquier cambio del epic RFP-15 (refactor + i18n), tomado para el case study.
El ticket final repetirá exactamente el mismo método para obtener las cifras «después».

- **Commit medido:** `4dd4a19` (`chore: ignore agora.json`), sin cambios locales.
- **Fecha:** 2026-11-23
- **Entorno:** Windows 11, Node 24.22.1, npm 11.19.1, Vite 7.3.x.

## Resultados

### Build (`npm run build`)

| Recurso | Raw | Gzip |
| --- | ---: | ---: |
| JS (`assets/index-*.js`) | 227.82 kB | 79.29 kB |
| CSS (`assets/index-*.css`) | 524.54 kB | 69.71 kB |
| `index.html` | 0.48 kB | 0.30 kB |

| Peso | Bytes | Aprox. |
| --- | ---: | ---: |
| `dist/` total | 56 208 631 | 53.6 MiB |
| Medios en `dist/assets` (jpg, png, webm, svg, otf) | 55 442 006 | 52.9 MiB |
| — de ellos imágenes + vídeo (jpg, png, webm) | 55 402 694 | 52.8 MiB |

Medios más pesados en `dist/assets`: `aboutus.webm` 28.0 MB, `aspira.webm` 7.0 MB, `construye.webm` 6.8 MB,
`logra.webm` 5.6 MB, `videoposter.png` 3.1 MB, `rappel.jpg` 2.4 MB.

### Repo

| Métrica | Valor |
| --- | ---: |
| Dependencias de producción (`dependencies` en `package.json`) | 9 |
| Peso de `src/assets` | 75 176 418 bytes (71.7 MiB) |

Las 9 dependencias: `@coreui/coreui`, `@coreui/icons`, `@coreui/icons-vue`, `@coreui/vue`, `bootstrap`,
`sass`, `sass-loader`, `vue`, `vue-router`.

### Lighthouse móvil

URL: `http://localhost:4173/oasis-climb-ui/` (servida con `npm run preview`). Lighthouse 12.8.2, perfil móvil por defecto
(emulación de Moto G Power, throttling simulado 4G lento), navegador Microsoft Edge 158 headless (no hay Chrome instalado
en el entorno; Edge es Chromium y chrome-launcher lo usa vía `CHROME_PATH`).

| Categoría | Puntuación |
| --- | ---: |
| Performance | 92 |
| Accessibility | 81 |
| Best Practices | 100 |
| SEO | 82 |

Métricas de Performance: FCP 2.3 s · LCP 2.8 s · TBT 90 ms · CLS 0 · Speed Index 2.9 s ·
peso total transferido 14 907 KiB.

> Nota: una sola ejecución en local; Lighthouse varía unos puntos entre ejecuciones. Para comparar, repetir en la misma
> máquina y, si hace falta, tomar la mediana de 3 ejecuciones.

## Después (RFP-26)

Mismo método que el de abajo, sobre el commit `0092911` (rama `ticket/final-metrics-case-study`, cambios locales ninguno), el 2026-11-24, misma máquina
(Windows 11, Node 24.22.1) y mismo Lighthouse 12.8.2 con Edge headless contra `npm run preview`.

| Métrica | Antes (`4dd4a19`) | Después (`0092911`) | Cambio |
| --- | ---: | ---: | ---: |
| JS gzip (`assets/index-*.js`) | 79.29 kB (raw 227.82 kB) | 116.07 kB (raw 342.66 kB) | +46 % |
| CSS gzip (`assets/index-*.css`) | 69.71 kB (raw 524.54 kB) | 6.30 kB (raw 31.04 kB) | -91 % |
| `index.html` gzip | 0.30 kB | 0.40 kB | |
| `dist/` total | 56 208 631 B (53.6 MiB) | 14 327 808 B (13.7 MiB) | -75 % |
| Medios en `dist/assets` (jpg, png, webp, webm, svg, otf, woff2) | 55 442 006 B | 13 939 654 B | -75 % |
| — imágenes + vídeo (jpg, png, webp, webm) | 55 402 694 B | 13 865 746 B | -75 % |
| Dependencias de producción | 9 | 5 | -4 |
| Peso de `src/assets` | 75 176 418 B (71.7 MiB) | 13 897 500 B (13.3 MiB) | -82 % |
| Tests | 0 | 117 | |

Las 5 dependencias: `@fontsource-variable/outfit`, `reka-ui`, `vue`, `vue-i18n`, `vue-router`.

### Lighthouse móvil (después)

| Categoría | Antes | Después |
| --- | ---: | ---: |
| Performance | 92 | 86 |
| Accessibility | 81 | 100 |
| Best Practices | 100 | 100 |
| SEO | 82 | 100 |

Métricas de Performance: FCP 2.3 s (antes 2.3 s) · LCP 3.5 s (2.8 s) · TBT 130 ms (90 ms) · CLS 0 (0) · Speed Index 3.0 s (2.9 s) ·
peso total transferido 4 895 KiB (14 907 KiB).

Performance se midió en 3 ejecuciones: 86, 86 y 83 (mediana 86; LCP 3.5-3.6 s, TBT 130-190 ms). La línea base fue una sola ejecución.
Performance baja porque el JS creció (vue-i18n y Reka UI) y el LCP (el vídeo de portada) llega algo más tarde; las otras tres categorías suben o se mantienen.

## Medios (RFP-23)

Peso (bytes) de cada fichero de `src/assets` antes y después de optimizar. Los originales ya no están en el repo.

| Fichero | Antes | Después | Notas |
| --- | ---: | ---: | --- |
| `aspira.webm` | 7 049 317 | 2 803 479 | VP8 1080p -> VP9 **720p**, crf 35, sin audio |
| `construye.webm` | 6 814 732 | 1 611 533 | VP8 -> VP9 1080p, crf 34, sin audio |
| `logra.webm` | 5 551 473 | 976 863 | VP8 -> VP9 1080p, crf 34, audio eliminado |
| `aboutus.webm` | 28 010 618 | 7 794 017 | VP8 -> VP9 1080p, crf 38, audio Opus 64 kbps |
| `rappel.jpg` -> `rappel.webp` | 2 372 247 | 184 662 | 1920x1280 (la fuente era 6720x4480) |
| `snowmountain.jpg` -> `.webp` | 277 644 | 96 532 | 1280x853 |
| `videoposter.png` -> `.webp` | 3 141 757 | 128 484 | 1280x720 |
| `thumbnails/climbing-2609319` | 824 559 | 86 666 | 800x439 |
| `thumbnails/free-climbing-4196577` | 672 667 | 93 508 | 800x551 |
| `thumbnails/mountain-climbing-1840220` | 127 642 | 58 494 | 800x533 |
| `thumbnails/mountaineer-396533` | 47 839 | 10 282 | 800x480 |
| `thumbnails/snow-8033482` | 403 960 | 21 226 | 800x534 |
| `thumbnails/mountain-8488489.jpg` | 108 239 | (eliminado) | no se usaba en ningún sitio |
| **Total** | **55 402 694** | **13 865 746** | -75 % |

- Todos los vídeos conservan duración y 25 fps, en `yuv420p` y con `<source type="video/webm">`.
- `aspira.webm` no cabe en 3 MB a 1080p con crf <= 38 (4,4 MB), así que se baja a 720p (crf 35); `construye` y `logra` caben en 1080p con crf 34.
- `aboutus.webm` a crf 34-36 pesa 8,4-9,4 MB (sin audio), por eso crf 38.
- Comandos exactos: `scripts/encode-videos.sh <carpeta-con-originales>` (ffmpeg, VP9 en dos pasadas) y `node scripts/optimize-images.mjs <carpeta-con-originales>` (`sharp`, WebP calidad 80, miniaturas <= 800 px y cabeceras <= 1920 px).
- Las imágenes llevan `width`/`height`; las que quedan bajo el pliegue (noticias, portada de «Sobre nosotros», cabecera del formulario) llevan `loading="lazy"` y `decoding="async"`.

## Método (repetir igual en el ticket final)

Todo desde la raíz del repo, en Git Bash, con el árbol de trabajo limpio en el commit a medir.

```bash
git rev-parse --short HEAD          # commit medido
git status --short                  # debe salir vacío

# 1. Build
npm ci
npm run build                       # anotar raw/gzip de index-*.js e index-*.css que imprime Vite

# 2. Pesos
du -sb dist                         # dist/ total
cd dist/assets && find . -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.webm' -o -name '*.webp' \
  -o -name '*.mp4' -o -name '*.avif' -o -name '*.svg' -o -name '*.otf' -o -name '*.woff*' \) -printf '%s\n' \
  | awk '{s+=$1} END{print s}'      # medios en dist/assets
cd ../..
du -sb src/assets                   # peso de src/assets

# 3. Dependencias de producción
node -e "console.log(Object.keys(require('./package.json').dependencies).length)"

# 4. Lighthouse móvil (en otra terminal: npm run preview)
export CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"   # solo si no hay Chrome
npx -y lighthouse@12.8.2 http://localhost:4173/oasis-climb-ui/ \
  --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=./lh.json --chrome-flags="--headless=new" --quiet
node -e "const r=require('./lh.json');for(const[k,v] of Object.entries(r.categories))console.log(k,Math.round(v.score*100))"
```

`lh.json` y `dist/` no se versionan; borrar `lh.json` al terminar.
