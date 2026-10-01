/**
 * Next.js Instrumentation — dijalankan sekali saat server pertama kali menyala.
 *
 * Dipakai untuk menangkap error streaming `transformAlgorithm` yang merupakan
 * race condition internal Node.js (terutama v22+/v24) saat SSR stream di-cancel
 * oleh klien (navigasi cepat, prefetch, dsb.). Error ini non-fatal — halaman
 * tetap terkirim 200 — tapi muncul berulang di log dan membingungkan.
 *
 * Referensi:
 *   - https://github.com/nodejs/node/issues/54464
 *   - https://github.com/vercel/next.js/issues/55918
 */
export async function register() {
    // Hanya berjalan di runtime Node.js — edge runtime tidak punya process.emit.
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Dynamic import agar edge bundler tidak mencoba mem-parse kode Node.js.
        await import('./instrumentation.node')
    }
}
