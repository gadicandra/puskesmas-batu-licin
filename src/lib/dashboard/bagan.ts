/**
 * Perhitungan bagan organisasi — dipakai halaman dashboard Struktur Organisasi.
 *
 * Semuanya fungsi murni tanpa impor apa pun, jadi bisa dipanggil dari Server
 * Component maupun komponen klien. Itu yang membuat penjelajahan per klaster
 * bisa berjalan seketika di browser tanpa memuat ulang halaman.
 */

export type SimpulBagan = {
    id: number
    jabatan: string
    nama?: string | null
    atasan?: number | { id: number } | null
    urutan?: number | null
}

/** Relasi Payload bisa berupa angka (depth 0) atau objek dokumen (depth ≥ 1). */
export function idAtasan(v: SimpulBagan['atasan']): number | null {
    if (v === null || v === undefined) return null
    return typeof v === 'object' ? v.id : v
}

/** Peta atasan → daftar bawahannya, sudah terurut. Atasan yang barisnya sudah
 *  terhapus diperlakukan sebagai puncak, supaya jabatannya tidak hilang dari
 *  tabel tanpa penjelasan. */
function petaAnak(docs: SimpulBagan[]): Map<number | null, SimpulBagan[]> {
    const ada = new Set(docs.map((d) => d.id))
    const peta = new Map<number | null, SimpulBagan[]>()
    for (const d of docs) {
        const kunci = idAtasan(d.atasan)
        const induk = kunci !== null && ada.has(kunci) ? kunci : null
        peta.set(induk, [...(peta.get(induk) ?? []), d])
    }
    for (const daftar of peta.values()) {
        daftar.sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0) || a.jabatan.localeCompare(b.jabatan))
    }
    return peta
}

export function punyaBawahan(docs: SimpulBagan[], id: number): boolean {
    return docs.some((d) => idAtasan(d.atasan) === id)
}

/** Jumlah jabatan di bawah sebuah simpul, sampai ke tingkat terdalam. */
export function jumlahKeturunan(docs: SimpulBagan[], id: number): number {
    const peta = petaAnak(docs)
    let total = 0
    const telusuri = (induk: number) => {
        for (const anak of peta.get(induk) ?? []) {
            total++
            telusuri(anak.id)
        }
    }
    telusuri(id)
    return total
}

/** Rantai jabatan dari puncak sampai `id` — bahan remah roti (breadcrumb). */
export function jalurKe(docs: SimpulBagan[], id: number): SimpulBagan[] {
    const perId = new Map(docs.map((d) => [d.id, d]))
    const jalur: SimpulBagan[] = []
    let kini = perId.get(id)
    // Batas panjang jalur = jumlah data: penjaga terhadap data atasan yang
    // melingkar (A atasan B, B atasan A), yang tanpa ini menggantung selamanya.
    while (kini && jalur.length <= docs.length) {
        jalur.unshift(kini)
        const induk = idAtasan(kini.atasan)
        kini = induk === null ? undefined : perId.get(induk)
    }
    return jalur
}

/**
 * Urutkan bagan seperti orang membacanya: atasan lebih dulu, lalu setiap
 * bawahannya langsung di bawahnya. Tabel yang diurutkan abjad memaksa staf
 * merangkai sendiri hierarkinya di kepala.
 *
 * `akar` membatasi hasilnya pada satu simpul beserta seluruh keturunannya —
 * inilah yang dipakai saat sebuah klaster dibuka. `null` berarti seluruh bagan.
 *
 * `sudahDipakai` menjaga dari data yang menunjuk atasan melingkar; tanpa itu
 * halamannya menggantung tanpa pesan galat.
 */
export function urutkanBagan(
    docs: SimpulBagan[],
    akar: number | null = null,
): { doc: SimpulBagan; tingkat: number }[] {
    const peta = petaAnak(docs)
    const hasil: { doc: SimpulBagan; tingkat: number }[] = []
    const sudahDipakai = new Set<number>()

    const telusuri = (induk: number | null, tingkat: number) => {
        for (const d of peta.get(induk) ?? []) {
            if (sudahDipakai.has(d.id)) continue
            sudahDipakai.add(d.id)
            hasil.push({ doc: d, tingkat })
            telusuri(d.id, tingkat + 1)
        }
    }

    if (akar === null) {
        telusuri(null, 0)
        // Simpul yatim yang tidak terjangkau dari puncak tetap ditampilkan.
        for (const d of docs) if (!sudahDipakai.has(d.id)) hasil.push({ doc: d, tingkat: 0 })
        return hasil
    }

    const simpul = docs.find((d) => d.id === akar)
    if (!simpul) return urutkanBagan(docs, null)
    sudahDipakai.add(simpul.id)
    hasil.push({ doc: simpul, tingkat: 0 })
    telusuri(simpul.id, 1)
    return hasil
}

/** Teks kolom "Jabatan" beserta indentasinya.
 *
 *  Spasinya spasi-tanpa-putus karena HTML memampatkan spasi biasa jadi satu,
 *  dan "└" dipakai sebagai ganti padding: kolom tabel tidak bisa diberi padding
 *  berbeda per baris tanpa mengubah komponen tabelnya. */
export function labelBertingkat(jabatan: string, tingkat: number): string {
    return tingkat === 0 ? jabatan : `${'\u00a0'.repeat(tingkat * 3)}└ ${jabatan}`
}
