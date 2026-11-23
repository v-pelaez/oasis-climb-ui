import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, provide, ref } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import SiteSearch from '../SiteSearch.vue'
import RankingSection from '@/components/sections/RankingSection.vue'
import { RANKING_TAB_KEY } from '@/composables/useSearch'
import { testI18n } from '@/__tests__/setup'
import type { RankingId } from '@/types/ranking'

const scrollIntoView = vi.fn()

/** The search next to the ranking, sharing its tab like `HomeView` does. */
const Harness = defineComponent({
  emits: ['select'],
  setup(_, { emit }) {
    const tab = ref<RankingId>('dificultad')
    provide(RANKING_TAB_KEY, tab)
    return () => [
      h(SiteSearch, { onSelect: (entry: unknown) => emit('select', entry) }),
      h(RankingSection, {
        modelValue: tab.value,
        'onUpdate:modelValue': (v: RankingId) => (tab.value = v),
      }),
    ]
  },
})

let wrapper: VueWrapper | undefined

beforeEach(() => {
  vi.useFakeTimers()
  Element.prototype.scrollIntoView = scrollIntoView
  scrollIntoView.mockClear()
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.useRealTimers()
  document.body.innerHTML = ''
})

async function type(text: string) {
  const input = wrapper!.get('input')
  await input.setValue(text)
  vi.advanceTimersByTime(200)
  await flushPromises()
  return input
}

describe('SiteSearch', () => {
  it('lists grouped results with the match marked', async () => {
    wrapper = mount(Harness, { attachTo: document.body })
    await type('nov')

    const input = wrapper.get('input')
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('.search-group-label').map((el) => el.text())).toEqual([
      'Ranking',
      'Secciones',
    ])
    const marks = wrapper.findAll('.search-result mark').map((el) => el.text())
    expect(marks).toEqual(['Nov', 'Nov', 'Nov', 'Nov'])
  })

  it('waits for 2 characters and shows the translated no-results message', async () => {
    wrapper = mount(Harness, { attachTo: document.body })
    await type('b')
    expect(wrapper.find('.search-results').exists()).toBe(false)

    await type('boulder')
    expect(wrapper.get('.search-empty').text()).toBe('Sin resultados para «boulder».')

    testI18n.global.locale.value = 'en'
    await flushPromises()
    expect(wrapper.get('.search-empty').text()).toBe('No results for “boulder”.')
  })

  it('moves with the arrows, closes with Esc', async () => {
    wrapper = mount(Harness, { attachTo: document.body })
    const input = await type('novak')
    const highlighted = () => wrapper!.find('.search-result[data-highlighted]').text()

    expect(highlighted()).toContain('Jan Novak')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(highlighted()).toContain('David Novak')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(highlighted()).toContain('Jan Novak')

    await input.trigger('keydown', { key: 'Escape' })
    await flushPromises()
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.search-results').exists()).toBe(false)
  })

  it('Enter on «Martina» opens the speed tab, scrolls to the climber and highlights it', async () => {
    wrapper = mount(Harness, { attachTo: document.body })
    expect(wrapper.find('#ranking-velocidad-1').exists()).toBe(false)

    const input = await type('Martina')
    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    const target = document.getElementById('ranking-velocidad-1')!
    expect(target).not.toBeNull()
    expect(wrapper.get('[role="tab"][data-state="active"]').text()).toBe('Ranking de velocidad')
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' })
    expect(target.classList.contains('is-search-hit')).toBe(true)
    expect(document.activeElement).toBe(target)
    expect(wrapper.emitted('select')![0]![0]).toMatchObject({ targetId: 'ranking-velocidad-1' })
    expect(input.attributes('aria-expanded')).toBe('false')
    expect((input.element as HTMLInputElement).value).toBe('Martina')

    vi.advanceTimersByTime(2000)
    expect(target.classList.contains('is-search-hit')).toBe(false)
  })

  it('scrolls without animation when reduced motion is on', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      addEventListener() {},
      removeEventListener() {},
    }))
    wrapper = mount(Harness, { attachTo: document.body })
    const input = await type('martina')
    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'center' })
    vi.unstubAllGlobals()
  })
})
