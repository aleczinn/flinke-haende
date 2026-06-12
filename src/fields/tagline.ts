import type { Field } from 'payload'
import deepMerge from '@/lib/utilities/deepMerge'

export const taglineField = (overrides: Partial<Field> = {}): Field =>
    deepMerge(
        {
            name: 'tagline',
            type: 'text',
            required: false,
            localized: true,
            label: {
                de: 'Tagline',
                en: 'Tagline',
            },
        },
        overrides,
    )
