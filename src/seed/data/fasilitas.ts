/** Sarana & ruangan UPTD Puskesmas Batulicin.
 *  Sumber: `data/puskesmas.md` bagian 5 (Sarana & Ruangan Pelayanan) dan
 *  bagian 3 (Ketersediaan Utilitas).
 *
 *  `jumlah` sengaja dikosongkan untuk yang di sumbernya tertulis "ada" alih-alih
 *  angka (CCTV, Wifi, Sound System, dsb) — menuliskannya sebagai 1 berarti
 *  mengarang ketelitian yang tidak ada di sumber. UI menampilkan jumlahnya hanya
 *  bila terisi. */

type FasilitasSeed = {
    nama: string
    kategori: 'ruang' | 'kantor' | 'alat' | 'kendaraan' | 'penunjang'
    jumlah?: number
    deskripsi?: string
}

export const FASILITAS: FasilitasSeed[] = [
    { nama: "Pendaftaran & Rekam Medik", kategori: 'ruang', jumlah: 1 },
    { nama: "Klaster Kesehatan Dewasa & Lansia (Pelayanan Umum)", kategori: 'ruang', jumlah: 1 },
    { nama: "Gudang Umum", kategori: 'ruang', jumlah: 1 },
    { nama: "Ruang Tunggu", kategori: 'ruang', jumlah: 1 },
    { nama: "KM/WC Pasien (terpisah L/P)", kategori: 'ruang', jumlah: 1 },
    { nama: "Pelayanan Kesehatan Ibu", kategori: 'ruang', jumlah: 1 },
    { nama: "Gawat Darurat (UGD)", kategori: 'ruang', jumlah: 1 },
    { nama: "Pelayanan Kesehatan Anak & Remaja (+ Imunisasi)", kategori: 'ruang', jumlah: 1 },
    { nama: "Keluarga Berencana", kategori: 'ruang', jumlah: 1 },
    { nama: "Kesehatan Gigi & Mulut", kategori: 'ruang', jumlah: 1 },
    { nama: "Geriatri (Usila)", kategori: 'ruang', jumlah: 1 },
    { nama: "Apotek", kategori: 'ruang', jumlah: 1 },
    { nama: "Gudang Obat", kategori: 'ruang', jumlah: 1 },
    { nama: "Penyimpanan Vaksin", kategori: 'ruang', jumlah: 1 },
    { nama: "Laboratorium Medis", kategori: 'ruang', jumlah: 1 },
    { nama: "KM/WC Petugas", kategori: 'ruang', jumlah: 1 },
    { nama: "Klaster Penanggulangan Penyakit Menular & Kesling", kategori: 'ruang', jumlah: 1 },
    { nama: "ASI / Laktasi", kategori: 'ruang', jumlah: 1 },
    { nama: "KIE / Promosi Kesehatan", kategori: 'ruang', jumlah: 1 },
    { nama: "KM/WC Persalinan", kategori: 'ruang', jumlah: 1 },
    { nama: "Persalinan", kategori: 'ruang', jumlah: 1 },
    { nama: "Rawat Pasca Persalinan", kategori: 'ruang', jumlah: 1 },
    { nama: "Istirahat Petugas", kategori: 'ruang', jumlah: 1 },
    { nama: "Infeksius (TB/HIV)", kategori: 'ruang', jumlah: 1 },
    { nama: "Tindakan", kategori: 'ruang', jumlah: 1 },
    { nama: "Fisioterapi", kategori: 'ruang', jumlah: 1 },
    { nama: "Pelayanan Kesehatan Tradisional", kategori: 'ruang', jumlah: 1 },
    { nama: "Laboratorium Lingkungan", kategori: 'ruang', jumlah: 1 },
    { nama: "Cuci Linen", kategori: 'ruang', jumlah: 1 },
    { nama: "Jaga Perawat / Nurse Station", kategori: 'ruang', jumlah: 1 },
    { nama: "Ruang Kepala Puskesmas", kategori: 'kantor', jumlah: 1 },
    { nama: "Ruang Rapat/Diskusi", kategori: 'kantor', jumlah: 1 },
    { nama: "Ruang Administrasi", kategori: 'kantor', jumlah: 1 },
    { nama: "Parkir Roda 4", kategori: 'penunjang', jumlah: 1 },
    { nama: "Parkir Roda 2", kategori: 'penunjang', jumlah: 1 },
    { nama: "Parkir Ambulance", kategori: 'penunjang', jumlah: 1 },
    { nama: "Ruang Sanitasi", kategori: 'penunjang', jumlah: 1 },
    { nama: "Rumah Dinas Tenaga Kesehatan II", kategori: 'penunjang', jumlah: 1 },
    { nama: "Parkir Pusling Darat", kategori: 'penunjang', jumlah: 1 },
    { nama: "Ruang Jaga Dokter/Perawat", kategori: 'penunjang', jumlah: 1 },
    { nama: "Air Minum", kategori: 'penunjang', jumlah: 1 },
    { nama: "Buku Register Pengaduan Masyarakat", kategori: 'penunjang', jumlah: 1 },
    { nama: "Buku Tamu Umum", kategori: 'penunjang', jumlah: 1 },
    { nama: "Denah Jalur Evakuasi", kategori: 'penunjang', jumlah: 1 },
    { nama: "Kipas Angin Ruang Tunggu", kategori: 'penunjang', jumlah: 2 },
    { nama: "Kursi Roda", kategori: 'penunjang', jumlah: 1 },
    { nama: "Kursi Tunggu", kategori: 'penunjang', jumlah: 12 },
    { nama: "Loket Khusus (Disabilitas, Lansia, Balita, Bumil)", kategori: 'penunjang', jumlah: 1 },
    { nama: "Mesin Antrian", kategori: 'penunjang', jumlah: 1 },
    { nama: "P3K", kategori: 'penunjang', jumlah: 1 },
    { nama: "Pengisi Daya (Charging Station)", kategori: 'penunjang', jumlah: 1 },
    { nama: "Petugas Front Office", kategori: 'penunjang' },
    { nama: "Pintu Masuk", kategori: 'penunjang', jumlah: 1 },
    { nama: "Printer & Fotocopy", kategori: 'penunjang', jumlah: 1 },
    { nama: "Ruang Ibadah", kategori: 'penunjang', jumlah: 1 },
    { nama: "Toilet Wanita + Handrail", kategori: 'penunjang', jumlah: 2 },
    { nama: "Toilet Pria + Handrail", kategori: 'penunjang', jumlah: 2 },
    { nama: "Wastafel", kategori: 'penunjang', jumlah: 2 },
    { nama: "CCTV", kategori: 'penunjang' },
    { nama: "Freestanding Handrail", kategori: 'penunjang' },
    { nama: "Layanan Pengaduan", kategori: 'penunjang' },
    { nama: "Sound System", kategori: 'penunjang' },
    { nama: "Televisi (info kesehatan)", kategori: 'penunjang' },
    { nama: "Lahan Parkir", kategori: 'penunjang' },
    { nama: "Titik Kumpul", kategori: 'penunjang' },
    { nama: "Wifi", kategori: 'penunjang' },
    { nama: "Air Bersih (PDAM)", kategori: 'penunjang', deskripsi: "Tersedia sepanjang tahun, sumber dari PDAM." },
    { nama: "Listrik (PLN)", kategori: 'penunjang', deskripsi: "Tersedia 24 jam, sumber dari PLN." },
]
