import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ringkasGambar, type GambarPublik } from './media'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type SimpulOrganisasi = {
    id: number
    jabatan: string
    /** `null` bila posisinya sedang lowong. */
    nama: string | null
    foto: GambarPublik | null
    /** Jabatan di bawahnya, sudah tersusun rekursif. */
    bawahan: SimpulOrganisasi[]
}

type BarisMentah = {
    id: number
    jabatan: string
    nama: string | null
    foto: GambarPublik | null
    idAtasan: number | null
    urutan: number
}

/**
 * Struktur organisasi sebagai pohon, siap dirender langsung secara rekursif.
 *
 * Penyusunan pohonnya dikerjakan di sini, bukan di UI. Data di database
 * berbentuk daftar rata dengan penunjuk `atasan`; mengubahnya jadi pohon
 * memerlukan penanganan simpul yatim dan perlindungan dari siklus — logika
 * yang tidak seharusnya diulang oleh setiap halaman yang menampilkannya.
 */
export const ambilStrukturOrganisasi = unstable_cache(
    async (): Promise<SimpulOrganisasi[]> => {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'org-chart',
            sort: ['urutan', 'jabatan'],
            depth: 1, // resolve relasi `foto`
            limit: 300,
            pagination: false,
        })

        const baris: BarisMentah[] = docs.map((d) => ({
            id: d.id,
            jabatan: d.jabatan,
            nama: d.nama?.trim() || null,
            foto: ringkasGambar(d.foto, `Foto ${d.nama || d.jabatan}`),
            idAtasan: typeof d.atasan === 'number' ? d.atasan : (d.atasan?.id ?? null),
            urutan: d.urutan ?? 0,
        }))

        const perId = new Map(baris.map((b) => [b.id, b]))
        const anak = new Map<number | null, BarisMentah[]>()
        for (const b of baris) {
            // Atasan yang sudah dihapus membuat simpulnya jadi yatim. Diangkat
            // ke akar supaya tetap tampil — hilang diam-diam jauh lebih buruk
            // daripada tampil di tempat yang kurang tepat.
            const kunci = b.idAtasan !== null && perId.has(b.idAtasan) ? b.idAtasan : null
            const daftar = anak.get(kunci) ?? []
            daftar.push(b)
            anak.set(kunci, daftar)
        }

        // `dikunjungi` menahan perulangan tak berujung bila ada siklus
        // (A atasan B, B atasan A) yang tidak dicegah oleh form.
        const dikunjungi = new Set<number>()
        const bangun = (idInduk: number | null): SimpulOrganisasi[] =>
            (anak.get(idInduk) ?? [])
                .filter((b) => !dikunjungi.has(b.id))
                .map((b) => {
                    dikunjungi.add(b.id)
                    return {
                        id: b.id,
                        jabatan: b.jabatan,
                        nama: b.nama,
                        foto: b.foto,
                        bawahan: bangun(b.id),
                    }
                })

        return bangun(null)
    },
    ['konten:struktur-organisasi'],
    { tags: [TAG.strukturOrganisasi], revalidate: UMUR_CACHE_DETIK },
)
