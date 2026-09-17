'use client'

import type { Locale } from '@/lib/locale'
import { t } from '@/lib/i18n'
import { useConsent } from './ConsentProvider'

export function ConsentSettingsButton({ locale }: { locale: Locale }) {
    const { openSettings } = useConsent()
    return (
        <button type="button" onClick={openSettings} className="text-sm hover:underline focus-element">
            {t(locale, 'consent.settings')}
        </button>
    )
}
