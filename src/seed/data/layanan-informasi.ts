/** Penjelasan umum tiap layanan utama untuk halaman publik `/layanan/<slug>`.
 *
 *  DIPISAH dari `layanan.ts` dengan sengaja. `layanan.ts` adalah salinan
 *  lampiran SK B/445.61/003/PKM.Btl-Adm/I/2023 — nama dan jenjangnya tidak
 *  boleh ditambah-tambah. Berkas ini bukan isi SK: ini keterangan umum yang
 *  lazim ada di layanan sejenis, ditulis supaya halaman detail tidak kosong
 *  sebelum Puskesmas menyusun teks resminya (butir C1 di docs/PROJECT_PLAN.md).
 *
 *  Karena itu pengisiannya di `seed/index.ts` bersifat MENAMBAL, bukan menimpa:
 *  hanya layanan yang `deskripsi`-nya masih kosong yang diisi, dan `rincian`
 *  hanya dibuat untuk layanan yang belum punya satu pun sub-layanan. Begitu
 *  staf menyuntingnya lewat /dashboard/layanan, seed tidak menyentuhnya lagi.
 *
 *  Kuncinya `slug`, bukan `nama`: staf boleh memperbaiki nama layanan tanpa
 *  membuat penambalan ini meleset ke layanan yang salah.
 *
 *  `rincian` menjadi sub-layanan sungguhan (baris `services` dengan `induk`),
 *  jadi isinya muncul sebagai daftar centang "Layanan yang Tersedia".
 */

export type InformasiLayanan = {
    deskripsi: string
    /** Hanya untuk layanan yang di SK tidak punya rincian. Layanan seperti
     *  Laboratorium dan KIER Kesehatan sudah punya daftarnya sendiri di SK. */
    rincian?: string[]
}

