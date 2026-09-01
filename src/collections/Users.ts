import type { CollectionConfig } from 'payload'
import { isSuperAdmin, superAdminOrSelf, superAdminFieldAccess } from '../access'
import { METODE_LOGIN_DEFAULT, opsiMetodeLogin } from '../lib/dashboard/metode-login'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'metodeLogin', 'lokasi'],
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
      name: 'metodeLogin',
      type: 'select',
      required: true,
      defaultValue: METODE_LOGIN_DEFAULT,
      options: opsiMetodeLogin,
      admin: {
        description:
          'Cara akun ini boleh masuk ke dashboard. Pilih "Akun Google" bila pengguna tidak diberi kata sandi.',
      },
      access: {
        // Menentukan cara masuk = keputusan keamanan, jadi hanya superadmin.
        update: superAdminFieldAccess,
      },
    },
    {
      name: 'googleSub',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        readOnly: true,
        description:
          'Penanda tetap akun Google, terisi otomatis saat pengguna pertama kali masuk lewat Google.',
      },
      access: {
        // Diisi oleh alur OAuth (overrideAccess), bukan oleh siapa pun lewat form.
        create: () => false,
        update: () => false,
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
