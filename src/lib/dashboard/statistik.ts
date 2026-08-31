import { getPayload, type Where } from 'payload'
import config from '@payload-config'

const HARI_MS = 86_400_000
const WITA_OFFSET_MS = 8 * 3_600_000 // Asia/Makassar (UTC+8)

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const keWita = (iso: string) => new Date(new Date(iso).getTime() + WITA_OFFSET_MS)

export type Bar = { label: string; count: number }

/** Agregasi kunjungan situs publik. Dipisah dari komponen supaya pemanggilan
 *  fungsi tidak-murni (Date.now) tidak terjadi saat render. */
export async function ambilStatistik() {
    const payload = await getPayload({ config })
    const sekarang = Date.now()
    const sejak = (hari: number) => new Date(sekarang - hari * HARI_MS).toISOString()

    const hitung = (where: Where) =>
        payload.count({ collection: 'page-views', where })

    const [hariIni, tujuhHari, tigaPuluhHari, setahun] = await Promise.all([
        hitung({ createdAt: { greater_than: sejak(1) } }),
        hitung({ createdAt: { greater_than: sejak(7) } }),
        hitung({ createdAt: { greater_than: sejak(30) } }),
        hitung({ createdAt: { greater_than: sejak(365) } }),
    ])

    // Perbandingan 7 hari terakhir vs 7 hari sebelumnya.
    const tujuhSebelumnya = await payload.count({
        collection: 'page-views',
        where: {
            and: [
                { createdAt: { greater_than: sejak(14) } },
                { createdAt: { less_than_equal: sejak(7) } },
            ],
        },
    })

    // Ambil 30 hari terakhir untuk histogram harian & sebaran jam.
    const { docs } = await payload.find({
        collection: 'page-views',
        where: { createdAt: { greater_than: sejak(30) } },
        limit: 20_000,
        depth: 0,
        pagination: false,
        sort: '-createdAt',
    })

    // Histogram 7 hari terakhir (WITA).
    const emberHarian: (Bar & { kunci: string })[] = []
    for (let i = 6; i >= 0; i--) {
        const d = keWita(new Date(sekarang - i * HARI_MS).toISOString())
        emberHarian.push({
            kunci: d.toISOString().slice(0, 10),
            label: HARI[d.getUTCDay()],
            count: 0,
        })
    }

    const jam = new Array(24).fill(0) as number[]
    const jumlahHalaman = new Map<string, number>()

    for (const d of docs) {
        const w = keWita(d.createdAt)
        const kunci = w.toISOString().slice(0, 10)
        const ember = emberHarian.find((x) => x.kunci === kunci)
        if (ember) ember.count++
        jam[w.getUTCHours()]++
        jumlahHalaman.set(d.path, (jumlahHalaman.get(d.path) ?? 0) + 1)
    }

    // Histogram 12 bulan terakhir.
    const kiniD = new Date()
    const emberBulanan: Bar[] = []
    const hitungBulanan = await Promise.all(
        Array.from({ length: 12 }, (_, k) => {
            const i = 11 - k
            const mulai = new Date(Date.UTC(kiniD.getUTCFullYear(), kiniD.getUTCMonth() - i, 1))
            const selesai = new Date(Date.UTC(mulai.getUTCFullYear(), mulai.getUTCMonth() + 1, 1))
            emberBulanan.push({ label: BULAN[mulai.getUTCMonth()], count: 0 })
            return hitung({
                and: [
                    { createdAt: { greater_than_equal: mulai.toISOString() } },
                    { createdAt: { less_than: selesai.toISOString() } },
                ],
            })
        })
    )
    hitungBulanan.forEach((h, i) => {
        emberBulanan[i].count = h.totalDocs
    })

    const jamRamai = jam.indexOf(Math.max(...jam))
    const pad = (n: number) => String(n).padStart(2, '0')

    const halamanTerpopuler = [...jumlahHalaman.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, count]) => ({ path, count }))

    return {
        hariIni: hariIni.totalDocs,
        tujuhHari: tujuhHari.totalDocs,
        tigaPuluhHari: tigaPuluhHari.totalDocs,
        setahun: setahun.totalDocs,
        selisihMingguan: tujuhHari.totalDocs - tujuhSebelumnya.totalDocs,
        emberHarian: emberHarian.map(({ label, count }) => ({ label, count })),
        emberBulanan,
        jamRamai: `${pad(jamRamai)}.00–${pad((jamRamai + 1) % 24)}.00`,
        jumlahJamRamai: jam[jamRamai],
        halamanTerpopuler,
        adaData: setahun.totalDocs > 0,
    }
}
