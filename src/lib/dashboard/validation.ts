import { z } from 'zod'
import { METODE_LOGIN } from './metode-login'

/** Pesan validasi ditulis dalam bahasa sehari-hari dan selalu memberi tahu
 *  cara memperbaiki — bukan sekadar menyatakan ada yang salah.
 *  Lihat docs/DASHBOARD.md §2 prinsip 5. */

/**
 * Isian WAJIB yang pesannya selalu bahasa Indonesia.
 *
 * Perlu ada karena satu jebakan zod: `z.string().min(1, 'pesan')` hanya memakai
 * pesan itu kalau nilainya string kosong. Kalau kuncinya TIDAK ADA sama sekali —
 * dan `buatAksiCrud` memang membuang isian kosong sebelum divalidasi — yang
 * gagal adalah pemeriksaan tipe, dan pesannya jatuh ke bawaan zod dalam bahasa
 * Inggris: "Invalid input: expected string, received undefined". Persis kalimat
 * yang tidak boleh dilihat staf (lihat docs/DASHBOARD.md §2).
 *
 * Karena itu pesannya diberikan DUA kali: sebagai `error` di tingkat tipe, dan
 * sebagai pesan `min`/`int`.
 */
function teksWajib(pesan: string) {
    return z.string({ error: pesan }).trim().min(1, pesan)
}

function angkaWajib(pesan: string, minimum = 0) {
    return z.coerce.number({ error: pesan }).int(pesan).min(minimum, pesan)
}

function pilihanWajib<const T extends readonly [string, ...string[]]>(nilai: T, pesan: string) {
    return z.enum(nilai, { error: pesan })
}

export const skemaArtikel = z.object({
    title: teksWajib('Judul belum diisi. Isi judul artikel lalu simpan lagi.'),
    slug: z.string().trim().optional(),
    excerpt: z.string().trim().optional(),
    content: z.string().optional(),
    category: pilihanWajib(['berita', 'pengumuman', 'kegiatan', 'kesehatan'], 'Kategori belum dipilih.'),
    cover: z.coerce.number().int().positive().optional().nullable(),
    publishedDate: z.string().trim().optional(),
})

export const skemaDokter = z.object({
    nama: teksWajib('Nama dokter belum diisi.'),
    spesialisasi: teksWajib('Spesialisasi belum diisi.'),
    foto: z.coerce.number().int().positive().optional().nullable(),
    jadwalPraktik: z.string().trim().optional(),
    poli: z.string().trim().optional(),
    aktif: z.boolean().optional(),
})

export const skemaTenagaMedis = z.object({
    nama: teksWajib('Nama belum diisi.'),
    jabatan: z.string().trim().optional(),
    foto: z.coerce.number().int().positive().optional().nullable(),
    aktif: z.boolean().optional(),
})

export const skemaVaksin = z.object({
    nama: teksWajib('Nama vaksin belum diisi.'),
    jenis: z.string().trim().optional(),
    stok: angkaWajib('Stok belum diisi. Tulis angka, minimal 0.'),
    satuan: z.string().trim().optional(),
    keterangan: z.string().trim().optional(),
})

export const skemaSertifikat = z.object({
    judul: teksWajib('Judul sertifikat belum diisi.'),
    penerbit: z.string().trim().optional(),
    tanggal: z.string().trim().optional(),
    berkas: z.coerce.number().int().positive().optional().nullable(),
    keterangan: z.string().trim().optional(),
})

/** Isian bertipe daftar dikirim form sebagai satu string JSON — lihat
 *  `DaftarBaris` dan `PilihanBanyak`. JSON yang rusak hanya mungkin terjadi
 *  kalau form-nya sendiri bermasalah, jadi diperlakukan sebagai daftar kosong;
 *  isi yang salah bentuk tetap ditangkap oleh skema tiap barisnya. */
function uraiDaftar(nilai: string | undefined): unknown[] {
    if (!nilai) return []
    try {
        const hasil: unknown = JSON.parse(nilai)
        return Array.isArray(hasil) ? hasil : []
    } catch {
        return []
    }
}

function daftarJson<T extends z.ZodType>(baris: T) {
    return z.string().optional().transform(uraiDaftar).pipe(z.array(baris))
}

/** Relasi ke satu dokumen. `null` berarti sengaja dikosongkan. */
const relasiOpsional = z.coerce.number().int().positive().nullable().optional()

