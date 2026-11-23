// Converts the original JPG/PNG images to WebP and prints the output size and dimensions
// (copy them to `width`/`height` in src/data). Usage: node scripts/optimize-images.mjs <originals-dir>
// where <originals-dir> mirrors src/assets (thumbnails/ in a subfolder). Never enlarges an image.
import { mkdir, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets')
const from = resolve(process.argv[2] ?? root)

/** [source, output, max width, WebP quality] */
const jobs = [
  ['rappel.jpg', 'rappel.webp', 1920, 80],
  ['snowmountain.jpg', 'snowmountain.webp', 1920, 80],
  ['videoposter.png', 'videoposter.webp', 1280, 80],
  ['thumbnails/climbing-2609319_1280.jpg', 'thumbnails/climbing-2609319.webp', 800, 80],
  ['thumbnails/free-climbing-4196577_1280.jpg', 'thumbnails/free-climbing-4196577.webp', 800, 80],
  ['thumbnails/mountain-climbing-1840220_1280.jpg', 'thumbnails/mountain-climbing-1840220.webp', 800, 80],
  ['thumbnails/mountaineer-396533_1280.jpg', 'thumbnails/mountaineer-396533.webp', 800, 80],
  ['thumbnails/snow-8033482_1280.jpg', 'thumbnails/snow-8033482.webp', 800, 80],
]

for (const [src, out, maxWidth, quality] of jobs) {
  const target = join(root, out)
  await mkdir(dirname(target), { recursive: true })
  const info = await sharp(join(from, src))
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(target)
  const before = (await stat(join(from, src))).size
  console.log(`${out}\t${info.width}x${info.height}\t${before} -> ${info.size} bytes`)
}
