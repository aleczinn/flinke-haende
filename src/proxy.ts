import { NextRequest, NextResponse } from 'next/server'
import {
    COOKIE_LOCALE,
    DEFAULT_LOCALE,
    findByTag,
    isValidLanguage,
    Locale,
    locales,
    toLocaleTag,
} from '@/lib/locale'

function detectFromHeader(acceptLanguage: string | null): Locale | undefined {
    if (!acceptLanguage) return undefined

    const preferred = acceptLanguage
        .split(',')
        .map((part) => {
            const [lang, q] = part.trim().split(';q=')
            return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 }
        })
        .sort((a, b) => b.q - a.q)

    for (const { lang } of preferred) {
        // Exakter Match: de-DE, en-US
        const exact = locales.find((l) => toLocaleTag(l).toLowerCase() === lang)
        if (exact) return exact

        // Sprach-Match: en → en-US
        const langOnly = lang.split('-')[0]
        const byLang = locales.find((l) => l.language === langOnly)
        if (byLang) return byLang
    }

    return undefined
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const segments = pathname.split('/').filter(Boolean)

    // Schon mit gültigem Sprachsegment? Durchlassen, fertig.
    if (isValidLanguage(segments[0])) {
        const response = NextResponse.next()
        response.headers.set('x-pathname', pathname)
        return response
    }

    // Kein Sprachsegment -> einmaliger Redirect mit Detection
    const cookieTag = request.cookies.get(COOKIE_LOCALE)?.value
    const fromCookie = cookieTag ? findByTag(cookieTag) : undefined
    const fromHeader = detectFromHeader(request.headers.get('accept-language'))

    const locale = fromCookie ?? fromHeader ?? DEFAULT_LOCALE

    const url = request.nextUrl.clone()
    url.pathname = `/${locale.language}${pathname}`
    return NextResponse.redirect(url, { status: 307 })
}

export const config = {
    matcher: ['/((?!_next|next/|api|payload|admin|favicon\\.ico|.*\\..*).*)'],
}
