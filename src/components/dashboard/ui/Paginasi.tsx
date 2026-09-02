'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'
import { Select } from './Input'
import {
    JUMLAH_BAWAAN,
    OPSI_JUMLAH,
    SEMUA,
    bacaJumlah,
    type JumlahBaris,
} from '@/lib/dashboard/paginasi'

// TIDAK meneruskan ulang isi `lib/dashboard/paginasi` dari sini. Modul
// `'use client'` yang mengekspor ulang nilai biasa membingungkan manifest React
// Server Components — gejalanya galat saat halaman dibuka, bukan saat build:
// "Could not find the module ...#PaginasiUrl in the React Client Manifest".
// Pemakai yang butuh konstantanya mengimpor langsung dari lib.

function KendaliPaginasi({
    total,
    halaman,
    totalHalaman,
    jumlah,
    labelData,
    keHalaman,
    keJumlah,
}: {
    total: number
    halaman: number
    totalHalaman: number
    jumlah: JumlahBaris
    labelData: string
    keHalaman: (h: number) => void
    keJumlah: (j: JumlahBaris) => void
}) {
    const perHalaman = jumlah === SEMUA ? total : jumlah
    const mulai = total === 0 ? 0 : (halaman - 1) * perHalaman + 1
    const selesai = Math.min(halaman * perHalaman, total)

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <label htmlFor="jumlah-baris" className="whitespace-nowrap text-sm text-tertiary">
                    Tampilkan
                </label>
                <Select
                    id="jumlah-baris"
                    value={String(jumlah)}
                    onChange={(e) => keJumlah(bacaJumlah(e.target.value))}
                    className="w-28"
                >
                    {OPSI_JUMLAH.map((n) => (
                        <option key={n} value={n}>{n} baris</option>
                    ))}
                    <option value={SEMUA}>Semua</option>
                </Select>
                <span className="whitespace-nowrap text-sm text-tertiary">
                    dari {total} {labelData}
                </span>
            </div>

            {totalHalaman > 1 && (
                <nav aria-label="Navigasi halaman" className="flex items-center gap-2">
                    <Button
                        type="button"
                        varian="secondary"
                        ukuran="sm"
                        disabled={halaman <= 1}
                        onClick={() => keHalaman(halaman - 1)}
                        leftIcon={<ChevronLeft size={16} />}
                    >
                        Sebelumnya
                    </Button>
                    {/* Nomor baris yang sedang tampil, bukan sekadar "halaman 2
                        dari 19": staf lebih sering bertanya "yang mana yang
                        sedang saya lihat", bukan "halaman berapa". */}
                    <span className="whitespace-nowrap px-1 text-sm text-tertiary">
                        {mulai}–{selesai}
                    </span>
                    <Button
                        type="button"
                        varian="secondary"
                        ukuran="sm"
                        disabled={halaman >= totalHalaman}
                        onClick={() => keHalaman(halaman + 1)}
                    >
                        Berikutnya
                        <ChevronRight size={16} />
                    </Button>
                </nav>
            )}
        </div>
    )
}

/**
 * Paginasi untuk daftar yang SUDAH ada seluruhnya di browser.
 *
 * Halaman-halaman data di dashboard mengambil seluruh barisnya sekaligus
 * (puluhan sampai ratusan baris, bukan ribuan) supaya pengurutan hierarkis dan
 * kolom hasil olahan bisa disiapkan di server. Memotongnya di browser membuat
 * ganti halaman terasa seketika dan tidak menambah satu pun permintaan ke
 * server. Kalau suatu saat datanya menembus ribuan baris, inilah yang pertama
 * harus dipindah ke `payload.find({ page })`.
 */
export function usePaginasi<T>(data: T[], labelData = 'data') {
    const [jumlah, setJumlah] = useState<JumlahBaris>(JUMLAH_BAWAAN)
    const [halaman, setHalaman] = useState(1)

    const perHalaman = jumlah === SEMUA ? Math.max(data.length, 1) : jumlah
    const totalHalaman = Math.max(1, Math.ceil(data.length / perHalaman))

    // Data bisa menyusut selagi dilihat — baris terakhir di halaman 4 dihapus,
    // halaman 4 lenyap. Dijepit saat dibaca, bukan diperbaiki lewat useEffect:
    // effect yang memanggil setState memicu render berantai, dan hasil akhirnya
    // sama saja. Tombol berikutnya bekerja dari `halamanAman`, jadi keadaannya
    // ikut pulih sendiri begitu staf menekan tombol.
    const halamanAman = Math.min(halaman, totalHalaman)
    const mulai = (halamanAman - 1) * perHalaman
    const potongan = data.slice(mulai, mulai + perHalaman)

    const kendali = (
        <KendaliPaginasi
            total={data.length}
            halaman={halamanAman}
            totalHalaman={totalHalaman}
            jumlah={jumlah}
            labelData={labelData}
            keHalaman={setHalaman}
            keJumlah={(j) => {
                setJumlah(j)
                setHalaman(1) // baris pertama pindah posisi; mulai dari awal lagi
            }}
        />
    )

    return { potongan, kendali }
}

/**
 * Paginasi untuk daftar yang dipotong di SERVER (Artikel, Galeri Gambar).
 *
 * Keadaannya disimpan di alamat halaman (`?page=`, `?per=`), bukan di state
 * React: halaman itu memang sudah membaca filternya dari alamat, dan dengan
 * begitu tautan yang di-bookmark atau tombol "kembali" browser tetap
 * menampilkan daftar yang sama. Parameter lain (pencarian, kategori) ikut
 * dibawa serta — sebelumnya tombol halaman berikutnya membuang filternya.
 */
export function PaginasiUrl({
    total,
    halaman,
    totalHalaman,
    jumlah,
    labelData = 'data',
}: {
    total: number
    halaman: number
    totalHalaman: number
    jumlah: JumlahBaris
    labelData?: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const pindah = (ubah: (p: URLSearchParams) => void) => {
        const p = new URLSearchParams(searchParams.toString())
        ubah(p)
        router.push(`${pathname}?${p.toString()}`)
    }

    return (
        <KendaliPaginasi
            total={total}
            halaman={halaman}
            totalHalaman={totalHalaman}
            jumlah={jumlah}
            labelData={labelData}
            keHalaman={(h) => pindah((p) => p.set('page', String(h)))}
            keJumlah={(j) =>
                pindah((p) => {
                    p.set('per', String(j))
                    p.delete('page')
                })
            }
        />
    )
}
