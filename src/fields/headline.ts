import type { Field } from 'payload'

export const headlineField = (): Field => ({
    name: 'headline',
    type: 'text',
    required: true,
    localized: true,
    label: {
        de: 'Überschrift',
        en: 'Headline',
    },
})
