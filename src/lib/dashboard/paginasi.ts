/**
 * Pilihan jumlah baris per halaman — dipakai bersama oleh Server Component
 * (Artikel, Galeri Gambar, yang memotong datanya lewat `payload.find`) dan
 * komponen klien `ui/Paginasi`.
 *
 * Ditaruh di berkas TERSENDIRI, bukan ikut di dalam `ui/Paginasi.tsx`, justru
 * karena berkas itu `'use client'`: memanggil fungsi biasa dari modul klien di
 * dalam Server Component gagal saat dijalankan ("Attempted to call bacaJumlah()
 * from the server"), dan `pnpm build` TIDAK menangkapnya — halamannya baru
 * meledak ketika dibuka.
 */

export const OPSI_JUMLAH = [5, 10, 20, 50] as const
export const SEMUA = 'semua'
export type JumlahBaris = (typeof OPSI_JUMLAH)[number] | typeof SEMUA

/** Bawaannya **5**, sengaja kecil: tabel pendek lebih mudah dibaca staf, dan
 *  yang butuh melihat banyak sekaligus tinggal menaikkannya sendiri — pilihannya
 *  ada tepat di sebelah tabel, bukan tersembunyi di pengaturan. */
export const JUMLAH_BAWAAN: JumlahBaris = 5

/** Batas baris untuk pilihan "Semua" pada daftar yang dipotong di server.
 *  Satu halaman berisi ribuan baris hanya membuat browser tersendat, dan data
 *  sebanyak itu jelas butuh pencarian, bukan gulir panjang. */
export const BATAS_SEMUA = 500

/** Ubah teks pilihan jadi nilai yang sah. Nilai asing (mis. `?per=999` yang
 *  diketik sendiri di alamat) dikembalikan ke bawaan, bukan dipaksakan. */
export function bacaJumlah(nilai: string | null | undefined): JumlahBaris {
    if (nilai === SEMUA) return SEMUA
    const angka = Number(nilai)
    return (OPSI_JUMLAH as readonly number[]).includes(angka) ? (angka as JumlahBaris) : JUMLAH_BAWAAN
}

/** Berapa baris yang diminta ke server untuk sebuah pilihan. */
export function batasBaris(jumlah: JumlahBaris): number {
    return jumlah === SEMUA ? BATAS_SEMUA : jumlah
}
