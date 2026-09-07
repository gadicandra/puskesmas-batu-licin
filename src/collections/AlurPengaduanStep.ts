import type { CollectionConfig } from 'payload'

export const AlurPengaduanStep: CollectionConfig = {
  slug: 'alur-pengaduan-steps',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['order', 'title', 'active'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'order',
      type: 'number',
      required: true,
      unique: true,
      min: 1,
      admin: {
        step: 1,
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'details',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      index: true,
    },
  ],
}
