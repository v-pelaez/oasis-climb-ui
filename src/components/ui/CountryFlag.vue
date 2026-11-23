<script setup lang="ts">
import { computed } from 'vue'
import type { CountryCode } from '@/types/ranking'
import { flags } from './flags'

/** Decorative inline SVG flag, shown next to the country name (which carries the meaning). */
const props = defineProps<{ code: CountryCode }>()

const flag = computed(() => flags[props.code.toUpperCase()])
</script>

<template>
  <svg
    v-if="flag"
    class="country-flag"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="flag.viewBox"
    :width="flag.viewBox.split(' ')[2]"
    :height="flag.viewBox.split(' ')[3]"
    :data-country="code.toUpperCase()"
    aria-hidden="true"
    focusable="false"
  >
    <component :is="shape.tag" v-for="(shape, i) in flag.shapes" :key="i" v-bind="shape.attrs" />
  </svg>
</template>

<style scoped>
.country-flag {
  display: inline-block;
  flex: none;
  width: auto;
  height: 0.85em;
  vertical-align: -0.05em;
  box-shadow: 0 0 0 1px var(--oc-gray-300);
}
</style>
