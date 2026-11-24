export type Discipline = 'senderismo' | 'ferrata' | 'escalada' | 'alpinismo'
export type Difficulty = 'baja' | 'media' | 'alta' | 'extrema'
export type Season = 'primavera' | 'verano' | 'invierno' | 'todo_el_anyo'

export interface RouteFormData {
  routeName: string
  location: string
  markerType: Discipline | ''
  difficulty: Difficulty | ''
  gpsLink: string
  length: string
  elevation: number | null
  duration: number | null
  season: Season | ''
  equipment: string
  description: string
  terms: boolean
}
