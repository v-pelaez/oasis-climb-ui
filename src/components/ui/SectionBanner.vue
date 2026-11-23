<script setup lang="ts">
/**
 * Yellow clipped banner with the section title in LemonMilk Bold Italic.
 * Replaces the per-section `.recorte-bandera` copies (sections migrate in later tickets).
 */
withDefaults(
  defineProps<{
    title: string
    /** Heading level for the document outline. */
    level?: 2 | 3
  }>(),
  { level: 2 },
)
</script>

<template>
  <div class="section-banner">
    <component :is="`h${level}`" class="section-banner-title">{{ title }}</component>
  </div>
</template>

<style scoped>
.section-banner {
  width: 100%;
  padding: var(--oc-space-7) var(--oc-space-7) var(--oc-space-7) var(--oc-space-6);
  background: var(--oc-yellow);
  color: var(--oc-black);
  clip-path: polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%);
}

.section-banner-title {
  margin: 0;
  font-family: var(--oc-font-display);
  font-size: var(--oc-text-display);
  font-style: italic;
  font-weight: 700;
  line-height: var(--oc-leading-tight);
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
</style>
