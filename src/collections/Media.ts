import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** Berkas unggahan (gambar & PDF). Disimpan di disk lokal `<project>/media`.
 *  CATATAN PRODUKSI: disk lokal tidak persist di container — perlu storage
 *  adapter (S3/R2) sebelum go-live. */
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
    staticDir: path.resolve(dirname, '../../media'), // <project>/media
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
