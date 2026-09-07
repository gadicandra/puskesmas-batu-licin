'use server'

import { revalidatePath } from 'next/cache'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { requireUser } from '@/lib/dashboard/auth'
import { pesanError } from '@/lib/dashboard/errors'
import { keWebp } from '@/lib/gambar'
import { formatUkuran } from '@/lib/dashboard/format'

export type MediaRingkas = {
    id: number
    url: string
    thumbnailUrl: string
    alt: string
    filename: string
    filesize: number
    createdAt: string
}

const MAKS_UKURAN = 5_000_000 // sesuai batas upload di payload.config.ts
const TIPE_DIIZINKAN = /^(image\/|application\/pdf$)/

/** Daftar berkas untuk galeri & pemilih gambar. */
export async function daftarMedia(cari?: string, halaman = 1, perHalaman = 5) {
    await requireUser()
    const payload = await getPayload({ config })

    const where: Where = cari?.trim()
        ? { or: [{ alt: { like: cari.trim() } }, { filename: { like: cari.trim() } }] }
        : {}

    const hasil = await payload.find({
        collection: 'media',
        where,
        sort: '-createdAt',
        limit: perHalaman,
        page: halaman,
        depth: 0,
    })

    return {
        docs: hasil.docs.map((m): MediaRingkas => ({
            id: m.id,
            url: m.url ?? '',
            thumbnailUrl: m.sizes?.thumbnail?.url || m.url || '',
            alt: m.alt ?? '',
            filename: m.filename ?? '',
            filesize: m.filesize ?? 0,
            createdAt: m.createdAt,
        })),
        totalPages: hasil.totalPages,
        page: hasil.page ?? 1,
        totalDocs: hasil.totalDocs,
    }
}

export type UploadState = { error?: string; sukses?: string }

/** Unggah satu berkas. Validasi ukuran & tipe dilakukan lagi di server —
 *  pemeriksaan di browser hanya untuk kenyamanan, bukan pengaman.
 *
 *  Gambar diubah ke WebP di sini, sebelum diserahkan ke Payload — lihat
 *  `src/lib/gambar.ts` untuk alasannya. Berkas dokumen (sertifikat, piagam)
 *  dikecualikan lewat `pertahankanAsli`. */
export async function unggahMedia(_prev: UploadState, formData: FormData): Promise<UploadState> {
    const user = await requireUser()
    const berkas = formData.get('file')
    const alt = String(formData.get('alt') || '').trim()
    const pertahankanAsli = formData.get('pertahankanAsli') === '1'

    if (!(berkas instanceof File) || berkas.size === 0) {
        return { error: 'Belum ada berkas yang dipilih.' }
    }
    if (!alt) {
        return { error: 'Keterangan gambar wajib diisi supaya bisa dibaca pengguna tunanetra.' }
    }
    if (berkas.size > MAKS_UKURAN) {
        const mb = (berkas.size / 1_000_000).toFixed(1)
        return { error: `Ukuran berkas maksimal 5MB. Berkas ini ${mb}MB — coba perkecil dulu.` }
    }
    if (!TIPE_DIIZINKAN.test(berkas.type)) {
        return { error: 'Hanya gambar (JPG, PNG, WebP) dan PDF yang bisa diunggah.' }
    }

    const asli = {
        data: Buffer.from(await berkas.arrayBuffer()),
        mimetype: berkas.type,
        name: berkas.name,
        size: berkas.size,
    }
    // `keWebp` mengembalikan berkas apa adanya bila tidak bisa/tidak layak
    // diubah (PDF, SVG, atau sudah WebP), jadi tidak perlu dicek di sini.
    const siap = pertahankanAsli ? asli : await keWebp(asli)

    try {
        const payload = await getPayload({ config })
        await payload.create({
            collection: 'media',
            data: { alt },
            file: siap,
            user,
            overrideAccess: false,
        })
    } catch (err) {
        return { error: pesanError(err) }
    }

    revalidatePath('/dashboard/media')

    const dikonversi = siap.mimetype !== asli.mimetype
    return {
        sukses: dikonversi
            ? `Gambar berhasil diunggah dan diperkecil ke WebP (${formatUkuran(asli.size)} → ${formatUkuran(siap.size)}).`
            : 'Gambar berhasil diunggah.',
    }
}

export type HapusState = { error?: string; sukses?: string }

/** Hapus berkas. Sebelum dihapus, dicek dulu apakah masih dipakai di artikel,
 *  dokter, tenaga medis, atau sertifikat — jangan sampai gambar hilang diam-diam. */
export async function hapusMedia(_prev: HapusState, formData: FormData): Promise<HapusState> {
    const user = await requireUser()
    const id = Number(formData.get('id'))
    if (!id) return { error: 'Berkas tidak dikenali.' }

    const payload = await getPayload({ config })

    const [artikel, dokter, tenaga, sertifikat] = await Promise.all([
        payload.count({ collection: 'articles', where: { cover: { equals: id } } }),
        payload.count({ collection: 'doctors', where: { foto: { equals: id } } }),
        payload.count({ collection: 'medical-staff', where: { foto: { equals: id } } }),
        payload.count({ collection: 'certificates', where: { berkas: { equals: id } } }),
    ])

    const dipakai =
        artikel.totalDocs + dokter.totalDocs + tenaga.totalDocs + sertifikat.totalDocs

    if (dipakai > 0) {
        const rincian = [
            artikel.totalDocs && `${artikel.totalDocs} artikel`,
            dokter.totalDocs && `${dokter.totalDocs} data dokter`,
            tenaga.totalDocs && `${tenaga.totalDocs} data tenaga medis`,
            sertifikat.totalDocs && `${sertifikat.totalDocs} sertifikat`,
        ]
            .filter(Boolean)
            .join(', ')
        return {
            error: `Berkas ini masih dipakai di ${rincian}. Ganti dulu gambarnya di sana, baru berkas ini bisa dihapus.`,
        }
    }

    try {
        await payload.delete({ collection: 'media', id, user, overrideAccess: false })
    } catch (err) {
        return { error: pesanError(err) }
    }

    revalidatePath('/dashboard/media')
    return { sukses: 'Berkas dihapus.' }
}
