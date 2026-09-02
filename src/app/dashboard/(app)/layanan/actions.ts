'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { TAG } from '@/lib/konten/tags'
import { skemaLayanan } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'services',
    skema: skemaLayanan,
    // Posyandu ikut menampilkan nama layanan, jadi tag-nya ikut dibuang.
    // Rute situs publik tidak disebut — digarap di branch lain; tag sudah cukup.
    pathRevalidate: ['/dashboard/layanan'],
    tagRevalidate: [TAG.layanan, TAG.posyandu],
    kosongkanJadiNull: ['induk', 'jadwal', 'deskripsi'],
    labelData: 'Layanan',
})

export const simpanLayanan = aksi.simpan
export const hapusLayanan = aksi.hapus
