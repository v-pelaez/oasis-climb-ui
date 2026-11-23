<script setup lang="ts">
import { nextTick, ref } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import SectionBanner from '@/components/ui/SectionBanner.vue'
import { useRouteForm, type RouteFormField } from '@/composables/useRouteForm'
import { difficultyOptions, disciplineOptions, seasonOptions } from '@/data/routeForm'

const headerImage = new URL('../../assets/snowmountain.webp', import.meta.url).href

const { t } = useI18n()
const { form, errors, validate, reset } = useRouteForm()

const label = (field: RouteFormField) => t(`routeForm.fields.${field}.label`)
const placeholder = (field: RouteFormField) => t(`routeForm.fields.${field}.placeholder`)

/** DOM id of each field (the checkbox keeps its historical `termsCheck`). */
const fieldId = (field: RouteFormField) => (field === 'terms' ? 'termsCheck' : field)
const errorId = (field: RouteFormField) => `${fieldId(field)}-error`

/** Accessibility attributes linking a control to its error message. */
const a11y = (field: RouteFormField) => ({
  id: fieldId(field),
  'aria-invalid': errors.value[field] ? ('true' as const) : undefined,
  'aria-describedby': errors.value[field] ? errorId(field) : undefined,
})

const submitButton = ref<HTMLButtonElement | null>(null)
const dialogOpen = ref(false)
const registeredRoute = ref('')

async function handleSubmit() {
  const firstInvalid = validate()
  if (firstInvalid) {
    await nextTick()
    document.getElementById(fieldId(firstInvalid))?.focus()
    return
  }
  registeredRoute.value = form.routeName.trim()
  reset()
  dialogOpen.value = true
}

function returnFocus(event: Event) {
  event.preventDefault()
  submitButton.value?.focus()
}
</script>

