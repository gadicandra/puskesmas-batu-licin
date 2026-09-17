import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'
import { endpointDaftarPosyandu, endpointDetailPosyandu } from '../lib/api/posyandu'
import { periksaFotoPosyandu } from '../lib/foto-posyandu'
import { periksaJadwalPosyandu, type BarisJadwalMentah } from '../lib/jadwal-posyandu'
import { HARI } from '../lib/hari'
import { TAG } from '../lib/konten/tags'

/** Segarkan cache situs publik (`ambilPosyandu()` di /posyandu dan seksi
 *  posyandu di /profil-puskesmas) setelah data berubah.
 *
 *  Server action dashboard sudah memanggil `revalidateTag` sendiri, tapi
 *  perubahan lewat REST (`POST/PATCH/DELETE /api/posyandu`) tidak melewati
 *  server action — tanpa hook ini situs baru ikut berubah setelah cache
 *  kedaluwarsa (maks. 1 jam).
 *
 *  `next/cache` diimpor dinamis dan kegagalannya diabaikan: hook ini juga
 *  berjalan di luar server Next (`pnpm contoh-posyandu`, `payload run`), dan di
 *  sana `revalidateTag` melempar error karena tidak ada cache Next untuk
 *  disegarkan. Menggagalkan penyimpanan karena itu justru salah. */
async function segarkanSitusPublik() {
    try {
        const { revalidateTag } = await import('next/cache')
        revalidateTag(TAG.posyandu)
    } catch {
        // Di luar request Next — tidak ada cache yang perlu disegarkan.
    }
}

/** Posyandu di wilayah kerja Puskesmas Batulicin, beserta layanan yang
 *  tersedia di masing-masing. */
export const Posyandu: CollectionConfig = {
    slug: 'posyandu',
    labels: { singular: 'Posyandu', plural: 'Posyandu' },
    admin: {
        useAsTitle: 'nama',
        defaultColumns: ['nama', 'desa', 'penanggungJawab', 'aktif'],
        group: 'Layanan',
    },
    access: {
        // Publik (REST, GraphQL, tanpa login) hanya melihat posyandu aktif.
        // Superadmin melihat semuanya — dashboard perlu menampilkan yang
        // nonaktif supaya bisa diaktifkan kembali.
        read: ({ req: { user } }) => {
            if ((user as { role?: string } | null)?.role === 'superadmin') return true
            return { aktif: { equals: true } }
        },
        create: isSuperAdmin,
        update: isSuperAdmin,
        delete: isSuperAdmin,
    },
    // Bentuk respons GET mengikuti kontrak API (Claude.md §3.6). Lihat
    // src/lib/api/posyandu.ts.
    endpoints: [endpointDaftarPosyandu, endpointDetailPosyandu],
    hooks: {
        afterChange: [
            async ({ doc }) => {
                await segarkanSitusPublik()
                return doc
            },
        ],
        afterDelete: [
            async ({ doc }) => {
                await segarkanSitusPublik()
                return doc
            },
        ],
    },
    fields: [
        { name: 'nama', type: 'text', required: true },
        {
            name: 'deskripsi',
            type: 'text',
            admin: {
                description:
                    'Satu baris keterangan di bawah nama pada kartu di halaman Posyandu. Boleh dikosongkan.',
            },
        },
        {
            name: 'foto',
            type: 'upload',
            relationTo: 'media',
            label: 'Foto Posyandu',
            admin: { description: 'Tampil sebagai gambar kecil di kartu. JPG, PNG, atau WebP, maks. 5 MB.' },
            validate: async (value: unknown, { req }: { req: import('payload').PayloadRequest }) =>
                (await periksaFotoPosyandu(req.payload, value, req)) ?? true,
        },
        {
            // Dipisah dari `alamat` karena inilah yang tampil di kartu: warga
            // mencari posyandu terdekat lewat nama desa/kelurahan, bukan lewat
            // RT/RW. Alamat lengkapnya tetap disimpan untuk keperluan lain.
            name: 'desa',
            type: 'text',
            label: 'Desa / Kelurahan',
            admin: { description: 'Mis. "Desa Batulicin". Inilah yang tampil di kartu.' },
        },
        { name: 'alamat', type: 'textarea', admin: { description: 'Alamat lengkap atau titik kumpul. Boleh dikosongkan.' } },
        {
            // Relasi ke katalog, bukan daftar teks. Nama layanan cukup diperbaiki
            // sekali di koleksi Layanan dan ikut berubah di semua posyandu.
            name: 'layanan',
            type: 'relationship',
            relationTo: 'services',
            hasMany: true,
            admin: { description: 'Layanan yang tersedia di posyandu ini.' },
        },
        {
            name: 'jadwal',
            type: 'array',
            label: 'Jadwal Kegiatan',
            labels: { singular: 'Jadwal', plural: 'Jadwal' },
            // Jam harus berpasangan dan jam selesai > jam mulai. Lihat
            // src/lib/jadwal-posyandu.ts.
            validate: (value: unknown) =>
                periksaJadwalPosyandu(value as BarisJadwalMentah[] | null | undefined) ?? true,
            fields: [
                { name: 'hari', type: 'select', required: true, options: [...HARI] },
                {
                    // Terstruktur, bukan disatukan ke `keterangan`, karena kartu
                    // di situs merender polanya dan jamnya sebagai dua baris
                    // terpisah dengan ikon masing-masing.
                    name: 'polaMinggu',
                    type: 'text',
                    label: 'Minggu ke-',
                    admin: { description: 'Mis. "Minggu ke-1". Kosongkan bila kegiatannya setiap minggu.' },
                },
                { name: 'jamMulai', type: 'text', label: 'Jam mulai', admin: { description: 'Format 24 jam, mis. "08:00".' } },
                { name: 'jamSelesai', type: 'text', label: 'Jam selesai', admin: { description: 'Format 24 jam, mis. "11:00".' } },
                {
                    // Sisa dari skema lama, dipertahankan supaya catatan yang
                    // sudah diketik staf tidak hilang. Tampil di kartu hanya
                    // bila jam mulai/selesai dikosongkan.
                    name: 'keterangan',
                    type: 'text',
                    admin: { description: 'Catatan tambahan. Boleh dikosongkan.' },
                },
            ],
        },
        { name: 'penanggungJawab', type: 'text', label: 'Penanggung Jawab' },
        {
            name: 'kontak',
            type: 'text',
            admin: { description: 'Nomor telepon kader atau penanggung jawab. Boleh dikosongkan.' },
        },
        {
            name: 'urutan',
            type: 'number',
            defaultValue: 0,
            admin: { position: 'sidebar', description: 'Angka lebih kecil tampil lebih dulu.' },
        },
        { name: 'aktif', type: 'checkbox', defaultValue: true },
    ],
}
