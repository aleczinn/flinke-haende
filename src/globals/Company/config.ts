import type { GlobalConfig } from 'payload'

export const Company: GlobalConfig = {
    slug: 'company',
    label: {
        de: 'Unternehmen',
        en: 'Company',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Stammdaten', en: 'General' },
                    fields: [
                        {
                            name: 'companyName',
                            type: 'text',
                            required: true,
                            label: { de: 'Unternehmensname', en: 'Company name' },
                        },
                        {
                            name: 'companyNameShorthand',
                            type: 'text',
                            label: { de: 'Unternehmenskürzel', en: 'Company name shorthand' },
                            admin: {
                                description: {
                                    de: 'Der Unternehmensname ohne Rechtsform für den Seitentitel',
                                    en: 'The company name (without legal form) for the page title',
                                },
                            },
                        },
                        {
                            name: 'owner',
                            type: 'text',
                            required: true,
                            label: { de: 'Geschäftsführer', en: 'Owner' },
                            admin: {
                                description: { de: 'Für das Impressum', en: 'For the legal notice' },
                            },
                        },
                        {
                            name: 'siteDescription',
                            type: 'textarea',
                            required: true,
                            localized: true,
                            label: { de: 'Seitenbeschreibung', en: 'Site description' },
                            admin: {
                                description: {
                                    de: 'SEO-Fallback, wenn eine Seite keine eigene Beschreibung hat.',
                                    en: 'SEO fallback when a page has no own description.',
                                },
                            },
                        },
                        {
                            name: 'defaultOgImage',
                            type: 'upload',
                            required: true,
                            relationTo: 'media',
                            label: {
                                de: 'Standard OG-Bild',
                                en: 'Default OG image',
                            },
                            admin: {
                                description: {
                                    de: 'Wird verwendet, wenn eine Seite kein eigenes SEO-Bild hat. (Optimal: 1200x630px)',
                                    en: 'Used when a page has no own SEO image. (Optimal: 1200x630px)',
                                },
                            },
                        },
                    ],
                },
                {
                    label: { de: 'Kontakt', en: 'Contact' },
                    fields: [
                        {
                            name: 'telephone',
                            type: 'text',
                            required: true,
                            label: { de: 'Telefon', en: 'Phone' },
                        },
                        {
                            name: 'email',
                            type: 'email',
                            required: true,
                            label: { de: 'E-Mail', en: 'Email' },
                        },
                    ],
                },
                {
                    label: { de: 'Adresse', en: 'Address' },
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'street',
                                    type: 'text',
                                    required: true,
                                    label: { de: 'Straße', en: 'Street' },
                                    admin: { width: '70%' },
                                },
                                {
                                    name: 'houseNumber',
                                    type: 'text',
                                    required: true,
                                    label: { de: 'Hausnr.', en: 'No.' },
                                    admin: { width: '30%' },
                                },
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'postalCode',
                                    type: 'text',
                                    required: true,
                                    label: { de: 'PLZ', en: 'Postal code' },
                                    admin: { width: '30%' },
                                },
                                {
                                    name: 'city',
                                    type: 'text',
                                    required: true,
                                    label: { de: 'Ort', en: 'City' },
                                    admin: { width: '70%' },
                                },
                            ],
                        },
                        {
                            name: 'country',
                            type: 'text',
                            defaultValue: 'DE',
                            label: { de: 'Land (ISO)', en: 'Country (ISO)' },
                            admin: {
                                description: {
                                    de: 'ISO-Code, z. B. DE — für Schema.org',
                                    en: 'ISO code, e.g. DE — for Schema.org',
                                },
                            },
                        },
                    ],
                },
                {
                    label: { de: 'Öffnungszeiten', en: 'Opening hours' },
                    fields: [
                        {
                            name: 'openingHours',
                            type: 'array',
                            label: { de: 'Öffnungszeiten', en: 'Opening hours' },
                            labels: {
                                singular: { de: 'Zeitraum', en: 'Time range' },
                                plural: { de: 'Zeiträume', en: 'Time ranges' },
                            },
                            fields: [
                                {
                                    name: 'days',
                                    type: 'select',
                                    hasMany: true,
                                    required: true,
                                    label: { de: 'Tage', en: 'Days' },
                                    options: [
                                        { label: { de: 'Montag', en: 'Monday' }, value: 'Mo' },
                                        { label: { de: 'Dienstag', en: 'Tuesday' }, value: 'Di' },
                                        { label: { de: 'Mittwoch', en: 'Wednesday' }, value: 'Mi' },
                                        { label: { de: 'Donnerstag', en: 'Thursday' }, value: 'Do' },
                                        { label: { de: 'Freitag', en: 'Friday' }, value: 'Fr' },
                                        { label: { de: 'Samstag', en: 'Saturday' }, value: 'Sa' },
                                        { label: { de: 'Sonntag', en: 'Sunday' }, value: 'So' },
                                    ],
                                },
                                {
                                    name: 'closed',
                                    type: 'checkbox',
                                    defaultValue: false,
                                    label: { de: 'Geschlossen', en: 'Closed' },
                                },
                                {
                                    type: 'row',
                                    fields: [
                                        {
                                            name: 'open',
                                            type: 'text',
                                            label: { de: 'Von', en: 'From' },
                                            admin: {
                                                width: '50%',
                                                placeholder: '08:00',
                                                condition: (_, sib) => !sib?.closed,
                                            },
                                        },
                                        {
                                            name: 'close',
                                            type: 'text',
                                            label: { de: 'Bis', en: 'To' },
                                            admin: {
                                                width: '50%',
                                                placeholder: '17:00',
                                                condition: (_, sib) => !sib?.closed,
                                            },
                                        },
                                    ],
                                },
                                {
                                    name: 'note',
                                    type: 'text',
                                    localized: true,
                                    label: { de: 'Hinweis', en: 'Note' },
                                    admin: {
                                        description: {
                                            de: 'Optional, z. B. „Nach Vereinbarung". Ersetzt die Zeiten in der Anzeige.',
                                            en: 'Optional, e.g. "By appointment". Replaces the times in display.',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}
