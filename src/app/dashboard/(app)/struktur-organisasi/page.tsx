import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import type { SpesifikasiField } from '@/components/dashboard/koleksi/KoleksiSederhana'
import PenjelajahBagan from '@/components/dashboard/struktur/PenjelajahBagan'
import type { SimpulBagan } from '@/lib/dashboard/bagan'
import { simpanJabatan, hapusJabatan } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Struktur Organisasi | Dashboard' }

function bangunFields(pilihanAtasan: { value: string; label: string }[]): SpesifikasiField[] {
    return [
        { nama: 'jabatan', label: 'Nama jabatan', tipe: 'teks', wajib: true, contoh: 'Kepala Tata Usaha' },
        { nama: 'labelJabatan', label: 'Jabatan', tipe: 'teks', diTabel: true, hanyaTabel: true },
        {
            nama: 'nama',
            label: 'Nama pejabat',
            tipe: 'teks',
            diTabel: true,
            contoh: 'dr. Nama Lengkap',
            keterangan: 'Kosongkan bila posisinya sedang lowong.',
        },
        {
            nama: 'atasan',
            label: 'Jabatan atasannya',
            tipe: 'relasi',
            pilihan: pilihanAtasan,
            bukanDiriSendiri: true,
            keterangan: 'Kosongkan hanya untuk Kepala Puskesmas — puncak bagan.',
        },
        { nama: 'namaAtasan', label: 'Di bawah', tipe: 'teks', diTabel: true, hanyaTabel: true },
        { nama: 'foto', label: 'Foto', tipe: 'berkas', keterangan: 'Pilih dari Galeri Gambar. Boleh dikosongkan.' },
        {
            nama: 'urutan',
            label: 'Urutan tampil',
            tipe: 'angka',
            diTabel: true,
            keterangan: 'Urutan di antara jabatan yang atasannya sama. Angka lebih kecil tampil lebih dulu.',
        },
    ]
}

export default async function HalamanStrukturOrganisasi() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'org-chart',
        limit: 300,
        depth: 0,
        pagination: false,
        user,
        overrideAccess: false,
    })

    const daftar = docs as unknown as SimpulBagan[]

    // Penyusunan bagan dan indentasinya dikerjakan di komponen klien, bukan di
    // sini: isinya berubah setiap kali staf membuka sebuah klaster, dan
    // menghitungnya ulang di server berarti memuat ulang halaman untuk sesuatu
    // yang datanya sudah ada seluruhnya di browser.
    const pilihanAtasan = [...daftar]
        .sort((a, b) => a.jabatan.localeCompare(b.jabatan))
        .map((d) => ({ value: String(d.id), label: d.jabatan }))

    return (
        <>
            <PageHeader
                judul="Struktur Organisasi"
                keterangan="Tekan nama klaster untuk melihat isinya saja. Susunannya mengikuti isian “Jabatan atasannya”."
            />
            <PenjelajahBagan
                docs={daftar}
                fields={bangunFields(pilihanAtasan)}
                simpanAksi={simpanJabatan}
                hapusAksi={hapusJabatan}
            />
        </>
    )
}
