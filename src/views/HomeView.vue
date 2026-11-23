<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ScrollTop from '@/components/ui/ScrollTop.vue'
import RankingComponent from '@/components/RankingComponent.vue'
import NewsComponent from '@/components/NewsComponent.vue'
import MarkFormComponent from '@/components/MarkFormComponent.vue'
import BackgroundComponent from '@/components/BackgroundComponent.vue'
import AboutUsComponent from '@/components/AboutUsComponent.vue'
import VideoCarouselComponent from '@/components/VideoCarouselComponent.vue'
</script>

<template>
  <SiteHeader />
  <main id="main" tabindex="-1">
    <VideoCarouselComponent />
    <BackgroundComponent />
    <NewsComponent />
    <RankingComponent />
    <MarkFormComponent />
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
