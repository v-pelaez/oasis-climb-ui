import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = join(__dirname, '..', '..')
const read = (file: string) => readFileSync(join(root, file), 'utf8')

describe('case study', () => {
  const text = read('docs/case-study.md')
  const english = text.slice(text.indexOf('## English'), text.indexOf('## Español'))
  const spanish = text.slice(text.indexOf('## Español'), text.indexOf('## Portfolio fields'))

  it('has an English and a Spanish part, in that order', () => {
    expect(text).toContain('## English')
    expect(text).toContain('## Español')
    expect(text.indexOf('## English')).toBeLessThan(text.indexOf('## Español'))
  })

  it.each([
    ['English', () => english],
    ['Spanish', () => spanish],
  ])('%s part has Problem, Process, Decisions and Result', (_name, part) => {
    for (const heading of ['Problem', 'Process', 'Decisions', 'Result']) {
      expect(part()).toContain(`### ${heading}`)
    }
  })

  it('ends with the portfolio fields block', () => {
    const block = text.slice(text.indexOf('## Portfolio fields'))
    for (const key of ['summary:', 'context:', 'decisions:', 'challenges:']) {
      expect(block).toContain(key)
    }
  })

  it('has no pending-work markers', () => {
    expect(text).not.toMatch(/\b(TODO|TBD|XXX)\b/)
    expect(read('docs/metrics-baseline.md')).not.toMatch(/\b(TODO|TBD|XXX)\b/)
  })
})

describe('README', () => {
  const readme = read('README.md')

  it('has no placeholders', () => {
    expect(readme).not.toContain('<nuevo-nombre')
  })

  it('does not mention the removed CSS frameworks', () => {
    expect(readme).not.toMatch(/bootstrap|coreui/i)
  })

  it('links the case study and documents the test script', () => {
    expect(readme).toContain('./docs/case-study.md')
    expect(readme).toContain('npm run test')
  })
})
