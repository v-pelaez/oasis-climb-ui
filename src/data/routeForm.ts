import type {
  Difficulty,
  Discipline,
  RouteFormData,
  Season,
  SelectOption,
} from '@/types/routeForm'

export const disciplineOptions: SelectOption<Discipline>[] = [
  { value: 'senderismo', label: 'Senderismo' },
  { value: 'ferrata', label: 'Vía Ferrata' },
  { value: 'escalada', label: 'Escalada' },
  { value: 'alpinismo', label: 'Alpinismo' },
]

export const difficultyOptions: SelectOption<Difficulty>[] = [
  { value: 'baja', label: 'Baja (K1 / II)' },
  { value: 'media', label: 'Media (K3 / V)' },
  { value: 'alta', label: 'Alta (K5 / 6b+)' },
  { value: 'extrema', label: 'Extrema (K6 / 7+)' },
]

export const seasonOptions: SelectOption<Season>[] = [
  { value: 'primavera', label: 'Primavera - Otoño' },
  { value: 'verano', label: 'Verano (Alta Montaña)' },
  { value: 'invierno', label: 'Invierno (Invernal)' },
  { value: 'todo_el_anyo', label: 'Todo el año' },
]

export const emptyRouteForm: Readonly<RouteFormData> = {
  routeName: '',
  location: '',
  markerType: '',
  difficulty: '',
  gpsLink: '',
  length: '',
  elevation: null,
  duration: null,
  season: '',
  equipment: '',
  description: '',
  terms: false,
}
