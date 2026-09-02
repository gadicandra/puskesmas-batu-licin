// Unit kerja di bawah Puskesmas Batulicin. Dipakai untuk scoping akses admin unit
// dan penanda kepemilikan data pada koleksi (Doctors, Vaccines, dll).
export const unitOptions = [
    { label: 'Pemeriksaan Umum', value: 'umum' },
    { label: 'Gigi & Mulut', value: 'gigi' },
    { label: 'KIA & KB', value: 'kia-kb' },
    { label: 'Lansia', value: 'lansia' },
    { label: 'Gizi', value: 'gizi' },
    { label: 'Sanitasi', value: 'sanitasi' },
    { label: 'MTBS', value: 'mtbs' },
    { label: 'Laboratorium', value: 'lab' },
    { label: 'Farmasi', value: 'farmasi' },
    { label: 'IVA', value: 'iva' },
    { label: 'Promkes', value: 'promkes' },
    { label: 'UGD', value: 'ugd' },
    { label: 'Tata Usaha', value: 'tata-usaha' },
    { label: 'Keuangan', value: 'keuangan' },
] as const

export type UnitValue = (typeof unitOptions)[number]['value']

/** Ubah kode unit jadi label siap tampil. Mengembalikan `null` bila kosong, dan
 *  mengembalikan kodenya apa adanya bila tak dikenali — supaya data lama tetap
 *  tampil daripada hilang diam-diam saat daftar unit berubah. */
export function labelUnit(kode: string | null | undefined): string | null {
    if (!kode) return null
    return unitOptions.find((u) => u.value === kode)?.label ?? kode
}
