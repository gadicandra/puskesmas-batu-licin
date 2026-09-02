import sharp from 'sharp'

/** Pengubahan gambar unggahan menjadi WebP.
 *
 *  Kenapa di sini, bukan lewat `upload.formatOptions` di koleksi `media`?
 *  Karena `formatOptions` berlaku untuk SELURUH koleksi, sementara `media`
 *  dipakai bersama-sama: foto layanan, foto dokter, gambar artikel, DAN
 *  pindaian sertifikat. Sertifikat perlu tetap dalam format aslinya — berkasnya
 *  diunduh dan dicetak, dan WebP bukan format yang nyaman untuk itu. Payload
 *  tidak menyediakan cara mematikan `formatOptions` per unggahan, jadi
 *  pengubahannya dilakukan sebelum berkas diserahkan ke `payload.create()`.
 *
 *  Efek sampingnya menguntungkan: karena Payload menerima berkas yang sudah
 *  WebP, ukuran turunan (`thumbnail`, `card`) ikut WebP tanpa konfigurasi
 *  tambahan.
 */

/** Format yang aman diubah. Sengaja sama dengan daftar `canResizeImage()`
 *  milik Payload, dikurangi `image/webp` (sudah WebP).
 *
 *  SVG dan PDF TIDAK ada di sini dan tidak boleh masuk: SVG adalah teks yang
 *  ikut skala tanpa batas, mengubahnya jadi WebP justru merusaknya. */
const BISA_JADI_WEBP = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/tiff',
    'image/avif',
])

/** 82 adalah titik yang lazim dipakai: berkas jauh lebih kecil daripada JPEG
 *  setara, dan bedanya tidak terlihat pada foto. */
const KUALITAS = 82

export type BerkasUnggah = {
    data: Buffer
    mimetype: string
    name: string
    size: number
}

function gantiEkstensi(nama: string, ekstensi: string) {
    const titik = nama.lastIndexOf('.')
    const dasar = titik > 0 ? nama.slice(0, titik) : nama
    return `${dasar}.${ekstensi}`
}

/**
 * Ubah gambar menjadi WebP. Berkas yang tidak bisa atau tidak layak diubah
 * dikembalikan apa adanya — pemanggil tidak perlu memeriksa tipe lebih dulu.
 *
 * Tidak diubah bila: sudah WebP, bukan gambar raster (PDF, SVG), atau hasil
 * WebP-nya ternyata lebih besar daripada aslinya. Yang terakhir memang terjadi
 * pada gambar yang sudah dimampatkan habis; menyimpan yang lebih besar berarti
 * halaman jadi lebih lambat, kebalikan dari tujuan seluruh langkah ini.
 */
export async function keWebp(berkas: BerkasUnggah): Promise<BerkasUnggah> {
    if (!BISA_JADI_WEBP.has(berkas.mimetype)) return berkas

    try {
        const data = await sharp(berkas.data, {
            // GIF (dan WebP) menyimpan banyak bingkai. Tanpa ini hanya bingkai
            // pertama yang ikut, dan animasinya hilang diam-diam.
            animated: berkas.mimetype === 'image/gif',
        })
            // Foto dari ponsel menyimpan arah potret/lanskap di EXIF, bukan di
            // pikselnya. `rotate()` tanpa argumen menerapkannya, lalu membuang
            // EXIF-nya — tanpa ini foto bisa tampil terbaring di situs.
            .rotate()
            .webp({ quality: KUALITAS })
            .toBuffer()

        if (data.byteLength >= berkas.size) return berkas

        return {
            data,
            mimetype: 'image/webp',
            name: gantiEkstensi(berkas.name, 'webp'),
            size: data.byteLength,
        }
    } catch {
        // Berkas rusak atau format yang tidak dikenali sharp. Biarkan Payload
        // yang menolaknya dengan pesannya sendiri; menggagalkan unggahan di
        // sini hanya menghasilkan pesan error yang lebih membingungkan.
        return berkas
    }
}
