import type { AboutContent, HeroVideo, NavLink, SocialLink } from '@/types/site'

/** Page sections, shared by the header nav and the footer menu. */
export const navLinks: NavLink[] = [
  { text: 'Novedades', href: '#novedades' },
  { text: 'Ranking', href: '#ranking' },
  { text: 'Registra tus marcas', href: '#registro' },
  { text: 'Sobre Nosotros', href: '#about-us' },
]

export const socialLinks: SocialLink[] = [
  { name: 'Instagram', url: '', icon: 'instagram' },
  { name: 'Facebook', url: '', icon: 'facebook' },
  { name: 'Twitter', url: '', icon: 'x' },
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

/** Yellow strip above the hero. */
export const heroTagline = 'Aspira, construye, logra.'

export const about: AboutContent = {
  tagline: 'Conoce la pasión que nos mueve.',
  image: {
    src: new URL('../assets/rappel.jpg', import.meta.url).href,
    alt: 'Rápel en una pared de montaña',
  },
  title: 'Sobre nosotros',
  heading: 'Nuestra historia y misión',
  lead: 'En un mundo donde la huella humana a menudo desdibuja la naturaleza, nace Oasis Climb con una misión clara: preservar y compartir el legado de la montaña.',
  body: 'Creemos que cada ruta, cada cima, cada vía ferrata, es una historia grabada en el paisaje, un desafío superado y un tesoro a proteger. Nuestro objetivo es crear una comunidad donde el conocimiento técnico y la seguridad sean primordiales.',
  quote: 'La montaña es un eco de la eternidad.',
  video: {
    src: new URL('../assets/aboutus.webm', import.meta.url).href,
    type: 'video/webm',
    poster: new URL('../assets/videoposter.png', import.meta.url).href,
    label: 'Vídeo de presentación de Oasis Climb',
  },
}
