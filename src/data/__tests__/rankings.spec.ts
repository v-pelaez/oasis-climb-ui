import { describe, expect, it } from 'vitest'
import { countryName, formatPoints, rankings } from '../rankings'
import { flags } from '@/components/ui/flags'
import es from '@/locales/es.json'
import en from '@/locales/en.json'

const entries = rankings.flatMap((ranking) =>
  ranking.data.map((entry) => ({ ranking: ranking.id, entry })),
)

describe('rankings', () => {
  it.each(entries)(
    '$ranking #$entry.rank has a valid ISO 3166-1 alpha-2 country code with a flag',
    ({ entry }) => {
      expect(entry.country).toMatch(/^[A-Z]{2}$/)
      // `fallback: 'none'` makes unknown regions return undefined instead of echoing the code
      expect(countryName(entry.country, 'es')).toBeTruthy()
      expect(flags[entry.country]).toBeDefined()
    },
  )

  it('has a title and a metric header per ranking in both languages', () => {
    for (const { id } of rankings) {
      for (const messages of [es, en]) {
        expect(messages.ranking.tabs[id]).toBeTruthy()
        expect(messages.ranking.metric[id]).toBeTruthy()
      }
    }
  })

  it('names countries in the given language', () => {
    expect(countryName('ES', 'es')).toBe('España')
    expect(countryName('ES', 'en')).toBe('Spain')
    expect(countryName('DE', 'es')).toBe('Alemania')
    expect(countryName('DE', 'en')).toBe('Germany')
  })

  it('formats points with the language digit grouping', () => {
    expect(formatPoints(4485, 'en')).toBe('4,485')
    // Spanish does not group four-digit numbers
    expect(formatPoints(4485, 'es')).toBe('4485')
    expect(formatPoints(12500, 'es')).toBe('12.500')
  })
})
