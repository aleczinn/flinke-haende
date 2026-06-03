'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { IconGlobe } from '@/components/icons'
import { t } from '@/lib/i18n'
import { availableLanguages, COOKIE_LOCALE, Locale, locales, toLocaleTag } from '@/lib/locale'
import { useLocaleSwitcher } from '@/components/layout/locale/LocaleSwitcherContext'

interface LocaleSwitcherProps {
    locale: Locale
    className?: string
}

const uniqueLanguages = availableLanguages.map((lang) => locales.find((l) => l.language === lang)!)

export default function LocaleSwitcher({ locale, className }: LocaleSwitcherProps) {
    const pathname = usePathname()
    const { alternates } = useLocaleSwitcher()

    const currentIndex = uniqueLanguages.findIndex((l) => l.language === locale.language)
    const nextLocale = uniqueLanguages[(currentIndex + 1) % uniqueLanguages.length]

    const targetHref = useMemo(() => {
        // Aus Context wenn vorhanden, sonst Fallback per Präfix-Swap
        if (alternates[nextLocale.language]) {
            return alternates[nextLocale.language]
        }
        const pathWithoutLang = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
        return `/${nextLocale.language}${pathWithoutLang === '/' ? '' : pathWithoutLang}`
    }, [alternates, pathname, nextLocale.language])

    const setCookieAndNavigate = () => {
        document.cookie = `${COOKIE_LOCALE}=${toLocaleTag(nextLocale)}; path=/; max-age=31536000; SameSite=Lax`
    }

    const title = t(locale, 'header.change_language_to', nextLocale.label)

    return (
        <a
            href={targetHref}
            onClick={setCookieAndNavigate}
            title={title}
            aria-label={title}
            hrefLang={nextLocale.language}
            className={`h-full flex flex-row items-center p-2 gap-1 text-gray-90 transition-colors duration-200 hover:text-primary hover:cursor-pointer focus-element ${className ?? ''}`}
        >
            <IconGlobe />
            <span className="text-sm">{locale.language.toUpperCase()}</span>
        </a>
    )
}
