<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { useI18n } from 'vue-i18n'

/**
 * Wraps a trigger (default slot, rendered as-is) with a popover that says the
 * action is not available in this prototype.
 */
withDefaults(
  defineProps<{
    /** Translated sentence, e.g. `t('notAvailable.pagination')`. */
    message: string
    side?: 'top' | 'right' | 'bottom' | 'left'
  }>(),
  { side: 'bottom' },
)

const { t } = useI18n()
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <slot />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent class="not-available" :side="side" :side-offset="8" :collision-padding="16">
        <p class="not-available-title">{{ t('notAvailable.title') }}</p>
        <p class="not-available-body">{{ message }}</p>
        <PopoverArrow class="not-available-arrow" :width="12" :height="6" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style>
/* Not scoped: the content is teleported to <body>. */
.not-available {
  z-index: var(--oc-z-popover);
  max-width: min(276px, calc(100vw - 32px));
  padding: var(--oc-space-3) var(--oc-space-4);
  border-top: 3px solid var(--oc-yellow);
  border-radius: var(--oc-radius);
  background: var(--oc-surface);
  color: var(--oc-text);
  box-shadow: var(--oc-shadow-lg);
  font-family: var(--oc-font-sans);
  font-size: var(--oc-text-sm);
  line-height: var(--oc-leading);
}

.not-available-title {
  margin: 0 0 var(--oc-space-1);
  font-weight: 700;
}

.not-available-body {
  margin: 0;
}

.not-available-arrow {
  fill: var(--oc-surface);
}
</style>
