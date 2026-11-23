import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useI18n } from 'vue-i18n'
import {
  LOCALE_STORAGE_KEY,
  detectLocale,
  readStoredLocale,
  useLocale,
  type AppLocale,
} from '../useLocale'
import { createAppI18n } from '@/i18n'
import { testI18n } from '@/__tests__/setup'
import es from '@/locales/es.json'
import en from '@/locales/en.json'

function browserLanguages(languages: string[]) {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages)
}

afterEach(() => {
  vi.restoreAllMocks()
  document.head.innerHTML = ''
})

describe('initial language', () => {
  it('is Spanish for a Spanish browser with no saved choice', () => {
    browserLanguages(['es-ES'])
    expect(detectLocale()).toBe('es')
    expect(createAppI18n().global.locale.value).toBe('es')
  })

  it('is English when the first supported browser language is English', () => {
    browserLanguages(['fr-FR', 'en-GB'])
    expect(detectLocale()).toBe('en')
    expect(createAppI18n().global.locale.value).toBe('en')
  })

  it('is English when no browser language is supported', () => {
    browserLanguages(['fr-FR'])
    expect(detectLocale()).toBe('en')
    expect(createAppI18n().global.locale.value).toBe('en')
  })

  it('is the saved choice whatever the browser says', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'es')
    for (const languages of [['en-US'], ['fr-FR'], ['es-ES']]) {
      browserLanguages(languages)
      expect(detectLocale()).toBe('es')
      expect(createAppI18n().global.locale.value).toBe('es')
    }
  })

  it('ignores an unknown saved value and survives a storage that throws', () => {
    browserLanguages(['es-MX'])
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr')
    expect(detectLocale()).toBe('es')

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    expect(readStoredLocale()).toBeNull()
    expect(detectLocale()).toBe('es')
  })
})

describe('useLocale', () => {
  const Host = defineComponent({
    setup() {
      const { t } = useI18n()
      return { t, ...useLocale() }
    },
    render() {
      return h('p', this.t('nav.news'))
    },
  })

  function setupDocument() {
    document.documentElement.lang = 'es'
    document.title = es.meta.title
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = es.meta.description
    document.head.append(meta)
    return meta
  }

  it('saves the choice and updates the texts, <html lang>, title and meta description', async () => {
    const meta = setupDocument()
    const wrapper = mount(Host)
    const vm = wrapper.vm as unknown as {
      locale: AppLocale
      otherLocale: AppLocale
      setLocale: (locale: AppLocale) => void
    }
    expect(vm.locale).toBe('es')
    expect(vm.otherLocale).toBe('en')
    expect(wrapper.text()).toBe(es.nav.news)

    vm.setLocale('en')
    await wrapper.vm.$nextTick()

    expect(testI18n.global.locale.value).toBe('en')
    expect(wrapper.text()).toBe(en.nav.news)
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe(en.meta.title)
    expect(meta.content).toBe(en.meta.description)
    expect(vm.otherLocale).toBe('es')
    wrapper.unmount()
  })

  it('still switches when storage cannot be written', () => {
    setupDocument()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    const wrapper = mount(Host)
    ;(wrapper.vm as unknown as { setLocale: (l: AppLocale) => void }).setLocale('en')
    expect(document.documentElement.lang).toBe('en')
    wrapper.unmount()
  })
})
