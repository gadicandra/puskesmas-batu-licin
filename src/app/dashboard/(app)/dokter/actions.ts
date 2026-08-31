'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { skemaDokter } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'doctors',
    skema: skemaDokter,
    pathRevalidate: ['/', '/layanan-kesehatan'],
    labelData: 'Dokter',
})

export const simpanDokter = aksi.simpan
export const hapusDokter = aksi.hapus
