import { isValidContact, sendCompanyNotification } from '../lib/feedbackSubmission'
import type { CollectionConfig } from 'payload'

export const KritikSaran: CollectionConfig = {
  slug: 'kritik-saran',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['name', 'contact', 'subject', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          await sendCompanyNotification('kritik-saran', {
            name: String(data.name),
            contact: String(data.contact),
            subject: String(data.subject),
            message: String(data.message),
          })
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      name: 'contact',
      type: 'text',
      required: true,
      maxLength: 160,
      validate: (value: unknown) =>
        (typeof value === 'string' && isValidContact(value)) ||
        'Masukkan email atau nomor telepon yang valid.',
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 5000,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'baru',
      required: true,
      options: [
        { label: 'Baru', value: 'baru' },
        { label: 'Diproses', value: 'diproses' },
        { label: 'Selesai', value: 'selesai' },
      ],
      access: {
        create: ({ req }) => Boolean(req.user),
      },
    },
  ],
}
