/* eslint-disable vue/one-component-per-file -- small test hosts */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import NewsSection from '../NewsSection.vue'
import RankingSection from '../RankingSection.vue'
import { news } from '@/data/news'
import { rankings } from '@/data/rankings'
import type { RankingId } from '@/types/ranking'
import es from '@/locales/es.json'
import en from '@/locales/en.json'
import { testI18n } from '@/__tests__/setup'

// jsdom has no ResizeObserver; Reka UI's floating content measures itself with it.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverStub)
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('NewsSection', () => {
  it('renders one card per news item inside the #novedades section', () => {
    const wrapper = mount(NewsSection)
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes('id')).toBe('novedades')
    expect(wrapper.findAll('.news-card-title').map((el) => el.text())).toEqual(
      news.map((item) => es.news.items[item.id as keyof typeof es.news.items].title),
    )
    expect(wrapper.findAll('article.news-card')).toHaveLength(news.length)
    expect(wrapper.find('#ranking').exists()).toBe(false)
  })

  it('lazy-loads every news image with its intrinsic size', () => {
    const wrapper = mount(NewsSection)
    const images = wrapper.findAll('img.news-card-img')
    expect(images).toHaveLength(news.length)
    images.forEach((img, i) => {
      expect(img.attributes('loading')).toBe('lazy')
      expect(img.attributes('decoding')).toBe('async')
      expect(img.attributes('width')).toBe(String(news[i]?.width))
      expect(img.attributes('height')).toBe(String(news[i]?.height))
    })
  })

  it('pagination is made of buttons that do not navigate', async () => {
    const wrapper = mount(NewsSection, { attachTo: document.body })
    const before = window.location.href
    const pagination = wrapper.get('nav.news-pagination')

    expect(pagination.find('a').exists()).toBe(false)
    const buttons = pagination.findAll('button')
    expect(buttons).toHaveLength(5)
    expect(buttons.every((b) => b.attributes('type') === 'button')).toBe(true)
    expect(pagination.get('[aria-current="page"]').text()).toBe('1')

    await pagination.get('[aria-label="Página siguiente"]').trigger('click')
    await flushPromises()

    expect(window.location.href).toBe(before)
    expect(document.body.textContent).toContain(
      'La paginación no está disponible en este prototipo.',
    )
    wrapper.unmount()
  })
})

describe('RankingSection', () => {
  const tab = (wrapper: ReturnType<typeof mount>, index: number) =>
    wrapper.findAll('[role="tab"]')[index]!

  const activeRows = () =>
    [...document.querySelectorAll('[role="tabpanel"][data-state="active"] tbody tr')].map(
      (tr) => tr.id,
    )

  it('renders the first ranking with stable line ids', () => {
    const wrapper = mount(RankingSection, { attachTo: document.body })
    expect(wrapper.attributes('id')).toBe('ranking')
    expect(tab(wrapper, 0).attributes('aria-selected')).toBe('true')
    expect(activeRows()).toEqual(
      rankings[0]!.data.map((entry) => `ranking-dificultad-${entry.rank}`),
    )
    expect(wrapper.find('.ranking-badge').text()).toBe(rankings[0]!.data[0]!.metric)
    wrapper.unmount()
  })

  it('changes tab on click and with the arrow keys', async () => {
    const wrapper = mount(RankingSection, { attachTo: document.body })

    await tab(wrapper, 1).trigger('mousedown', { button: 0 })
    await flushPromises()
    expect(tab(wrapper, 1).attributes('aria-selected')).toBe('true')
    expect(activeRows()[0]).toBe('ranking-velocidad-1')
    ;(tab(wrapper, 1).element as HTMLElement).focus()
    await tab(wrapper, 1).trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()
    expect(tab(wrapper, 0).attributes('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tab(wrapper, 0).element)

    await tab(wrapper, 0).trigger('keydown', { key: 'ArrowLeft' })
    await flushPromises()
    expect(tab(wrapper, 1).attributes('aria-selected')).toBe('true')
    wrapper.unmount()
  })

  it('follows and updates v-model', async () => {
    const active = ref<RankingId>('velocidad')
    const Host = defineComponent({
      render: () =>
        h(RankingSection, {
          modelValue: active.value,
          'onUpdate:modelValue': (value: RankingId) => (active.value = value),
        }),
    })
    const wrapper = mount(Host, { attachTo: document.body })
    expect(tab(wrapper, 1).attributes('aria-selected')).toBe('true')

    active.value = 'dificultad'
    await flushPromises()
    expect(tab(wrapper, 0).attributes('aria-selected')).toBe('true')

    await tab(wrapper, 1).trigger('mousedown', { button: 0 })
    await flushPromises()
    expect(active.value).toBe('velocidad')
    wrapper.unmount()
  })
})

describe('Formatting follows the active language', () => {
  it('news dates, countries and points', async () => {
    const Page = defineComponent({ render: () => [h(NewsSection), h(RankingSection)] })
    const wrapper = mount(Page, { attachTo: document.body })
    const firstRow = () => document.querySelector('#ranking-dificultad-1')!.textContent!
    const firstDate = () => wrapper.find('.news-card-footer').text()

    expect(firstDate()).toBe('Publicado hace 1 hora')
    expect(firstRow()).toContain('España')
    expect(firstRow()).toContain('4485')
    expect(wrapper.find('.news-card-title').text()).toBe(es.news.items.trad.title)

    testI18n.global.locale.value = 'en'
    await flushPromises()

    expect(firstDate()).toBe('Published 1 hour ago')
    expect(firstRow()).toContain('Spain')
    expect(firstRow()).toContain('4,485')
    expect(wrapper.find('.news-card-title').text()).toBe(en.news.items.trad.title)
    expect(wrapper.find('[role="tab"]').text()).toBe(en.ranking.tabs.dificultad)
    expect(wrapper.findAll('thead th').map((th) => th.text())).toContain(
      en.ranking.metric.dificultad,
    )
    wrapper.unmount()
  })

  it('ranking flags are inline SVG, hidden from assistive technology', () => {
    const wrapper = mount(RankingSection, { attachTo: document.body })
    const flag = wrapper.get('#ranking-dificultad-1 svg.country-flag')
    expect(flag.attributes('aria-hidden')).toBe('true')
    expect(flag.attributes('data-country')).toBe('ES')
    // No emoji flags (regional indicator symbols) left in the table
    expect(wrapper.text()).not.toMatch(/\p{Regional_Indicator}/u)
    wrapper.unmount()
  })
})

describe('News and ranking together', () => {
  it('do not repeat ids', () => {
    const Page = defineComponent({ render: () => [h(NewsSection), h(RankingSection)] })
    const wrapper = mount(Page, { attachTo: document.body })
    const ids = [...document.querySelectorAll('[id]')].map((el) => el.id)
    expect(new Set(ids).size).toBe(ids.length)
    wrapper.unmount()
  })
})
