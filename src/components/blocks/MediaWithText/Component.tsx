import React, { useId } from 'react'
import { MediaWithText, Page } from '@/payload-types'
import type { Media } from '@/payload-types'
import Section from '@/components/layout/Section'
import { css } from '@/lib/utils'
import { Tagline } from '@/components/ui/Tagline'
import { Headline } from '@/components/ui/Headline'
import RichTextRenderer from '@/components/payload/RichTextRenderer'
import { backgroundClass, backgroundColorClasses } from '@/fields/background-color'
import { BeforeAfterImage } from '@/components/module/BeforeAfterImage'
import { DEFAULT_LOCALE, Locale } from '@/lib/locale'
import { Button, ButtonVariant } from '@/components/ui/Button'
import { resolveButtonHref } from '@/lib/queries'
import { parseButtonForField } from '@/lib/utilities/button'
import { ButtonRenderer } from '@/components/payload/ButtonRenderer'

type MediaWithTextProps = MediaWithText & {
    locale: Locale
}

export const MediaWithTextBlock: React.FC<MediaWithTextProps> = ({
    locale,
    layout,
    tagline,
    headline,
    text,
    mediaType,
    image,
    video,
    externalVideoUrl,
    comparisonBefore,
    comparisonAfter,
    buttons,
    backgroundColor,
}) => {
    const headingId = useId()
    const isMediaLeft = layout === 'left'

    // Payload liefert bei depth >= 1 Objekte, bei flachen Abfragen nur IDs
    const imageMedia = typeof image === 'object' && image !== null ? (image as Media) : null
    const beforeMedia =
        typeof comparisonBefore === 'object' && comparisonBefore !== null ? (comparisonBefore as Media) : null
    const afterMedia =
        typeof comparisonAfter === 'object' && comparisonAfter !== null ? (comparisonAfter as Media) : null

    return (
        <Section
            variant="capped"
            outerClassName={css('py-section', backgroundClass(backgroundColor))}
            innerClassName="grid grid-cols-1 lg:grid-cols-2 gap-8"
            aria-labelledby={headline ? headingId : undefined}
        >
            <div className={css('flex flex-col justify-center', !isMediaLeft && 'lg:order-2')}>
                {mediaType === 'image' && imageMedia && (
                    <img className="rounded-2xl" src={(image as Media).url ?? ''} alt={(image as Media).alt} />
                )}

                {mediaType === 'comparison' && beforeMedia && afterMedia && (
                    <BeforeAfterImage
                        locale={locale}
                        before={beforeMedia}
                        after={afterMedia}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                )}
            </div>

            <div className={`flex flex-col justify-center`}>
                {tagline && <Tagline alignment="left" children={tagline} className="mb-2" />}

                {headline && (
                    <Headline id={headingId} as="h2" variant="h3" alignment="left" design="line" className="mb-4">
                        {headline}
                    </Headline>
                )}

                {text && <RichTextRenderer data={text} />}

                <ButtonRenderer locale={locale} buttons={buttons} className="flex flex-row flex-wrap gap-4 mt-8" />
            </div>
        </Section>
    )
}
