import { getPayload } from 'payload'
import config from '@payload-config'

const DAY_MS = 86_400_000
const WITA_OFFSET_MS = 8 * 3_600_000 // Asia/Makassar (UTC+8)
const toWita = (iso: string) => new Date(new Date(iso).getTime() + WITA_OFFSET_MS)

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

// Warna mengikuti tema Payload (adaptif light & dark).
const C = {
    cardBg: 'var(--theme-elevation-100)',
    border: 'var(--theme-border-color)',
    muted: 'var(--theme-elevation-500)',
    strong: 'var(--theme-text)',
    accent: 'var(--theme-success-500)',
    track: 'var(--theme-elevation-150)',
}

type Bar = { label: string; count: number }

function Bars({ data, height = 90 }: { data: Bar[]; height?: number }) {
    const max = Math.max(1, ...data.map((d) => d.count))
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: height + 30 }}>
            {data.map((b, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.strong }}>{b.count}</div>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height, background: C.track, borderRadius: 6, overflow: 'hidden' }}>
                        <div
                            style={{
                                width: '100%',
                                height: `${Math.round((b.count / max) * height)}px`,
                                minHeight: b.count > 0 ? 3 : 0,
                                background: C.accent,
                                borderRadius: '6px 6px 0 0',
                            }}
                        />
                    </div>
                    <div style={{ fontSize: 10.5, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {b.label}
                    </div>
                </div>
            ))}
        </div>
    )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, background: C.cardBg }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.muted, marginBottom: 14 }}>
                {title}
            </div>
            {children}
        </div>
    )
}

export default async function DashboardStats() {
    const payload = await getPayload({ config })
    const now = Date.now()
    const since = (days: number) => new Date(now - days * DAY_MS).toISOString()

    // Definisi 12 bulan terakhir (untuk histogram bulanan).
    const nowD = new Date()
    const monthDefs = Array.from({ length: 12 }, (_, k) => {
        const i = 11 - k
        const s = new Date(Date.UTC(nowD.getUTCFullYear(), nowD.getUTCMonth() - i, 1))
        const e = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth() + 1, 1))
        return { start: s.toISOString(), end: e.toISOString(), label: BULAN[s.getUTCMonth()], count: 0 }
    })

    let week = 0
    let month = 0
    let year = 0
    let recent: { createdAt: string }[] = []

    try {
        const results = await Promise.all([
            payload.count({ collection: 'page-views', where: { createdAt: { greater_than_equal: since(7) } } }),
            payload.count({ collection: 'page-views', where: { createdAt: { greater_than_equal: since(30) } } }),
            payload.count({ collection: 'page-views', where: { createdAt: { greater_than_equal: since(365) } } }),
            payload.find({
                collection: 'page-views',
                where: { createdAt: { greater_than_equal: since(30) } },
                limit: 20000,
                depth: 0,
                pagination: false,
            }),
            ...monthDefs.map((m) =>
                payload.count({
                    collection: 'page-views',
                    where: { and: [{ createdAt: { greater_than_equal: m.start } }, { createdAt: { less_than: m.end } }] },
                }),
            ),
        ])
        week = (results[0] as { totalDocs: number }).totalDocs
        month = (results[1] as { totalDocs: number }).totalDocs
        year = (results[2] as { totalDocs: number }).totalDocs
        recent = ((results[3] as { docs: unknown[] }).docs as { createdAt: string }[]) ?? []
        for (let i = 0; i < 12; i++) monthDefs[i].count = (results[4 + i] as { totalDocs: number }).totalDocs
    } catch {
        // Tabel belum ada / DB belum siap.
    }

    // Harian (7 hari, WITA)
    const dayBuckets: (Bar & { key: string })[] = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now - i * DAY_MS + WITA_OFFSET_MS)
        dayBuckets.push({ key: d.toISOString().slice(0, 10), label: HARI[d.getUTCDay()], count: 0 })
    }
    // Mingguan (4 minggu dalam 1 bulan)
    const weekBuckets: Bar[] = [
        { label: '4 mgg lalu', count: 0 },
        { label: '3 mgg lalu', count: 0 },
        { label: '2 mgg lalu', count: 0 },
        { label: 'Minggu ini', count: 0 },
    ]
    const hourBuckets = new Array(24).fill(0)

    for (const v of recent) {
        const dk = toWita(v.createdAt).toISOString().slice(0, 10)
        const db = dayBuckets.find((x) => x.key === dk)
        if (db) db.count++
        const daysAgo = Math.floor((now - new Date(v.createdAt).getTime()) / DAY_MS)
        if (daysAgo >= 0 && daysAgo < 28) {
            const wk = 3 - Math.floor(daysAgo / 7)
            if (wk >= 0 && wk < 4) weekBuckets[wk].count++
        }
        hourBuckets[toWita(v.createdAt).getUTCHours()]++
    }
    const peakHour = hourBuckets.reduce((best, c, h) => (c > hourBuckets[best] ? h : best), 0)
    const peakCount = hourBuckets[peakHour]

    const pad = (n: number) => String(n).padStart(2, '0')
    const summary = [
        { label: '7 Hari', value: String(week) },
        { label: '30 Hari', value: String(month) },
        { label: '1 Tahun', value: String(year) },
        {
            label: 'Jam Peak (WITA)',
            value: `${pad(peakHour)}.00–${pad((peakHour + 1) % 24)}.00`,
            sub: `${peakCount} kunjungan`,
            valueSize: 22,
        },
    ]

    return (
        <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: C.strong, margin: '0 0 4px' }}>
                Statistik Kunjungan Website
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                {summary.map((c) => (
                    <div key={c.label} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, background: C.cardBg }}>
                        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.muted }}>
                            {c.label}
                        </div>
                        <div style={{ fontSize: 'valueSize' in c ? c.valueSize : 30, fontWeight: 900, color: C.strong, lineHeight: 1.1, marginTop: 6 }}>{c.value}</div>
                        {'sub' in c && c.sub ? <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{c.sub}</div> : null}
                    </div>
                ))}
            </div>

            <Panel title="Kunjungan per Bulan (1 tahun)">
                <Bars data={monthDefs.map(({ label, count }) => ({ label, count }))} height={110} />
            </Panel>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
                <Panel title="Kunjungan per Minggu (1 bulan)">
                    <Bars data={weekBuckets} />
                </Panel>
                <Panel title="Kunjungan 7 Hari Terakhir">
                    <Bars data={dayBuckets.map(({ label, count }) => ({ label, count }))} />
                </Panel>
            </div>
        </div>
    )
}
