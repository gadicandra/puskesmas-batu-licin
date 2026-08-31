import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
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
  // UI admin bawaan Payload (/admin) sudah DIHAPUS — digantikan dashboard custom
  // di /dashboard. Yang tersisa dari Payload adalah schema, auth, access control,
  // versioning, upload, Local API, dan REST /api (dipakai publik untuk berkas media).
  // Pembuatan Super Admin pertama kini lewat halaman /dashboard/setup.
  admin: {
    user: Users.slug,
    disable: true,
  },
  collections: [
    Users,
    Media,
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
