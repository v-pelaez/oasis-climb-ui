import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useReducedMotion } from '../useReducedMotion'

type Listener = (event: MediaQueryListEvent) => void

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<Listener>()
  const media = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: vi.fn((_: string, fn: Listener) => listeners.add(fn)),
    removeEventListener: vi.fn((_: string, fn: Listener) => listeners.delete(fn)),
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => media),
  )
  const emit = (value: boolean) =>
    listeners.forEach((fn) => fn({ matches: value } as MediaQueryListEvent))
  return { media, listeners, emit }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useReducedMotion', () => {
  it('reads the current preference', () => {
    mockMatchMedia(true)
    const scope = effectScope()
    const reduced = scope.run(() => useReducedMotion())!
    expect(reduced.value).toBe(true)
    scope.stop()
  })

  it('follows changes and stops listening when the scope is disposed', () => {
    const { listeners, emit, media } = mockMatchMedia(false)
    const scope = effectScope()
    const reduced = scope.run(() => useReducedMotion())!
    expect(reduced.value).toBe(false)

    emit(true)
    expect(reduced.value).toBe(true)

    scope.stop()
    expect(media.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    expect(listeners.size).toBe(0)
  })

  it('falls back to false without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined)
    const scope = effectScope()
    const reduced = scope.run(() => useReducedMotion())!
    expect(reduced.value).toBe(false)
    scope.stop()
  })
})
