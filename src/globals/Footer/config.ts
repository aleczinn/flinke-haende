import type { GlobalConfig } from 'payload'
import { navigationLinkField } from '@/fields/navigation-link'
import { revalidateFooter } from '@/hooks/revalidateGlobals'

export const Footer: GlobalConfig = {
    slug: 'footer',
    label: {
        de: 'Footer',
        en: 'Footer',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'navigation',
            type: 'array',
            label: { de: 'Footer-Navigation', en: 'Footer navigation' },
            labels: {
                singular: {
                    de: 'Link',
                    en: 'Link',
                },
                plural: {
                    de: 'Links',
                    en: 'Links',
                },
            },
            admin: {
                initCollapsed: true,
                description: {
                    de: 'Füge hier die Links hinzu, welche im Footer unter Navigation angezeigt werden sollen',
                    en: 'Add the links here that you want to display in the footer under "Navigation"',
                },
            },
            maxRows: 8,
            fields: navigationLinkField(),
        },
        {
            name: 'cta',
            type: 'relationship',
            relationTo: 'pages',
            label: {
                de: 'Primäre Aktionsseite',
                en: 'Primary action page',
            },
            admin: {
                description: {
                    de: 'Dies ist eine optionale Primäraktion, welche als Button im Footer-Banner dargestellt wird',
                    en: 'This is an optional primary action that appears as a button in the footer banner',
                },
            },
        },
        {
            name: 'legalNavigation',
            type: 'array',
            label: { de: 'Rechtliche Seiten', en: 'Legal pages' },
            labels: {
                singular: { de: 'Seite', en: 'Page' },
                plural: { de: 'Seiten', en: 'Pages' },
            },
            admin: {
                initCollapsed: true,
                description: {
                    de: 'Füge hier die rechtlichen Seiten wie Datenschutz oder Impressum hinzu',
                    en: 'Add the legal pages here, such as the Privacy Policy or Legal Notice',
                },
            },
            maxRows: 6,
            fields: [
                {
                    name: 'page',
                    type: 'relationship',
                    relationTo: 'pages',
                    required: true,
                    label: { de: 'Seite', en: 'Page' },
                },
            ],
        },
    ],
    hooks: {
        afterChange: [revalidateFooter],
    },
}
