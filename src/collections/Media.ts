import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** Berkas unggahan (gambar & PDF).
 *
 *  Tempat penyimpanannya dipilih otomatis di `src/payload.config.ts`:
 *  - Variabel `R2_*` kosong → disk lokal `<project>/media` (`staticDir` di bawah).
 *  - Variabel `R2_*` terisi → Cloudflare R2, dan `staticDir` diabaikan.
 *
 *  Lihat `src/lib/penyimpanan.ts` dan README bagian "Penyimpanan berkas".
 *  URL publiknya tetap `/api/media/<berkas>` di kedua mode, jadi tautan yang
 *  sudah tersimpan di artikel tidak berubah saat berpindah penyimpanan. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Berkas', plural: 'Media' },
  admin: {
    group: 'Konten',
  },
  access: {
    read: () => true, // file (gambar/PDF) harus bisa dibaca publik untuk tampil di web
  },
  upload: {
    // Container Docker memakai folder sendiri (`MEDIA_DIR=media-docker` di
    // docker-compose.yml). Tanpa pemisahan ini, Docker membuat `media/` di host
    // sebagai titik mount milik root, dan `pnpm dev` di komputer langsung gagal
    // mengunggah dengan `EACCES` yang penyebabnya tidak jelas.
    staticDir: path.resolve(dirname, '../../', process.env.MEDIA_DIR || 'media'),
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
      admin: {
        description: 'Keterangan gambar untuk pembaca layar (aksesibilitas).',
      },
    },
  ],
}
