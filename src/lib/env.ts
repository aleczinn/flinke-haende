import { z } from 'zod'

const schema = z.object({
    NEXT_PUBLIC_BASE_URL: z.url().default('http://localhost:3000'),
    NEXT_PUBLIC_SITE_SHORTCUT: z.string().default('WS'),
    NEXT_PUBLIC_SCHEMA_TYPE: z.string().default('LocalBusiness'),
})

export const env = schema.parse({
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_SITE_SHORTCUT: process.env.NEXT_PUBLIC_SITE_SHORTCUT,
    NEXT_PUBLIC_SCHEMA_TYPE: process.env.NEXT_PUBLIC_SCHEMA_TYPE,
})