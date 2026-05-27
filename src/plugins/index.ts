import { Plugin } from 'payload'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import type { Page } from '@/payload-types'
import { BASE_URL } from '@/lib/site'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'

const generateTitle: GenerateTitle<Page> = ({ doc }) => doc?.title ?? ''

const generateURL: GenerateURL<Page> = ({ doc, locale }) => {
    const lang = typeof locale === 'string' ? locale.split('-')[0] : 'de'
    const crumbs = doc?.breadcrumbs
    const path = crumbs?.[crumbs.length - 1]?.url ?? (doc?.slug ? `/${doc.slug}` : '')
    return `${BASE_URL}/${lang}${doc?.slug === 'home' ? '' : path}`
}

export const plugins: Plugin[] = [
    nestedDocsPlugin({
        collections: ['pages'],
        generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    seoPlugin({
        uploadsCollection: 'media',
        tabbedUI: false,
        generateTitle,
        generateURL,
    }),
    redirectsPlugin({
        collections: ['pages'],
        overrides: {
            labels: {
                singular: { de: 'Weiterleitung', en: 'Redirect' },
                plural: { de: 'Weiterleitungen', en: 'Redirects' },
            },

            // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
            fields: ({ defaultFields }) => {
                return defaultFields.map((field) => {
                    if (!('name' in field)) {
                        return field
                    }

                    if (field.name === 'from') {
                        return {
                            ...field,
                            localized: true,
                            label: { de: 'Von (Quell-URL)', en: 'From (Source URL)' },
                            admin: {
                                description: {
                                    de: 'Pfad ohne Sprachpräfix, z. B. /alte-seite',
                                    en: 'Path without language prefix, e.g. /old-page',
                                },
                            },
                        }
                    }

                    if (field.name === 'to') {
                        const groupField = field as typeof field & { fields?: any[] }
                        return {
                            ...field,
                            label: { de: 'Zu (Ziel)', en: 'To (Destination)' },
                            ...(groupField.fields && {
                                fields: groupField.fields.map((subField: any) => {
                                    if (!('name' in subField)) return subField

                                    if (subField.name === 'type') {
                                        return {
                                            ...subField,
                                            label: { de: 'Typ', en: 'Type' },
                                            options: subField.options?.map((option: any) => {
                                                const optionLabels: Record<string, { de: string; en: string }> = {
                                                    internalLink: { de: 'Interne Seite', en: 'Internal page' },
                                                    customUrl: { de: 'Externe URL', en: 'External URL' },
                                                }
                                                return optionLabels[option.value]
                                                    ? { ...option, label: optionLabels[option.value] }
                                                    : option
                                            }),
                                        }
                                    }

                                    const labels: Record<string, { de: string; en: string }> = {
                                        reference: { de: 'Interne Seite', en: 'Internal page' },
                                        url: { de: 'Externe URL', en: 'External URL' },
                                    }
                                    return labels[subField.name]
                                        ? { ...subField, label: labels[subField.name] }
                                        : subField
                                }),
                            }),
                        }
                    }

                    return field
                })
            },
            hooks: {
                afterChange: [revalidateRedirects],
            },
        },
    }),
]

