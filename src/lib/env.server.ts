import { z } from 'zod'

const schema = z.object({
    DATABASE_ADAPTER: z.enum(['sqlite', 'postgres']).default('sqlite'),
    DATABASE_URL: z.string().min(1),
    BLOB_READ_WRITE_TOKEN: z.preprocess((value) => (value === '' ? undefined : value), z.string().min(1).optional()),
    PAYLOAD_SECRET: z.string().min(8),
    PREVIEW_SECRET: z.string().min(1),
})

export const serverEnv = schema.parse({
    DATABASE_ADAPTER: process.env.DATABASE_ADAPTER,
    DATABASE_URL: process.env.DATABASE_URL,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    PREVIEW_SECRET: process.env.PREVIEW_SECRET,
})
