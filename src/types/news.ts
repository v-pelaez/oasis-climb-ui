/** Publication date stored as an offset from "now", formatted with `Intl.RelativeTimeFormat`. */
export interface RelativeDate {
  value: number
  unit: Intl.RelativeTimeFormatUnit
}

export interface NewsItem {
  /** Title and text at `news.items.<id>` in the locale files. */
  id: string
  img: string
  published: RelativeDate
}
