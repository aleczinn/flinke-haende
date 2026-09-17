'use client'

export type AnalyticsEvent = 'phone_click' | 'email_click' | 'directions_click' | 'primary_cta_click'

declare global {
    interface Window {
        dataLayer?: unknown[]
        gtag?: (...args: unknown[]) => void
    }
}
export function trackEvent(name: AnalyticsEvent, parameters: Record<string, string | number | boolean> = {}) {
    window.gtag?.('event', name, parameters)
}