<template>
  <section class="route-form-section" aria-labelledby="registro-title">
    <p class="route-form-tagline">{{ t('routeForm.tagline') }}</p>
    <img
      :src="headerImage"
      class="route-form-header-image"
      width="1280"
      height="853"
      :alt="t('routeForm.headerImageAlt')"
      loading="lazy"
      decoding="async"
    />

    <div id="registro" class="route-form-body">
      <SectionBanner id="registro-title" :title="t('routeForm.title')" />

      <div class="route-form-card">
        <form novalidate class="route-form" @submit.prevent="handleSubmit">
          <h3 class="route-form-title">{{ t('routeForm.formTitle') }}</h3>

          <div class="route-form-grid">
            <div class="route-form-column">
              <div class="field">
                <label :for="fieldId('routeName')" class="field-label">
                  {{ label('routeName') }}
                </label>
                <input
                  v-bind="a11y('routeName')"
                  v-model="form.routeName"
                  type="text"
                  class="field-control"
                  :placeholder="placeholder('routeName')"
                  required
                />
                <p v-if="errors.routeName" :id="errorId('routeName')" class="field-error">
                  {{ t(errors.routeName) }}
                </p>
              </div>

              <div class="field">
                <label :for="fieldId('location')" class="field-label">
                  {{ label('location') }}
                </label>
                <input
                  v-bind="a11y('location')"
                  v-model="form.location"
                  type="text"
                  class="field-control"
                  :placeholder="placeholder('location')"
                  required
                />
                <p v-if="errors.location" :id="errorId('location')" class="field-error">
                  {{ t(errors.location) }}
                </p>
              </div>

              <div class="field-pair">
                <div class="field">
                  <label :for="fieldId('markerType')" class="field-label">
                    {{ label('markerType') }}
                  </label>
                  <select
                    v-bind="a11y('markerType')"
                    v-model="form.markerType"
                    class="field-control field-select"
                    required
                  >
                    <option value="" disabled>{{ placeholder('markerType') }}</option>
                    <option v-for="option in disciplineOptions" :key="option" :value="option">
                      {{ t(`routeForm.options.discipline.${option}`) }}
                    </option>
                  </select>
                  <p v-if="errors.markerType" :id="errorId('markerType')" class="field-error">
                    {{ t(errors.markerType) }}
                  </p>
                </div>

                <div class="field">
                  <label :for="fieldId('difficulty')" class="field-label">
                    {{ label('difficulty') }}
                  </label>
                  <select
                    v-bind="a11y('difficulty')"
                    v-model="form.difficulty"
                    class="field-control field-select"
                    required
                  >
                    <option value="" disabled>{{ placeholder('difficulty') }}</option>
                    <option v-for="option in difficultyOptions" :key="option" :value="option">
                      {{ t(`routeForm.options.difficulty.${option}`) }}
                    </option>
                  </select>
                  <p v-if="errors.difficulty" :id="errorId('difficulty')" class="field-error">
                    {{ t(errors.difficulty) }}
                  </p>
                </div>
              </div>

              <div class="field">
                <label :for="fieldId('gpsLink')" class="field-label">
                  {{ label('gpsLink') }}
                </label>
                <input
                  v-bind="a11y('gpsLink')"
                  v-model="form.gpsLink"
                  type="url"
                  inputmode="url"
                  class="field-control"
                  :placeholder="placeholder('gpsLink')"
                />
                <p v-if="errors.gpsLink" :id="errorId('gpsLink')" class="field-error">
                  {{ t(errors.gpsLink) }}
                </p>
              </div>
            </div>

            <div class="route-form-column">
              <div class="field-pair">
                <div class="field">
                  <label :for="fieldId('length')" class="field-label">
                    {{ label('length') }}
                  </label>
                  <input
                    v-bind="a11y('length')"
                    v-model="form.length"
                    type="text"
                    class="field-control"
                    :placeholder="placeholder('length')"
                    required
                  />
                  <p v-if="errors.length" :id="errorId('length')" class="field-error">
                    {{ t(errors.length) }}
                  </p>
                </div>

                <div class="field">
                  <label :for="fieldId('elevation')" class="field-label">
                    {{ label('elevation') }}
                  </label>
                  <input
                    v-bind="a11y('elevation')"
                    v-model.number="form.elevation"
                    type="number"
                    min="0"
                    inputmode="numeric"
                    class="field-control"
                    :placeholder="placeholder('elevation')"
                    required
                  />
                  <p v-if="errors.elevation" :id="errorId('elevation')" class="field-error">
                    {{ t(errors.elevation) }}
                  </p>
                </div>
              </div>

              <div class="field">
                <label :for="fieldId('duration')" class="field-label">
                  {{ label('duration') }}
                </label>
                <input
                  v-bind="a11y('duration')"
                  v-model.number="form.duration"
                  type="number"
                  min="0"
                  step="0.5"
                  inputmode="decimal"
                  class="field-control"
                  :placeholder="placeholder('duration')"
                  required
                />
                <p v-if="errors.duration" :id="errorId('duration')" class="field-error">
                  {{ t(errors.duration) }}
                </p>
              </div>

              <div class="field">
                <label :for="fieldId('season')" class="field-label">
                  {{ label('season') }}
                </label>
                <select
                  v-bind="a11y('season')"
                  v-model="form.season"
                  class="field-control field-select"
                  required
                >
                  <option value="" disabled>{{ placeholder('season') }}</option>
                  <option v-for="option in seasonOptions" :key="option" :value="option">
                    {{ t(`routeForm.options.season.${option}`) }}
                  </option>
                </select>
                <p v-if="errors.season" :id="errorId('season')" class="field-error">
                  {{ t(errors.season) }}
                </p>
              </div>

              <div class="field">
                <label :for="fieldId('equipment')" class="field-label">
                  {{ label('equipment') }}
                </label>
                <input
                  v-bind="a11y('equipment')"
                  v-model="form.equipment"
                  type="text"
                  class="field-control"
                  :placeholder="placeholder('equipment')"
                  required
                />
                <p v-if="errors.equipment" :id="errorId('equipment')" class="field-error">
                  {{ t(errors.equipment) }}
                </p>
              </div>
            </div>

            <div class="field route-form-full">
              <label :for="fieldId('description')" class="field-label">
                {{ label('description') }}
              </label>
              <textarea
                v-bind="a11y('description')"
                v-model="form.description"
                class="field-control"
                :placeholder="placeholder('description')"
                required
              ></textarea>
              <p v-if="errors.description" :id="errorId('description')" class="field-error">
                {{ t(errors.description) }}
              </p>
            </div>

            <div class="field route-form-full">
              <div class="field-check">
                <input
                  v-bind="a11y('terms')"
                  v-model="form.terms"
                  type="checkbox"
                  class="field-checkbox"
                  required
                />
                <label :for="fieldId('terms')" class="field-check-label">
                  {{ label('terms') }}
                </label>
              </div>
              <p v-if="errors.terms" :id="errorId('terms')" class="field-error">
                {{ t(errors.terms) }}
              </p>
            </div>

            <div class="route-form-full route-form-actions">
              <button ref="submitButton" type="submit" class="route-form-button">
                {{ t('routeForm.submit') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <DialogRoot v-model:open="dialogOpen">
      <DialogPortal>
        <DialogOverlay class="route-dialog-overlay" />
        <DialogContent class="route-dialog" @close-auto-focus="returnFocus">
          <DialogTitle class="route-dialog-title">{{ t('routeForm.dialog.title') }}</DialogTitle>
          <p class="route-dialog-route">{{ registeredRoute }}</p>
          <DialogDescription class="route-dialog-body">{{
            t('routeForm.dialog.body')
          }}</DialogDescription>
          <p class="route-dialog-note">{{ t('routeForm.dialog.note') }}</p>
          <DialogClose class="route-form-button route-dialog-close">
            {{ t('routeForm.dialog.close') }}
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.route-form-tagline {
  margin: 0;
  padding: var(--oc-space-4);
  background: var(--oc-yellow);
  color: var(--oc-yellow-ink);
  box-shadow: var(--oc-shadow);
  font-size: 1.25rem;
  font-weight: 500;
  text-align: center;
}

.route-form-header-image {
  display: block;
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.route-form-body {
  min-height: 100vh;
  padding: var(--oc-space-7) 0;
}

.route-form-body > .section-banner {
  margin-bottom: var(--oc-space-7);
}

.route-form-card {
  width: min(100% - 2 * var(--oc-space-4), 960px);
  margin-inline: auto;
  padding: var(--oc-space-5);
  border-left: 4px solid var(--oc-yellow);
  background: var(--oc-dark);
  color: var(--oc-white);
  box-shadow: var(--oc-shadow-lg);

  @include up(md) {
    width: 75%;
  }
}

.route-form-title {
  margin: 0 0 var(--oc-space-5);
  padding-bottom: var(--oc-space-2);
  border-bottom: 1px solid var(--oc-yellow);
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
}

.route-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--oc-space-4) var(--oc-space-5);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.route-form-column {
  display: flex;
  flex-direction: column;
  gap: var(--oc-space-4);
}

.route-form-full {
  @include up(md) {
    grid-column: 1 / -1;
  }
}

.field-pair {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--oc-space-4);

  @include up(sm) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--oc-space-2);
  min-width: 0;
}

