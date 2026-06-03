import { CollectionConfig } from 'payload'
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { generatePreviewPath } from '@/lib/utilities/generatePreviewPath'
import { slugField } from '@/fields/slug'
import { MediaWithText } from '@/blocks/MediaWithText/config'

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'parent', 'updatedAt'],
        livePreview: {
            url: ({ data, req }) =>
                generatePreviewPath({
                    slug: typeof data?.slug === 'string' ? data.slug : '',
                    collection: 'pages',
                    data,
                    req,
                }),
        },
        preview: (data, { req }) =>
            generatePreviewPath({
                slug: typeof data?.slug === 'string' ? data.slug : '',
                collection: 'pages',
                data,
                req,
            }),
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
        slugField('title', {
            slug: {
                required: true,
                localized: true,
                admin: {
                    description: {
                        de: 'Definiert den Namen des URL-Segments dieser Seite.',
                        en: 'Defines the URL segment for this page.',
                    },
                },
            },
        }),
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
                            type: 'blocks',
                            localized: false,
                            label: { de: 'Seiteninhalt', en: 'Page content' },
                            admin: {
                                initCollapsed: true,
                            },
                            blocks: [MediaWithText],
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
