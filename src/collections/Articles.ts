import type { CollectionConfig } from 'payload'
import { isLoggedIn, superAdminOrAuthor } from '../access'
import { slugField } from '../fields/slug'

export const Articles: CollectionConfig = {
    slug: 'articles',
    labels: { singular: 'Artikel', plural: 'Artikel' },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'publishedDate', '_status'],
        group: 'Konten',
    },
    versions: {
        drafts: true,
    },
    access: {
        // Publik hanya melihat yang sudah published; admin melihat semua (termasuk draft).
        read: ({ req: { user } }) => {
            if (user) return true
            return { _status: { equals: 'published' } }
        },
        create: isLoggedIn, // superadmin & admin boleh menambah artikel
        update: superAdminOrAuthor, // admin hanya boleh mengubah artikelnya sendiri
        delete: superAdminOrAuthor,
    },
    hooks: {
        beforeChange: [
            // Admin non-super: paksa author = dirinya (tak bisa mengklaim artikel orang lain).
            ({ req, data }) => {
                const u = req.user as { id?: string | number; role?: string } | undefined
                if (u && u.role !== 'superadmin') return { ...data, author: u.id }
                return data
            },
        ],
    },
    fields: [
        { name: 'title', type: 'text', required: true },
        slugField('title'),
        { name: 'cover', type: 'upload', relationTo: 'media' },
        {
            name: 'excerpt',
            type: 'textarea',
            admin: { description: 'Ringkasan singkat untuk daftar & preview.' },
        },
        {
            // Disimpan sebagai HTML dari editor WYSIWYG dashboard (Tiptap), bukan
            // Lexical. Selalu disanitasi di server sebelum simpan & saat render.
            name: 'content',
            type: 'textarea',
            label: 'Isi artikel (HTML)',
        },
        {
            name: 'category',
            type: 'select',
            defaultValue: 'berita',
            options: [
                { label: 'Berita', value: 'berita' },
                { label: 'Pengumuman', value: 'pengumuman' },
                { label: 'Kegiatan', value: 'kegiatan' },
                { label: 'Tips Kesehatan', value: 'kesehatan' },
            ],
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            defaultValue: ({ user }: { user?: { id?: string | number } }) => user?.id,
        },
        {
            name: 'publishedDate',
            type: 'date',
            defaultValue: () => new Date().toISOString(),
            admin: { position: 'sidebar' },
        },
    ],
}
