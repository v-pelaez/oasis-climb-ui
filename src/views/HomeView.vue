<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ScrollTop from '@/components/ui/ScrollTop.vue'
import RankingSection from '@/components/sections/RankingSection.vue'
import NewsSection from '@/components/sections/NewsSection.vue'
import RouteFormSection from '@/components/sections/RouteFormSection.vue'
import BackgroundComponent from '@/components/BackgroundComponent.vue'
import AboutUsComponent from '@/components/AboutUsComponent.vue'
import VideoCarouselComponent from '@/components/VideoCarouselComponent.vue'
</script>

<template>
  <SiteHeader />
  <main id="main" tabindex="-1">
    <VideoCarouselComponent />
    <BackgroundComponent />
    <NewsSection />
    <RankingSection />
    <RouteFormSection />
    <AboutUsComponent />
  </main>
  <SiteFooter />
  <ScrollTop />
</template>

<style scoped>
main:focus {
  outline: none;
}
</style>
