import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/** Blok abu berkilau sebagai pengganti sementara isi yang sedang dimuat.
 *
 *  Aturan pemakaiannya: bentuknya harus MENYERUPAI isi yang akan menggantikan.
 *  Kotak seukuran tabel di tempat tabel, kartu seukuran kartu. Skeleton yang
 *  asal-asalan justru membuat halaman "melompat" saat isinya datang, dan itu
 *  lebih mengganggu daripada layar kosong.
 *
 *  `aria-hidden` di seluruh berkas ini disengaja — pembaca layar cukup
 *  mendengar satu pengumuman "sedang memuat" dari `KerangkaHalaman`, bukan
 *  membacakan puluhan kotak kosong. */
export default function Skeleton({
    className,
    style,
}: {
    className?: string
    style?: CSSProperties
}) {
    return <div aria-hidden style={style} className={cn('skeleton rounded-lg', className)} />
}

/** Beberapa baris teks dengan lebar acak-tetap, meniru paragraf.
 *  Baris terakhir sengaja lebih pendek seperti paragraf sungguhan. */
export function SkeletonTeks({
    baris = 3,
    className,
}: {
    baris?: number
    className?: string
}) {
    return (
        <div aria-hidden className={cn('flex flex-col gap-2', className)}>
            {Array.from({ length: baris }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn('h-3.5', i === baris - 1 ? 'w-2/5' : i % 2 ? 'w-4/5' : 'w-full')}
                />
            ))}
        </div>
    )
}

/** Judul halaman + keterangan, seukuran `PageHeader`. */
export function SkeletonJudul() {
    return (
        <div aria-hidden className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-52" />
                <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <Skeleton className="h-11 w-36 shrink-0 rounded-xl" />
        </div>
    )
}

/** Tabel: header + beberapa baris. Dipakai modul Artikel, Dokter, Vaksin, dsb. */
export function SkeletonTabel({ baris = 6, kolom = 4 }: { baris?: number; kolom?: number }) {
    return (
        <div
            aria-hidden
            className="overflow-hidden rounded-2xl border border-primary/10 bg-white"
        >
            <div className="flex items-center gap-4 border-b border-primary/10 bg-base/50 px-5 py-3">
                {Array.from({ length: kolom }).map((_, i) => (
                    <Skeleton key={i} className={cn('h-3', i === 0 ? 'w-40' : 'w-24')} />
                ))}
            </div>
            <div className="divide-y divide-primary/10">
                {Array.from({ length: baris }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4">
                        {Array.from({ length: kolom }).map((_, k) => (
                            <Skeleton
                                key={k}
                                className={cn('h-4', k === 0 ? 'w-48' : k === kolom - 1 ? 'ml-auto w-20' : 'w-28')}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

/** Kartu angka di beranda dashboard. */
export function SkeletonKartuAngka({ jumlah = 4 }: { jumlah?: number }) {
    return (
        <div aria-hidden className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: jumlah }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-primary/10 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-9 w-9 rounded-xl" />
                    </div>
                    <Skeleton className="mt-4 h-8 w-20" />
                </div>
            ))}
        </div>
    )
}

/** Blok grafik/histogram. */
export function SkeletonGrafik({ className }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={cn('rounded-2xl border border-primary/10 bg-white p-5', className)}
        >
            <Skeleton className="h-4 w-40" />
            <div className="mt-6 flex h-40 items-end gap-2">
                {/* Tinggi batang sengaja tetap (bukan acak) supaya tampilannya
                    tidak berubah-ubah tiap render dan tidak memicu hydration
                    mismatch antara server dan browser. */}
                {[45, 70, 35, 85, 55, 95, 40, 65, 75, 50, 80, 60].map((t, i) => (
                    <Skeleton key={i} className="flex-1 rounded-t-md" style={{ height: `${t}%` }} />
                ))}
            </div>
        </div>
    )
}

/** Petak gambar untuk Galeri Gambar. */
export function SkeletonGaleri({ jumlah = 12 }: { jumlah?: number }) {
    return (
        <div aria-hidden className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: jumlah }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
                    <Skeleton className="aspect-square w-full rounded-none" />
                    <div className="p-3">
                        <Skeleton className="h-3.5 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    )
}

/** Formulir: beberapa pasang label + isian. */
export function SkeletonForm({ isian = 5 }: { isian?: number }) {
    return (
        <div aria-hidden className="rounded-2xl border border-primary/10 bg-white p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
                {Array.from({ length: isian }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                ))}
            </div>
            <div className="mt-6 flex gap-2">
                <Skeleton className="h-11 w-28 rounded-xl" />
                <Skeleton className="h-11 w-24 rounded-xl" />
            </div>
        </div>
    )
}
