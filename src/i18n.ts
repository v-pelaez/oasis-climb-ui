import { createI18n } from 'vue-i18n'
import es from '@/locales/es.json'
import en from '@/locales/en.json'
import { detectLocale, type AppLocale } from '@/composables/useLocale'

export type MessageSchema = typeof es

export const messages: Record<AppLocale, MessageSchema> = { es, en }

/** Composition-API i18n instance; the initial language comes from `detectLocale`. */
export function createAppI18n(locale: AppLocale = detectLocale()) {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages,
  })
}

export const i18n = createAppI18n()
