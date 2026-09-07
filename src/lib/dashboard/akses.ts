/**
 * Peran yang dibutuhkan tiap rute dashboard — SATU sumber kebenaran.
 *
 * Sebelumnya pengetahuan ini tersebar di dua tempat: `menu.ts` (menyembunyikan
 * menu) dan tiap `page.tsx` (memanggil `requireSuperAdmin`). Dua daftar yang
 * harus dijaga selaras dengan tangan cepat atau lambat akan berbeda, dan
 * bedanya berbahaya ke satu arah: halaman baru yang lupa memanggil penjaganya
 * tetap bisa dibuka admin unit hanya dengan mengetik alamatnya, karena menunya
 * disembunyikan tapi rutenya tidak dijaga.
 *
 * Sekarang `menu.ts` dan penjaga di `dashboard/(app)/layout.tsx` sama-sama
 * membaca berkas ini. Rute yang tidak terdaftar diperlakukan **paling ketat**
 * (`superadmin`) — halaman baru yang lupa didaftarkan gagal dengan cara yang
 * kelihatan, bukan diam-diam terbuka untuk semua.
 *
 * Ini lapis kenyamanan, BUKAN penegak sebenarnya. Penegaknya tetap access
 * control Payload di setiap Server Action lewat `overrideAccess: false`.
 */

export type Peran = 'semua' | 'superadmin'

export const AKSES_RUTE: { awalan: string; peran: Peran }[] = [
    // Urutan tidak penting: pencocokannya memakai awalan terpanjang.
    { awalan: '/dashboard', peran: 'semua' },
    { awalan: '/dashboard/artikel', peran: 'semua' },
    { awalan: '/dashboard/media', peran: 'semua' },
    { awalan: '/dashboard/statistik', peran: 'semua' },
    { awalan: '/dashboard/akun', peran: 'semua' },
    { awalan: '/dashboard/tanpa-akses', peran: 'semua' },

    { awalan: '/dashboard/pengaduan', peran: 'superadmin' },
    { awalan: '/dashboard/dokter', peran: 'superadmin' },
    { awalan: '/dashboard/tenaga-medis', peran: 'superadmin' },
    { awalan: '/dashboard/vaksin', peran: 'superadmin' },
    { awalan: '/dashboard/sertifikat', peran: 'superadmin' },
    { awalan: '/dashboard/layanan', peran: 'superadmin' },
    { awalan: '/dashboard/posyandu', peran: 'superadmin' },
    { awalan: '/dashboard/fasilitas', peran: 'superadmin' },
    { awalan: '/dashboard/struktur-organisasi', peran: 'superadmin' },
    { awalan: '/dashboard/pengaturan', peran: 'superadmin' },
    { awalan: '/dashboard/pengguna', peran: 'superadmin' },
]

/** Rute yang boleh dibuka tanpa login. `/dashboard/setup` ikut di sini karena
 *  dipakai justru saat belum ada satu pun akun — penjaganya "tabel users masih
 *  kosong", bukan sesi. */
export const RUTE_PUBLIK = ['/dashboard/login', '/dashboard/setup']

export function rutePublik(path: string): boolean {
    return RUTE_PUBLIK.some((r) => path === r || path.startsWith(`${r}/`))
}

/** Peran yang dibutuhkan sebuah alamat. Awalan terpanjang yang cocok yang
 *  menang, sehingga `/dashboard/artikel/12` ikut aturan `/dashboard/artikel`
 *  dan bukan aturan `/dashboard`. */
export function peranRute(path: string): Peran {
    const cocok = AKSES_RUTE.filter((r) => path === r.awalan || path.startsWith(`${r.awalan}/`)).sort(
        (a, b) => b.awalan.length - a.awalan.length,
    )[0]
    return cocok?.peran ?? 'superadmin'
}

export function butuhSuperAdmin(path: string): boolean {
    return peranRute(path) === 'superadmin'
}

/** Alamat halaman masuk beserta tujuan yang tadi diminta, supaya sesudah login
 *  staf mendarat di tempat yang ia klik — bukan selalu di beranda. */
export function alamatLogin(tujuan?: string | null): string {
    return tujuan && tujuanAman(tujuan) ? `/dashboard/login?lanjut=${encodeURIComponent(tujuan)}` : '/dashboard/login'
}

/** Tujuan setelah login hanya boleh alamat dashboard di situs ini.
 *
 *  Tanpa pemeriksaan ini `?lanjut=https://situs-lain/...` akan membuat halaman
 *  login kita memantulkan korban ke situs mana pun — cara klasik membuat
 *  tautan phishing yang terlihat berasal dari domain Puskesmas. `//jahat.com`
 *  ikut ditolak: browser membacanya sebagai alamat mutlak. */
export function tujuanAman(tujuan: string | null | undefined): boolean {
    if (!tujuan) return false
    if (!tujuan.startsWith('/dashboard') || tujuan.startsWith('//')) return false
    return !rutePublik(tujuan)
}
