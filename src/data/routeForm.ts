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

/** Labels and placeholders for each field. */
export const routeFormFields: Record<keyof RouteFormData, { label: string; placeholder?: string }> =
  {
    routeName: { label: 'Nombre de la vía o ruta', placeholder: 'Ej: La arista de los vientos' },
    location: {
      label: 'Macizo / Zona / Sector',
      placeholder: 'Ej: Picos de Europa - Naranjo de Bulnes',
    },
    markerType: { label: 'Disciplina', placeholder: 'Tipo...' },
    difficulty: { label: 'Dificultad', placeholder: 'Grado...' },
    gpsLink: { label: 'Coordenadas o Enlace Track (GPX)', placeholder: 'https://wikiloc.com/...' },
    length: { label: 'Distancia / Largos', placeholder: 'Ej: 12km o 4 largos' },
    elevation: { label: 'Desnivel (+m)', placeholder: 'Ej: 850' },
    duration: { label: 'Tiempo estimado (h)', placeholder: 'Ej: 4.5' },
    season: { label: 'Mejor Época', placeholder: 'Selecciona...' },
    equipment: { label: 'Material obligatorio', placeholder: 'Ej: Cuerda 60m, Friends, Casco' },
    description: {
      label: 'Descripción del itinerario y marcas',
      placeholder: 'Describe los hitos, marcas de pintura o químicos...',
    },
    terms: {
      label: 'Confirmo que la información técnica es veraz y apta para la seguridad de terceros.',
    },
  }

/** Validation messages (kept together so they can move to locale files). */
export const routeFormMessages = {
  required: {
    routeName: 'El nombre es obligatorio.',
    location: 'Indica la zona geográfica.',
    markerType: 'Selecciona una disciplina.',
    difficulty: 'Selecciona la dificultad.',
    gpsLink: '',
    length: 'Indica la distancia o el número de largos.',
    elevation: 'Indica el desnivel.',
    duration: 'Indica el tiempo estimado.',
    season: 'Selecciona la mejor época.',
    equipment: 'Indica el material obligatorio.',
    description: 'Describe el itinerario.',
    terms: 'Debes confirmar que la información es veraz.',
  } satisfies Record<keyof RouteFormData, string>,
  notNegativeNumber: 'Introduce un número igual o mayor que 0.',
  invalidUrl: 'Introduce una URL válida (https://...).',
} as const

/** Static copy of the section and the success dialog. */
export const routeFormCopy = {
  tagline: 'Haz que tu huella perdure. Registra tu marca, deja tu legado en la roca.',
  headerImageAlt: 'Montaña',
  title: 'Registra tus marcas',
  formTitle: 'Datos Técnicos de la Ruta',
  submit: 'Registrar Marca',
  dialogTitle: 'Envío Completado',
  dialogBody: 'Tu marca ha pasado a revisión por el comité de guías.',
  dialogNote: 'La montaña es de todos, la responsabilidad es tuya.',
  dialogClose: 'Entendido',
} as const
