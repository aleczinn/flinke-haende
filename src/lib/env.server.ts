import 'server-only'
import { z } from 'zod'

const schema = z.object({
    DATABASE_URL: z.string().min(1),
    PAYLOAD_SECRET: z.string().min(8),
    PREVIEW_SECRET: z.string().min(1),
})

export const serverEnv = schema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    PREVIEW_SECRET: process.env.PREVIEW_SECRET,
})
