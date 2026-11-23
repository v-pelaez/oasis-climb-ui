export interface NavLink {
  text: string
  href: `#${string}`
}

/** Brand icons available in `AppIcon` for social links. */
export type SocialIcon = 'instagram' | 'facebook' | 'x' | 'github'

export interface SocialLink {
  name: string
  /** Empty while the profile does not exist: the footer shows a «no disponible» popover. */
  url: string
  icon: SocialIcon
}

export interface HeroVideo {
  src: string
  phrase: string
  subtext: string
}
