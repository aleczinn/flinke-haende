import type { MetadataRoute } from 'next'
import { brand } from '@/brand/config'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: brand.name,
        short_name: brand.shortName,
        description: brand.description,
        start_url: '/',
        display: 'standalone',
        background_color: brand.backgroundColor,
        theme_color: brand.themeColor,
        icons: [
            { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/brand/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
    }
}
