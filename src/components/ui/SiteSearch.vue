<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxViewport,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { RANKING_TAB_KEY, useSearch, type SearchEntry } from '@/composables/useSearch'

/**
 * Client-side search over the page. `bar`: in the desktop header with a
 * floating list; `menu`: at the top of the touch menu panel, results in the flow.
 */
const { variant = 'bar' } = defineProps<{ variant?: 'bar' | 'menu' }>()

const emit = defineEmits<{
  /** A result was chosen (after the page has scrolled to it). */
  select: [entry: SearchEntry]
}>()

/** Delay between the last keystroke and the search. */
const DEBOUNCE_MS = 120
/** How long the element jumped to keeps the outline. */
const HIGHLIGHT_MS = 2000
const HIGHLIGHT_CLASS = 'is-search-hit'

const { t } = useI18n()
const reducedMotion = useReducedMotion()
const rankingTab = inject(RANKING_TAB_KEY, null)

const term = ref('')
const query = ref('')
const open = ref(false)
const input = useTemplateRef<InstanceType<typeof ComboboxInput>>('input')

const { results, groups, searchable } = useSearch(query)
const byId = computed(() => new Map(results.value.map((r) => [r.entry.id, r.entry])))

let debounceTimer: ReturnType<typeof setTimeout> | undefined
watch(term, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    query.value = value
    open.value = searchable.value
  }, DEBOUNCE_MS)
})

/** Reka asks to open or close (typing, Esc, click outside): only open with a real query. */
function onOpenChange(value: boolean) {
  open.value = value && searchable.value
}

function onEscape(event: KeyboardEvent) {
  // Close the list without letting the header close the touch menu too.
  if (!open.value) return
  event.stopPropagation()
  open.value = false
}

function focusInput() {
  const el = input.value?.$el as HTMLInputElement | undefined
  el?.focus()
  open.value = searchable.value
}

let highlighted: { el: HTMLElement; timer: ReturnType<typeof setTimeout> } | undefined

function clearHighlight() {
  if (!highlighted) return
  clearTimeout(highlighted.timer)
  highlighted.el.classList.remove(HIGHLIGHT_CLASS)
  highlighted = undefined
}

/** Scroll to the element, outline it for a moment and move focus there. */
function reveal(el: HTMLElement, block: ScrollLogicalPosition) {
  el.scrollIntoView?.({ behavior: reducedMotion.value ? 'auto' : 'smooth', block })

  clearHighlight()
  void el.offsetWidth // restart the fade if the same element is picked again
  el.classList.add(HIGHLIGHT_CLASS)
  highlighted = { el, timer: setTimeout(clearHighlight, HIGHLIGHT_MS) }

  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/** The element with `id`, waiting a few ticks for a just-opened ranking tab to render it. */
async function findTarget(id: string): Promise<HTMLElement | null> {
  for (let tick = 0; tick < 4; tick++) {
    await nextTick()
    const el = document.getElementById(id)
    if (el) return el
  }
  return null
}

async function onSelect(event: Event, id: string) {
  // Keep the typed text: the combobox has no selected value, it only navigates.
  event.preventDefault()
  const entry = byId.value.get(id)
  if (!entry) return
  open.value = false

  if (entry.tab && rankingTab) rankingTab.value = entry.tab
  // News are all on the first page (pagination is not functional), so no page switch.
  const target = await findTarget(entry.targetId)
  if (target) reveal(target, entry.group === 'section' ? 'start' : 'center')
  emit('select', entry)
}

onBeforeUnmount(() => {
  clearTimeout(debounceTimer)
  clearHighlight()
})
</script>

<template>
  <form class="site-search" :class="`is-${variant}`" role="search" @submit.prevent>
    <ComboboxRoot
      :open="open"
      ignore-filter
      :reset-search-term-on-blur="false"
      :reset-search-term-on-select="false"
      class="site-search-root"
      @update:open="onOpenChange"
      @keydown.esc="onEscape"
    >
      <ComboboxAnchor class="site-search-anchor">
        <ComboboxInput
          ref="input"
          v-model="term"
          class="site-search-input"
          type="search"
          autocomplete="off"
          :placeholder="t('header.searchPlaceholder')"
          :aria-label="t('header.searchLabel')"
        />
        <button
          type="button"
          class="site-search-btn"
          tabindex="-1"
          :aria-label="t('header.searchLabel')"
          @click="focusInput"
        >
          <AppIcon name="search" size="18px" />
        </button>
      </ComboboxAnchor>

      <ComboboxContent class="search-results" :aria-label="t('search.listLabel')">
        <ComboboxViewport>
          <ComboboxGroup v-for="group in groups" :key="group.group" class="search-group">
            <ComboboxLabel class="search-group-label">
              {{ t(`search.groups.${group.group}`) }}
            </ComboboxLabel>
            <ComboboxItem
              v-for="result in group.results"
              :key="result.entry.id"
              :value="result.entry.id"
              :text-value="result.entry.title"
              class="search-result"
              @select="onSelect($event, result.entry.id)"
            >
              <span class="search-result-main">
                <span class="search-result-title"
                  >{{ result.title.before
                  }}<mark v-if="result.title.hit">{{ result.title.hit }}</mark
                  >{{ result.title.after }}</span
                >
                <span v-if="result.snippet" class="search-result-snippet"
                  >{{ result.snippet.before }}<mark>{{ result.snippet.hit }}</mark
                  >{{ result.snippet.after }}</span
                >
              </span>
              <span v-if="result.entry.meta" class="search-result-meta">{{
                result.entry.meta
              }}</span>
            </ComboboxItem>
          </ComboboxGroup>
          <p v-if="!groups.length" class="search-empty" role="status">
            {{ t('search.empty', { query: query.trim() }) }}
          </p>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxRoot>
  </form>
</template>

<style scoped lang="scss">
.site-search,
.site-search-root {
  position: relative;
}

.site-search-anchor {
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
  font: inherit;
  font-size: 15px;

  &::placeholder {
    color: var(--oc-placeholder);
  }

  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: 2px;
  }
}

