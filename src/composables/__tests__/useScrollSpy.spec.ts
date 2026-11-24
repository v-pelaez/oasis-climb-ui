import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useScrollSpy } from '../useScrollSpy'

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  observed: Element[] = []
  observe = vi.fn((el: Element) => this.observed.push(el))
  disconnect = vi.fn()
  unobserve = vi.fn()

  constructor(public callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this)
  }

  trigger(target: Element, isIntersecting = true, top = 0) {
    this.callback(
      [{ target, isIntersecting, boundingClientRect: { top } } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }
}

const ids = ['novedades', 'ranking']

const Spy = defineComponent({
  setup() {
    const { activeId } = useScrollSpy(ids)
    return () => h('span', { class: 'active' }, activeId.value)
  },
})

beforeEach(() => {
  MockIntersectionObserver.instances = []
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  document.body.innerHTML = ids.map((id) => `<section id="${id}"></section>`).join('')
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('useScrollSpy', () => {
  it('observes every section and marks the one that comes into view', async () => {
    const wrapper = mount(Spy)
    const observer = MockIntersectionObserver.instances[0]!
    expect(observer.observed.map((el) => el.id)).toEqual(ids)
    expect(wrapper.text()).toBe('')

    observer.trigger(document.getElementById('ranking')!)
    await nextTick()
    expect(wrapper.text()).toBe('ranking')

    observer.trigger(document.getElementById('novedades')!, false)
    await nextTick()
    expect(wrapper.text()).toBe('ranking')
    wrapper.unmount()
  })

  it('clears the active id when scrolling back above the first section', async () => {
    const wrapper = mount(Spy)
    const observer = MockIntersectionObserver.instances[0]!
    observer.trigger(document.getElementById('novedades')!)
    await nextTick()
    expect(wrapper.text()).toBe('novedades')

    // Leaves the band with its top below it: the page is back on the hero.
    observer.trigger(document.getElementById('novedades')!, false, 400)
    await nextTick()
    expect(wrapper.text()).toBe('')
    wrapper.unmount()
  })

  it('disconnects the observer on unmount', () => {
    const wrapper = mount(Spy)
    const observer = MockIntersectionObserver.instances[0]!
    wrapper.unmount()
    expect(observer.disconnect).toHaveBeenCalledOnce()
  })
})
