const WITA = 'Asia/Makassar'

export function formatTanggal(iso?: string | null): string {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: WITA,
    })
}

export function formatTanggalWaktu(iso?: string | null): string {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: WITA,
    })
}

/** "3 menit lalu", "2 hari lalu" — untuk daftar aktivitas terbaru. */
export function waktuRelatif(iso?: string | null): string {
    if (!iso) return '-'
    const selisih = Date.now() - new Date(iso).getTime()
    const menit = Math.floor(selisih / 60_000)
    if (menit < 1) return 'baru saja'
    if (menit < 60) return `${menit} menit lalu`
    const jam = Math.floor(menit / 60)
    if (jam < 24) return `${jam} jam lalu`
    const hari = Math.floor(jam / 24)
    if (hari < 30) return `${hari} hari lalu`
    return formatTanggal(iso)
}

export function formatUkuran(bytes?: number | null): string {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
