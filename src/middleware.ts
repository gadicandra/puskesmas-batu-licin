import { NextResponse, type NextRequest } from 'next/server'
import { alamatLogin, rutePublik } from '@/lib/dashboard/akses'

/**
 * Penjaga terdepan `/dashboard`.
 *
 * Dua tugas, keduanya murah:
 *
 * 1. **Belum login → langsung ke halaman masuk**, sebelum satu baris pun
 *    halaman dashboard dirender. Layout `(app)` sudah memanggil `requireUser()`,
 *    tapi itu berjalan setelah Next mengambil kode halaman dan menyentuh
 *    database; memantulkannya di sini membuat pengalihannya seketika.
 * 2. **Menitipkan alamat yang diminta** lewat header `x-rute`. Server Component
 *    tidak bisa membaca pathname-nya sendiri, padahal penjaga peran di layout
 *    perlu tahu halaman mana yang sedang dibuka.
 *
 * Yang diperiksa hanya ADA-TIDAKNYA cookie sesi, bukan keabsahannya: middleware
 * berjalan di edge dan tidak boleh menyentuh database. Cookie palsu atau
 * kedaluwarsa lolos dari sini, lalu ditolak `payload.auth()` di layout — dan
 * mutasi apa pun tetap dijaga access control Payload. Jadi ini lapis
 * kenyamanan, bukan pengaman terakhir.
 */
export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl

    const teruskan = () => {
        const headers = new Headers(request.headers)
        headers.set('x-rute', pathname)
        return NextResponse.next({ request: { headers } })
    }

    if (rutePublik(pathname)) return teruskan()

    // Nama cookie mengikuti `cookiePrefix` Payload yang di proyek ini dibiarkan
    // bawaan ("payload"). Kalau suatu saat diubah di payload.config.ts, ubah
    // juga di sini — middleware tidak boleh mengimpor konfigurasi Payload.
    const adaSesi = Boolean(request.cookies.get('payload-token')?.value)
    if (adaSesi) return teruskan()

    return NextResponse.redirect(new URL(alamatLogin(pathname + search), request.url))
}

export const config = {
    matcher: ['/dashboard/:path*'],
}
