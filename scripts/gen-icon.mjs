// Generates the placeholder app icon (build/icon.png, 256x256 RGBA) without any image dependency.
// Design: DeepSeek-blue rounded square with a white window outline + cursor block.
// Replace with real brand assets later; keep this script until then.
import { deflateSync, crc32 } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SIZE = 256
const px = new Uint8Array(SIZE * SIZE * 4)

function setPx(x, y, r, g, b, a) {
  const i = (y * SIZE + x) * 4
  px[i] = r
  px[i + 1] = g
  px[i + 2] = b
  px[i + 3] = a
}

function inRoundedRect(x, y, x0, y0, x1, y1, radius) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false
  const cx = Math.max(x0 + radius, Math.min(x, x1 - radius))
  const cy = Math.max(y0 + radius, Math.min(y, y1 - radius))
  const dx = x - cx
  const dy = y - cy
  return dx * dx + dy * dy <= radius * radius
}

// Background: rounded square, DeepSeek blue.
const BG = [77, 107, 254]
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    if (inRoundedRect(x, y, 8, 8, SIZE - 9, SIZE - 9, 56)) {
      setPx(x, y, BG[0], BG[1], BG[2], 255)
    }
  }
}

// Window outline: white rounded-rect ring (stroke drawn as outer minus inner).
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const outer = inRoundedRect(x, y, 56, 56, SIZE - 57, SIZE - 57, 32)
    const inner = inRoundedRect(x, y, 66, 66, SIZE - 67, SIZE - 67, 26)
    if (outer && !inner) setPx(x, y, 255, 255, 255, 255)
  }
}

// Window title bar: white strip across the top of the window.
for (let y = 64; y < 84; y++) {
  for (let x = 66; x < SIZE - 66; x++) {
    if (inRoundedRect(x, y, 66, 64, SIZE - 67, 83, 20)) setPx(x, y, 255, 255, 255, 255)
  }
}

// Cursor block: white square, lower-left of the window.
for (let y = 160; y < 200; y++) {
  for (let x = 84; x < 124; x++) setPx(x, y, 255, 255, 255, 255)
}

// Encode PNG: scanlines with filter byte 0, then deflate.
const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1))
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0
  Buffer.from(px.buffer, y * SIZE * 4, SIZE * 4).copy(raw, y * (SIZE * 4 + 1) + 1)
}
const idat = deflateSync(raw, { level: 9 })

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(SIZE, 0)
ihdr.writeUInt32BE(SIZE, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // color type RGBA
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0))
])

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'build')
mkdirSync(outDir, { recursive: true })
const outFile = join(outDir, 'icon.png')
writeFileSync(outFile, png)
console.log(`wrote ${outFile} (${png.length} bytes)`)
