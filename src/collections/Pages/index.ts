import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { adminOrEditor } from '@/access/roles/adminOrEditor'
import { admin } from '@/access/roles/admin'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: anyone,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: admin,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'z.B. malerarbeiten (ohne Schrägstrich)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) =>
            value
              ?.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w-]/g, ''),
        ],
      },
    },
  ],
}
