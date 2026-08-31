import type { CollectionConfig } from 'payload'
import { isSuperAdmin, superAdminOrSelf, superAdminFieldAccess } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'lokasi'],
    group: 'Sistem',
  },
  auth: {
    // Batasi percobaan login untuk menahan serangan brute-force.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 menit
  },
  access: {
    // Hanya superadmin yang mengelola akun. User biasa hanya melihat dirinya.
    read: superAdminOrSelf,
    create: isSuperAdmin,
    update: superAdminOrSelf,
    delete: isSuperAdmin,
  },
  hooks: {
    beforeChange: [
      // Akun PERTAMA yang dibuat otomatis jadi superadmin (Puskesmas).
      async ({ req, operation, data }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users' })
          if (totalDocs === 0) return { ...data, role: 'superadmin' }
        }
        return data
      },
    ],
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
      defaultValue: 'admin',
      saveToJWT: true,
      options: [
        { label: 'Super Admin (Puskesmas)', value: 'superadmin' },
        { label: 'Admin (Unit/Jejaring)', value: 'admin' },
      ],
      admin: {
        description: 'Superadmin: akses penuh. Admin: hanya kelola artikel.',
      },
      access: {
        // Hanya superadmin yang boleh menetapkan/menaikkan role (termasuk jadi superadmin).
        update: superAdminFieldAccess,
      },
    },
    {
      name: 'lokasi',
      type: 'text',
      saveToJWT: true,
      admin: {
        description: 'Nama unit/lokasi layanan (untuk akun Admin). Kosongkan untuk Superadmin.',
        condition: (data) => data?.role === 'admin',
      },
      access: {
        update: superAdminFieldAccess,
      },
    },
  ],
}
