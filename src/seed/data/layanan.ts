/** Katalog jenis pelayanan.
 *
 *  Sumber: SK Kepala Puskesmas Batulicin No. B/445.61/003/PKM.Btl-Adm/I/2023
 *  (`public/SK JENIS PELAYANAN PKM BTL.pdf`), dicerminkan juga di CLAUDE.md
 *  bagian "Domain facts".
 *
 *  `deskripsi` dan `persyaratan` sengaja DIKOSONGKAN: SK hanya menyebut nama
 *  layanannya. Isinya menyusul dari Puskesmas (butir C1 di
 *  docs/PROJECT_PLAN.md) dan diisi lewat /dashboard, bukan ditebak di sini. */

type LayananSeed = {
    nama: string
    kategori: 'dalam-gedung' | 'luar-gedung' | 'posyandu'
}

export const LAYANAN: LayananSeed[] = [
    // --- Dalam gedung ---
    { nama: 'Pemeriksaan Umum', kategori: 'dalam-gedung' },
    { nama: 'Kesehatan Gigi & Mulut', kategori: 'dalam-gedung' },
    { nama: 'KIA & KB', kategori: 'dalam-gedung' },
    { nama: 'Kesehatan Lansia', kategori: 'dalam-gedung' },
    { nama: 'Konsultasi Gizi', kategori: 'dalam-gedung' },
    { nama: 'Konsultasi Sanitasi', kategori: 'dalam-gedung' },
    { nama: 'MTBS', kategori: 'dalam-gedung' },
    { nama: 'Laboratorium', kategori: 'dalam-gedung' },
    { nama: 'Pemeriksaan IVA', kategori: 'dalam-gedung' },
    { nama: 'Farmasi', kategori: 'dalam-gedung' },
    { nama: 'KIER Kesehatan', kategori: 'dalam-gedung' },
    { nama: 'Promosi Kesehatan', kategori: 'dalam-gedung' },
    { nama: 'Keuangan', kategori: 'dalam-gedung' },
    { nama: 'Tata Usaha', kategori: 'dalam-gedung' },

    // --- Luar gedung (UKM) ---
    { nama: 'UKM Esensial — KIA & KB', kategori: 'luar-gedung' },
    { nama: 'UKM Esensial — Kesehatan Lingkungan', kategori: 'luar-gedung' },
    { nama: 'UKM Esensial — P2P (Pencegahan & Pengendalian Penyakit)', kategori: 'luar-gedung' },
    { nama: 'UKM Esensial — Promosi Kesehatan', kategori: 'luar-gedung' },
    { nama: 'UKM Esensial — Gizi', kategori: 'luar-gedung' },
    { nama: 'UKM Esensial — Kesehatan Keluarga', kategori: 'luar-gedung' },
    { nama: 'UKM Pengembangan — Kesehatan Jiwa', kategori: 'luar-gedung' },
    { nama: 'UKM Pengembangan — Kesehatan Kerja', kategori: 'luar-gedung' },
]
