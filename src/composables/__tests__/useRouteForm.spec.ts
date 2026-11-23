import { describe, expect, it } from 'vitest'
import { routeFormErrorKeys, useRouteForm, validateRouteForm } from '../useRouteForm'
import { emptyRouteForm } from '@/data/routeForm'
import es from '@/locales/es.json'
import en from '@/locales/en.json'
import type { RouteFormData } from '@/types/routeForm'

const valid: RouteFormData = {
  routeName: 'Ruta',
  location: 'Zona',
  markerType: 'escalada',
  difficulty: 'media',
  gpsLink: '',
  length: '4 largos',
  elevation: 0,
  duration: 2.5,
  season: 'verano',
  equipment: 'Casco',
  description: 'Itinerario',
  terms: true,
}

describe('validateRouteForm', () => {
  it('accepts a complete form with the optional GPS link empty', () => {
    expect(validateRouteForm(valid)).toEqual({})
  })

  it('requires every field except the GPS link', () => {
    const errors = validateRouteForm({ ...emptyRouteForm })
    expect(Object.keys(errors)).not.toContain('gpsLink')
    expect(errors.routeName).toBe('routeForm.errors.required.routeName')
    expect(errors.terms).toBe(routeFormErrorKeys.required('terms'))
    expect(validateRouteForm({ ...valid, routeName: '   ' }).routeName).toBeDefined()
  })

  it('checks numbers are not negative and the link is a URL', () => {
    expect(validateRouteForm({ ...valid, duration: -1 }).duration).toBe(
      routeFormErrorKeys.notNegativeNumber,
    )
    expect(validateRouteForm({ ...valid, gpsLink: 'wikiloc' }).gpsLink).toBe(
      routeFormErrorKeys.invalidUrl,
    )
    expect(validateRouteForm({ ...valid, gpsLink: 'https://wikiloc.com/x' })).toEqual({})
  })
})

describe('error keys', () => {
  it('exist in both locale files for every required field', () => {
    const errors = validateRouteForm({ ...emptyRouteForm })
    for (const key of Object.values(errors)) {
      const [, , , field] = key!.split('.')
      expect(es.routeForm.errors.required).toHaveProperty(field!)
      expect(en.routeForm.errors.required).toHaveProperty(field!)
    }
  })
})

describe('useRouteForm', () => {
  it('hides errors until validate, then resets', () => {
    const { form, errors, validate, reset } = useRouteForm()
    expect(errors.value).toEqual({})
    expect(validate()).toBe('routeName')
    expect(errors.value.routeName).toBeDefined()

    Object.assign(form, valid)
    expect(errors.value).toEqual({})
    expect(validate()).toBeNull()

    reset()
    expect(form.routeName).toBe('')
    expect(errors.value).toEqual({})
  })
})
