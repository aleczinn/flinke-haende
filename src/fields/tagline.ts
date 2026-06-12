import type { Field } from 'payload'

type TaglineFieldOptions = {
    required?: boolean
    localized?: boolean
}

export const taglineField = (options?: TaglineFieldOptions): Field => ({
    name: 'tagline',
    type: 'text',
    required: options?.required ?? false,
    localized: options?.localized ?? true,
    label: {
        de: 'Tagline',
        en: 'Tagline',
    },
})
