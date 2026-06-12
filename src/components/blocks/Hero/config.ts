import type { Block } from 'payload'
import { buttonGroupField } from '@/fields/button-group'
import { headlineField } from '@/fields/headline'
import { taglineField } from '@/fields/tagline'

export const Hero: Block = {
    slug: 'hero',
    interfaceName: 'Hero',
    labels: {
        singular: { de: 'Hero', en: 'Hero' },
        plural: { de: 'Heros', en: 'Heros' },
    },
    fields: [
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: { de: 'Bild', en: 'Image' },
        },
        taglineField(),
        headlineField(),
        {
            name: 'text',
            type: 'textarea',
            required: true,
            localized: true,
            label: { de: 'Text', en: 'Text' },
        },
        buttonGroupField({ overrides: { maxRows: 2 } }),
    ],
}
