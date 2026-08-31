import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireUser } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import ArticleForm from '@/components/dashboard/artikel/ArticleForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Ubah Artikel | Dashboard' }

export default async function UbahArtikelPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await requireUser()
    const payload = await getPayload({ config })

    let artikel
    try {
        artikel = await payload.findByID({
            collection: 'articles',
            id: Number(id),
            depth: 1,
            draft: true,
            user,
            overrideAccess: false, // admin unit hanya boleh membuka artikelnya sendiri
        })
    } catch {
        notFound()
    }
    if (!artikel) notFound()

    const cover =
        typeof artikel.cover === 'object' && artikel.cover
            ? { id: artikel.cover.id, url: artikel.cover.url ?? '', alt: artikel.cover.alt ?? '' }
            : null

    return (
        <>
            <PageHeader judul="Ubah Artikel" keterangan="Perubahan baru tampil di situs setelah disimpan." />
            <ArticleForm
                awal={{
                    id: artikel.id,
                    title: artikel.title,
                    slug: artikel.slug ?? '',
                    excerpt: artikel.excerpt ?? '',
                    content: artikel.content ?? '',
                    category: artikel.category ?? 'berita',
                    publishedDate: artikel.publishedDate ? artikel.publishedDate.slice(0, 10) : '',
                    status: artikel._status ?? 'draft',
                    cover,
                }}
            />
        </>
    )
}
