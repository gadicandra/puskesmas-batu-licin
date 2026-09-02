'use client'

import { useState, useTransition } from 'react'
import { Upload, Search, Trash2, Copy, Check } from 'lucide-react'
import { unggahMedia, hapusMedia, type MediaRingkas } from '@/app/dashboard/(app)/media/actions'
import { formatTanggal, formatUkuran } from '@/lib/dashboard/format'
import Button from '@/components/dashboard/ui/Button'
import Input from '@/components/dashboard/ui/Input'
import Field from '@/components/dashboard/ui/Field'
import Card from '@/components/dashboard/ui/Card'
import EmptyState from '@/components/dashboard/ui/EmptyState'
import { PaginasiUrl } from '@/components/dashboard/ui/Paginasi'
import type { JumlahBaris } from '@/lib/dashboard/paginasi'

const MAKS_UKURAN = 5_000_000

export default function GaleriMedia({
    awal,
    cari,
    halaman,
    totalHalaman,
    total,
    jumlah,
}: {
    awal: MediaRingkas[]
    cari: string
    halaman: number
    totalHalaman: number
    total: number
    jumlah: JumlahBaris
}) {
    const [pesan, setPesan] = useState<{ tipe: 'ok' | 'salah'; teks: string } | null>(null)
    const [terpilih, setTerpilih] = useState<MediaRingkas | null>(null)
    const [tersalin, setTersalin] = useState(false)
    const [pending, startTransition] = useTransition()

    const unggah = (formData: FormData) => {
        // Cek di browser dulu supaya pengguna tidak menunggu unggahan yang pasti gagal.
        const berkas = formData.get('file')
        if (berkas instanceof File && berkas.size > MAKS_UKURAN) {
            const mb = (berkas.size / 1_000_000).toFixed(1)
            setPesan({ tipe: 'salah', teks: `Ukuran berkas maksimal 5MB. Berkas ini ${mb}MB — coba perkecil dulu.` })
            return
        }
        setPesan(null)
        startTransition(async () => {
            const hasil = await unggahMedia({}, formData)
            setPesan(hasil.error ? { tipe: 'salah', teks: hasil.error } : { tipe: 'ok', teks: hasil.sukses ?? 'Berhasil.' })
        })
    }

    const hapus = (m: MediaRingkas) => {
        if (!window.confirm(`Hapus berkas "${m.alt || m.filename}"? Tindakan ini tidak bisa dibatalkan.`)) return
        const fd = new FormData()
        fd.set('id', String(m.id))
        startTransition(async () => {
            const hasil = await hapusMedia({}, fd)
            setPesan(hasil.error ? { tipe: 'salah', teks: hasil.error } : { tipe: 'ok', teks: hasil.sukses ?? 'Terhapus.' })
            if (!hasil.error) setTerpilih(null)
        })
    }

    return (
        <div className="flex flex-col gap-6">
            {pesan && (
                <p
                    role={pesan.tipe === 'salah' ? 'alert' : 'status'}
                    className={
                        pesan.tipe === 'salah'
                            ? 'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'
                            : 'rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary'
                    }
                >
                    {pesan.teks}
                </p>
            )}

            <Card judul="Unggah gambar baru">
                <form action={unggah} className="grid gap-4 sm:grid-cols-2">
                    <Field label="Pilih berkas dari perangkat" htmlFor="file" wajib keterangan="Gambar (JPG, PNG, WebP) atau PDF, maksimal 5MB.">
                        <input
                            id="file"
                            name="file"
                            type="file"
                            accept="image/*,application/pdf"
                            required
                            className="w-full text-sm file:mr-3 file:min-h-[40px] file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:font-semibold file:text-white"
                        />
                    </Field>
                    <Field
                        label="Keterangan gambar"
                        htmlFor="alt"
                        wajib
                        keterangan="Dibaca oleh pembaca layar untuk pengunjung tunanetra. Contoh: Petugas menimbang balita di posyandu."
                    >
                        <Input id="alt" name="alt" required />
                    </Field>
                    <div className="sm:col-span-2">
                        <Button type="submit" loading={pending} leftIcon={<Upload size={18} />}>
                            Unggah
                        </Button>
                    </div>
                </form>
            </Card>

            <form className="flex gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
                    <Input name="cari" defaultValue={cari} placeholder="Cari nama berkas atau keterangan" className="pl-9" />
                </div>
                <Button type="submit" varian="secondary">Cari</Button>
            </form>

            {awal.length === 0 ? (
                <EmptyState
                    judul="Belum ada gambar"
                    keterangan="Unggah gambar lewat kotak di atas. Gambar yang sudah diunggah bisa dipakai berulang kali di artikel."
                />
            ) : (
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {awal.map((m) => (
                        <li key={m.id}>
                            <button
                                type="button"
                                onClick={() => { setTerpilih(m); setTersalin(false) }}
                                className="group w-full overflow-hidden rounded-2xl border border-primary/10 bg-white text-left transition hover:border-secondary"
                            >
                                <span className="block aspect-[4/3] overflow-hidden bg-base">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={m.thumbnailUrl} alt={m.alt} className="h-full w-full object-cover transition group-hover:scale-105" />
                                </span>
                                <span className="block px-3 py-2">
                                    <span className="block truncate text-sm font-semibold text-primary">{m.alt || m.filename}</span>
                                    <span className="block text-xs text-tertiary">{formatUkuran(m.filesize)}</span>
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <PaginasiUrl
                total={total}
                halaman={halaman}
                totalHalaman={totalHalaman}
                jumlah={jumlah}
                labelData="gambar"
            />

            {/* Panel detail */}
            {terpilih && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <button aria-label="Tutup" onClick={() => setTerpilih(null)} className="absolute inset-0 bg-black/50" />
                    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white">
                        <div className="aspect-video overflow-hidden bg-base">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={terpilih.url} alt={terpilih.alt} className="h-full w-full object-contain" />
                        </div>
                        <div className="flex flex-col gap-3 p-5">
                            <p className="font-semibold text-primary">{terpilih.alt || terpilih.filename}</p>
                            <p className="text-xs text-tertiary">
                                {terpilih.filename} · {formatUkuran(terpilih.filesize)} · diunggah {formatTanggal(terpilih.createdAt)}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    ukuran="sm"
                                    varian="secondary"
                                    leftIcon={tersalin ? <Check size={16} /> : <Copy size={16} />}
                                    onClick={() => {
                                        navigator.clipboard?.writeText(new URL(terpilih.url, window.location.origin).toString())
                                        setTersalin(true)
                                    }}
                                >
                                    {tersalin ? 'Tautan tersalin' : 'Salin Tautan'}
                                </Button>
                                <Button ukuran="sm" varian="danger" leftIcon={<Trash2 size={16} />} onClick={() => hapus(terpilih)} loading={pending}>
                                    Hapus
                                </Button>
                                <Button ukuran="sm" varian="ghost" onClick={() => setTerpilih(null)}>Tutup</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
