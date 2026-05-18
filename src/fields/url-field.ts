import type { Field } from 'payload'

export const urlField = (name: string, label: { de: string; en: string }, placeholder: string): Field => ({
    name: name,
    type: 'text',
    label: label,
    admin: { placeholder },
    validate: (value: unknown) =>
        !value || /^https?:\/\//.test(String(value)) ? true : 'Bitte eine vollständige URL mit https:// angeben.',
})
