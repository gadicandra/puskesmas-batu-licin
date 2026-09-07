/** Profil kelembagaan UPTD Puskesmas Batulicin.
 *  Sumber: `data/puskesmas.md` bagian 1 & 2. */

export const PROFIL = {
    kodePuskesmas: 'P6310050201',
    kepalaPuskesmas: 'dr. Laurensius Lungan, M.H',
    kategori: 'Perkotaan',
    jenis: 'Puskesmas Non Perawatan',
    letak: 'Ibu Kota Kab/Kota',
    topografi: 'Perbatasan',

    luasWilayah: '105,760 Km²',
    jumlahDesa: '9 (7 Desa, 2 Kelurahan)',
    jumlahRT: 53,
    jumlahPenduduk: 21314,
    jumlahKK: 5999,

    // PENTING: ini visi pembangunan Kabupaten, bukan rumusan Puskesmas sendiri.
    // `sumberVisi` wajib ikut ditampilkan bersama visinya — tanpa atribusi itu,
    // pembaca akan mengira Puskesmas yang merumuskannya.
    visi:
        'BerAKSI Menuju Tanah Bumbu yang Maju, Makmur dan Beradab melalui Penguatan Sumber Daya Manusia dan Tata Kelola Pemanfaatan Sumber Daya Alam yang Berkelanjutan',
    sumberVisi: 'Visi pembangunan Kabupaten Tanah Bumbu, RPJMD 2025–2029',

    // Penomoran di dokumen asli meloncat (1, 2, 4, 7). Di sini dirapikan jadi
    // 1–4 berurutan. `data/puskesmas.md` mencatat bahwa perlu dikonfirmasi ke
    // Puskesmas apakah ada butir misi yang terlewat — kalau ternyata ada,
    // tambahkan lewat /dashboard, jangan diam-diam ditebak di sini.
    misi: [
        {
            isi: 'Meningkatkan kualitas dan aksesibilitas pendidikan dan pelatihan untuk mewujudkan sumber daya manusia yang berkompetensi dan berkarakter dilandasi iman dan takwa.',
        },
        {
            isi: 'Meningkatkan kualitas sarana dan pelayanan kesehatan untuk mewujudkan masyarakat yang sehat, produktif, dan sejahtera.',
        },
        {
            isi: 'Mewujudkan pembangunan infrastruktur yang berkualitas dan merata untuk mempercepat konektivitas, mobilitas, dan pertumbuhan ekonomi.',
        },
        {
            isi: 'Mewujudkan tata kelola pemerintahan yang adaptif, melayani, dan akuntabel.',
        },
    ],

    motto:
        'Ramah dan profesional dalam pelayanan kesehatan, dan kepuasan Anda adalah harapan kami.',

    maklumatPelayanan:
        'Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditentukan dengan penuh rasa tanggung jawab, dan apabila tidak menepati janji, kami siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku.',

    budayaKerja: [
        {
            judul: '5S',
            keterangan: 'Pelayanan kepada masyarakat',
            butir: [
                { isi: 'Senyum' },
                { isi: 'Sapa' },
                { isi: 'Salam' },
                { isi: 'Sopan' },
                { isi: 'Santun' },
            ],
        },
        {
            judul: '5R',
            keterangan: 'Kedisiplinan lingkungan kerja',
            butir: [
                { isi: 'Ringkas' },
                { isi: 'Rapih' },
                { isi: 'Resik' },
                { isi: 'Rawat' },
                { isi: 'Rajin' },
            ],
        },
    ],
}
