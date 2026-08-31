import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import KoleksiSederhana, { type SpesifikasiField, type BarisData } from '@/components/dashboard/koleksi/KoleksiSederhana'
import { simpanVaksin, hapusVaksin } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Vaksin | Dashboard' }

const FIELDS: SpesifikasiField[] = [
    { nama: 'nama', label: 'Nama vaksin', tipe: 'teks', wajib: true, diTabel: true },
    { nama: 'jenis', label: 'Jenis', tipe: 'teks', diTabel: true, contoh: 'Campak, Polio, DPT-HB-Hib' },
    { nama: 'stok', label: 'Stok', tipe: 'angka', wajib: true, diTabel: true },
    { nama: 'satuan', label: 'Satuan', tipe: 'teks', diTabel: true, contoh: 'dosis' },
    { nama: 'keterangan', label: 'Keterangan', tipe: 'panjang' },
]

export default async function HalamanVaksin() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'vaccines',
        sort: 'stok',
        limit: 200,
        depth: 1,
        pagination: false,
        user,
        overrideAccess: false,
    })

    return (
        <>
            <PageHeader judul="Vaksin" keterangan="Stok vaksin. Stok di bawah 20 akan muncul sebagai peringatan di beranda." />
            <KoleksiSederhana
                data={docs as unknown as BarisData[]}
                fields={FIELDS}
                simpanAksi={simpanVaksin}
                hapusAksi={hapusVaksin}
                labelSatuan="Vaksin"
                kunciJudul="nama"
                kosongJudul="Belum ada data vaksin"
                kosongKeterangan="Tambahkan jenis vaksin beserta stoknya."
            />
        </>
    )
}
