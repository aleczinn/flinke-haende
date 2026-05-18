import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
    slug: 'footer',
    label: {
        de: 'Footer',
        en: 'Footer',
    },
    access: {
        read: () => true,
    },
    fields: [],
}
