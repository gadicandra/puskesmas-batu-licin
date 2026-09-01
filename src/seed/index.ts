import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { JADWAL_SK, CATATAN_SK } from './data/jam-pelayanan'
import { IDENTITAS } from './data/identitas'
import { LAYANAN } from './data/layanan'
import { NAKES } from './data/nakes'
import { PROFIL } from './data/profil'
import { FASILITAS } from './data/fasilitas'

/**
 * Pengisian data awal database.
 *
 *   pnpm seed
 *   docker compose --profile seed up seed
 *
 * Dua sifat yang wajib dijaga saat menambah data di sini:
 *
 * 1. IDEMPOTEN. Setiap bagian memeriksa lebih dulu apakah datanya sudah ada,
 *    lalu melewatinya. Skrip ini ikut jalan dari `docker compose`, jadi
 *    menjalankannya dua kali TIDAK boleh menggandakan apa pun atau menimpa
 *    hasil kerja staf.
 * 2. HANYA DATA RESMI. Isinya harus bisa ditelusuri ke sumber yang jelas —
 *    SK, `data/puskesmas.md`, atau berkas di `data/sumber/`. Jangan menaruh
 *    contoh karangan di sini: begitu masuk database produksi, tidak ada yang
 *    tahu lagi mana yang asli.
 *
 * `overrideAccess: true` dipakai di seluruh berkas ini karena belum ada user
 * yang bisa dijadikan aktor saat database masih kosong.
 */

const catat = (pesan: string) => console.log(`[seed] ${pesan}`)

/**
 * Apakah sebuah global BENAR-BENAR sudah tersimpan sebagai baris di database?
 *
 * Isi field-nya tidak bisa dijadikan penanda: `payload.findGlobal()`
 * mengembalikan `defaultValue` dari konfigurasi walaupun barisnya belum pernah
 * dibuat, sehingga seed akan menyimpulkan "sudah diisi" pada database yang
 * benar-benar kosong lalu melewatkan penulisannya. Nilainya memang tetap tampil
 * di situs (karena default), tapi form dashboard tidak punya baris untuk
 * disunting.
 *
 * `payload.db.findGlobal()` juga tidak bisa: untuk global yang belum tersimpan
 * ia mengembalikan `{}` — objek kosong yang tetap truthy.
 *
 * `updatedAt` adalah penandanya: hanya terisi setelah barisnya sungguh ditulis.
 */
async function globalTersimpan(
    payload: Payload,
    slug: 'operational-hours' | 'site-settings' | 'profile',
) {
    const g = (await payload.findGlobal({ slug, depth: 0 })) as { updatedAt?: string }
    return Boolean(g.updatedAt)
}

