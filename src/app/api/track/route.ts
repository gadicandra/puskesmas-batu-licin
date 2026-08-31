import { getPayload } from 'payload'
import config from '@payload-config'

// Filter bot dasar berdasarkan User-Agent.
const BOT_RE = /bot|crawler|spider|crawl|slurp|bingpreview|facebookexternalhit|headless|monitor|curl|wget/i

// Path yang tidak dihitung sebagai kunjungan publik.
const PATH_DIKECUALIKAN = ['/admin', '/dashboard', '/api']

// Rate limit sederhana per IP (in-memory). Cukup untuk satu instance; bila nanti
// berjalan multi-instance, pindahkan ke Redis atau layanan rate limit.
const MAKS_PER_MENIT = 30
const JENDELA_MS = 60_000
const kunjungan = new Map<string, { jumlah: number; reset: number }>()

function lewatBatas(ip: string): boolean {
    const sekarang = Date.now()
    const entri = kunjungan.get(ip)

    if (!entri || sekarang > entri.reset) {
        kunjungan.set(ip, { jumlah: 1, reset: sekarang + JENDELA_MS })
        // Bersihkan entri kedaluwarsa sesekali supaya map tidak tumbuh terus.
        if (kunjungan.size > 5_000) {
            for (const [key, nilai] of kunjungan) {
                if (sekarang > nilai.reset) kunjungan.delete(key)
            }
        }
        return false
    }

    entri.jumlah += 1
    return entri.jumlah > MAKS_PER_MENIT
}

function ambilIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()
    return req.headers.get('x-real-ip') || 'tidak-diketahui'
}

/** Path internal yang valid: diawali "/", tanpa protokol, tanpa host. */
function pathValid(path: string): boolean {
    return path.startsWith('/') && !path.startsWith('//') && !path.includes('://')
}

function hash(str: string): string {
    let h = 0
    for (let i = 0; i < str.length; i++) {
        h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
    }
    return (h >>> 0).toString(36)
}

export async function POST(req: Request) {
    try {
        const ua = req.headers.get('user-agent') || ''
        if (BOT_RE.test(ua)) return Response.json({ ok: true, skipped: 'bot' })

        if (lewatBatas(ambilIp(req))) {
            return Response.json({ ok: false, error: 'terlalu-sering' }, { status: 429 })
        }

        const body = (await req.json().catch(() => ({}))) as { path?: string; referrer?: string }
        const path = (body.path || '').slice(0, 512)
        if (!path || !pathValid(path)) return Response.json({ ok: false }, { status: 400 })
        if (PATH_DIKECUALIKAN.some((awalan) => path.startsWith(awalan))) {
            return Response.json({ ok: true, skipped: 'internal' })
        }

        const payload = await getPayload({ config })
        await payload.create({
            collection: 'page-views',
            data: {
                path,
                referrer: (body.referrer || '').slice(0, 512) || undefined,
                uaHash: hash(ua),
            },
            overrideAccess: true,
        })
        return Response.json({ ok: true })
    } catch {
        return Response.json({ ok: false }, { status: 500 })
    }
}
