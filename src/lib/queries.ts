import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Locale, toLocaleTag } from '@/lib/locale'

export interface OpeningHoursItem {
    id?: string
    days: string[]
    closed: boolean
    open?: string
    close?: string
    note?: string
}

export interface CompanyConfig {
    company_name: string
    company_name_shorthand: string
    owner: string
    site_description: string
    defaultOgImage: any
    telephone: string
    email: string
    address_street_house_number: string
    address_plz_town: string
    address_country: string
    opening_hours: OpeningHoursItem[]
}

export interface NavigationLink {
    href: string
    label: string
    newTab: boolean
    description?: string
}

export interface NavigationItem extends NavigationLink {
    children: NavigationLink[]
}

export interface HeaderConfig {
    navigation: NavigationItem[]
}

export interface FooterConfig {
    navigation: NavigationLink[]
}

export const getCompanyConfig = cache(async (locale: Locale): Promise<CompanyConfig> => {
    const payload = await getPayload({ config })
    const c = await payload.findGlobal({
        slug: 'company',
        locale: toLocaleTag(locale),
        depth: 1,
    })

    return {
        company_name: c.companyName,
        company_name_shorthand: c.companyNameShorthand || c.companyName,
        owner: c.owner,
        site_description: c.siteDescription,
        defaultOgImage: c.defaultOgImage,
        telephone: c.telephone,
        email: c.email,
        address_street_house_number: `${c.street} ${c.houseNumber}`,
        address_plz_town: `${c.postalCode} ${c.city}`,
        address_country: c.country ?? 'DE',
        opening_hours: (c.openingHours ?? []).map((o) => ({
            id: o.id ?? undefined,
            days: o.days ?? [],
            closed: !!o.closed,
            open: o.open ?? undefined,
            close: o.close ?? undefined,
            note: o.note ?? undefined,
        })),
    }
})

export const HOME_SLUG = 'home'

export const getHeaderConfig = cache(async (locale: Locale): Promise<HeaderConfig> => {
    const payload = await getPayload({ config })
    const header = await payload.findGlobal({
        slug: 'header',
        locale: toLocaleTag(locale),
        depth: 1,
    })

    return {
        navigation: (header.navigation ?? [])
            .map((item: any) => {
                const link = resolveLink(item, locale)
                if (!link) return null
                const children = (item.children ?? [])
                    .map((c: any) => resolveLink(c, locale))
                    .filter(Boolean) as NavigationLink[]
                return { ...link, children }
            })
            .filter(Boolean) as NavigationItem[],
    }
})

export const getFooterConfig = cache(async (locale: Locale): Promise<FooterConfig> => {
    const payload = await getPayload({ config })
    const footer = await payload.findGlobal({
        slug: 'footer',
        locale: toLocaleTag(locale),
        depth: 1,
    })

    return {
        navigation: (footer.navigation ?? [])
            .map((item: any) => resolveLink(item, locale))
            .filter(Boolean) as NavigationLink[],
    }
})

function resolveLink(item: any, locale: Locale): NavigationLink | null {
    const lang = locale.language
    const description = item?.description || undefined

    if (item?.type === 'external') {
        if (!item.url) return null
        return { href: item.url, label: item.label || item.url, newTab: !!item.newTab }
    }

    const page = item?.page
    if (!page || typeof page !== 'object') return null

    const crumbs = page.breadcrumbs ?? []
    const path = crumbs[crumbs.length - 1]?.url ?? `/${page.slug}`
    const href = page.slug === HOME_SLUG ? `/${lang}` : `/${lang}${path}`

    return { href, label: item.label || page.title, newTab: false, description }
}