async function seed() {
    const payload = await getPayload({ config })

    // --- 1. Akun superadmin pertama -------------------------------------
    const { totalDocs: jumlahUser } = await payload.count({ collection: 'users' })
    if (jumlahUser === 0) {
        const email = process.env.SEED_ADMIN_EMAIL
        const password = process.env.SEED_ADMIN_PASSWORD

        // Di produksi, akun default berarti pintu masuk yang kata sandinya
        // tertulis di repositori. Lebih baik seed berhenti daripada membuatnya.
        if (process.env.NODE_ENV === 'production' && (!email || !password)) {
            throw new Error(
                'SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD wajib diisi saat NODE_ENV=production.',
            )
        }

        await payload.create({
            collection: 'users',
            data: {
                name: 'Administrator',
                email: email || 'admin@puskesmas.local',
                password: password || 'puskesmas123',
                role: 'superadmin',
                metodeLogin: 'sandi',
            },
            overrideAccess: true,
        })
        catat(`akun superadmin dibuat: ${email || 'admin@puskesmas.local'}`)
    } else {
        catat(`akun sudah ada (${jumlahUser}) — dilewati`)
    }

    // --- 2. Jam pelayanan (SK B/445.61/003/PKM.Btl-Adm/I/2023) ----------
    if (!(await globalTersimpan(payload, 'operational-hours'))) {
        await payload.updateGlobal({
            slug: 'operational-hours',
            data: { jadwal: JADWAL_SK, catatan: CATATAN_SK },
            overrideAccess: true,
        })
        catat('jam pelayanan diisi dari SK')
    } else {
        catat('jam pelayanan sudah diisi — dilewati')
    }

    // --- 3. Identitas & kontak ------------------------------------------
    if (!(await globalTersimpan(payload, 'site-settings'))) {
        await payload.updateGlobal({
            slug: 'site-settings',
            data: IDENTITAS,
            overrideAccess: true,
        })
        catat('identitas & kontak diisi')
    } else {
        catat('identitas sudah diisi — dilewati')
    }

    // --- 4. Profil kelembagaan -------------------------------------------
    if (!(await globalTersimpan(payload, 'profile'))) {
        await payload.updateGlobal({ slug: 'profile', data: PROFIL, overrideAccess: true })
        catat('profil (visi, misi, motto, budaya kerja, data wilayah) diisi')
    } else {
        catat('profil sudah diisi — dilewati')
    }

    // --- 5. Katalog layanan ---------------------------------------------
    const { totalDocs: jumlahLayanan } = await payload.count({ collection: 'services' })
    if (jumlahLayanan === 0) {
        for (const [i, l] of LAYANAN.entries()) {
            await payload.create({
                collection: 'services',
                data: { ...l, urutan: i + 1, aktif: true },
                overrideAccess: true,
            })
        }
        catat(`${LAYANAN.length} layanan dibuat`)
    } else {
        catat(`layanan sudah ada (${jumlahLayanan}) — dilewati`)
    }

    // --- 6. Sarana & ruangan ---------------------------------------------
    const { totalDocs: jumlahFasilitas } = await payload.count({ collection: 'facilities' })
    if (jumlahFasilitas === 0) {
        for (const [i, f] of FASILITAS.entries()) {
            await payload.create({
                collection: 'facilities',
                data: { ...f, urutan: i + 1, aktif: true },
                overrideAccess: true,
            })
        }
        catat(`${FASILITAS.length} sarana & ruangan dibuat`)
    } else {
        catat(`sarana sudah ada (${jumlahFasilitas}) — dilewati`)
    }

    // --- 7. Tenaga kesehatan --------------------------------------------
    const { totalDocs: jumlahNakes } = await payload.count({ collection: 'medical-staff' })
    if (jumlahNakes === 0) {
        for (const n of NAKES) {
            await payload.create({
                collection: 'medical-staff',
                // `foto` sengaja tidak diisi: belum ada fotonya. Lapisan konten
                // mengembalikan `null` dan UI yang memilih penggantinya.
                data: { ...n, aktif: true },
                overrideAccess: true,
            })
        }
        catat(`${NAKES.length} tenaga kesehatan dibuat`)
    } else {
        catat(`tenaga kesehatan sudah ada (${jumlahNakes}) — dilewati`)
    }

    // --- 8. Dokter -------------------------------------------------------
    // Dokter sengaja tercatat di dua tempat dengan peran berbeda:
    // `medical-staff` menjawab "siapa saja pegawainya", `doctors` menjawab
    // "kapan dokter praktik" (punya jadwal, STR, pendidikan).
    const { totalDocs: jumlahDokter } = await payload.count({ collection: 'doctors' })
    if (jumlahDokter === 0) {
        const dariNakes = NAKES.filter((n) => n.jabatan === 'dokter')
        for (const d of dariNakes) {
            await payload.create({
                collection: 'doctors',
                data: {
                    nama: d.nama,
                    spesialisasi: d.jabatanLengkap,
                    // Jadwal praktik, STR, dan pendidikan belum ada di berkas
                    // sumber — diisi staf lewat /dashboard/dokter.
                    aktif: true,
                },
                overrideAccess: true,
            })
        }
        catat(`${dariNakes.length} dokter dibuat`)
    } else {
        catat(`dokter sudah ada (${jumlahDokter}) — dilewati`)
    }

    // --- Menunggu berkas berikutnya -------------------------------------
    // Posyandu, fasilitas, sertifikat, dan struktur organisasi menyusul.
    // Berkas sumbernya sudah ada di `data/` (Sertifikat/,
    // StrukturOrganisasiMaster.png, DataAngkaYangTerlayani.jpeg) tapi masih
    // berupa gambar — perlu dibaca dan dipetakan dulu bersama Puskesmas.

    catat('selesai.')
}

// Top-level await, BUKAN `seed().then(...)`. `payload run` selesai begitu
// modulnya habis dievaluasi; promise yang mengambang membuat prosesnya keluar
// dengan kode 0 sebelum satu baris pun sempat ditulis ke database — gagal
// tanpa pesan galat sama sekali.
try {
    await seed()
    process.exit(0)
} catch (err) {
    console.error('[seed] GAGAL:', err)
    process.exit(1)
}
