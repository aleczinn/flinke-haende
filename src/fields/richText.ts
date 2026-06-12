import type { Field } from 'payload'
import deepMerge from '@/lib/utilities/deepMerge'
import {
    FixedToolbarFeature,
    lexicalEditor,
    LinkFeature,
    OrderedListFeature,
    UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const richTextField = (overrides: Partial<Field> = {}): Field =>
    deepMerge(
        {
            name: 'text',
            type: 'richText',
            required: false,
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
        overrides,
    )
