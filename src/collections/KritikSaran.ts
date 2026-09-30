import { enforceFeedbackRateLimit, isValidContact, sendCompanyNotification } from '../lib/feedbackSubmission'
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
      ({ data, operation, req }) => {
        if (operation === 'create') enforceFeedbackRateLimit(req)
        return data
      },
    ],
    // Email hanya pemberitahuan — isinya sudah tersimpan dan terbaca di
    // /dashboard/pengaduan. Dikirim SESUDAH tersimpan dan kegagalannya cuma
    // dicatat: kalau dilempar dari beforeChange, satu gangguan layanan email
    // membuat pesan warga hilang begitu saja dan mereka melihat galat 500.
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        try {
          await sendCompanyNotification('kritik-saran', {
            name: String(doc.name),
            contact: String(doc.contact),
            subject: String(doc.subject),
            message: String(doc.message),
          })
        } catch (err) {
          req.payload.logger.error({ err, id: doc.id }, 'Notifikasi email kritik-saran gagal dikirim')
        }
        return doc
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
