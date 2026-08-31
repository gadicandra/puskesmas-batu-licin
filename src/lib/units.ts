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
