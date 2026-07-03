import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Doctors } from './collections/Doctors'
import { MedicalStaff } from './collections/MedicalStaff'
import { Vaccines } from './collections/Vaccines'
import { Certificates } from './collections/Certificates'
import { Articles } from './collections/Articles'
import { PageViews } from './collections/PageViews'
import { OperationalHours } from './globals/OperationalHours'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ['/components/admin/DashboardStats'],
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
    },
  },
  collections: [
    Users,
    {
      slug: 'media',
      access: {
        read: () => true, // file (gambar/PDF) harus bisa dibaca publik untuk tampil di web
      },
      upload: {
        staticDir: path.resolve(dirname, '../media'), // Lokal disk (<project>/media)
        mimeTypes: ['image/*', 'application/pdf'],
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
        ],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    Doctors,
    MedicalStaff,
    Vaccines,
    Certificates,
    Articles,
    PageViews,
  ],
  globals: [OperationalHours, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
})
