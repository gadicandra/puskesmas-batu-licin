import type { CollectionConfig } from 'payload'
import { isSuperAdmin, superAdminFieldAccess } from '../access'

/** Pengaduan & saran dari warga.
 *
 *  Pola aksesnya berbeda dari koleksi lain di proyek ini, dan itu disengaja:
 *  siapa pun boleh MENGIRIM, tapi hanya superadmin yang boleh MEMBACA. Isi
 *  pengaduan sering memuat keluhan pribadi tentang layanan atau petugas
 *  tertentu; membiarkannya terbaca publik — atau bahkan oleh admin unit yang
 *  diadukan — akan membuat warga berhenti mengadu.
 *
 *  `read: isSuperAdmin` juga berarti koleksi ini TIDAK boleh punya fungsi baca
 *  di `src/lib/konten/` — tidak ada yang perlu ditampilkan di situs publik. */
export const Complaints: CollectionConfig = {
    slug: 'complaints',
    labels: { singular: 'Pengaduan', plural: 'Pengaduan' },
    admin: {
        useAsTitle: 'ringkasan',
        defaultColumns: ['ringkasan', 'status', 'createdAt'],
        group: 'Layanan',
    },
    access: {
        // Dikirim lewat formulir publik. Route-nya yang menahan spam
        // (rate limit + filter bot), meniru pola src/app/api/track/route.ts.
        create: () => true,
        read: isSuperAdmin,
        update: isSuperAdmin,
        delete: isSuperAdmin,
    },
    fields: [
        {
            name: 'ringkasan',
            type: 'text',
            required: true,
            label: 'Ringkasan / Judul',
            admin: { description: 'Satu kalimat pokok masalahnya.' },
        },
        { name: 'isi', type: 'textarea', required: true, label: 'Isi Pengaduan' },
        {
            name: 'nama',
            type: 'text',
            admin: { description: 'Boleh dikosongkan bila pengadu ingin anonim.' },
        },
        {
            name: 'kontak',
            type: 'text',
            admin: { description: 'Nomor HP atau email, untuk menyampaikan tanggapan.' },
        },
        {
            name: 'kategori',
            type: 'select',
            defaultValue: 'layanan',
            options: [
                { label: 'Mutu Layanan', value: 'layanan' },
                { label: 'Petugas', value: 'petugas' },
                { label: 'Sarana & Prasarana', value: 'sarana' },
                { label: 'Saran / Masukan', value: 'saran' },
                { label: 'Lainnya', value: 'lainnya' },
            ],
        },
        {
            // Wajib disetujui pengadu sebelum kirim — lihat C3 di
            // docs/PROJECT_PLAN.md. Divalidasi juga di route publiknya.
            name: 'persetujuanPrivasi',
            type: 'checkbox',
            required: true,
            label: 'Pengadu menyetujui penyimpanan datanya',
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            defaultValue: 'baru',
            options: [
                { label: 'Baru', value: 'baru' },
                { label: 'Sedang Diproses', value: 'diproses' },
                { label: 'Selesai', value: 'selesai' },
            ],
            access: {
                // Pengirim tidak boleh menentukan status pengaduannya sendiri.
                create: superAdminFieldAccess,
                update: superAdminFieldAccess,
            },
        },
        {
            name: 'tanggapan',
            type: 'textarea',
            label: 'Tanggapan Puskesmas',
            access: {
                create: superAdminFieldAccess,
                update: superAdminFieldAccess,
            },
        },
    ],
}
