import type { ReactNode } from 'react'
import { SkeletonJudul } from './Skeleton'
import PemuatLayar from './PemuatLayar'

/** Pembungkus semua tampilan pemuatan halaman dashboard.
 *
 *  Satu-satunya tempat yang berbicara ke pembaca layar: seluruh kotak skeleton
 *  di dalamnya `aria-hidden`, dan pengumumannya diringkas jadi satu kalimat di
 *  sini. `role="status"` + `aria-live="polite"` berarti diumumkan tanpa memotong
 *  apa yang sedang dibacakan.
 *
 *  Dipakai lewat `loading.tsx` di tiap folder halaman, jadi kerangka ini muncul
 *  seketika saat menu diklik sementara data masih diambil — sidebar dan bilah
 *  atas tetap terlihat karena keduanya milik layout, bukan halaman. */
export default function KerangkaHalaman({
    children,
    label = 'Memuat halaman',
    tanpaJudul = false,
}: {
    children: ReactNode
    /** Kalimat yang dibacakan pembaca layar. Sebutkan halamannya, mis.
     *  "Memuat daftar artikel". */
    label?: string
    /** true bila halaman tidak memakai `PageHeader`. */
    tanpaJudul?: boolean
}) {
    return (
        <div role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">{label}…</span>
            {!tanpaJudul && <SkeletonJudul />}
            {children}
            {/* Popup di tengah layar. Skeleton menjelaskan *bentuk* halaman
                yang akan datang; popup ini menjelaskan bahwa halamannya memang
                sedang diambil — dua pesan berbeda, keduanya perlu.
                `umumkan` dimatikan: pengumuman untuk pembaca layar sudah
                dipegang `sr-only` di atas, cukup sekali. */}
            <PemuatLayar label={label} keterangan="Mohon tunggu sebentar." />
        </div>
    )
}
