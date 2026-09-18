import { getPayload } from 'payload'
import path from 'path'
import fs from 'fs'
import config from '@payload-config'
import { keWebp } from '../lib/gambar'
import { r2Aktif } from '../lib/penyimpanan'

/**
 * Data CONTOH posyandu — hanya untuk menguji tampilan.
 *
 *   pnpm contoh-posyandu
 *
 * Sengaja TIDAK disatukan dengan `pnpm seed`. Berkas seed utama punya satu
 * aturan yang tidak boleh dilanggar: "HANYA DATA RESMI", karena isinya ikut
 * terisi ke database produksi lewat `docker compose --profile seed up seed` dan
 * setelah itu tidak ada lagi yang bisa membedakan mana yang asli. Daftar
 * posyandu sungguhan belum tersedia dari Puskesmas (lihat docs/PROJECT_PLAN.md
 * D5), sementara grid 3 kolom di `/posyandu` perlu diperiksa tampilannya
 * sekarang. Perintah terpisah menyelesaikan keduanya: yang menjalankannya tahu
 * persis bahwa yang masuk adalah data karangan.
 *
 * Nama, jadwal, dan desa di bawah ini adalah PENGISI SEMENTARA. Ganti lewat
 * /dashboard/posyandu begitu daftar aslinya diterima.
 *
 * Idempoten: berhenti bila tabel posyandu sudah berisi apa pun, jadi tidak
 * mungkin menimpa data yang sudah dimasukkan staf.
 */

const catat = (pesan: string) => console.log(`[contoh-posyandu] ${pesan}`)

type ContohPosyandu = {
    nama: string
    desa: string
    hari: 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu'
    polaMinggu: string
    jamMulai: string
    jamSelesai: string
}

const CONTOH: ContohPosyandu[] = [
    { nama: 'Posyandu Melati', desa: 'Desa Batulicin', hari: 'senin', polaMinggu: 'Minggu ke-1', jamMulai: '08:00', jamSelesai: '11:00' },
    { nama: 'Posyandu Mawar', desa: 'Desa Batulicin', hari: 'selasa', polaMinggu: 'Minggu ke-1', jamMulai: '08:00', jamSelesai: '11:00' },
    { nama: 'Posyandu Anggrek', desa: 'Desa Batulicin', hari: 'rabu', polaMinggu: 'Minggu ke-2', jamMulai: '08:00', jamSelesai: '11:00' },
    { nama: 'Posyandu Kenanga', desa: 'Desa Batulicin', hari: 'kamis', polaMinggu: 'Minggu ke-2', jamMulai: '08:30', jamSelesai: '11:30' },
    { nama: 'Posyandu Dahlia', desa: 'Desa Batulicin', hari: 'jumat', polaMinggu: 'Minggu ke-3', jamMulai: '08:00', jamSelesai: '10:30' },
    { nama: 'Posyandu Flamboyan', desa: 'Desa Batulicin', hari: 'sabtu', polaMinggu: 'Minggu ke-3', jamMulai: '08:00', jamSelesai: '11:00' },
]

/** Foto contoh diambil dari sini bila ada. Kosongkan saja folder ini kalau
 *  tidak perlu — kartu punya cadangan berupa huruf awal nama posyandu. */
const DIR_FOTO = path.resolve(process.cwd(), 'data/contoh-posyandu')

async function contohPosyandu() {
    const payload = await getPayload({ config })

    const { totalDocs } = await payload.count({ collection: 'posyandu' })
    if (totalDocs > 0) {
        catat(`posyandu sudah ada (${totalDocs}) — dilewati, tidak ada yang ditimpa`)
        return
    }

    // Unggahan di mesin ini masuk ke bucket R2 bersama, bukan ke disk lokal.
    // Menaruh foto karangan di sana berarti berkasnya ikut terbawa ke produksi
    // dan harus dibersihkan manual, jadi fotonya dilewati — bukan dibatalkan
    // seluruhnya, karena data teksnya tetap aman (hanya ada di database lokal).
    const lewatiFoto = r2Aktif()
    if (lewatiFoto) {
        catat('R2 aktif — foto contoh dilewati agar bucket bersama tidak terisi berkas karangan.')
        catat('Jalankan tanpa variabel R2_* bila ingin foto contoh ikut terpasang di disk lokal.')
    }

    const berkasFoto =
        !lewatiFoto && fs.existsSync(DIR_FOTO)
            ? fs.readdirSync(DIR_FOTO).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
            : []

    if (!lewatiFoto && berkasFoto.length === 0) {
        catat(`tidak ada foto di ${DIR_FOTO} — kartu memakai cadangan huruf awal nama`)
    }

    for (const [i, c] of CONTOH.entries()) {
        let fotoId: number | null = null

        const namaBerkas = berkasFoto[i % berkasFoto.length]
        if (namaBerkas) {
            const isi = fs.readFileSync(path.join(DIR_FOTO, namaBerkas))
            const ekstensi = path.extname(namaBerkas).toLowerCase()
            const siap = await keWebp({
                data: isi,
                mimetype: ekstensi === '.png' ? 'image/png' : ekstensi === '.webp' ? 'image/webp' : 'image/jpeg',
                name: namaBerkas,
                size: isi.byteLength,
            })
            const media = await payload.create({
                collection: 'media',
                data: { alt: `Kegiatan ${c.nama}` },
                file: siap,
                overrideAccess: true,
            })
            fotoId = media.id
        }

        await payload.create({
            collection: 'posyandu',
            data: {
                nama: c.nama,
                deskripsi: 'Informasi Detail Posyandu',
                desa: c.desa,
                foto: fotoId,
                jadwal: [
                    {
                        hari: c.hari,
                        polaMinggu: c.polaMinggu,
                        jamMulai: c.jamMulai,
                        jamSelesai: c.jamSelesai,
                    },
                ],
                urutan: i + 1,
                aktif: true,
            },
            overrideAccess: true,
        })
    }

    catat(`${CONTOH.length} posyandu contoh dibuat — ganti dengan data asli lewat /dashboard/posyandu`)
}

// `payload run` keluar begitu modulnya selesai dievaluasi, jadi ditunggu di
// tingkat atas — bukan lewat `.then()`.
await contohPosyandu()
