'use client'

import { useState } from 'react'
import { ChevronRight, CornerLeftUp, Users2 } from 'lucide-react'
import type { FormState } from '@/lib/dashboard/crud'
import KoleksiSederhana, {
    type SpesifikasiField,
    type BarisData,
} from '@/components/dashboard/koleksi/KoleksiSederhana'
import Button from '@/components/dashboard/ui/Button'
import {
    idAtasan,
    jalurKe,
    jumlahKeturunan,
    labelBertingkat,
    punyaBawahan,
    urutkanBagan,
    type SimpulBagan,
} from '@/lib/dashboard/bagan'

/**
 * Bagan organisasi yang bisa "dimasuki" satu klaster.
 *
 * Seluruh bagan sekaligus berarti 32 baris dengan lima tingkat indentasi —
 * benar, tapi melelahkan dibaca dan sulit dicari. Menekan sebuah klaster
 * menyisakan klaster itu beserta isinya saja, dan remah roti di atas tabel
 * menunjukkan posisi sekarang sekaligus jalan kembali.
 *
 * Penyaringannya di browser, bukan lewat alamat halaman: datanya sudah ada
 * seluruhnya dan perpindahan terasa seketika. Kalau suatu saat perlu bisa
 * di-bookmark, pindahkan `fokus` ke `?klaster=` seperti pola paginasi Artikel.
 */
export default function PenjelajahBagan({
    docs,
    fields,
    simpanAksi,
    hapusAksi,
}: {
    docs: SimpulBagan[]
    fields: SpesifikasiField[]
    simpanAksi: (prev: FormState, fd: FormData) => Promise<FormState>
    hapusAksi: (prev: FormState, fd: FormData) => Promise<FormState>
}) {
    const [fokus, setFokus] = useState<number | null>(null)

    // Fokus ke baris yang sudah terhapus (mis. klaster yang baru dihapus staf)
    // dikembalikan ke seluruh bagan, bukan menyisakan tabel kosong.
    const fokusAda = fokus !== null && docs.some((d) => d.id === fokus)
    const fokusKini = fokusAda ? fokus : null

    const jalur = fokusKini === null ? [] : jalurKe(docs, fokusKini)
    const namaPerId = new Map(docs.map((d) => [d.id, d.jabatan]))

    const baris = urutkanBagan(docs, fokusKini).map(({ doc, tingkat }) => ({
        ...doc,
        labelJabatan: labelBertingkat(doc.jabatan, tingkat),
        namaAtasan: namaPerId.get(idAtasan(doc.atasan) ?? -1) ?? '—',
    }))

    const induk = fokusKini === null ? null : (idAtasan(jalur[jalur.length - 1]?.atasan) ?? null)

    return (
        <div className="flex flex-col gap-4">
            {/* Remah roti. Selalu tampil, juga saat di puncak, supaya staf tahu
                bahwa tabel ini memang bisa dipersempit — kalau baru muncul
                setelah diklik, tidak ada yang tahu fiturnya ada. */}
            <nav aria-label="Posisi dalam bagan" className="flex flex-wrap items-center gap-1 text-sm">
                <button
                    type="button"
                    onClick={() => setFokus(null)}
                    disabled={fokusKini === null}
                    className="rounded-lg px-2 py-1 font-semibold text-tertiary transition hover:bg-base hover:text-primary disabled:cursor-default disabled:font-bold disabled:text-primary disabled:hover:bg-transparent"
                >
                    Seluruh bagan
                </button>
                {jalur.map((simpul, i) => {
                    const terakhir = i === jalur.length - 1
                    return (
                        <span key={simpul.id} className="flex items-center gap-1">
                            <ChevronRight size={14} className="text-tertiary/60" aria-hidden />
                            <button
                                type="button"
                                onClick={() => setFokus(simpul.id)}
                                disabled={terakhir}
                                aria-current={terakhir ? 'page' : undefined}
                                className="rounded-lg px-2 py-1 font-semibold text-tertiary transition hover:bg-base hover:text-primary disabled:cursor-default disabled:font-bold disabled:text-primary disabled:hover:bg-transparent"
                            >
                                {simpul.jabatan}
                            </button>
                        </span>
                    )
                })}
            </nav>

            {fokusKini !== null && (
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/10 bg-white px-5 py-4">
                    <Users2 size={18} className="shrink-0 text-secondary" aria-hidden />
                    <p className="flex-1 text-sm text-tertiary">
                        Menampilkan <span className="font-semibold text-primary">{namaPerId.get(fokusKini)}</span> dan{' '}
                        {jumlahKeturunan(docs, fokusKini)} jabatan di bawahnya.
                    </p>
                    <Button
                        varian="secondary"
                        ukuran="sm"
                        leftIcon={<CornerLeftUp size={16} />}
                        onClick={() => setFokus(induk)}
                    >
                        {induk === null ? 'Tampilkan Seluruh Bagan' : `Naik ke ${namaPerId.get(induk)}`}
                    </Button>
                </div>
            )}

            <KoleksiSederhana
                data={baris as unknown as BarisData[]}
                fields={fields}
                simpanAksi={simpanAksi}
                hapusAksi={hapusAksi}
                labelSatuan="Jabatan"
                kunciJudul="jabatan"
                kosongJudul="Belum ada data struktur organisasi"
                kosongKeterangan="Mulai dari Kepala Puskesmas — kosongkan isian atasannya — lalu tambahkan jabatan di bawahnya."
                bukaBaris={{
                    // Klaster yang sedang dibuka tidak bisa ditekan lagi —
                    // menekannya hanya akan menuju ke tempat yang sama.
                    bisa: (b) => b.id !== fokusKini && punyaBawahan(docs, b.id),
                    onBuka: (b) => setFokus(b.id),
                    label: 'lihat isi klaster ini saja',
                }}
            />
        </div>
    )
}