export const skemaFasilitas = z.object({
    nama: teksWajib('Nama fasilitas belum diisi.'),
    kategori: pilihanWajib(['ruang', 'kantor', 'alat', 'kendaraan', 'penunjang'], 'Kategori belum dipilih. Pilih salah satu.'),
    deskripsi: z.string().trim().nullish(),
    jumlah: z.coerce.number().int().min(0, 'Jumlah tidak boleh kurang dari 0.').nullable().optional(),
    foto: relasiOpsional,
    urutan: z.coerce.number().int().min(0, 'Urutan tidak boleh kurang dari 0.').optional(),
    aktif: z.boolean().optional(),
})

export const skemaLayanan = z.object({
    nama: teksWajib('Nama layanan belum diisi.'),
    slug: z.string().trim().optional(),
    induk: relasiOpsional,
    jadwal: z.string().trim().nullish(),
    kategori: pilihanWajib(['dalam-gedung', 'luar-gedung', 'posyandu'], 'Kategori belum dipilih. Pilih salah satu.'),
    deskripsi: z.string().trim().nullish(),
    persyaratan: daftarJson(
        z.object({ isi: z.string().trim().min(1, 'Ada baris syarat yang masih kosong. Isi atau hapus barisnya.') }),
    ),
    urutan: z.coerce.number().int().min(0, 'Urutan tidak boleh kurang dari 0.').optional(),
    aktif: z.boolean().optional(),
})

export const skemaPosyandu = z.object({
    nama: teksWajib('Nama posyandu belum diisi.'),
    alamat: z.string().trim().nullish(),
    layanan: daftarJson(z.coerce.number().int().positive()),
    jadwal: daftarJson(
        z.object({
            hari: z.enum(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'], {
                message: 'Ada baris jadwal yang harinya belum dipilih. Pilih hari atau hapus barisnya.',
            }),
            keterangan: z.string().trim().optional(),
        }),
    ),
    penanggungJawab: z.string().trim().nullish(),
    kontak: z.string().trim().nullish(),
    urutan: z.coerce.number().int().min(0, 'Urutan tidak boleh kurang dari 0.').optional(),
    aktif: z.boolean().optional(),
})

export const skemaJabatan = z.object({
    jabatan: teksWajib('Nama jabatan belum diisi.'),
    nama: z.string().trim().nullish(),
    foto: relasiOpsional,
    atasan: relasiOpsional,
    urutan: z.coerce.number().int().min(0, 'Urutan tidak boleh kurang dari 0.').optional(),
})

export const skemaTanggapanPengaduan = z.object({
    status: pilihanWajib(['baru', 'diproses', 'selesai'], 'Status belum dipilih.'),
    tanggapan: z.string().trim().nullish(),
})

export const skemaPengguna = z.object({
    name: teksWajib('Nama belum diisi.'),
    email: z.string({ error: 'Email belum diisi.' }).trim().email('Format email belum benar. Contoh: nama@puskesmas.go.id'),
    role: pilihanWajib(['superadmin', 'admin'], 'Peran belum dipilih.'),
    metodeLogin: pilihanWajib(METODE_LOGIN, 'Cara masuk belum dipilih.'),
    lokasi: z.string().trim().optional(),
})

/** Kalimat cadangan bila sebuah pesan lolos ke bawaan zod yang berbahasa
 *  Inggris. Semua skema di berkas ini sudah memberi pesan sendiri, jadi ini
 *  jaring pengaman untuk skema yang ditulis nanti dan lupa: staf lebih baik
 *  membaca kalimat umum berbahasa Indonesia daripada "Invalid input: expected
 *  string, received undefined". */
const PESAN_CADANGAN = 'Isian ini belum benar atau belum diisi. Periksa lagi lalu simpan.'

function pesanTerbaca(pesan: string): string {
    return /^(Invalid|Expected|Required|Too small|Too big|Unrecognized)\b/i.test(pesan)
        ? PESAN_CADANGAN
        : pesan
}

/** Ubah error zod jadi peta { namaField: pesan } untuk ditampilkan di form. */
export function petaError(error: z.ZodError): Record<string, string> {
    const hasil: Record<string, string> = {}
    for (const issue of error.issues) {
        const kunci = String(issue.path[0] ?? '_')
        if (!hasil[kunci]) hasil[kunci] = pesanTerbaca(issue.message)
    }
    return hasil
}
