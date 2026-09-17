import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const root = process.cwd()
const source = path.join(root, 'src', 'app', 'icon.svg')
const brandConfig = JSON.parse(await fs.readFile(path.join(root, 'src', 'brand', 'brand.json'), 'utf8'))
const publicDir = path.join(root, 'public', 'brand')
const appDir = path.join(root, 'src', 'app')
const maskableBackground = brandConfig.maskableBackgroundColor

await fs.mkdir(publicDir, { recursive: true })

const svg = await fs.readFile(source)

async function png(size, destination, { maskable = false } = {}) {
    let pipeline = sharp(svg).resize({
        width: maskable ? Math.round(size * 0.72) : size,
        height: maskable ? Math.round(size * 0.72) : size,
        fit: 'contain',
    })

    if (maskable) {
        pipeline = pipeline.extend({
            top: Math.floor((size - Math.round(size * 0.72)) / 2),
            bottom: Math.ceil((size - Math.round(size * 0.72)) / 2),
            left: Math.floor((size - Math.round(size * 0.72)) / 2),
            right: Math.ceil((size - Math.round(size * 0.72)) / 2),
            background: maskableBackground,
        })
    }

    const buffer = await pipeline.png().toBuffer()
    await fs.writeFile(destination, buffer)
    return buffer
}

function createIco(images) {
    const header = Buffer.alloc(6)
    header.writeUInt16LE(0, 0)
    header.writeUInt16LE(1, 2)
    header.writeUInt16LE(images.length, 4)

    const entries = Buffer.alloc(images.length * 16)
    let offset = header.length + entries.length

    images.forEach(({ size, data }, index) => {
        const position = index * 16
        entries.writeUInt8(size === 256 ? 0 : size, position)
        entries.writeUInt8(size === 256 ? 0 : size, position + 1)
        entries.writeUInt8(0, position + 2)
        entries.writeUInt8(0, position + 3)
        entries.writeUInt16LE(1, position + 4)
        entries.writeUInt16LE(32, position + 6)
        entries.writeUInt32LE(data.length, position + 8)
        entries.writeUInt32LE(offset, position + 12)
        offset += data.length
    })

    return Buffer.concat([header, entries, ...images.map(({ data }) => data)])
}

const faviconImages = []
for (const size of [16, 32, 48]) {
    const data = await sharp(svg).resize(size, size, { fit: 'contain' }).png().toBuffer()
    faviconImages.push({ size, data })
}

await fs.writeFile(path.join(appDir, 'favicon.ico'), createIco(faviconImages))
await png(180, path.join(appDir, 'apple-icon.png'))
await png(192, path.join(publicDir, 'icon-192.png'))
await png(512, path.join(publicDir, 'icon-512.png'))
await png(192, path.join(publicDir, 'icon-maskable-192.png'), { maskable: true })
await png(512, path.join(publicDir, 'icon-maskable-512.png'), { maskable: true })

console.log('Brand assets generated from src/app/icon.svg')
