<template>
  <section id="ranking" class="py-5">
    <div class="row col-12 bg-primary text-black text-uppercase p-5 recorte-bandera">
      <h3 class="fw-bold fst-italic">Rankings</h3>
    </div>

    <div class="container my-4">
      <ul id="rankingTabs" class="nav nav-tabs" role="tablist">
        <li v-for="tab in rankings" :key="tab.id" class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === tab.id }"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.id"
            @click="activeTab = tab.id"
          >
            {{ tab.title }}
          </button>
        </li>
      </ul>

      <div id="rankingTabsContent" class="tab-content mt-3">
        <div
          v-for="tab in rankings"
          :key="tab.id"
          class="tab-pane fade"
          :class="{ 'show active': activeTab === tab.id }"
          role="tabpanel"
        >
          <div class="table-responsive">
            <table class="table table-striped table-bordered align-middle">
              <thead class="table-dark">
                <tr>
                  <th v-for="header in tab.headers" :key="header">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in tab.data" :key="row.rank">
                  <td class="fw-bold">{{ row.rank }}</td>
                  <td>{{ row.name }}</td>
                  <td>{{ countryFlag(row.country) }} {{ countryName(row.country) }}</td>
                  <td >
                    <span class="badge bg-primary text-black">{{ row.metric }}</span>
                  </td>
                  <td>{{ row.points }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { RankingId } from '@/types/ranking'
import { countryFlag, countryName, rankings } from '@/data/rankings'

// Estado para controlar la pestaña activa (por defecto la primera)
const activeTab = ref<RankingId>('dificultad')
</script>

<style scoped>
.recorte-bandera {
  clip-path: polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%);
  margin-bottom: 2rem;
}

.table {
  background-color: white;
}

.nav-link {
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Mejora visual para la pestaña activa */
.nav-link.active {
  font-weight: bold;
}
</style>