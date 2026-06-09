import type { Hero, Media, Page } from '@/payload-types'
import { Locale } from '@/lib/locale'
import Section from '@/components/layout/Section'
import { Headline } from '@/components/ui/Headline'
import { Tagline } from '@/components/ui/Tagline'
import { Button, ButtonVariant } from '@/components/ui/Button'
import { parseHighlights } from '@/lib/text'
import { resolveButtonHref } from '@/lib/queries'
import Image from 'next/image'
import React from 'react'

type HeroProps = Hero & {
    locale: Locale
    priority?: boolean
}

export const HeroBlock: React.FC<HeroProps> = ({
    locale,
    image,
    tagline,
    headline,
    text,
    buttons,
    priority = true,
}) => {
    const bg = typeof image === 'object' && image !== null ? (image as Media) : null

    return (
        <Section
            variant="none"
            className="relative w-full min-h-[max(22rem,calc(90lvh-9.125rem))] flex items-center overflow-hidden isolate"
        >
            {bg?.url && (
                <div className="absolute inset-0 -z-10">
                    <Image
                        src={bg.url}
                        alt={bg.alt ?? ''}
                        fill
                        priority={priority}
                        sizes="100vw"
                        className="object-cover"
                    />
                </div>
            )}

            <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden="true" />

            <Section variant="capped" outerClassName="h-full" innerClassName="h-full">
                <div className="h-full max-w-none md:max-w-1/2 flex flex-col justify-center text-white py-section">
                    {tagline && (
                        <Tagline alignment="left" className="mb-2">
                            {tagline}
                        </Tagline>
                    )}

                    <Headline as="p" variant="h1" className="text-gray-10 mb-8">
                        {parseHighlights(headline).map((seg, i) =>
                            seg.highlight ? (
                                <span key={i} className="text-primary">
                                    {seg.text}
                                </span>
                            ) : (
                                <span key={i}>{seg.text}</span>
                            ),
                        )}
                    </Headline>

                    {text && (
                        <p className="font-display text-fluid-h6 font-normal text-gray-10 max-w-none md:max-w-[40ch]">
                            {text}
                        </p>
                    )}

                    {buttons && buttons.length > 0 && (
                        <div className="flex flex-row flex-wrap gap-4 mt-8">
                            {buttons.map((btn) => {
                                const href = resolveButtonHref(btn, locale)
                                if (!href) return null

                                const label =
                                    btn.label?.trim() ||
                                    (typeof btn.reference === 'object' && btn.reference
                                        ? (btn.reference as Page).title
                                        : '')

                                if (!label) return null

                                return (
                                    <Button
                                        key={btn.id ?? href}
                                        href={href}
                                        variant={(btn.variant as ButtonVariant) ?? 'primary'}
                                        target={btn.newTab ? '_blank' : undefined}
                                    >
                                        {label}
                                    </Button>
                                )
                            })}
                        </div>
                    )}
                </div>
            </Section>
        </Section>
    )
}
