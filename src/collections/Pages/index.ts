import type { CollectionConfig } from 'payload'
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from '@payloadcms/plugin-seo/fields'

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
        {
            type: 'tabs',
            tabs: [
                {
                    label: {
                        de: 'Inhalt',
                        en: 'Content',
                    },
                    fields: [
                        {
                            name: 'layout',
                            type: 'text',
                            localized: false,
                            label: { de: 'Seiteninhalt', en: 'Page content' },
                            admin: {
                                // initCollapsed: true,
                            },
                        },
                    ],
                },
                {
                    label: {
                        de: 'SEO',
                        en: 'SEO',
                    },
                    fields: [
                        {
                            name: 'meta',
                            type: 'group',
                            label: false,
                            fields: [
                                OverviewField({
                                    titlePath: 'meta.title',
                                    descriptionPath: 'meta.description',
                                    imagePath: 'meta.image',
                                }),
                                MetaTitleField({
                                    hasGenerateFn: true,
                                    overrides: { localized: true },
                                }),
                                MetaDescriptionField({
                                    hasGenerateFn: true,
                                    overrides: { localized: true },
                                }),
                                MetaImageField({
                                    relationTo: 'media',
                                }),
                                {
                                    name: 'canonical',
                                    type: 'text',
                                    label: { de: 'Canonical URL', en: 'Canonical URL' },
                                    admin: {
                                        description: {
                                            de: 'Leer lassen für automatische URL. Nur setzen, wenn diese Seite bewusst auf eine andere zeigen soll.',
                                            en: 'Leave empty for the automatic URL. Only set if this page should point elsewhere.',
                                        },
                                    },
                                },
                                {
                                    name: 'noIndex',
                                    type: 'checkbox',
                                    defaultValue: false,
                                    label: { de: 'Nicht indexieren', en: 'No index' },
                                },
                                PreviewField({
                                    hasGenerateFn: true,
                                    titlePath: 'meta.title',
                                    descriptionPath: 'meta.description',
                                }),
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}
