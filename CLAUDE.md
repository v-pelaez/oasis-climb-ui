# Oasis Climb UI

Single-page climbing site in Spanish and English.

## Stack

- Vue 3.5 (`<script setup lang="ts">` in every SFC) + Vue Router, Vite 7, TypeScript 5.9 (`vue-tsc`).
- Styling: own SCSS design system in `src/assets/styles/`: `tokens.scss` (CSS custom properties `--oc-*`; the only place for raw brand values such as `#f8c52d`), `base.scss` (reset, typography, LemonMilk `@font-face`), `mixins.scss` (`up`/`down` breakpoints, `reduced-motion`, `visually-hidden`; `@use '@/assets/styles/mixins' as *`). Outfit is self-hosted via `@fontsource-variable/outfit`; LemonMilk ships only `LEMONMILK-BoldItalic.woff2`. There is no CSS framework (Bootstrap/CoreUI were removed in RFP-22): component styles are scoped, and `src/__tests__/no-bootstrap.spec.ts` fails if their packages or classes come back. `sass` is a devDependency (Vite compiles SCSS without `sass-loader`).
- Components: layout in `src/components/layout/` (`SiteHeader`, `SiteFooter`, `ParticlesBackground`), primitives in `src/components/ui/` (`AppIcon`, `SectionBanner`, `NotAvailablePopover` on Reka UI (takes the translated `message`), `ScrollTop`, `LanguageToggle`, `CountryFlag` with inline SVG flags from `flags.ts`); page sections in `src/components/sections/` (`HeroCarousel`, `NewsSection`, `RankingSection`: Reka UI Tooltip/Tabs, the active ranking tab is a `v-model`, rows have ids `ranking-<tab>-<rank>`; `RouteFormSection`: own validation via `useRouteForm`, success dialog on Reka UI `Dialog`; `AboutSection`); composables in `src/composables/` (`useLocale`, `useScrollSpy`, `useScrollTop`, `useReducedMotion`, `useRouteForm`, `useCarousel`, `useParticles`). `validateRouteForm` returns locale keys, translated by the component.
- Media: no timers for slideshows (`useCarousel` advances on the video's `ended`, progress from `timeupdate`); `<source type>` must match the real file (the videos are WebM); add listeners by hand in composables and remove them on unmount. In tests, mock `HTMLMediaElement.prototype.play/pause` (jsdom has no playback).
- Content lives in `src/data/*.ts`, typed by `src/types/*.ts`; components should not hard-code content data.
- i18n: `vue-i18n` 11 with `legacy: false` (`src/i18n.ts`). Every visible text, `alt`, `aria-label`, placeholder and message goes in `src/locales/es.json` and `en.json` (same keys; `src/__tests__/locales.spec.ts` checks it); data files hold keys (`id`/`key`) and values, not copy; proper names (climbers, brands) stay literal. Dates, countries and numbers are formatted with `Intl` and the active `locale` (`formatRelativeDate`, `countryName`, `formatPoints`). Language detection, persistence (`localStorage['oasis-climb:locale']`) and `<html lang>`/title/meta live in `useLocale`.
- Lint: ESLint 9 flat config (`eslint-plugin-vue` `flat/recommended` + `@vue/eslint-config-typescript`), Prettier for formatting.
- Tests: Vitest + `@vue/test-utils` + jsdom, in `src/**/__tests__/*.spec.ts` (type-checked via `tsconfig.vitest.json`). `src/__tests__/setup.ts` installs i18n on every mount, in Spanish with empty `localStorage` before each test; set `testI18n.global.locale.value = 'en'` to test English.

## Setup

```sh
npm ci
npm run dev
```

## Checks

Run before committing (CI runs the same on PRs to `main` and `dev`, see `.github/workflows/ci.yml`):

```sh
npm run lint:check && npm run type-check && npm run test && npm run build-only
```

`npm run lint` applies `--fix`; `lint:check` does not and fails on warnings.

Run a subset of tests: `npx vitest run <path>` (e.g. `npx vitest run src/data`).

## Branches and deploy

- Work goes through `dev` (feature branches -> PR to `dev`); `dev` is merged into `main`.
- Pushes to `main` deploy to GitHub Pages (`.github/workflows/jekyll-gh-pages.yml`) under base `/oasis-climb-ui/` (`vite.config.ts`).

## Local files

`agora.json` is local and gitignored: never commit it.
