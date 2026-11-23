<script setup lang="ts">
/** Decorative full-screen canvas behind the page with drifting yellow triangles. */
import { useTemplateRef } from 'vue'
import { useParticles } from '@/composables/useParticles'
import { useReducedMotion } from '@/composables/useReducedMotion'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
useParticles(canvas, { reducedMotion: useReducedMotion() })
</script>

<template>
  <canvas ref="canvas" class="particles-background" aria-hidden="true"></canvas>
</template>

<style scoped>
.particles-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  /* Read by `useParticles` as the triangles' fill colour. */
  color: var(--oc-yellow);
  background-color: var(--oc-page);
  pointer-events: none;
}
</style>
