/** Publication date stored as an offset from "now", formatted with `Intl.RelativeTimeFormat`. */
export interface RelativeDate {
  value: number
  unit: Intl.RelativeTimeFormatUnit
}

export interface NewsItem {
  title: string
  text: string
  img: string
  published: RelativeDate
}
