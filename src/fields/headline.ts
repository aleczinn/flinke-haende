import type { Field } from 'payload'
import deepMerge from '@/lib/utilities/deepMerge'

export const headlineField = (overrides: Partial<Field> = {}): Field =>
    deepMerge(
        {
            name: 'headline',
            type: 'text',
            required: true,
            localized: true,
            label: {
                de: 'Überschrift',
                en: 'Headline',
            },
        },
        overrides,
    )
