import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import KoleksiSederhana, { type SpesifikasiField, type BarisData } from '@/components/dashboard/koleksi/KoleksiSederhana'
import { simpanLayanan, hapusLayanan } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Layanan | Dashboard' }

const KATEGORI = [
    { value: 'dalam-gedung', label: 'Dalam Gedung' },
    { value: 'luar-gedung', label: 'Luar Gedung (UKM)' },
    { value: 'posyandu', label: 'Posyandu' },
]

function bangunFields(pilihanInduk: { value: string; label: string }[]): SpesifikasiField[] {
    return [
        { nama: 'nama', label: 'Nama layanan', tipe: 'teks', wajib: true, diTabel: true, contoh: 'Pemeriksaan Umum' },
        { nama: 'kategori', label: 'Kategori', tipe: 'pilihan', wajib: true, pilihan: KATEGORI },
        { nama: 'labelKategori', label: 'Kategori', tipe: 'teks', diTabel: true, hanyaTabel: true },
        {
            nama: 'induk',
            label: 'Bagian dari layanan lain',
            tipe: 'relasi',
            pilihan: pilihanInduk,
            bukanDiriSendiri: true,
            keterangan: 'Kosongkan bila ini layanan utama. Isi bila ini rincian dari layanan lain, mis. "Widal Test" bagian dari "Laboratorium".',
        },
        { nama: 'namaInduk', label: 'Bagian dari', tipe: 'teks', diTabel: true, hanyaTabel: true },
        {
            nama: 'jadwal',
            label: 'Waktu pelayanan',
            tipe: 'teks',
            diTabel: true,
            contoh: 'Senin–Kamis 08.00–11.00',
            keterangan: 'Ditulis apa adanya. Contoh lain: "24 jam", "Sesuai Jadwal", "Jika ada kasus".',
        },
        {
            nama: 'deskripsi',
            label: 'Penjelasan untuk warga',
            tipe: 'panjang',
            keterangan: 'Hindari istilah medis yang tidak umum.',
        },
        {
            nama: 'persyaratan',
            label: 'Syarat & berkas yang dibawa',
            tipe: 'daftar',
            labelBaris: 'Syarat',
            subFields: [{ nama: 'isi', label: 'Syarat', tipe: 'teks', contoh: 'Kartu BPJS' }],
            keterangan: 'Satu baris satu syarat. Boleh dikosongkan.',
        },
        { nama: 'urutan', label: 'Urutan tampil', tipe: 'angka', keterangan: 'Angka lebih kecil tampil lebih dulu. Isi 0 bila tidak ingin diatur.' },
        { nama: 'aktif', label: 'Tampilkan di situs', tipe: 'centang', diTabel: true },
    ]
}

export default async function HalamanLayanan() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'services',
        sort: ['urutan', 'nama'],
        limit: 500,
        depth: 0, // `induk` cukup berupa id; namanya dicari dari daftar ini juga
        pagination: false,
        user,
        overrideAccess: false,
    })

    const namaPerId = new Map(docs.map((d) => [d.id, d.nama]))
    const data = docs.map((d) => ({
        ...d,
        labelKategori: KATEGORI.find((k) => k.value === d.kategori)?.label ?? d.kategori,
        namaInduk: typeof d.induk === 'number' ? (namaPerId.get(d.induk) ?? '-') : '-',
    }))

    const pilihanInduk = docs.map((d) => ({ value: String(d.id), label: d.nama }))

    return (
        <>
            <PageHeader
                judul="Layanan"
                keterangan="Daftar layanan Puskesmas. Layanan yang punya induk tampil sebagai rincian di halaman induknya."
            />
            <KoleksiSederhana
                data={data as unknown as BarisData[]}
                fields={bangunFields(pilihanInduk)}
                simpanAksi={simpanLayanan}
                hapusAksi={hapusLayanan}
                labelSatuan="Layanan"
                kunciJudul="nama"
                kosongJudul="Belum ada data layanan"
                kosongKeterangan="Tambahkan layanan sesuai SK Jenis Pelayanan."
            />
        </>
    )
}
