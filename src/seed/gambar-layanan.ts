import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { keWebp } from '../lib/gambar'

/**
 * Pasang foto layanan dari berkas lokal.
 *
 *   pnpm gambar-layanan
 *
 * Taruh gambarnya di `data/layanan-gambar/` dengan **nama berkas = slug
 * layanan**, mis. `pelayanan-kesehatan-gigi-dan-mulut.jpg`. Slug tiap layanan
 * bisa dilihat di /dashboard/layanan atau di alamat halamannya
 * (`/layanan/<slug>`). Berkas dengan slug yang tidak dikenal dilaporkan, bukan
 * didiamkan — salah ketik nama berkas adalah kesalahan yang paling mungkin
 * terjadi di sini.
 *
 * Dipisahkan dari `seed/index.ts` karena sifatnya berbeda: seed berisi data
 * resmi yang ikut `docker compose`, sedangkan ini menempelkan aset yang tidak
 * ada di repositori.
 *
 * IDEMPOTEN. Layanan yang `gambar`-nya sudah terisi dilewati, jadi menjalankan
 * ulang tidak menimpa foto yang sudah dipilih staf. Pakai `--timpa` bila memang
 * ingin menggantinya.
 *
 * Gambarnya lewat `keWebp()` seperti unggahan dari dashboard, jadi hasilnya
 * konsisten: satu jalur pengubahan, bukan dua.
 *
 * Skrip ini jalan di luar Next, jadi ia tidak bisa memanggil `revalidateTag`.
 * Halaman publik ikut berubah setelah cache-nya habis, atau langsung bila
 * situsnya di-build ulang.
 */

const FOLDER = 'data/layanan-gambar'
const EKSTENSI = ['.webp', '.jpg', '.jpeg', '.png', '.avif', '.tiff']

const MIME: Record<string, string> = {
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.avif': 'image/avif',
    '.tiff': 'image/tiff',
}

const catat = (pesan: string) => console.log(`[gambar-layanan] ${pesan}`)

async function jalankan() {
    const timpa = process.argv.includes('--timpa')
    const folder = path.resolve(process.cwd(), FOLDER)

    if (!fs.existsSync(folder)) {
        catat(`folder ${FOLDER}/ belum ada — tidak ada yang dikerjakan.`)
        catat('Buat foldernya, isi dengan gambar bernama <slug-layanan>.jpg, lalu jalankan lagi.')
        return
    }

    const berkas = fs
        .readdirSync(folder)
        .filter((n) => EKSTENSI.includes(path.extname(n).toLowerCase()))

    if (berkas.length === 0) {
        catat(`tidak ada gambar di ${FOLDER}/ — tidak ada yang dikerjakan.`)
        return
    }

    const payload = await getPayload({ config })
    const { docs: layanan } = await payload.find({
        collection: 'services',
        depth: 0,
        limit: 1000,
        pagination: false,
        overrideAccess: true,
    })

    const perSlug = new Map(layanan.filter((l) => l.slug).map((l) => [l.slug as string, l]))

    let dipasang = 0
    let dilewati = 0
    const tidakDikenal: string[] = []

    for (const nama of berkas) {
        const slug = path.basename(nama, path.extname(nama))
        const doc = perSlug.get(slug)

        if (!doc) {
            tidakDikenal.push(nama)
            continue
        }
        if (doc.gambar && !timpa) {
            dilewati++
            continue
        }

        const isi = fs.readFileSync(path.join(folder, nama))
        const siap = await keWebp({
            data: isi,
            mimetype: MIME[path.extname(nama).toLowerCase()] ?? 'image/jpeg',
            name: nama,
            size: isi.byteLength,
        })

        const media = await payload.create({
            collection: 'media',
            // Keterangannya menyebut dirinya ilustrasi. Gambar ini bukan foto
            // ruangan Puskesmas yang sebenarnya, dan pembaca layar tidak boleh
            // dibuat mengira sebaliknya.
            data: { alt: `Ilustrasi layanan ${doc.nama}` },
            file: siap,
            overrideAccess: true,
        })

        await payload.update({
            collection: 'services',
            id: doc.id,
            data: { gambar: media.id },
            overrideAccess: true,
        })

        dipasang++
        catat(`${doc.nama} ← ${nama} (${(isi.byteLength / 1024).toFixed(0)} KB → ${(siap.size / 1024).toFixed(0)} KB)`)
    }

    catat(`selesai: ${dipasang} dipasang, ${dilewati} dilewati (sudah ada gambar).`)
    if (tidakDikenal.length) {
        catat(`slug tidak dikenal, berkas ini diabaikan: ${tidakDikenal.join(', ')}`)
        catat('Cocokkan nama berkas dengan alamat halaman layanannya (/layanan/<slug>).')
    }
}

await jalankan()
