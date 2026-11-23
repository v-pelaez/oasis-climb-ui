import { describe, expect, it } from 'vitest'
import { countryFlag, countryName, rankings } from '../rankings'

const rows = rankings.flatMap((ranking) => ranking.data.map((row) => ({ ranking: ranking.id, row })))

describe('rankings', () => {
  it.each(rows)('$ranking #$row.rank has a valid ISO 3166-1 alpha-2 country code', ({ row }) => {
    expect(row.country).toMatch(/^[A-Z]{2}$/)
    // `fallback: 'none'` makes unknown regions return undefined instead of echoing the code
    expect(countryName(row.country)).toBeTruthy()
  })

  it('has one header per column', () => {
    for (const ranking of rankings) expect(ranking.headers).toHaveLength(5)
  })

  it('renders the Spanish name and the emoji flag', () => {
    expect(countryName('ES')).toBe('España')
    expect(countryFlag('ES')).toBe('🇪🇸')
    expect(countryFlag('CZ')).toBe('🇨🇿')
  })
})
