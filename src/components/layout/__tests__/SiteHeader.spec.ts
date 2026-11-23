import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteHeader from '../SiteHeader.vue'
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
})
