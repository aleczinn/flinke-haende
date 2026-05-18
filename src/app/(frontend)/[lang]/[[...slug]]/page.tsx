import { notFound } from 'next/navigation'
import { getPayload, Where } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import type { Page as PageDoc } from '@/payload-types'
import {
    availableLanguages,
    DEFAULT_LOCALE,
    getLocaleFromLang,
    toLocaleTag,
    getOgLocale,
    getAlternateOgLocales,
    getDefaultForLanguage,
    PayloadLocale,
    Localized,
} from '@/lib/locale'
import { BASE_URL } from '@/lib/site'
import { getCompanyConfig } from '@/lib/queries'
import { cache } from 'react'

const HOME_SLUG = 'home'

interface PageProps {
    params: Promise<{ lang: string; slug?: string[] }>
}

const fetchPage = cache(async (localeTag: PayloadLocale, slugPath: string): Promise<PageDoc | null> => {
    const payload = await getPayload({ config })
    const isHome = slugPath === ''

    const where: Where = isHome
        ? { slug: { equals: HOME_SLUG } }
        : {
              and: [
                  { 'breadcrumbs.url': { equals: `/${slugPath}` } },
                  { slug: { equals: slugPath.split('/').pop()! } },
              ],
          }

    const { docs } = await payload.find({
        collection: 'pages',
        locale: localeTag,
        limit: 1,
        depth: 2,
        where,
    })

    return (docs[0] as PageDoc) ?? null
})

const fetchAllLocales = cache(async (id: string | number) => {
    const payload = await getPayload({ config })
    return payload.findByID({ collection: 'pages', id, locale: 'all', depth: 0 })
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang, slug } = await params
    const locale = getLocaleFromLang(lang) ?? DEFAULT_LOCALE
    const slugPath = (slug ?? []).join('/')

    const page = await fetchPage(toLocaleTag(locale), slugPath)
    if (!page) {
        return { title: '404', robots: { index: false, follow: false } }
    }

    const company = await getCompanyConfig(locale)

    const isHome = page.slug === HOME_SLUG
    const allLocales = isHome ? null : await fetchAllLocales(page.id)
    const allBreadcrumbs = (allLocales?.breadcrumbs ?? {}) as unknown as Localized<{ url?: string | null }[]>
    const allSlugs = (allLocales?.slug ?? {}) as unknown as Localized<string>

    const buildHref = (lang: string): string => {
        const localeForLang = getDefaultForLanguage(lang)
        if (!localeForLang) return `${BASE_URL}/${lang}`
        if (page.slug === HOME_SLUG) return `${BASE_URL}/${lang}`

        const tag = toLocaleTag(localeForLang)
        const crumbs = allBreadcrumbs?.[tag] ?? []
        const fallbackSlug = allSlugs?.[tag] ?? page.slug
        const url = crumbs[crumbs.length - 1]?.url ?? `/${fallbackSlug}`
        return `${BASE_URL}/${lang}${url}`
    }

    const defaultCanonical = buildHref(locale.language)
    const languages: Record<string, string> = {
        'x-default': buildHref(DEFAULT_LOCALE.language),
        ...Object.fromEntries(availableLanguages.map((lang) => [lang, buildHref(lang)])),
    }

    const resolvedTitle = page.meta?.title || page.title;
    const companyName = company.company_name.replace('GmbH', '').trim()
    const title = `${resolvedTitle} | ${companyName}`
    const description = page.meta?.description || company.site_description;

    const metaImage = typeof page.meta?.image === 'object' ? page.meta.image : null
    const ogImageUrl =
        metaImage?.sizes?.og?.url ||
        company.defaultOgImage?.sizes?.og?.url ||
        metaImage?.url ||
        `${BASE_URL}/og-default.jpg`

    const canonical = page.meta?.canonical?.trim() || defaultCanonical

    return {
        title: title,
        description: description,
        alternates: { canonical, languages },
        robots: page.meta?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
        openGraph: {
            locale: getOgLocale(locale),
            alternateLocale: getAlternateOgLocales(locale),
            title: resolvedTitle,
            description: description,
            siteName: companyName,
            url: canonical,
            type: 'website',
            images: [{ url: ogImageUrl, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: resolvedTitle,
            description: description,
            images: [ogImageUrl],
        },
    }
}

export async function generateStaticParams() {
    const params: { lang: string; slug: string[] }[] = []
    const payload = await getPayload({ config })

    for (const lang of availableLanguages) {
        const locale = getDefaultForLanguage(lang)
        if (!locale) continue

        const { docs } = await payload.find({
            collection: 'pages',
            locale: toLocaleTag(locale),
            limit: 1000,
            depth: 0,
            pagination: false,
        })

        for (const doc of docs) {
            if (doc.slug === HOME_SLUG) {
                params.push({ lang, slug: [] })
                continue
            }
            const lastCrumb = doc.breadcrumbs?.[doc.breadcrumbs.length - 1]
            const segments = (lastCrumb?.url ?? `/${doc.slug}`).split('/').filter(Boolean)
            params.push({ lang, slug: segments })
        }
    }
    return params
}


export default async function Page({ params }: PageProps) {
    const { lang, slug } = await params
    const locale = getLocaleFromLang(lang)
    if (!locale) {
        return notFound()
    }

    const slugPath = (slug ?? []).join('/')
    const page = await fetchPage(toLocaleTag(locale), slugPath)
    if (!page) {
        return notFound()
    }

    const isHome = page.slug === HOME_SLUG

    return (
        <main id="main" className="grow flex flex-col bg-gray-10 min-h-[50svh]">
            {/*{!isHome && <Breadcrumbs locale={locale} page={page} includeSchema />}*/}
            <p>render page</p>
        </main>
    )
}
