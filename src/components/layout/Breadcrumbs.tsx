import Link from 'next/link';
import { BASE_URL } from '@/lib/site';
import { t } from '@/lib/i18n';
import Section from '@/components/layout/Section';
import type { Page as PageDoc } from '@/payload-types'
import { Locale } from '@/lib/locale'

interface BreadcrumbsProps {
    locale: Locale
    page: PageDoc
    includeSchema?: boolean // LD+JSON Schema nur einmal im DOM rendern
}

export default async function Breadcrumbs({ locale, page, includeSchema = false }: BreadcrumbsProps) {
    const lang = locale.language
    const crumbs = page.breadcrumbs ?? []

    if (crumbs.length === 0) {
        return null
    }

    // Home steht nicht in den nested-docs-Breadcrumbs (separate Top-Level-Seite),
    // daher manuell voranstellen. Letzter Eintrag = aktuelle Seite.
    const trail = [
        { href: `/${lang}`, label: t(locale, 'home') },
        ...crumbs.map((c) => ({
            href: `/${lang}${c.url ?? ''}`,
            label: c.label ?? '',
        })),
    ].filter((item) => item.label !== '')

    const lastIndex = trail.length - 1

    const jsonLd = includeSchema
        ? JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: trail.map((item, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  name: item.label,
                  item: `${BASE_URL}${item.href}`,
              })),
          }).replace(/</g, '\\u003c')
        : null

    return (
        <>
            {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}

            <Section
                as="nav"
                variant="capped"
                innerClassName="h-16 flex flex-row items-center bg-gray-10"
                aria-label={t(locale, 'header.breadcrumbs')}
            >
                <ol className="flex flex-wrap items-center gap-2">
                    {trail.map((item, i) => {
                        const isLast = i === lastIndex

                        return (
                            <li key={item.href} className="flex items-center gap-2">
                                {i > 0 && (
                                    <span className="text-sm text-gray-80" aria-hidden="true">
                                        /
                                    </span>
                                )}

                                {isLast ? (
                                    <span className="text-sm font-bold text-gray-90" aria-current="page">
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="text-sm text-gray-90 hover:underline focus-element"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        )
                    })}
                </ol>
            </Section>
        </>
    )
}