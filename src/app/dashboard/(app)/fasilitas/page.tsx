import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import KoleksiSederhana, { type SpesifikasiField, type BarisData } from '@/components/dashboard/koleksi/KoleksiSederhana'
import { simpanFasilitas, hapusFasilitas } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Fasilitas | Dashboard' }

const KATEGORI = [
    { value: 'ruang', label: 'Ruang Pelayanan' },
    { value: 'kantor', label: 'Ruang Kantor' },
    { value: 'alat', label: 'Alat Kesehatan' },
    { value: 'kendaraan', label: 'Kendaraan' },
    { value: 'penunjang', label: 'Sarana Penunjang' },
]

const FIELDS: SpesifikasiField[] = [
    { nama: 'nama', label: 'Nama fasilitas', tipe: 'teks', wajib: true, diTabel: true, contoh: 'Ruang Pemeriksaan Umum' },
    { nama: 'kategori', label: 'Kategori', tipe: 'pilihan', wajib: true, pilihan: KATEGORI },
    { nama: 'labelKategori', label: 'Kategori', tipe: 'teks', diTabel: true, hanyaTabel: true },
    { nama: 'jumlah', label: 'Jumlah', tipe: 'angka', diTabel: true, keterangan: 'Banyaknya unit. Kosongkan bila tidak relevan.' },
    { nama: 'deskripsi', label: 'Keterangan', tipe: 'panjang', contoh: 'Penjelasan singkat untuk warga.' },
    { nama: 'foto', label: 'Foto', tipe: 'berkas', keterangan: 'Pilih dari Galeri Gambar. Boleh dikosongkan.' },
    { nama: 'urutan', label: 'Urutan tampil', tipe: 'angka', keterangan: 'Angka lebih kecil tampil lebih dulu. Isi 0 bila tidak ingin diatur.' },
    { nama: 'aktif', label: 'Tampilkan di situs', tipe: 'centang', diTabel: true },
]

export default async function HalamanFasilitas() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'facilities',
        sort: ['urutan', 'nama'],
        limit: 300,
        depth: 1,
        pagination: false,
        user,
        overrideAccess: false,
    })

    // Kolom kategori disiapkan di sini, bukan di komponen tabel: tabelnya
    // hanya menampilkan apa adanya, dan kode kategori ("penunjang") bukan
    // kata yang perlu dibaca staf.
    const data = docs.map((d) => ({
        ...d,
        labelKategori: KATEGORI.find((k) => k.value === d.kategori)?.label ?? d.kategori,
    }))

    return (
        <>
            <PageHeader
                judul="Fasilitas"
                keterangan="Ruang, alat, kendaraan, dan sarana penunjang yang tampil di halaman profil."
            />
            <KoleksiSederhana
                data={data as unknown as BarisData[]}
                fields={FIELDS}
                simpanAksi={simpanFasilitas}
                hapusAksi={hapusFasilitas}
                labelSatuan="Fasilitas"
                kunciJudul="nama"
                kosongJudul="Belum ada data fasilitas"
                kosongKeterangan="Tambahkan ruang, alat, atau sarana yang dimiliki Puskesmas."
            />
        </>
    )
}
