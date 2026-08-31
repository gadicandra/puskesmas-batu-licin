'use server'

import { buatAksiCrud } from '@/lib/dashboard/crud'
import { skemaTenagaMedis } from '@/lib/dashboard/validation'

const aksi = buatAksiCrud({
    collection: 'medical-staff',
    skema: skemaTenagaMedis,
    pathRevalidate: ['/'],
    labelData: 'Tenaga Medis',
})

export const simpanTenagaMedis = aksi.simpan
export const hapusTenagaMedis = aksi.hapus
