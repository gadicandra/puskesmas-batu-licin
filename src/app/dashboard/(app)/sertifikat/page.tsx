import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import KoleksiSederhana, { type SpesifikasiField, type BarisData } from '@/components/dashboard/koleksi/KoleksiSederhana'
import { simpanSertifikat, hapusSertifikat } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Sertifikat & Akreditasi | Dashboard' }

const FIELDS: SpesifikasiField[] = [
    { nama: 'judul', label: 'Judul sertifikat', tipe: 'teks', wajib: true, diTabel: true },
    { nama: 'penerbit', label: 'Diterbitkan oleh', tipe: 'teks', diTabel: true, contoh: 'Kementerian Kesehatan RI' },
    { nama: 'tanggal', label: 'Tanggal terbit', tipe: 'tanggal', diTabel: true },
    { nama: 'berkas', label: 'Berkas dokumen (PDF)', tipe: 'berkas', keterangan: 'Unggah dulu di Galeri Gambar bila belum ada.' },
    { nama: 'keterangan', label: 'Keterangan', tipe: 'panjang' },
]

export default async function HalamanSertifikat() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'certificates',
        sort: '-tanggal',
        limit: 200,
        depth: 1,
        pagination: false,
        user,
        overrideAccess: false,
    })

    return (
        <>
            <PageHeader judul="Sertifikat & Akreditasi" keterangan="Dokumen akreditasi dan penghargaan yang tampil di situs." />
            <KoleksiSederhana
                data={docs as unknown as BarisData[]}
                fields={FIELDS}
                simpanAksi={simpanSertifikat}
                hapusAksi={hapusSertifikat}
                labelSatuan="Sertifikat"
                kunciJudul="judul"
                kosongJudul="Belum ada sertifikat"
                kosongKeterangan="Unggah dokumen akreditasi atau penghargaan Puskesmas."
            />
        </>
    )
}
