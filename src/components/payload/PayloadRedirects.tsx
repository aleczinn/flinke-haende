import React from 'react'
import type { Page } from '@/payload-types'
import { DEFAULT_LOCALE, getLocaleFromLang, toLocaleTag } from '@/lib/locale'
import { notFound, redirect } from 'next/navigation'
import { getCachedRedirects } from '@/lib/queries'

interface Props {
    disableNotFound?: boolean
    url: string // kompletter Pfad inkl. Lang: /de/alte-seite
    lang: string
}

export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url, lang }) => {
    const locale = toLocaleTag(getLocaleFromLang(lang) ?? DEFAULT_LOCALE)
    const redirects = await getCachedRedirects(locale)()

    const pathWithoutLang = url.replace(/^\/[a-z]{2}(\/|$)/, '/')
    const redirectItem = redirects.find((r) => r.from === pathWithoutLang)

    if (redirectItem) {
        // Externe URL oder manuell eingetragener Pfad
        if (redirectItem.to?.url) {
            redirect(redirectItem.to.url)
        }

        // Referenz auf eine Page
        const ref = redirectItem.to?.reference
        if (ref) {
            const page = typeof ref.value === 'object' ? (ref.value as Page) : null

            const crumbs = page?.breadcrumbs ?? []
            const path = crumbs[crumbs.length - 1]?.url ?? `/${page?.slug ?? ''}`
            const redirectUrl = `/${lang}${path}`

            if (redirectUrl) {
                redirect(redirectUrl)
            }
        }
    }

    if (disableNotFound) {
        return null
    }

    return notFound()
}
