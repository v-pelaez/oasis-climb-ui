import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import { news } from '@/data/news'

beforeAll(() => {
  // jsdom has no canvas, IntersectionObserver or media playback
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  vi.clearAllTimers()
})

describe('HomeView', () => {
  it('mounts and renders every section', () => {
    vi.useFakeTimers()
    wrapper = mount(HomeView, { attachTo: document.body })

    for (const id of ['novedades', 'ranking', 'registro', 'about-us']) {
      expect(wrapper.find(`#${id}`).exists()).toBe(true)
    }
    expect(wrapper.findAll('.news-card-title').map((el) => el.text())).toEqual(
      news.map((item) => item.title),
    )
    expect(wrapper.text()).toContain('🇪🇸 España')
    expect(wrapper.findAll('#markerType option')).toHaveLength(5)
    vi.useRealTimers()
  })
})
