/** ISO 3166-1 alpha-2 country code, e.g. `ES`, `CZ`. */
export type CountryCode = string

export type RankingId = 'dificultad' | 'velocidad'

export interface RankingRow {
  rank: number
  /** Proper name, not translated. */
  name: string
  country: CountryCode
  /** Grade or time as written by the sport (`9a+`, `5.15 s`). */
  metric: string
  points: number
}

/** Title and metric header live at `ranking.tabs.<id>` / `ranking.metric.<id>`. */
export interface Ranking {
  id: RankingId
  data: RankingRow[]
}
