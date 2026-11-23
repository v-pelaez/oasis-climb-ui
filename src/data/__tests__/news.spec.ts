import { describe, expect, it } from 'vitest'
import { formatRelativeDate, news } from '../news'
import es from '@/locales/es.json'
import en from '@/locales/en.json'

describe('news', () => {
  it('has no duplicated ids, and every id has copy in both languages', () => {
    const ids = news.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(es.news.items).toHaveProperty(id)
      expect(en.news.items).toHaveProperty(id)
    }
  })

  it('has no duplicated images', () => {
    const images = news.map((item) => item.img)
    expect(new Set(images).size).toBe(images.length)
  })

  it('stores dates as past offsets', () => {
    for (const item of news) expect(item.published.value).toBeLessThan(0)
  })

  it('formats offsets as relative time in the given language', () => {
    expect(formatRelativeDate({ value: -1, unit: 'hour' }, 'es')).toBe('hace 1 hora')
    expect(formatRelativeDate({ value: -3, unit: 'day' }, 'es')).toBe('hace 3 días')
    expect(formatRelativeDate({ value: -1, unit: 'hour' }, 'en')).toBe('1 hour ago')
    expect(formatRelativeDate({ value: -3, unit: 'day' }, 'en')).toBe('3 days ago')
  })
})
