import { z } from 'zod'
import { METODE_LOGIN } from './metode-login'

/** Pesan validasi ditulis dalam bahasa sehari-hari dan selalu memberi tahu
 *  cara memperbaiki — bukan sekadar menyatakan ada yang salah.
 *  Lihat docs/DASHBOARD.md §2 prinsip 5. */

export const skemaArtikel = z.object({
    title: z.string().trim().min(1, 'Judul belum diisi. Isi judul artikel lalu simpan lagi.'),
    slug: z.string().trim().optional(),
    excerpt: z.string().trim().optional(),
    content: z.string().optional(),
    category: z.enum(['berita', 'pengumuman', 'kegiatan', 'kesehatan']),
    cover: z.coerce.number().int().positive().optional().nullable(),
    publishedDate: z.string().trim().optional(),
})

export const skemaDokter = z.object({
    nama: z.string().trim().min(1, 'Nama dokter belum diisi.'),
    spesialisasi: z.string().trim().min(1, 'Spesialisasi belum diisi.'),
    foto: z.coerce.number().int().positive().optional().nullable(),
    jadwalPraktik: z.string().trim().optional(),
    poli: z.string().trim().optional(),
    aktif: z.boolean().optional(),
})

export const skemaTenagaMedis = z.object({
    nama: z.string().trim().min(1, 'Nama belum diisi.'),
    jabatan: z.string().trim().optional(),
    foto: z.coerce.number().int().positive().optional().nullable(),
    aktif: z.boolean().optional(),
})

export const skemaVaksin = z.object({
    nama: z.string().trim().min(1, 'Nama vaksin belum diisi.'),
    jenis: z.string().trim().optional(),
    stok: z.coerce.number().int().min(0, 'Stok tidak boleh kurang dari 0.'),
    satuan: z.string().trim().optional(),
    keterangan: z.string().trim().optional(),
})

export const skemaSertifikat = z.object({
    judul: z.string().trim().min(1, 'Judul sertifikat belum diisi.'),
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
    nama: z.string().trim().min(1, 'Nama fasilitas belum diisi.'),
    kategori: z.enum(['ruang', 'kantor', 'alat', 'kendaraan', 'penunjang']),
    deskripsi: z.string().trim().nullish(),
    jumlah: z.coerce.number().int().min(0, 'Jumlah tidak boleh kurang dari 0.').nullable().optional(),
    foto: relasiOpsional,
    urutan: z.coerce.number().int().min(0, 'Urutan tidak boleh kurang dari 0.').optional(),
    aktif: z.boolean().optional(),
})

export const skemaLayanan = z.object({
    nama: z.string().trim().min(1, 'Nama layanan belum diisi.'),
    slug: z.string().trim().optional(),
    induk: relasiOpsional,
    jadwal: z.string().trim().nullish(),
    kategori: z.enum(['dalam-gedung', 'luar-gedung', 'posyandu']),
    deskripsi: z.string().trim().nullish(),
    persyaratan: daftarJson(
        z.object({ isi: z.string().trim().min(1, 'Ada baris syarat yang masih kosong. Isi atau hapus barisnya.') }),
    ),
    urutan: z.coerce.number().int().min(0, 'Urutan tidak boleh kurang dari 0.').optional(),
    aktif: z.boolean().optional(),
})

export const skemaPosyandu = z.object({
    nama: z.string().trim().min(1, 'Nama posyandu belum diisi.'),
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
    jabatan: z.string().trim().min(1, 'Nama jabatan belum diisi.'),
    nama: z.string().trim().nullish(),
    foto: relasiOpsional,
    atasan: relasiOpsional,
    urutan: z.coerce.number().int().min(0, 'Urutan tidak boleh kurang dari 0.').optional(),
})

export const skemaTanggapanPengaduan = z.object({
    status: z.enum(['baru', 'diproses', 'selesai']),
    tanggapan: z.string().trim().nullish(),
})

export const skemaPengguna = z.object({
    name: z.string().trim().min(1, 'Nama belum diisi.'),
    email: z.string().trim().email('Format email belum benar. Contoh: nama@puskesmas.go.id'),
    role: z.enum(['superadmin', 'admin']),
    metodeLogin: z.enum(METODE_LOGIN),
    lokasi: z.string().trim().optional(),
})

/** Ubah error zod jadi peta { namaField: pesan } untuk ditampilkan di form. */
export function petaError(error: z.ZodError): Record<string, string> {
    const hasil: Record<string, string> = {}
    for (const issue of error.issues) {
        const kunci = String(issue.path[0] ?? '_')
        if (!hasil[kunci]) hasil[kunci] = issue.message
    }
    return hasil
}
