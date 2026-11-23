<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ScrollTop from '@/components/ui/ScrollTop.vue'
import RankingSection from '@/components/sections/RankingSection.vue'
import NewsSection from '@/components/sections/NewsSection.vue'
import RouteFormSection from '@/components/sections/RouteFormSection.vue'
import ParticlesBackground from '@/components/layout/ParticlesBackground.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import HeroCarousel from '@/components/sections/HeroCarousel.vue'
</script>

<template>
  <SiteHeader />
  <main id="main" tabindex="-1">
    <HeroCarousel />
    <ParticlesBackground />
    <NewsSection />
    <RankingSection />
    <RouteFormSection />
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
