import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'

import { Pages } from '@/collections/Pages'
import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    supportedLanguages: { en, de },
    fallbackLanguage: 'en',
  },
  localization: {
    locales: [
      { label: 'Deutsch', code: 'de' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'de',
    fallback: true,
  },
  collections: [Pages, Users, Media],
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
  plugins: [],
})
