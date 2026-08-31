import Link from 'next/link'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { Eye, Newspaper, FileEdit, Users, PenLine, ImagePlus, Syringe } from 'lucide-react'
import { requireUser } from '@/lib/dashboard/auth'
import { ambilStatistik } from '@/lib/dashboard/statistik'
import { waktuRelatif } from '@/lib/dashboard/format'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import StatTile from '@/components/dashboard/ui/StatTile'
import BarChart from '@/components/dashboard/ui/BarChart'
import Card from '@/components/dashboard/ui/Card'
import Badge from '@/components/dashboard/ui/Badge'
import Button from '@/components/dashboard/ui/Button'

export const dynamic = 'force-dynamic'

const AMBANG_STOK_VAKSIN = 20

export default async function BerandaDashboard() {
    const user = await requireUser()
    const superadmin = user.role === 'superadmin'
    const payload = await getPayload({ config })

    const stat = await ambilStatistik()

    // Artikel: superadmin melihat semua, admin unit hanya miliknya.
    const filterPenulis: Where = superadmin ? {} : { author: { equals: user.id } }

    const [terbit, draf, terbaru] = await Promise.all([
        payload.count({
            collection: 'articles',
            where: { and: [{ _status: { equals: 'published' } }, filterPenulis] },
        }),
        payload.count({
            collection: 'articles',
            where: { and: [{ _status: { not_equals: 'published' } }, filterPenulis] },
        }),
        payload.find({
            collection: 'articles',
            where: filterPenulis,
            sort: '-updatedAt',
            limit: 5,
            depth: 0,
            pagination: false,
        }),
    ])

    const vaksinMenipis = superadmin
        ? await payload.find({
            collection: 'vaccines',
            where: { stok: { less_than: AMBANG_STOK_VAKSIN } },
            sort: 'stok',
            limit: 5,
            depth: 0,
            pagination: false,
        })
        : null

    const tren =
        stat.selisihMingguan === 0
            ? 'sama dengan minggu lalu'
            : stat.selisihMingguan > 0
                ? `naik ${stat.selisihMingguan} dari minggu lalu`
                : `turun ${Math.abs(stat.selisihMingguan)} dari minggu lalu`

    return (
        <>
            <PageHeader
                judul={`Selamat datang, ${user.name || user.email}`}
                keterangan="Ringkasan kunjungan website dan isi yang Anda kelola."
                aksi={
                    <>
                        <Link href="/dashboard/artikel/baru">
                            <Button leftIcon={<PenLine size={18} />}>Tulis Artikel</Button>
                        </Link>
                        <Link href="/dashboard/media">
                            <Button varian="secondary" leftIcon={<ImagePlus size={18} />}>
                                Unggah Gambar
                            </Button>
                        </Link>
                    </>
                }
            />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatTile label="Kunjungan hari ini" nilai={stat.hariIni} ikon={<Eye size={18} />} />
                <StatTile label="7 hari terakhir" nilai={stat.tujuhHari} sub={tren} ikon={<Users size={18} />} />
                <StatTile label="Artikel terbit" nilai={terbit.totalDocs} ikon={<Newspaper size={18} />} />
                <StatTile label="Belum terbit" nilai={draf.totalDocs} ikon={<FileEdit size={18} />} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <Card judul="Kunjungan 7 hari terakhir" className="lg:col-span-2">
                    {stat.adaData ? (
                        <>
                            <BarChart data={stat.emberHarian} />
                            <p className="mt-4 text-xs leading-relaxed text-tertiary">
                                Jam paling ramai: <strong className="text-primary">{stat.jamRamai} WITA</strong>{' '}
                                ({stat.jumlahJamRamai} kunjungan dalam 30 hari terakhir). Angka ini menghitung
                                halaman yang dibuka, bukan jumlah orang.
                            </p>
                        </>
                    ) : (
                        <p className="py-8 text-center text-sm text-tertiary">
                            Belum ada data kunjungan. Grafik akan muncul setelah situs mulai dikunjungi.
                        </p>
                    )}
                </Card>

                <Card judul="Artikel terakhir diubah">
                    {terbaru.docs.length === 0 ? (
                        <p className="py-6 text-center text-sm text-tertiary">
                            Belum ada artikel. Mulai dengan menulis artikel pertama.
                        </p>
                    ) : (
                        <ul className="flex flex-col divide-y divide-primary/10">
                            {terbaru.docs.map((a) => (
                                <li key={a.id}>
                                    <Link
                                        href={`/dashboard/artikel/${a.id}`}
                                        className="flex flex-col gap-1 py-3 transition hover:opacity-70"
                                    >
                                        <span className="line-clamp-2 text-sm font-semibold text-primary">
                                            {a.title}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Badge nada={a._status === 'published' ? 'hijau' : 'abu'}>
                                                {a._status === 'published' ? 'Sudah terbit' : 'Belum terbit'}
                                            </Badge>
                                            <span className="text-xs text-tertiary">{waktuRelatif(a.updatedAt)}</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            {superadmin && vaksinMenipis && vaksinMenipis.docs.length > 0 && (
                <Card judul="Perlu perhatian: stok vaksin menipis" className="mt-6">
                    <ul className="flex flex-col divide-y divide-primary/10">
                        {vaksinMenipis.docs.map((v) => (
                            <li key={v.id} className="flex items-center justify-between gap-3 py-3">
                                <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                                    <Syringe size={16} className="text-tertiary" />
                                    {v.nama}
                                </span>
                                <Badge nada={(v.stok ?? 0) === 0 ? 'merah' : 'kuning'}>
                                    {v.stok ?? 0} {v.satuan || 'dosis'}
                                </Badge>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/dashboard/vaksin"
                        className="mt-4 inline-block text-sm font-semibold text-secondary hover:underline"
                    >
                        Kelola stok vaksin →
                    </Link>
                </Card>
            )}
        </>
    )
}
