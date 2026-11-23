/**
 * Inline SVG flags for the countries in the rankings (ISO 3166-1 alpha-2).
 * Emoji flags are not drawn by Chrome/Edge on Windows, so `CountryFlag` paints
 * these instead. The colours are each flag's official ones (content, not brand
 * tokens); emblems (ES, SK, CN, AR) are simplified.
 */
export interface FlagShape {
  tag: 'rect' | 'polygon' | 'circle' | 'path'
  attrs: Record<string, string | number>
}

export interface FlagDefinition {
  viewBox: string
  shapes: FlagShape[]
}

const rect = (x: number, y: number, width: number, height: number, fill: string): FlagShape => ({
  tag: 'rect',
  attrs: { x, y, width, height, fill },
})

/** Three equal horizontal bands on a 30×20 field. */
const horizontal = (top: string, middle: string, bottom: string): FlagShape[] => [
  rect(0, 0, 30, 20, middle),
  rect(0, 0, 30, 20 / 3, top),
  rect(0, 40 / 3, 30, 20 / 3, bottom),
]

/** Three equal vertical bands on a 30×20 field. */
const vertical = (left: string, middle: string, right: string): FlagShape[] => [
  rect(0, 0, 30, 20, middle),
  rect(0, 0, 10, 20, left),
  rect(20, 0, 10, 20, right),
]

/** Five-pointed star centred on (cx, cy) with outer radius r, one point up. */
function star(cx: number, cy: number, r: number, fill: string): FlagShape {
  const points = Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.382
    const angle = (Math.PI / 5) * i - Math.PI / 2
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`
  })
  return { tag: 'polygon', attrs: { points: points.join(' '), fill } }
}

const FIELD = '0 0 30 20'

export const flags: Record<string, FlagDefinition> = {
  AR: {
    viewBox: FIELD,
    shapes: [
      ...horizontal('#74acdf', '#fff', '#74acdf'),
      {
        tag: 'circle',
        attrs: { cx: 15, cy: 10, r: 2, fill: '#f6b40e', stroke: '#85340a', 'stroke-width': 0.3 },
      },
    ],
  },
  AT: { viewBox: FIELD, shapes: horizontal('#c8102e', '#fff', '#c8102e') },
  BG: { viewBox: FIELD, shapes: horizontal('#fff', '#00966e', '#d62612') },
  CH: {
    viewBox: '0 0 20 20',
    shapes: [rect(0, 0, 20, 20, '#da291c'), rect(8, 4, 4, 12, '#fff'), rect(4, 8, 12, 4, '#fff')],
  },
  CN: {
    viewBox: FIELD,
    shapes: [
      rect(0, 0, 30, 20, '#ee1c25'),
      star(5, 5, 3, '#ffff00'),
      star(10, 2, 1, '#ffff00'),
      star(12, 4, 1, '#ffff00'),
      star(12, 7, 1, '#ffff00'),
      star(10, 9, 1, '#ffff00'),
    ],
  },
  CZ: {
    viewBox: FIELD,
    shapes: [
      rect(0, 0, 30, 20, '#d7141a'),
      rect(0, 0, 30, 10, '#fff'),
      { tag: 'polygon', attrs: { points: '0,0 15,10 0,20', fill: '#11457e' } },
    ],
  },
  DE: { viewBox: FIELD, shapes: horizontal('#000', '#dd0000', '#ffce00') },
  ES: {
    viewBox: FIELD,
    shapes: [
      rect(0, 0, 30, 20, '#c60b1e'),
      rect(0, 5, 30, 10, '#ffc400'),
      {
        tag: 'path',
        attrs: { d: 'M7.5 7.5h4v3c0 1.4-.9 2.2-2 2.5-1.1-.3-2-1.1-2-2.5Z', fill: '#ad1519' },
      },
    ],
  },
  IT: { viewBox: FIELD, shapes: vertical('#009246', '#fff', '#ce2b37') },
  JP: {
    viewBox: FIELD,
    shapes: [
      rect(0, 0, 30, 20, '#fff'),
      { tag: 'circle', attrs: { cx: 15, cy: 10, r: 6, fill: '#bc002d' } },
    ],
  },
  SK: {
    viewBox: FIELD,
    shapes: [
      ...horizontal('#fff', '#0b4ea2', '#ee1c25'),
      {
        tag: 'path',
        attrs: {
          d: 'M6.5 4.5h7v6.2c0 2.6-1.8 4.1-3.5 5-1.7-.9-3.5-2.4-3.5-5Z',
          fill: '#ee1c25',
          stroke: '#fff',
          'stroke-width': 0.6,
        },
      },
      rect(9.6, 6, 0.8, 7, '#fff'),
      rect(8.4, 7.4, 3.2, 0.8, '#fff'),
      rect(7.8, 9.4, 4.4, 0.8, '#fff'),
      {
        tag: 'path',
        attrs: {
          d: 'M7.3 12.8c.9-1.1 1.9-1.1 2.7 0 .8-1.1 1.8-1.1 2.7 0-.6 1.3-1.6 2-2.7 2.6-1.1-.6-2.1-1.3-2.7-2.6Z',
          fill: '#0b4ea2',
        },
      },
    ],
  },
}
