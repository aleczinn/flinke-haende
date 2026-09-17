export type ConsentCategory = 'necessary' | 'externalMedia' | 'statistics'

export type OptionalConsentCategory = Exclude<ConsentCategory, 'necessary'>

export interface ConsentChoices {
    externalMedia: boolean
    statistics: boolean
}
export interface StoredConsent extends ConsentChoices {
    version: number
    decidedAt: string
}

export interface ConsentService {
    id: 'youtube' | 'vimeo' | 'googleMaps' | 'googleReviews' | 'googleAnalytics'
    category: OptionalConsentCategory
    provider: string
    privacyUrl: string
    enabled: boolean
}
