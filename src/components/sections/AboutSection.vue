<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionBanner from '@/components/ui/SectionBanner.vue'
import { about } from '@/data/site'

const { t } = useI18n()
</script>

<template>
  <div class="about-tagline">
    <p class="about-tagline-text">{{ t('about.tagline') }}</p>
  </div>
  <img class="about-cover" :src="about.image.src" :alt="t('about.imageAlt')" loading="lazy" />

  <section id="about-us" class="about" aria-labelledby="about-us-title">
    <SectionBanner id="about-us-title" :title="t('about.title')" />

    <div class="about-body">
      <div class="about-text">
        <h3 class="about-heading">{{ t('about.heading') }}</h3>
        <p class="about-lead">{{ t('about.lead') }}</p>
        <p class="about-paragraph">{{ t('about.body') }}</p>
        <p class="about-quote">{{ t('about.quote') }}</p>
      </div>

      <div class="about-media">
        <video
          class="about-video"
          controls
          preload="metadata"
          playsinline
          :poster="about.video.poster"
          :aria-label="t('about.videoLabel')"
        >
          <source :src="about.video.src" :type="about.video.type" />
          {{ t('about.videoFallback') }}
        </video>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.about-tagline {
  padding: var(--oc-space-4);
  background: var(--oc-yellow);
  color: var(--oc-yellow-ink);
  box-shadow: var(--oc-shadow);
  text-align: center;
}

.about-tagline-text {
  margin: 0;
  font-size: var(--oc-text-lg);
  font-weight: 700;
}

.about-cover {
  display: block;
  width: 100%;
  height: 300px;
  object-fit: cover;
  filter: grayscale(40%) brightness(0.8);
}

.about {
  display: flex;
  flex-direction: column;
  gap: var(--oc-space-7);
  min-height: 100vh;
  padding: var(--oc-space-7) 0;
  background: var(--oc-dark);
  color: var(--oc-white);
  scroll-margin-top: var(--oc-header-height);
}

.about-body {
  display: grid;
  gap: var(--oc-space-6);
  align-items: center;
  width: min(100% - 2 * var(--oc-space-4), 1100px);
  margin: 0 auto;
  padding: var(--oc-space-5);
  border-left: 4px solid var(--oc-yellow);

  @include up(md) {
    padding: var(--oc-space-7);
  }

  @include up(lg) {
    grid-template-columns: 1fr 1fr;
  }
}

.about-heading {
  margin-bottom: var(--oc-space-5);
  color: var(--oc-yellow);
  font-size: var(--oc-text-xl);
  font-weight: 700;
  text-transform: uppercase;
}

.about-lead {
  margin: 0 0 var(--oc-space-4);
  font-size: 1.25rem;
  font-weight: 300;
}

.about-paragraph {
  margin: 0 0 var(--oc-space-5);
  opacity: 0.75;
}

.about-quote {
  margin: 0;
  color: var(--oc-yellow);
  font-size: var(--oc-text-sm);
  font-style: italic;
}

.about-media {
  border: 3px solid var(--oc-yellow);
  background: var(--oc-black);
  box-shadow: var(--oc-shadow-lg);
  line-height: 0;
}

.about-video {
  display: block;
  width: 100%;
  height: auto;
}
</style>
