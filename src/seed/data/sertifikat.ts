/** Penghargaan yang diterima UPTD Puskesmas Batulicin.
 *  Sumber: foto piagam di `data/Sertifikat/`.
 *
 *  Semuanya tahun 2025 di lingkup Dinas Kesehatan Kabupaten Tanah Bumbu,
 *  ditandatangani Hj. Narni, S.K.M., M.Kes (Kepala Dinas Kesehatan).
 *
 *  `berkas` WAJIB diisi di koleksi `certificates`, tapi seed tidak mengunggah
 *  gambarnya: berkas foto perlu masuk ke Galeri Gambar lebih dulu lewat
 *  /dashboard/media, baru ditautkan di form Sertifikat. Karena itu seed ini
 *  hanya dipakai bila unggahannya disiapkan terpisah — lihat catatan di
 *  src/seed/index.ts. */

export type SertifikatSeed = {
    judul: string
    jenis: 'akreditasi' | 'penghargaan'
    penerbit: string
    /** ISO 8601. Hanya piagam Pandu PTM yang mencantumkan tanggal persisnya. */
    tanggal: string
    keterangan?: string
    /** Nama berkas di `data/Sertifikat/` — penghubung ke fotonya. */
    berkasSumber: string
}

const DINKES = 'Dinas Kesehatan Kabupaten Tanah Bumbu'

export const SERTIFIKAT: SertifikatSeed[] = [
    {
        judul: 'Terbaik I — Pelayanan Kesehatan pada Usia Produktif',
        jenis: 'penghargaan',
        penerbit: DINKES,
        tanggal: '2025-01-01',
        berkasSumber: 'PHOTO-2025-12-15-15-07-23.jpg',
    },
    {
        judul: 'Terbaik I — Pelayanan Kesehatan Penderita Hipertensi',
        jenis: 'penghargaan',
        penerbit: DINKES,
        tanggal: '2025-01-01',
        berkasSumber: 'PHOTO-2025-12-15-15-07-23 (1).jpg',
    },
    {
        judul: 'Terbaik I — Capaian Cek Kesehatan Gratis (CKG)',
        jenis: 'penghargaan',
        penerbit: DINKES,
        tanggal: '2025-01-01',
        berkasSumber: 'PHOTO-2025-12-15-15-07-23 (2).jpg',
    },
    {
        judul: 'Terbaik I — Puskesmas Pandu PTM Tingkat Kabupaten Tanah Bumbu',
        jenis: 'penghargaan',
        penerbit: DINKES,
        tanggal: '2025-12-12',
        keterangan:
            'Dalam rangka Hari Kesehatan Nasional (HKN) ke-61 Tahun 2025, "Generasi Sehat, Masa Depan Hebat". Diserahkan di Batulicin, 12 Desember 2025.',
        berkasSumber: 'PHOTO-2025-12-15-15-07-23 (3).jpg',
    },
    {
        judul: 'Terbaik I — Pelayanan Kesehatan pada Usia Lanjut',
        jenis: 'penghargaan',
        penerbit: DINKES,
        tanggal: '2025-01-01',
        berkasSumber: 'PHOTO-2025-12-15-15-07-23 (4).jpg',
    },
    {
        judul: 'Juara Pertama — Lomba Mutu Terbaik Puskesmas Tingkat Kabupaten Tanah Bumbu',
        jenis: 'penghargaan',
        penerbit: DINKES,
        tanggal: '2025-01-01',
        berkasSumber: 'PHOTO-2025-12-15-15-07-23 (5).jpg',
    },
    {
        judul: 'Terbaik III — Penerapan Rekam Medis Elektronik (RME)',
        jenis: 'penghargaan',
        penerbit: DINKES,
        tanggal: '2025-01-01',
        berkasSumber: 'PHOTO-2025-12-15-15-07-23 (6).jpg',
    },
    {
        judul: 'Terbaik I — Inputan ASIK Tertinggi Imunisasi HPV',
        jenis: 'penghargaan',
        penerbit: DINKES,
        tanggal: '2025-01-01',
        berkasSumber: 'PHOTO-2025-12-15-15-07-23 (7).jpg',
    },
    {
        judul: 'Terbaik III — Indeks Pelayanan Publik (IPP)',
        jenis: 'penghargaan',
        penerbit: DINKES,
        tanggal: '2025-01-01',
        berkasSumber: 'PHOTO-2025-12-15-15-07-23 (8).jpg',
    },
]
