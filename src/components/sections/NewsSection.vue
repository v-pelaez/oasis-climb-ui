<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import SectionBanner from '@/components/ui/SectionBanner.vue'
import NotAvailablePopover from '@/components/ui/NotAvailablePopover.vue'
import { formatRelativeDate, news } from '@/data/news'

const { t, locale } = useI18n()

/** Pages shown in the (non-functional) pagination; the first one is the current page. */
const pages = [1, 2, 3]
</script>

<template>
  <section id="novedades" class="news" aria-labelledby="novedades-title">
    <SectionBanner id="novedades-title" :title="t('news.title')" />

    <TooltipProvider :delay-duration="200">
      <ul class="news-grid" role="list">
        <li v-for="item in news" :key="item.id">
          <TooltipRoot>
            <TooltipTrigger as-child>
              <article :id="`news-${item.id}`" class="news-card" tabindex="0">
                <img
                  class="news-card-img"
                  :src="item.img"
                  :alt="t(`news.items.${item.id}.title`)"
                  loading="lazy"
                />
                <div class="news-card-body">
                  <h3 class="news-card-title">{{ t(`news.items.${item.id}.title`) }}</h3>
                  <p class="news-card-text">{{ t(`news.items.${item.id}.text`) }}</p>
                </div>
                <p class="news-card-footer">
                  <small>{{
                    t('news.published', { date: formatRelativeDate(item.published, locale) })
                  }}</small>
                </p>
              </article>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent class="news-tooltip" side="top" :side-offset="6">
                {{ t('news.tooltip') }}
                <TooltipArrow class="news-tooltip-arrow" :width="10" :height="5" />
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </li>
      </ul>
    </TooltipProvider>

    <nav class="news-pagination" :aria-label="t('news.paginationLabel')">
      <ul class="pagination" role="list">
        <li>
          <NotAvailablePopover :message="t('notAvailable.pagination')" side="top">
            <button type="button" class="page-button" :aria-label="t('news.previousPage')">
              <span aria-hidden="true">&laquo;</span>
            </button>
          </NotAvailablePopover>
        </li>
        <li v-for="page in pages" :key="page">
          <button
            v-if="page === 1"
            type="button"
            class="page-button is-current"
            aria-current="page"
          >
            {{ page }}
          </button>
          <NotAvailablePopover v-else :message="t('notAvailable.pagination')" side="top">
            <button type="button" class="page-button">{{ page }}</button>
          </NotAvailablePopover>
        </li>
        <li>
          <NotAvailablePopover :message="t('notAvailable.pagination')" side="top">
            <button type="button" class="page-button" :aria-label="t('news.nextPage')">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </NotAvailablePopover>
        </li>
      </ul>
    </nav>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.news {
  display: flex;
  flex-direction: column;
  gap: var(--oc-space-5);
  padding: var(--oc-space-6) 0 var(--oc-space-5);
  scroll-margin-top: var(--oc-header-height);
}

.news-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--oc-space-5);
  margin: 0;
  padding: var(--oc-space-2) var(--oc-space-4);
  list-style: none;

  @include up(sm) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-inline: var(--oc-space-7);
  }

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.news-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgb(0 0 0 / 17.5%);
  border-radius: var(--oc-radius);
  background: var(--oc-surface);
  color: var(--oc-text);
  box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 7.5%);
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-8px);
  }

  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: 2px;
  }

  @include reduced-motion {
    transition: none;

    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
}

.news-card-img {
  display: block;
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.news-card-body {
  flex: 1 1 auto;
  padding: var(--oc-space-4);
}

.news-card-title {
  margin: 0 0 var(--oc-space-2);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: var(--oc-leading-tight);
}

.news-card-text {
  margin: 0;
  color: var(--oc-placeholder);
}

.news-card-footer {
  margin: 0;
  padding: var(--oc-space-2) var(--oc-space-4) var(--oc-space-3);
  color: var(--oc-placeholder);
}

.news-pagination {
  display: flex;
  justify-content: center;
  padding: var(--oc-space-5) var(--oc-space-4) 0;
}

.pagination {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;

  li + li {
    margin-left: -1px;
  }

  li:first-child .page-button {
    border-radius: var(--oc-radius) 0 0 var(--oc-radius);
  }

  li:last-child .page-button {
    border-radius: 0 var(--oc-radius) var(--oc-radius) 0;
  }
}

.page-button {
  min-width: var(--oc-tap-target);
  min-height: var(--oc-tap-target);
  padding: var(--oc-space-2) var(--oc-space-3);
  border: 1px solid var(--oc-gray-300);
  border-radius: 0;
  background: var(--oc-page);
  color: var(--oc-text);
  font: inherit;
  cursor: help;

  &:hover {
    background: var(--oc-gray-300);
  }

  &:focus-visible {
    position: relative;
    outline: var(--oc-focus-ring);
    outline-offset: 0;
  }

  &.is-current {
    border-color: var(--oc-yellow);
    background: var(--oc-yellow);
    color: var(--oc-yellow-ink);
    font-weight: 700;
    cursor: default;
  }
}
</style>

<style>
/* Not scoped: the tooltip content is teleported to <body>. */
.news-tooltip {
  z-index: var(--oc-z-popover);
  max-width: 200px;
  padding: var(--oc-space-1) var(--oc-space-2);
  border-radius: var(--oc-radius);
  background: var(--oc-black);
  color: var(--oc-white);
  font-family: var(--oc-font-sans);
  font-size: var(--oc-text-sm);
  line-height: var(--oc-leading);
  text-align: center;
}

.news-tooltip-arrow {
  fill: var(--oc-black);
}
</style>
