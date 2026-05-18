'use client'

import { usePathname } from 'next/navigation'
import { DEFAULT_LOCALE, getLocaleFromLang } from '@/lib/locale'
import Section from '@/components/layout/Section'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
    const pathname = usePathname()
    const lang = pathname.split('/').filter(Boolean)[0] ?? ''
    const locale = getLocaleFromLang(lang) ?? DEFAULT_LOCALE

    return (
        <main id="main" className="grow flex flex-col bg-gray-10">
            <Section
                variant="capped"
                innerClassName="flex-1 flex flex-col items-center justify-center text-center py-40 gap-6 text-gray-90"
            >
                <h1 className="uppercase text-sm">{t(locale, '404.title')}</h1>
                <span className="font-display text-8xl md:text-9xl font-bold text-primary" aria-hidden="true">
                    404
                </span>
                <p>{t(locale, '404.description')}</p>
                <Button variant="primary" href={`/${locale.language}`}>
                    {t(locale, '404.backhome')}
                </Button>
            </Section>
        </main>
    )
}
