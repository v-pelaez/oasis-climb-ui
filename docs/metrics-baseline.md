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
