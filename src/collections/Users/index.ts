import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { admin, adminField } from '@/access/roles/admin'
import { adminOrEditor } from '@/access/roles/adminOrEditor'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    admin: authenticated,
    read: adminOrEditor,
    create: adminOrEditor,
    update: admin,
    delete: admin,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Redakteur', value: 'editor' },
      ],
      access: {
        // Nur Admin darf die Rolle ändern
        // Editor sieht sie, kann sie aber nicht ändern
        update: adminField,
      },
    },
  ],
  timestamps: true,
  hooks: {
    // Verhindert, dass ein Editor einen Admin anlegt
    beforeChange: [
      ({ data, req }) => {
        if (req.user?.role === 'editor') {
          data.role = 'editor' // Rolle wird hart auf editor gesetzt
        }
        return data
      },
    ],
  },
}
