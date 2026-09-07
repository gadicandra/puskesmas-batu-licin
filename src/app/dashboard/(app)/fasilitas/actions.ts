'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { TAG } from '@/lib/konten/tags'
import { skemaFasilitas } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'facilities',
    skema: skemaFasilitas,
    // Hanya halaman dashboard-nya. Rute situs publik sengaja tidak disebut:
    // halaman publiknya digarap di branch lain, dan tag di bawah sudah cukup
    // membuat halaman itu ikut tersegar begitu ada.
    pathRevalidate: ['/dashboard/fasilitas'],
    tagRevalidate: [TAG.fasilitas],
    kosongkanJadiNull: ['foto', 'jumlah', 'deskripsi'],
    labelData: 'Fasilitas',
})

export const simpanFasilitas = aksi.simpan
export const hapusFasilitas = aksi.hapus
