import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import RouteFormSection from '../RouteFormSection.vue'
import es from '@/locales/es.json'
import en from '@/locales/en.json'
import { testI18n } from '@/__tests__/setup'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

function mountForm() {
  wrapper = mount(RouteFormSection, { attachTo: document.body })
  return wrapper
}

async function fillValid(w: VueWrapper) {
  await w.get('#routeName').setValue('La arista de los vientos')
  await w.get('#location').setValue('Picos de Europa')
  await w.get('#markerType').setValue('escalada')
  await w.get('#difficulty').setValue('alta')
  await w.get('#gpsLink').setValue('https://wikiloc.com/ruta')
  await w.get('#length').setValue('4 largos')
  await w.get('#elevation').setValue('850')
  await w.get('#duration').setValue('4.5')
  await w.get('#season').setValue('verano')
  await w.get('#equipment').setValue('Cuerda 60m')
  await w.get('#description').setValue('Hitos y marcas de pintura')
  await w.get('#termsCheck').setValue(true)
}

describe('RouteFormSection', () => {
  it('labels every control and keeps no Bootstrap validation classes', () => {
    const w = mountForm()
    expect(w.find('#registro').exists()).toBe(true)
    for (const control of w.findAll('input, select, textarea')) {
      expect(w.find(`label[for="${control.attributes('id')}"]`).exists()).toBe(true)
    }
    expect(w.find('.was-validated, .form-control, .form-select, .btn').exists()).toBe(false)
  })

  it('blocks an empty submit, marks the errors and focuses the first invalid field', async () => {
    const w = mountForm()
    expect(w.find('.field-error').exists()).toBe(false)

    await w.get('form').trigger('submit')
    await flushPromises()

    const name = w.get('#routeName')
    expect(name.attributes('aria-invalid')).toBe('true')
    expect(name.attributes('aria-describedby')).toBe('routeName-error')
    expect(w.get('#routeName-error').text()).toBe(es.routeForm.errors.required.routeName)
    expect(w.get('#termsCheck').attributes('aria-describedby')).toBe('termsCheck-error')
    expect(w.find('#gpsLink').attributes('aria-invalid')).toBeUndefined()
    expect(document.activeElement).toBe(name.element)
    expect(document.querySelector('[role="dialog"]')).toBeNull()

    // After the first submit, errors follow the values.
    await name.setValue('Ruta')
    expect(name.attributes('aria-invalid')).toBeUndefined()
    expect(w.find('#routeName-error').exists()).toBe(false)
  })

  it('rejects negative numbers and malformed URLs', async () => {
    const w = mountForm()
    await fillValid(w)
    await w.get('#elevation').setValue('-5')
    await w.get('#gpsLink').setValue('no es una url')
    await w.get('form').trigger('submit')
    await flushPromises()

    expect(w.get('#elevation-error').text()).toBe(es.routeForm.errors.notNegativeNumber)
    expect(w.get('#gpsLink-error').text()).toBe(es.routeForm.errors.invalidUrl)
    expect(document.activeElement).toBe(w.get('#gpsLink').element)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('shows labels, options and validation messages in the active language', async () => {
    const w = mountForm()
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(w.get('#elevation-error').text()).toBe(es.routeForm.errors.required.elevation)

    testI18n.global.locale.value = 'en'
    await flushPromises()

    expect(w.get('#elevation-error').text()).toBe(en.routeForm.errors.required.elevation)
    expect(w.get('#termsCheck-error').text()).toBe(en.routeForm.errors.required.terms)
    expect(w.get('label[for="routeName"]').text()).toBe(en.routeForm.fields.routeName.label)
    expect(w.get('#routeName').attributes('placeholder')).toBe(
      en.routeForm.fields.routeName.placeholder,
    )
    expect(w.findAll('#markerType option').map((o) => o.text())).toEqual([
      en.routeForm.fields.markerType.placeholder,
      ...Object.values(en.routeForm.options.discipline),
    ])
    expect(w.get('.route-form-button').text()).toBe(en.routeForm.submit)
  })

  it('opens the dialog with the route name, resets the form and returns focus on Esc', async () => {
    const w = mountForm()
    await fillValid(w)
    await w.get('form').trigger('submit')
    await flushPromises()

    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog?.textContent).toContain('La arista de los vientos')
    expect((w.get('#routeName').element as HTMLInputElement).value).toBe('')
    expect((w.get('#termsCheck').element as HTMLInputElement).checked).toBe(false)
    expect(w.find('.field-error').exists()).toBe(false)

    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await flushPromises()

    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(w.get('button[type="submit"]').element)
  })

  it('closes with «Entendido» and returns focus to the submit button', async () => {
    const w = mountForm()
    await fillValid(w)
    await w.get('form').trigger('submit')
    await flushPromises()

    const close = [...document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')].find(
      (button) => button.textContent?.trim() === 'Entendido',
    )
    close?.click()
    await flushPromises()

    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(w.get('button[type="submit"]').element)
  })
})
