import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { plugins } from '@/plugins'

import { Company } from '@/globals/Company/config'
import { Header } from '@/globals/Header/config'
import { Footer } from '@/globals/Footer/config'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { DEFAULT_LOCALE, locales, toLocaleTag } from '@/lib/locale'

import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        livePreview: {
            breakpoints: [
                {
                    label: 'Mobile',
                    name: 'mobile',
                    width: 375,
                    height: 667,
                },
                {
                    label: 'Tablet',
                    name: 'tablet',
                    width: 768,
                    height: 1024,
                },
                {
                    label: 'Desktop',
                    name: 'desktop',
                    width: 1440,
                    height: 900,
                },
            ],
        },
    },
    collections: [Users, Media, Pages],

    /* Localization */
    localization: {
        locales: locales.map((l) => ({
            label: l.label,
            code: toLocaleTag(l),
        })),
        defaultLocale: toLocaleTag(DEFAULT_LOCALE),
        fallback: true,
    },

    /* i18n Localization (Admin Panel) */
    i18n: {
        supportedLanguages: { de, en },
        fallbackLanguage: 'de',
    },

    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || '',
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: sqliteAdapter({
        client: {
            url: process.env.DATABASE_URL || '',
        },
    }),
    sharp,
    globals: [Company, Header, Footer],
    plugins,
})
