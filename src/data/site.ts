import type { AboutContent, HeroVideo, NavLink, SocialLink } from '@/types/site'

/** Page sections, shared by the header nav and the footer menu. */
export const navLinks: NavLink[] = [
  { key: 'news', href: '#novedades' },
  { key: 'ranking', href: '#ranking' },
  { key: 'register', href: '#registro' },
  { key: 'about', href: '#about-us' },
]

export const socialLinks: SocialLink[] = [
  { name: 'Instagram', url: '', icon: 'instagram' },
  { name: 'Facebook', url: '', icon: 'facebook' },
  { name: 'Twitter', url: '', icon: 'x' },
]

export const heroVideos: HeroVideo[] = [
  { src: new URL('../assets/aspira.webm', import.meta.url).href, key: 'aspire' },
  { src: new URL('../assets/construye.webm', import.meta.url).href, key: 'build' },
  { src: new URL('../assets/logra.webm', import.meta.url).href, key: 'achieve' },
]

export const about: AboutContent = {
  image: { src: new URL('../assets/rappel.jpg', import.meta.url).href },
  video: {
    src: new URL('../assets/aboutus.webm', import.meta.url).href,
    type: 'video/webm',
    poster: new URL('../assets/videoposter.png', import.meta.url).href,
  },
}
