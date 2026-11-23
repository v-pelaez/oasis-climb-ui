/** ISO 3166-1 alpha-2 country code, e.g. `ES`, `CZ`. */
export type CountryCode = string

export type RankingId = 'dificultad' | 'velocidad'

export interface RankingRow {
  rank: number
  name: string
  country: CountryCode
  metric: string
  points: number
}

export interface Ranking {
  id: RankingId
  title: string
  headers: string[]
  data: RankingRow[]
}
