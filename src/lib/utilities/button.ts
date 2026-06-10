import { Page } from '@/payload-types'
import { Locale } from '@/lib/locale'
import { HOME_SLUG } from '@/lib/queries'
import { ButtonItem } from '@/fields/button'

export function resolveButtonHref(btn: ButtonItem, locale: Locale): string | null {
    if (btn.type === 'external') {
        return btn.url ?? null
    }

    const page = typeof btn.reference === 'object' && btn.reference !== null ? (btn.reference as Page) : null
    if (!page) return null

    const crumbs = page.breadcrumbs ?? []
    const path = crumbs[crumbs.length - 1]?.url ?? `/${page.slug}`
    return page.slug === HOME_SLUG ? `/${locale.language}` : `/${locale.language}${path}`
}
