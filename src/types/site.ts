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

export interface AboutContent {
  /** Yellow strip above the header image. */
  tagline: string
  image: { src: string; alt: string }
  title: string
  heading: string
  lead: string
  body: string
  quote: string
  video: {
    src: string
    /** MIME type of `src`; must match the real file. */
    type: `video/${string}`
    poster: string
    label: string
  }
}
