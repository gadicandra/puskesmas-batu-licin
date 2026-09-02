'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { TAG } from '@/lib/konten/tags'
import { skemaPosyandu } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'posyandu',
    skema: skemaPosyandu,
    pathRevalidate: ['/dashboard/posyandu'],
    tagRevalidate: [TAG.posyandu],
    kosongkanJadiNull: ['alamat', 'penanggungJawab', 'kontak'],
    labelData: 'Posyandu',
})

export const simpanPosyandu = aksi.simpan
export const hapusPosyandu = aksi.hapus
