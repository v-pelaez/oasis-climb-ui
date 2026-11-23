# OasisClimb — Frontend Web Application

Responsive single-page application designed for **OasisClimb**, a fictional climbing community brand built as a comprehensive frontend showcase.


Live Demo: **[v-pelaez.github.io/oasis-climb-ui](https://v-pelaez.github.io/oasis-climb-ui/)**

![OasisClimb — Desktop Preview](./docs/preview.png)

## Overview

Originally developed as a static Bootstrap interface, this project was migrated to a modular **Vue 3 + TypeScript** SPA to apply component-based architecture, client-side routing, and automated code quality tooling while preserving a cohesive visual identity.

## Key Features

- **SPA architecture & routing:** Multi-view client-side navigation structured with Vue Router 4.
- **Rich media integration:** Interactive video carousel and embedded video sections.
- **Interactive UI & forms:** Client-side form validation, tooltips, and reusable Bootstrap 5 / CoreUI Vue components.
- **Data presentation:** Ranking tables with client-side pagination backed by static mock datasets.
- **Custom visual effects:** Canvas-style animated background and animated SVG elements combined with custom Sass styling.

## Tech Stack

- **Framework & Build:** Vue 3 (`^3.5.26`) · Vue Router 4 (`^4.6.4`) · Vite 7 (`^7.3.1`)
- **Language & Type Checking:** TypeScript (`~5.9.3`) · `vue-tsc`
- **UI & Styling:** Bootstrap 5 · CoreUI Vue (`@coreui/vue`, `@coreui/icons-vue`) · Sass
- **Code Quality:** ESLint 9 · Prettier 3 · Vitest (`@vue/test-utils`, jsdom) · GitHub Actions CI

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
