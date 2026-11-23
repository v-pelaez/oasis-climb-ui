# OasisClimb — Frontend Web Application

Responsive single-page application designed for **OasisClimb**, a fictional climbing community brand built as a comprehensive frontend showcase.


Live Demo: **[v-pelaez.github.io/oasis-climb-ui](https://v-pelaez.github.io/oasis-climb-ui/)**

![OasisClimb — Desktop Preview](./docs/preview.png)

## Overview

Originally developed as a static Bootstrap interface, this project was migrated to a modular **Vue 3 + TypeScript** SPA to apply component-based architecture, client-side routing, and automated code quality tooling while preserving a cohesive visual identity.

## Key Features

- **SPA architecture & routing:** Multi-view client-side navigation structured with Vue Router 4.
- **Rich media integration:** Hero of chained videos (each plays to its end, then the next fades in; progress bar from the video's own time, pause button, only the active and next video are loaded) and an embedded video section.
- **Interactive UI & forms:** Client-side form validation, tooltips, tabs and dialogs built on accessible Reka UI primitives.
- **Data presentation:** Ranking tables with client-side pagination backed by static mock datasets.
- **Custom visual effects:** Canvas animated background (`devicePixelRatio`-aware, static with `prefers-reduced-motion`) and animated SVG elements combined with custom Sass styling.

## Tech Stack

- **Framework & Build:** Vue 3 (`^3.5.26`) · Vue Router 4 (`^4.6.4`) · Vite 7 (`^7.3.1`)
- **Language & Type Checking:** TypeScript (`~5.9.3`) · `vue-tsc`
- **UI & Styling:** Sass design tokens and own layout components · Reka UI (accessible primitives) · self-hosted Outfit and LemonMilk fonts
- **i18n:** vue-i18n 11 (Composition API), Spanish and English
- **Code Quality:** ESLint 9 · Prettier 3 · Vitest (`@vue/test-utils`, jsdom) · GitHub Actions CI

## Internationalisation

The site is in Spanish and English (`vue-i18n`, `legacy: false`, set up in `src/i18n.ts`).

- **Messages:** `src/locales/es.json` and `src/locales/en.json`, with the same keys (a test checks it). Every visible text, `alt`, `aria-label`, placeholder, popover and validation message lives there; `src/data/*.ts` keeps only keys, media and values (climber names are not translated).
- **Initial language** (`src/composables/useLocale.ts`): the saved choice (`localStorage['oasis-climb:locale']`), else the first browser language that is `es` or `en`, else English. Changing it saves the choice and updates `<html lang>`, the title and the meta description.
- **Language button** (`LanguageToggle`): names the other language in that language («English» / «Español»); below 400 px only a globe and the code.
- **Formatting:** news dates (`Intl.RelativeTimeFormat`), countries (`Intl.DisplayNames`) and ranking points (`Intl.NumberFormat`) follow the active language. Ranking flags are inline SVG (`CountryFlag`), since Chrome/Edge on Windows do not draw emoji flags.

## Local Development

### Prerequisites

- Node.js `^22.12.0` or `>=24` (Node LTS recommended; Vitest needs it)
- npm

### Setup

```bash
git clone https://github.com/v-pelaez/oasis-climb-ui.git
cd oasis-climb-ui
npm ci
```

### Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite development server with HMR |
| `npm run type-check` | Run TypeScript static analysis with `vue-tsc` |
| `npm run build` | Type-check and build the application for production |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Lint and auto-fix files with ESLint |
| `npm run lint:check` | Lint without fixing; fails on any warning (used in CI) |
| `npm run test` | Run the Vitest suite once (`npx vitest run <path>` for a subset) |
| `npm run format` | Format source files in `src/` with Prettier |
