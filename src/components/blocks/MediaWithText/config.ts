import type { Block } from 'payload'
import {
    FixedToolbarFeature,
    lexicalEditor,
    LinkFeature,
    OrderedListFeature,
    UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { backgroundColorField } from '@/fields/background-color'
import { buttonGroupField } from '@/fields/button-group'
import { headlineField } from '@/fields/headline'
import { taglineField } from '@/fields/tagline'

export const MediaWithText: Block = {
    slug: 'media_with_text',
    interfaceName: 'MediaWithText',
    labels: {
        singular: { de: 'Medien mit Text', en: 'Media with Text' },
        plural: { de: 'Medien mit Text', en: 'Media with Text' },
    },
    fields: [
        {
            name: 'layout',
            type: 'select',
            required: true,
            defaultValue: 'left',
            label: { de: 'Layout', en: 'Layout' },
            options: [
                { label: { de: 'Medien links', en: 'Media left' }, value: 'left' },
                { label: { de: 'Medien rechts', en: 'Media right' }, value: 'right' },
            ],
        },
        taglineField(),
        headlineField(),
        {
            name: 'text',
            type: 'richText',
            localized: true,
            label: { de: 'Text', en: 'Text' },
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                    ...defaultFeatures,
                    FixedToolbarFeature(),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                    LinkFeature(),
                ],
            }),
        },

        // MEDIA
        {
            name: 'mediaType',
            type: 'select',
            required: true,
            defaultValue: 'image',
            label: { de: 'Medientyp', en: 'Media type' },
            options: [
                { label: { de: 'Bild', en: 'Image' }, value: 'image' },
                { label: { de: 'Lokales Video', en: 'Local video' }, value: 'video' },
                {
                    label: { de: 'Externes Video (z. B. YouTube)', en: 'External video (e.g. YouTube)' },
                    value: 'externalVideo',
                },
                { label: { de: 'Bildvergleich', en: 'Image comparison' }, value: 'comparison' },
            ],
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            label: { de: 'Bild', en: 'Image' },
            admin: {
                condition: (_, sib) => sib?.mediaType === 'image',
            },
            validate: (value: unknown, { siblingData }: any) =>
                siblingData?.mediaType === 'image' && !value ? 'Bitte ein Bild auswählen.' : true,
        },
        {
            name: 'video',
            type: 'upload',
            relationTo: 'media',
            label: { de: 'Video', en: 'Video' },
            admin: {
                condition: (_, sib) => sib?.mediaType === 'video',
            },
            validate: (value: unknown, { siblingData }: any) =>
                siblingData?.mediaType === 'video' && !value ? 'Bitte ein Video auswählen.' : true,
        },
        {
            name: 'externalVideoUrl',
            type: 'text',
            label: { de: 'Video-URL', en: 'Video URL' },
            admin: {
                condition: (_, sib) => sib?.mediaType === 'externalVideo',
                placeholder: 'https://www.youtube.com/watch?v=…',
                description: {
                    de: 'YouTube, Vimeo oder andere Embed-fähige URLs.',
                    en: 'YouTube, Vimeo or other embeddable URLs.',
                },
            },
            validate: (value: unknown, { siblingData }: any) =>
                siblingData?.mediaType === 'externalVideo' && !value ? 'Bitte eine Video-URL eingeben.' : true,
        },
        {
            name: 'comparisonBefore',
            type: 'upload',
            relationTo: 'media',
            label: { de: 'Bildvergleich – Vorher', en: 'Image comparison – Before' },
            admin: {
                condition: (_, sib) => sib?.mediaType === 'comparison',
            },
            validate: (value: unknown, { siblingData }: any) =>
                siblingData?.mediaType === 'comparison' && !value ? 'Bitte das Vorher-Bild auswählen.' : true,
        },
        {
            name: 'comparisonAfter',
            type: 'upload',
            relationTo: 'media',
            label: { de: 'Bildvergleich – Nachher', en: 'Image comparison – After' },
            admin: {
                condition: (_, sib) => sib?.mediaType === 'comparison',
            },
            validate: (value: unknown, { siblingData }: any) =>
                siblingData?.mediaType === 'comparison' && !value ? 'Bitte das Nachher-Bild auswählen.' : true,
        },
        buttonGroupField({ overrides: { maxRows: 2 } }),
        backgroundColorField(),
    ],
}