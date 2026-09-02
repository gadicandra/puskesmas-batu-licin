'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { TAG } from '@/lib/konten/tags'
import { skemaDokter } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'doctors',
    skema: skemaDokter,
    pathRevalidate: ['/', '/layanan-kesehatan'],
    tagRevalidate: [TAG.dokter],
    labelData: 'Dokter',
})

export const simpanDokter = aksi.simpan
export const hapusDokter = aksi.hapus
