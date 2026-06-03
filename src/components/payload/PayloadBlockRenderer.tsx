import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { MediaWithTextBlock } from '@/blocks/MediaWithText/Component'

const blockComponents: Record<string, React.FC<any>> = {
    media_with_text: MediaWithTextBlock,
}

type LayoutBlock = NonNullable<Page['layout']>[number]

export const PayloadBlockRenderer: React.FC<{ blocks: Page['layout'] }> = ({ blocks }) => {
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
                        <Block {...block} backgroundColor={resolvedBackgroundColor} />
                    </div>
                )
            })}
        </Fragment>
    )
}