import type { Endpoint, PayloadRequest } from 'payload'
import type { Media, Posyandu } from '../../payload-types'
import { labelHari, URUTAN_HARI } from '../hari'

/**
 * REST `/api/posyandu` dalam bentuk kontrak API (Claude.md §3.6).
 *
 * Kenapa ada lapisan ini: koleksi di repo ini memakai nama isian bahasa
 * Indonesia (`nama`, `desa`, `jadwal[].jamMulai`) dan jadwalnya berupa daftar,
 * sementara kontrak yang disepakati untuk konsumen API memakai `name`,
 * `location.villageName`, `schedule.startTime`. Pemetaan dilakukan di sini
 * supaya konsumen tidak perlu tahu isi skema Payload — mengganti nama isian
 * cukup mengubah `keKontrakApi()`.
 *
 * Situs publik sendiri TIDAK membaca endpoint ini; server component memakai
 * `src/lib/konten/posyandu.ts` (docs/KONTRAK-DATA.md). Endpoint ini untuk
 * konsumen luar, mis. aplikasi lain atau pihak dinas.
 *
 * Hanya GET yang diganti. POST/PATCH/DELETE dan `/count` tetap endpoint bawaan
 * Payload, karena endpoint kustom dicocokkan lebih dulu dan berhenti di
 * kecocokan pertama.
 */

export type JadwalApi = {
    day: string
    weekPattern: string | null
    startTime: string | null
    endTime: string | null
}

export type PosyanduApi = {
    id: string
    name: string
    description: string | null
    image: { url: string; alt: string } | null
    location: { villageName: string | null; address: string | null }
    /** Jadwal pertama (Senin → Minggu). Kontrak §3.6 berbentuk satu jadwal. */
    schedule: JadwalApi | null
    /** Seluruh jadwal. Tambahan di luar kontrak untuk posyandu yang kegiatannya
     *  lebih dari sekali; konsumen yang hanya mengenal `schedule` tidak terganggu. */
    schedules: JadwalApi[]
    isActive: boolean
    order: number
}

function bersih(teks: string | null | undefined): string | null {
    return teks?.trim() || null
}

/** URL media dijadikan absolut: konsumen API berada di domain lain, dan
 *  `/api/media/file/...` tidak berarti apa-apa bagi mereka. */
function urlAbsolut(url: string, req: PayloadRequest): string {
    const asal = process.env.APP_URL?.trim() || req.origin || ''
    try {
        return new URL(url, asal).href
    } catch {
        return url
    }
}

export function keKontrakApi(d: Posyandu, req: PayloadRequest): PosyanduApi {
    const foto = typeof d.foto === 'object' && d.foto !== null ? (d.foto as Media) : null

    const schedules = [...(d.jadwal ?? [])]
        .sort((a, b) => (URUTAN_HARI[a.hari] ?? 99) - (URUTAN_HARI[b.hari] ?? 99))
        .map((j) => ({
            day: labelHari(j.hari),
            weekPattern: bersih(j.polaMinggu),
            startTime: bersih(j.jamMulai),
            endTime: bersih(j.jamSelesai),
        }))

    return {
        id: String(d.id),
        name: d.nama,
        description: bersih(d.deskripsi),
        image: foto?.url ? { url: urlAbsolut(foto.url, req), alt: bersih(foto.alt) ?? d.nama } : null,
        location: { villageName: bersih(d.desa), address: bersih(d.alamat) },
        schedule: schedules[0] ?? null,
        schedules,
        isActive: d.aktif !== false,
        order: d.urutan ?? 0,
    }
}

function superAdmin(req: PayloadRequest): boolean {
    return (req.user as { role?: string } | null)?.role === 'superadmin'
}

/** GET /api/posyandu — daftar posyandu aktif, urut `urutan` lalu nama.
 *  `?all=true` menyertakan yang nonaktif, khusus superadmin yang sudah login. */
export const endpointDaftarPosyandu: Endpoint = {
    path: '/',
    method: 'get',
    handler: async (req) => {
        const semua = req.searchParams.get('all') === 'true'

        if (semua && !superAdmin(req)) {
            return Response.json(
                { message: 'Parameter all=true hanya untuk superadmin yang sudah login.' },
                { status: req.user ? 403 : 401 },
            )
        }

        const { docs } = await req.payload.find({
            collection: 'posyandu',
            where: semua ? undefined : { aktif: { equals: true } },
            sort: ['urutan', 'nama'],
            depth: 1, // resolve `foto`
            pagination: false,
            // Access control koleksi tetap berlaku: tanpa login, `read` sendiri
            // sudah membatasi ke posyandu aktif.
            user: req.user,
            overrideAccess: false,
            req,
        })

        const hasil = docs.map((d) => keKontrakApi(d, req))
        return Response.json({ docs: hasil, totalDocs: hasil.length })
    },
}

/** GET /api/posyandu/:id — satu posyandu. Id dibatasi angka supaya tidak
 *  menelan endpoint bawaan seperti `/count`. */
export const endpointDetailPosyandu: Endpoint = {
    path: '/:id(\\d+)',
    method: 'get',
    handler: async (req) => {
        const id = Number(req.routeParams?.id)

        const doc = await req.payload.findByID({
            collection: 'posyandu',
            id,
            depth: 1,
            disableErrors: true,
            user: req.user,
            overrideAccess: false,
            req,
        })

        if (!doc) {
            return Response.json({ message: 'Posyandu tidak ditemukan.' }, { status: 404 })
        }

        return Response.json(keKontrakApi(doc, req))
    },
}
