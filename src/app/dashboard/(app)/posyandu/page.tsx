import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import KoleksiSederhana, { type SpesifikasiField, type BarisData } from '@/components/dashboard/koleksi/KoleksiSederhana'
import { HARI, labelHari } from '@/lib/hari'
import { simpanPosyandu, hapusPosyandu } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Posyandu | Dashboard' }

function bangunFields(pilihanLayanan: { value: string; label: string }[]): SpesifikasiField[] {
    return [
        { nama: 'nama', label: 'Nama posyandu', tipe: 'teks', wajib: true, diTabel: true, contoh: 'Posyandu Melati' },
        { nama: 'alamat', label: 'Alamat', tipe: 'panjang', contoh: 'RT/RW, desa atau kelurahan.' },
        {
            nama: 'layanan',
            label: 'Layanan yang tersedia',
            tipe: 'relasiBanyak',
            pilihan: pilihanLayanan,
            kosongPilihan: 'Belum ada data layanan. Isi menu Layanan lebih dulu, lalu kembali ke sini.',
            keterangan: 'Centang layanan yang benar-benar ada di posyandu ini.',
        },
        {
            nama: 'jadwal',
            label: 'Jadwal kegiatan',
            tipe: 'daftar',
            labelBaris: 'Jadwal',
            subFields: [
                { nama: 'hari', label: 'Hari', tipe: 'pilihan', pilihan: HARI.map((h) => ({ value: h.value, label: h.label })) },
                { nama: 'keterangan', label: 'Keterangan', tipe: 'teks', contoh: 'Minggu ke-2 setiap bulan, 08.00–11.00' },
            ],
            keterangan: 'Satu baris untuk satu hari kegiatan.',
        },
        { nama: 'ringkasJadwal', label: 'Jadwal', tipe: 'teks', diTabel: true, hanyaTabel: true },
        { nama: 'penanggungJawab', label: 'Penanggung jawab', tipe: 'teks', diTabel: true, contoh: 'Nama kader atau bidan penanggung jawab' },
        { nama: 'kontak', label: 'Nomor yang bisa dihubungi', tipe: 'teks', contoh: '0812xxxxxxx', keterangan: 'Boleh dikosongkan.' },
        { nama: 'urutan', label: 'Urutan tampil', tipe: 'angka', keterangan: 'Angka lebih kecil tampil lebih dulu. Isi 0 bila tidak ingin diatur.' },
        { nama: 'aktif', label: 'Tampilkan di situs', tipe: 'centang', diTabel: true },
    ]
}

export default async function HalamanPosyandu() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const [posyandu, layanan] = await Promise.all([
        payload.find({
            collection: 'posyandu',
            sort: ['urutan', 'nama'],
            limit: 300,
            depth: 0, // relasi `layanan` cukup berupa id; namanya diambil dari daftar layanan
            pagination: false,
            user,
            overrideAccess: false,
        }),
        payload.find({
            collection: 'services',
            sort: ['urutan', 'nama'],
            limit: 500,
            depth: 0,
            pagination: false,
            user,
            overrideAccess: false,
        }),
    ])

    // Jadwal diringkas jadi satu kalimat untuk tabel. Menampilkan array mentah
    // di kolom tabel hanya menghasilkan "[object Object]".
    const data = posyandu.docs.map((d) => ({
        ...d,
        ringkasJadwal:
            (d.jadwal ?? [])
                .map((j) => [labelHari(j.hari), j.keterangan].filter(Boolean).join(' — '))
                .join('; ') || '-',
    }))

    const pilihanLayanan = layanan.docs.map((l) => ({ value: String(l.id), label: l.nama }))

    return (
        <>
            <PageHeader
                judul="Posyandu"
                keterangan="Daftar posyandu di wilayah kerja Puskesmas beserta jadwal dan layanannya."
            />
            <KoleksiSederhana
                data={data as unknown as BarisData[]}
                fields={bangunFields(pilihanLayanan)}
                simpanAksi={simpanPosyandu}
                hapusAksi={hapusPosyandu}
                labelSatuan="Posyandu"
                kunciJudul="nama"
                kosongJudul="Belum ada data posyandu"
                kosongKeterangan="Tambahkan posyandu beserta hari kegiatannya agar warga tahu jadwalnya."
            />
        </>
    )
}
