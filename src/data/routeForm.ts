import type { Difficulty, Discipline, RouteFormData, Season } from '@/types/routeForm'

/**
 * Option values of the selects, in display order. Their labels live at
 * `routeForm.options.<discipline|difficulty|season>.<value>` in the locale files,
 * the field labels and placeholders at `routeForm.fields.<field>` and the
 * validation messages at `routeForm.errors`.
 */
export const disciplineOptions: readonly Discipline[] = [
  'senderismo',
  'ferrata',
  'escalada',
  'alpinismo',
]

export const difficultyOptions: readonly Difficulty[] = ['baja', 'media', 'alta', 'extrema']

export const seasonOptions: readonly Season[] = ['primavera', 'verano', 'invierno', 'todo_el_anyo']

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

/** Field ids in the order they appear in the form (first invalid one gets focus). */
export const routeFormFieldOrder: readonly (keyof RouteFormData)[] = [
  'routeName',
  'location',
  'markerType',
  'difficulty',
  'gpsLink',
  'length',
  'elevation',
  'duration',
  'season',
  'equipment',
  'description',
  'terms',
]

/** Fields that may be left empty. */
export const optionalRouteFormFields: readonly (keyof RouteFormData)[] = ['gpsLink']
