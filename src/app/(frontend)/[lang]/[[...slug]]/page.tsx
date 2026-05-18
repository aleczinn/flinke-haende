import { notFound } from 'next/navigation'
import { getPayload, Where } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import type { Page as PageDoc } from '@/payload-types'
import {
    availableLanguages,
    DEFAULT_LOCALE,
    getLocaleFromLang,
    Locale,
    locales,
    toLocaleTag,
    getOgLocale,
    getAlternateOgLocales,
    getDefaultForLanguage,
} from '@/lib/locale'
import { BASE_URL } from '@/lib/site'

const HOME_SLUG = 'home'

// ISR: Seiten werden alle 60s frisch geholt, sonst aus dem statischen Build
export const revalidate = 60

interface PageProps {
    params: Promise<{ lang: string; slug?: string[] }>
}

// ---------- Data Fetching ----------

async function fetchPage(locale: Locale, slug: string[]): Promise<PageDoc | null> {
    const payload = await getPayload({ config })
    const isHome = slug.length === 0

    const where: Where = isHome
        ? { slug: { equals: HOME_SLUG } }
        : {
              and: [
                  { 'breadcrumbs.url': { equals: `/${slug.join('/')}` } },
                  { slug: { equals: slug[slug.length - 1] } },
              ],
          }

    const { docs } = await payload.find({
        collection: 'pages',
        locale: toLocaleTag(locale),
        limit: 1,
        depth: 2,
        where,
    })

    return (docs[0] as PageDoc) ?? null
}

// ---------- SSG: Pfade für alle Sprachen vorrendern ----------

export async function generateStaticParams() {
    const payload = await getPayload({ config })
    const params: { lang: string; slug: string[] }[] = []

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
            const fullUrl = lastCrumb?.url ?? `/${doc.slug}`
            const segments = fullUrl.split('/').filter(Boolean)

            params.push({ lang, slug: segments })
        }
    }
    return params
}

// ---------- Metadata ----------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang, slug } = await params
    const locale = getLocaleFromLang(lang) ?? DEFAULT_LOCALE
    const page = await fetchPage(locale, slug ?? [])

    if (!page) {
        return { title: '404', robots: { index: false, follow: false } }
    }

    // Aktuellen Pfad in jeder Sprache für hreflang berechnen
    // Wir laden das Doc mit locale: 'all' nochmal, um alle Übersetzungen zu bekommen
    const payload = await getPayload({ config })
    const allLocales = await payload.findByID({
        collection: 'pages',
        id: page.id,
        locale: 'all',
        depth: 0,
    })
    const allBreadcrumbs = allLocales.breadcrumbs as Record<string, any[]> | any[]

    const buildHref = (l: Locale) => {
        if (page.slug === HOME_SLUG) return `${BASE_URL}/${l.language}`
        // Bei locale:'all' sind localized fields als Object pro Sprache zurück
        const crumbs = Array.isArray(allBreadcrumbs) ? allBreadcrumbs : (allBreadcrumbs?.[l.language] ?? [])
        const url = crumbs[crumbs.length - 1]?.url ?? `/${page.slug}`
        return `${BASE_URL}/${l.language}${url}`
    }

    const canonical = buildHref(locale)
    const languages: Record<string, string> = {
        'x-default': buildHref(DEFAULT_LOCALE),
        ...Object.fromEntries(locales.map((l) => [toLocaleTag(l), buildHref(l)])),
    }

    return {
        title: page.title,
        // title: page.seo?.title || page.title,
        // description: page.seo?.description ?? undefined,
        // alternates: { canonical, languages },
        // robots: page.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
        openGraph: {
            locale: getOgLocale(locale),
            alternateLocale: getAlternateOgLocales(locale),
            // title: page.seo?.title || page.title,
            // description: page.seo?.description ?? undefined,
            url: canonical,
            type: 'website',
        },
    }
}

// ---------- Page ----------

export default async function Page({ params }: PageProps) {
    const { lang, slug } = await params
    const locale = getLocaleFromLang(lang)
    if (!locale) {
        return notFound()
    }

    const segments = slug ?? []
    const page = await fetchPage(locale, segments)
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
