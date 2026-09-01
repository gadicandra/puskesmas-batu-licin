import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { bersihkanHtml, waktuBaca } from '@/lib/dashboard/html'
import type { Article } from '@/payload-types'
import { ringkasGambar, type GambarPublik } from './media'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type KategoriArtikel = 'berita' | 'pengumuman' | 'kegiatan' | 'kesehatan'

export const LABEL_KATEGORI_ARTIKEL: Record<KategoriArtikel, string> = {
    berita: 'Berita',
    pengumuman: 'Pengumuman',
    kegiatan: 'Kegiatan',
    kesehatan: 'Tips Kesehatan',
}

/** Bentuk ringkas untuk daftar & kartu — tanpa isi HTML, supaya halaman daftar
 *  tidak mengangkut puluhan artikel utuh yang tidak dirender. */
export type ArtikelRingkas = {
    id: number
    judul: string
    slug: string
    ringkasan: string | null
    kategori: KategoriArtikel
    labelKategori: string
    /** ISO 8601; formatnya diserahkan ke UI. */
    tanggal: string | null
    penulis: string | null
    sampul: GambarPublik | null
}

export type ArtikelLengkap = ArtikelRingkas & {
    /** HTML yang SUDAH disanitasi — aman untuk `dangerouslySetInnerHTML`.
     *  Sanitasi dilakukan dua kali (saat simpan dan di sini) karena isi
     *  database bisa saja berubah lewat jalur lain. */
    isiHtml: string
    /** Perkiraan waktu baca dalam menit. */
    menitBaca: number
}

export type HalamanArtikel = {
    artikel: ArtikelRingkas[]
    halaman: number
    totalHalaman: number
    adaSebelumnya: boolean
    adaBerikutnya: boolean
}

function ringkas(a: Article): ArtikelRingkas {
    // `author` berupa angka bila relasi belum ter-resolve (depth kurang);
    // nama penulis lalu dianggap tidak ada, bukan ditampilkan sebagai angka.
    const penulis =
        a.author && typeof a.author === 'object' ? (a.author.name?.trim() ?? null) : null

    return {
        id: a.id,
        judul: a.title,
        slug: a.slug ?? String(a.id),
        ringkasan: a.excerpt?.trim() || null,
        kategori: (a.category ?? 'berita') as KategoriArtikel,
        labelKategori:
            LABEL_KATEGORI_ARTIKEL[(a.category ?? 'berita') as KategoriArtikel] ??
            (a.category ?? 'Berita'),
        tanggal: a.publishedDate ?? null,
        penulis,
        sampul: ringkasGambar(a.cover, a.title),
    }
}

export const ARTIKEL_PER_HALAMAN = 12

/**
 * Daftar artikel yang sudah terbit, terbaru dulu, dengan paginasi.
 *
 * Nomor halaman ikut jadi bagian kunci cache, jadi tiap halaman disimpan
 * terpisah — dan `revalidateTag(TAG.artikel)` membersihkan semuanya sekaligus
 * saat ada artikel baru terbit.
 */
export function ambilDaftarArtikel(halaman = 1): Promise<HalamanArtikel> {
    const aman = Math.max(1, Math.floor(halaman) || 1)

    return unstable_cache(
        async (): Promise<HalamanArtikel> => {
            const payload = await getPayload({ config })
            const hasil = await payload.find({
                collection: 'articles',
                where: { _status: { equals: 'published' } },
                sort: '-publishedDate',
                depth: 1, // resolve relasi `cover` dan `author`
                limit: ARTIKEL_PER_HALAMAN,
                page: aman,
            })

            return {
                artikel: hasil.docs.map(ringkas),
                halaman: aman,
                totalHalaman: hasil.totalPages,
                adaSebelumnya: hasil.hasPrevPage,
                adaBerikutnya: hasil.hasNextPage,
            }
        },
        ['konten:artikel:daftar', String(aman)],
        { tags: [TAG.artikel], revalidate: UMUR_CACHE_DETIK },
    )()
}

/** Satu artikel menurut alamat halamannya (slug). `null` bila tidak ada atau
 *  belum terbit — pemanggil yang memutuskan memanggil `notFound()`. */
export function ambilArtikel(slug: string): Promise<ArtikelLengkap | null> {
    return unstable_cache(
        async (): Promise<ArtikelLengkap | null> => {
            const payload = await getPayload({ config })
            const { docs } = await payload.find({
                collection: 'articles',
                where: { slug: { equals: slug }, _status: { equals: 'published' } },
                depth: 1,
                limit: 1,
            })

            const d = docs[0]
            if (!d) return null

            const isi = d.content ?? ''
            const bersih = bersihkanHtml(isi)

            return {
                ...ringkas(d),
                isiHtml: bersih,
                menitBaca: waktuBaca(bersih),
            }
        },
        ['konten:artikel:detail', slug],
        { tags: [TAG.artikel], revalidate: UMUR_CACHE_DETIK },
    )()
}
