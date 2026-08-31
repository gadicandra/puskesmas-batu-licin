import { z } from 'zod'

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

export const skemaPengguna = z.object({
    name: z.string().trim().min(1, 'Nama belum diisi.'),
    email: z.string().trim().email('Format email belum benar. Contoh: nama@puskesmas.go.id'),
    role: z.enum(['superadmin', 'admin']),
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
