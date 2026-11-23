<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { useScrollTop } from '@/composables/useScrollTop'

const { isVisible, scrollToTop } = useScrollTop(300)
</script>

<template>
  <Transition name="scroll-top-fade">
    <button
      v-if="isVisible"
      type="button"
      class="scroll-top"
      aria-label="Volver arriba"
      @click="scrollToTop"
    >
      <AppIcon name="arrow-up" size="24px" />
    </button>
  </Transition>
</template>

<style scoped>
.scroll-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: var(--oc-z-scroll-top);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 0;
  border-radius: 50%;
  background-color: var(--oc-yellow);
  color: var(--oc-yellow-ink);
  box-shadow: var(--oc-shadow);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.scroll-top:hover {
  transform: scale(1.1);
  background-color: var(--oc-dark);
  color: var(--oc-yellow);
}

.scroll-top-fade-enter-active,
.scroll-top-fade-leave-active {
  transition: opacity 0.3s ease;
}

.scroll-top-fade-enter-from,
.scroll-top-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-top,
  .scroll-top-fade-enter-active,
  .scroll-top-fade-leave-active {
    transition: none;
  }

  .scroll-top:hover {
    transform: none;
  }
}
</style>
