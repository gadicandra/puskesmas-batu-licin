'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { Save, Send, EyeOff, ExternalLink, Trash2, ImagePlus } from 'lucide-react'
import { simpanArtikel, hapusArtikel, type ArtikelState } from '@/app/dashboard/(app)/artikel/actions'
import type { MediaRingkas } from '@/app/dashboard/(app)/media/actions'
import ArticleEditor from '@/components/dashboard/editor/ArticleEditor'
import MediaPicker from '@/components/dashboard/media/MediaPicker'
import Button from '@/components/dashboard/ui/Button'
import ConfirmSubmit from '@/components/dashboard/ui/ConfirmSubmit'
import Field from '@/components/dashboard/ui/Field'
import Input, { Textarea, Select } from '@/components/dashboard/ui/Input'
import Card from '@/components/dashboard/ui/Card'
import Badge from '@/components/dashboard/ui/Badge'

export type ArtikelAwal = {
    id?: number
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    publishedDate: string
    status: string
    cover?: { id: number; url: string; alt: string } | null
}

const KATEGORI = [
    { value: 'berita', label: 'Berita' },
    { value: 'pengumuman', label: 'Pengumuman' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'kesehatan', label: 'Tips Kesehatan' },
]

function buatSlug(judul: string): string {
    return judul.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function ArticleForm({ awal }: { awal: ArtikelAwal }) {
    const [state, formAction, pending] = useActionState<ArtikelState, FormData>(simpanArtikel, {})

    const [judul, setJudul] = useState(awal.title)
    const [slug, setSlug] = useState(awal.slug)
    const [ubahSlug, setUbahSlug] = useState(false)
    const [cover, setCover] = useState(awal.cover ?? null)
    const [pemilihTerbuka, setPemilihTerbuka] = useState(false)
    const [adaPerubahan, setAdaPerubahan] = useState(false)

    const terbit = awal.status === 'published'
    const slugTampil = ubahSlug ? slug : slug || buatSlug(judul)

    // Peringatkan bila meninggalkan halaman dengan perubahan belum tersimpan.
    useEffect(() => {
        if (!adaPerubahan) return
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', onBeforeUnload)
        return () => window.removeEventListener('beforeunload', onBeforeUnload)
    }, [adaPerubahan])

    // Setelah simpan sukses, tandai tidak ada perubahan tertunda lagi.
    // `state.sukses` berubah identitasnya tiap kali action selesai, jadi cukup
    // membandingkan nilai terakhir yang sudah ditangani.
    const [suksesTerakhir, setSuksesTerakhir] = useState<string | undefined>(undefined)
    if (state.sukses && state.sukses !== suksesTerakhir) {
        setSuksesTerakhir(state.sukses)
        if (adaPerubahan) setAdaPerubahan(false)
    }

    const tandaiBerubah = () => setAdaPerubahan(true)

    return (
        <form action={formAction} onChange={tandaiBerubah} className="pb-28">
            {awal.id && <input type="hidden" name="id" value={awal.id} />}
            <input type="hidden" name="cover" value={cover?.id ?? ''} />

            {state.error && (
                <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {state.error}
                </p>
            )}
            {state.sukses && (
                <p role="status" className="mb-5 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
                    {state.sukses}
                </p>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Kolom utama */}
                <div className="flex flex-col gap-5 lg:col-span-2">
                    <Field label="Judul artikel" htmlFor="title" wajib error={state.fieldErrors?.title}>
                        <Input
                            id="title"
                            name="title"
                            value={judul}
                            onChange={(e) => setJudul(e.target.value)}
                            placeholder="Contoh: Jadwal Posyandu Bulan September"
                            required
                            className="text-lg font-semibold"
                        />
                    </Field>

                    <Field
                        label="Alamat halaman"
                        keterangan="Bagian akhir alamat artikel ini di internet. Dibuat otomatis dari judul."
                    >
                        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/10 bg-base px-4 py-3">
                            <span className="text-sm text-tertiary">/artikel/</span>
                            {ubahSlug ? (
                                <input
                                    name="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="min-w-0 flex-1 rounded-lg border border-primary/15 bg-white px-3 py-1.5 text-sm"
                                />
                            ) : (
                                <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
                                    {slugTampil || '(otomatis dari judul)'}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setUbahSlug((v) => !v)}
                                className="text-xs font-semibold text-secondary hover:underline"
                            >
                                {ubahSlug ? 'Selesai' : 'Ubah'}
                            </button>
                        </div>
                    </Field>

                    <Field
                        label="Ringkasan singkat"
                        htmlFor="excerpt"
                        keterangan="Tampil di daftar artikel dan hasil pencarian. Kosongkan untuk mengambil kalimat pertama secara otomatis."
                    >
                        <Textarea id="excerpt" name="excerpt" defaultValue={awal.excerpt} rows={3} />
                    </Field>

                    <Field label="Isi artikel" wajib error={state.fieldErrors?.content}>
                        <ArticleEditor name="content" nilaiAwal={awal.content} onChange={tandaiBerubah} />
                    </Field>
                </div>

                {/* Kolom samping */}
                <div className="flex flex-col gap-5">
                    <Card judul="Gambar sampul">
                        {cover ? (
                            <div className="flex flex-col gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={cover.url}
                                    alt={cover.alt}
                                    className="aspect-[16/10] w-full rounded-xl object-cover"
                                />
                                <div className="flex gap-2">
                                    <Button ukuran="sm" varian="secondary" onClick={() => setPemilihTerbuka(true)} type="button">
                                        Ganti
                                    </Button>
                                    <Button
                                        ukuran="sm"
                                        varian="danger"
                                        type="button"
                                        onClick={() => {
                                            setCover(null)
                                            tandaiBerubah()
                                        }}
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 py-4 text-center">
                                <p className="text-sm text-tertiary">
                                    Artikel dengan gambar lebih menarik dibaca.
                                </p>
                                <Button
                                    ukuran="sm"
                                    varian="secondary"
                                    type="button"
                                    leftIcon={<ImagePlus size={16} />}
                                    onClick={() => setPemilihTerbuka(true)}
                                >
                                    Pilih Gambar
                                </Button>
                            </div>
                        )}
                    </Card>

                    <Field label="Kategori" htmlFor="category">
                        <Select id="category" name="category" defaultValue={awal.category}>
                            {KATEGORI.map((k) => (
                                <option key={k.value} value={k.value}>
                                    {k.label}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Tanggal terbit" htmlFor="publishedDate">
                        <Input id="publishedDate" name="publishedDate" type="date" defaultValue={awal.publishedDate} />
                    </Field>
                </div>
            </div>

            {/* Bilah aksi menempel di bawah layar */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/10 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:pl-72">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Badge nada={terbit ? 'hijau' : 'abu'}>
                            {terbit ? 'Sudah terbit' : 'Belum terbit'}
                        </Badge>
                        {adaPerubahan && (
                            <span className="text-xs font-medium text-amber-700">
                                Ada perubahan belum tersimpan
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {awal.id && terbit && (
                            <a href={`/artikel/${awal.slug}`} target="_blank" rel="noreferrer">
                                <Button type="button" varian="ghost" ukuran="sm" leftIcon={<ExternalLink size={16} />}>
                                    Lihat di Situs
                                </Button>
                            </a>
                        )}

                        <Button
                            type="submit"
                            name="aksi"
                            value="simpan"
                            varian="secondary"
                            loading={pending}
                            leftIcon={<Save size={16} />}
                        >
                            Simpan
                        </Button>

                        {terbit ? (
                            <Button type="submit" name="aksi" value="batalkan-terbit" varian="secondary" leftIcon={<EyeOff size={16} />}>
                                Batalkan Terbit
                            </Button>
                        ) : (
                            <Button type="submit" name="aksi" value="terbitkan" leftIcon={<Send size={16} />}>
                                Terbitkan
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {pemilihTerbuka && (
                <MediaPicker
                    onTutup={() => setPemilihTerbuka(false)}
                    onPilih={(m: MediaRingkas) => {
                        setCover({ id: m.id, url: m.url, alt: m.alt })
                        setPemilihTerbuka(false)
                        tandaiBerubah()
                    }}
                />
            )}

            {awal.id && (
                <HapusArtikel id={awal.id} judul={awal.title} />
            )}
        </form>
    )
}

/** Form hapus terpisah supaya tidak bersarang di dalam form utama. */
function HapusArtikel({ id, judul }: { id: number; judul: string }) {
    return (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50/50 p-5">
            <p className="text-sm font-bold text-primary">Hapus artikel ini</p>
            <p className="mt-1 text-sm text-tertiary">
                Artikel yang dihapus tidak bisa dikembalikan.
            </p>
            <div className="mt-4">
                <Link href={`/dashboard/artikel/${id}/hapus`} className="hidden" aria-hidden />
                <ConfirmSubmit
                    formAction={hapusArtikel}
                    name="id"
                    value={id}
                    varian="danger"
                    ukuran="sm"
                    leftIcon={<Trash2 size={16} />}
                    pesan={`Hapus artikel "${judul}"? Tindakan ini tidak bisa dibatalkan.`}
                >
                    Hapus Artikel
                </ConfirmSubmit>
            </div>
        </div>
    )
}
