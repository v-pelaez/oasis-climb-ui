import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export interface ScrollSpyOptions {
  /** Band of the viewport that counts as "current"; by default the top third. */
  rootMargin?: string
  /** Id marked as active before any section is observed. */
  initial?: string
}

/**
 * Tracks which of the given section ids is in view, with an IntersectionObserver.
 * The observer starts on mount and is disconnected on unmount.
 */
export function useScrollSpy(
  ids: readonly string[],
  { rootMargin = '-20% 0px -70% 0px', initial = ids[0] ?? '' }: ScrollSpyOptions = {},
): { activeId: Ref<string> } {
  const activeId = ref(initial)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeId.value = entry.target.id
        }
      },
      { root: null, rootMargin, threshold: 0 },
    )

    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { activeId }
}
