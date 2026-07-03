import { getPayload } from 'payload'
import config from '@payload-config'

const DAY_MS = 86_400_000
const WITA_OFFSET_MS = 8 * 3_600_000 // Asia/Makassar (UTC+8)

// Geser waktu UTC ke WITA lalu ambil komponen tanggal/jam-nya.
const toWita = (iso: string) => new Date(new Date(iso).getTime() + WITA_OFFSET_MS)
const witaDayKey = (iso: string) => toWita(iso).toISOString().slice(0, 10)
const witaHour = (iso: string) => toWita(iso).getUTCHours()

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default async function DashboardStats() {
    const payload = await getPayload({ config })
    const now = Date.now()
    const since = (days: number) => new Date(now - days * DAY_MS).toISOString()

    let week = 0
    let month = 0
    let year = 0
    let recent: { createdAt: string }[] = []

    try {
        const [w, m, y, r] = await Promise.all([
            payload.count({ collection: 'page-views', where: { createdAt: { greater_than_equal: since(7) } } }),
            payload.count({ collection: 'page-views', where: { createdAt: { greater_than_equal: since(30) } } }),
            payload.count({ collection: 'page-views', where: { createdAt: { greater_than_equal: since(365) } } }),
            payload.find({
                collection: 'page-views',
                where: { createdAt: { greater_than_equal: since(7) } },
                limit: 20000,
                depth: 0,
                pagination: false,
            }),
        ])
        week = w.totalDocs
        month = m.totalDocs
        year = y.totalDocs
        recent = (r.docs as unknown as { createdAt: string }[]) ?? []
    } catch {
        // Tabel belum ada / DB belum siap — tampilkan nol.
    }

    // Histogram 7 hari terakhir (WITA)
    const dayBuckets: { key: string; label: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now - i * DAY_MS + WITA_OFFSET_MS)
        const key = d.toISOString().slice(0, 10)
        dayBuckets.push({ key, label: HARI[d.getUTCDay()], count: 0 })
    }
    const hourBuckets = new Array(24).fill(0)
    for (const v of recent) {
        const dk = witaDayKey(v.createdAt)
        const b = dayBuckets.find((x) => x.key === dk)
        if (b) b.count++
        hourBuckets[witaHour(v.createdAt)]++
    }
    const maxDay = Math.max(1, ...dayBuckets.map((b) => b.count))
    const peakHour = hourBuckets.reduce((best, c, h) => (c > hourBuckets[best] ? h : best), 0)
    const peakCount = hourBuckets[peakHour]

    const green = '#233115'
    const accent = '#697644'

    return (
        <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: green, margin: '0 0 12px' }}>
                Statistik Kunjungan Website
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                {[
                    { label: '7 Hari', value: week },
                    { label: '30 Hari', value: month },
                    { label: '1 Tahun', value: year },
                    { label: 'Jam Peak (WITA)', value: `${String(peakHour).padStart(2, '0')}.00`, sub: `${peakCount} kunjungan` },
                ].map((c) => (
                    <div
                        key={c.label}
                        style={{
                            border: '1px solid rgba(35,49,21,0.12)',
                            borderRadius: 16,
                            padding: 20,
                            background: '#fff',
                        }}
                    >
                        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#6B7584' }}>
                            {c.label}
                        </div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: green, lineHeight: 1.1, marginTop: 6 }}>
                            {c.value}
                        </div>
                        {'sub' in c && c.sub ? (
                            <div style={{ fontSize: 12, color: '#6B7584', marginTop: 2 }}>{c.sub}</div>
                        ) : null}
                    </div>
                ))}
            </div>

            <div
                style={{
                    border: '1px solid rgba(35,49,21,0.12)',
                    borderRadius: 16,
                    padding: 20,
                    background: '#fff',
                    marginTop: 12,
                }}
            >
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#6B7584', marginBottom: 14 }}>
                    Kunjungan 7 Hari Terakhir
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
                    {dayBuckets.map((b) => (
                        <div key={b.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: green }}>{b.count}</div>
                            <div
                                style={{
                                    width: '100%',
                                    height: `${Math.round((b.count / maxDay) * 90)}px`,
                                    minHeight: 3,
                                    background: accent,
                                    borderRadius: '6px 6px 0 0',
                                }}
                            />
                            <div style={{ fontSize: 11, color: '#6B7584' }}>{b.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