.field-label {
  color: var(--oc-gray-300);
  font-size: var(--oc-text-xs);
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.field-control {
  width: 100%;
  min-height: var(--oc-tap-target);
  padding: var(--oc-space-2) var(--oc-space-3);
  border: 1px solid var(--oc-line);
  border-radius: 0;
  background-color: var(--oc-dark-2);
  color: var(--oc-white);
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;

  &::placeholder {
    color: var(--oc-muted);
    opacity: 1;
  }

  &:focus {
    border-color: var(--oc-yellow);
    outline: none;
    background-color: var(--oc-dark);
  }

  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: 1px;
  }

  &[aria-invalid='true'] {
    border-color: var(--oc-danger);
  }

  @include reduced-motion {
    transition: none;
  }
}

textarea.field-control {
  // Three lines of text plus padding and border.
  block-size: calc(3lh + 1rem + 2px);
  resize: vertical;
}

// Hide the spin buttons of numeric inputs.
input[type='number'] {
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
}

// Yellow chevron for selects (stroke = --oc-yellow; data URIs cannot read custom properties).
.field-select {
  padding-right: var(--oc-space-7);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f8c52d' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--oc-space-3) center;
  background-size: 1.2em;

  option {
    background-color: var(--oc-dark-2);
    color: var(--oc-white);
  }
}

.field-check {
  display: flex;
  align-items: flex-start;
  gap: var(--oc-space-3);
}

.field-checkbox {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  margin: 0.125rem 0 0;
  border-radius: 0;
  accent-color: var(--oc-yellow);
  cursor: pointer;

  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: 2px;
  }

  &[aria-invalid='true'] {
    outline: 1px solid var(--oc-danger);
  }
}

.field-check-label {
  font-size: var(--oc-text-sm);
  cursor: pointer;
}

.field-error {
  margin: 0;
  color: var(--oc-danger);
  font-size: var(--oc-text-sm);
}

.route-form-actions {
  display: flex;
  justify-content: flex-end;
}

.route-form-button {
  min-height: var(--oc-tap-target);
  padding: var(--oc-space-2) var(--oc-space-7);
  border: 0;
  border-radius: 0;
  background: var(--oc-yellow);
  color: var(--oc-yellow-ink);
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(0.92);
  }

  &:focus-visible {
    outline: 2px solid var(--oc-white);
    outline-offset: 2px;
  }

  @include down(sm) {
    width: 100%;
  }
}
</style>

<style lang="scss">
/* Not scoped: the dialog is teleported to <body>. */
.route-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--oc-z-popover);
  background: rgb(0 0 0 / 60%);
}

.route-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: var(--oc-z-popover);
  width: min(500px, calc(100vw - 2 * var(--oc-space-4)));
  max-height: calc(100vh - 2 * var(--oc-space-4));
  overflow-y: auto;
  padding: var(--oc-space-6) var(--oc-space-5);
  transform: translate(-50%, -50%);
  border-left: 2px solid var(--oc-yellow);
  border-radius: 0;
  background: var(--oc-dark);
  color: var(--oc-white);
  box-shadow: var(--oc-shadow-lg);
  font-family: var(--oc-font-sans);
  text-align: center;

  &:focus {
    outline: none;
  }
}

.route-dialog-title {
  margin: 0 0 var(--oc-space-5);
  padding-bottom: var(--oc-space-3);
  border-bottom: 1px solid var(--oc-line);
  color: var(--oc-yellow);
  font-size: 1.25rem;
  font-weight: 700;
  text-align: left;
  text-transform: uppercase;
}

.route-dialog-route {
  margin: 0 0 var(--oc-space-4);
  font-size: var(--oc-text-xl);
  font-weight: 700;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.route-dialog-body {
  margin: 0;
  font-size: 1.25rem;
}

.route-dialog-note {
  margin: var(--oc-space-4) 0 var(--oc-space-5);
  color: var(--oc-muted);
  font-size: var(--oc-text-sm);
  font-style: italic;
  text-transform: uppercase;
}
</style>
