import { getCurrentScope, onScopeDispose, readonly, ref, type Ref } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Whether the user asked the system to reduce motion. Follows changes live
 * and stops listening when the calling component (or effect scope) is disposed.
 */
export function useReducedMotion(): Readonly<Ref<boolean>> {
  const reduced = ref(false)

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return readonly(reduced)
  }

  const media = window.matchMedia(QUERY)
  reduced.value = media.matches

  const onChange = (event: MediaQueryListEvent) => {
    reduced.value = event.matches
  }
  media.addEventListener('change', onChange)

  if (getCurrentScope()) {
    onScopeDispose(() => media.removeEventListener('change', onChange))
  }

  return readonly(reduced)
}