export const INFORMASI_LAYANAN: Record<string, InformasiLayanan> = {
    'pelayanan-pemeriksaan-umum': {
        deskripsi:
            'Pemeriksaan kesehatan umum untuk keluhan sehari-hari seperti demam, batuk, dan nyeri, sampai kontrol penyakit menahun. Dokter memeriksa, memberikan obat, dan menuliskan rujukan ke rumah sakit bila diperlukan.',
        rincian: [
            'Pemeriksaan dan pengobatan umum',
            'Pemeriksaan tekanan darah, berat badan, dan suhu',
            'Kontrol penyakit menahun (darah tinggi, kencing manis)',
            'Perawatan luka ringan',
            'Konsultasi kesehatan',
            'Surat rujukan ke rumah sakit',
        ],
    },
    'pelayanan-kesehatan-gigi-dan-mulut': {
        deskripsi:
            'Perawatan gigi dan mulut untuk anak sampai lansia, mulai dari pemeriksaan rutin hingga penambalan dan pencabutan gigi, ditangani dokter gigi dengan peralatan yang tersedia di Puskesmas.',
        rincian: [
            'Pemeriksaan gigi rutin',
            'Pembersihan karang gigi',
            'Penambalan gigi berlubang',
            'Pencabutan gigi',
            'Perawatan gusi',
            'Penyuluhan cara menyikat gigi yang benar',
        ],
    },
    'pelayanan-kia-dan-kb': {
        deskripsi:
            'Pelayanan untuk ibu hamil, ibu setelah melahirkan, bayi dan balita, serta keluarga berencana. Termasuk pemeriksaan kehamilan rutin, imunisasi anak, dan konsultasi pemilihan alat kontrasepsi.',
    },
    'pelayanan-kesehatan-lansia': {
        deskripsi:
            'Pemeriksaan kesehatan bagi warga berusia 60 tahun ke atas, dengan antrean yang didahulukan. Selain pengobatan, petugas memantau tekanan darah, gula darah, dan kemandirian lansia secara berkala.',
        rincian: [
            'Pemeriksaan kesehatan berkala',
            'Pemeriksaan tekanan darah, gula darah, dan kolesterol',
            'Skrining kemandirian lansia',
            'Konsultasi obat rutin',
            'Penyuluhan gizi dan aktivitas fisik',
            'Rujukan ke rumah sakit bila diperlukan',
        ],
    },
    'pelayanan-konsultasi-gizi': {
        deskripsi:
            'Konsultasi pengaturan makan bersama petugas gizi, untuk ibu hamil dan menyusui, balita dengan masalah pertumbuhan, maupun penderita penyakit menahun yang perlu menjaga pola makan.',
        rincian: [
            'Penimbangan berat badan dan pengukuran tinggi badan',
            'Konsultasi gizi ibu hamil dan menyusui',
            'Konsultasi gizi balita (gizi kurang dan stunting)',
            'Pengaturan makan penderita kencing manis, darah tinggi, dan asam urat',
            'Pemberian makanan tambahan',
            'Penyuluhan gizi seimbang',
        ],
    },
    'pelayanan-konsultasi-sanitasi': {
        deskripsi:
            'Konsultasi untuk penyakit yang berkaitan dengan lingkungan rumah, seperti diare, penyakit kulit, dan demam berdarah. Petugas membantu menemukan sumber masalahnya dan cara memperbaikinya.',
        rincian: [
            'Konsultasi penyakit berbasis lingkungan',
            'Pemeriksaan kualitas air bersih',
            'Saran perbaikan jamban dan pembuangan sampah',
            'Konseling pengendalian jentik dan nyamuk',
            'Kunjungan rumah bila diperlukan',
            'Penyuluhan rumah sehat',
        ],
    },
    'pelayanan-mtbs': {
        deskripsi:
            'Pemeriksaan terpadu untuk balita yang sakit (usia 0–59 bulan). Petugas memeriksa keluhan, tanda bahaya, status gizi, dan imunisasi dalam satu kali kunjungan.',
        rincian: [
            'Pemeriksaan balita sakit usia 0–59 bulan',
            'Penilaian tanda bahaya umum',
            'Pemeriksaan batuk, diare, dan demam',
            'Pemeriksaan status gizi dan imunisasi',
            'Pemberian obat dan cara perawatan di rumah',
            'Rujukan bila diperlukan',
        ],
    },
    laboratorium: {
        deskripsi:
            'Pemeriksaan darah, urine, dan dahak untuk membantu dokter menegakkan diagnosis. Pemeriksaan dilakukan atas permintaan dokter, dan hasilnya sebagian besar dapat diambil pada hari yang sama.',
    },
    'pemeriksaan-iva-pemeriksaan-kanker-rahim': {
        deskripsi:
            'Deteksi dini kanker leher rahim untuk perempuan yang sudah menikah atau pernah berhubungan seksual. Pemeriksaannya singkat, tidak menyakitkan, dan hasilnya langsung diketahui.',
        rincian: [
            'Konseling sebelum pemeriksaan',
            'Pemeriksaan IVA',
            'Pemeriksaan payudara klinis (SADANIS)',
            'Penjelasan hasil pemeriksaan',
            'Rujukan bila ditemukan kelainan',
            'Penyuluhan deteksi dini kanker',
        ],
    },
    'pelayanan-farmasi': {
        deskripsi:
            'Penyiapan dan penyerahan obat sesuai resep dokter, disertai penjelasan cara dan aturan minumnya. Warga juga dapat bertanya tentang obat yang sedang dikonsumsi.',
        rincian: [
            'Pelayanan resep dokter',
            'Penyiapan dan penyerahan obat',
            'Penjelasan cara dan aturan minum obat',
            'Konsultasi obat',
            'Pemantauan obat pasien penyakit menahun',
        ],
    },
    'kier-kesehatan': {
        deskripsi:
            'Penerbitan surat keterangan kesehatan untuk berbagai keperluan, mulai dari melamar pekerjaan sampai persiapan pernikahan dan ibadah haji. Surat diterbitkan setelah pemeriksaan oleh dokter.',
    },
    'pelayanan-ruang-promkes': {
        deskripsi:
            'Ruang penyuluhan dan konseling kesehatan, baik perorangan maupun kelompok. Di sini juga kader kesehatan dibina dan bahan informasi kesehatan disiapkan.',
        rincian: [
            'Penyuluhan kesehatan perorangan dan kelompok',
            'Konseling perilaku hidup bersih dan sehat (PHBS)',
            'Konseling berhenti merokok',
            'Pembinaan kader kesehatan',
            'Penyediaan media informasi kesehatan',
        ],
    },
    'pelayanan-ruang-keuangan': {
        deskripsi:
            'Tempat mengurus pembayaran dan pertanyaan seputar biaya pelayanan, termasuk penjelasan pelayanan yang ditanggung BPJS Kesehatan.',
        rincian: [
            'Informasi biaya pelayanan',
            'Pembayaran retribusi',
            'Penjelasan pelayanan yang ditanggung BPJS Kesehatan',
            'Penerbitan bukti pembayaran',
        ],
    },
    'pelayanan-ruang-tata-usaha': {
        deskripsi:
            'Pelayanan administrasi dan informasi umum Puskesmas, termasuk pengesahan surat keterangan dan penerimaan saran maupun pengaduan dari warga.',
        rincian: [
            'Informasi umum dan alur pelayanan',
            'Legalisasi surat keterangan',
            'Penerimaan surat masuk',
            'Administrasi kepegawaian',
            'Penerimaan saran dan pengaduan',
        ],
    },
    'pelayanan-ugd': {
        deskripsi:
            'Penanganan kasus gawat darurat selama 24 jam, setiap hari termasuk hari libur. Pasien distabilkan lebih dulu, lalu dirujuk ke rumah sakit bila kondisinya memerlukan.',
        rincian: [
            'Penanganan gawat darurat 24 jam',
            'Perawatan dan penjahitan luka',
            'Penanganan korban kecelakaan',
            'Pemasangan infus dan observasi',
            'Stabilisasi sebelum rujukan',
            'Rujukan ke rumah sakit',
        ],
    },
    'pelayanan-ugd-kebidanan': {
        deskripsi:
            'Pertolongan persalinan dan penanganan kegawatdaruratan ibu hamil selama 24 jam, ditangani bidan dan dokter jaga.',
        rincian: [
            'Pertolongan persalinan normal 24 jam',
            'Penanganan kegawatdaruratan ibu hamil',
            'Pemeriksaan kehamilan darurat',
            'Perawatan ibu dan bayi baru lahir',
            'Rujukan kasus risiko tinggi',
        ],
    },
    'ukm-esensial': {
        deskripsi:
            'Kegiatan kesehatan masyarakat yang dijalankan di luar gedung Puskesmas — di posyandu, sekolah, dan rumah warga — meliputi kesehatan ibu dan anak, kesehatan lingkungan, pencegahan penyakit, promosi kesehatan, dan gizi.',
    },
    'ukm-pengembangan': {
        deskripsi:
            'Kegiatan kesehatan masyarakat tambahan yang disesuaikan dengan kebutuhan wilayah kerja Puskesmas Batulicin, yaitu kesehatan jiwa dan kesehatan kerja.',
    },
    'program-peningkatan-mutu-puskesmas': {
        deskripsi:
            'Kegiatan internal untuk menjaga dan meningkatkan mutu serta keselamatan pelayanan, mulai dari pencegahan infeksi sampai audit internal secara berkala.',
    },
}
