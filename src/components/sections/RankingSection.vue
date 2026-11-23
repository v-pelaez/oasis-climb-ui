<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import SectionBanner from '@/components/ui/SectionBanner.vue'
import type { RankingId } from '@/types/ranking'
import { countryFlag, countryName, rankings } from '@/data/rankings'

/**
 * Active tab. Exposed with `v-model` so other components (e.g. the search)
 * can open a given ranking from outside.
 */
const activeTab = defineModel<RankingId>({ default: 'dificultad' })
</script>

<template>
  <section id="ranking" class="ranking" aria-labelledby="ranking-title">
    <SectionBanner id="ranking-title" title="Rankings" />

    <TabsRoot v-model="activeTab" class="ranking-tabs">
      <TabsList class="ranking-tablist" aria-label="Rankings">
        <TabsTrigger v-for="tab in rankings" :key="tab.id" :value="tab.id" class="ranking-tab">
          {{ tab.title }}
        </TabsTrigger>
      </TabsList>

      <TabsContent v-for="tab in rankings" :key="tab.id" :value="tab.id" class="ranking-panel">
        <div class="ranking-table-wrap">
          <table class="ranking-table">
            <caption class="visually-hidden">
              {{
                tab.title
              }}
            </caption>
            <thead>
              <tr>
                <th v-for="header in tab.headers" :key="header" scope="col">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="entry in tab.data"
                :id="`ranking-${tab.id}-${entry.rank}`"
                :key="entry.rank"
              >
                <td class="ranking-rank">{{ entry.rank }}</td>
                <td>{{ entry.name }}</td>
                <td>
                  <span aria-hidden="true">{{ countryFlag(entry.country) }}</span>
                  {{ countryName(entry.country) ?? entry.country }}
                </td>
                <td>
                  <span class="ranking-badge">{{ entry.metric }}</span>
                </td>
                <td>{{ entry.points }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>
    </TabsRoot>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.ranking {
  padding: var(--oc-space-7) 0;
  scroll-margin-top: var(--oc-header-height);
}

.ranking-tabs {
  width: 100%;
  max-width: 1140px;
  margin: var(--oc-space-6) auto var(--oc-space-5);
  padding-inline: var(--oc-space-4);
}

.ranking-tablist {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--oc-gray-300);
}

.ranking-tab {
  min-height: var(--oc-tap-target);
  margin-bottom: -1px;
  padding: var(--oc-space-2) var(--oc-space-4);
  border: 1px solid transparent;
  border-radius: var(--oc-radius) var(--oc-radius) 0 0;
  background: none;
  color: var(--oc-text);
  font: inherit;
  cursor: pointer;
  transition:
    color 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    border-color: var(--oc-gray-300) var(--oc-gray-300) transparent;
  }

  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: -2px;
  }

  &[data-state='active'] {
    border-color: var(--oc-gray-300) var(--oc-gray-300) var(--oc-white);
    background: var(--oc-white);
    font-weight: 700;
  }

  @include reduced-motion {
    transition: none;
  }
}

.ranking-panel {
  margin-top: var(--oc-space-4);

  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: 2px;
  }
}

.ranking-table-wrap {
  overflow-x: auto;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--oc-white);
  color: var(--oc-text);

  th,
  td {
    padding: var(--oc-space-2);
    border: 1px solid var(--oc-gray-300);
    text-align: left;
    vertical-align: middle;
  }

  thead th {
    border-color: var(--oc-line);
    background: var(--oc-dark);
    color: var(--oc-white);
    font-weight: 700;
    white-space: nowrap;
  }

  tbody tr:nth-child(odd) {
    background: rgb(0 0 0 / 5%);
  }
}

.ranking-rank {
  font-weight: 700;
}

.ranking-badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  border-radius: 0.375rem;
  background: var(--oc-yellow);
  color: var(--oc-yellow-ink);
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

.visually-hidden {
  @include visually-hidden;
}
</style>
