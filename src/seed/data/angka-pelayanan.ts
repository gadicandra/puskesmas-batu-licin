/** Angka kunjungan pasien yang dilayani sepanjang 2025.
 *  Sumber: `data/DataAngkaYangTerlayani .jpeg` — tangkapan layar e-Puskesmas
 *  (tanahbumbu.epuskesmas.id), diakses 31 Januari 2026.
 *
 *  Keempat pengelompokan menjumlah ke angka yang sama, 16.688 kunjungan —
 *  dipakai sebagai pemeriksaan silang bahwa tidak ada baris yang terlewat saat
 *  disalin dari gambar. */

export const PERIODE = '2025'
export const SUMBER = 'e-Puskesmas Kabupaten Tanah Bumbu, diakses 31 Januari 2026'

/** Total kunjungan; keempat kelompok di bawah harus menjumlah ke angka ini. */
export const TOTAL_KUNJUNGAN = 16688

type BarisAngka = {
    kelompok: 'umur' | 'asuransi' | 'poli' | 'status-pulang'
    label: string
    jumlah: number
}

export const ANGKA_PELAYANAN: BarisAngka[] = [
    // --- Menurut kelompok umur ---
    { kelompok: 'umur', label: 'Balita (0-5 Tahun)', jumlah: 1647 },
    { kelompok: 'umur', label: 'Kanak-Kanak (6-11 Tahun)', jumlah: 1930 },
    { kelompok: 'umur', label: 'Remaja-Awal (12-16 Tahun)', jumlah: 941 },
    { kelompok: 'umur', label: 'Remaja-Akhir (17-25 Tahun)', jumlah: 2717 },
    { kelompok: 'umur', label: 'Dewasa-Awal (26-35 Tahun)', jumlah: 3015 },
    { kelompok: 'umur', label: 'Dewasa-Akhir (36-45 Tahun)', jumlah: 2524 },
    { kelompok: 'umur', label: 'Lansia-Awal (46-55 Tahun)', jumlah: 1919 },
    { kelompok: 'umur', label: 'Lansia-Akhir (56-65 Tahun)', jumlah: 1181 },
    { kelompok: 'umur', label: 'Manula (> 65 Tahun)', jumlah: 814 },

    // --- Menurut jaminan/asuransi ---
    { kelompok: 'asuransi', label: 'Umum', jumlah: 2989 },
    { kelompok: 'asuransi', label: 'BPJS Kesehatan', jumlah: 13546 },
    { kelompok: 'asuransi', label: 'Pemerintah Daerah Kota', jumlah: 153 },

    // --- Menurut poli/klaster ---
    { kelompok: 'poli', label: 'Gawat Darurat', jumlah: 8 },
    { kelompok: 'poli', label: 'Gigi', jumlah: 1724 },
    { kelompok: 'poli', label: 'Gizi', jumlah: 5 },
    { kelompok: 'poli', label: 'Kesehatan Reproduksi', jumlah: 1062 },
    { kelompok: 'poli', label: 'Klaster 2 (Ibu dan Anak)', jumlah: 5258 },
    { kelompok: 'poli', label: 'Klaster 3 Dewasa', jumlah: 7336 },
    { kelompok: 'poli', label: 'Klaster 3 Lansia', jumlah: 1295 },

    // --- Menurut status pulang ---
    { kelompok: 'status-pulang', label: 'Berobat Jalan', jumlah: 14106 },
    { kelompok: 'status-pulang', label: 'Rujuk Lanjut', jumlah: 1904 },
    { kelompok: 'status-pulang', label: 'Batal Berobat', jumlah: 309 },
    { kelompok: 'status-pulang', label: 'Rujuk Internal', jumlah: 245 },
    { kelompok: 'status-pulang', label: 'Belum Selesai', jumlah: 124 },
]
