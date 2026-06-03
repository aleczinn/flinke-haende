import { DefaultNodeTypes, type DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import {
    JSXConvertersFunction,
    LinkJSXConverter,
    RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import { css } from '@/lib/utils'
import React from 'react'

// Lexical Format-Flags
const IS_BOLD        = 1
const IS_ITALIC      = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE   = 8
const IS_CODE        = 16
const IS_SUBSCRIPT   = 32
const IS_SUPERSCRIPT = 64

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    text: ({ node }) => {
        let children: React.ReactNode = node.text

        if (node.format & IS_BOLD) children = <strong className="font-bold">{children}</strong>
        if (node.format & IS_ITALIC) children = <em className="italic">{children}</em>
        if (node.format & IS_STRIKETHROUGH) children = <s>{children}</s>
        if (node.format & IS_UNDERLINE) children = <u>{children}</u>
        if (node.format & IS_CODE)
            children = <code className="bg-gray-20 px-1 rounded text-sm">{children}</code>
        if (node.format & IS_SUBSCRIPT) children = <sub>{children}</sub>
        if (node.format & IS_SUPERSCRIPT) children = <sup>{children}</sup>

        return <>{children}</>
    },
    ...LinkJSXConverter({
        internalDocToHref: ({ linkNode }) => {
            const { value, relationTo } = linkNode.fields.doc!
            if (typeof value !== 'object') throw new Error('Expected object')
            const slug = value.slug
            return `/${slug}`
        },
    }),
})

interface RichTextProps {
    data: DefaultTypedEditorState
    className?: string
}

export default function RichTextRenderer({ data, className }: RichTextProps) {
    return (
        <ConvertRichText
            converters={jsxConverters}
            data={data}
            className={css(
                // Paragraphen
                '[&_p:not(:last-child)]:mb-2',

                // Listen
                '[&_ul]:list-disc [&_ul]:pl-4 [&_ul:not(:last-child)]:mb-2',
                '[&_ol]:list-decimal [&_ol]:pl-4 [&_ol:not(:last-child)]:mb-2',
                '[&_li]:mb-1',
                'marker:text-primary',

                // Links
                '[&_a]:underline [&_a]:text-primary',
                'hover:[&_a]:text-primary-darker',

                className,
            )}
        />
    )
}
