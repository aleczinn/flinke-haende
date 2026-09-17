'use client'

import type { Locale } from '@/lib/locale'
import { t } from '@/lib/i18n'
import { useEffect, useRef, useState } from 'react'
import { IconPlay, IconYouTube } from '@/components/icons'
import { css } from '@/lib/utils'
import { useConsent } from '@/components/consent/ConsentProvider'

interface ExternalVideoProps {
    locale: Locale
    url: string
    className?: string
}

type MediaType = 'youtube' | 'vimeo' | 'unknown'

export function ExternalMedia({ locale, url, className }: ExternalVideoProps) {
    const [activated, setActivated] = useState(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const consent = useConsent()
    const mediaType = detectMediaType(url)
    const id = mediaType === 'youtube' ? getYouTubeId(url) : mediaType === 'vimeo' ? getVimeoId(url) : null

    useEffect(() => {
        if (activated) iframeRef.current?.focus()
    }, [activated])

    useEffect(() => {
        if (!consent.choices.externalMedia) queueMicrotask(() => setActivated(false))
    }, [consent.choices.externalMedia])

    if (mediaType === 'unknown' || !id) {
        return (
            <div className={css('rounded-2xl border border-error bg-error-light p-4 text-error-dark', className)} role="status">
                {t(locale, 'external_media.invalid_url')}
            </div>
        )
    }

    const title = mediaType === 'youtube' ? t(locale, 'external_media.youtube') : t(locale, 'external_media.vimeo')
    const embed =
        mediaType === 'youtube'
            ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
            : `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`

    if (activated && consent.allows('externalMedia')) {
        return (
            <div aria-live="polite">
                <iframe
                    ref={iframeRef}
                    src={embed}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={css('aspect-video w-full rounded-2xl border-0', className)}
                />
            </div>
        )
    }

    const play = () => {
        if (!consent.allows('externalMedia')) consent.allowCategory('externalMedia')
        setActivated(true)
    }

    return (
        <div className={css('relative aspect-video overflow-hidden rounded-2xl bg-gray-80 text-white', className)}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                {mediaType === 'youtube' ? (
                    <IconYouTube className="h-auto w-20 text-youtube-red" />
                ) : (
                    <IconPlay className="h-14 w-14" />
                )}
                {!consent.allows('externalMedia') && (
                    <p className="max-w-lg text-sm">{t(locale, 'external_media.consent_notice', title)}</p>
                )}
                <button
                    type="button"
                    onClick={play}
                    className="focus-element rounded-lg bg-primary px-6 py-3 font-semibold hover:bg-primary-darker"
                >
                    {t(locale, consent.allows('externalMedia') ? 'external_media.play' : 'external_media.allow_and_play')}
                </button>
            </div>
        </div>
    )
}

function detectMediaType(url: string): MediaType {
    if (/^(https?:\/\/)?([\w-]+\.)?(youtube\.com|youtu\.be)\//i.test(url)) return 'youtube'
    if (/^(https?:\/\/)?([\w-]+\.)?vimeo\.com\//i.test(url)) return 'vimeo'
    return 'unknown'
}

export function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i)
    return match?.[1] ?? null
}

export function getVimeoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
    return match?.[1] ?? null
}
