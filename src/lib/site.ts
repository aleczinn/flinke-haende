import { env } from '@/lib/env'

const rawBaseURL =
    env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    'http://localhost:3000'
export const BASE_URL = rawBaseURL.replace(/\/+$/, '')
export const SITE_SHORTCUT = env.NEXT_PUBLIC_SITE_SHORTCUT || 'WS'
export const SCHEMA_TYPE = env.NEXT_PUBLIC_SCHEMA_TYPE || 'LocalBusiness'