import type { Field, GlobalConfig } from 'payload'
import { urlField } from '@/fields/url-field'

const generalFields = (): Field[] => [
    {
        name: 'companyName',
        type: 'text',
        required: true,
        label: {
            de: 'Unternehmensname',
            en: 'Company name',
        },
    },
    {
        name: 'companyNameShorthand',
        type: 'text',
        label: {
            de: 'Unternehmenskürzel',
            en: 'Company name shorthand',
        },
        admin: {
            description: {
                de: 'Der Unternehmensname ohne Rechtsform für den Seitentitel',
                en: 'The company name (without legal form) for the page title',
            },
        },
    },
    {
        name: 'siteDescription',
        type: 'textarea',
        required: true,
        localized: true,
        label: {
            de: 'Seitenbeschreibung',
            en: 'Site description',
        },
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
                de: 'SEO-Fallback: Wird verwendet, wenn eine Seite kein eigenes OG-Bild hat. (Optimal: 1200x630px)',
                en: 'SEO fallback when a page has no own og image. (Optimal: 1200x630px)',
            },
        },
    },
    {
        name: 'owner',
        type: 'text',
        required: true,
        label: {
            de: 'Geschäftsführer',
            en: 'Owner',
        },
        admin: {
            description: {
                de: 'z. B. für das Impressum',
                en: 'e.g., for the legal notice',
            },
        },
    },
]

const contactFields = (): Field[] => [
    {
        name: 'telephone',
        type: 'text',
        required: true,
        label: {
            de: 'Telefon',
            en: 'Phone',
        },
    },
    {
        name: 'email',
        type: 'email',
        required: true,
        label: {
            de: 'E-Mail',
            en: 'Email',
        },
    },
]

const addressFields = (): Field[] => [
    {
        name: 'address',
        type: 'group',
        label: { de: 'Adresse', en: 'Address' },
        admin: {
            description: {
                de: 'Die Adresse, welche als Firmensitz eingetragen ist.',
                en: 'The address listed as the company\'s registered office.',
            },
        },
        fields: [
            {
                type: 'row',
                fields: [
                    {
                        name: 'street',
                        type: 'text',
                        required: true,
                        label: {
                            de: 'Straße',
                            en: 'Street',
                        },
                        admin: {
                            width: '70%',
                        },
                    },
                    {
                        name: 'houseNumber',
                        type: 'text',
                        required: true,
                        label: {
                            de: 'Hausnr.',
                            en: 'No.',
                        },
                        admin: {
                            width: '30%',
                        },
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
                        label: {
                            de: 'PLZ',
                            en: 'Postal code',
                        },
                        admin: {
                            width: '30%',
                        },
                    },
                    {
                        name: 'city',
                        type: 'text',
                        required: true,
                        label: {
                            de: 'Ort',
                            en: 'City',
                        },
                        admin: {
                            width: '70%',
                        },
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
        name: 'geo',
        type: 'group',
        label: { de: 'Koordinaten (optional)', en: 'Coordinates (optional)' },
        admin: {
            description: {
                de: 'Optional. In Google Maps per Rechtsklick „Was ist hier?" ablesbar.',
                en: 'Optional. Right-click in Google Maps → "What\'s here?".',
            },
        },
        fields: [
            {
                type: 'row',
                fields: [
                    {
                        name: 'latitude',
                        type: 'number',
                        label: { de: 'Breitengrad', en: 'Latitude' },
                        admin: { width: '50%', step: 0.000001 },
                    },
                    {
                        name: 'longitude',
                        type: 'number',
                        label: { de: 'Längengrad', en: 'Longitude' },
                        admin: { width: '50%', step: 0.000001 },
                    },
                ],
            },
        ],
    },
]

const openingHoursFields = (): Field[] => [
    {
        name: 'openingHours',
        type: 'array',
        label: {
            de: 'Öffnungszeiten',
            en: 'Opening hours',
        },
        labels: {
            singular: {
                de: 'Zeitraum',
                en: 'Time range',
            },
            plural: {
                de: 'Zeiträume',
                en: 'Time ranges',
            },
        },
        fields: [
            {
                name: 'days',
                type: 'select',
                hasMany: true,
                required: true,
                label: {
                    de: 'Tage',
                    en: 'Days',
                },
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
                label: {
                    de: 'Geschlossen',
                    en: 'Closed',
                },
            },
            {
                type: 'row',
                fields: [
                    {
                        name: 'open',
                        type: 'text',
                        label: {
                            de: 'Von',
                            en: 'From',
                        },
                        admin: {
                            width: '50%',
                            placeholder: '08:00',
                            condition: (_, sib) => !sib?.closed,
                        },
                    },
                    {
                        name: 'close',
                        type: 'text',
                        label: {
                            de: 'Bis',
                            en: 'To',
                        },
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
                label: {
                    de: 'Hinweis',
                    en: 'Note',
                },
                admin: {
                    description: {
                        de: 'Optional, z. B. „Nach Vereinbarung". Ersetzt die Zeiten in der Anzeige.',
                        en: 'Optional, e.g. "By appointment". Replaces the times in display.',
                    },
                },
            },
        ],
    },
]

const socialFields = (): Field[] => [
    {
        name: 'social',
        type: 'group',
        label: {
            de: 'Social-Media-Profile',
            en: 'Social media profiles',
        },
        admin: {
            description: {
                de: 'Vollständige Profil-URLs. Werden für Footer-Icons und Schema.org „sameAs" genutzt. Leere Felder werden ignoriert.',
                en: 'Full profile URLs. Used for footer icons and Schema.org "sameAs". Empty fields are ignored.',
            },
        },
        fields: [
            urlField(
                'google_business',
                {
                    de: 'Google Business Profil',
                    en: 'Google Business Profile',
                },
                'https://g.co/kgs/… OR https://maps.app.goo.gl/…',
            ),
            urlField('facebook', { de: 'Facebook', en: 'Facebook' }, 'https://www.facebook.com/…'),
            urlField('instagram', { de: 'Instagram', en: 'Instagram' }, 'https://www.instagram.com/…'),
            urlField('twitter', { de: 'X / Twitter', en: 'X / Twitter' }, 'https://x.com/…'),
            urlField('linkedin', { de: 'LinkedIn', en: 'LinkedIn' }, 'https://www.linkedin.com/company/…'),
            urlField('youtube', { de: 'YouTube', en: 'YouTube' }, 'https://www.youtube.com/@…'),
            urlField('xing', { de: 'Xing', en: 'Xing' }, 'https://www.xing.com/pages/…'),
            urlField('pinterest', { de: 'Pinterest', en: 'Pinterest' }, 'https://de.pinterest.com/…'),
            urlField('tiktok', { de: 'TikTok', en: 'TikTok' }, 'https://www.tiktok.com/…'),
        ],
    },
]

export const Company: GlobalConfig = {
    slug: 'company',
    label: { de: 'Unternehmen', en: 'Company' },
    access: { read: () => true },
    fields: [
        {
            type: 'tabs',
            tabs: [
                { label: { de: 'Stammdaten', en: 'General' }, fields: generalFields() },
                { label: { de: 'Kontakt', en: 'Contact' }, fields: contactFields() },
                { label: { de: 'Adresse', en: 'Address' }, fields: addressFields() },
                { label: { de: 'Öffnungszeiten', en: 'Opening hours' }, fields: openingHoursFields() },
                { label: { de: 'Social', en: 'Social' }, fields: socialFields() },
            ],
        },
    ],
}