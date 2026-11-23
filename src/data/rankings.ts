import type { CountryCode, Ranking } from '@/types/ranking'

export const rankings: Ranking[] = [
  {
    id: 'dificultad',
    data: [
      { rank: 1, name: 'Alberto Ginés', country: 'ES', metric: '9a+', points: 4485 },
      { rank: 2, name: 'Jan Novak', country: 'CZ', metric: '9a', points: 4200 },
      { rank: 3, name: 'Li Wei', country: 'CN', metric: '8c+', points: 4150 },
      { rank: 4, name: 'Thomas Berger', country: 'AT', metric: '8c', points: 4100 },
      { rank: 5, name: 'Satone Yoshida', country: 'JP', metric: '9a', points: 4130 },
      { rank: 6, name: 'Elena Rossi', country: 'IT', metric: '8c+', points: 3900 },
      { rank: 7, name: 'Ivan Petrov', country: 'BG', metric: '8c', points: 3800 },
      { rank: 8, name: 'Simona Kolarova', country: 'SK', metric: '8b+', points: 3700 },
      { rank: 9, name: 'Markus Huber', country: 'CH', metric: '8b+', points: 3600 },
      { rank: 10, name: 'Lucas García', country: 'AR', metric: '8b', points: 3500 },
    ],
  },
  {
    id: 'velocidad',
    data: [
      { rank: 1, name: 'Martina López', country: 'ES', metric: '5.15 s', points: 1000 },
      { rank: 2, name: 'David Novak', country: 'CZ', metric: '5.34 s', points: 970 },
      { rank: 3, name: 'Chen Yu', country: 'CN', metric: '5.42 s', points: 950 },
      { rank: 4, name: 'Stefan Müller', country: 'AT', metric: '5.55 s', points: 920 },
      { rank: 5, name: 'Chiara Bianchi', country: 'IT', metric: '5.60 s', points: 910 },
      { rank: 6, name: 'Jordi Sánchez', country: 'ES', metric: '5.68 s', points: 895 },
      { rank: 7, name: 'Katerina Novakova', country: 'CZ', metric: '5.72 s', points: 880 },
      { rank: 8, name: 'Yuan Fang', country: 'CN', metric: '5.80 s', points: 860 },
      { rank: 9, name: 'Markus Steiner', country: 'CH', metric: '5.85 s', points: 845 },
      { rank: 10, name: 'Anna Müller', country: 'DE', metric: '5.90 s', points: 830 },
    ],
  },
]

/** Country name for an ISO 3166-1 alpha-2 code in the given language, or `undefined` if unknown. */
export function countryName(code: CountryCode, locale: string): string | undefined {
  return new Intl.DisplayNames(locale, { type: 'region', fallback: 'none' }).of(code)
}

/** Ranking points with the language's digit grouping. */
export function formatPoints(points: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(points)
}
