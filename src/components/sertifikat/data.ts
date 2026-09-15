export type DokumenSertifikat = {
    file: string;
    kategori: "akreditasi" | "penghargaan";
    judul: string;
    penerbit: string;
    tahun: number;
    tanggal?: string;
    predikat: string;
};

// Metadata dari isi dokumen. Piagam lomba mutu bukan penetapan akreditasi.
const penerbit = "Dinas Kesehatan Kabupaten Tanah Bumbu";
export const dokumenSertifikat: DokumenSertifikat[] = [
    { file: "PHOTO-2025-12-15-15-07-23(4).webp", kategori: "penghargaan", judul: "Lomba Mutu Terbaik Puskesmas", penerbit, tahun: 2025, predikat: "Juara Pertama" },
    { file: "PHOTO-2025-12-15-15-07-23(1).webp", kategori: "penghargaan", judul: "Puskesmas Pandu PTM", penerbit, tahun: 2025, tanggal: "12 Desember 2025", predikat: "Terbaik I" },
    { file: "PHOTO-2025-12-15-15-07-23(2).webp", kategori: "penghargaan", judul: "Pelayanan Kesehatan Penderita Hipertensi", penerbit, tahun: 2025, predikat: "Terbaik I" },
    { file: "PHOTO-2025-12-15-15-07-23(3).webp", kategori: "penghargaan", judul: "Inputan ASIK Tertinggi Imunisasi HPV", penerbit, tahun: 2025, predikat: "Terbaik I" },
    { file: "PHOTO-2025-12-15-15-07-23(5).webp", kategori: "penghargaan", judul: "Pelayanan Kesehatan pada Usia Produktif", penerbit, tahun: 2025, predikat: "Terbaik I" },
    { file: "PHOTO-2025-12-15-15-07-23(6).webp", kategori: "penghargaan", judul: "Pelayanan Kesehatan pada Usia Lanjut", penerbit, tahun: 2025, predikat: "Terbaik I" },
    { file: "PHOTO-2025-12-15-15-07-23(7).webp", kategori: "penghargaan", judul: "Capaian Cek Kesehatan Gratis (CKG)", penerbit, tahun: 2025, predikat: "Terbaik I" },
    { file: "PHOTO-2025-12-15-15-07-23.webp", kategori: "penghargaan", judul: "Indeks Pelayanan Publik (IPP)", penerbit, tahun: 2025, predikat: "Terbaik III" },
    { file: "PHOTO-2025-12-15-15-07-23(8).webp", kategori: "penghargaan", judul: "Penerapan Rekam Medis Elektronik (RME)", penerbit, tahun: 2025, predikat: "Terbaik III" },
];

export function urlDokumen(file: string) {
    return `/piagamSertifikatWebp/${encodeURIComponent(file)}`;
}
