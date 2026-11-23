/* eslint-disable vue/one-component-per-file -- small test hosts */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import NewsSection from '../NewsSection.vue'
import RankingSection from '../RankingSection.vue'
import { news } from '@/data/news'
import { rankings } from '@/data/rankings'
import type { RankingId } from '@/types/ranking'

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
      news.map((item) => item.title),
    )
    expect(wrapper.findAll('article.news-card')).toHaveLength(news.length)
    expect(wrapper.find('#ranking').exists()).toBe(false)
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

describe('News and ranking together', () => {
  it('do not repeat ids', () => {
    const Page = defineComponent({ render: () => [h(NewsSection), h(RankingSection)] })
    const wrapper = mount(Page, { attachTo: document.body })
    const ids = [...document.querySelectorAll('[id]')].map((el) => el.id)
    expect(new Set(ids).size).toBe(ids.length)
    wrapper.unmount()
  })
})
