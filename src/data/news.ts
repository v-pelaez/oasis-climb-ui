import type { NewsItem, RelativeDate } from '@/types/news'

export const news: NewsItem[] = [
  {
    id: 'trad',
    img: new URL('../assets/thumbnails/climbing-2609319.webp', import.meta.url).href,
    width: 800,
    height: 439,
    published: { value: -1, unit: 'hour' },
  },
  {
    id: 'urban',
    img: new URL('../assets/thumbnails/free-climbing-4196577.webp', import.meta.url).href,
    width: 800,
    height: 551,
    published: { value: -3, unit: 'hour' },
  },
  {
    id: 'snow',
    img: new URL('../assets/thumbnails/snow-8033482.webp', import.meta.url).href,
    width: 800,
    height: 534,
    published: { value: -1, unit: 'day' },
  },
  {
    id: 'summit',
    img: new URL('../assets/thumbnails/mountaineer-396533.webp', import.meta.url).href,
    width: 800,
    height: 480,
    published: { value: -2, unit: 'day' },
  },
  {
    id: 'alpine',
    img: new URL('../assets/thumbnails/mountain-climbing-1840220.webp', import.meta.url).href,
    width: 800,
    height: 533,
    published: { value: -3, unit: 'day' },
  },
]

/** "hace 1 hora" / "1 hour ago", in the given language. */
export function formatRelativeDate({ value, unit }: RelativeDate, locale: string): string {
  return new Intl.RelativeTimeFormat(locale).format(value, unit)
}
