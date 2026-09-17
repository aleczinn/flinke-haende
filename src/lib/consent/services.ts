import type { ConsentService } from './types'

export const consentServices: ConsentService[] = [
    {
        id: 'youtube',
        category: 'externalMedia',
        provider: 'Google Ireland Limited',
        privacyUrl: 'https://policies.google.com/privacy',
        enabled: true,
    },
    {
        id: 'vimeo',
        category: 'externalMedia',
        provider: 'Vimeo.com, Inc.',
        privacyUrl: 'https://vimeo.com/privacy',
        enabled: true,
    },
    {
        id: 'googleMaps',
        category: 'externalMedia',
        provider: 'Google Ireland Limited',
        privacyUrl: 'https://policies.google.com/privacy',
        enabled: false,
    },
    {
        id: 'googleReviews',
        category: 'externalMedia',
        provider: 'Google Ireland Limited',
        privacyUrl: 'https://policies.google.com/privacy',
        enabled: false,
    },
    {
        id: 'googleAnalytics',
        category: 'statistics',
        provider: 'Google Ireland Limited',
        privacyUrl: 'https://policies.google.com/privacy',
        enabled: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
    },
]

export const hasGloballyPromptedServices = consentServices.some(
    (service) => service.enabled && service.category === 'statistics',
)

export const statisticsEnabled = consentServices.some(
    (service) => service.enabled && service.category === 'statistics',
)
