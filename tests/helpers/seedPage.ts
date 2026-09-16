import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export interface SeededTestPage {
  id: number
  slug: string
  title: string
}

export async function seedTestPage(): Promise<SeededTestPage> {
  const payload = await getPayload({ config })
  const suffix = randomUUID()
  const title = `E2E Test Page ${suffix}`
  const slug = `e2e-test-page-${suffix}`

  const page = await payload.create({
    collection: 'pages',
    locale: 'de-DE',
    draft: false,
    overrideAccess: true,
    data: {
      title,
      slug,
      _status: 'published',
    },
  })

  return { id: page.id, slug, title }
}

export async function cleanupTestPage(id: number): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'pages',
    id,
    overrideAccess: true,
  })
}
