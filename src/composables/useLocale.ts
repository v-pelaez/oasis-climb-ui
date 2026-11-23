import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const SUPPORTED_LOCALES = ['es', 'en'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

/** `localStorage` key holding the visitor's explicit choice. */
export const LOCALE_STORAGE_KEY = 'oasis-climb:locale'
export const DEFAULT_LOCALE: AppLocale = 'en'

export function isAppLocale(value: unknown): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale)
}

/** Saved choice, or `null` when there is none or storage is unavailable (private mode, blocked). */
export function readStoredLocale(): AppLocale | null {
  try {
    const value = localStorage.getItem(LOCALE_STORAGE_KEY)
    return isAppLocale(value) ? value : null
  } catch {
    return null
  }
}

export function storeLocale(locale: AppLocale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Storage unavailable: the choice lasts for this visit only.
  }
}

/**
 * Initial language: the saved choice; else the first browser language whose
 * primary subtag is supported (`es-ES` → `es`); else English.
 */
export function detectLocale(
  languages: readonly string[] = typeof navigator === 'undefined' ? [] : navigator.languages,
): AppLocale {
  const stored = readStoredLocale()
  if (stored) return stored
  for (const tag of languages) {
    const primary = tag.split('-')[0]?.toLowerCase()
    if (isAppLocale(primary)) return primary
  }
  return DEFAULT_LOCALE
}

/** Mirrors the active language on `<html lang>`, the title and the meta description. */
export function syncDocumentLocale(composer: {
  locale: { value: string }
  t: (key: 'meta.title' | 'meta.description') => string
}): void {
  document.documentElement.lang = composer.locale.value
  document.title = composer.t('meta.title')
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', composer.t('meta.description'))
}

/** Active language and a setter that saves the choice and updates the document. */
export function useLocale() {
  const composer = useI18n({ useScope: 'global' })

  const locale = computed<AppLocale>(() =>
    isAppLocale(composer.locale.value) ? composer.locale.value : DEFAULT_LOCALE,
  )
  /** The language the toggle switches to. */
  const otherLocale = computed<AppLocale>(() => (locale.value === 'es' ? 'en' : 'es'))

  function setLocale(next: AppLocale) {
    composer.locale.value = next
    storeLocale(next)
    syncDocumentLocale(composer)
  }

  return { locale, otherLocale, setLocale }
}
