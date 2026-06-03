import type { Field } from 'payload'
import { ButtonVariant } from '@/components/ui/Button'

// Options-Array normal typisiert → kompatibel mit Payload
const buttonVariantOptions: { label: string; value: ButtonVariant }[] = [
    { label: 'Primary', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
]

/** Kern-Felder — werden sowohl für group als auch array wiederverwendet */
const buttonCoreFields = (): Field[] => [
    {
        name: 'type',
        type: 'radio',
        defaultValue: 'internal',
        label: { de: 'Ziel-Typ', en: 'Target type' },
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
        admin: {
            condition: (_, sib) => (sib?.type ?? 'internal') === 'internal',
        },
        validate: (value: unknown, { siblingData }: any) =>
            (siblingData?.type ?? 'internal') === 'internal' && !value ? 'Bitte eine Seite auswählen.' : true,
    },
    {
        name: 'url',
        type: 'text',
        label: { de: 'URL', en: 'URL' },
        admin: {
            condition: (_, sib) => sib?.type === 'external',
            placeholder: 'https://…',
        },
        validate: (value: unknown, { siblingData }: any) =>
            siblingData?.type === 'external' && !value ? 'Bitte eine URL eingeben.' : true,
    },
    {
        name: 'label',
        type: 'text',
        localized: true,
        label: { de: 'Beschriftung', en: 'Label' },
        admin: {
            description: {
                de: 'Optional bei internen Seiten — Seitentitel wird als Fallback verwendet.',
                en: 'Optional for internal pages — page title is used as fallback.',
            },
        },
    },
    {
        name: 'variant',
        type: 'select',
        label: { de: 'Stil', en: 'Style' },
        defaultValue: 'primary',
        options: buttonVariantOptions,
    },
    {
        name: 'newTab',
        type: 'checkbox',
        defaultValue: false,
        label: { de: 'In neuem Tab öffnen', en: 'Open in new tab' },
        admin: {
            condition: (_, sib) => sib?.type === 'external',
        },
    },
]

/**
 * Einzelner Button als group-Field — z. B. für einen Hero-CTA.
 */
export const buttonField = (
    name: string,
    label: { de: string; en: string } = { de: 'Button', en: 'Button' },
): Field => ({
    name,
    type: 'group',
    label,
    fields: buttonCoreFields(),
})

/**
 * Button-Array — z. B. für bis zu 2 CTAs in einem Block.
 */
export const buttonArrayField = (
    name: string,
    label: { de: string; en: string } = { de: 'Buttons', en: 'Buttons' },
    maxRows = 2,
): Field => ({
    name,
    type: 'array',
    label,
    labels: {
        singular: { de: 'Button', en: 'Button' },
        plural: { de: 'Buttons', en: 'Buttons' },
    },
    maxRows,
    fields: buttonCoreFields(),
})
