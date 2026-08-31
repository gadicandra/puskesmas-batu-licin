import Link from 'next/link'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { PenLine, Search } from 'lucide-react'
import { requireUser } from '@/lib/dashboard/auth'
import { formatTanggal } from '@/lib/dashboard/format'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import Button from '@/components/dashboard/ui/Button'
import Badge from '@/components/dashboard/ui/Badge'
import EmptyState from '@/components/dashboard/ui/EmptyState'
import Input, { Select } from '@/components/dashboard/ui/Input'

export const dynamic = 'force-dynamic'

const PER_HALAMAN = 20

const KATEGORI: Record<string, string> = {
    berita: 'Berita',
    pengumuman: 'Pengumuman',
    kegiatan: 'Kegiatan',
    kesehatan: 'Tips Kesehatan',
}

export default async function DaftarArtikelPage({
    searchParams,
}: {
    searchParams: Promise<{ cari?: string; kategori?: string; status?: string; page?: string }>
}) {
    const { cari, kategori, status, page } = await searchParams
    const user = await requireUser()
    const halaman = Math.max(1, Number.parseInt(page ?? '1', 10) || 1)

    const syarat: Where[] = []
    if (cari?.trim()) syarat.push({ title: { like: cari.trim() } })
    if (kategori) syarat.push({ category: { equals: kategori } })
    if (status === 'terbit') syarat.push({ _status: { equals: 'published' } })
    if (status === 'draf') syarat.push({ _status: { not_equals: 'published' } })

    const payload = await getPayload({ config })
    // Scoping per role datang gratis dari access control Payload.
    const hasil = await payload.find({
        collection: 'articles',
        where: syarat.length ? { and: syarat } : {},
        sort: '-updatedAt',
        limit: PER_HALAMAN,
        page: halaman,
        depth: 1,
        user,
        overrideAccess: false,
    })

    const kosongTanpaFilter = hasil.totalDocs === 0 && !cari && !kategori && !status

    return (
        <>
            <PageHeader
                judul="Artikel"
                keterangan={
                    user.role === 'superadmin'
                        ? 'Semua artikel di website Puskesmas.'
                        : 'Artikel yang Anda tulis.'
                }
                aksi={
                    <Link href="/dashboard/artikel/baru">
                        <Button leftIcon={<PenLine size={18} />}>Tulis Artikel Baru</Button>
                    </Link>
                }
            />

            <form className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
                    <Input name="cari" defaultValue={cari} placeholder="Cari judul artikel" className="pl-9" />
                </div>
                <Select name="kategori" defaultValue={kategori ?? ''} className="sm:w-48">
                    <option value="">Semua kategori</option>
                    {Object.entries(KATEGORI).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                    ))}
                </Select>
                <Select name="status" defaultValue={status ?? ''} className="sm:w-44">
                    <option value="">Semua status</option>
                    <option value="terbit">Sudah terbit</option>
                    <option value="draf">Belum terbit</option>
                </Select>
                <Button type="submit" varian="secondary">Cari</Button>
            </form>

            {hasil.docs.length === 0 ? (
                <EmptyState
                    judul={kosongTanpaFilter ? 'Belum ada artikel' : 'Tidak ada artikel yang cocok'}
                    keterangan={
                        kosongTanpaFilter
                            ? 'Mulai dengan menulis artikel pertama untuk website Puskesmas.'
                            : 'Coba ubah kata pencarian atau pilihan filter di atas.'
                    }
                    aksi={
                        kosongTanpaFilter ? (
                            <Link href="/dashboard/artikel/baru">
                                <Button leftIcon={<PenLine size={18} />}>Tulis Artikel Baru</Button>
                            </Link>
                        ) : undefined
                    }
                />
            ) : (
                <>
                    {/* Tabel di layar lebar */}
                    <div className="hidden overflow-hidden rounded-2xl border border-primary/10 bg-white md:block">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-primary/10 bg-base/50">
                                <tr className="text-xs uppercase tracking-wide text-tertiary">
                                    <th className="px-5 py-3 font-bold">Judul</th>
                                    <th className="px-5 py-3 font-bold">Kategori</th>
                                    <th className="px-5 py-3 font-bold">Status</th>
                                    <th className="px-5 py-3 font-bold">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/10">
                                {hasil.docs.map((a) => (
                                    <tr key={a.id} className="transition hover:bg-base/40">
                                        <td className="px-5 py-3">
                                            <Link href={`/dashboard/artikel/${a.id}`} className="font-semibold text-primary hover:text-secondary">
                                                {a.title}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3 text-tertiary">{KATEGORI[a.category ?? ''] ?? '-'}</td>
                                        <td className="px-5 py-3">
                                            <Badge nada={a._status === 'published' ? 'hijau' : 'abu'}>
                                                {a._status === 'published' ? 'Sudah terbit' : 'Belum terbit'}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3 text-tertiary">{formatTanggal(a.publishedDate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Kartu di ponsel — bukan tabel yang di-scroll menyamping */}
                    <ul className="flex flex-col gap-3 md:hidden">
                        {hasil.docs.map((a) => (
                            <li key={a.id}>
                                <Link
                                    href={`/dashboard/artikel/${a.id}`}
                                    className="flex flex-col gap-2 rounded-2xl border border-primary/10 bg-white p-4"
                                >
                                    <span className="font-semibold text-primary">{a.title}</span>
                                    <span className="flex flex-wrap items-center gap-2">
                                        <Badge nada={a._status === 'published' ? 'hijau' : 'abu'}>
                                            {a._status === 'published' ? 'Sudah terbit' : 'Belum terbit'}
                                        </Badge>
                                        <span className="text-xs text-tertiary">
                                            {KATEGORI[a.category ?? ''] ?? '-'} · {formatTanggal(a.publishedDate)}
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {hasil.totalPages > 1 && (
                        <nav aria-label="Navigasi halaman" className="mt-6 flex items-center justify-center gap-3">
                            {hasil.hasPrevPage && (
                                <Link href={`/dashboard/artikel?page=${halaman - 1}`}>
                                    <Button varian="secondary" ukuran="sm">Sebelumnya</Button>
                                </Link>
                            )}
                            <span className="text-sm text-tertiary">
                                Halaman {halaman} dari {hasil.totalPages}
                            </span>
                            {hasil.hasNextPage && (
                                <Link href={`/dashboard/artikel?page=${halaman + 1}`}>
                                    <Button varian="secondary" ukuran="sm">Berikutnya</Button>
                                </Link>
                            )}
                        </nav>
                    )}
                </>
            )}
        </>
    )
}
