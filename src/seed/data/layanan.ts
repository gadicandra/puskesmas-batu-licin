/** Katalog jenis pelayanan, mengikuti lampiran SK Kepala Puskesmas Batulicin
 *  No. B/445.61/003/PKM.Btl-Adm/I/2023 (`data/SK JENIS PELAYANAN PKM BTL.pdf`).
 *
 *  Berjenjang: `anak` menjadi sub-layanan dari induknya. Halaman daftar publik
 *  hanya menampilkan layanan tanpa induk; rinciannya muncul di halaman detail
 *  masing-masing.
 *
 *  `deskripsi` sengaja kosong — SK hanya menyebut nama layanan. Penjelasan untuk
 *  warga menyusul dari Puskesmas (butir C1 di docs/PROJECT_PLAN.md) dan diisi
 *  lewat /dashboard, bukan ditebak di sini. */

export type LayananSeed = {
    nama: string
    kategori: 'dalam-gedung' | 'luar-gedung' | 'posyandu'
    jadwal?: string
    anak?: LayananSeed[]
}

/** Jam pelayanan dalam gedung menurut SK. */
const JAM_DALAM = 'Senin–Kamis 08.00–11.00 · Jumat 07.30–10.30 · Sabtu 08.00–11.00'

export const LAYANAN: LayananSeed[] = [
    // ================= DALAM GEDUNG =================
    { nama: 'Pelayanan Pemeriksaan Umum', kategori: 'dalam-gedung', jadwal: JAM_DALAM },
    { nama: 'Pelayanan Kesehatan Gigi dan Mulut', kategori: 'dalam-gedung', jadwal: JAM_DALAM },
    {
        nama: 'Pelayanan KIA dan KB',
        kategori: 'dalam-gedung',
        jadwal: JAM_DALAM,
        anak: [
            { nama: 'Pemeriksaan calon pengantin', kategori: 'dalam-gedung' },
            { nama: 'Pemeriksaan ibu hamil', kategori: 'dalam-gedung' },
            { nama: 'Pemeriksaan ibu nifas', kategori: 'dalam-gedung' },
        ],
    },
    { nama: 'Pelayanan Kesehatan Lansia', kategori: 'dalam-gedung', jadwal: JAM_DALAM },
    { nama: 'Pelayanan Konsultasi Gizi', kategori: 'dalam-gedung', jadwal: JAM_DALAM },
    { nama: 'Pelayanan Konsultasi Sanitasi', kategori: 'dalam-gedung', jadwal: JAM_DALAM },
    { nama: 'Pelayanan MTBS', kategori: 'dalam-gedung', jadwal: JAM_DALAM },
    {
        nama: 'Laboratorium',
        kategori: 'dalam-gedung',
        jadwal: JAM_DALAM,
        anak: [
            {
                nama: 'Pemeriksaan Hematologi',
                kategori: 'dalam-gedung',
                anak: [
                    {
                        nama: 'Darah Lengkap (Hb, Leukosit, LED, Diffcount, Eritrosit, Hematokrit dan Trombosit)',
                        kategori: 'dalam-gedung',
                    },
                    { nama: 'Golongan Darah', kategori: 'dalam-gedung' },
                ],
            },
            {
                nama: 'Pemeriksaan Serologi',
                kategori: 'dalam-gedung',
                anak: [
                    { nama: 'Widal Test', kategori: 'dalam-gedung' },
                    { nama: 'HIV Rapid Test', kategori: 'dalam-gedung' },
                    { nama: 'HbsAg Rapid Test', kategori: 'dalam-gedung' },
                    { nama: 'Syphilis Rapid Test', kategori: 'dalam-gedung' },
                    { nama: 'Dengue, NS1', kategori: 'dalam-gedung' },
                ],
            },
            {
                nama: 'Kimia Darah',
                kategori: 'dalam-gedung',
                anak: [
                    { nama: 'Gula Darah', kategori: 'dalam-gedung' },
                    { nama: 'Asam Urat', kategori: 'dalam-gedung' },
                    { nama: 'Kolesterol', kategori: 'dalam-gedung' },
                ],
            },
            {
                nama: 'Urinalisa',
                kategori: 'dalam-gedung',
                anak: [
                    { nama: 'Test Kehamilan', kategori: 'dalam-gedung' },
                    { nama: 'Protein Urine', kategori: 'dalam-gedung' },
                    { nama: 'Reduksi Urine', kategori: 'dalam-gedung' },
                ],
            },
            {
                nama: 'Pemeriksaan Bakteriologi dan Parasitologi',
                kategori: 'dalam-gedung',
                anak: [
                    { nama: 'BTA', kategori: 'dalam-gedung' },
                    { nama: 'Kusta', kategori: 'dalam-gedung' },
                    { nama: 'Malaria', kategori: 'dalam-gedung' },
                ],
            },
        ],
    },
    {
        nama: 'Pemeriksaan IVA (Pemeriksaan Kanker Rahim)',
        kategori: 'dalam-gedung',
        jadwal: JAM_DALAM,
    },
    { nama: 'Pelayanan Farmasi', kategori: 'dalam-gedung', jadwal: JAM_DALAM },
    {
        nama: 'KIER Kesehatan',
        kategori: 'dalam-gedung',
        jadwal: JAM_DALAM,
        anak: [
            { nama: 'Kier Sehat', kategori: 'dalam-gedung' },
            { nama: 'Kier Sehat Calon Pengantin/Imunisasi', kategori: 'dalam-gedung' },
            { nama: 'Kier Sehat Calon Jemaah Haji', kategori: 'dalam-gedung' },
            { nama: 'Kier Sehat CPNS/PNS', kategori: 'dalam-gedung' },
            { nama: 'Kier Sehat Tidak Buta Warna', kategori: 'dalam-gedung' },
            { nama: 'Keterangan Kematian', kategori: 'dalam-gedung' },
            { nama: 'Keterangan Sakit', kategori: 'dalam-gedung' },
            { nama: 'Keterangan Rujukan Dokter', kategori: 'dalam-gedung' },
            { nama: 'Keterangan Visum et Repertum', kategori: 'dalam-gedung' },
        ],
    },
    { nama: 'Pelayanan Ruang Promkes', kategori: 'dalam-gedung', jadwal: JAM_DALAM },
    { nama: 'Pelayanan Ruang Keuangan', kategori: 'dalam-gedung' },
    { nama: 'Pelayanan Ruang Tata Usaha', kategori: 'dalam-gedung' },

    // Tabel terpisah di SK: 24 jam, Senin s/d Minggu.
    { nama: 'Pelayanan UGD', kategori: 'dalam-gedung', jadwal: 'Senin–Minggu, 24 jam' },
    { nama: 'Pelayanan UGD Kebidanan', kategori: 'dalam-gedung', jadwal: 'Senin–Minggu, 24 jam' },

    // ================= LUAR GEDUNG =================
    {
        nama: 'UKM Esensial',
        kategori: 'luar-gedung',
        anak: [
            {
                nama: 'Pelayanan KIA-KB',
                kategori: 'luar-gedung',
                anak: [
                    { nama: 'Posyandu Balita', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                    { nama: 'Kelas Ibu Balita', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                    { nama: 'Kelas Ibu Hamil', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                    { nama: 'Kunjungan Bumil KEK', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                    {
                        nama: 'Autopsi verbal kematian ibu/bayi',
                        kategori: 'luar-gedung',
                        jadwal: 'Jika ada kasus',
                    },
                    {
                        nama: 'Audit kematian Ibu/Bayi',
                        kategori: 'luar-gedung',
                        jadwal: 'Jika ada kasus',
                    },
                    { nama: 'SDIDTK', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                ],
            },
            {
                nama: 'Pelayanan Kesehatan Lingkungan',
                kategori: 'luar-gedung',
                anak: [
                    {
                        nama: 'Pembinaan/Supervisi fasilitatif RB dan BPS',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                    {
                        nama: 'Penyuluhan dan pemeriksaan keamanan pangan',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                    {
                        nama: 'Penyehatan Sarana Air Bersih dan Air Minum',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                    {
                        nama: 'Pengawasan Sanitasi Tempat Fasilitas Umum (TFU)',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                    {
                        nama: 'Pengawasan Sanitasi Tempat Pengolahan Pangan (TPP)',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                    { nama: 'Pengendalian Vektor', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                    { nama: 'STBM', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                ],
            },
            {
                nama: 'Pelayanan Pencegahan dan Pengendalian Penyakit',
                kategori: 'luar-gedung',
                anak: [
                    { nama: 'Kecacingan', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                    {
                        nama: 'Penemuan Terduga TBC dan Kunjungan Rumah TBC',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                    { nama: 'Imunisasi', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                    { nama: 'Kunjungan rumah ODGJ', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                ],
            },
            {
                nama: 'Pelayanan Promosi Kesehatan dan Perkesmas',
                kategori: 'luar-gedung',
                anak: [
                    { nama: 'PHN', kategori: 'luar-gedung', jadwal: 'Sesuai Kasus' },
                    { nama: 'Skrining kesehatan', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                    {
                        nama: 'Penyuluhan Dalam Gedung dan Luar Gedung',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                ],
            },
            {
                nama: 'Pelayanan Gizi',
                kategori: 'luar-gedung',
                anak: [
                    { nama: 'Gizi Masyarakat', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
                ],
            },
            {
                nama: 'Pelayanan Kesehatan Keluarga',
                kategori: 'luar-gedung',
                anak: [
                    {
                        nama: 'Posyandu Lansia (Kesga)',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                    {
                        nama: 'Kesehatan Usia Produktif',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                    {
                        nama: 'Posbindu PTM',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai jadwal setiap desa',
                    },
                    {
                        nama: 'Penyuluhan dan pembinaan TOGA',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                    {
                        nama: 'Kesehatan dan Keselamatan Kerja serta Kesorga',
                        kategori: 'luar-gedung',
                        jadwal: 'Sesuai Jadwal',
                    },
                ],
            },
        ],
    },
    {
        nama: 'UKM Pengembangan',
        kategori: 'luar-gedung',
        anak: [
            { nama: 'Kesehatan Jiwa', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
            { nama: 'Kesehatan Kerja', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
        ],
    },
    {
        nama: 'Program Peningkatan Mutu Puskesmas',
        kategori: 'luar-gedung',
        anak: [
            {
                nama: 'Keselamatan, Kesehatan, Kerja (K3)',
                kategori: 'luar-gedung',
                jadwal: 'Sesuai Jadwal',
            },
            { nama: 'Keselamatan Pasien', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
            {
                nama: 'Pencegahan dan Pengendalian Infeksi',
                kategori: 'luar-gedung',
                jadwal: 'Sesuai Jadwal',
            },
            { nama: 'Manajemen Risiko', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
            { nama: 'Audit Internal', kategori: 'luar-gedung', jadwal: 'Sesuai Jadwal' },
            {
                nama: 'Mutu KMP, Mutu UKM dan Mutu UKPP',
                kategori: 'luar-gedung',
                jadwal: 'Sesuai Jadwal',
            },
        ],
    },
]
