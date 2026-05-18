import type { Field } from 'payload'

export const descriptionField: Field = {
    name: 'description',
    type: 'text',
    localized: true,
    label: {
        de: 'Beschreibung',
        en: 'Description',
    },
    admin: {
        description: {
            de: 'Optionaler Zusatztext, der im Dropdown erscheint.',
            en: 'Optional supporting text shown in the dropdown.',
        },
    },
}

export const navigationLinkField = (): Field[] => [
    {
        name: 'type',
        type: 'radio',
        defaultValue: 'internal',
        options: [
            { label: { de: 'Interne Seite', en: 'Internal page' }, value: 'internal' },
            { label: { de: 'Externer Link', en: 'External link' }, value: 'external' },
        ],
        admin: { layout: 'horizontal' },
    },
    {
        name: 'page',
        type: 'relationship',
        relationTo: 'pages',
        label: { de: 'Seite', en: 'Page' },
        admin: { condition: (_, sib) => (sib?.type ?? 'internal') === 'internal' },
        validate: (value: unknown, { siblingData }: any) =>
            (siblingData?.type ?? 'internal') === 'internal' && !value ? 'Bitte eine Seite auswählen.' : true,
    },
    {
        name: 'url',
        type: 'text',
        label: { de: 'URL', en: 'URL' },
        admin: { condition: (_, sib) => sib?.type === 'external', placeholder: 'https://…' },
        validate: (value: unknown, { siblingData }: any) =>
            siblingData?.type === 'external' && !value ? 'Bitte eine URL angeben.' : true,
    },
    {
        name: 'label',
        type: 'text',
        localized: true,
        label: { de: 'Bezeichnung', en: 'Label' },
        admin: {
            description: {
                de: 'Optional bei internen Seiten — sonst wird der Seitentitel genutzt. Bei externen Links erforderlich.',
                en: 'Optional for internal pages — page title is used otherwise. Required for external links.',
            },
        },
        validate: (value: unknown, { siblingData }: any) =>
            siblingData?.type === 'external' && !value ? 'Bei externen Links ist eine Bezeichnung erforderlich.' : true,
    },
    {
        name: 'newTab',
        type: 'checkbox',
        defaultValue: false,
        label: { de: 'In neuem Tab öffnen', en: 'Open in new tab' },
        admin: { condition: (_, sib) => sib?.type === 'external' },
    },
]
