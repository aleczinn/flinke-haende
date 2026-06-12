import type { Block, Field } from 'payload'
import { backgroundColorField } from '@/fields/background-color'
import { headlineField } from '@/fields/headline'
import { taglineField } from '@/fields/tagline'
import {
    FixedToolbarFeature,
    lexicalEditor,
    LinkFeature,
    OrderedListFeature,
    UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

const accordionItem = (): Field[] => [
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
        name: 'text',
        type: 'richText',
        required: true,
        localized: true,
        label: {
            de: 'Text',
            en: 'Text',
        },
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
    {
        name: 'defaultOpen',
        type: 'checkbox',
        defaultValue: false,
        label: {
            de: 'Standardmäßig geöffnet',
            en: 'Open by default',
        },
    },
]

export const Accordion: Block = {
    slug: 'accordion',
    interfaceName: 'Accordion',
    labels: {
        singular: { de: 'Accordion', en: 'Accordion' },
        plural: { de: 'Accordions', en: 'Accordions' },
    },
    fields: [
        {
            name: 'layout',
            type: 'select',
            required: true,
            defaultValue: 'center',
            options: [
                {
                    label: 'Left',
                    value: 'left',
                },
                {
                    label: 'Center',
                    value: 'center',
                },
                {
                    label: 'Right',
                    value: 'right',
                },
            ],
        },
        taglineField(),
        headlineField(),
        {
            name: 'allowMultipleOpen',
            type: 'checkbox',
            defaultValue: false,
            label: {
                de: 'Dürfen mehrere Elemente gleichzeitig offen sein?',
                en: 'Can multiple elements be open at the same time?',
            },
        },
        {
            name: 'items',
            type: 'array',
            required: true,
            minRows: 1,
            fields: accordionItem(),
        },
        backgroundColorField(),
    ],
}