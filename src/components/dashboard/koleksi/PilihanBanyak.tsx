'use client'

import { useState } from 'react'

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

    const ubah = (value: string) =>
        setTerpilih((s) => (s.includes(value) ? s.filter((v) => v !== value) : [...s, value]))

    if (pilihan.length === 0) {
        return <p className="rounded-xl border border-dashed border-primary/15 px-4 py-3 text-sm text-tertiary">{kosong}</p>
    }

    return (
        <>
            <input type="hidden" name={nama} value={JSON.stringify(terpilih)} />
            <div className="max-h-64 overflow-y-auto rounded-xl border border-primary/15 bg-white p-2">
                {pilihan.map((p) => (
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
