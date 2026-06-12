import type { Field } from 'payload'

type HeadlineFieldOptions = {
    required?: boolean
    localized?: boolean
}

export const headlineField = (options?: HeadlineFieldOptions): Field => ({
    name: 'headline',
    type: 'text',
    required: options?.required ?? true,
    localized: options?.localized ?? true,
    label: {
        de: 'Überschrift',
        en: 'Headline',
    },
})
