import { z } from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    PAYLOAD_SECRET: z.string().min(1),
    PREVIEW_SECRET: z.string().min(1),
    NEXT_PUBLIC_BASE_URL: z.url(),
    NEXT_PUBLIC_SITE_SHORTCUT: z.string().default('WS'),
    NEXT_PUBLIC_SCHEMA_TYPE: z.string().default('LocalBusiness'),
})

export const env = envSchema.parse(process.env)
