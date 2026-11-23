# Oasis Climb UI

Single-page climbing site (Spanish content).

## Stack

- Vue 3.5 (`<script setup lang="ts">` in every SFC) + Vue Router, Vite 7, TypeScript 5.9 (`vue-tsc`).
- Styling: Bootstrap 5 + CoreUI + SCSS (`src/assets/styles/`).
- Content lives in `src/data/*.ts`, typed by `src/types/*.ts`; components should not hard-code content data.
- Lint: ESLint 9 flat config (`eslint-plugin-vue` `flat/recommended` + `@vue/eslint-config-typescript`), Prettier for formatting.
- Tests: Vitest + `@vue/test-utils` + jsdom, in `src/**/__tests__/*.spec.ts` (type-checked via `tsconfig.vitest.json`).

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
