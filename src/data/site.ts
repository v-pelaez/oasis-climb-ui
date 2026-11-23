import type { HeroVideo, NavLink, SocialLink } from '@/types/site'

/** Page sections, shared by the header nav and the footer menu. */
export const navLinks: NavLink[] = [
  { text: 'Novedades', href: '#novedades' },
  { text: 'Ranking', href: '#ranking' },
  { text: 'Registra tus marcas', href: '#registro' },
  { text: 'Sobre Nosotros', href: '#about-us' },
]

export const socialLinks: SocialLink[] = [
  { name: 'Instagram', url: '', icon: 'fab fa-instagram' },
  { name: 'Facebook', url: '', icon: 'fab fa-facebook-f' },
  { name: 'Twitter', url: '', icon: 'fab fa-x-twitter' },
]

export const heroVideos: HeroVideo[] = [
  {
    src: new URL('../assets/aspira.webm', import.meta.url).href,
    phrase: 'La mirada en lo alto',
    subtext: 'Visualiza la línea donde otros solo ven vacío.',
  },
  {
    src: new URL('../assets/construye.webm', import.meta.url).href,
    phrase: 'El movimiento preciso',
    subtext: 'Tu progreso se esculpe paso a paso, agarre a agarre.',
  },
  {
    src: new URL('../assets/logra.webm', import.meta.url).href,
    phrase: 'La cumbre es el camino',
    subtext: 'El éxito es la armonía entre tu voluntad y la roca.',
  },
]
