<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ScrollTop from '@/components/ui/ScrollTop.vue'
import RankingComponent from '@/components/RankingComponent.vue'
import NewsComponent from '@/components/NewsComponent.vue'
import MarkFormComponent from '@/components/MarkFormComponent.vue'
import ParticlesBackground from '@/components/layout/ParticlesBackground.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import HeroCarousel from '@/components/sections/HeroCarousel.vue'
</script>

<template>
  <SiteHeader />
  <main id="main" tabindex="-1">
    <HeroCarousel />
    <ParticlesBackground />
    <NewsComponent />
    <RankingComponent />
    <MarkFormComponent />
    <AboutSection />
  </main>
  <SiteFooter />
  <ScrollTop />
</template>

<style scoped>
main:focus {
  outline: none;
}
</style>
