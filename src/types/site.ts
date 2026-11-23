export interface NavLink {
  /** Text at `nav.<key>` in the locale files. */
  key: 'news' | 'ranking' | 'register' | 'about'
  href: `#${string}`
}

/** Brand icons available in `AppIcon` for social links. */
export type SocialIcon = 'instagram' | 'facebook' | 'x' | 'github'

export interface SocialLink {
  /** Brand name (not translated). */
  name: string
  /** Empty while the profile does not exist: the footer shows a «no disponible» popover. */
  url: string
  icon: SocialIcon
}

export interface HeroVideo {
  src: string
  /** Phrase and subtext at `hero.slides.<key>` in the locale files. */
  key: 'aspire' | 'build' | 'achieve'
}

/** Media of the about section; its copy lives under `about.*` in the locale files. */
export interface AboutContent {
  image: { src: string }
  video: {
    src: string
    /** MIME type of `src`; must match the real file. */
    type: `video/${string}`
    poster: string
  }
}
