'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Loader2 } from 'lucide-react'

/** Popup "tunggu sebentar" di tengah layar.
 *
 *  Kerangka skeleton saja ternyata kurang jelas bagi staf: kotak abu terlihat
 *  seperti halaman yang memang begitu bentuknya, bukan seperti sesuatu yang
 *  sedang berjalan. Ikon kecil berputar di menu pun terlalu mudah terlewat.
 *  Popup besar di tengah layar menjawab satu pertanyaan yang selalu muncul —
 *  "ini sedang jalan atau macet?" — dan matanya tahu harus menunggu di mana.
 *
 *  Sengaja MENUTUP layar: selama data sedang diambil atau ditulis, menekan
 *  tombol lain hanya membuat hasilnya membingungkan.
 *
 *  Muncul tertunda 150 ms lewat animasi CSS (`.pemuat-layar`, globals.css).
 *  Cukup untuk menahan kedipan pada halaman yang terbuka seketika, tapi masih
 *  terlihat pada yang perlu menunggu. */
export default function PemuatLayar({
    label,
    keterangan,
    umumkan = false,
}: {
    label: string
    /** Baris kedua yang lebih kecil, mis. "Mohon tunggu sebentar". */
    keterangan?: string
    /** true = ikut dibacakan pembaca layar. Dimatikan bila di tempat itu sudah
     *  ada pengumuman lain (`KerangkaHalaman`), supaya tidak dibaca dua kali. */
    umumkan?: boolean
}) {
    // Portal baru boleh dipasang setelah komponen hidup di browser: `document`
    // tidak ada saat dirender di server.
    const [siap, setSiap] = useState(false)
    useEffect(() => setSiap(true), [])
    if (!siap) return null

    const isi = (
        <div
            className="pemuat-layar fixed inset-0 z-[100] flex items-center justify-center bg-primary/25 px-6 backdrop-blur-[2px]"
            {...(umumkan ? { role: 'status', 'aria-live': 'polite' } : { 'aria-hidden': true })}
        >
            <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-white px-8 py-9 text-center shadow-2xl shadow-primary/25">
                <Loader2 size={48} strokeWidth={2.5} className="animate-spin text-secondary" aria-hidden />
                <div>
                    <p className="text-lg font-bold text-primary">{label}</p>
                    {keterangan && <p className="mt-1 text-sm text-tertiary">{keterangan}</p>}
                </div>
            </div>
        </div>
    )

    /**
     * Dipasang lewat portal ke `document.body`, bukan di tempat ia dipanggil.
     *
     * Sebabnya nyata dan pernah terlihat: pemanggilnya tersebar — di dalam
     * sidebar, di dalam `<form>`, di dalam `<Card>`. Begitu salah satu induknya
     * membentuk stacking context sendiri (punya `z-index`, `transform`,
     * `filter`, `position: sticky`…), `z-index` popup ini hanya berlaku DI
     * DALAM induk itu: sebagian halaman tetap tampil tajam di atas latar yang
     * sudah diburamkan — persis yang terjadi pada kotak pencarian di Galeri
     * Gambar. Dari `document.body` popupnya selalu jadi lapisan teratas,
     * berapa pun sarang komponen di atasnya.
     */
    return createPortal(isi, document.body)
}
