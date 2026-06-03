import React, { useId } from 'react'
import { MediaWithText } from '@/payload-types'
import type { Media } from '@/payload-types'
import Section from '@/components/layout/Section'
import { css } from '@/lib/utils'
import { Tagline } from '@/components/ui/Tagline'
import { Headline } from '@/components/ui/Headline'
import RichTextRenderer from '@/components/payload/RichTextRenderer'

export const MediaWithTextBlock: React.FC<MediaWithText> = ({
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
}) => {
    const headingId = useId()
    const isMediaLeft = layout === 'left'

    return (
        <Section
            variant="capped"
            outerClassName="py-section"
            innerClassName="grid grid-cols-1 lg:grid-cols-2 gap-8"
            aria-labelledby={headline ? headingId : undefined}
        >
            <div className={css('flex flex-col justify-center', !isMediaLeft && 'lg:order-2')}>
                {mediaType === 'image' && image && <img className="rounded-2xl" src={(image as Media).url ?? ''} alt={(image as Media).alt} />}
            </div>

            <div className={`flex flex-col justify-center`}>
                {tagline && <Tagline alignment="left" children={tagline} className="mb-2" />}

                {headline && (
                    <Headline id={headingId} as="h2" variant="h3" alignment="left" design="line" className="mb-4">
                        {headline}
                    </Headline>
                )}

                {text && <RichTextRenderer data={text} />}
            </div>
        </Section>
    )
}