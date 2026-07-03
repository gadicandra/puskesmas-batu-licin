import type { CollectionConfig } from 'payload'
import { isSuperAdmin, superAdminOrSelf, superAdminFieldAccess } from '../access'
import { unitOptions } from '../lib/units'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'unit'],
    group: 'Sistem',
  },
  auth: true,
  access: {
    read: superAdminOrSelf,
    create: isSuperAdmin,
    update: superAdminOrSelf,
    delete: isSuperAdmin,
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
      defaultValue: 'admin_unit',
      saveToJWT: true,
      options: [
        { label: 'Super Admin (Puskesmas)', value: 'superadmin' },
        { label: 'Admin Unit', value: 'admin_unit' },
      ],
      access: {
        // Hanya superadmin yang boleh menaikkan/menurunkan role.
        update: superAdminFieldAccess,
      },
    },
    {
      name: 'unit',
      type: 'select',
      saveToJWT: true,
      options: [...unitOptions],
      admin: {
        description: 'Unit yang dikelola. Wajib untuk Admin Unit.',
        condition: (data) => data?.role === 'admin_unit',
      },
      access: {
        update: superAdminFieldAccess,
      },
    },
  ],
}
