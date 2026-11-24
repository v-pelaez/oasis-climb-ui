import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SiteHeader from '../SiteHeader.vue'
import NotAvailablePopover from '@/components/ui/NotAvailablePopover.vue'
import { navLinks } from '@/data/site'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('SiteHeader', () => {
  it('toggles the menu panel with an accessible button', async () => {
    const wrapper = mount(SiteHeader, { attachTo: document.body })
    const button = wrapper.get('.site-menu-btn')
    const panelId = button.attributes('aria-controls')!
    const panel = wrapper.get(`#${panelId}`)

    expect(button.attributes('aria-expanded')).toBe('false')
    expect(button.attributes('aria-label')).toBe('Abrir menú')
    expect(panel.isVisible()).toBe(false)

    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(button.attributes('aria-label')).toBe('Cerrar menú')
    expect(panel.isVisible()).toBe(true)

    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('closes the menu when a link is chosen and marks it as current', async () => {
    const wrapper = mount(SiteHeader, { attachTo: document.body })
    const button = wrapper.get('.site-menu-btn')
    await button.trigger('click')

    const links = wrapper.findAll('.site-menu .site-nav-link')
    expect(links).toHaveLength(navLinks.length)
    await links[1]!.trigger('click')

    expect(button.attributes('aria-expanded')).toBe('false')
    expect(links[1]!.attributes('aria-current')).toBe('true')
    expect(links[0]!.attributes('aria-current')).toBeUndefined()
    wrapper.unmount()
  })

  it('has a skip link to the main content and a logo that resolves', () => {
    const wrapper = mount(SiteHeader)
    expect(wrapper.get('.skip-link').attributes('href')).toBe('#main')
    expect(wrapper.get('.site-header-logo img').attributes('src')).toMatch(/OasisClimb\.svg/)
    wrapper.unmount()
  })

  it('has a real search in the bar and at the top of the touch menu, with no «not available» popover', () => {
    const wrapper = mount(SiteHeader)
    expect(wrapper.get('.site-header-tools .site-search').attributes('role')).toBe('search')
    expect(wrapper.get('.site-menu > .site-search').classes()).toContain('is-menu')
    expect(wrapper.findAll('.site-search input[role="combobox"]')).toHaveLength(2)
    expect(wrapper.findComponent(NotAvailablePopover).exists()).toBe(false)
    wrapper.unmount()
  })

  it('closes the touch menu when a search result is chosen', async () => {
    vi.useFakeTimers()
    Element.prototype.scrollIntoView = vi.fn()
    const section = document.createElement('section')
    section.id = 'about-us'
    document.body.append(section)
    const wrapper = mount(SiteHeader, { attachTo: document.body })
    const button = wrapper.get('.site-menu-btn')
    await button.trigger('click')

    const input = wrapper.get('.site-menu .site-search-input')
    await input.setValue('sobre')
    vi.advanceTimersByTime(200)
    await flushPromises()
    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(button.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(section)
    expect(section.classList.contains('is-search-hit')).toBe(true)
    wrapper.unmount()
    vi.useRealTimers()
  })
})
