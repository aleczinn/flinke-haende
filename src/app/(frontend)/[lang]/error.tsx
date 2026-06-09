'use client'

import { usePathname } from 'next/navigation'
import { DEFAULT_LOCALE, getLocaleFromLang } from '@/lib/locale'
import Section from '@/components/layout/Section'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'
import { useEffect } from 'react'
import { Headline } from '@/components/ui/Headline'
import { Text } from '@/components/ui/Text'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const pathname = usePathname()
    const lang = pathname.split('/').filter(Boolean)[0] ?? ''
    const locale = getLocaleFromLang(lang) ?? DEFAULT_LOCALE

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main id="main" className="grow flex flex-col bg-gray-10" tabIndex={-1}>
            <Section
                variant="capped"
                innerClassName="flex-1 flex flex-col items-center justify-center text-center py-section gap-6 text-gray-90"
            >
                <Headline as="h1" variant="p" alignment="center">
                    {t(locale, 'error.title')}
                </Headline>

                <Text alignment="center">{t(locale, 'error.description')}</Text>

                <Button variant="primary" onClick={reset}>
                    {t(locale, 'error.retry')}
                </Button>
            </Section>
        </main>
    )
}
