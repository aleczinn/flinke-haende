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

export const getCompanyConfig = cache(async (locale: Locale): Promise<CompanyConfig> => {
    const payload = await getPayload({ config })
    const c = await payload.findGlobal({
        slug: 'company',
        locale: toLocaleTag(locale),
        depth: 0,
    })

    return {
        company_name: c.companyName,
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

export const getHeaderConfig = cache(async (locale: Locale): Promise<any> => {
    const payload = await getPayload({ config })
    const h = await payload.findGlobal({
        slug: 'header',
        locale: toLocaleTag(locale),
        depth: 2,
    })

    return {}
})

export const getFooterConfig = cache(async (locale: Locale): Promise<any> => {
    const payload = await getPayload({ config })
    const h = await payload.findGlobal({
        slug: 'footer',
        locale: toLocaleTag(locale),
        depth: 2,
    })

    return {}
})