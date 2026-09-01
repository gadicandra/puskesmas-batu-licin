'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { TAG } from '@/lib/konten/tags'
import { skemaTenagaMedis } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'medical-staff',
    skema: skemaTenagaMedis,
    pathRevalidate: ['/'],
    tagRevalidate: [TAG.nakes],
    labelData: 'Tenaga Medis',
})

export const simpanTenagaMedis = aksi.simpan
export const hapusTenagaMedis = aksi.hapus
