import { Plugin } from 'payload'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'

export const plugins: Plugin[] = [
    nestedDocsPlugin({
        collections: ['pages'],
        generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
]