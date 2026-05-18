import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'parent', 'updatedAt'],
    },
    versions: { drafts: true },
    labels: {
        singular: { de: 'Seite', en: 'Page' },
        plural: { de: 'Seiten', en: 'Pages' },
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
            label: {
                de: 'Titel',
                en: 'Title',
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            localized: true,
            index: true,
            label: {
                de: 'Slug',
                en: 'Slug',
            },
        },
    ],
}
