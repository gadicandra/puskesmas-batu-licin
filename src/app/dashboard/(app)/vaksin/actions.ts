'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { skemaVaksin } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'vaccines',
    skema: skemaVaksin,
    pathRevalidate: ['/'],
    labelData: 'Vaksin',
})

export const simpanVaksin = aksi.simpan
export const hapusVaksin = aksi.hapus
