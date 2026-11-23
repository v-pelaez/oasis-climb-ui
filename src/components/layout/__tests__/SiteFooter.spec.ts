import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteFooter from '../SiteFooter.vue'
import { socialLinks } from '@/data/site'

describe('SiteFooter', () => {
  it('renders social profiles without URL as buttons, not links', () => {
    const wrapper = mount(SiteFooter)
    const social = wrapper.findAll('.site-footer-social .site-footer-social-link')
    expect(social).toHaveLength(socialLinks.length)
    socialLinks.forEach((link, i) => {
      expect(social[i]!.element.tagName).toBe(link.url ? 'A' : 'BUTTON')
      expect(social[i]!.find('svg').exists()).toBe(true)
    })
  })

  it('labels the email field', () => {
    const wrapper = mount(SiteFooter)
    const input = wrapper.get('input[type="email"]')
    const label = wrapper.get(`label[for="${input.attributes('id')}"]`)
    expect(label.text()).toBe('Correo electrónico')
  })
})
