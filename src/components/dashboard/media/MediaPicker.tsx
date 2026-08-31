'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { X, Search, Upload } from 'lucide-react'
import { daftarMedia, unggahMedia, type MediaRingkas } from '@/app/dashboard/(app)/media/actions'
import Button from '@/components/dashboard/ui/Button'
import Input from '@/components/dashboard/ui/Input'
import Field from '@/components/dashboard/ui/Field'

/** Modal pilih gambar dari galeri, atau unggah baru tanpa meninggalkan halaman. */
export default function MediaPicker({
    onPilih,
    onTutup,
}: {
    onPilih: (media: MediaRingkas) => void
    onTutup: () => void
}) {
    const [docs, setDocs] = useState<MediaRingkas[]>([])
    const [cari, setCari] = useState('')
    const [memuat, setMemuat] = useState(true)
    const [modeUnggah, setModeUnggah] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()

    const muat = useCallback((kataKunci: string) => {
        setMemuat(true)
        daftarMedia(kataKunci)
            .then((h) => setDocs(h.docs))
            .catch(() => setError('Gagal memuat galeri.'))
            .finally(() => setMemuat(false))
    }, [])

    useEffect(() => {
        // Dibungkus startTransition agar pembaruan state tidak terjadi sinkron
        // di dalam effect (menghindari render berantai).
        startTransition(() => muat(''))
    }, [muat])

    // Tutup dengan tombol Escape.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onTutup()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onTutup])

    const unggah = (formData: FormData) => {
        setError(null)
        startTransition(async () => {
            const hasil = await unggahMedia({}, formData)
            if (hasil.error) {
                setError(hasil.error)
                return
            }
            setModeUnggah(false)
            muat('')
        })
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <button aria-label="Tutup" onClick={onTutup} className="absolute inset-0 bg-black/50" />

            <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                <header className="flex items-center justify-between gap-3 border-b border-primary/10 px-5 py-4">
                    <h2 className="text-base font-bold text-primary">Pilih Gambar</h2>
                    <button
                        onClick={onTutup}
                        aria-label="Tutup"
                        className="rounded-lg p-2 text-tertiary hover:bg-base hover:text-primary"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="flex items-center gap-2 border-b border-primary/10 px-5 py-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
                        <Input
                            value={cari}
                            onChange={(e) => setCari(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), muat(cari))}
                            placeholder="Cari nama berkas atau keterangan"
                            className="pl-9"
                        />
                    </div>
                    <Button varian="secondary" onClick={() => setModeUnggah((v) => !v)} leftIcon={<Upload size={16} />}>
                        Unggah
                    </Button>
                </div>

                {error && (
                    <p role="alert" className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {modeUnggah && (
                    <form action={unggah} className="flex flex-col gap-4 border-b border-primary/10 bg-base/50 px-5 py-4">
                        <Field label="Pilih berkas" htmlFor="picker-file" wajib>
                            <input
                                id="picker-file"
                                name="file"
                                type="file"
                                accept="image/*,application/pdf"
                                required
                                className="w-full text-sm file:mr-3 file:min-h-[40px] file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:font-semibold file:text-white"
                            />
                        </Field>
                        <Field
                            label="Keterangan gambar"
                            htmlFor="picker-alt"
                            wajib
                            keterangan="Dibaca oleh pembaca layar untuk pengunjung tunanetra. Contoh: Petugas menimbang balita di posyandu."
                        >
                            <Input id="picker-alt" name="alt" required />
                        </Field>
                        <Button type="submit" loading={pending} className="self-start">
                            Unggah Gambar
                        </Button>
                    </form>
                )}

                <div className="flex-1 overflow-y-auto p-5">
                    {memuat ? (
                        <p className="py-10 text-center text-sm text-tertiary">Memuat galeri…</p>
                    ) : docs.length === 0 ? (
                        <p className="py-10 text-center text-sm text-tertiary">
                            Belum ada gambar. Gunakan tombol Unggah di atas.
                        </p>
                    ) : (
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {docs.map((m) => (
                                <li key={m.id}>
                                    <button
                                        type="button"
                                        onClick={() => onPilih(m)}
                                        className="group w-full overflow-hidden rounded-xl border border-primary/10 text-left transition hover:border-secondary"
                                    >
                                        <span className="block aspect-[4/3] overflow-hidden bg-base">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={m.thumbnailUrl}
                                                alt={m.alt}
                                                className="h-full w-full object-cover transition group-hover:scale-105"
                                            />
                                        </span>
                                        <span className="block truncate px-2 py-1.5 text-xs text-tertiary">
                                            {m.alt || m.filename}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
