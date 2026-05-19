import { Locale } from '@/lib/locale'
import { BASE_URL, SCHEMA_TYPE } from '@/lib/site'
import { getCompanyConfig } from '@/lib/queries'

interface LocalBusinessSchemaProps {
    locale: Locale
}

const DAY_MAP: Record<string, string> = {
    Mo: 'Monday',
    Di: 'Tuesday',
    Mi: 'Wednesday',
    Do: 'Thursday',
    Fr: 'Friday',
    Sa: 'Saturday',
    So: 'Sunday',
}

export default async function LocalBusinessSchema({ locale }: LocalBusinessSchemaProps) {
    const company = await getCompanyConfig(locale)

    const openingHoursSpecification = (company.opening_hours ?? [])
        .filter((o) => !o.closed && o.open && o.close && o.days?.length)
        .map((o) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: o.days.map((d) => DAY_MAP[d]).filter(Boolean),
            opens: o.open,
            closes: o.close,
        }))

    const imageUrlRaw = company.defaultOgImage?.sizes?.og?.url || company.defaultOgImage?.url
    const imageUrl = imageUrlRaw ? `${BASE_URL}${imageUrlRaw}` : undefined

    const sameAs = Object.values(company.social ?? {}).filter(
        (url): url is string => typeof url === 'string' && url.trim().length > 0,
    )

    const mapQuery =
        company.geo?.latitude != null && company.geo?.longitude != null
            ? `${company.geo.latitude},${company.geo.longitude}`
            : encodeURIComponent(
                  `${company.address.street} ${company.address.house_number}, ${company.address.postal_code} ${company.address.city}`,
              )
    const hasMap = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

    const jsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': SCHEMA_TYPE,
        '@id': `${BASE_URL}/#localbusiness`,

        name: company.company_name,
        description: company.site_description,
        url: `${BASE_URL}/${locale.language}`,

        telephone: company.telephone,
        email: company.email,

        founder: {
            '@type': 'Person',
            name: company.owner,
        },

        address: {
            '@type': 'PostalAddress',
            streetAddress: `${company.address.street} ${company.address.house_number}`,
            postalCode: company.address.postal_code,
            addressLocality: company.address.city,
            addressCountry: company.address.country_iso,
        },

        ...(company.geo?.latitude != null && company.geo?.longitude != null
            ? {
                  geo: {
                      '@type': 'GeoCoordinates',
                      latitude: company.geo.latitude,
                      longitude: company.geo.longitude,
                  },
              }
            : {}),
        hasMap: hasMap,

        ...(imageUrl
            ? {
                  image: imageUrl,
                  logo: imageUrl,
              }
            : {}),

        ...(openingHoursSpecification.length ? { openingHoursSpecification } : {}),

        ...(sameAs.length ? { sameAs } : {}),
    }

    const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c')

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
