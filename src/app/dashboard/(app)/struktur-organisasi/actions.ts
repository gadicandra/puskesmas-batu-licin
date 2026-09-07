'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { TAG } from '@/lib/konten/tags'
import { skemaJabatan } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'org-chart',
    skema: skemaJabatan,
    // Rute situs publik tidak disebut — digarap di branch lain; tag sudah cukup.
    pathRevalidate: ['/dashboard/struktur-organisasi'],
    tagRevalidate: [TAG.strukturOrganisasi],
    kosongkanJadiNull: ['nama', 'foto', 'atasan'],
    labelData: 'Jabatan',
})

export const simpanJabatan = aksi.simpan
export const hapusJabatan = aksi.hapus
