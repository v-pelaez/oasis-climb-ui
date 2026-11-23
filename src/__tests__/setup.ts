/**
 * Vitest setup: every mounted component gets the i18n plugin. Tests start in
 * Spanish (the original copy) with no saved choice; `testI18n` lets a test
 * switch language.
 */
import { beforeEach } from 'vitest'
import { config } from '@vue/test-utils'
import { createAppI18n } from '@/i18n'

export const testI18n = createAppI18n('es')

config.global.plugins = [testI18n]

beforeEach(() => {
  testI18n.global.locale.value = 'es'
  localStorage.clear()
})
