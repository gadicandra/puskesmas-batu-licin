/** Struktur organisasi UPTD Puskesmas Batulicin.
 *  Sumber: `data/StrukturOrganisasiMaster.png`, berdasarkan SK Kepala Dinas
 *  Kesehatan Kabupaten Tanah Bumbu No. B/400.7.2.3/0381/DINKES-YANKES/IV/2025
 *  tanggal 28 April 2025.
 *
 *  Nama pada bagan ditulis singkat (mis. "Isman S, S.Kep, Ns, M.M"). Di sini
 *  dipakai nama lengkap dari `data/Data Nakes.xlsx` bila orangnya cocok, supaya
 *  satu orang tidak muncul dengan dua ejaan berbeda di situs. Yang tidak ada di
 *  daftar nakes ditulis apa adanya sesuai bagan dan ditandai di komentar. */

export type SimpulSeed = {
    jabatan: string
    nama: string | null
    anak?: SimpulSeed[]
}

export const STRUKTUR: SimpulSeed[] = [
    {
        jabatan: 'Kepala Puskesmas',
        nama: 'dr. Laurensius Lungan, M.H',
        anak: [
            {
                jabatan: 'Klaster Manajemen',
                nama: 'Isman Santoso, S.Kep., Ns., M.M',
                anak: [
                    { jabatan: 'Manajemen Inti', nama: 'Isman Santoso, S.Kep., Ns., M.M' },
                    { jabatan: 'Sarana & Prasarana', nama: 'Syaiful Fahrin, S.Kep., Ns' },
                    { jabatan: 'Mutu', nama: 'dr. Mardalena' },
                    { jabatan: 'Jejaring', nama: 'dr. Andri Wijanarko' },
                    // Tidak terdapat di data/Data Nakes.xlsx — ditulis sesuai bagan.
                    { jabatan: 'Keuangan', nama: 'Debora Silitonga, S.Ak' },
                    { jabatan: 'Sistem Informasi Digital', nama: 'Hijratul Riskhi, A.Md.Kes' },
                    { jabatan: 'Pemberdayaan Masyarakat', nama: 'Nani Rohayah, SKM' },
                    { jabatan: 'Arsip & SDM', nama: 'Dita Noviyanti' },
                ],
            },
            {
                jabatan: 'Klaster Ibu & Anak',
                nama: 'dr. Mardalena',
                anak: [
                    { jabatan: 'Kesehatan Ibu', nama: 'Ratna Nur Sangadah, AM.Keb' },
                    { jabatan: 'Kesehatan Bayi & Anak', nama: 'Rina Jun Fitri, AM.Keb' },
                    { jabatan: 'Kesehatan Usia Sekolah', nama: 'Dyah Kusuma Andriani, S.Kep., Ns' },
                    { jabatan: 'Kesehatan Remaja', nama: 'Fera Hardiyanti, S.Kep., Ns' },
                    { jabatan: 'Kesehatan Anak Pra Sekolah', nama: 'Rina Jun Fitri, AM.Keb' },
                ],
            },
            {
                jabatan: 'Klaster Dewasa & Lansia',
                nama: 'dr. Andri Wijanarko',
                anak: [
                    { jabatan: 'Usia Dewasa', nama: 'Mahpuzatul Jannah, S.Kep., Ns' },
                    { jabatan: 'Usia Lansia', nama: 'Siti Aisyah, S.Kep., Ns' },
                    { jabatan: 'Kesehatan Reproduksi', nama: 'Hj. Badariah, AM.Keb' },
                ],
            },
            {
                jabatan: 'Klaster P2M & Kesling',
                nama: 'dr. Dyni Iswatinnisa',
                anak: [
                    { jabatan: 'Surveilans', nama: 'Harno, SKM' },
                    { jabatan: 'Promosi Kesehatan', nama: 'Indri Delliyana, SKM' },
                    { jabatan: 'Kesehatan Lingkungan', nama: 'Mey Lida Siti Lestari, A.Md.Kes' },
                ],
            },
            {
                jabatan: 'Lintas Klaster',
                nama: 'dr. Nidhya Dwie Mulyasari',
                anak: [
                    { jabatan: 'Laboratorium', nama: 'Ade Susan Indora, A.Md.AK' },
                    {
                        jabatan: 'Farmasi',
                        nama: 'Rahmayani Maghfirah, S.Farm., Apt., M.Farm.',
                    },
                    // Tidak terdapat di data/Data Nakes.xlsx — ditulis sesuai bagan.
                    { jabatan: 'Gigi & Mulut', nama: 'drg. Lukman Noor Hakim' },
                    { jabatan: 'UGD & Tindakan', nama: 'Darmiaty, S.Kep., Ns' },
                    { jabatan: 'Gizi', nama: 'Sri Norliani, A.Md.Gz' },
                    { jabatan: 'Krisis Kesehatan', nama: 'dr. Mardalena' },
                    // Tidak terdapat di data/Data Nakes.xlsx — ditulis sesuai bagan.
                    { jabatan: 'Rehabilitasi Medik', nama: 'Siti Nur Halizah, A.Md.Kes' },
                ],
            },
        ],
    },
]

/** Dasar hukum yang tercantum di bagan. */
export const DASAR_HUKUM_STRUKTUR =
    'SK Kepala Dinas Kesehatan Kabupaten Tanah Bumbu No. B/400.7.2.3/0381/DINKES-YANKES/IV/2025 tanggal 28 April 2025'
