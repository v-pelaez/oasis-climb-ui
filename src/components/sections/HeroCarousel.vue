<script setup lang="ts">
/**
 * Home hero: chained full-screen videos. Only the active video and the next
 * one are mounted; the next one buffers (`preload="auto"`) underneath, so when
 * the active one ends and fades out the next is already there.
 */
import { computed, useTemplateRef } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useCarousel } from '@/composables/useCarousel'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { heroTagline, heroVideos as videos } from '@/data/site'

const stage = useTemplateRef<HTMLElement>('stage')
const reducedMotion = useReducedMotion()
const autoplay = computed(() => !reducedMotion.value)

const { index, nextIndex, progress, paused, toggle } = useCarousel({
  count: videos.length,
  getVideo: (i) => stage.value?.querySelector<HTMLVideoElement>(`video[data-slide="${i}"]`),
  autoplay,
})

const slides = computed(() => {
  const ids = [index.value]
  if (videos.length > 1) ids.push(nextIndex.value)
  return ids.map((id) => ({ id, video: videos[id]!, active: id === index.value }))
})

const current = computed(() => videos[index.value])
</script>

<template>
  <div class="hero-tagline">
    <p class="hero-tagline-text">{{ heroTagline }}</p>
  </div>

  <section class="hero" aria-label="Presentación">
    <div ref="stage" class="hero-stage">
      <TransitionGroup name="hero-fade">
        <video
          v-for="slide in slides"
          :key="slide.id"
          class="hero-video"
          :class="{ 'is-active': slide.active }"
          :data-slide="slide.id"
          :data-active="slide.active ? '' : undefined"
          preload="auto"
          muted
          playsinline
          disablepictureinpicture
          aria-hidden="true"
          tabindex="-1"
        >
          <source :src="slide.video.src" type="video/webm" />
        </video>
      </TransitionGroup>
    </div>

    <div class="hero-overlay">
      <Transition name="hero-text" mode="out-in">
        <div v-if="current" :key="index" class="hero-text">
          <h1 class="hero-phrase">{{ current.phrase }}</h1>
          <p class="hero-subtext">{{ current.subtext }}</p>
        </div>
      </Transition>
    </div>

    <button
      type="button"
      class="hero-toggle"
      aria-label="Pausar vídeos de portada"
      :aria-pressed="paused"
      @click="toggle"
    >
      <AppIcon :name="paused ? 'play' : 'pause'" size="16px" />
    </button>

    <div class="hero-progress" aria-hidden="true">
      <div class="hero-progress-fill" :style="{ transform: `scaleX(${progress})` }"></div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.hero-tagline {
  padding: var(--oc-space-2) var(--oc-space-4);
  background: var(--oc-yellow);
  color: var(--oc-yellow-ink);
  box-shadow: var(--oc-shadow);
  text-align: center;
}

.hero-tagline-text {
  margin: 0;
  font-size: var(--oc-text-base);
  font-style: italic;
  font-weight: 700;
  text-transform: uppercase;
}

.hero {
  position: relative;
  height: 90vh;
  overflow: hidden;
  background: var(--oc-black);
}

.hero-stage {
  position: absolute;
  inset: 0;
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  z-index: 0;

  &.is-active {
    z-index: 1;
  }
}

// The finished video fades out on top of the next one, which is already playing.
.hero-fade-leave-active {
  z-index: 2;
  transition: opacity 1.2s ease-in-out;
}

.hero-fade-leave-to {
  opacity: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--oc-space-4);
  pointer-events: none;
}

.hero-text {
  max-width: 100%;
  padding: var(--oc-space-6) var(--oc-space-5);
  border-left: 5px solid var(--oc-yellow);
  background: rgb(0 0 0 / 75%);
  box-shadow: var(--oc-shadow-lg);
  backdrop-filter: blur(10px);
  text-align: center;

  @include up(md) {
    padding: 2.5rem 4rem;
  }
}

.hero-phrase {
  margin: 0 0 var(--oc-space-1);
  color: var(--oc-yellow);
  font-size: clamp(2rem, 7vw, 4.5rem);
  font-weight: 900;
  text-shadow: 0 4px 20px var(--oc-black);
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.hero-subtext {
  margin: 0;
  color: var(--oc-white);
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-style: italic;
  font-weight: 300;
  opacity: 0.75;
  text-transform: uppercase;
}

.hero-text-enter-active {
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
}

.hero-text-leave-active {
  transition:
    opacity 0.5s ease-in,
    transform 0.5s ease-in;
}

.hero-text-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.hero-text-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.hero-toggle {
  position: absolute;
  right: var(--oc-space-3);
  bottom: var(--oc-space-4);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--oc-tap-target);
  height: var(--oc-tap-target);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--oc-white);
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  // Small visible disc inside the 44 px target.
  &::before {
    position: absolute;
    width: 32px;
    height: 32px;
    border: 1px solid rgb(255 255 255 / 40%);
    border-radius: 50%;
    background: rgb(0 0 0 / 45%);
    content: '';
  }

  :deep(.app-icon) {
    position: relative;
  }

  &:hover,
  &:focus-visible {
    opacity: 1;
  }

  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: -2px;
  }
}

.hero-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 6px;
  background: rgb(255 255 255 / 5%);
}

.hero-progress-fill {
  height: 100%;
  background: var(--oc-yellow);
  transform-origin: left;
  // `timeupdate` fires a few times per second; smooth the steps.
  transition: transform 0.25s linear;
}

@include reduced-motion {
  .hero-fade-leave-active,
  .hero-text-enter-active,
  .hero-text-leave-active,
  .hero-progress-fill,
  .hero-toggle {
    transition: none;
  }

  .hero-text-enter-from,
  .hero-text-leave-to {
    transform: none;
  }
}
</style>
