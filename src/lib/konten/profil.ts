import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type KelompokBudayaKerja = {
    judul: string
    keterangan: string | null
    butir: string[]
}

/** Data kelembagaan & wilayah kerja. Semua opsional — diisi bertahap. */
export type DataKelembagaan = {
    kodePuskesmas: string | null
    kepalaPuskesmas: string | null
    kategori: string | null
    jenis: string | null
    letak: string | null
    topografi: string | null
    luasWilayah: string | null
    jumlahDesa: string | null
    jumlahRT: number | null
    jumlahPenduduk: number | null
    jumlahKK: number | null
}

export type ProfilPuskesmas = {
    kelembagaan: DataKelembagaan
    visi: string | null
    /** Atribusi visi. WAJIB ikut ditampilkan bila terisi: visi yang tersimpan
     *  berasal dari RPJMD Kabupaten, bukan rumusan Puskesmas sendiri. */
    sumberVisi: string | null
    /** Sudah berupa larik string; kosong bila belum diisi. */
    misi: string[]
    motto: string | null
    maklumatPelayanan: string | null
    budayaKerja: KelompokBudayaKerja[]
    sejarah: string | null
}

/**
 * Profil kelembagaan: visi, misi, motto, maklumat pelayanan, budaya kerja.
 *
 * Semua nilainya boleh `null`/kosong — halaman profil harus tetap tampil rapi
 * saat sebagian belum diisi, karena pengisiannya bertahap mengikuti C1–C7 di
 * `docs/PROJECT_PLAN.md`.
 */
export const ambilProfil = unstable_cache(
    async (): Promise<ProfilPuskesmas> => {
        const payload = await getPayload({ config })
        const data = await payload.findGlobal({ slug: 'profile', depth: 0 })

        return {
            kelembagaan: {
                kodePuskesmas: data.kodePuskesmas?.trim() || null,
                kepalaPuskesmas: data.kepalaPuskesmas?.trim() || null,
                kategori: data.kategori?.trim() || null,
                jenis: data.jenis?.trim() || null,
                letak: data.letak?.trim() || null,
                topografi: data.topografi?.trim() || null,
                luasWilayah: data.luasWilayah?.trim() || null,
                jumlahDesa: data.jumlahDesa?.trim() || null,
                jumlahRT: data.jumlahRT ?? null,
                jumlahPenduduk: data.jumlahPenduduk ?? null,
                jumlahKK: data.jumlahKK ?? null,
            },
            visi: data.visi?.trim() || null,
            sumberVisi: data.sumberVisi?.trim() || null,
            misi: (data.misi ?? []).map((m) => m.isi).filter(Boolean),
            motto: data.motto?.trim() || null,
            maklumatPelayanan: data.maklumatPelayanan?.trim() || null,
            budayaKerja: (data.budayaKerja ?? []).map((b) => ({
                judul: b.judul,
                keterangan: b.keterangan?.trim() || null,
                butir: (b.butir ?? []).map((x) => x.isi).filter(Boolean),
            })),
            sejarah: data.sejarah?.trim() || null,
        }
    },
    ['konten:profil'],
    { tags: [TAG.profil], revalidate: UMUR_CACHE_DETIK },
)
