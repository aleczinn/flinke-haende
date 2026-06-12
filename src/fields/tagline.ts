import type { Field } from 'payload'

export const taglineField = (): Field => ({
    name: 'tagline',
    type: 'text',
    localized: true,
    label: {
        de: 'Tagline',
        en: 'Tagline'
    },
})
