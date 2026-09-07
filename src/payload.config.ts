import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3'
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
import { Services } from './collections/Services'
import { Posyandu } from './collections/Posyandu'
import { Facilities } from './collections/Facilities'
import { Complaints } from './collections/Complaints'
import { OrgChart } from './collections/OrgChart'
import { ServiceStatistics } from './collections/ServiceStatistics'
import { OperationalHours } from './globals/OperationalHours'
import { SiteSettings } from './globals/SiteSettings'
import { AlurPengaduanStep } from './collections/AlurPengaduanStep'
import { KritikSaran } from './collections/KritikSaran'
import { Pengaduan } from './collections/Pengaduan'
import { seedAlurPengaduan } from './lib/seedAlurPengaduan'
import { Profile } from './globals/Profile'
import { r2Aktif, konfigurasiR2, namaBucketR2 } from './lib/penyimpanan'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function validateProductionEnvironment() {
  if (process.env.NODE_ENV !== 'production') return

  const required = ['DATABASE_URL', 'PAYLOAD_SECRET']
  const missing = required.filter((name) => !process.env[name])
  if (missing.length > 0) {
    throw new Error(`Environment production belum lengkap: ${missing.join(', ')}`)
  }

  if (process.env.PAYLOAD_SECRET === 'rahasia-pengembangan-jangan-dipakai-di-produksi') {
    throw new Error('PAYLOAD_SECRET harus diganti dengan nilai acak di production.')
  }

  if ((process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_SECRET) && !process.env.APP_URL) {
    throw new Error('APP_URL wajib diisi ketika Google OAuth diaktifkan.')
  }

  if (!process.env.RESEND_API_KEY && !process.env.FEEDBACK_WEBHOOK_URL) {
    throw new Error('RESEND_API_KEY atau FEEDBACK_WEBHOOK_URL wajib dikonfigurasi di production.')
  }
}

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
    AlurPengaduanStep,
    Pengaduan,
    KritikSaran,
    Services,
    Posyandu,
    Facilities,
    Complaints,
    OrgChart,
    ServiceStatistics,
  ],
  onInit: async (payload) => {
    validateProductionEnvironment()
    await seedAlurPengaduan(payload)
  },
  globals: [OperationalHours, SiteSettings, Profile],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // `push` mencocokkan tabel dengan definisi koleksi secara otomatis. Enak
    // untuk iterasi cepat, TAPI saat perubahannya ambigu (mis. kolom hilang dan
    // kolom baru muncul bersamaan) ia BERTANYA lewat prompt interaktif. Tanpa
    // TTY — di dalam container, di CI, di produksi — prompt itu menggantung dan
    // push berhenti separuh jalan tanpa pesan galat: skema jadi basi diam-diam.
    //
    // Karena itu push hanya dinyalakan saat `pnpm dev` langsung di komputer
    // (ada TTY untuk menjawab). Docker dan produksi memakai migrasi:
    //   `pnpm payload migrate:create`  setelah mengubah koleksi
    //   `pnpm payload migrate`         untuk menerapkannya
    push: process.env.PAYLOAD_DB_PUSH
        ? process.env.PAYLOAD_DB_PUSH === 'true'
        : process.env.NODE_ENV !== 'production',
  }),
  sharp,
  plugins: [
    // Cloudflare R2 untuk berkas unggahan. `enabled: false` saat variabel R2
    // belum diisi — plugin lewat begitu saja dan Payload kembali memakai
    // `staticDir` di koleksi Media, sehingga lingkungan pengembangan tetap
    // jalan tanpa konfigurasi apa pun.
    //
    // Saat aktif, `disableLocalStorage` menyala sendiri (default plugin ini):
    // berkas TIDAK lagi ditulis ke disk. URL publiknya tetap
    // `/api/media/<berkas>` karena Payload yang melayaninya — jadi bucket tidak
    // perlu dibuat publik, dan tautan yang sudah tersimpan di artikel tidak
    // berubah saat berpindah dari disk lokal ke R2.
    s3Storage({
      enabled: r2Aktif(),
      collections: { media: true },
      bucket: r2Aktif() ? namaBucketR2() : '',
      config: r2Aktif() ? konfigurasiR2() : {},
    }),
  ],
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },
})
