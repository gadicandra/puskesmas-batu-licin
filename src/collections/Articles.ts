import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '../access'
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
        create: isLoggedIn,
        update: isLoggedIn,
        delete: isLoggedIn,
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
        { name: 'content', type: 'richText' },
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
