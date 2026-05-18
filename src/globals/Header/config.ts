import type { GlobalConfig } from 'payload'
import { descriptionField, navigationLinkField } from '@/fields/navigation-link'

export const Header: GlobalConfig = {
    slug: 'header',
    label: {
        de: 'Header',
        en: 'Header',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'navigation',
            type: 'array',
            label: { de: 'Hauptnavigation', en: 'Main navigation' },
            labels: {
                singular: { de: 'Menüpunkt', en: 'Menu item' },
                plural: { de: 'Menüpunkte', en: 'Menu items' },
            },
            maxRows: 8,
            fields: [
                ...navigationLinkField(),
                descriptionField,
                {
                    name: 'children',
                    type: 'array',
                    label: { de: 'Untermenü', en: 'Submenu' },
                    labels: {
                        singular: { de: 'Untermenüpunkt', en: 'Submenu item' },
                        plural: { de: 'Untermenüpunkte', en: 'Submenu items' },
                    },
                    maxRows: 12,
                    fields: navigationLinkField(),
                },
            ],
        },
    ],
}