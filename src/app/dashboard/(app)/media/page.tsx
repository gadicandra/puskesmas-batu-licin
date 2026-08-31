import { requireUser } from '@/lib/dashboard/auth'
import { daftarMedia } from './actions'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import GaleriMedia from '@/components/dashboard/media/GaleriMedia'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Galeri Gambar | Dashboard' }

export default async function MediaPage({
    searchParams,
}: {
    searchParams: Promise<{ cari?: string; page?: string }>
}) {
    const { cari, page } = await searchParams
    await requireUser()
    const halaman = Math.max(1, Number.parseInt(page ?? '1', 10) || 1)
    const hasil = await daftarMedia(cari, halaman)

    return (
        <>
            <PageHeader
                judul="Galeri Gambar"
                keterangan="Semua gambar dan dokumen yang dipakai di website. Unggah di sini sebelum dipasang di artikel."
            />
            <GaleriMedia
                awal={hasil.docs}
                cari={cari ?? ''}
                halaman={hasil.page}
                totalHalaman={hasil.totalPages}
            />
        </>
    )
}
