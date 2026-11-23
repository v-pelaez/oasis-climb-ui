import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import HeroCarousel from '../HeroCarousel.vue'
import { heroVideos } from '@/data/site'

type Listener = EventListenerOrEventListenerObject

/** Live listeners on media elements, tracked through EventTarget. */
let videoListeners: Array<[EventTarget, string, Listener]> = []

let play: Mock<() => Promise<void>>
let pause: Mock<() => void>
let wrapper: VueWrapper | undefined

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
}

beforeEach(() => {
  videoListeners = []
  play = vi.fn<() => Promise<void>>(() => Promise.resolve())
  pause = vi.fn<() => void>()
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play)
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pause)
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})

  const add = EventTarget.prototype.addEventListener
  const remove = EventTarget.prototype.removeEventListener
  vi.spyOn(EventTarget.prototype, 'addEventListener').mockImplementation(function (
    this: EventTarget,
    type: string,
    fn: Listener | null,
    opts?: boolean | AddEventListenerOptions,
  ) {
    if (fn && this instanceof HTMLMediaElement) videoListeners.push([this, type, fn])
    return add.call(this, type, fn, opts)
  })
  vi.spyOn(EventTarget.prototype, 'removeEventListener').mockImplementation(function (
    this: EventTarget,
    type: string,
    fn: Listener | null,
    opts?: boolean | EventListenerOptions,
  ) {
    videoListeners = videoListeners.filter(
      ([target, t, f]) => !(target === this && t === type && f === fn),
    )
    return remove.call(this, type, fn, opts)
  })
  mockMatchMedia(false)
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

const activeVideo = () => wrapper!.find<HTMLVideoElement>('video[data-active]').element
const phrase = () => wrapper!.find('.hero-phrase').text()

/** Simulates the media position of a jsdom <video> (it has no playback). */
function setTime(video: HTMLVideoElement, currentTime: number, duration: number) {
  Object.defineProperty(video, 'currentTime', {
    value: currentTime,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(video, 'duration', { value: duration, configurable: true })
  video.dispatchEvent(new Event('timeupdate'))
}

async function endActive() {
  activeVideo().dispatchEvent(new Event('ended'))
  await flushPromises()
}

describe('HeroCarousel', () => {
  it('advances on `ended` with its phrase and wraps to the first after the last', async () => {
    wrapper = mount(HeroCarousel)
    await flushPromises()
    expect(phrase()).toBe(heroVideos[0]!.phrase)

    for (let i = 1; i < heroVideos.length; i++) {
      await endActive()
      expect(phrase()).toBe(heroVideos[i]!.phrase)
      expect(wrapper.find('.hero-subtext').text()).toBe(heroVideos[i]!.subtext)
      expect(activeVideo().querySelector('source')!.getAttribute('src')).toBe(heroVideos[i]!.src)
    }

    await endActive()
    expect(phrase()).toBe(heroVideos[0]!.phrase)
  })

  it('plays the next video while the finished one is still fading out', async () => {
    // Real transitions: the leaving <video> stays in the DOM, with its old attributes, for a frame or more.
    wrapper = mount(HeroCarousel, {
      global: { stubs: { transition: false, 'transition-group': false } },
    })
    await flushPromises()
    const first = activeVideo()

    play.mockClear()
    pause.mockClear()
    first.dispatchEvent(new Event('ended'))
    await flushPromises()

    const second = wrapper.findAll('video').find(
      (v) => v.find('source').attributes('src') === heroVideos[1]!.src,
    )!.element
    expect(play.mock.contexts).toEqual([second])
    expect(pause.mock.contexts).not.toContain(second)
  })

  it('mounts only the active and the next video, without loop and with a real webm type', async () => {
    wrapper = mount(HeroCarousel)
    await flushPromises()

    const videos = wrapper.findAll('video')
    expect(videos).toHaveLength(2)
    for (const video of videos) {
      expect(video.attributes('loop')).toBeUndefined()
      expect(video.attributes('autoplay')).toBeUndefined()
      expect(video.attributes('preload')).toBe('auto')
      const sources = video.findAll('source')
      expect(sources).toHaveLength(1)
      expect(sources[0]!.attributes('type')).toBe('video/webm')
    }
    expect(videos[1]!.find('source').attributes('src')).toBe(heroVideos[1]!.src)
    // The active one plays; the buffered next one does not.
    expect(play).toHaveBeenCalledTimes(1)
    expect(play.mock.contexts[0]).toBe(activeVideo())
  })

  it('progress follows the active video currentTime / duration and resets on change', async () => {
    wrapper = mount(HeroCarousel)
    await flushPromises()
    const fill = () => wrapper!.find<HTMLElement>('.hero-progress-fill').element.style.transform

    setTime(activeVideo(), 2, 8)
    await flushPromises()
    expect(fill()).toBe('scaleX(0.25)')

    setTime(activeVideo(), 6, 8)
    await flushPromises()
    expect(fill()).toBe('scaleX(0.75)')

    await endActive()
    expect(fill()).toBe('scaleX(0)')
  })

  it('pauses and resumes the active video from the toggle button', async () => {
    wrapper = mount(HeroCarousel)
    await flushPromises()
    const button = wrapper.find('button.hero-toggle')
    expect(button.attributes('aria-label')).toBeTruthy()
    expect(button.attributes('aria-pressed')).toBe('false')

    await button.trigger('click')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(pause.mock.contexts).toContain(activeVideo())

    play.mockClear()
    await button.trigger('click')
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(play).toHaveBeenCalledTimes(1)
    expect(play.mock.contexts[0]).toBe(activeVideo())
  })

  it('does not autoplay with prefers-reduced-motion and shows the first phrase', async () => {
    mockMatchMedia(true)
    wrapper = mount(HeroCarousel)
    await flushPromises()

    expect(play).not.toHaveBeenCalled()
    expect(phrase()).toBe(heroVideos[0]!.phrase)
    expect(wrapper.find('button.hero-toggle').attributes('aria-pressed')).toBe('true')
  })

  it('uses no timers and leaves no listeners on unmount', async () => {
    // Only the timer APIs: Vue's own transitions schedule animation frames.
    vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval'] })
    wrapper = mount(HeroCarousel)
    await flushPromises()
    await endActive()
    expect(vi.getTimerCount()).toBe(0)
    expect(videoListeners.length).toBeGreaterThan(0)

    wrapper.unmount()
    wrapper = undefined
    expect(videoListeners.length).toBe(0)
    expect(vi.getTimerCount()).toBe(0)
  })
})
