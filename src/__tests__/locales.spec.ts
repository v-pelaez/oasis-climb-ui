import { describe, expect, it } from 'vitest'
import es from '@/locales/es.json'
import en from '@/locales/en.json'

/** Dotted paths of every leaf message. */
function keys(messages: object, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? keys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )
}

describe('locale files', () => {
  it('es.json and en.json have the same keys', () => {
    expect(keys(en).sort()).toEqual(keys(es).sort())
  })

  it('have no empty messages', () => {
    for (const messages of [es, en]) {
      for (const key of keys(messages)) {
        const value = key
          .split('.')
          .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], messages)
        expect(value, key).toBeTypeOf('string')
        expect((value as string).trim(), key).not.toBe('')
      }
    }
  })
})
