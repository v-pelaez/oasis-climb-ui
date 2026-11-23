<script setup lang="ts">
import { computed } from 'vue'
import { icons, type IconName } from './icons'

const props = withDefaults(
  defineProps<{
    name: IconName
    /** CSS size; defaults to the surrounding font size. */
    size?: string
    /** Accessible name. Without it the icon is decorative (`aria-hidden`). */
    label?: string
  }>(),
  { size: '1em', label: undefined },
)

const icon = computed(() => icons[props.name])
</script>

<template>
  <svg
    class="app-icon"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="icon.viewBox"
    :width="size"
    :height="size"
    :fill="icon.kind === 'fill' ? 'currentColor' : 'none'"
    :stroke="icon.kind === 'stroke' ? 'currentColor' : undefined"
    :stroke-width="icon.kind === 'stroke' ? 2.2 : undefined"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
  >
    <path v-for="(d, i) in icon.paths" :key="i" :d="d" />
  </svg>
</template>

<style scoped>
.app-icon {
  display: inline-block;
  flex: none;
  vertical-align: -0.125em;
}
</style>
