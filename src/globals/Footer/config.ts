import type { GlobalConfig } from 'payload'
import { navigationLinkField } from '@/fields/navigation-link'

export const Footer: GlobalConfig = {
    slug: 'footer',
    label: {
        de: 'Footer',
        en: 'Footer',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'navigation',
            type: 'array',
            label: { de: 'Footer-Navigation', en: 'Footer navigation' },
            labels: {
                singular: {
                    de: 'Link',
                    en: 'Link'
                },
                plural: {
                    de: 'Links',
                    en: 'Links'
                }
            },
            maxRows: 8,
            fields: navigationLinkField(),
        },
    ],
}
