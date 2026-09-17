'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useConsent } from '@/components/consent/ConsentProvider'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function eventForLink(anchor: HTMLAnchorElement): AnalyticsEvent | null {
    const explicit = anchor.dataset.analyticsEvent as AnalyticsEvent | undefined
    if (explicit) return explicit
    if (anchor.href.startsWith('tel:')) return 'phone_click'
    if (anchor.href.startsWith('mailto:')) return 'email_click'
    if (/google\.[^/]+\/maps|maps\.app\.goo\.gl/.test(anchor.href)) return 'directions_click'
    return null
}

export function GoogleAnalytics() {
    const { allows } = useConsent()
    const pathname = usePathname()
    const enabled = Boolean(measurementId) && allows('statistics')

    useEffect(() => {
        if (!enabled) return
        const url = `${pathname}${window.location.search}`
        window.gtag?.('event', 'page_view', { page_path: url })
    }, [enabled, pathname])

    useEffect(() => {
        if (!enabled) return
        const handleClick = (event: MouseEvent) => {
            const target = event.target
            if (!(target instanceof Element)) return
            const anchor = target.closest('a')
            if (!(anchor instanceof HTMLAnchorElement)) return
            const name = eventForLink(anchor)
            if (name) trackEvent(name, { link_url: anchor.href })
        }
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [enabled])

    if (!enabled || !measurementId) return null

    return (
        <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false});`}
            </Script>
        </>
    )
}
