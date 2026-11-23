import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ScrollTop from '../ScrollTop.vue'

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

afterEach(() => {
  scrollTo(0)
  vi.restoreAllMocks()
})

describe('ScrollTop', () => {
  it('appears only after scrolling past 300 px', async () => {
    const wrapper = mount(ScrollTop)
    expect(wrapper.find('button').exists()).toBe(false)

    scrollTo(300)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').exists()).toBe(false)

    scrollTo(301)
    await wrapper.vm.$nextTick()
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Volver arriba')

    const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    await button.trigger('click')
    expect(scroll).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }))
    wrapper.unmount()
  })

  it('removes the scroll listener on unmount', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(ScrollTop)

    const added = add.mock.calls.find(([type]) => type === 'scroll')
    expect(added).toBeDefined()

    wrapper.unmount()
    expect(remove).toHaveBeenCalledWith('scroll', added![1])
  })
})
