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
    labels: {
        singular: { de: 'Benutzer', en: 'User' },
        plural: { de: 'Benutzer', en: 'Users' },
    },
    admin: {
        defaultColumns: ['name', 'email', 'role'],
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'role',
            type: 'select',
            required: true,
            defaultValue: async ({ req }) => {
                if (!req?.payload) return 'editor'
                const { totalDocs } = await req.payload.count({
                    collection: 'users',
                })
                return totalDocs === 0 ? 'admin' : 'editor'
            },
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
            async ({ data, req, operation }) => {
                // Editor darf nie einen anderen Editor zum Admin machen
                if (req.user?.role === 'editor') {
                    data.role = 'editor'
                    return data
                }

                // Backend-Garantie: Erster User wird immer Admin, selbst wenn jemand den UI-Default manuell auf 'editor' setzt
                if (operation === 'create') {
                    const { totalDocs } = await req.payload.count({
                        collection: 'users',
                    })
                    if (totalDocs === 0) {
                        data.role = 'admin'
                    }
                }
                return data
            },
        ],
    },
}
