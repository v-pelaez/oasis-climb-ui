import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = join(__dirname, '..', '..')
const src = join(root, 'src')

/** Text sources under `src/` (binary media such as the WebM videos are skipped). */
const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.(vue|ts|scss|css|html|json)$/.test(entry.name) ? [path] : []
  })

describe('Bootstrap and CoreUI are gone', () => {
  it('package.json has no Bootstrap, CoreUI, sass-loader or Font Awesome', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    const names = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
    const banned = names.filter((name) =>
      /^(bootstrap|@types\/bootstrap|@coreui\/.*|sass-loader|@fortawesome\/.*|font-awesome)$/.test(
        name,
      ),
    )
    expect(banned).toEqual([])
    expect(pkg.devDependencies).toHaveProperty('sass')
  })

  it('src/ uses no Bootstrap classes or data attributes', () => {
    // Same pattern as the ticket's `grep -rE`; the bracketed letters only keep this
    // file from matching its own source.
    const bootstrap =
      /\b(container[-]fluid|[r]ow|col[-](sm|md|lg)-|d[-]flex|btn[-]primary|nav[b]ar|data[-]bs-)/
    const hits = sourceFiles(src).flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .flatMap((line, i) =>
          bootstrap.test(line) ? [`${relative(root, file)}:${i + 1}: ${line.trim()}`] : [],
        ),
    )
    expect(hits).toEqual([])
  })

  it('the brand yellow is only written in tokens.scss (images aside)', () => {
    const files = sourceFiles(src).filter((file) => /#f8c52[d]/i.test(readFileSync(file, 'utf8')))
    expect(files.map((file) => relative(src, file).split('\\').join('/'))).toEqual([
      'assets/styles/tokens.scss',
    ])
  })
})
