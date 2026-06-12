'use client'

import type { Locale } from '@/lib/locale'
import { useEffect, useRef, useState } from 'react'
import { IconPlay, IconYouTube } from '@/components/icons'
import { css } from '@/lib/utils'

interface ExternalVideoProps {
    locale: Locale
    url: string
    className?: string
}

type MediaType = 'youtube' | 'vimeo' | 'image' | 'unknown'

export function ExternalMedia({ locale, url, className }: ExternalVideoProps) {
    const [activated, setActivated] = useState(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        if (activated) iframeRef.current?.focus()
    }, [activated])

    const mediaType = detectMediaType(url)
    const aspectRatio = '16 / 9'

    switch (mediaType) {
        case 'youtube':
        case 'vimeo':
            const title = `External media`
            const id = mediaType === 'youtube' ? getYouTubeId(url) : getVimeoId(url)
            const thumbnail = mediaType === 'youtube' ?  `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
            const embed =
                mediaType === 'youtube'
                    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
                    : `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`

            if (activated) {
                return (
                    <div aria-live="polite">
                        <iframe
                            ref={iframeRef}
                            src={embed}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={css('border-0 rounded-2xl', className)}
                            style={{ aspectRatio, width: '100%', height: 'auto' }}
                        />
                    </div>
                )
            }

            return (
                <button
                    type="button"
                    onClick={() => setActivated(true)}
                    className={`aspect-video rounded-2xl focus-element group block cursor-pointer ${className ?? ''}`}
                    title={`Video abspielen: ${title}`}
                    aria-label={`Video abspielen: ${title}`}
                    style={{ aspectRatio }}
                >
                    <div className="relative w-full h-full overflow-hidden rounded-[inherit]">
                        {thumbnail ? (
                            <img
                                src={thumbnail}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 skeleton-pulse" />
                        )}

                        <span
                            className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-black/30"
                            aria-hidden="true"
                        >
                            {mediaType === 'youtube' ? (
                                <span className="flex w-20 items-center justify-center text-gray-90/80 transition-colors duration-200 group-hover:text-youtube-red">
                                    <IconYouTube className="w-full h-full" />
                                </span>
                            ) : (
                                <span className="flex w-16 h-16 items-center justify-center rounded-full bg-gray-90/80 transition-transform duration-200 motion-safe:group-hover:scale-110">
                                    <IconPlay className="ml-1 h-8 w-8 text-gray-10" />
                                </span>
                            )}
                        </span>
                    </div>
                </button>
            )
        case 'image':
            break
    }

    return <div>external media: {url}</div>
}

function detectMediaType(url: string): MediaType {
    if (/youtube\.com|youtu\.be/.test(url)) {
        return 'youtube'
    }

    if (/vimeo\.com/.test(url)) {
        return 'vimeo'
    }
    return 'unknown'
}

export function getYouTubeId(url: string): string | null {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
    return m?.[1] ?? null
}

export function getVimeoId(url: string): string | null {
    const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    return m?.[1] ?? null
}

// function detectMediaKind(url: string): MediaKind {
//     const url = asset.filename ?? ''
//
//     if (asset.is_external_url) {
//         if (/youtube\.com|youtu\.be/.test(url)) {
//             return 'youtube'
//         }
//
//         if (/vimeo\.com/.test(url)) {
//             return 'vimeo'
//         }
//         return 'unknown'
//     }
//
//     if (IMAGE_EXT.test(url)) {
//         return 'image'
//     }
//
//     if (VIDEO_EXT.test(url)) {
//         return 'video'
//     }
//     return 'unknown'
// }
