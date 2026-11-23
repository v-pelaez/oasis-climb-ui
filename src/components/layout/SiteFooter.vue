<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import NotAvailablePopover from '@/components/ui/NotAvailablePopover.vue'
import { navLinks, socialLinks } from '@/data/site'

const email = ref('')
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer-main">
      <div class="site-footer-cols">
        <section class="site-footer-col" aria-labelledby="footer-menu-title">
          <h2 id="footer-menu-title" class="site-footer-title">Oasis Climb</h2>
          <ul class="site-footer-list">
            <li v-for="item in navLinks" :key="item.href">
              <a :href="item.href" class="site-footer-link">{{ item.text }}</a>
            </li>
          </ul>
        </section>

        <section class="site-footer-col" aria-labelledby="footer-social-title">
          <h2 id="footer-social-title" class="site-footer-title">Síguenos</h2>
          <ul class="site-footer-list site-footer-social">
            <li v-for="social in socialLinks" :key="social.name">
              <a
                v-if="social.url"
                :href="social.url"
                class="site-footer-link site-footer-social-link"
                target="_blank"
                rel="noopener"
              >
                <AppIcon :name="social.icon" size="1.25em" />
                {{ social.name }}
              </a>
              <NotAvailablePopover v-else :subject="`El perfil de ${social.name}`" side="right">
                <button type="button" class="site-footer-link site-footer-social-link">
                  <AppIcon :name="social.icon" size="1.25em" />
                  {{ social.name }}
                </button>
              </NotAvailablePopover>
            </li>
          </ul>
        </section>

        <section class="site-footer-col" aria-labelledby="footer-newsletter-title">
          <h2 id="footer-newsletter-title" class="site-footer-title">
            Suscríbete a nuestro boletín de Novedades
          </h2>
          <form class="site-footer-newsletter" @submit.prevent>
            <label for="footer-email" class="visually-hidden">Correo electrónico</label>
            <input
              id="footer-email"
              v-model="email"
              class="site-footer-input"
              type="email"
              autocomplete="email"
              placeholder="correo@electronico.com"
            />
            <NotAvailablePopover subject="La suscripción" side="top">
              <button type="button" class="site-footer-btn">Suscríbete</button>
            </NotAvailablePopover>
          </form>
        </section>
      </div>

      <svg
        class="site-footer-mountain"
        width="200"
        height="150"
        viewBox="0 0 200 150"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path class="mountain-path" d="M20 110 L60 40 L100 90 L140 30 L180 110 L20 110" />
        <path
          class="mountain-path mountain-path-animated"
          d="M20 110 L60 40 L100 90 L140 30 L180 110 L20 110"
        />
      </svg>
    </div>

    <div class="site-footer-legal">
      <h2 class="site-footer-title">Información legal</h2>
      <p class="site-footer-legal-text">
        Este trabajo ha sido elaborado por V. Peláez con fines académicos. La autoría de todo el
        contenido corresponde exclusivamente a V. Peláez. El trabajo no tiene carácter comercial ni
        busca obtener beneficio económico alguno. Las imágenes utilizadas provienen de fuentes como
        Flaticon y Freepik, y se emplean respetando sus licencias de uso gratuito y atribución.Queda
        prohibida la reproducción o distribución del contenido para fines comerciales sin el
        consentimiento explícito del autor. Se agradece la adecuada atribución de las imágenes
        conforme a las condiciones de las plataformas.
      </p>
      <a
        class="site-footer-link site-footer-social-link"
        href="https://github.com/v-pelaez"
        target="_blank"
        rel="noopener"
      >
        <AppIcon name="github" size="1.25em" />
        Github
      </a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.site-footer {
  border: 1px solid var(--oc-white);
  background: var(--oc-dark);
  color: var(--oc-white);
  font-family: var(--oc-font-sans);
  text-align: center;
}

.site-footer-main {
  max-width: 1320px;
  margin: 0 auto;
  padding: var(--oc-space-6) var(--oc-space-4) var(--oc-space-4);
}

.site-footer-cols {
  display: grid;
  gap: var(--oc-space-5);

  @include up(md) {
    grid-template-columns: repeat(3, 1fr);
  }

  @include up(lg) {
    text-align: start;
  }
}

.site-footer-title {
  margin: 0 0 var(--oc-space-5);
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
}

.site-footer-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-footer-social {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--oc-space-1);

  @include up(lg) {
    align-items: flex-start;
  }
}

.site-footer-link {
  color: var(--oc-white);
  text-decoration: none;
  text-underline-offset: 0.2em;

  &:hover {
    color: var(--oc-yellow);
    text-decoration: underline;
  }
}

.site-footer-social-link {
  display: inline-flex;
  align-items: center;
  gap: var(--oc-space-2);
  min-height: 32px;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  cursor: pointer;
}

.site-footer-newsletter {
  display: flex;
  flex-direction: column;
  gap: var(--oc-space-4);
}

.site-footer-input {
  width: 100%;
  padding: 6px var(--oc-space-3);
  border: 1px solid var(--oc-line);
  border-radius: var(--oc-radius);
  background: var(--oc-surface);
  color: var(--oc-text);

  &::placeholder {
    color: var(--oc-placeholder);
  }
}

.site-footer-btn {
  width: 100%;
  padding: 6px var(--oc-space-3);
  border: 1px solid var(--oc-yellow);
  border-radius: var(--oc-radius);
  background: var(--oc-yellow);
  color: var(--oc-yellow-ink);
  cursor: pointer;

  &:hover {
    filter: brightness(0.92);
  }
}

.site-footer-link,
.site-footer-input,
.site-footer-btn {
  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: 2px;
  }
}

.site-footer-mountain {
  display: block;
  margin: var(--oc-space-4) auto 0;
}

.mountain-path {
  fill: none;
  stroke: var(--oc-gray-300);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mountain-path-animated {
  stroke: var(--oc-yellow);
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation: draw-mountain 4s infinite ease-in-out;
}

@keyframes draw-mountain {
  0% {
    stroke-dashoffset: 500;
    opacity: 0;
  }

  50% {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  100% {
    stroke-dashoffset: -500;
    opacity: 0;
  }
}

@include reduced-motion {
  .mountain-path-animated {
    animation: none;
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

.site-footer-legal {
  padding: var(--oc-space-4);
  border-top: 1px solid var(--oc-white);
}

.site-footer-legal-text {
  max-width: 900px;
  margin: 0 auto var(--oc-space-4);
  font-size: 0.85rem;
  line-height: 1.4;

  @include up(lg) {
    padding: 0 var(--oc-space-7);
  }
}
</style>
