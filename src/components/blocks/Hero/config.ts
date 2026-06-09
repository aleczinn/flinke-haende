import type { Block } from 'payload'
import { buttonGroupField } from '@/fields/button-group'

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
        {
            name: 'tagline',
            type: 'text',
            localized: true,
            label: { de: 'Tagline', en: 'Tagline' },
        },
        {
            name: 'headline',
            type: 'text',
            required: true,
            localized: true,
            label: { de: 'Überschrift', en: 'Headline' },
        },
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
