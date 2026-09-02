import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import DaftarPengaduan, { type PengaduanRingkas } from '@/components/dashboard/pengaduan/DaftarPengaduan'
import { formatTanggalWaktu } from '@/lib/dashboard/format'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Pengaduan | Dashboard' }

const KATEGORI: Record<string, string> = {
    layanan: 'Mutu Layanan',
    petugas: 'Petugas',
    sarana: 'Sarana & Prasarana',
    saran: 'Saran / Masukan',
    lainnya: 'Lainnya',
}

export default async function HalamanPengaduan() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'complaints',
        // Yang belum ditangani harus terlihat lebih dulu; di antara sesamanya,
        // yang paling baru di atas.
        sort: ['-createdAt'],
        limit: 200,
        depth: 0,
        pagination: false,
        user,
        overrideAccess: false,
    })

    const URUTAN_STATUS: Record<string, number> = { baru: 0, diproses: 1, selesai: 2 }

    const data: PengaduanRingkas[] = docs
        .map((d) => ({
            id: d.id,
            ringkasan: d.ringkasan,
            isi: d.isi,
            nama: d.nama ?? '',
            kontak: d.kontak ?? '',
            kategori: d.kategori ?? 'lainnya',
            labelKategori: KATEGORI[d.kategori ?? 'lainnya'] ?? 'Lainnya',
            status: (d.status ?? 'baru') as PengaduanRingkas['status'],
            tanggapan: d.tanggapan ?? '',
            waktu: formatTanggalWaktu(d.createdAt),
        }))
        .sort((a, b) => URUTAN_STATUS[a.status] - URUTAN_STATUS[b.status])

    const belumSelesai = data.filter((d) => d.status !== 'selesai').length

    return (
        <>
            <PageHeader
                judul="Pengaduan"
                keterangan={
                    belumSelesai > 0
                        ? `${belumSelesai} pengaduan belum selesai ditangani.`
                        : 'Semua pengaduan sudah ditangani.'
                }
            />
            <DaftarPengaduan data={data} />
        </>
    )
}
