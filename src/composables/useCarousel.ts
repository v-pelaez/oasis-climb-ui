import { computed, onMounted, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue'

export interface UseCarouselOptions {
  /** Number of slides (videos). */
  count: number
  /**
   * Returns the `<video>` of the active slide once the DOM is up to date
   * (e.g. a query inside the carousel root).
   */
  getActiveVideo: () => HTMLVideoElement | null | undefined
  /** Returns the `<video>` mounted (buffering) for the next slide, if any. */
  getNextVideo?: () => HTMLVideoElement | null | undefined
  /** When false (reduced motion) nothing plays until the user resumes. */
  autoplay: Readonly<Ref<boolean>>
}

export interface UseCarousel {
  index: Ref<number>
  nextIndex: ComputedRef<number>
  /** Playback of the active video, 0 to 1 (`currentTime / duration`). */
  progress: Ref<number>
  paused: Ref<boolean>
  toggle: () => void
}

/**
 * Chained video carousel without timers: each video plays to its end, its
 * `ended` event brings in the next one, and after the last comes the first.
 * Progress follows the active video's `timeupdate`. Listeners are attached by
 * hand (not from the template) so they can be removed on unmount.
 */
export function useCarousel({
  count,
  getActiveVideo,
  getNextVideo,
  autoplay,
}: UseCarouselOptions): UseCarousel {
  const index = ref(0)
  const nextIndex = computed(() => (count > 0 ? (index.value + 1) % count : 0))
  const progress = ref(0)
  const paused = ref(!autoplay.value)

  let current: HTMLVideoElement | null = null

  const onTimeUpdate = () => {
    if (!current) return
    const { currentTime, duration } = current
    progress.value =
      duration > 0 && Number.isFinite(duration) ? Math.min(currentTime / duration, 1) : 0
  }

  const onEnded = () => {
    progress.value = 1
    if (count <= 1) {
      // A single video: replay it by hand (no `loop`, so the flow stays the same).
      if (current) current.currentTime = 0
      play()
      return
    }
    index.value = nextIndex.value
  }

  function play() {
    if (!current || paused.value) return
    try {
      // `play()` may reject (autoplay policy) or be missing in test environments.
      void Promise.resolve(current.play()).catch(() => {})
    } catch {
      /* ignore */
    }
  }

  function detach() {
    if (!current) return
    current.removeEventListener('timeupdate', onTimeUpdate)
    current.removeEventListener('loadedmetadata', onTimeUpdate)
    current.removeEventListener('ended', onEnded)
    current = null
  }

  function attach() {
    const video = getActiveVideo() ?? null
    if (video === current) return
    detach()
    current = video
    progress.value = 0
    if (!video) return
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onTimeUpdate)
    video.addEventListener('ended', onEnded)

    // The next video only buffers; rewind it in case it played before (two slides).
    const next = getNextVideo?.()
    if (next && next !== video) {
      next.pause()
      if (next.currentTime) next.currentTime = 0
    }

    if (paused.value) video.pause()
    else play()
  }

  function toggle() {
    paused.value = !paused.value
    if (!current) return
    if (paused.value) current.pause()
    else play()
  }

  watch(index, attach, { flush: 'post' })
  watch(autoplay, (allowed) => {
    if (!allowed && !paused.value) toggle()
  })

  onMounted(attach)
  onUnmounted(detach)

  return { index, nextIndex, progress, paused, toggle }
}
