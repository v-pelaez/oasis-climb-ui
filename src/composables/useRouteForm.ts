import { computed, reactive, ref } from 'vue'
import type { RouteFormData } from '@/types/routeForm'
import {
  emptyRouteForm,
  optionalRouteFormFields,
  routeFormFieldOrder,
  routeFormMessages,
} from '@/data/routeForm'

export type RouteFormField = keyof RouteFormData
export type RouteFormErrors = Partial<Record<RouteFormField, string>>

const numericFields: readonly RouteFormField[] = ['elevation', 'duration']

function isEmpty(value: RouteFormData[RouteFormField]): boolean {
  if (typeof value === 'boolean') return !value
  if (typeof value === 'number') return Number.isNaN(value)
  return value === null || value === undefined || String(value).trim() === ''
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/** Returns the error message for every invalid field of `data`. */
export function validateRouteForm(data: RouteFormData): RouteFormErrors {
  const errors: RouteFormErrors = {}

  for (const field of routeFormFieldOrder) {
    const value = data[field]
    if (isEmpty(value)) {
      if (!optionalRouteFormFields.includes(field)) errors[field] = routeFormMessages.required[field]
      continue
    }
    if (numericFields.includes(field)) {
      const number = typeof value === 'number' ? value : Number(value)
      if (!Number.isFinite(number) || number < 0) errors[field] = routeFormMessages.notNegativeNumber
    }
    if (field === 'gpsLink' && !isValidUrl(String(value))) {
      errors[field] = routeFormMessages.invalidUrl
    }
  }

  return errors
}

/**
 * Form state and validation for «Registra tus marcas».
 * Errors are hidden until the first submit attempt; from then on they follow
 * the values as the user edits them, until the form is reset.
 */
export function useRouteForm() {
  const form = reactive<RouteFormData>({ ...emptyRouteForm })
  const submitted = ref(false)

  const allErrors = computed(() => validateRouteForm(form))
  const errors = computed<RouteFormErrors>(() => (submitted.value ? allErrors.value : {}))

  /** Marks the form as submitted and returns the first invalid field, if any. */
  function validate(): RouteFormField | null {
    submitted.value = true
    return routeFormFieldOrder.find((field) => field in allErrors.value) ?? null
  }

  function reset() {
    Object.assign(form, emptyRouteForm)
    submitted.value = false
  }

  return { form, errors, validate, reset }
}
