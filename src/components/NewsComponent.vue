<template>
  <div id="novedades" class="p-4"></div>
  <div class="container-fluid d-flex flex-column gap-4 py-3">
    <div class="row col-12 bg-primary text-black text-uppercase p-5 recorte-bandera">
      <h3 class="fw-bold fst-italic">Novedades</h3>
    </div>

    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 p-2 px-5">
      <div v-for="noticia in noticias" :key="noticia.title" class="col">
        <div
          class="card h-100 shadow-sm"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Esto es una noticia de ejemplo"
        >
          <img
            :src="noticia.img"
            class="card-img-top noticia-img"
            :alt="noticia.title"
          />
          <div class="card-body">
            <h5 class="card-title fw-bold">{{ noticia.title }}</h5>
            <p class="card-text text-secondary">
              {{ noticia.text }}
            </p>
          </div>
          <div class="card-footer bg-white border-top-0">
            <small class="text-muted">Publicado {{ formatRelativeDate(noticia.published) }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div aria-label="Page navigation example" class="d-flex justify-content-center mb-4 mt-4">
    <ul
      class="pagination"
      data-bs-toggle="popover"
      data-bs-trigger="hover focus"
      data-bs-title="Acción no disponible"
      data-bs-content="La paginación no está disponible en este prototipo."
    >
      <li class="page-item">
        <a class="page-link bg-light text-dark" href="" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item active"><a class="page-link">1</a></li>
      <li class="page-item"><a class="page-link bg-light text-dark" >2</a></li>
      <li class="page-item"><a class="page-link bg-light text-dark" >3</a></li>
      <li class="page-item">
        <a class="page-link bg-light text-dark"  aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </div>
  <div id="ranking"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// Importamos los componentes de Bootstrap necesarios
import { Tooltip, Popover } from 'bootstrap'
import { formatRelativeDate, news as noticias } from '@/data/news'

onMounted(() => {
  // Inicializar todos los Tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltipTriggerList.forEach((el) => new Tooltip(el))

  // Inicializar todos los Popovers
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
  popoverTriggerList.forEach((el) => new Popover(el))
})
</script>

<style scoped>
.recorte-bandera {
  clip-path: polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%);
  margin-bottom: 2rem;
}

.noticia-img {
  height: 220px;
  object-fit: cover;
}

.card {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-8px);
}

.pagination {
  cursor: help;
}
</style>