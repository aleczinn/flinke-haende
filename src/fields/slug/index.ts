import type { TextField } from 'payload'
import { formatSlugHook } from '@/fields/slug/formatSlug'

type LocalizedString = string | Record<string, string>

interface SlugFieldOptions {
    slug?: Partial<Omit<TextField, 'name' | 'type'>>
}

export const slugField = (fieldToUse = 'title', { slug: slugOverrides = {} }: SlugFieldOptions = {}): TextField => {
    const { admin: slugAdmin, ...slugRest } = slugOverrides
    const description = slugAdmin?.description as LocalizedString | undefined

    return {
        name: 'slug',
        type: 'text',
        index: true,
        ...slugRest,
        hooks: {
            beforeChange: [formatSlugHook(fieldToUse)],
        },
        admin: {
            ...slugAdmin,
            description: undefined,
            components: {
                Field: {
                    path: '@/fields/slug/SlugComponent#SlugComponent',
                    clientProps: { fieldToUse, description },
                },
            },
        },
    } as TextField
}
