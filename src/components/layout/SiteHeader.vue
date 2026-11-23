<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import LanguageToggle from '@/components/ui/LanguageToggle.vue'
import NotAvailablePopover from '@/components/ui/NotAvailablePopover.vue'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { navLinks } from '@/data/site'
import logoUrl from '@/assets/OasisClimb.svg'

const MENU_ID = 'site-menu'

const { t } = useI18n()

const sectionIds = navLinks.map((link) => link.href.slice(1))
const { activeId } = useScrollSpy(sectionIds)

const searchQuery = ref('')
const menuOpen = ref(false)
const menuButton = useTemplateRef<HTMLButtonElement>('menuButton')

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (restoreFocus) nextTick(() => menuButton.value?.focus())
}

function onNavigate(href: string) {
  activeId.value = href.slice(1)
  closeMenu()
}
</script>

<template>
  <header class="site-header" @keydown.esc="closeMenu({ restoreFocus: true })">
    <a class="skip-link" href="#main">{{ t('header.skipLink') }}</a>

    <div class="site-header-bar">
      <a class="site-header-logo" href="#" :aria-label="t('header.home')">
        <img :src="logoUrl" alt="" width="120" height="57" />
      </a>

      <nav class="site-header-nav" :aria-label="t('header.navLabel')">
        <ul class="site-nav">
          <li v-for="link in navLinks" :key="link.href" class="site-nav-item">
            <a
              class="site-nav-link"
              :href="link.href"
              :aria-current="activeId === link.href.slice(1) ? 'true' : undefined"
              @click="onNavigate(link.href)"
            >
              {{ t(`nav.${link.key}`) }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="site-header-tools">
        <!-- Placeholder search until RFP-25 (real search). -->
        <form class="site-search" role="search" @submit.prevent>
          <input
            v-model="searchQuery"
            class="site-search-input"
            type="search"
            :placeholder="t('header.searchPlaceholder')"
            :aria-label="t('header.searchLabel')"
          />
          <NotAvailablePopover :message="t('notAvailable.search')" side="bottom">
            <button type="button" class="site-search-btn" :aria-label="t('header.searchLabel')">
              <AppIcon name="search" size="18px" />
            </button>
          </NotAvailablePopover>
        </form>

        <LanguageToggle />

        <button
          ref="menuButton"
          type="button"
          class="site-menu-btn"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          :aria-controls="MENU_ID"
          :aria-label="menuOpen ? t('header.menuClose') : t('header.menuOpen')"
          @click="toggleMenu"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" size="18px" />
        </button>
      </div>
    </div>

    <nav v-show="menuOpen" :id="MENU_ID" class="site-menu" :aria-label="t('header.navLabel')">
      <ul class="site-nav">
        <li v-for="link in navLinks" :key="link.href" class="site-nav-item">
          <a
            class="site-nav-link"
            :href="link.href"
            :aria-current="activeId === link.href.slice(1) ? 'true' : undefined"
            @click="onNavigate(link.href)"
          >
            {{ t(`nav.${link.key}`) }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins' as *;

.site-header {
  position: sticky;
  top: 0;
  z-index: var(--oc-z-header);
  background: var(--oc-dark);
  color: var(--oc-fg);
  font-family: var(--oc-font-sans);
}

.skip-link {
  position: absolute;
  top: var(--oc-space-2);
  left: var(--oc-space-2);
  z-index: 1;
  padding: var(--oc-space-2) var(--oc-space-4);
  background: var(--oc-yellow);
  color: var(--oc-yellow-ink);
  font-weight: 600;
  transform: translateY(calc(-100% - var(--oc-space-4)));

  &:focus {
    transform: none;
  }
}

.site-header-bar {
  display: flex;
  align-items: center;
  gap: var(--oc-space-4);
  min-height: var(--oc-header-height);
  padding: var(--oc-space-2) var(--oc-space-4);
}

.site-header-logo {
  display: inline-flex;
  flex: none;

  img {
    display: block;
    width: 120px;
    height: auto;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.site-header-nav {
  flex: 1;
}

.site-nav {
  display: flex;
  gap: var(--oc-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-nav-link {
  display: block;
  padding: var(--oc-space-2) 10px;
  border-radius: var(--oc-radius);
  color: var(--oc-muted);
  font-size: 15px;
  text-decoration: none;

  &:hover {
    color: var(--oc-fg);
  }

  &[aria-current='true'] {
    color: var(--oc-fg);
    box-shadow: inset 0 -2px 0 var(--oc-yellow);
  }
}

.site-header-tools {
  display: flex;
  align-items: center;
  gap: var(--oc-space-3);
  margin-left: auto;
}

.site-search {
  display: flex;
  align-items: center;
  gap: var(--oc-space-2);
}

.site-search-input {
  width: 200px;
  height: 38px;
  padding: 6px var(--oc-space-3);
  border: 1px solid var(--oc-line);
  border-radius: var(--oc-radius);
  background: var(--oc-surface);
  color: var(--oc-text);
  font-size: 15px;

  &::placeholder {
    color: var(--oc-placeholder);
  }
}

.site-search-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 38px;
  border: 0;
  border-radius: var(--oc-radius);
  background: var(--oc-yellow);
  color: var(--oc-yellow-ink);
  cursor: pointer;
}

.site-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--oc-tap-target);
  height: var(--oc-tap-target);
  border: 1px solid var(--oc-line);
  border-radius: var(--oc-radius);
  background: transparent;
  color: var(--oc-fg);
  cursor: pointer;
}

.site-search-btn,
.site-menu-btn,
.site-nav-link,
.site-header-logo {
  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: 2px;
  }
}

.site-menu {
  padding: var(--oc-space-2) var(--oc-space-4) var(--oc-space-4);
  border-top: 1px solid var(--oc-line);

  .site-nav {
    flex-direction: column;
    gap: 0;
  }

  .site-nav-link {
    padding: var(--oc-space-3) var(--oc-space-1);
    font-size: var(--oc-text-base);

    &[aria-current='true'] {
      padding-left: var(--oc-space-3);
      box-shadow: inset 3px 0 0 var(--oc-yellow);
    }
  }
}

// Touch sizes: links fold into the panel, the placeholder search is hidden.
@include down(lg) {
  .site-header-nav,
  .site-search {
    display: none;
  }
}

@include up(lg) {
  .site-menu-btn,
  .site-menu {
    display: none !important;
  }
}

@include reduced-motion {
  .site-header-logo img {
    transition: none;
  }
}
</style>
