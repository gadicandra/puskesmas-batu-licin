'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { TAG } from '@/lib/konten/tags'
import { skemaDokter } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'doctors',
    skema: skemaDokter,
    pathRevalidate: ['/dashboard/dokter'],
    // TAG.layanan ikut: halaman /layanan/<slug> menampilkan "Tim Dokter", jadi
    // mengubah data dokter harus menyegarkannya juga.
    tagRevalidate: [TAG.dokter, TAG.layanan],
    // Tanpa ini foto atau poli yang sudah terisi tidak pernah bisa dilepas lagi.
    kosongkanJadiNull: ['foto', 'poli'],
    labelData: 'Dokter',
})

export const simpanDokter = aksi.simpan
export const hapusDokter = aksi.hapus
