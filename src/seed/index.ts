import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import path from 'path'
import fs from 'fs'
import { JADWAL_SK, CATATAN_SK } from './data/jam-pelayanan'
import { IDENTITAS } from './data/identitas'
import { LAYANAN, type LayananSeed } from './data/layanan'
import { NAKES } from './data/nakes'
import { PROFIL } from './data/profil'
import { FASILITAS } from './data/fasilitas'
import { STRUKTUR, type SimpulSeed } from './data/struktur-organisasi'
import { ANGKA_PELAYANAN, PERIODE, SUMBER, TOTAL_KUNJUNGAN } from './data/angka-pelayanan'
import { SERTIFIKAT } from './data/sertifikat'
import { r2Aktif, unduhDariR2 } from '../lib/penyimpanan'

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
        // Ditulis rekursif karena SK-nya berjenjang sampai tiga tingkat
        // (Laboratorium → Pemeriksaan Serologi → Widal Test). Induk dibuat
        // lebih dulu supaya id-nya tersedia saat anaknya dibuat.
        let dibuat = 0
        const buatLayanan = async (daftar: LayananSeed[], idInduk: number | null) => {
            for (const [i, l] of daftar.entries()) {
                const doc = await payload.create({
                    collection: 'services',
                    data: {
                        nama: l.nama,
                        kategori: l.kategori,
                        jadwal: l.jadwal ?? null,
                        induk: idInduk,
                        urutan: i + 1,
                        aktif: true,
                    },
                    overrideAccess: true,
                })
                dibuat++
                if (l.anak?.length) await buatLayanan(l.anak, doc.id)
            }
        }
        await buatLayanan(LAYANAN, null)
        catat(`${dibuat} layanan dibuat (termasuk sub-layanan)`)
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

    // --- 9. Struktur organisasi ------------------------------------------
    const { totalDocs: jumlahJabatan } = await payload.count({ collection: 'org-chart' })
    if (jumlahJabatan === 0) {
        let simpul = 0
        const buatSimpul = async (daftar: SimpulSeed[], idAtasan: number | null) => {
            for (const [i, n] of daftar.entries()) {
                const doc = await payload.create({
                    collection: 'org-chart',
                    data: { jabatan: n.jabatan, nama: n.nama, atasan: idAtasan, urutan: i + 1 },
                    overrideAccess: true,
                })
                simpul++
                if (n.anak?.length) await buatSimpul(n.anak, doc.id)
            }
        }
        await buatSimpul(STRUKTUR, null)
        catat(`${simpul} jabatan struktur organisasi dibuat`)
    } else {
        catat(`struktur organisasi sudah ada (${jumlahJabatan}) — dilewati`)
    }

    // --- 10. Angka pelayanan ---------------------------------------------
    const { totalDocs: jumlahAngka } = await payload.count({ collection: 'service-statistics' })
    if (jumlahAngka === 0) {
        // Pemeriksaan silang: keempat pengelompokan harus menjumlah ke total
        // yang sama. Kalau meleset, ada baris yang salah salin dari gambar
        // sumbernya — lebih baik seed berhenti daripada memublikasikan angka
        // yang tidak bisa dipertanggungjawabkan.
        const kelompok = [...new Set(ANGKA_PELAYANAN.map((a) => a.kelompok))]
        for (const k of kelompok) {
            const jumlah = ANGKA_PELAYANAN.filter((a) => a.kelompok === k).reduce(
                (t, a) => t + a.jumlah,
                0,
            )
            if (jumlah !== TOTAL_KUNJUNGAN) {
                throw new Error(
                    `Angka pelayanan kelompok "${k}" berjumlah ${jumlah}, seharusnya ${TOTAL_KUNJUNGAN}.`,
                )
            }
        }

        for (const [i, a] of ANGKA_PELAYANAN.entries()) {
            await payload.create({
                collection: 'service-statistics',
                data: { ...a, periode: PERIODE, urutan: i + 1, sumber: SUMBER },
                overrideAccess: true,
            })
        }
        catat(`${ANGKA_PELAYANAN.length} angka pelayanan periode ${PERIODE} dibuat`)
    } else {
        catat(`angka pelayanan sudah ada (${jumlahAngka}) — dilewati`)
    }

    // --- 11. Sertifikat & penghargaan ------------------------------------
    // Satu-satunya bagian seed yang ikut MENGUNGGAH berkas. Field `berkas`
    // wajib terisi, jadi teks piagam tidak ada gunanya tanpa fotonya; dan
    // mencocokkan sendiri 9 nama berkas lewat /dashboard/media adalah pekerjaan
    // yang mudah keliru.
    //
    // Sumber fotonya dicari berurutan:
    //
    //   1. `data/Sertifikat/` di komputer ini — jalur pertama, dipakai saat
    //      berkas aslinya memang ada.
    //   2. Bucket R2, kalau `.env` mengisi keempat `R2_*`. Foto piagamnya 8,4 MB
    //      sehingga sengaja tidak ikut di repo, TAPI salinannya sudah ada di
    //      bucket. Tanpa jalur ini, setiap anggota tim harus menunggu kiriman
    //      folder lewat Drive setiap kali database-nya dibuat ulang.
    //   3. Menyerah dengan tenang — lihat di bawah.
    const { totalDocs: jumlahSertifikat } = await payload.count({ collection: 'certificates' })
    if (jumlahSertifikat === 0) {
        const dirSumber = path.resolve(process.cwd(), 'data/Sertifikat')
        const adaFolderLokal = fs.existsSync(dirSumber)

        if (!adaFolderLokal && !r2Aktif()) {
            // WAJAR terjadi: komputer tanpa kredensial R2 dan tanpa folder
            // sumbernya. Berhenti dengan galat akan menggagalkan sepuluh bagian
            // lain yang tidak ada hubungannya, jadi cukup dilewati — dengan
            // pesan yang menyebutkan dua jalan keluarnya sekaligus.
            catat(
                'sertifikat dilewati — tidak ada folder data/Sertifikat dan R2 belum dikonfigurasi. ' +
                    'Isi R2_* di .env (fotonya sudah ada di bucket) atau minta foldernya ke pemilik repo.',
            )
        } else {
            let dibuat = 0
            let dariR2 = 0

            for (const s of SERTIFIKAT) {
                const berkasLokal = path.join(dirSumber, s.berkasSumber)

                let isi: Buffer | null = null
                if (adaFolderLokal && fs.existsSync(berkasLokal)) {
                    isi = fs.readFileSync(berkasLokal)
                } else {
                    // Nama berkas di bucket sama dengan nama aslinya — itulah
                    // yang dipakai Payload sebagai kunci objek saat mengunggah.
                    isi = await unduhDariR2(s.berkasSumber)
                    if (isi) dariR2++
                }

                if (!isi) {
                    catat(`foto "${s.berkasSumber}" tidak ada di folder maupun R2 — "${s.judul}" dilewati`)
                    continue
                }

                // `alt` dipakai sebagai penanda: kalau unggahan sebelumnya
                // berhasil tapi pembuatan dokumen sertifikatnya gagal, jalan
                // kedua memakai ulang gambar yang sudah ada, bukan
                // menggandakannya di Galeri Gambar.
                const sudahAda = await payload.find({
                    collection: 'media',
                    where: { alt: { equals: s.judul } },
                    limit: 1,
                    depth: 0,
                    overrideAccess: true,
                })

                const gambar =
                    sudahAda.docs[0] ??
                    (await payload.create({
                        collection: 'media',
                        data: { alt: s.judul },
                        // Dikirim sebagai buffer, bukan `filePath`: isinya bisa
                        // datang dari R2 dan tidak selalu ada di disk.
                        file: {
                            data: isi,
                            name: s.berkasSumber,
                            mimetype: 'image/jpeg',
                            size: isi.byteLength,
                        },
                        overrideAccess: true,
                    }))

                await payload.create({
                    collection: 'certificates',
                    data: {
                        judul: s.judul,
                        jenis: s.jenis,
                        penerbit: s.penerbit,
                        tanggal: s.tanggal,
                        keterangan: s.keterangan,
                        berkas: gambar.id,
                    },
                    overrideAccess: true,
                })
                dibuat++
            }

            const asal = dariR2 > 0 ? ` (${dariR2} foto diambil dari R2)` : ''
            catat(`${dibuat} sertifikat/penghargaan dibuat beserta fotonya${asal}`)
        }
    } else {
        catat(`sertifikat sudah ada (${jumlahSertifikat}) — dilewati`)
    }

    // --- Menunggu berkas berikutnya -------------------------------------
    // Belum di-seed:
    // - Posyandu: daftarnya belum tersedia dari Puskesmas.

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
