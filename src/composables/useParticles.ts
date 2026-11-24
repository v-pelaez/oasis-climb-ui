import { onMounted, onUnmounted, watch, type Ref } from 'vue'

export interface Particle {
  x: number
  y: number
  size: number
  velX: number
  velY: number
  alpha: number
  /** Twinkle frequency (radians per ms). */
  frequency: number
  /** How much this particle follows the scroll (depth effect). */
  parallax: number
}

export interface Bounds {
  width: number
  height: number
}

export interface UseParticlesOptions {
  count?: number
  maxSize?: number
  baseSpeed?: number
  scrollSensitivity?: number
  /** When true, draw one static frame: no animation loop, no scroll tracking. */
  reducedMotion?: Readonly<Ref<boolean>>
}

const MARGIN_X = 10
const MARGIN_Y = 20

export function createParticle(
  bounds: Bounds,
  { maxSize = 15, baseSpeed = 0.15, scrollSensitivity = 3 } = {},
  random: () => number = Math.random,
): Particle {
  return {
    x: random() * bounds.width,
    y: random() * bounds.height,
    size: random() * maxSize + 2,
    velX: (random() - 0.5) * baseSpeed,
    velY: (random() - 0.5) * baseSpeed,
    alpha: 0.2 + random() * 0.2,
    frequency: random() * 0.02,
    parallax: random() * scrollSensitivity,
  }
}

/**
 * Moves a particle one frame. Bounds are in CSS pixels (not the
 * `devicePixelRatio`-scaled canvas size). A particle leaving through one side
 * comes back through the opposite one.
 */
export function stepParticle(p: Particle, scrollVelocity: number, bounds: Bounds): void {
  p.x += p.velX
  p.y += p.velY - scrollVelocity * p.parallax

  if (p.x < -MARGIN_X) p.x = bounds.width + MARGIN_X
  else if (p.x > bounds.width + MARGIN_X) p.x = -MARGIN_X

  if (p.y < -MARGIN_Y) p.y = bounds.height + MARGIN_Y
  else if (p.y > bounds.height + MARGIN_Y) p.y = -MARGIN_Y
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, time: number) {
  ctx.globalAlpha = Math.max(0.02, p.alpha + Math.sin(time * p.frequency) * 0.05)
  ctx.beginPath()
  ctx.moveTo(p.x, p.y)
  ctx.lineTo(p.x + p.size, p.y)
  ctx.lineTo(p.x + p.size / 2, p.y - p.size * 0.86)
  ctx.closePath()
  ctx.fill()
}

/**
 * Floating triangles on a full-screen canvas that drift and react to scroll.
 * The colour is the canvas' computed CSS `color` (set from a token). Cancels
 * its `requestAnimationFrame` and removes its listeners on unmount.
 */
export function useParticles(
  canvas: Readonly<Ref<HTMLCanvasElement | null>>,
  options: UseParticlesOptions = {},
): void {
  const { count = 600, reducedMotion } = options

  let ctx: CanvasRenderingContext2D | null = null
  let particles: Particle[] = []
  let bounds: Bounds = { width: 0, height: 0 }
  let color = ''
  let frame: number | undefined
  let lastScrollY = 0
  let scrollVelocity = 0
  let scrollListening = false

  const isStatic = () => reducedMotion?.value === true

  function resize() {
    const el = canvas.value
    if (!el || !ctx) return
    const dpr = window.devicePixelRatio || 1
    const widthChanged = bounds.width !== window.innerWidth
    bounds = { width: window.innerWidth, height: window.innerHeight }
    el.width = Math.round(bounds.width * dpr)
    el.height = Math.round(bounds.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    color = getComputedStyle(el).color
    // A height-only change (mobile browser bar showing or hiding while scrolling) keeps the
    // particles: they wrap around the new bounds instead of jumping to new positions.
    if (widthChanged || particles.length === 0)
      particles = Array.from({ length: count }, () => createParticle(bounds, options))
    if (isStatic()) draw(0)
  }

  function draw(time: number) {
    if (!ctx) return
    ctx.clearRect(0, 0, bounds.width, bounds.height)
    ctx.fillStyle = color
    for (const p of particles) drawParticle(ctx, p, time)
    ctx.globalAlpha = 1
  }

  function tick(time: number) {
    for (const p of particles) stepParticle(p, scrollVelocity, bounds)
    draw(time)
    // Friction: the scroll push fades out smoothly.
    scrollVelocity *= 0.9
    frame = requestAnimationFrame(tick)
  }

  const onScroll = () => {
    const y = window.scrollY
    scrollVelocity = y - lastScrollY
    lastScrollY = y
  }

  function start() {
    if (frame !== undefined) return
    lastScrollY = window.scrollY
    scrollVelocity = 0
    if (!scrollListening) {
      window.addEventListener('scroll', onScroll, { passive: true })
      scrollListening = true
    }
    frame = requestAnimationFrame(tick)
  }

  function stop() {
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
    if (scrollListening) {
      window.removeEventListener('scroll', onScroll)
      scrollListening = false
    }
  }

  onMounted(() => {
    ctx = canvas.value?.getContext('2d') ?? null
    if (!ctx) return
    window.addEventListener('resize', resize)
    resize()
    if (!isStatic()) start()
  })

  if (reducedMotion) {
    watch(reducedMotion, (reduced) => {
      if (!ctx) return
      if (reduced) {
        stop()
        draw(0)
      } else {
        start()
      }
    })
  }

  onUnmounted(() => {
    stop()
    window.removeEventListener('resize', resize)
    ctx = null
  })
}
