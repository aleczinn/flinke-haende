import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Locale, toLocaleTag } from '@/lib/locale'
import { Company } from '@/payload-types'

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
    address: {
        street: string
        house_number: string
        city: string
        postal_code: string
        country_iso: string
    }
    geo?: Company['geo']
    opening_hours: OpeningHoursItem[]
    social: Company['social']
}

export interface NavigationLink {
    id: string
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
        address: {
            street: c.address.street,
            house_number: c.address.houseNumber,
            postal_code: c.address.postalCode,
            city: c.address.city,
            country_iso: c.address.country ?? 'DE',
        },
        geo: {
            latitude: c.geo?.latitude,
            longitude: c.geo?.longitude,
        },
        opening_hours: (c.openingHours ?? []).map((o) => ({
            id: o.id ?? undefined,
            days: o.days ?? [],
            closed: !!o.closed,
            open: o.open ?? undefined,
            close: o.close ?? undefined,
            note: o.note ?? undefined,
        })),
        social: c.social,
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
    if (!item?.id) {
        return null
    }

    const lang = locale.language
    const description = item?.description || undefined

    if (item.type === 'external') {
        if (!item.url) return null
        return {
            id: item.id,
            href: item.url,
            label: item.label || item.url,
            newTab: !!item.newTab,
            description,
        }
    }

    const page = item?.page
    if (!page || typeof page !== 'object') return null

    const crumbs = page.breadcrumbs ?? []
    const path = crumbs[crumbs.length - 1]?.url ?? `/${page.slug}`
    const href = page.slug === HOME_SLUG ? `/${lang}` : `/${lang}${path}`

    return { id: item.id, href, label: item.label || page.title, newTab: false, description }
}