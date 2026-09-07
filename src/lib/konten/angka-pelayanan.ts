import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type KelompokAngka = 'umur' | 'asuransi' | 'poli' | 'status-pulang'

export const LABEL_KELOMPOK: Record<KelompokAngka, string> = {
    umur: 'Menurut Kelompok Umur',
    asuransi: 'Menurut Jaminan Kesehatan',
    poli: 'Menurut Poli/Klaster',
    'status-pulang': 'Menurut Status Pulang',
}

export type BarisAngka = {
    label: string
    jumlah: number
    /** Porsi terhadap total kelompoknya, 0–100, dibulatkan 2 desimal.
     *  Dihitung di sini supaya setiap grafik memakai pembulatan yang sama. */
    persen: number
}

export type KelompokAngkaPelayanan = {
    kelompok: KelompokAngka
    label: string
    total: number
    baris: BarisAngka[]
}

export type AngkaPelayanan = {
    periode: string
    /** Total kunjungan pada periode ini. */
    total: number
    sumber: string | null
    kelompok: KelompokAngkaPelayanan[]
}

/**
 * Angka kunjungan pasien pada satu periode, sudah dikelompokkan dan dihitung
 * persentasenya — siap dipakai membuat grafik.
 *
 * Tanpa argumen: periode terbaru. Kembalikan `null` bila belum ada datanya.
 *
 * Jangan dikacaukan dengan `src/lib/dashboard/statistik.ts` — itu statistik
 * kunjungan WEBSITE. Yang ini kunjungan PASIEN, disalin dari e-Puskesmas.
 */
export function ambilAngkaPelayanan(periode?: string): Promise<AngkaPelayanan | null> {
    return unstable_cache(
        async (): Promise<AngkaPelayanan | null> => {
            const payload = await getPayload({ config })
            const { docs } = await payload.find({
                collection: 'service-statistics',
                where: periode ? { periode: { equals: periode } } : {},
                sort: ['-periode', 'urutan'],
                depth: 0,
                limit: 500,
                pagination: false,
            })
            if (docs.length === 0) return null

            // Tanpa `periode`, ambil yang terbaru saja — mencampur dua tahun
            // dalam satu grafik akan menggandakan angkanya.
            const dipakai = periode ?? (docs[0] as { periode: string }).periode
            const baris = (docs as unknown as {
                periode: string
                kelompok: KelompokAngka
                label: string
                jumlah: number
                sumber?: string | null
            }[]).filter((d) => d.periode === dipakai)

            const urutanKelompok: KelompokAngka[] = ['umur', 'asuransi', 'poli', 'status-pulang']
            const kelompok = urutanKelompok
                .map((k) => {
                    const isi = baris.filter((b) => b.kelompok === k)
                    const total = isi.reduce((t, b) => t + b.jumlah, 0)
                    return {
                        kelompok: k,
                        label: LABEL_KELOMPOK[k],
                        total,
                        baris: isi.map((b) => ({
                            label: b.label,
                            jumlah: b.jumlah,
                            persen: total > 0 ? Math.round((b.jumlah / total) * 10000) / 100 : 0,
                        })),
                    }
                })
                .filter((k) => k.baris.length > 0)

            return {
                periode: dipakai,
                // Tiap kelompok memecah kunjungan yang sama, jadi totalnya
                // diambil dari salah satu kelompok — bukan dijumlahkan semua.
                total: kelompok[0]?.total ?? 0,
                sumber: baris.find((b) => b.sumber)?.sumber ?? null,
                kelompok,
            }
        },
        ['konten:angka-pelayanan', periode ?? 'terbaru'],
        { tags: [TAG.angkaPelayanan], revalidate: UMUR_CACHE_DETIK },
    )()
}
