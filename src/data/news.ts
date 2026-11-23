import type { NewsItem, RelativeDate } from '@/types/news'

export const news: NewsItem[] = [
  {
    id: 'trad',
    img: new URL('../assets/thumbnails/climbing-2609319_1280.jpg', import.meta.url).href,
    published: { value: -1, unit: 'hour' },
  },
  {
    id: 'urban',
    img: new URL('../assets/thumbnails/free-climbing-4196577_1280.jpg', import.meta.url).href,
    published: { value: -3, unit: 'hour' },
  },
  {
    id: 'snow',
    img: new URL('../assets/thumbnails/snow-8033482_1280.jpg', import.meta.url).href,
    published: { value: -1, unit: 'day' },
  },
  {
    id: 'summit',
    img: new URL('../assets/thumbnails/mountaineer-396533_1280.jpg', import.meta.url).href,
    published: { value: -2, unit: 'day' },
  },
  {
    id: 'alpine',
    img: new URL('../assets/thumbnails/mountain-climbing-1840220_1280.jpg', import.meta.url).href,
    published: { value: -3, unit: 'day' },
  },
]

/** "hace 1 hora" / "1 hour ago", in the given language. */
export function formatRelativeDate({ value, unit }: RelativeDate, locale: string): string {
  return new Intl.RelativeTimeFormat(locale).format(value, unit)
}
