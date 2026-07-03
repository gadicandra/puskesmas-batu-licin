import { getPayload } from 'payload'
import config from '@payload-config'

// Filter bot dasar berdasarkan User-Agent.
const BOT_RE = /bot|crawler|spider|crawl|slurp|bingpreview|facebookexternalhit|headless|monitor|curl|wget/i

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

        const body = (await req.json().catch(() => ({}))) as { path?: string; referrer?: string }
        const path = (body.path || '').slice(0, 512)
        if (!path) return Response.json({ ok: false }, { status: 400 })

        const payload = await getPayload({ config })
        await payload.create({
            collection: 'page-views',
            data: {
                path,
                referrer: (body.referrer || '').slice(0, 512) || undefined,
                uaHash: hash(ua),
            },
        })
        return Response.json({ ok: true })
    } catch {
        return Response.json({ ok: false }, { status: 500 })
    }
}
