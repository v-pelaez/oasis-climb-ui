import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import {
  MAX_RESULTS,
  buildSearchIndex,
  findMatch,
  groupResults,
  normalize,
  searchIndex,
  useSearch,
} from '../useSearch'
import { testI18n } from '@/__tests__/setup'
import { rankings } from '@/data/rankings'
import { news } from '@/data/news'
import { navLinks } from '@/data/site'

const i18n = {
  t: (key: string, named?: Record<string, unknown>) => testI18n.global.t(key, named ?? {}),
  locale: testI18n.global.locale,
}
const index = () => buildSearchIndex(i18n.t)
const titles = (query: string) => searchIndex(index(), query).map((r) => r.entry.title)

describe('useSearch', () => {
  it('normalizes case and accents', () => {
    expect(normalize('Alberto GINÉS')).toBe('alberto gines')
    expect(titles('gines')).toEqual(['Alberto Ginés'])
    expect(titles('GINÉS')).toEqual(['Alberto Ginés'])
    expect(titles('muller')).toEqual(['Stefan Müller', 'Anna Müller'])
  })

  it('highlights the original (accented) letters', () => {
    expect(findMatch('Alberto Ginés', 'nes')).toEqual({ start: 10, end: 13 })
    const [result] = searchIndex(index(), 'gines')
    expect(result!.title).toEqual({ before: 'Alberto ', hit: 'Ginés', after: '' })
  })

  it('needs at least 2 characters', () => {
    expect(searchIndex(index(), '')).toEqual([])
    expect(searchIndex(index(), 'a')).toEqual([])
    expect(searchIndex(index(), '  a  ')).toEqual([])
    expect(searchIndex(index(), 'li').length).toBeGreaterThan(0)
  })

  it('indexes news, both ranking tables and the sections', () => {
    const entries = index()
    const count = rankings.reduce((n, r) => n + r.data.length, 0)
    expect(entries.filter((e) => e.group === 'news')).toHaveLength(news.length)
    expect(entries.filter((e) => e.group === 'ranking')).toHaveLength(count)
    expect(entries.filter((e) => e.group === 'section')).toHaveLength(navLinks.length)

    const [martina] = searchIndex(entries, 'martina')
    expect(martina!.entry).toMatchObject({
      group: 'ranking',
      tab: 'velocidad',
      meta: 'Velocidad · 5.15 s',
      targetId: 'ranking-velocidad-1',
    })
  })

  it('finds news by their text and shows an excerpt', () => {
    const [result] = searchIndex(index(), 'equipacion manual')
    expect(result!.entry.targetId).toBe('news-trad')
    expect(result!.title.hit).toBe('')
    expect(result!.snippet!.hit).toBe('equipación manual')
  })

  it('caps the results at 8, grouped in order news, ranking, sections', () => {
    const results = searchIndex(index(), 'an')
    expect(results).toHaveLength(MAX_RESULTS)
    const order = results.map((r) => r.entry.group)
    expect(order).toEqual(
      [...order].sort(
        (a, b) =>
          ['news', 'ranking', 'section'].indexOf(a) - ['news', 'ranking', 'section'].indexOf(b),
      ),
    )

    const groups = groupResults(searchIndex(index(), 'nov'))
    expect(groups.map((g) => g.group)).toEqual(['ranking', 'section'])
    expect(groups[0]!.results.map((r) => r.entry.title)).toEqual([
      'Jan Novak',
      'David Novak',
      'Katerina Novakova',
    ])
    expect(groups[1]!.results.map((r) => r.entry.title)).toEqual(['Novedades'])
  })

  it('returns nothing when there is no match', () => {
    expect(searchIndex(index(), 'boulder')).toEqual([])
    expect(groupResults([])).toEqual([])
  })

  it('rebuilds the index when the language changes', async () => {
    const query = ref('martina')
    const { results, searchable } = useSearch(query, i18n)
    expect(searchable.value).toBe(true)
    expect(results.value[0]!.entry.meta).toBe('Velocidad · 5.15 s')

    testI18n.global.locale.value = 'en'
    await nextTick()
    expect(results.value[0]!.entry.meta).toBe('Speed · 5.15 s')

    query.value = 'about'
    expect(results.value.map((r) => r.entry.title)).toEqual(['About us'])
    query.value = 'sobre'
    expect(results.value).toEqual([])
  })
})
