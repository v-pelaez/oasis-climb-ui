import type { NewsItem, RelativeDate } from '@/types/news'

export const news: NewsItem[] = [
  {
    title: 'Tradicional en roca: aventuras en la naturaleza',
    text: 'La escalada tradicional apuesta por la equipación manual y la lectura de la roca, brindando libertad y responsabilidad en cada vía. [...]',
    img: new URL('../assets/thumbnails/climbing-2609319_1280.jpg', import.meta.url).href,
    published: { value: -1, unit: 'hour' },
  },
  {
    title: 'Escalada deportiva urbana: superando límites',
    text: 'Practicada en entornos urbanos, la escalada deportiva combina técnica y destreza, demostrando que cualquier pared puede ser un reto vertical. [...]',
    img: new URL('../assets/thumbnails/free-climbing-4196577_1280.jpg', import.meta.url).href,
    published: { value: -3, unit: 'hour' },
  },
  {
    title: 'Rutas en nieve: exploración y resistencia',
    text: 'Las travesías en nieve invitan a descubrir la montaña de otra forma, combinando orientación, técnica y preparación física. [...]',
    img: new URL('../assets/thumbnails/snow-8033482_1280.jpg', import.meta.url).href,
    published: { value: -1, unit: 'day' },
  },
  {
    title: 'Cumbre compartida: logro y compañerismo',
    text: 'Alcanzar la cima simboliza el esfuerzo colectivo, la superación personal y el disfrute del paisaje en lo más alto. [...]',
    img: new URL('../assets/thumbnails/mountaineer-396533_1280.jpg', import.meta.url).href,
    published: { value: -2, unit: 'day' },
  },
  {
    title: 'Montañismo alpino: retos en la altura',
    text: 'Superar grandes cumbres implica esfuerzo físico y mental, además de trabajo en equipo y buena planificación para alcanzar la cima. [...]',
    img: new URL('../assets/thumbnails/mountain-climbing-1840220_1280.jpg', import.meta.url).href,
    published: { value: -3, unit: 'day' },
  },
]

const relativeTime = new Intl.RelativeTimeFormat('es')

/** "hace 1 hora", "hace 2 días"… */
export function formatRelativeDate({ value, unit }: RelativeDate): string {
  return relativeTime.format(value, unit)
}
