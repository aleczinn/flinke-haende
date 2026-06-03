import { DefaultNodeTypes, type DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import {
    JSXConvertersFunction,
    LinkJSXConverter,
    RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import { css } from '@/lib/utils'

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
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

                // Bold / Italic
                '[&_strong]:font-bold',
                '[&_em]:italic',

                className,
            )}
        />
    )
}
