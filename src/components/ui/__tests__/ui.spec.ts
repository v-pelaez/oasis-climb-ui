import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import AppIcon from '../AppIcon.vue'
import SectionBanner from '../SectionBanner.vue'
import NotAvailablePopover from '../NotAvailablePopover.vue'
import CountryFlag from '../CountryFlag.vue'

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

describe('AppIcon', () => {
  it('is decorative by default and named when labelled', () => {
    const decorative = mount(AppIcon, { props: { name: 'search' } })
    expect(decorative.attributes('aria-hidden')).toBe('true')
    expect(decorative.find('path').exists()).toBe(true)

    const named = mount(AppIcon, { props: { name: 'github', label: 'GitHub' } })
    expect(named.attributes('role')).toBe('img')
    expect(named.attributes('aria-label')).toBe('GitHub')
    expect(named.attributes('aria-hidden')).toBeUndefined()
  })
})

describe('SectionBanner', () => {
  it('renders the title at the requested heading level', () => {
    const wrapper = mount(SectionBanner, { props: { title: 'Novedades', level: 3 } })
    expect(wrapper.get('h3.section-banner-title').text()).toBe('Novedades')
    expect(
      mount(SectionBanner, { props: { title: 'Ranking' } })
        .find('h2')
        .exists(),
    ).toBe(true)
  })
})

describe('NotAvailablePopover', () => {
  it('tells the action is not available when the trigger is pressed', async () => {
    const Host = defineComponent({
      render: () =>
        h(
          NotAvailablePopover,
          { message: 'La búsqueda no está disponible en este prototipo.' },
          () => h('button', { type: 'button', class: 'trigger' }, 'Buscar'),
        ),
    })
    const wrapper = mount(Host, { attachTo: document.body })
    expect(document.body.textContent).not.toContain('no está disponible')

    await wrapper.get('.trigger').trigger('click')
    await flushPromises()

    expect(document.body.textContent).toContain('Acción no disponible')
    expect(document.body.textContent).toContain('La búsqueda no está disponible en este prototipo.')
    expect(wrapper.get('.trigger').attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })
})

describe('CountryFlag', () => {
  it('draws a decorative inline SVG for known codes and nothing for unknown ones', () => {
    const flag = mount(CountryFlag, { props: { code: 'cz' } })
    expect(flag.element.tagName.toLowerCase()).toBe('svg')
    expect(flag.attributes('aria-hidden')).toBe('true')
    expect(flag.attributes('data-country')).toBe('CZ')
    expect(flag.findAll('rect, polygon').length).toBeGreaterThan(1)
    // Shapes are real SVG elements (rendered in the SVG namespace), not unknown HTML tags
    expect(flag.get('polygon').element.namespaceURI).toBe('http://www.w3.org/2000/svg')

    expect(
      mount(CountryFlag, { props: { code: 'XX' } })
        .find('svg')
        .exists(),
    ).toBe(false)
  })
})
