import type { Field, GroupField } from 'payload'
import { ButtonVariant } from '@/components/ui/Button'
import deepMerge from '@/lib/utilities/deepMerge'

// Options-Array normal typisiert → kompatibel mit Payload
// const buttonVariantOptions: { label: string; value: ButtonVariant }[] = [
//     { label: 'Primary', value: 'primary' },
//     { label: 'Light', value: 'light' },
//     { label: 'Dark', value: 'dark' },
// ]

type ButtonType = (options?: {
    overrides?: Partial<GroupField>
}) => Field

export const buttonField: ButtonType = ({ overrides = {} } = {}) => {
    const typeFields: Field = {
        type: 'row',
        fields: [
            {
                name: 'type',
                type: 'radio',
                admin: {
                    layout: 'horizontal',
                    width: '50%',
                },
                defaultValue: 'reference',
                options: [
                    {
                        label: { de: 'Interne Seite', en: 'Internal page' },
                        value: 'reference',
                    },
                    {
                        label: { de: 'Externer Link', en: 'External link' },
                        value: 'external',
                    },
                ],
            },
            {
                name: 'newTab',
                type: 'checkbox',
                admin: {
                    style: {
                        alignSelf: 'flex-end',
                    },
                    width: '50%',
                },
                label: {
                    de: 'In neuem Tab öffnen',
                    en: 'Open in new tab',
                },
            },
        ],
    }

    const linkTypes: Field[] = [
        {
            name: 'reference',
            type: 'relationship',
            admin: {
                condition: (_, siblingData) => siblingData?.type === 'reference',
            },
            relationTo: 'pages',
            label: {
                de: 'Seite',
                en: 'Page'
            },
            required: true,
        },
        {
            name: 'url',
            type: 'text',
            admin: {
                condition: (_, siblingData) => siblingData?.type === 'external',
            },
            label: {
                de: 'Externe URL',
                en: 'External URL'
            },
            required: true,
        },
    ]

    const linkUrlAndName: Field = {
        type: 'row',
        fields: [
            ...linkTypes,
            {
                name: 'label',
                type: 'text',
                admin: {
                    width: '50%',
                    description: {
                        de: '(Optional) - Seitentitel wird als Fallback verwendet.',
                        en: '(Optional) - Page title is used as fallback.',
                    },
                },
                label: {
                    de: 'Beschriftung',
                    en: 'Label',
                },
            },
        ],
    }

    const appearance: Field = {
        name: 'variant',
        type: 'select',
        admin: {
            width: '50%',
            description: {
                de: 'Definiere das Aussehen deines Buttons.',
                en: 'Define the appearance of the button.',
            },
        },
        defaultValue: '',
        options: [],
    }

    const result: Field = {
        name: 'button',
        type: 'group',
        admin: {
            hideGutter: true,
        },
        fields: [typeFields, linkUrlAndName, appearance],
    }

    return deepMerge(result, overrides)
}