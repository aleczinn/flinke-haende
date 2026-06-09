import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { MediaWithTextBlock } from '@/components/blocks/MediaWithText/Component'
import { Locale } from '@/lib/locale'
import { HeroBlock } from '@/components/blocks/Hero/Component'

const blockComponents: Record<string, React.FC<any>> = {
    hero: HeroBlock,
    media_with_text: MediaWithTextBlock,
}

type LayoutBlock = NonNullable<Page['layout']>[number]

interface PayloadBlockRendererProps {
    locale: Locale
    blocks: Page['layout']
}

export const PayloadBlockRenderer: React.FC<PayloadBlockRendererProps> = ({ locale, blocks }) => {
    if (!blocks?.length) {
        return null
    }

    return (
        <Fragment>
            {blocks.map((block, index) => {
                const { blockType } = block as LayoutBlock & { blockType: string }

                const Block = blockComponents[blockType]
                if (!Block) return null

                const resolvedBackgroundColor =
                    block.backgroundColor === 'automatic' ? (index % 2 === 0 ? 'gray' : 'white') : block.backgroundColor

                return (
                    <div key={index}>
                        <Block locale={locale} {...block} backgroundColor={resolvedBackgroundColor} />
                    </div>
                )
            })}
        </Fragment>
    )
}