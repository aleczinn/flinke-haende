import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BASE_URL } from '@/lib/site'
import {
  availableLanguages,
  DEFAULT_LOCALE,
  getDefaultForLanguage,
  toLocaleTag,
} from '@/lib/locale'

const HOME_SLUG = 'home'
const EXCLUDED_SLUGS = new Set(['impressum', 'datenschutz'])

// Stündlich neu generieren, sonst werden neue Pages bis zum nächsten Build nicht sichtbar
export const revalidate = 3600

type Localized<T> = Record<string, T>

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pages',
    locale: 'all',
    limit: 1000,
    depth: 0,
    pagination: false,
  })

  const entries: MetadataRoute.Sitemap = []

  for (const doc of docs) {
    // Bei locale: 'all' sind localized fields Objekte mit Locale-Tag als Key
    const slugByLocale = doc.slug as unknown as Localized<string>
    const breadcrumbsByLocale = doc.breadcrumbs as unknown as Localized<{ url: string }[]>

    // Default-Locale-Slug als kanonischer Identifier
    const defaultSlug = slugByLocale[toLocaleTag(DEFAULT_LOCALE)]
    if (!defaultSlug) continue
    if (EXCLUDED_SLUGS.has(defaultSlug)) continue
    // if (doc.seo?.noIndex) continue // TODO : Re-ADD wenn seo felder vorhanden

    const isHome = defaultSlug === HOME_SLUG

    const pathFor = (lang: string): string => {
      if (isHome) return ''
      const locale = getDefaultForLanguage(lang)
      if (!locale) return ''
      const tag = toLocaleTag(locale)
      const crumbs = breadcrumbsByLocale?.[tag] ?? []
      return crumbs[crumbs.length - 1]?.url ?? `/${slugByLocale[tag] ?? defaultSlug}`
    }

    const urlFor = (lang: string) => `${BASE_URL}/${lang}${pathFor(lang)}`.replace(/\/+$/, '')

    const languages: Record<string, string> = {
      'x-default': urlFor(DEFAULT_LOCALE.language),
      ...Object.fromEntries(availableLanguages.map((lang) => [lang, urlFor(lang)])),
    }

    for (const lang of availableLanguages) {
      entries.push({
        url: urlFor(lang),
        changeFrequency: 'weekly',
        priority: isHome ? 1 : 0.8,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
        alternates: { languages },
      })
    }
  }

  return entries
}
