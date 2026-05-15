// src/app/(frontend)/llms.txt/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { BASE_URL } from '@/lib/site'
import { DEFAULT_LOCALE, toLocaleTag } from '@/lib/locale'

const HOME_SLUG = 'home'
const EXCLUDED_SLUGS = new Set(['impressum', 'datenschutz'])

export const revalidate = 3600

export async function GET() {
  const payload = await getPayload({ config })

  // Nur Default-Locale ausgeben -> llms.txt ist üblicherweise einsprachig
  const { docs } = await payload.find({
    collection: 'pages',
    locale: toLocaleTag(DEFAULT_LOCALE),
    limit: 1000,
    depth: 0,
    pagination: false,
  })

  // Home extrahieren, damit sie an erster Stelle steht
  const homeDoc = docs.find((d) => d.slug === HOME_SLUG)
  const homeTitle = (homeDoc?.title as string) ?? 'Startseite'
  const homeUrl = `${BASE_URL}/${DEFAULT_LOCALE.language}`

  // Restliche Pages filtern und hierarchisch sortieren
  const pages = docs
    .filter((doc) => {
      if (doc.slug === HOME_SLUG) return false
      if (EXCLUDED_SLUGS.has(doc.slug as string)) return false
      // if (doc.seo?.noIndex) return false // TODO : RE-ADD here when seo fields exist
      return true
    })
    .sort((a, b) => {
      const urlA = a.breadcrumbs?.[a.breadcrumbs.length - 1]?.url ?? ''
      const urlB = b.breadcrumbs?.[b.breadcrumbs.length - 1]?.url ?? ''
      return urlA.localeCompare(urlB)
    })

  // Markdown-Zeilen mit Einrückung pro Hierarchie-Ebene
  const pageLines = pages.map((doc) => {
    const lastCrumb = doc.breadcrumbs?.[doc.breadcrumbs.length - 1]
    const path = lastCrumb?.url ?? `/${doc.slug}`
    const url = `${BASE_URL}/${DEFAULT_LOCALE.language}${path}`
    const depth = Math.max(0, (doc.breadcrumbs?.length ?? 1) - 1)
    const indent = '  '.repeat(depth)
    return `${indent}- [${doc.title}](${url})`
  })

  // Site-Info – provisorisch aus env vars, später aus der Config-Global
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Mein Unternehmen'
  const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? ''

  const content = `# ${siteName}
${siteDescription ? `\n> ${siteDescription}\n` : ''}
## Seiten

- [${homeTitle}](${homeUrl})
${pageLines.join('\n')}

## Weitere Ressourcen

- [Sitemap](${BASE_URL}/sitemap.xml)
`

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
