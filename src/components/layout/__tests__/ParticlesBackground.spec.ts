import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import ParticlesBackground from '../ParticlesBackground.vue'
import { stepParticle, type Particle } from '@/composables/useParticles'

const bounds = { width: 800, height: 600 }

function particle(overrides: Partial<Particle> = {}): Particle {
  return {
    x: 100,
    y: 100,
    size: 5,
    velX: 0,
    velY: 0,
    alpha: 0.3,
    frequency: 0,
    parallax: 1,
    ...overrides,
  }
}

describe('stepParticle', () => {
  it('brings a particle leaving through the top back at the bottom', () => {
    const p = particle({ y: -19, velY: -2 })
    stepParticle(p, 0, bounds)
    expect(p.y).toBe(bounds.height + 20)
  })

  it('brings a particle leaving through the bottom back at the top', () => {
    const p = particle({ y: bounds.height + 19 })
    stepParticle(p, -5, bounds) // scrolling up pushes particles down
    expect(p.y).toBe(-20)
  })

  it('wraps horizontally to the opposite side', () => {
    const left = particle({ x: -9, velX: -2 })
    stepParticle(left, 0, bounds)
    expect(left.x).toBe(bounds.width + 10)

    const right = particle({ x: bounds.width + 9, velX: 2 })
    stepParticle(right, 0, bounds)
    expect(right.x).toBe(-10)
  })

  it('uses CSS-pixel bounds, not the devicePixelRatio-scaled canvas size', () => {
    const p = particle({ y: bounds.height + 21 })
    stepParticle(p, 0, bounds)
    expect(p.y).toBe(-20)
  })
})

describe('ParticlesBackground', () => {
  let wrapper: VueWrapper | undefined
  let ctx: Record<string, ReturnType<typeof vi.fn>>
  let raf: ReturnType<typeof vi.fn>
  let caf: ReturnType<typeof vi.fn>
  let frameId: number

  function mockMatchMedia(matches: boolean) {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    )
  }

  beforeEach(() => {
    ctx = Object.fromEntries(
      ['setTransform', 'clearRect', 'beginPath', 'moveTo', 'lineTo', 'closePath', 'fill'].map(
        (name) => [name, vi.fn()],
      ),
    )
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctx as unknown as CanvasRenderingContext2D,
    )
    frameId = 0
    raf = vi.fn(() => ++frameId)
    caf = vi.fn()
    vi.stubGlobal('requestAnimationFrame', raf)
    vi.stubGlobal('cancelAnimationFrame', caf)
    vi.stubGlobal('devicePixelRatio', 2)
    mockMatchMedia(false)
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('scales the canvas by devicePixelRatio and animates', () => {
    wrapper = mount(ParticlesBackground)
    const canvas = wrapper.find('canvas').element
    expect(canvas.width).toBe(window.innerWidth * 2)
    expect(canvas.height).toBe(window.innerHeight * 2)
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0)
    expect(raf).toHaveBeenCalledTimes(1)

    // Run a frame: it draws and schedules the next one.
    const tick = raf.mock.calls[0]![0] as FrameRequestCallback
    tick(16)
    expect(ctx.fill).toHaveBeenCalled()
    expect(raf).toHaveBeenCalledTimes(2)
  })

  it('cancels the pending animation frame and removes its listeners on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    wrapper = mount(ParticlesBackground)
    ;(raf.mock.calls[0]![0] as FrameRequestCallback)(16)

    wrapper.unmount()
    wrapper = undefined
    expect(caf).toHaveBeenCalledWith(frameId)
    const removed = remove.mock.calls.map(([type]) => type)
    expect(removed).toContain('scroll')
    expect(removed).toContain('resize')
  })

  it('draws one static frame with prefers-reduced-motion', () => {
    mockMatchMedia(true)
    const add = vi.spyOn(window, 'addEventListener')
    wrapper = mount(ParticlesBackground)

    expect(raf).not.toHaveBeenCalled()
    expect(ctx.fill).toHaveBeenCalled()
    expect(add.mock.calls.map(([type]) => type)).not.toContain('scroll')
  })
})
