import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { admin } from '@/access/roles/admin'
import { adminOrEditor } from '@/access/roles/adminOrEditor'
import { fileURLToPath } from 'url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
    slug: 'media',
    folders: true,
    access: {
        create: adminOrEditor,
        delete: admin,
        read: anyone,
        update: adminOrEditor,
    },
    labels: {
        singular: { de: 'Medien', en: 'Media' },
        plural: { de: 'Medien', en: 'Media' },
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: true,
        },
    ],
    upload: {
        // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
        staticDir: path.resolve(dirname, '../../public/media'),
        adminThumbnail: 'thumbnail',
        focalPoint: true,
        formatOptions: {
            format: 'avif',
            options: {
                quality: 60,
            },
        },
        imageSizes: [
            // Für Admin Panel Vorschau
            {
                name: 'thumbnail',
                width: 300,
                formatOptions: { format: 'avif', options: { quality: 60 } },
            },
            {
                name: 'square',
                width: 1000,
                height: 1000,
                crop: 'center',
                formatOptions: { format: 'avif', options: { quality: 60 } },
            },
            {
                name: 'widescreen',
                width: 1920,
                height: 1080,
                crop: 'center',
                formatOptions: { format: 'avif', options: { quality: 60 } },
            },
            {
                name: 'og',
                width: 1200,
                height: 630,
                crop: 'center',
                formatOptions: { format: 'avif', options: { quality: 60 } },
            },
        ],
    },
}
