import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
    slug: 'header',
    label: {
        de: 'Header',
        en: 'Header',
    },
    access: {
        read: () => true,
    },
    fields: [],
}