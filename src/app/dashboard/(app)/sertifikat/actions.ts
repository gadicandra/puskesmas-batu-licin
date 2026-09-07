'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { TAG } from '@/lib/konten/tags'
import { skemaSertifikat } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'certificates',
    skema: skemaSertifikat,
    pathRevalidate: ['/', '/akreditasi'],
    tagRevalidate: [TAG.sertifikat],
    labelData: 'Sertifikat',
})

export const simpanSertifikat = aksi.simpan
export const hapusSertifikat = aksi.hapus
