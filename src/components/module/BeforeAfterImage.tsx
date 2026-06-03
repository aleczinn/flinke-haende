'use client'

import { memo, useEffect, useId, useRef, useState } from 'react'
import type { Media } from '@/payload-types'
import Image from 'next/image'
import { css } from '@/lib/utils'
import type { Locale } from '@/lib/locale'
import { t } from '@/lib/i18n'
import { IconArrows } from '@/components/icons'

interface BeforeAfterImageProps {
    locale: Locale
    before: Media
    after: Media
    beforeLabel?: string
    afterLabel?: string
    /** Initial-Position 0–100 (Default: 50) */
    initialPosition?: number
    onChange?: (position: number) => void
    sizes?: string
    priority?: boolean
    className?: string
}

function renderBadges(beforeLabel: string, afterLabel: string) {
    return (
        <>
            <span
                className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none"
                aria-hidden="true"
            >
                {beforeLabel}
            </span>
            <span
                className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none"
                aria-hidden="true"
            >
                {afterLabel}
            </span>
        </>
    )
}

function renderDivider(isDragging: boolean, position: number) {
    return (
        <div
            className={css(
                'absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none text-gray-70',
                !isDragging && 'motion-safe:transition-[left] motion-safe:duration-100',
            )}
            style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            aria-hidden="true"
        >
            <div
                className={css(
                    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                    'rounded-full bg-white flex items-center justify-center',
                    'ring-2 ring-white/30',
                    'motion-safe:transition-[transform,box-shadow,width,height] motion-safe:duration-150',
                    isDragging ? 'w-14 h-14 shadow-2xl' : 'w-12 h-12 shadow-xl',
                )}
            >
                <IconArrows />
            </div>
        </div>
    )
}

/**
 * Before-Bild im normalen Dokumentfluss — bestimmt die Container-Höhe.
 * Re-rendert nur wenn sich das Asset ändert, nicht bei jedem Drag-Frame.
 */
const MemoizedBeforeImage = memo(function MemoizedBeforeImage({
    asset,
    sizes,
    priority,
}: {
    asset: Media
    sizes: string
    priority?: boolean
}) {
    return (
        <Image
            src={asset.url!}
            alt={asset.alt}
            width={asset.width ?? 1200}
            height={asset.height ?? 800}
            sizes={sizes}
            priority={priority}
            className="w-full h-auto block"
        />
    )
})

/**
 * After-Bild absolut positioniert mit fill — füllt denselben Bereich wie
 * das Before-Bild. Clip-Path liegt auf dem Parent-Wrapper.
 */
const MemoizedAfterImage = memo(function MemoizedAfterImage({
    asset,
    sizes,
    priority,
}: {
    asset: Media
    sizes: string
    priority?: boolean
}) {
    return <Image src={asset.url!} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
})

export function BeforeAfterImage({
    locale,
    before,
    after,
    beforeLabel,
    afterLabel,
    initialPosition = 50,
    onChange,
    sizes = '(min-width: 1024px) 712px, calc(100vw - 2rem)',
    priority,
    className,
}: BeforeAfterImageProps) {
    const inputId = useId()
    const clampedInitial = Math.min(100, Math.max(0, initialPosition))
    const [position, setPosition] = useState(clampedInitial)
    const [isFocused, setIsFocused] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const isPointerFocus = useRef(false)

    const hasMedia = Boolean(before?.url && after?.url)

    useEffect(() => {
        if (!isDragging) return
        const stopDragging = () => setIsDragging(false)
        window.addEventListener('pointerup', stopDragging)
        window.addEventListener('pointercancel', stopDragging)
        return () => {
            window.removeEventListener('pointerup', stopDragging)
            window.removeEventListener('pointercancel', stopDragging)
        }
    }, [isDragging])

    // Sync bei externem initialPosition-Wechsel (z.B. Live-Preview)
    useEffect(() => {
        setPosition(Math.min(100, Math.max(0, initialPosition)))
    }, [initialPosition])

    if (!hasMedia) return null

    const labelBefore = beforeLabel || t(locale, 'before_after.before')
    const labelAfter = afterLabel || t(locale, 'before_after.after')
    const labelCompare = t(locale, 'before_after.compare', labelBefore, labelAfter)
    const labelValue = t(locale, 'before_after.value', position, labelAfter)

    const handleChange = (value: number) => {
        setPosition(value)
        onChange?.(value)
    }

    const handlePointerDown = () => {
        isPointerFocus.current = true
        setIsDragging(true)
    }

    const handleFocus = () => {
        if (isPointerFocus.current) {
            isPointerFocus.current = false
            return
        }
        setIsFocused(true)
    }

    return (
        <div className={css('relative select-none touch-pan-y', className)}>
            {/* overflow-hidden nur auf dem Bild-Container, nicht auf dem Wrapper —
                damit der Divider-Handle oben/unten nicht abgeschnitten wird */}
            <div className="relative rounded-2xl overflow-hidden">
                <MemoizedBeforeImage asset={before} sizes={sizes} priority={priority} />

                {/* After-Bild: absolut; Clip-Path blendet den linken Teil aus.
                    Transition nur wenn nicht gezogen, sonst läuft Slider dem Cursor hinterher. */}
                <div
                    className={css(
                        'absolute inset-0',
                        !isDragging && 'motion-safe:transition-[clip-path] motion-safe:duration-100',
                    )}
                    style={{ clipPath: `inset(0 0 0 ${position}%)` }}
                    aria-hidden="true"
                >
                    <MemoizedAfterImage asset={after} sizes={sizes} priority={priority} />
                </div>

                {renderBadges(labelBefore, labelAfter)}
            </div>

            {renderDivider(isDragging, position)}

            {isFocused && (
                <div
                    className="absolute rounded-2xl pointer-events-none z-10"
                    style={{
                        inset: 'var(--focus-y-offset, -0.5rem)',
                        border: '0.3rem dotted var(--color-focus)',
                    }}
                    aria-hidden="true"
                />
            )}

            <label htmlFor={inputId} className="sr-only">
                {labelCompare}
            </label>
            <input
                id={inputId}
                type="range"
                min={0}
                max={100}
                step={1}
                value={position}
                onChange={(e) => handleChange(Number(e.target.value))}
                onPointerDown={handlePointerDown}
                onFocus={handleFocus}
                onBlur={() => setIsFocused(false)}
                aria-valuetext={labelValue}
                className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize"
            />
        </div>
    )
}
