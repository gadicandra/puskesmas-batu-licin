/** Hari dalam seminggu, dipakai jadwal praktik dokter dan jadwal posyandu.
 *  Disimpan sebagai kode agar bisa diurutkan dan dibandingkan dengan hari ini —
 *  teks bebas seperti "Senin–Kamis" tidak bisa dipakai untuk itu. */
export const HARI = [
    { label: 'Senin', value: 'senin' },
    { label: 'Selasa', value: 'selasa' },
    { label: 'Rabu', value: 'rabu' },
    { label: 'Kamis', value: 'kamis' },
    { label: 'Jumat', value: 'jumat' },
    { label: 'Sabtu', value: 'sabtu' },
    { label: 'Minggu', value: 'minggu' },
] as const

export type KodeHari = (typeof HARI)[number]['value']

/** Urutan hari untuk pengurutan jadwal. Senin = 0. */
export const URUTAN_HARI: Record<string, number> = Object.fromEntries(
    HARI.map((h, i) => [h.value, i]),
)

export function labelHari(kode: string | null | undefined): string {
    if (!kode) return ''
    return HARI.find((h) => h.value === kode)?.label ?? kode
}

/** Kode hari untuk hari ini menurut waktu WITA (Asia/Makassar) — zona waktu
 *  Batulicin. Dipakai UI untuk menandai "praktik hari ini". */
export function hariIniWita(sekarang = new Date()): KodeHari {
    const wita = new Date(sekarang.getTime() + 8 * 60 * 60 * 1000)
    // getUTCDay: 0 = Minggu. HARI dimulai dari Senin.
    const indeks = (wita.getUTCDay() + 6) % 7
    return HARI[indeks].value
}
