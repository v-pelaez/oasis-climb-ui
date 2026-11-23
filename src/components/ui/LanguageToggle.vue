<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppIcon from './AppIcon.vue'
import { useLocale } from '@/composables/useLocale'

/**
 * One button that names the other language in that language («English» /
 * «Español»); below 400 px only the globe and the code (EN / ES). No flags:
 * a language is not a country.
 */
const { t } = useI18n()
const { otherLocale, setLocale } = useLocale()

/** A message of the target language, whatever the active one. */
const target = (key: string) => t(key, {}, { locale: otherLocale.value })
</script>

<template>
  <button
    type="button"
    class="lang-toggle"
    :lang="otherLocale"
    :aria-label="target('language.switchTo')"
    @click="setLocale(otherLocale)"
  >
    <AppIcon name="globe" size="18px" />
    <span class="lang-toggle-name">{{ target('language.name') }}</span>
    <span class="lang-toggle-code" aria-hidden="true">{{ target('language.code') }}</span>
  </button>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.lang-toggle {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 var(--oc-space-3);
  border: 1px solid var(--oc-line);
  border-radius: var(--oc-radius);
  background: transparent;
  color: var(--oc-fg);
  font: 500 var(--oc-text-sm) / 1 var(--oc-font-sans);
  cursor: pointer;

  &:hover {
    border-color: var(--oc-yellow);
    color: var(--oc-yellow);
  }

  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: 2px;
  }

  // Touch sizes: same height as the menu button beside it.
  @include down(lg) {
    min-height: var(--oc-tap-target);
  }
}

.lang-toggle-code {
  display: none;
  font-weight: 700;
  letter-spacing: 1px;
}

// Narrow phones: globe + code, so it fits beside the menu button.
@media (max-width: 399.98px) {
  .lang-toggle-name {
    display: none;
  }

  .lang-toggle-code {
    display: inline;
  }
}
</style>
