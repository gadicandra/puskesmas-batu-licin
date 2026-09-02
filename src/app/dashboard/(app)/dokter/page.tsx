import { getPayload } from 'payload'
import config from '@payload-config'
import { HARI, labelHari } from '@/lib/hari'
import { unitOptions } from '@/lib/units'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import KoleksiSederhana, { type SpesifikasiField, type BarisData } from '@/components/dashboard/koleksi/KoleksiSederhana'
import { simpanDokter, hapusDokter } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dokter | Dashboard' }

function bangunFields(pilihanLayanan: { value: string; label: string }[]): SpesifikasiField[] {
    return [
        { nama: 'nama', label: 'Nama dokter', tipe: 'teks', wajib: true, diTabel: true, contoh: 'dr. Andi Wijaya' },
        { nama: 'spesialisasi', label: 'Spesialisasi', tipe: 'teks', wajib: true, diTabel: true, contoh: 'Dokter Umum' },
        {
            nama: 'layanan',
            label: 'Bertugas di layanan',
            tipe: 'relasiBanyak',
            pilihan: pilihanLayanan,
            keterangan: 'Centang layanan tempat dokter ini bertugas. Namanya akan tampil di bagian "Tim Dokter" pada halaman layanan tersebut.',
            kosongPilihan: 'Belum ada layanan yang bisa dipilih. Tambahkan dulu di menu Layanan.',
        },
        { nama: 'ringkasLayanan', label: 'Layanan', tipe: 'teks', diTabel: true, hanyaTabel: true },
        {
            // Satu baris satu hari, bukan satu kotak teks bebas. Bentuk inilah
            // yang bisa dirender jadi tabel jadwal mingguan di situs publik;
            // "Senin-Jumat, 08.00-11.00" tidak bisa.
            nama: 'jadwalPraktik',
            label: 'Jadwal praktik',
            tipe: 'daftar',
            labelBaris: 'Jadwal',
            subFields: [
                { nama: 'hari', label: 'Hari', tipe: 'pilihan', pilihan: HARI.map((h) => ({ value: h.value, label: h.label })) },
                { nama: 'jamMulai', label: 'Jam mulai', tipe: 'teks', contoh: '08.00' },
                { nama: 'jamSelesai', label: 'Jam selesai', tipe: 'teks', contoh: '11.00' },
            ],
            keterangan: 'Satu baris untuk satu hari praktik. Hari yang tidak ditulis otomatis tampil sebagai "Libur" di situs.',
        },
        { nama: 'ringkasJadwal', label: 'Jadwal praktik', tipe: 'teks', diTabel: true, hanyaTabel: true },
        { nama: 'poli', label: 'Poli/unit layanan', tipe: 'pilihan', pilihan: [...unitOptions] },
        { nama: 'foto', label: 'Foto', tipe: 'berkas', keterangan: 'Foto wajah menghadap kamera, minimal 800x800 piksel.' },
        { nama: 'aktif', label: 'Tampilkan di website', tipe: 'centang', diTabel: true, keterangan: 'Hanya yang dicentang yang tampil di situs.' },
    ]
}

export default async function HalamanDokter() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const [dokter, layanan] = await Promise.all([
        payload.find({
            collection: 'doctors',
            sort: 'nama',
            limit: 200,
            depth: 1,
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

    const namaLayanan = new Map(layanan.docs.map((l) => [l.id, l.nama]))

    const data = dokter.docs.map((d) => ({
        ...d,
        ringkasJadwal:
            (d.jadwalPraktik ?? [])
                .map((j) => `${labelHari(j.hari)} ${j.jamMulai}-${j.jamSelesai}`)
                .join('; ') || '-',
        ringkasLayanan:
            (d.layanan ?? [])
                .map((l) => (typeof l === 'number' ? namaLayanan.get(l) : l?.nama))
                .filter(Boolean)
                .join(', ') || '-',
    }))

    const pilihanLayanan = layanan.docs.map((l) => ({ value: String(l.id), label: l.nama }))

    return (
        <>
            <PageHeader judul="Dokter" keterangan="Data dokter yang tampil di halaman layanan situs." />
            <KoleksiSederhana
                data={data as unknown as BarisData[]}
                fields={bangunFields(pilihanLayanan)}
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
