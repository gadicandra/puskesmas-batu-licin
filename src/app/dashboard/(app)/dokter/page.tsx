import { getPayload } from 'payload'
import config from '@payload-config'
import { unitOptions } from '@/lib/units'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import KoleksiSederhana, { type SpesifikasiField, type BarisData } from '@/components/dashboard/koleksi/KoleksiSederhana'
import { simpanDokter, hapusDokter } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dokter | Dashboard' }

const FIELDS: SpesifikasiField[] = [
    { nama: 'nama', label: 'Nama dokter', tipe: 'teks', wajib: true, diTabel: true, contoh: 'dr. Andi Wijaya' },
    { nama: 'spesialisasi', label: 'Spesialisasi', tipe: 'teks', wajib: true, diTabel: true, contoh: 'Dokter Umum' },
    { nama: 'jadwalPraktik', label: 'Jadwal praktik', tipe: 'teks', diTabel: true, contoh: 'Senin-Jumat, 08.00-11.00' },
    { nama: 'poli', label: 'Poli/unit layanan', tipe: 'pilihan', pilihan: [...unitOptions] },
    { nama: 'foto', label: 'Foto', tipe: 'berkas', keterangan: 'Foto wajah menghadap kamera, minimal 800x800 piksel.' },
    { nama: 'aktif', label: 'Tampilkan di website', tipe: 'centang', diTabel: true, keterangan: 'Hanya yang dicentang yang tampil di situs.' },
]

export default async function HalamanDokter() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'doctors',
        sort: 'nama',
        limit: 200,
        depth: 1,
        pagination: false,
        user,
        overrideAccess: false,
    })

    return (
        <>
            <PageHeader judul="Dokter" keterangan="Data dokter yang tampil di halaman layanan situs." />
            <KoleksiSederhana
                data={docs as unknown as BarisData[]}
                fields={FIELDS}
                simpanAksi={simpanDokter}
                hapusAksi={hapusDokter}
                labelSatuan="Dokter"
                kunciJudul="nama"
                kosongJudul="Belum ada data dokter"
                kosongKeterangan="Tambahkan dokter agar jadwal praktiknya tampil di website."
            />
        </>
    )
}
