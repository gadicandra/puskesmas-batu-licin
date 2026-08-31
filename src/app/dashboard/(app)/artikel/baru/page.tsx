import { requireUser } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import ArticleForm from '@/components/dashboard/artikel/ArticleForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tulis Artikel | Dashboard' }

export default async function ArtikelBaruPage() {
    await requireUser()
    const hariIni = new Date().toISOString().slice(0, 10)

    return (
        <>
            <PageHeader judul="Tulis Artikel Baru" keterangan="Artikel tersimpan sebagai draf sampai Anda menekan Terbitkan." />
            <ArticleForm
                awal={{
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '',
                    category: 'berita',
                    publishedDate: hariIni,
                    status: 'draft',
                    cover: null,
                }}
            />
        </>
    )
}
