import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { useReducedMotion } from './useReducedMotion'

/**
 * Shows a "back to top" control once the page is scrolled past `threshold` px.
 * The scroll listener is added on mount and removed on unmount.
 */
export function useScrollTop(threshold = 300): {
  isVisible: Ref<boolean>
  scrollToTop: () => void
} {
  const isVisible = ref(false)
  const reducedMotion = useReducedMotion()

  const update = () => {
    isVisible.value = window.scrollY > threshold
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.value ? 'auto' : 'smooth' })
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    update()
  })
  onUnmounted(() => window.removeEventListener('scroll', update))

  return { isVisible, scrollToTop }
}
