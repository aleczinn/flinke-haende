import type { Field, GroupField } from 'payload'
import { ButtonVariant } from '@/components/ui/Button'
import deepMerge from '@/lib/utilities/deepMerge'

const buttonVariantOptions: { label: string; value: ButtonVariant }[] = [
    { label: 'Primary', value: 'primary' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
]

type ButtonType = (options?: { overrides?: Partial<GroupField> }) => Field

export const buttonCoreFields = (): Field[] => [
    {
        type: 'row',
        fields: [
            {
                name: 'type',
                type: 'radio',
                defaultValue: 'reference',
                admin: { layout: 'horizontal', width: '50%' },
                options: [
                    { label: { de: 'Interne Seite', en: 'Internal page' }, value: 'reference' },
                    { label: { de: 'Externer Link', en: 'External link' }, value: 'external' },
                ],
            },
            {
                name: 'newTab',
                type: 'checkbox',
                label: { de: 'In neuem Tab öffnen', en: 'Open in new tab' },
                admin: { width: '50%', style: { alignSelf: 'flex-end' } },
            },
        ],
    },
    {
        type: 'row',
        fields: [
            {
                name: 'reference',
                type: 'relationship',
                relationTo: 'pages',
                label: { de: 'Seite', en: 'Page' },
                admin: {
                    condition: (_, sib) => sib?.type === 'reference',
                    width: '50%',
                },
                validate: (value: unknown, { siblingData }: any) =>
                    siblingData?.type === 'reference' && !value ? 'Bitte eine Seite auswählen.' : true,
            },
            {
                name: 'url',
                type: 'text',
                label: { de: 'Externe URL', en: 'External URL' },
                admin: {
                    condition: (_, sib) => sib?.type === 'external',
                    width: '50%',
                    placeholder: 'https://example.com',
                },
                validate: (value: unknown, { siblingData }: any) => {
                    if (siblingData?.type !== 'external') return true
                    if (!value) return 'Bitte eine URL eingeben.'
                    if (!/^https?:\/\//.test(String(value))) return 'URL muss mit https:// beginnen.'
                    return true
                },
            },
            {
                name: 'label',
                type: 'text',
                label: { de: 'Beschriftung', en: 'Label' },
                admin: {
                    width: '50%',
                    description: {
                        de: '(Optional) — Seitentitel wird als Fallback verwendet.',
                        en: '(Optional) — Page title is used as fallback.',
                    },
                },
                validate: (value: unknown, { siblingData }: any) =>
                    siblingData?.type === 'external' && !String(value ?? '').trim()
                        ? 'Bei externen Links ist eine Bezeichnung erforderlich.'
                        : true,
            },
        ],
    },
    {
        name: 'variant',
        type: 'select',
        defaultValue: 'primary',
        options: buttonVariantOptions,
        label: { de: 'Stil', en: 'Style' },
        admin: {
            width: '50%',
            description: {
                de: 'Definiere das Aussehen des Buttons.',
                en: 'Define the appearance of the button.',
            },
        },
    },
]

export const buttonField: ButtonType = ({ overrides = {} } = {}) => {
    const field = {
        name: 'button',
        type: 'group',
        admin: {
            hideGutter: true
        },
        fields: buttonCoreFields(),
    } as Field

    return deepMerge(field, overrides)
}
