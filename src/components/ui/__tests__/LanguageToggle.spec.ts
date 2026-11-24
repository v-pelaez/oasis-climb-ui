import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageToggle from '../LanguageToggle.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import { LOCALE_STORAGE_KEY } from '@/composables/useLocale'
import { testI18n } from '@/__tests__/setup'
import es from '@/locales/es.json'
import en from '@/locales/en.json'

afterEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

describe('LanguageToggle', () => {
  it('names the other language in that language, with its lang and label', async () => {
    const wrapper = mount(LanguageToggle)
    const button = wrapper.get('button')
    expect(button.attributes('type')).toBe('button')
    expect(button.get('.lang-toggle-name').text()).toBe('English')
    expect(button.get('.lang-toggle-code').text()).toBe('EN')
    expect(button.attributes('lang')).toBe('en')
    expect(button.attributes('aria-label')).toBe('Change language to English')
    // A globe, no flag
    expect(button.findAll('svg')).toHaveLength(1)
    expect(button.find('.country-flag').exists()).toBe(false)

    testI18n.global.locale.value = 'en'
    await wrapper.vm.$nextTick()
    expect(button.get('.lang-toggle-name').text()).toBe('Español')
    expect(button.get('.lang-toggle-code').text()).toBe('ES')
    expect(button.attributes('lang')).toBe('es')
    expect(button.attributes('aria-label')).toBe('Cambiar el idioma a español')
  })

  it('switches every text without reloading, saves the choice and updates the document', async () => {
    const meta = document.createElement('meta')
    meta.name = 'description'
    document.head.append(meta)

    const wrapper = mount(SiteHeader, { attachTo: document.body })
    const navText = () => wrapper.findAll('.site-header-nav .site-nav-link').map((a) => a.text())
    expect(navText()).toEqual(Object.values(es.nav))

    await wrapper.get('.lang-toggle').trigger('click')

    expect(navText()).toEqual(Object.values(en.nav))
    expect(wrapper.get('.site-search-input').attributes('placeholder')).toBe(
      en.header.searchPlaceholder,
    )
    expect(wrapper.get('.site-menu-btn').attributes('aria-label')).toBe(en.header.menuOpen)
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe(en.meta.title)
    expect(meta.content).toBe(en.meta.description)
    expect(wrapper.get('.lang-toggle').text()).toContain('Español')

    await wrapper.get('.lang-toggle').trigger('click')
    expect(navText()).toEqual(Object.values(es.nav))
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('es')
    expect(document.documentElement.lang).toBe('es')
    wrapper.unmount()
  })
})
