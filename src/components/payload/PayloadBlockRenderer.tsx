import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { MediaWithTextBlock } from '@/blocks/MediaWithText/Component'

const blockComponents: Record<string, React.FC<any>> = {
    mwt: MediaWithTextBlock,
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

                return (
                    <div key={index}>
                        <Block {...block} />
                    </div>
                )
            })}
        </Fragment>
    )
}