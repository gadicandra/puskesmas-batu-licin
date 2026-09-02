'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Input from '@/components/dashboard/ui/Input'

/** Pilihan ganda berbentuk daftar centang, mis. "layanan apa saja yang ada di
 *  posyandu ini". Nilainya dikirim sebagai satu isian tersembunyi berisi JSON
 *  agar Server Action cukup membaca satu kunci — FormData dengan nama berulang
 *  mudah terbaca sebagai satu nilai saja tanpa disadari. */
export default function PilihanBanyak({
    nama,
    pilihan,
    terpilihAwal,
    kosong,
}: {
    nama: string
    pilihan: { value: string; label: string }[]
    terpilihAwal: string[]
    kosong: string
}) {
    const [terpilih, setTerpilih] = useState<string[]>(terpilihAwal)
    const [cari, setCari] = useState('')

    const ubah = (value: string) =>
        setTerpilih((s) => (s.includes(value) ? s.filter((v) => v !== value) : [...s, value]))

    // Yang sudah dicentang selalu ikut tampil walau tidak cocok pencarian:
    // menyembunyikannya membuat pilihan terasa "hilang" padahal masih terkirim.
    const tersaring = useMemo(() => {
        const kunci = cari.trim().toLowerCase()
        if (!kunci) return pilihan
        return pilihan.filter((p) => p.label.toLowerCase().includes(kunci) || terpilih.includes(p.value))
    }, [cari, pilihan, terpilih])

    if (pilihan.length === 0) {
        return <p className="rounded-xl border border-dashed border-primary/15 px-4 py-3 text-sm text-tertiary">{kosong}</p>
    }

    return (
        <>
            <input type="hidden" name={nama} value={JSON.stringify(terpilih)} />

            {/* Daftar layanan Puskesmas ada 93 baris. Tanpa kotak cari, staf
                harus menggulir dinding teks untuk menemukan satu nama — dan
                pilihan yang sulit ditemukan berakhir tidak dicentang. */}
            {pilihan.length > 8 && (
                <div className="relative mb-2">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" aria-hidden />
                    <Input
                        value={cari}
                        onChange={(e) => setCari(e.target.value)}
                        placeholder="Cari dalam daftar"
                        aria-label="Cari dalam daftar pilihan"
                        className="pl-9"
                    />
                </div>
            )}

            <div className="max-h-64 overflow-y-auto rounded-xl border border-primary/15 bg-white p-2">
                {tersaring.length === 0 && (
                    <p className="px-3 py-4 text-sm text-tertiary">Tidak ada yang cocok dengan “{cari}”.</p>
                )}
                {tersaring.map((p) => (
                    <label
                        key={p.value}
                        className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg px-3 text-sm text-primary hover:bg-base"
                    >
                        <input
                            type="checkbox"
                            checked={terpilih.includes(p.value)}
                            onChange={() => ubah(p.value)}
                            className="h-5 w-5 rounded border-primary/30 accent-[var(--color-secondary)]"
                        />
                        {p.label}
                    </label>
                ))}
            </div>
            <p className="text-xs text-tertiary">{terpilih.length} dipilih</p>
        </>
    )
}
