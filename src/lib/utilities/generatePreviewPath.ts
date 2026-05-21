import type { CollectionSlug, PayloadRequest } from 'payload'
import { HOME_SLUG } from '@/lib/queries'
import { DEFAULT_LOCALE, toLocaleTag } from '@/lib/locale'

interface Args {
    collection: CollectionSlug
    slug: string
    data?: any
    req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, data, req }: Args) => {
    if (!slug) {
        return null
    }

    const localeTag = req.locale ?? toLocaleTag(DEFAULT_LOCALE)
    const lang = localeTag.split('-')[0]

    // Volle URL aus Breadcrumbs (vom nested-docs-Plugin) — Fallback: nur Slug
    const crumbs = data?.breadcrumbs as Array<{ url?: string }> | undefined
    const fullPath = crumbs?.[crumbs.length - 1]?.url ?? `/${slug}`
    const path = slug === HOME_SLUG ? `/${lang}` : `/${lang}${fullPath}`

    const params = new URLSearchParams({
        slug,
        collection,
        path,
        previewSecret: process.env.PREVIEW_SECRET ?? '',
    })

    return `/next/preview?${params.toString()}`
}
