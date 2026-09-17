'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/locale'
import { t } from '@/lib/i18n'
import { hasGloballyPromptedServices, statisticsEnabled } from '@/lib/consent/services'
import { useConsent } from './ConsentProvider'
import { Button } from '@/components/ui/Button'

export function ConsentManager({ locale }: { locale: Locale }) {
    const consent = useConsent()
    const showInitialBanner = consent.ready && hasGloballyPromptedServices && !consent.hasDecision
    const visible = showInitialBanner || consent.settingsOpen

    if (!visible) return null

    return <ConsentDialog locale={locale} />
}

function ConsentDialog({ locale }: { locale: Locale }) {
    const consent = useConsent()
    const [draft, setDraft] = useState(consent.choices)
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        dialogRef.current?.focus()
    }, [])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && consent.hasDecision) {
                consent.closeSettings()
                return
            }
            if (event.key !== 'Tab' || !dialogRef.current) return
            const focusable = Array.from(
                dialogRef.current.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
                ),
            )
            if (!focusable.length) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [consent])

    return (
        <div className="fixed inset-0 z-popup flex items-end justify-center bg-black/45 p-4 sm:items-center" role="presentation">
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="consent-title"
                aria-describedby="consent-description"
                tabIndex={-1}
                className="max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 text-gray-90 shadow-2xl sm:p-8"
            >
                <h2 id="consent-title" className="text-2xl font-bold">
                    {t(locale, 'consent.title')}
                </h2>
                <p id="consent-description" className="mt-3">
                    {t(locale, 'consent.description')}
                </p>

                {consent.settingsOpen && (
                    <fieldset className="mt-6 space-y-4">
                        <legend className="font-bold">{t(locale, 'consent.settings')}</legend>
                        <label className="flex gap-3 rounded-lg border border-gray-30 p-4">
                            <input type="checkbox" checked disabled className="mt-1 size-5" />
                            <span>
                                <strong className="block">{t(locale, 'consent.necessary.title')}</strong>
                                <span className="text-sm text-gray-70">{t(locale, 'consent.necessary.description')}</span>
                            </span>
                        </label>
                        <label className="flex gap-3 rounded-lg border border-gray-30 p-4">
                            <input
                                type="checkbox"
                                checked={draft.externalMedia}
                                onChange={(event) => setDraft({ ...draft, externalMedia: event.target.checked })}
                                className="mt-1 size-5"
                            />
                            <span>
                                <strong className="block">{t(locale, 'consent.external_media.title')}</strong>
                                <span className="text-sm text-gray-70">{t(locale, 'consent.external_media.description')}</span>
                            </span>
                        </label>
                        {statisticsEnabled && (
                            <label className="flex gap-3 rounded-lg border border-gray-30 p-4">
                                <input
                                    type="checkbox"
                                    checked={draft.statistics}
                                    onChange={(event) => setDraft({ ...draft, statistics: event.target.checked })}
                                    className="mt-1 size-5"
                                />
                                <span>
                                    <strong className="block">{t(locale, 'consent.statistics.title')}</strong>
                                    <span className="text-sm text-gray-70">{t(locale, 'consent.statistics.description')}</span>
                                </span>
                            </label>
                        )}
                    </fieldset>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {consent.settingsOpen ? (
                        <Button onClick={() => consent.saveChoices(draft)}>{t(locale, 'consent.save')}</Button>
                    ) : (
                        <Button onClick={consent.acceptAll}>{t(locale, 'consent.accept_all')}</Button>
                    )}
                    <Button variant="primary-hollow" onClick={consent.rejectOptional}>
                        {t(locale, 'consent.necessary_only')}
                    </Button>
                    {!consent.settingsOpen && (
                        <Button variant="primary-hollow" onClick={consent.openSettings}>
                            {t(locale, 'consent.settings')}
                        </Button>
                    )}
                    {consent.settingsOpen && consent.hasDecision && (
                        <button type="button" onClick={consent.closeSettings} className="px-4 py-2 underline focus-element">
                            {t(locale, 'consent.close')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