.site-search-btn {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 38px;
  border: 0;
  border-radius: var(--oc-radius);
  background: var(--oc-yellow);
  color: var(--oc-yellow-ink);
  cursor: pointer;

  &:focus-visible {
    outline: var(--oc-focus-ring);
    outline-offset: 2px;
  }
}

.search-results {
  margin: 0;
  padding: 6px 0;
  border-top: 3px solid var(--oc-yellow);
  background: var(--oc-surface);
  color: var(--oc-text);
  font-family: var(--oc-font-sans);
}

.is-bar .search-results {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  z-index: var(--oc-z-popover);
  min-width: 300px;
  max-height: min(70vh, 480px);
  overflow-y: auto;
  box-shadow: var(--oc-shadow-lg);
}

// Touch: the box fills the menu panel and results flow under it.
.is-menu {
  margin: var(--oc-space-1) 0 var(--oc-space-2);

  .site-search-input {
    flex: 1;
    width: auto;
    min-width: 0;
    height: var(--oc-tap-target);
  }

  .site-search-btn {
    width: 48px;
    height: var(--oc-tap-target);
  }

  .search-results {
    margin-top: 6px;
  }

  .search-result {
    min-height: var(--oc-tap-target);
  }
}

.search-group-label {
  padding: 6px var(--oc-space-3) 2px;
  color: var(--oc-placeholder);
  font-size: 11px;
  font-weight: 700;
  line-height: var(--oc-leading-tight);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.search-result {
  display: flex;
  gap: var(--oc-space-2);
  align-items: baseline;
  padding: var(--oc-space-2) var(--oc-space-3);
  cursor: pointer;

  &[data-highlighted] {
    background: color-mix(in srgb, var(--oc-yellow) 25%, transparent);
    box-shadow: inset 3px 0 0 var(--oc-yellow);
  }

  mark {
    padding: 0;
    background: color-mix(in srgb, var(--oc-yellow) 55%, transparent);
    color: inherit;
  }
}

.search-result-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.search-result-title {
  font-weight: 600;
}

.search-result-snippet {
  color: var(--oc-placeholder);
  font-size: var(--oc-text-xs);
}

.search-result-meta {
  margin-left: auto;
  color: var(--oc-placeholder);
  font-size: var(--oc-text-xs);
  white-space: nowrap;
}

.search-empty {
  margin: 0;
  padding: var(--oc-space-3);
}
</style>
