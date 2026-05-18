import { Plugin } from 'payload'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import type { Page } from '@/payload-types'
import { BASE_URL } from '@/lib/site'

const generateTitle: GenerateTitle<Page> = ({ doc }) => doc?.title ?? ''

const generateURL: GenerateURL<Page> = ({ doc, locale }) => {
    const lang = typeof locale === 'string' ? locale.split('-')[0] : 'de'
    const crumbs = doc?.breadcrumbs
    const path = crumbs?.[crumbs.length - 1]?.url ?? (doc?.slug ? `/${doc.slug}` : '')
    return `${BASE_URL}/${lang}${doc?.slug === 'home' ? '' : path}`
}

export const plugins: Plugin[] = [
    nestedDocsPlugin({
        collections: ['pages'],
        generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    seoPlugin({
        uploadsCollection: 'media',
        tabbedUI: false,
        generateTitle,
        generateURL,
    }),
]

