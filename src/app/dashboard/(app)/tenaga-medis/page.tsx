import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import KoleksiSederhana, { type SpesifikasiField, type BarisData } from '@/components/dashboard/koleksi/KoleksiSederhana'
import { simpanTenagaMedis, hapusTenagaMedis } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tenaga Medis | Dashboard' }

const FIELDS: SpesifikasiField[] = [
    { nama: 'nama', label: 'Nama', tipe: 'teks', wajib: true, diTabel: true },
    { nama: 'jabatan', label: 'Jabatan', tipe: 'teks', diTabel: true, contoh: 'Perawat' },
    { nama: 'foto', label: 'Foto', tipe: 'berkas' },
    { nama: 'aktif', label: 'Tampilkan di website', tipe: 'centang', diTabel: true },
]

export default async function HalamanTenagaMedis() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'medical-staff',
        sort: 'nama',
        limit: 200,
        depth: 1,
        pagination: false,
        user,
        overrideAccess: false,
    })

    return (
        <>
            <PageHeader judul="Tenaga Medis" keterangan="Perawat, bidan, dan tenaga kesehatan lain." />
            <KoleksiSederhana
                data={docs as unknown as BarisData[]}
                fields={FIELDS}
                simpanAksi={simpanTenagaMedis}
                hapusAksi={hapusTenagaMedis}
                labelSatuan="Tenaga Medis"
                kunciJudul="nama"
                kosongJudul="Belum ada data tenaga medis"
                kosongKeterangan="Tambahkan tenaga medis agar tampil di halaman profil."
            />
        </>
    )
}
