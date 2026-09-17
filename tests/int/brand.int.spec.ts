import { describe, expect, it } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import manifest from '@/app/manifest'

const root = process.cwd()

describe('brand assets', () => {
    it.each([
        ['src/app/apple-icon.png', 180, 180],
        ['public/brand/icon-192.png', 192, 192],
        ['public/brand/icon-512.png', 512, 512],
        ['public/brand/icon-maskable-192.png', 192, 192],
        ['public/brand/icon-maskable-512.png', 512, 512],
    ])('%s has the expected dimensions', async (file, width, height) => {
        const metadata = await sharp(path.join(root, file)).metadata()
        expect(metadata.width).toBe(width)
        expect(metadata.height).toBe(height)
    })

    it('contains 16, 32 and 48 pixel favicon entries', async () => {
        const ico = await fs.readFile(path.join(root, 'src/app/favicon.ico'))
        expect(ico.readUInt16LE(4)).toBe(3)
        expect([ico[6], ico[22], ico[38]]).toEqual([16, 32, 48])
    })

    it('publishes regular and maskable manifest icons', () => {
        const purposes = manifest().icons?.map((icon) => icon.purpose)
        expect(purposes).toEqual(['any', 'any', 'maskable', 'maskable'])
    })
})
