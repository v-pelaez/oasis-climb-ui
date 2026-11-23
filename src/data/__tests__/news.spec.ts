import { describe, expect, it } from 'vitest'
import { formatRelativeDate, news } from '../news'

describe('news', () => {
  it('has no duplicated titles', () => {
    const titles = news.map((item) => item.title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('has no duplicated images', () => {
    const images = news.map((item) => item.img)
    expect(new Set(images).size).toBe(images.length)
  })

  it('stores dates as past offsets', () => {
    for (const item of news) expect(item.published.value).toBeLessThan(0)
  })

  it('formats offsets as Spanish relative time', () => {
    expect(formatRelativeDate({ value: -1, unit: 'hour' })).toBe('hace 1 hora')
    expect(formatRelativeDate({ value: -3, unit: 'day' })).toBe('hace 3 días')
  })
})
