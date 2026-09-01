/** Tag cache untuk data yang tampil di situs publik.
 *
 *  Setiap entitas punya satu tag. Fungsi baca di `src/lib/konten/*` menandai
 *  cache-nya dengan tag ini; Server Action yang mengubah data memanggil
 *  `revalidateTag(...)` dengan tag yang sama. Dikumpulkan di satu berkas supaya
 *  penulis dan pembaca tidak mungkin memakai string yang berbeda karena salah
 *  ketik — kesalahan yang gejalanya membingungkan: data tersimpan, tapi situs
 *  publik tidak ikut berubah. */
export const TAG = {
    jamPelayanan: 'jam-pelayanan',
    pengaturanSitus: 'pengaturan-situs',
    dokter: 'dokter',
    nakes: 'nakes',
    sertifikat: 'sertifikat',
    artikel: 'artikel',
    layanan: 'layanan',
    posyandu: 'posyandu',
    fasilitas: 'fasilitas',
    strukturOrganisasi: 'struktur-organisasi',
    profil: 'profil',
    angkaPelayanan: 'angka-pelayanan',
} as const

export type NamaTag = (typeof TAG)[keyof typeof TAG]

/** Umur cache maksimum sebagai jaring pengaman.
 *
 *  Penyegaran yang sesungguhnya terjadi lewat `revalidateTag` begitu admin
 *  menyimpan, jadi angka ini bukan mekanisme utama — hanya batas agar data
 *  tidak basi selamanya seandainya ada jalur tulis yang lupa memanggil tag. */
export const UMUR_CACHE_DETIK = 3600
