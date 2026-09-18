/** Aturan isian jam pada jadwal posyandu.
 *
 *  Dipakai dua tempat, sama seperti `foto-posyandu.ts`: skema zod dashboard
 *  (supaya pesannya tampil di bawah isian jadwal) dan `validate` koleksi
 *  (penjaga sebenarnya — berlaku juga untuk REST dan Local API).
 *
 *  Kartu di situs merender "08:00 - 11:00" apa adanya. Jam mulai tanpa jam
 *  selesai, atau jam selesai yang lebih awal dari jam mulai, langsung terlihat
 *  salah oleh warga yang datang ke posyandu. */

export type BarisJadwalMentah = {
    jamMulai?: string | null
    jamSelesai?: string | null
}

/** Jam 24 jam, mis. "08:00". */
export const FORMAT_JAM = /^([01]\d|2[0-3]):[0-5]\d$/

function keMenit(jam: string): number {
    const [j, m] = jam.split(':').map(Number)
    return j * 60 + m
}

/**
 * Periksa seluruh baris jadwal. Mengembalikan pesan untuk baris PERTAMA yang
 * bermasalah (dengan nomor barisnya), atau `null` bila semuanya benar.
 * Baris tanpa jam sama sekali tetap sah — mis. hanya berisi catatan.
 */
export function periksaJadwalPosyandu(baris: BarisJadwalMentah[] | null | undefined): string | null {
    for (const [i, b] of (baris ?? []).entries()) {
        const ke = `Jadwal ke-${i + 1}`
        const mulai = b.jamMulai?.trim() || ''
        const selesai = b.jamSelesai?.trim() || ''

        for (const jam of [mulai, selesai]) {
            if (jam && !FORMAT_JAM.test(jam)) {
                return `${ke}: jam "${jam}" harus ditulis format 24 jam, mis. "08:00". Perbaiki atau kosongkan.`
            }
        }

        if (mulai && !selesai) {
            return `${ke}: jam mulai sudah diisi tapi jam selesai belum. Isi keduanya atau kosongkan keduanya.`
        }
        if (!mulai && selesai) {
            return `${ke}: jam selesai sudah diisi tapi jam mulai belum. Isi keduanya atau kosongkan keduanya.`
        }
        if (mulai && selesai && keMenit(selesai) <= keMenit(mulai)) {
            return `${ke}: jam selesai (${selesai}) harus lebih besar dari jam mulai (${mulai}). Perbaiki salah satunya.`
        }
    }
    return null
}
