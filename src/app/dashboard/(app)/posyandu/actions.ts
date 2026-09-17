'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { buatAksiCrud, type FormState } from '@/lib/dashboard/crud'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import { TAG } from '@/lib/konten/tags'
import { skemaPosyandu } from '@/lib/dashboard/validation'
import { periksaFotoPosyandu } from '@/lib/foto-posyandu'

const aksi = buatAksiCrud({
    collection: 'posyandu',
    skema: skemaPosyandu,
    pathRevalidate: ['/dashboard/posyandu'],
    tagRevalidate: [TAG.posyandu],
    // Tanpa ini foto atau isian teks yang sudah terisi tidak pernah bisa dilepas lagi.
    kosongkanJadiNull: ['deskripsi', 'foto', 'desa', 'alamat', 'penanggungJawab', 'kontak'],
    labelData: 'Posyandu',
})

/** Foto diperiksa di sini lebih dulu, walaupun koleksi juga memeriksanya.
 *  Penolakan dari koleksi datang sebagai ValidationError yang oleh `pesanError`
 *  diringkas jadi "Ada isian yang belum benar" — staf tidak akan tahu bahwa
 *  masalahnya berkas PDF yang terpilih sebagai foto. */
export async function simpanPosyandu(prev: FormState, formData: FormData): Promise<FormState> {
    await requireSuperAdmin()

    const foto = formData.get('foto')
    if (foto) {
        const payload = await getPayload({ config })
        const salah = await periksaFotoPosyandu(payload, foto)
        if (salah) return { fieldErrors: { foto: salah } }
    }

    return aksi.simpan(prev, formData)
}

export const hapusPosyandu = aksi.hapus
