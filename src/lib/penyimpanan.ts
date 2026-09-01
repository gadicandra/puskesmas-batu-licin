/** Penyimpanan berkas unggahan.
 *
 *  Dua mode, dipilih otomatis dari isi `.env`:
 *
 *  1. **Disk lokal** (default) — berkas masuk ke `<project>/media`. Cocok untuk
 *     pengembangan dan untuk produksi di VPS/server sendiri yang disknya
 *     permanen. Di Docker sudah dipasangi volume `puskesmas_media`, jadi
 *     berkasnya selamat saat container dibuat ulang.
 *
 *  2. **Cloudflare R2** — aktif begitu keempat variabel `R2_*` terisi. Wajib
 *     untuk platform yang disknya sementara (Vercel dan sejenisnya): di sana
 *     berkas yang diunggah staf hilang pada deploy berikutnya, tanpa pesan
 *     galat apa pun.
 *
 *  R2 dipilih daripada S3 karena biaya keluar (egress) nol. Situs publik
 *  menyajikan gambar yang sama berulang kali; penyedia lain menagih per GB
 *  keluar, dan itu justru komponen biaya yang paling mudah membengkak. */

/** Variabel yang harus ada agar R2 dianggap terkonfigurasi. */
const WAJIB = [
    'R2_BUCKET',
    'R2_ENDPOINT',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
] as const

export function r2Aktif(): boolean {
    return WAJIB.every((k) => Boolean(process.env[k]))
}

/** Variabel R2 yang masih kosong. Dipakai pesan galat agar langsung
 *  menunjukkan yang mana, bukan sekadar "konfigurasi tidak lengkap". */
export function r2Kurang(): string[] {
    return WAJIB.filter((k) => !process.env[k])
}

/**
 * Konfigurasi klien S3 untuk R2.
 *
 * Dua hal yang khas R2 dan sering jadi sumber kebingungan:
 *
 * - `region: 'auto'` — R2 tidak punya region seperti AWS, tapi AWS SDK tetap
 *   menuntut nilainya diisi. Mengisi region AWS sungguhan (mis. `us-east-1`)
 *   tetap "jalan" tapi menyesatkan pembaca berikutnya.
 * - **Tidak ada ACL.** R2 tidak mendukung `acl: 'public-read'`; mengirimnya
 *   membuat permintaan ditolak. Berkas tetap tersaji ke publik karena dilayani
 *   lewat route Payload `/api/media/...`, bukan lewat URL bucket langsung.
 */
export function konfigurasiR2() {
    return {
        region: 'auto',
        endpoint: endpointR2(),
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
        },
    }
}

export function namaBucketR2(): string {
    return (process.env.R2_BUCKET as string).trim()
}

/**
 * Endpoint R2 yang sudah dibersihkan dan diperiksa.
 *
 * Halaman bucket di Cloudflare menampilkan alamat "S3 API" yang SUDAH memuat
 * nama bucket di belakangnya:
 *
 *     https://<account_id>.r2.cloudflarestorage.com/puskesmas-batulicin
 *                                                  ^^^^^^^^^^^^^^^^^^^^ ikut tersalin
 *
 * Kalau itu yang dipakai, AWS SDK menambahkan nama bucket SEKALI LAGI dan
 * setiap unggahan gagal dengan galat yang tidak menyebut penyebabnya sama
 * sekali. Ini kesalahan paling sering pada setup R2, jadi ditolak di sini
 * dengan pesan yang menyebutkan persis apa yang harus dibuang.
 */
export function endpointR2(): string {
    const mentah = (process.env.R2_ENDPOINT as string).trim().replace(/\/+$/, '')

    if (!/^https:\/\//.test(mentah)) {
        throw new Error(
            `R2_ENDPOINT harus diawali https:// — sekarang berisi "${mentah}".`,
        )
    }

    const url = new URL(mentah)
    if (url.pathname && url.pathname !== '/') {
        throw new Error(
            `R2_ENDPOINT tidak boleh memuat nama bucket. Buang "${url.pathname}" ` +
                `dari akhirnya sehingga menjadi "${url.origin}". ` +
                `Nama bucket diisi terpisah di R2_BUCKET.`,
        )
    }

    return url.origin
}

/** Ringkasan untuk log saat aplikasi menyala — supaya keliru konfigurasi
 *  ketahuan dari log, bukan baru ketahuan saat staf kehilangan berkasnya. */
export function ringkasanPenyimpanan(): string {
    if (r2Aktif()) return `Cloudflare R2 (bucket: ${namaBucketR2()})`
    const kurang = r2Kurang()
    return `disk lokal <project>/media — R2 nonaktif (${kurang.length} variabel belum diisi: ${kurang.join(', ')})`
}
